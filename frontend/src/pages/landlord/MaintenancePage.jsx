import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Container,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

const MaintenancePage = () => {
  const [requests, setRequests] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  useEffect(() => {
    // Calculate stats
    const total = requests.length;
    const open = requests.filter(r => r.status === "Open").length;
    const inProgress = requests.filter(r => r.status === "In Progress").length;
    const completed = requests.filter(r => r.status === "Completed").length;
    
    setStats({ total, open, inProgress, completed });
  }, [requests]);

  const fetchMaintenanceRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/maintenance', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const maintenanceData = await response.json();
        setRequests(maintenanceData);
      } else {
        // Fallback to empty array if API fails
        setRequests([]);
        console.error('Failed to fetch maintenance requests');
      }
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      setRequests([]);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "error";
      case "In Progress": return "warning";
      case "Completed": return "success";
      default: return "default";
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleUpdateStatus = (requestId, newStatus) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
    setSnackbarMessage("Request status updated successfully");
    setSnackbarOpen(true);
  };

  const columns = [
    {
      field: 'property',
      headerName: 'Property',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'tenant',
      headerName: 'Tenant',
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
            {params.value.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'issue',
      headerName: 'Issue',
      flex: 1.2,
      minWidth: 200,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getPriorityColor(params.value)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'dateCreated',
      headerName: 'Date Created',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewRequest(params.row)}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
          Maintenance Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage maintenance requests from your tenants
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            transition: "all 0.2s ease-in-out",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <BuildIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Requests
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            transition: "all 0.2s ease-in-out",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <WarningIcon color="error" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>
                    {stats.open}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Open
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            transition: "all 0.2s ease-in-out",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <BuildIcon color="warning" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    In Progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            transition: "all 0.2s ease-in-out",
            "&:hover": { transform: "translateY(-2px)", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 32 }} />
                <Box>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Completed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Card with Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 3 }}>
            <Tab label="All Requests" />
            <Tab label="Open" />
            <Tab label="In Progress" />
            <Tab label="Completed" />
          </Tabs>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              Maintenance Requests
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                size="small"
              >
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {/* Handle add new request */}}
              >
                Add Request
              </Button>
            </Box>
          </Box>

          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={requests}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.default',
                  borderRadius: '8px 8px 0 0',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Request Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Maintenance Request Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Property"
                  value={selectedRequest.property}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tenant"
                  value={selectedRequest.tenant}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Issue Description"
                  value={selectedRequest.issue}
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Priority"
                  value={selectedRequest.priority}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={selectedRequest.status}
                  onChange={(e) => handleUpdateStatus(selectedRequest.id, e.target.value)}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date Created"
                  value={selectedRequest.dateCreated}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Assigned To"
                  value={selectedRequest.assignedTo}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Close
          </Button>
          <Button variant="contained" sx={{ ml: 1 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MaintenancePage;