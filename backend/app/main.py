from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
import re

app = FastAPI()

# CORS settings for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def validate_line_format(line: str) -> bool:
    """Checks if a line starts and ends with '|' and contains valid piped data."""
    return bool(re.match(r"^\|(.+?)\|$", line))

@app.post("/upload/")
async def upload_files(files: list[UploadFile] = File(...)):
    all_data = []
    file_details = []
    errors = []

    for file in files:
        # Step 1: Validate file extension
        if not file.filename.endswith(".txt"):
            errors.append({"filename": file.filename, "error": "Invalid file type. Only .txt files are allowed."})
            continue  # Skip to the next file

        # Step 2: Read file content
        content = await file.read()
        content_str = content.decode('utf-8', errors='ignore')

        # Step 3: Split content into lines and filter relevant data lines
        lines = content_str.strip().split('\n')
        parsed_data = []

        for line_number, line in enumerate(lines, start=1):
            line = line.strip()

            # Skip and don't log empty lines
            if not line:
                continue

            # Validate format and log an error if it fails
            if not validate_line_format(line):
                errors.append({
                    "filename": file.filename,
                    "line_number": line_number,
                    "error": "Invalid line format. Expected line to start and end with '|'.",
                    "content": line
                })
                continue  # Skip to the next line

            # Parse line and remove starting and ending '|'
            fields = line[1:-1].split('|')
            if fields:
                parsed_data.append(fields)

        # Step 4: Convert parsed data to DataFrame and add filename
        if parsed_data:
            df = pd.DataFrame(parsed_data)
            df['source_file'] = file.filename  # Add file identifier column
            all_data.append(df)
            file_details.append({"filename": file.filename, "rows": len(df)})

    if all_data:
        # Combine all DataFrames into one and convert to JSON
        combined_df = pd.concat(all_data, ignore_index=True)
        json_data = combined_df.to_dict(orient='records')
        
        # Prepare response
        return {"files": file_details, "data": json_data, "errors": errors}
    
    # Include structured error details even when some data is present
    return {"files": file_details, "data": [], "errors": errors}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
