import React from "react";
import { Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = token ? JSON.parse(atob(token.split(".")[1])).role : null;

  if(!token) return <Navigate to="/" />;
  if(role && userRole !== role) return <Navigate to="/" />;

  return (
    <Box>
      {children}
    </Box>
  );
};

export default ProtectedRoute;
