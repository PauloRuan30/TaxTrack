from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO

app = FastAPI()

# Configure CORS to allow connections from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define expected column structure
expected_columns = [
    "Column_1", "Column_2", "Column_3", "Column_4", "Column_5", 
    "Column_6", "Column_7", "Column_8", "Column_9", "Column_10", 
    "Column_11", "Column_12", "Column_13", "Column_14", "Column_15"
]

@app.post("/upload/")
async def upload_files(files: list[UploadFile] = File(...)):
    all_data = []
    file_details = []

    for file in files:
        # Validate that the file is a .txt file
        if not file.filename.endswith(".txt"):
            raise HTTPException(status_code=400, detail="Only .txt files are allowed.")
        
        content = await file.read()
        content_str = content.decode('utf-8', errors='ignore')
        lines = content_str.strip().split('\n')

        parsed_data = []
        for line in lines:
            # Remove leading | if present
            if line.startswith('|'):
                line = line[1:]
            # Split by |
            fields = line.split('|')
            # Validate if line has correct number of columns
            if len(fields) != len(expected_columns):
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid format in file {file.filename}. Expected {len(expected_columns)} columns, found {len(fields)} in a line."
                )
            parsed_data.append(fields)
        
        # Convert to DataFrame and add headers
        df = pd.DataFrame(parsed_data, columns=expected_columns)
        df['source_file'] = file.filename  # Add a column with the filename for traceability
        all_data.append(df)
        file_details.append({"filename": file.filename, "rows": len(df)})

    # Combine all DataFrames if there is any data
    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        # Convert to CSV format
        csv_buffer = StringIO()
        combined_df.to_csv(csv_buffer, index=False)
        csv_content = csv_buffer.getvalue()
        # Convert to JSON format
        json_data = combined_df.to_dict(orient='records')
        return {"files": file_details, "data": json_data}
    else:
        return {"files": [], "data": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
