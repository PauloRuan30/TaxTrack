import React, { useState } from "react";
import axios from "axios";

// SVG Header Component
const SVGHeader = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="#8FC1E3">
    <path d="M0 1v99c134.3 0 153.7-99 296-99H0Z" opacity=".5"></path>
    <path d="M1000 4v86C833.3 90 833.3 3.6 666.7 3.6S500 90 333.3 90 166.7 4 0 4h1000Z" opacity=".5"></path>
    <path d="M617 1v86C372 119 384 1 196 1h421Z" opacity=".5"></path>
    <path d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z"></path>
  </svg>
);

// Component for selecting file types
const FileTypeSelection = () => (
  <div className="flex justify-center gap-6 my-6">
    {["EFD ICMS", "EFD Contribuições"].map((label, index) => (
      <div key={index} className="flex items-center px-4 py-2">
        <input
          type="checkbox"
          className="w-6 h-6 mr-3 rounded-md border-2"
          style={{ borderColor: index === 1 ? "#34808c" : "#333" }}
        />
        <span className="text-center text-2xl font-medium text-gray-900">
          {label}
        </span>
      </div>
    ))}
  </div>
);

// Component for the drag-and-drop file upload area
const FileUploadArea = ({ onFileSelect, handleDrop, handleDragOver }) => (
  <div
    className="my-10 mx-8 md:mx-32 p-6 max-w-full bg-blue-500/10 backdrop-blur-xl rounded-2xl border-2 border-blue-500/70 relative"
    onDrop={handleDrop}
    onDragOver={handleDragOver}
  >
    <div className="bg-blue-300/95 rounded-2xl border-4 border-dashed border-gray-50 p-8 md:p-16 text-center flex flex-col items-center">
      <p className="text-gray-900 text-2xl md:text-3xl font-semibold mb-4">
        Solte seus arquivos aqui ou
      </p>
      <label className="bg-white text-cyan-600 px-6 py-3 rounded-lg cursor-pointer">
        Escolher os Arquivos
        <input type="file" multiple className="hidden" onChange={onFileSelect} />
      </label>
    </div>
  </div>
);

// Component to display file details after upload
const FileDetails = ({ fileDetails }) =>
  fileDetails.length > 0 && (
    <div className="mt-6 px-4">
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

// Component for converted data table display
const ConvertedDataTable = ({ tableData }) =>
  tableData.length > 0 && (
    <div className="mt-6 overflow-x-auto px-4">
      <h2 className="text-xl font-semibold mb-2">Dados Convertidos</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {Object.keys(tableData[0]).map((key, index) => (
              <th key={index} className="py-2 px-4 border-b text-left">
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

// Component for descriptive information section
const FullWidthDescription = () => (
  <div className="w-full bg-cyan-600 text-white py-8 mt-16">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-around">
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

// Main component to handle file upload, details, and data display
const Home_page = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fileDetails, setFileDetails] = useState([]);

  // Handle file drag-and-drop upload
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

  // Upload files and fetch data from the backend
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
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFileDetails(response.data.files);
      setTableData(response.data.data);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao fazer o upload dos arquivos.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white font-['Poppins'] relative">
      {/* SVG Header */}
      <SVGHeader />

      {/* Header Text */}
      <div className="text-center py-6 px-4">
        <h1 className="text-black text-2xl md:text-3xl font-bold">
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
};

export default Home_page;
