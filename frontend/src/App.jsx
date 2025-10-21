import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TenantDashboard from "./components/TenantDashboard";
import LandlordDashboard from "./components/LandlordDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tenant" element={<ProtectedRoute role="tenant"><TenantDashboard /></ProtectedRoute>} />
        <Route path="/landlord" element={<ProtectedRoute role="landlord"><LandlordDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
