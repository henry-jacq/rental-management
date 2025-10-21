import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";

// Lazy load dashboard components for better performance
const TenantDashboard = lazy(() => import("./components/TenantDashboard"));
const LandlordDashboard = lazy(() => import("./components/LandlordDashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tenant" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantDashboard />
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordDashboard />
                </ProtectedRoute>
              </Suspense>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
