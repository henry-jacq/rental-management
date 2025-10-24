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
const ReportsPage = lazy(() => import("./pages/landlord/ReportsPage"));

// Lazy load tenant pages
const TenantDashboard = lazy(() => import("./pages/tenant/DashboardPage"));
const TenantProfilePage = lazy(() => import("./pages/tenant/ProfilePage"));
const TenantPropertiesPage = lazy(() => import("./pages/tenant/PropertiesPage"));
const TenantRequestsPage = lazy(() => import("./pages/tenant/RequestsPage"));


const theme = createTheme({
  palette: {
    primary: {
      main: "#2563EB", // Modern blue
      light: "#3B82F6",
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#10B981", // Modern green
      light: "#34D399",
      dark: "#059669",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#EF4444",
      light: "#F87171",
      dark: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
      light: "#FBBF24",
      dark: "#D97706",
    },
    info: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    success: {
      main: "#10B981",
      light: "#34D399",
      dark: "#059669",
    },
    background: {
      default: "#F9FAFB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    divider: "#E5E7EB",
    action: {
      hover: "rgba(37, 99, 235, 0.04)",
      selected: "rgba(37, 99, 235, 0.08)",
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)",
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.43,
      letterSpacing: '0em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8, // Rounded corners
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#D1D5DB #F3F4F6",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#D1D5DB",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#9CA3AF",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#F3F4F6",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '20px',
          '&:last-child': {
            paddingBottom: '20px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 20px',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid',
          borderColor: 'rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
        filled: {
          border: '1px solid transparent',
        },
        outlined: {
          borderWidth: '1.5px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(37, 99, 235, 0.4)',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px',
          fontSize: '1.25rem',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '20px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.16)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standard: {
          border: '1px solid',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
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
            <Route path="/landlord/reports" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="landlord">
                  <LandlordLayout>
                    <ReportsPage />
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
            <Route path="/tenant/requests" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProtectedRoute role="tenant">
                  <TenantLayout>
                    <TenantRequestsPage />
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
