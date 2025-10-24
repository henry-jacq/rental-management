import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    try {
      const userRole = JSON.parse(atob(token.split(".")[1])).role;
      if (userRole === "tenant") {
        return <Navigate to="/tenant" replace />;
      } else if (userRole === "landlord") {
        return <Navigate to="/landlord" replace />;
      }

      return <Navigate to="/" replace />;
    } catch (error) {
      localStorage.removeItem("token");
    }
  }
  
  return children;
};

export default AuthGuard;
