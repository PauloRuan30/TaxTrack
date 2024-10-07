import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Por favor, selecione pelo menos um arquivo.");
      return;
    }

    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFileDetails(response.data.files);
      setTableData(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao fazer o upload dos arquivos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Sistema de Inteligência Fiscal Brasileira</h1>
        
        <div className="mb-4">
          <input
            type="file"
            multiple
            accept=".txt"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
        </div>
        
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enviar
        </button>

        {fileDetails.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Detalhes dos Arquivos</h2>
            <ul className="list-disc list-inside">
              {fileDetails.map((file, index) => (
                <li key={index}>{file.filename} - {file.rows} linhas</li>
              ))}
            </ul>
          </div>
        )}

        {tableData.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2">Dados Convertidos</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  {Object.keys(tableData[0]).map((key, index) => (
                    <th key={index} className="py-2 px-4 border-b">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="py-2 px-4 border-b">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
