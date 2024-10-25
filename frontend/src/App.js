import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login_page from "./pages/Login_page.jsx";
import ImportArchives from "./pages/ImportArchives_page.jsx";
import Signup from "./pages/Signup_page.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login_page />} />
          <Route path="/signup"/>
        </Routes>
      </Router>

    <ImportArchives/>
    </div>
  );
}

export default App;
