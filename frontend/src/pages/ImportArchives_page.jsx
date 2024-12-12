import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SVGHeader = () => (
  <div className="relative w-full">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="#8FC1E3" className="w-full">
      <path d="M0 1v99c134.3 0 153.7-99 296-99H0Z" opacity=".5"></path>
      <path d="M1000 4v86C833.3 90 833.3 3.6 666.7 3.6S500 90 333.3 90 166.7 4 0 4h1000Z" opacity=".5"></path>
      <path d="M617 1v86C372 119 384 1 196 1h421Z" opacity=".5"></path>
      <path d="M1000 0H0v52C62.5 28 125 4 250 4c250 0 250 96 500 96 125 0 187.5-24 250-48V0Z"></path>
    </svg>
    <h1 className="absolute inset-0 flex justify-center items-center text-4xl font-bold text-black">
      Importe aqui seus arquivos para serem convertidos
    </h1>
  </div>
);

const FileUploadArea = ({ onFileSelect }) => (
  <div className="my-10 mx-8 md:mx-32 p-6 max-w-full bg-blue-500/10 backdrop-blur-xl rounded-2xl border-2 border-blue-500/70">
    <div className="bg-blue-300/95 rounded-2xl border-4 border-dashed border-gray-50 p-8 md:p-16 text-center flex flex-col items-center">
      <p className="text-gray-900 text-2xl md:text-3xl font-semibold mb-4">
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

const FileDetails = ({ files }) => (
  files.length > 0 && (
    <div className="mt-6 px-4">
      <h2 className="text-xl font-semibold mb-2">Detalhes dos Arquivos</h2>
      <ul className="list-disc list-inside">
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )
);

const FullWidthDescription = () => (
  <footer className="w-full bg-cyan-600 text-white py-8 mt-16">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-around">
      <div className="md:w-1/2 pr-4 mb-8 md:mb-0">
        <h2 className="font-bold text-3xl mb-2">Descrição</h2>
        <p className="text-lg font-medium">
          Esta tela permite a importação de arquivos no formato .txt para que o
          sistema modele e exiba as informações contidas no arquivo.
        </p>
      </div>
      <div className="md:w-1/2 pl-4 border-t md:border-t-0 md:border-l border-white">
        <h2 className="font-bold text-3xl mb-2">Instruções</h2>
        <ol className="list-decimal list-inside font-medium text-lg">
          <li>Clique no botão "Escolher arquivo" e selecione um .txt do seu computador.</li>
          <li>Verifique o formato para garantir que as informações sejam lidas corretamente.</li>
          <li>Clique em "Abrir" para carregar os dados.</li>
        </ol>
      </div>
    </div>
  </footer>
);

const ImportArchives = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const txtFiles = files.filter((file) => file.name.endsWith('.txt'));

    setError(txtFiles.length !== files.length ? 'Apenas arquivos .txt são aceitos.' : '');
    setSelectedFiles(txtFiles);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setError('Por favor, selecione pelo menos um arquivo.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));

    try {
      const { data } = await axios.post('http://localhost:8000/upload/', formData);
      if (data.errors?.length) {
        setError('Alguns arquivos apresentaram erros.');
      } else {
        navigate('/tablePage', { state: { data: data.data } });
      }
    } catch {
      setError('Falha ao carregar os arquivos. Tente novamente.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <SVGHeader />
      <FileUploadArea onFileSelect={handleFileSelect} />
      <FileDetails files={selectedFiles} />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload e Processar
        </button>
      </div>
      <FullWidthDescription />
    </div>
  );
};

export default ImportArchives;
