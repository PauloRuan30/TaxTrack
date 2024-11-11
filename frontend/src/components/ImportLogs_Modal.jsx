import React, { useState } from 'react';

const ImportLogsModal = ({ onConfirm, onCancel, approvedFiles, rejectedFiles, importedData }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    setIsConfirmed(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative mx-auto shadow-xl bg-blue-300/95 rounded-2xl border-4 border-dashed border-gray-50 max-w-max w-full p-6 overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        {!isConfirmed ? (
          <>
            {/* Title */}
            <div className="text-center text-gray-900 text-4xl font-sans font-semibold mb-4">
              Validação dos Arquivos Importados
            </div>

            {/* Approved Files List */}
            <div className="text-center text-gray-900 text-2xl font-sans font-medium fonr mb-2">{approvedFiles.length} Arquivos aprovados</div>
            <ul className="overflow-y-auto h-min mb-4 text-sm text-gray-700 border-2 border-gray-400 rounded-lg p-2">
              {approvedFiles.map((file, index) => (
                <li key={index} className="text-center text-lg font-sans">{file}</li>
              ))}
            </ul>

            {/* Rejected Files List */}
            <div className="text-center text-gray-900 text-xl font-sans font-medium mb-2">{rejectedFiles.length} Arquivos não aprovados</div>
            <ul className="overflow-y-auto h-56 mb-4 text-sm text-red-700 border-2 border-red-400 rounded-lg p-2">
              {rejectedFiles.map((file, index) => (
                <li key={index} className="text-center text-lg font-sans">{file}</li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex justify-around mt-6">
              <button
                className="text-white bg-green-600 hover:bg-green-800 rounded-lg text-base px-4 py-2 font-sans"
                onClick={handleConfirm}
              >
                Confirmar
              </button>
              <button
                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg text-base px-4 py-2 font-sans"
                onClick={onCancel}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="text-center text-gray-900 text-xl font-sans mb-4">Tabela de dados importados</div>
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  {Object.keys(importedData[0] || {}).map((key, index) => (
                    <th key={index} className="px-4 py-2 border">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {importedData.map((row, index) => (
                  <tr key={index} className="border-b">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 border">{value}</td>
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
};

export default ImportLogsModal;
