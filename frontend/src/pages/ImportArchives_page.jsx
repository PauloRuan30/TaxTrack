import React, { useState } from 'react';
import axios from 'axios';
import ImportLogsModal from '../components/ImportLogs_Modal';

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
          <span className="text-center text-2xl font-sans font-medium text-gray-900">
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
        <p className="text-gray-900 text-2xl md:text-3xl font-sans font-semibold mb-4">
          Solte seus arquivos aqui ou
        </p>
        <label className="bg-white text-cyan-600 px-6 py-3 rounded-lg cursor-pointer">
          Escolher os Arquivos
          <input
            type="file"
            multiple
            accept=".txt"
            className="hidden"
            onChange={onFileSelect}
          />
        </label>
      </div>
    </div>
  );

  // Component to display file details after upload
  const FileDetails = ({ fileDetails }) =>
    fileDetails.length > 0 && (
      <div className="mt-6 px-4">
        <h2 className="text-xl font-sans font-semibold mb-2">Detalhes dos Arquivos</h2>
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
        <h2 className="text-xl font-sans font-semibold mb-2">Dados Convertidos</h2>
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
    <footer className="w-full bg-cyan-600 text-white py-8 mt-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-around">
        <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
          <h2 className="font-sans font-bold text-3xl mb-2">Descrição</h2>
          <p className='text-lg font-medium'>Esta tela permite a importação de arquivos no formato .txt para que o sistema modele e exiba as informações contidas no arquivo.
             O objetivo é simplificar a visualização e análise dos dados importados, permitindo a conferência rápida e precisa dos conteúdos fiscais.</p>
        </div>
        <div className="w-full md:w-1/2 pl-4 border-t md:border-t-0 md:border-l border-white">
          <h2 className="font-sans font-bold text-3xl mb-2">Instruções</h2>
          <ol className="list-decimal list-inside font-medium text-lg">
            <li>Clique no botão "Escolher arquivo": Selecione o arquivo .txt do seu computador que deseja importar.</li>
            <li>Verifique o formato do arquivo: Certifique-se de que o arquivo 
              está em conformidade com o layout esperado pelo sistema para garantir que as informações sejam lidas corretamente.</li>
            <li>Clique em "Abrir": Após selecionar o arquivo, clique no botão "Importar" para carregar os dados.</li>
          </ol>
        </div>
      </div>
    </footer>
  );

  // Main component to handle file upload, details, and data display
  const ImportArchives = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [fileDetails, setFileDetails] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approvedFiles, setApprovedFiles] = useState([]);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    const [isDataConfirmed, setIsDataConfirmed] = useState(false); // New state
  
    const handleDrop = (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      setSelectedFiles(files);
      handleUpload(files);
    };
  
    const handleDragOver = (event) => event.preventDefault();
  
    const handleFileSelect = (event) => {
      const files = event.target.files;
      setSelectedFiles(files);
      handleUpload(files);
    };
  
    const handleUpload = async (files) => {
      if (files.length === 0) {
        alert('Por favor, selecione pelo menos um arquivo.');
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
  
        const approved = response.data.files.map((file) => file.filename);
        const rejected = response.data.errors.map((error) => error.filename);
  
        setApprovedFiles(approved);
        setRejectedFiles(rejected);
        setErrorMessages(response.data.errors);
  
        setIsModalOpen(true);
      } catch (error) {
        const errorDetail = error.response?.data?.detail || "Falha ao enviar arquivos.";
        setErrorMessages([{ filename: "Upload", error: errorDetail }]);
        setIsModalOpen(true);
      }
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedFiles([]);
      setIsDataConfirmed(false); // Reset confirmation state when closing modal
    };
  
    const handleConfirmData = () => {
      setIsDataConfirmed(true);
      setIsModalOpen(false);
    };
  
    return (
      <div className="w-full min-h-screen bg-white font-sans font-['Poppins'] relative">
        <SVGHeader />
  
        <div className="text-center py-6 px-4">
          <h1 className="text-black text-2xl md:text-3xl font-sans font-bold">
            Importe aqui seus arquivos para serem convertidos
          </h1>
        </div>
  
        <FileTypeSelection />
  
        <FileUploadArea
          onFileSelect={handleFileSelect}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
        />
  
        <FileDetails fileDetails={fileDetails} />
        {isDataConfirmed && <ConvertedDataTable tableData={tableData} />} {/* Display data when confirmed */}
  
        <FullWidthDescription />
  
        {isModalOpen && (
          <ImportLogsModal
            onConfirm={handleConfirmData} // Call the function to confirm data
            onCancel={closeModal}
            approvedFiles={approvedFiles}
            rejectedFiles={rejectedFiles}
            importedData={tableData} // Pass imported data to modal
          />
        )}
      </div>
    );
  };
  
  export default ImportArchives;