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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    rent: "",
    status: "Available",
  });

  // Mock data - replace with API calls
  useEffect(() => {
    setProperties([
      {
        id: 1,
        name: "Sunset Apartments",
        address: "123 Main St, City, State",
        type: "Apartment",
        rent: 1200,
        status: "Occupied",
        tenants: 2,
      },
      {
        id: 2,
        name: "Garden Villa",
        address: "456 Oak Ave, City, State",
        type: "House",
        rent: 1800,
        status: "Available",
        tenants: 0,
      },
    ]);
  }, []);

  const handleOpen = (property = null) => {
    setEditingProperty(property);
    if (property) {
      setFormData(property);
    } else {
      setFormData({
        name: "",
        address: "",
        type: "",
        rent: "",
        status: "Available",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProperty(null);
    setFormData({
      name: "",
      address: "",
      type: "",
      rent: "",
      status: "Available",
    });
  };

  const handleSubmit = () => {
    if (editingProperty) {
      setProperties(properties.map(p => p.id === editingProperty.id ? { ...p, ...formData } : p));
    } else {
      const newProperty = {
        id: Date.now(),
        ...formData,
        tenants: 0,
      };
      setProperties([...properties, newProperty]);
    }
    handleClose();
  };

  const handleDelete = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Properties Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Property
        </Button>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.id}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" component="div">
                    {property.name}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {property.address}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Type: {property.type}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Rent: ${property.rent}/month
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Tenants: {property.tenants}
                </Typography>
                <Chip
                  label={property.status}
                  color={property.status === "Available" ? "success" : "primary"}
                  size="small"
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleOpen(property)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(property.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProperty ? "Edit Property" : "Add New Property"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Property Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Property Type"
            fullWidth
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Monthly Rent"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.rent}
            onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
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
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Under Maintenance</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProperty ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertiesPage;
