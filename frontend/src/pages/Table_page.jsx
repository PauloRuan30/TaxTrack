import React, { useState, useMemo, useCallback } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';
import { useLocation, useNavigate } from 'react-router-dom';
import ExportButton from '../components/ExportButton';

// Enhanced cell cleaning function
const cleanCell = (cell) => {
  if (cell && typeof cell === 'object') {
    return {
      r: cell.r,
      c: cell.c,
      v: String(cell.v || '').trim(),
      m: String(cell.m || '').trim(),
      ct: { fa: "General", t: "g" },
      // Remove any problematic style properties
      style: undefined,
      bg: undefined
    };
  }
  return null;
};

const TablePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // More robust data cleaning
  const cleanSheets = useMemo(() => {
    const rawSheets = location.state?.data || [];
    return rawSheets.map(sheet => ({
      ...sheet,
      // Ensure celldata is always an array and clean each cell
      celldata: Array.isArray(sheet.celldata) 
        ? sheet.celldata.map(cleanCell).filter(Boolean)
        : [],
      // Ensure row and column are numbers
      row: Number(sheet.row) || 100,
      column: Number(sheet.column) || 26,
      // Reset config to prevent styling issues
      config: {
        authority: { sheet: 0, cell: 0 },
        merge: {},
        rowlen: {},
        columnlen: {}
      }
    }));
  }, [location.state?.data]);

  const [sheets, setSheets] = useState(cleanSheets);

  // Enhanced change handler
  const handleChange = useCallback((changes) => {
    const cleanChanges = changes.map(sheet => ({
      ...sheet,
      celldata: Array.isArray(sheet.celldata)
        ? sheet.celldata.map(cleanCell).filter(Boolean)
        : [],
      // Reset problematic properties
      config: {
        authority: { sheet: 0, cell: 0 },
        merge: {},
        rowlen: {},
        columnlen: {}
      }
    }));

    // Use a functional update with more robust comparison
    setSheets(prevSheets => {
      const hasChanges = JSON.stringify(prevSheets.map(s => ({
        ...s,
        celldata: s.celldata.map(cell => ({ r: cell.r, c: cell.c, v: cell.v }))
      }))) !== JSON.stringify(cleanChanges.map(s => ({
        ...s,
        celldata: s.celldata.map(cell => ({ r: cell.r, c: cell.c, v: cell.v }))
      })));

      return hasChanges ? cleanChanges : prevSheets;
    });
  }, []);

  // No data handling
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

  // Simplified and more robust options
  const options = {
    data: sheets,
    showToolbar: true,
    showGrid: true,
    showContextmenu: true,
    row: Math.max(...sheets.map(sheet => sheet.row || 100), 100),
    column: Math.max(...sheets.map(sheet => sheet.column || 26), 26),
    style: {
      width: '100%',
      height: '100vh',
    },
    onChange: handleChange,
    // Simplified hooks to prevent potential interference
    hooks: {
      beforeCellMouseDown: () => true,
    },
    cellContextMenu: true,
    allowEdit: true,
    // Remove unnecessary URLs and plugins
    plugins: [],
  };

  // Log the data from the sheets state to the console
  console.log(sheets);

  return (
    <div className="w-full h-screen">
      <Workbook {...options} />
      <ExportButton /> {/* Custom export button component */}
    </div>
  );
};

export default TablePage;
