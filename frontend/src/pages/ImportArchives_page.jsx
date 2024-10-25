import React, { useState } from "react";
import axios from "axios";

// Component for file type selection
const FileTypeSelection = () => (
  <div className="flex justify-center gap-3 my-6">
    <div className="flex items-center px-6 py-3">
      <input
        type="checkbox"
        className="border-2 border-gray-900 rounded-md w-6 h-6 mr-3"
      />
      <span className="text-center text-gray-900 text-2xl font-medium">
        EFD ICMS
      </span>
    </div>
    <div className="flex items-center px-6 py-3">
      <input
        type="checkbox"
        className="bg-[#34808c] border-2 border-[#34808c] w-6 h-6 rounded-md mr-3"
      />
      <span className="text-center text-gray-900 text-2xl font-medium">
        EFD Contribuições
      </span>
    </div>
  </div>
);

// Component for file upload area
const FileUploadArea = ({ onFileSelect, handleDrop, handleDragOver }) => (
  <div
    className="my-10 mx-32 max-w-auto space-x-10 bg-[#5085A5] backdrop-filter backdrop-blur-2xl bg-opacity-10 rounded-2xl border-2 border-[#5085a5]/70 p-6 relative"
    onDrop={handleDrop}
    onDragOver={handleDragOver}
  >
    <div className="bg-[#8fc1e3]/95 rounded-2xl border-4 border-dashed border-gray-50 px-8 py-16 text-center flex items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="text-gray-900 text-3xl font-semibold">Solte seus arquivos aqui ou</p>
      </div>
      <label className="bg-white text-[#17a2b8] px-6 py-4 rounded-lg flex items-center cursor-pointer mx-4">
        <i className="fas fa-file-upload text-xl" />
        Escolher os Arquivos
        <input type="file" multiple className="hidden" onChange={onFileSelect} />
      </label>
    </div>
  </div>
);


// Component to show file details
const FileDetails = ({ fileDetails }) =>
  fileDetails.length > 0 && (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Detalhes dos Arquivos</h2>
      <ul className="list-disc list-inside">
        {fileDetails.map((file, index) => (
          <li key={index}>
            {file.filename} - {file.rows} linhas
          </li>
        ))}
      </ul>
    </div>
  );

// Component to show converted data table
const ConvertedDataTable = ({ tableData }) =>
  tableData.length > 0 && (
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
  );

// Component for full-width description and instructions
const FullWidthDescription = () => (
  <div className="w-full bg-[#34808c] text-white py-4 mt-16">
    <div className="flex flex-col md:flex-row justify-around container mx-auto px-4">
      <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
        <h2 className="font-bold mb-2">Descrição</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      </div>
      <div className="w-full md:w-1/2 pl-4 border-t md:border-t-0 md:border-l border-white">
        <h2 className="font-bold mb-2">Instruções</h2>
        <ol className="list-decimal list-inside">
          <li>Lorem ipsum dolor sit amet...</li>
          <li>Ut enim ad minim veniam...</li>
          <li>Duis aute irure dolor...</li>
        </ol>
      </div>
    </div>
  </div>
);

const ImportArchives = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    setSelectedFiles(files);
    handleUpload(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
    handleUpload(files);
  };

  const handleUpload = async (files) => {
    if (files.length === 0) {
      alert("Por favor, selecione pelo menos um arquivo.");
      return;
    }

    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFileDetails(response.data.files);
      setTableData(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao fazer o upload dos arquivos.");
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto bg-white relative font-['Poppins']">
  {/* SVG Header */}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="#8FC1E3">
    <path d="M0 1v99c134.3 0 153.7-99 296-99H0Z" opacity=".5"></path>
    <path d="M1000 4v86C833.3 90 833.3 3.6 666.7 3.6S500 90 333.3 90 166.7 4 0 4h1000Z" opacity=".5"></path>
    <path d="M617 1v86C372 119 384 1 196 1h421Z" opacity=".5"></path>
    <path d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z"></path>
  </svg>

  <div className="container mx-auto px-4 flex-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    {/* Header Text */}
    <h1 className="text-black text-3xl font-bold text-center">
      Importe aqui seus arquivos para serem convertidos
    </h1>
  </div>


        {/* File Type Selection */}
        <FileTypeSelection />

        {/* File Upload Area */}
        <FileUploadArea
          onFileSelect={handleFileSelect}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
        />

        {/* File Details and Data Table */}
        <FileDetails fileDetails={fileDetails} />
        <ConvertedDataTable tableData={tableData} />

        {/* Full-width Description and Instructions */}
        <FullWidthDescription />
      </div>
  );
}
export default ImportArchives;
