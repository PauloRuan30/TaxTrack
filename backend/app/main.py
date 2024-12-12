from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import chardet
import re
from headers_config import BlockHeaders  

# Create FastAPI application instance
app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_encoding(content: bytes) -> str:
    """
    Detect the encoding of the file content using chardet.
    """
    result = chardet.detect(content)
    return result.get("encoding", "latin1")

def parse_txt_file(file_content: str) -> Dict[str, List[List[str]]]:
    """
    Parse the file content and group rows by their block type.
    """
    grouped_data: Dict[str, List[List[str]]] = {}
    lines = file_content.splitlines()

    for line in lines:
        if not line.strip():  # Skip empty lines
            continue

        cleaned_line = line.strip('|')  # Remove leading and trailing '|'
        fields = cleaned_line.split('|')

        if fields and re.match(r'^[A-Z0-9]{4}$', fields[0]):  # Check valid block type
            block_type = fields[0]
            grouped_data.setdefault(block_type, []).append(fields)

    return grouped_data

def get_headers_for_block(block_type: str) -> List[str]:
    """
    Get column headers based on the BlockHeaders configuration
    
    Args:
        block_type (str): The block type to retrieve headers for
    
    Returns:
        List[str]: List of headers for the specified block type
    """
    return BlockHeaders.get_headers(block_type)

def convert_to_fortune_sheet_format(grouped_data: Dict[str, List[List[str]]], priority_blocks: List[str]) -> List[Dict[Any, Any]]:
    sheets = []

    def create_sheet(block_type: str, data: List[List[str]], order: int) -> Dict:
        headers = get_headers_for_block(block_type)
        if headers:
            data.insert(0, headers)

        celldata = []
        for row_idx, row in enumerate(data):
            for col_idx, value in enumerate(row):
                # More robust cell data handling
                cell_entry = {
                    "r": row_idx,
                    "c": col_idx,
                    "v": str(value).strip() if value is not None else '',
                    "m": str(value).strip() if value is not None else '',
                    "ct": {"fa": "General", "t": "g"},
                    # Remove 'bg' style to avoid potential conflicts
                    "style": None  # Only add style if absolutely necessary
                }
                celldata.append(cell_entry)

        return {
            "name": f"{block_type}",
            "status": 1,
            "order": order,
            "row": len(data),
            "column": max(len(row) for row in data),
            "celldata": celldata,
            "config": {
                "authority": {"sheet": 0, "cell": 0},
                "merge": {},
                "rowlen": {},
                "columnlen": {},
            },
        }

    # Rest of the function remains the same
    order = 0
    processed_blocks = set()

    # Process blocks in the order of priority_blocks
    for block_type in priority_blocks:
        if block_type in grouped_data:
            sheets.append(create_sheet(block_type, grouped_data[block_type], order))
            processed_blocks.add(block_type)
            order += 1

    # Add remaining blocks in grouped_data that were not in priority_blocks
    for block_type, data in grouped_data.items():
        if block_type not in processed_blocks:
            sheets.append(create_sheet(block_type, data, order))
            order += 1

    return sheets  

@app.post("/upload/")

async def upload_files(files: List[UploadFile] = File(...)):
    """
    Handle file uploads and return formatted data in Fortune-sheet format.
    """
    result = {"data": [], "errors": []}

    # You can now dynamically generate priority blocks from the configuration
    priority_blocks = BlockHeaders.get_all_block_types()

    for file in files:
        try:
            content = await file.read()

            # Detect and decode encoding
            encoding = detect_encoding(content)
            text_content = content.decode(encoding, errors="ignore")

            # Parse the file
            grouped_data = parse_txt_file(text_content)

            # Convert parsed data to Fortune-sheet format
            fortune_sheet_data = convert_to_fortune_sheet_format(grouped_data, priority_blocks)
            result["data"].extend(fortune_sheet_data)

        except Exception as e:
            result["errors"].append({"filename": file.filename, "error": str(e)})

    return result
