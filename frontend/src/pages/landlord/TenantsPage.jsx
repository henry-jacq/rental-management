import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

const TenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    leaseStart: "",
    leaseEnd: "",
    status: "Active",
  });

  // Mock data - replace with API calls
  useEffect(() => {
    setTenants([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 234-567-8900",
        property: "Sunset Apartments",
        leaseStart: "2024-01-01",
        leaseEnd: "2024-12-31",
        status: "Active",
        rent: 1200,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1 234-567-8901",
        property: "Garden Villa",
        leaseStart: "2024-02-01",
        leaseEnd: "2025-01-31",
        status: "Active",
        rent: 1800,
      },
    ]);
  }, []);

  const handleOpen = (tenant = null) => {
    setEditingTenant(tenant);
    if (tenant) {
      setFormData(tenant);
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        property: "",
        leaseStart: "",
        leaseEnd: "",
        status: "Active",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTenant(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      property: "",
      leaseStart: "",
      leaseEnd: "",
      status: "Active",
    });
  };

  const handleSubmit = () => {
    if (editingTenant) {
      setTenants(tenants.map(t => t.id === editingTenant.id ? { ...t, ...formData } : t));
    } else {
      const newTenant = {
        id: Date.now(),
        ...formData,
        rent: 1200,
      };
      setTenants([...tenants, newTenant]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setTenants(tenants.filter(t => t.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tenants Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Tenant
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tenants
              </Typography>
              <Typography variant="h4">
                {tenants.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Leases
              </Typography>
              <Typography variant="h4">
                {tenants.filter(t => t.status === "Active").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expiring Soon
              </Typography>
              <Typography variant="h4">
                {tenants.filter(t => {
                  const endDate = new Date(t.leaseEnd);
                  const now = new Date();
                  const diffTime = endDate - now;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 30 && diffDays > 0;
                }).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4">
                ₹{tenants.reduce((sum, t) => sum + (t.rent || 0), 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Lease Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {tenant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{tenant.rent}/month
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{tenant.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{tenant.phone}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{tenant.property}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={tenant.status}
                    color={tenant.status === "Active" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpen(tenant)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(tenant.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTenant ? "Edit Tenant" : "Add New Tenant"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            variant="outlined"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Property"
            fullWidth
            variant="outlined"
            value={formData.property}
            onChange={(e) => setFormData({ ...formData, property: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Lease Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.leaseStart}
            onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Lease End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.leaseEnd}
            onChange={(e) => setFormData({ ...formData, leaseEnd: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Status"
            select
            fullWidth
            variant="outlined"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            SelectProps={{ native: true }}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTenant ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TenantsPage;
