import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Navbar from './pages/Navbar';
import { ToastProvider } from './context/ToastContext';
import SignIn from "./pages/SignIn";
import './styles/gradient.css';

function App() {
  return (
    <ToastProvider>
        <Router>
         <Navbar/>
          <Routes>
            <Route path="/" element={<Navigate to="/Home.html" replace />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
    </ToastProvider>
  );
}

export default App;