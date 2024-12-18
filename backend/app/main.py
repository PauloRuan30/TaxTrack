# Import necessary libraries and modules
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from fastapi.responses import StreamingResponse
from io import StringIO
import chardet
import re
from headers_config import BlockHeaders  # Import block headers configuration

# Create FastAPI application instance
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing) middleware to allow communication with specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow requests from localhost:3000
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

def detect_encoding(content: bytes) -> str:
    """
    Detect the encoding of the file content using chardet.
    """
    result = chardet.detect(content)  # Detect the file's encoding using the chardet library
    return result.get("encoding", "latin1")  # Return the detected encoding, defaulting to 'latin1' if not found

def parse_txt_file(file_content: str) -> Dict[str, List[List[str]]]:
    """
    Parse the file content and group rows by their block type.
    """
    grouped_data: Dict[str, List[List[str]]] = {}  # Initialize an empty dictionary to hold grouped data
    lines = file_content.splitlines()  # Split the file content into lines

    for line in lines:
        if not line.strip():  # Skip empty lines
            continue

        cleaned_line = line.strip('|')  # Remove leading and trailing '|' characters
        fields = cleaned_line.split('|')  # Split the line into fields by '|'

        if fields and re.match(r'^[A-Z0-9]{4}$', fields[0]):  # Check if the first field is a valid block type
            block_type = fields[0]  # Use the first field as the block type
            grouped_data.setdefault(block_type, []).append(fields)  # Group data by block type

    return grouped_data  # Return the grouped data

def get_headers_for_block(block_type: str) -> List[str]:
    """
    Get column headers based on the BlockHeaders configuration
    
    Args:
        block_type (str): The block type to retrieve headers for
    
    Returns:
        List[str]: List of headers for the specified block type
    """
    return BlockHeaders.get_headers(block_type)  # Retrieve headers for the block type from BlockHeaders configuration

def convert_to_fortune_sheet_format(grouped_data: Dict[str, List[List[str]]], priority_blocks: List[str]) -> List[Dict[Any, Any]]:
    """
    Convert grouped data into Fortune sheet format with proper headers and cell data.
    """
    sheets = []  # Initialize an empty list to store the sheets

    # Helper function to create a sheet for a given block type
    def create_sheet(block_type: str, data: List[List[str]], order: int) -> Dict:
        headers = get_headers_for_block(block_type)  # Retrieve headers for the block type
        if headers:
            data.insert(0, headers)  # Insert the headers as the first row of data

        celldata = []  # Initialize an empty list to store cell data
        for row_idx, row in enumerate(data):  # Loop through rows in the data
            for col_idx, value in enumerate(row):  # Loop through columns in the row
                # Create a dictionary for each cell entry with relevant details
                cell_entry = {
                    "r": row_idx,  # Row index
                    "c": col_idx,  # Column index
                    "v": str(value).strip() if value is not None else '',  # Value of the cell, stripped of extra whitespace
                    "m": str(value).strip() if value is not None else '',  # Same as 'v', used for display
                    "ct": {"fa": "General", "t": "g"},  # Cell type (general format)
                    "style": None  # No styling by default
                }
                celldata.append(cell_entry)  # Add cell entry to the list

        # Return a dictionary representing the sheet
        return {
            "name": f"{block_type}",  # Name of the block (e.g., block type)
            "status": 1,  # Status (active)
            "order": order,  # Order in the sheet list
            "row": len(data),  # Number of rows in the data
            "column": max(len(row) for row in data),  # Maximum number of columns in the data
            "celldata": celldata,  # Cell data
            "config": {
                "authority": {"sheet": 0, "cell": 0},
                "merge": {},
                "rowlen": {},
                "columnlen": {},
            },
        }

    order = 0  # Initialize order for sheet processing
    processed_blocks = set()  # Initialize a set to track processed blocks

    # Process blocks in the order of priority_blocks
    for block_type in priority_blocks:
        if block_type in grouped_data:  # Check if the block type is present in the grouped data
            sheets.append(create_sheet(block_type, grouped_data[block_type], order))  # Add the sheet
            processed_blocks.add(block_type)  # Mark block as processed
            order += 1  # Increment order

    # Add remaining blocks in grouped_data that were not in priority_blocks
    for block_type, data in grouped_data.items():
        if block_type not in processed_blocks:
            sheets.append(create_sheet(block_type, data, order))  # Add sheet for unprocessed block
            order += 1  # Increment order

    return sheets  # Return the list of sheets

