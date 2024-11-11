import React, { useState } from 'react';
import { Sheet, SheetTable } from 'fortunesheets';

const App = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await fetch('http://localhost:8000/upload/', {
      method: 'POST',
      body: new FormData(document.querySelector('#fileForm'))
    });

    if (response.ok) {
      const result = await response.json();
      setData(result.data);
    } else {
      console.error('Failed to fetch data');
    }
  };

  return (
    <div>
      <form id="fileForm">
        <input type="file" name="file" accept=".txt" />
        <button type="button" onClick={fetchData}>Upload and Process</button>
      </form>
      <Sheet data={data} />
    </div>
  );
};

export default App;
