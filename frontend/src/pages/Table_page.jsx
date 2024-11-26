import React, { useState } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useLocation, useNavigate } from 'react-router-dom';

const TablePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sheets, setSheets] = useState(location.state?.data || []);

  if (!sheets.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Data Available</h1>
          <p className="text-gray-600 mb-4">No spreadsheet data was found. Please try uploading your files again.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
          >
            Go Back to Upload
          </button>
        </div>
      </div>
    );
  }

  const options = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    row: Math.max(...sheets.map(sheet => sheet.row), 100),
    column: Math.max(...sheets.map(sheet => sheet.column), 26),
    style: {
      width: '100%',
      height: '100vh',
    },
    onChange: (changes) => {
      setSheets(changes);
    },
    hooks: {
      beforeCellMouseDown: () => true,
      beforeCellEditStart: () => true,
      beforeCellEditEnd: () => true,
    },
    cellContextMenu: true,
    allowEdit: true,
    allowUpdate: true,
    allowDelete: true,
    loadUrl: '',
    loadSheetUrl: '',
    updateUrl: '',
    plugins: [],  // Removed plugins to simplify and avoid potential conflicts
  };

  return (
    <div className="w-full h-screen">
      <Workbook {...options} />
    </div>
  );
};

export default TablePage;