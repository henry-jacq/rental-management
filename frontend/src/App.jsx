import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, CircularProgress, Box } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthGuard from "./components/AuthGuard";

// Lazy load dashboard components for better performance
const TenantDashboard = lazy(() => import("./components/TenantDashboard"));
const LandlordDashboard = lazy(() => import("./components/LandlordDashboard"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));

// Lazy load layouts
const LandlordLayout = lazy(() => import("./components/layouts/LandlordLayout"));
const TenantLayout = lazy(() => import("./components/layouts/TenantLayout"));

// Lazy load landlord pages
const PropertiesPage = lazy(() => import("./pages/landlord/PropertiesPage"));
const TenantsPage = lazy(() => import("./pages/landlord/TenantsPage"));
const PaymentsPage = lazy(() => import("./pages/landlord/PaymentsPage"));
const LandlordMaintenancePage = lazy(() => import("./pages/landlord/MaintenancePage"));
const ReportsPage = lazy(() => import("./pages/landlord/ReportsPage"));
const LandlordSettingsPage = lazy(() => import("./pages/landlord/SettingsPage"));

// Lazy load tenant pages
const ProfilePage = lazy(() => import("./pages/tenant/ProfilePage"));
const TenantPaymentsPage = lazy(() => import("./pages/tenant/PaymentsPage"));
const MaintenancePage = lazy(() => import("./pages/tenant/MaintenancePage"));
const DocumentsPage = lazy(() => import("./pages/tenant/DocumentsPage"));
const NotificationsPage = lazy(() => import("./pages/tenant/NotificationsPage"));
const TenantSettingsPage = lazy(() => import("./pages/tenant/SettingsPage"));

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
                    <ProfilePage />
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
    </ThemeProvider>
  );
}

export default App;
