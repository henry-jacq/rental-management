import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const userRole = JSON.parse(atob(token.split(".")[1])).role;
    
    // If role is specified and user role doesn't match, redirect to appropriate dashboard
    if (role && userRole !== role) {
      if (userRole === "tenant") {
        return <Navigate to="/tenant" replace />;
      } else if (userRole === "landlord") {
        return <Navigate to="/landlord" replace />;
      }
      return <Navigate to="/" replace />;
    }

    return (
      <Box>
        {children}
      </Box>
    );
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
