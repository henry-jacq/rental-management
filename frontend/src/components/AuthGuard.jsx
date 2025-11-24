import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // If no token, show the login/register page
  if (!token) {
    return children;
  }
  
  // If token exists, check if it's valid and redirect
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      throw new Error("Invalid token format");
    }
    
    const decoded = JSON.parse(atob(payload));
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.log("AuthGuard: Token expired, removing...");
      localStorage.removeItem("token");
      return children;
    }
    
    const userRole = decoded.role;
    
    // Redirect based on role
    if (userRole === "tenant") {
      return <Navigate to="/tenant" replace />;
    }
    
    if (userRole === "landlord") {
      return <Navigate to="/landlord" replace />;
    }
    
    // Unknown role, remove token and show login
    console.log("AuthGuard: Unknown role, removing token");
    localStorage.removeItem("token");
    return children;
    
  } catch (error) {
    // If token is invalid, remove it and show login page
    console.error("AuthGuard: Invalid token, removing...", error);
    localStorage.removeItem("token");
    return children;
  }
};

export default AuthGuard;
