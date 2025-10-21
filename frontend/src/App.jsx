import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthGuard from "./components/AuthGuard";
import { UserProvider } from "./contexts/UserContext";

// Lazy load components
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Lazy load layouts
const LandlordLayout = lazy(() => import("./components/layouts/LandlordLayout"));
const TenantLayout = lazy(() => import("./components/layouts/TenantLayout"));

// Lazy load landlord pages
const LandlordDashboard = lazy(() => import("./pages/landlord/DashboardPage"));
const LandlordProfilePage = lazy(() => import("./pages/landlord/ProfilePage"));
const PropertiesPage = lazy(() => import("./pages/landlord/PropertiesPage"));
const TenantsPage = lazy(() => import("./pages/landlord/TenantsPage"));
const AgreementsPage = lazy(() => import("./pages/landlord/AgreementsPage"));
const PaymentsPage = lazy(() => import("./pages/landlord/PaymentsPage"));
const LandlordMaintenancePage = lazy(() => import("./pages/landlord/MaintenancePage"));
const ReportsPage = lazy(() => import("./pages/landlord/ReportsPage"));
const LandlordSettingsPage = lazy(() => import("./pages/landlord/SettingsPage"));

// Lazy load tenant pages
const TenantDashboard = lazy(() => import("./pages/tenant/DashboardPage"));
const TenantProfilePage = lazy(() => import("./pages/tenant/ProfilePage"));
const TenantPropertiesPage = lazy(() => import("./pages/tenant/PropertiesPage"));
const TenantPaymentsPage = lazy(() => import("./pages/tenant/PaymentsPage"));
const MaintenancePage = lazy(() => import("./pages/tenant/MaintenancePage"));
const DocumentsPage = lazy(() => import("./pages/tenant/DocumentsPage"));
const NotificationsPage = lazy(() => import("./pages/tenant/NotificationsPage"));
const TenantSettingsPage = lazy(() => import("./pages/tenant/SettingsPage"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",
    },
    secondary: {
      main: "#388E3C",
    },
    error: {
      main: "#D32F2F",
    },
    warning: {
      main: "#FFC107",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#6B7280",
    },
    divider: "#E5E7EB",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #F3F4F6',
          borderRadius: 0,
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          '&:hover': {
            borderColor: '#D1D5DB',
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E5E7EB',
          boxShadow: 'none',
        },
      },
    },
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
      <UserProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={
              <AuthGuard>
                <Login />
              </AuthGuard>
            } />
            <Route path="/register" element={
              <AuthGuard>
                <Register />
              </AuthGuard>
            } />
            <Route path="/tenant" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <TenantDashboard />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <LandlordDashboard />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />

            {/* Landlord Routes */}
            <Route path="/landlord/profile" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <LandlordProfilePage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/properties" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <PropertiesPage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/tenants" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <TenantsPage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/agreements" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <AgreementsPage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/payments" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <PaymentsPage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/maintenance" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <LandlordMaintenancePage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/reports" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <ReportsPage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/landlord/settings" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <LandlordSettingsPage />
                  </LandlordLayout>
                </ProtectedRoute>
              </Suspense>
            } />

            {/* Tenant Routes */}
            <Route path="/tenant/profile" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <TenantProfilePage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/tenant/properties" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <TenantPropertiesPage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/tenant/payments" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <TenantPaymentsPage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/tenant/maintenance" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <MaintenancePage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/tenant/documents" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <DocumentsPage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/tenant/notifications" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <NotificationsPage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            <Route path="/tenant/settings" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <TenantSettingsPage />
                  </TenantLayout>
                </ProtectedRoute>
              </Suspense>
            } />
            </Routes>
          </Suspense>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
