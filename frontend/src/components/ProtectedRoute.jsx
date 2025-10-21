import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = token ? JSON.parse(atob(token.split(".")[1])).role : null;

  if(!token) return <Navigate to="/" />;
  if(role && userRole !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
