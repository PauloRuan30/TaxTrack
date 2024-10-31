// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home_page";
import BusinessRegistrationPage from "./pages/BusinessRegistration_page";
import ImportArchives from "./pages/ImportArchives_page";
import LoginPage from "./pages/Login_page";
import Signup from "./pages/Signup_page";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Home route */}
          <Route path="/businessRegistration" element={<BusinessRegistrationPage />} />
          <Route path="/importArchives" element={<ImportArchives />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/operations" element={<div className="p-8">Operations Placeholder Page</div>} /> {/* Placeholder */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
