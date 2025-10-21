import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // If user is authenticated, redirect to appropriate dashboard
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
      // If token is invalid, remove it and allow access to auth routes
      localStorage.removeItem("token");
    }
  }
  
  // If not authenticated, allow access to auth routes
  return children;
};

export default AuthGuard;
