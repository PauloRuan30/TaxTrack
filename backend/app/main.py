from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO

# Initialize the FastAPI application
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing) to allow connections from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in production for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_files(files: list[UploadFile] = File(...)):
    all_data = []  # To store DataFrames of all uploaded files
    file_details = []  # To store details of each file uploaded

    for file in files:
        # Check if the uploaded file is a .txt file
        if not file.filename.endswith(".txt"):
            raise HTTPException(status_code=400, detail="Apenas arquivos .txt são permitidos.")
        
        # Read the content of the file
        content = await file.read()
        content_str = content.decode('utf-8', errors='ignore')  # Decode with UTF-8
        lines = content_str.strip().split('\n')  # Split the content into lines
        
        parsed_data = []  # To hold parsed lines from the file
        for line in lines:
            # Remove the initial '|' character if present
            if line.startswith('|'):
                line = line[1:]
            # Split the line by '|'
            fields = line.split('|')
            if fields:
                parsed_data.append(fields)  # Add fields to the parsed data

        # Convert parsed data to a DataFrame
        df = pd.DataFrame(parsed_data)
        df['source_file'] = file.filename  # Add a column for the filename
        all_data.append(df)  # Append the DataFrame to the list of all data
        file_details.append({"filename": file.filename, "rows": len(df)})  # Append file details

    # If any data was collected from files
    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)  # Combine all DataFrames into one
        # Convert combined DataFrame to CSV format
        csv_buffer = StringIO()
        combined_df.to_csv(csv_buffer, index=False)
        csv_content = csv_buffer.getvalue()  # Get the CSV content as a string
        # Convert combined DataFrame to JSON format
        json_data = combined_df.to_dict(orient='records')
        return {"files": file_details, "data": json_data}  # Return file details and data
    else:
        return {"files": [], "data": []}  # Return empty lists if no data

# Main entry point for running the app
if __name__ == "__main__":
    import uvicorn
    # Run the application on host 0.0.0.0 and port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