@app.post("/export/")
async def export_data(data: Dict[str, List[Dict[Any, Any]]]):
    """
    Export data back to the original txt file format.
    
    Args:
        data (Dict): Dictionary containing sheet data from Fortune sheets
    
    Returns:
        StreamingResponse: A text file with the exported data
    """
    output = StringIO()  # Create an in-memory string buffer to write output

    # Sort sheets to ensure consistent order based on 'order' field
    sorted_sheets = sorted(data.get('data', []), key=lambda x: x.get('order', 0))
    
    for sheet in sorted_sheets:
        block_type = sheet['name']  # Get the block type from sheet name
        
        rows = {}  # Initialize a dictionary to store rows
        for cell in sheet.get('celldata', []):  # Loop through the cell data in the sheet
            r = cell['r']  # Row index
            c = cell['c']  # Column index
            value = cell['v']  # Cell value
            
            if r not in rows:
                # Initialize a new row if not already present
                rows[r] = [''] * (max(cell['c'] for cell in sheet['celldata']) + 1)
            
            rows[r][c] = value  # Assign value to the appropriate row and column
        
        # Write the formatted rows to the output string
        for row in sorted(rows.values()):
            # Ensure each row starts and ends with a '|'
            formatted_row = '|' + '|'.join(str(val).strip() for val in row) + '|\n'
            output.write(formatted_row)  # Write formatted row to output

    output.seek(0)  # Reset stream position to the beginning

    # Return the result as a downloadable text file
    return StreamingResponse(
        output, 
        media_type="text/plain",  # Set media type to plain text
        headers={
            "Content-Disposition": "attachment; filename=export.txt"  # Provide the filename for download
        }
    )

@app.post("/upload/")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handle file uploads and return formatted data in Fortune-sheet format.
    Combines records from multiple files, adding a file source column.
    """
    result = {"data": [], "errors": []}  # Initialize the result dictionary with data and error lists

    # Dynamically generate priority blocks from the configuration
    priority_blocks = BlockHeaders.get_all_block_types()

    # Dictionary to consolidate grouped data across files
    consolidated_grouped_data: Dict[str, List[List[str]]] = {}

    for file in files:
        try:
            content = await file.read()  # Read the content of the uploaded file

            # Detect and decode encoding
            encoding = detect_encoding(content)  # Detect file encoding
            text_content = content.decode(encoding, errors="ignore")  # Decode the file content

            # Parse the file into grouped data by block type
            grouped_data = parse_txt_file(text_content)

            # Consolidate data across files
            for block_type, block_data in grouped_data.items():
                # Add file source as the first column
                annotated_block_data = [
                    row + [file.filename] for row in block_data
                ]
                
                # Merge with existing consolidated data
                if block_type not in consolidated_grouped_data:
                    consolidated_grouped_data[block_type] = annotated_block_data
                else:
                    consolidated_grouped_data[block_type].extend(annotated_block_data)

        except Exception as e:
            result["errors"].append({"filename": file.filename, "error": str(e)})  # Capture errors

    # Modify get_headers_for_block to include file source column
    def get_headers_for_block(block_type: str) -> List[str]:
        """
        Get column headers based on the BlockHeaders configuration, 
        adding a file source column
        """
        headers = BlockHeaders.get_headers(block_type)
        return headers + ['File Source'] if headers else ['File Source']

    # Convert the consolidated grouped data to Fortune-sheet format
    fortune_sheet_data = convert_to_fortune_sheet_format(
        consolidated_grouped_data, 
        priority_blocks
    )
    result["data"].extend(fortune_sheet_data)  # Add the formatted data to the result

    return result  # Return the result containing the formatted data and any errors
