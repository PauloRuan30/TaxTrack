from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO

app = FastAPI()

# Configurar CORS para permitir conexões do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Altere para o domínio do frontend em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_files(files: list[UploadFile] = File(...)):
    all_data = []
    file_details = []

    for file in files:
        if not file.filename.endswith(".txt"):
            raise HTTPException(status_code=400, detail="Apenas arquivos .txt são permitidos.")
        
        content = await file.read()
        content_str = content.decode('utf-8', errors='ignore')
        lines = content_str.strip().split('\n')
        
        parsed_data = []
        for line in lines:
            # Remover o caractere inicial se for |
            if line.startswith('|'):
                line = line[1:]
            # Dividir por |
            fields = line.split('|')
            if fields:
                parsed_data.append(fields)
        
        # Converter para DataFrame
        df = pd.DataFrame(parsed_data)
        df['source_file'] = file.filename  # Adicionar coluna com o nome do arquivo
        all_data.append(df)
        file_details.append({"filename": file.filename, "rows": len(df)})

    if all_data:
        combined_df = pd.concat(all_data, ignore_index=True)
        # Converter para CSV
        csv_buffer = StringIO()
        combined_df.to_csv(csv_buffer, index=False)
        csv_content = csv_buffer.getvalue()
        # Converter para JSON
        json_data = combined_df.to_dict(orient='records')
        return {"files": file_details, "data": json_data}
    else:
        return {"files": [], "data": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
