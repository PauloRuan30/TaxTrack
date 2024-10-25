<html>
<head>
    <title>Exportar Arquivos</title>
    <script src="https://unpkg.com/react/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f4f8;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        function App() {
            return (
                <div className="bg-blue-200 p-8 rounded-lg shadow-lg relative">
                    <div className="border-2 border-dashed border-white p-6 rounded-lg">
                        <h1 className="text-center text-xl font-bold mb-4">Exportar Arquivos</h1>
                        <div className="flex justify-center space-x-4 mb-4">
                            <div className="flex items-center">
                                <input type="checkbox" id="csv" className="mr-2" />
                                <label htmlFor="csv" className="flex items-center">
                                    <i className="fas fa-file-csv mr-1"></i>.csv
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="xlsx" className="mr-2" />
                                <label htmlFor="xlsx" className="flex items-center">
                                    <i className="fas fa-file-excel mr-1"></i>.xlsx
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" id="txt" className="mr-2" />
                                <label htmlFor="txt" className="flex items-center">
                                    <i className="fas fa-file-alt mr-1"></i>.txt
                                </label>
                            </div>
                        </div>
                        <h2 className="text-center text-lg mb-2">Preview do Arquivo</h2>
                        <div className="bg-white p-4 rounded-lg h-40 mb-4"></div>
                        <div className="flex justify-between">
                            <button className="bg-red-500 text-white py-2 px-4 rounded-lg">Cancelar</button>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Confirmar</button>
                        </div>
                    </div>
                </div>
            );
        }

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>