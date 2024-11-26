# Import necessary modules
from fastapi import FastAPI, UploadFile, File  # FastAPI framework and file handling utilities
from fastapi.middleware.cors import CORSMiddleware  # Middleware for handling CORS (Cross-Origin Resource Sharing)
from typing import List  # Type hinting for list
import io  # Utility for handling streams
import json  # For data serialization and manipulation
import chardet  # Library for detecting file encoding

# Create a FastAPI app instance
app = FastAPI()

# Configure CORS middleware to allow requests from specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from this frontend URL
    allow_credentials=True,                  # Allow cookies/credentials
    allow_methods=["*"],                     # Allow all HTTP methods
    allow_headers=["*"],                     # Allow all HTTP headers
)

# Function to detect file encoding
def detect_encoding(content: bytes) -> str:
    result = chardet.detect(content)  # Use chardet to detect encoding of the file
    return result['encoding'] or 'latin1'  # Return detected encoding or fallback to 'latin1'

# Function to parse a .txt file's content
def parse_txt_file(file_content: str) -> List[List[str]]:
    """
    Parses the file content and extracts meaningful rows and fields.
    - Skips empty lines and lines after the '|9999|' marker.
    - Cleans unnecessary characters from fields.
    """
    data = []
    found_end = False  # Flag to ignore lines after encountering '|9999|'
    
    for line in file_content.split('\n'):  # Process file line by line
        if not line.strip():  # Skip empty lines
            continue
            
        if line.strip().startswith('|9999|'):  # Marker indicating the end of relevant data
            found_end = True
            continue
            
        if found_end:  # Skip lines after the end marker
            continue
            
        # Split the line into fields using '|' as a delimiter
        fields = line.strip('|').split('|')
        row = []
        
        # Clean fields to remove unwanted characters (like null bytes)
        for field in fields:
            cleaned_field = field.strip().replace('\x00', '')  # Remove null bytes
            row.append(cleaned_field)
            
        if any(row):  # Add non-empty rows to the data
            data.append(row)
    
    return data  # Return the parsed data as a list of lists

# Function to convert parsed data to a specific sheet format
def convert_to_fortune_sheet_format(parsed_data: List[List[str]]) -> dict:
    """
    Converts parsed data into a Fortune-sheet-compatible format, with structured rows and cells.
    """
    sheet_data = []
    max_cols = 0  # To track the maximum number of columns

    # Determine the maximum number of columns
    for row in parsed_data:
        max_cols = max(max_cols, len(row))

    celldata = []  # Array to store cell information
    for row_idx, row in enumerate(parsed_data):
        for col_idx, value in enumerate(row):
            if value:  # Add only non-empty cells
                cell_data = {
                    "r": row_idx,  # Row index
                    "c": col_idx,  # Column index
                    "v": value,    # Value of the cell
                    "m": value,    # Displayed text (same as value here)
                    "ct": {        # Cell type
                        "fa": "General",  # Format
                        "t": "g"         # General type
                    },
                    "bg": None,         # No background color
                    "ff": "Arial",      # Font family
                    "fs": 10,           # Font size
                    "bl": 0,            # Bold flag
                    "it": 0,            # Italic flag
                    "ul": 0,            # Underline flag
                    "st": 0,            # Strikethrough flag
                }
                celldata.append(cell_data)  # Add cell data to the list

    # Return a dictionary representing the sheet
    return {
        "name": "Sheet1",               # Sheet name
        "status": 1,                    # Status (active sheet)
        "order": 0,                     # Order in the workbook
        "row": len(parsed_data),        # Number of rows
        "column": max_cols,             # Number of columns
        "celldata": celldata,           # All cells data
        "config": {                     # Configuration
            "authority": {"sheet": 0, "cell": 0},  # Access permissions
            "merge": {},                 # No merged cells by default
            "rowlen": {},                # Default row heights
            "columnlen": {},             # Default column widths
            "customWidth": {},           # No custom widths
            "customHeight": {},          # No custom heights
        },
        "scrollTop": 0,                  # Initial vertical scroll position
        "scrollLeft": 0,                 # Initial horizontal scroll position
        "luckysheet_select_save": [{     # Initial selection
            "row": [0, 0],
            "column": [0, 0]
        }],
        "defaultRowHeight": 25,          # Default row height
        "defaultColWidth": 100,          # Default column width
    }

# Endpoint to upload and process files
@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handles file uploads, processes each file, and returns formatted data or errors.
    """
    result = {
        "data": [],  # Successful file processing results
        "errors": []  # Errors encountered during processing
    }
    
    for file in files:
        try:
            content = await file.read()  # Read the file's content as bytes
            encoding = detect_encoding(content)  # Detect the file's encoding
            
            # Decode the content using the detected encoding
            try:
                text_content = content.decode(encoding)
            except UnicodeDecodeError:  # Fallback to 'latin1' if decoding fails
                text_content = content.decode('latin1')
            
            parsed_data = parse_txt_file(text_content)  # Parse the file content
            
            if not parsed_data:  # If no valid data was found
                result["errors"].append(f"No valid data found in {file.filename}")
                continue
                
            fortune_sheet_data = convert_to_fortune_sheet_format(parsed_data)  # Convert to sheet format
            result["data"].append(fortune_sheet_data)  # Add to the result data
            
        except Exception as e:  # Handle errors during file processing
            result["errors"].append(f"Error processing {file.filename}: {str(e)}")
            continue
    
    return result  # Return the result containing data and errors
