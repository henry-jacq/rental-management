import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const AgreementsPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [agreements, setAgreements] = useState([]);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/agreements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const agreementsData = await response.json();
        setAgreements(agreementsData);
      } else {
        setAgreements([]);
        console.error('Failed to fetch agreements');
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
      setAgreements([]);
    }
  };
    {
      id: 3,
      tenant: "Bob Johnson",
      property: "789 Pine St, Apt 3C",
      type: "Lease Renewal",
      status: "Draft",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      monthlyRent: 1700,
      deposit: 3400,
    },
    {
      id: 4,
      tenant: "Alice Brown",
      property: "321 Elm St, Unit 2B",
      type: "Lease Agreement",
      status: "Expired",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      monthlyRent: 1650,
      deposit: 3300,
    },
  ]);

  const stats = {
    total: agreements.length,
    active: agreements.filter(a => a.status === "Active").length,
    pending: agreements.filter(a => a.status === "Pending Approval").length,
    draft: agreements.filter(a => a.status === "Draft").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "success";
      case "Pending Approval": return "warning";
      case "Draft": return "info";
      case "Expired": return "error";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircleIcon />;
      case "Pending Approval": return <ScheduleIcon />;
      case "Draft": return <DescriptionIcon />;
      case "Expired": return <CancelIcon />;
      default: return <DescriptionIcon />;
    }
  };

  const handleMenuClick = (event, agreement) => {
    setAnchorEl(event.currentTarget);
    setSelectedAgreement(agreement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAgreement(null);
  };

  const handleApprove = () => {
    if (selectedAgreement) {
      setAgreements(prev =>
        prev.map(agreement =>
          agreement.id === selectedAgreement.id
            ? { ...agreement, status: "Active" }
            : agreement
        )
      );
    }
    handleMenuClose();
  };

  const handleReject = () => {
    if (selectedAgreement) {
      setAgreements(prev =>
        prev.map(agreement =>
          agreement.id === selectedAgreement.id
            ? { ...agreement, status: "Draft" }
            : agreement
        )
      );
    }
    handleMenuClose();
  };

  const columns = [
    {
      field: 'tenant',
      headerName: 'Tenant',
      flex: 1,
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
      field: 'property',
      headerName: 'Property',
      flex: 1.2,
      minWidth: 200,
    },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          icon={getStatusIcon(params.value)}
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'monthlyRent',
      headerName: 'Monthly Rent',
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 0.8,
      minWidth: 100,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleMenuClick(event, params.row)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const StatCard = ({ icon, title, value, color = "primary" }) => (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Agreements & Leases
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage lease agreements, approvals, and renewals.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<DescriptionIcon />}
            title="Total Agreements"
            value={stats.total}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<CheckCircleIcon />}
            title="Active Leases"
            value={stats.active}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<ScheduleIcon />}
            title="Pending Approval"
            value={stats.pending}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<DescriptionIcon />}
            title="Drafts"
            value={stats.draft}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Agreements Table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              All Agreements
            </Typography>
            <Button variant="contained">
              Create New Agreement
            </Button>
          </Box>

          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={agreements}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.default',
                  borderRadius: '6px 6px 0 0',
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

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => console.log('View', selectedAgreement)}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => console.log('Edit', selectedAgreement)}>
          Edit Agreement
        </MenuItem>
        {selectedAgreement?.status === "Pending Approval" && (
          <>
            <MenuItem onClick={handleApprove}>
              Approve & Activate
            </MenuItem>
            <MenuItem onClick={handleReject}>
              Reject
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => console.log('Download', selectedAgreement)}>
          Download PDF
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AgreementsPage;