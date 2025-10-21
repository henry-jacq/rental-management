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
  Alert,
  CircularProgress,
  CardMedia,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import axios from "axios";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "",
    rent: "",
    status: "Available",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (property = null) => {
    setEditingProperty(property);
    if (property) {
      setFormData({
        name: property.name,
        address: property.address,
        type: property.type,
        rent: property.rent,
        status: property.status,
        description: property.description || "",
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        images: property.images || [],
      });
      setImagePreview(property.images || []);
    } else {
      setFormData({
        name: "",
        address: "",
        type: "",
        rent: "",
        status: "Available",
        description: "",
        bedrooms: 1,
        bathrooms: 1,
        images: [],
      });
      setImagePreview([]);
    }
    setSelectedImages([]);
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
      description: "",
      bedrooms: 1,
      bathrooms: 1,
      images: [],
    });
    setSelectedImages([]);
    setImagePreview([]);
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
    
    if (index < formData.images.length) {
      // Remove from existing images
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    } else {
      // Remove from selected images
      const selectedIndex = index - formData.images.length;
      const newSelected = selectedImages.filter((_, i) => i !== selectedIndex);
      setSelectedImages(newSelected);
    }
  };

  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    try {
      const token = localStorage.getItem("token");
      const formDataUpload = new FormData();
      
      selectedImages.forEach(image => {
        formDataUpload.append('images', image);
      });

      const response = await axios.post(
        "http://localhost:5000/api/properties/upload-images",
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data.images;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Upload new images first
      let uploadedImages = [];
      if (selectedImages.length > 0) {
        uploadedImages = await uploadImages();
      }

      // Combine existing and new images
      const allImages = [...(formData.images || []), ...uploadedImages];
      const propertyData = { ...formData, images: allImages };
      
      if (editingProperty) {
        // Update existing property
        await axios.put(
          `http://localhost:5000/api/properties/${editingProperty._id}`,
          propertyData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new property
        await axios.post(
          "http://localhost:5000/api/properties",
          propertyData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      // Refresh properties list
      await fetchProperties();
      handleClose();
      setError("");
    } catch (error) {
      console.error("Error saving property:", error);
      setError("Failed to save property");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh properties list
      await fetchProperties();
      setError("");
    } catch (error) {
      console.error("Error deleting property:", error);
      setError("Failed to delete property");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property._id}>
            <Card sx={{ height: "100%" }}>
              {property.images && property.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${property.images[0]}`}
                  alt={property.name}
                  sx={{ objectFit: "cover" }}
                />
              )}
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
                  Rent: ₹{property.rent}/month
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Bedrooms: {property.bedrooms} | Bathrooms: {property.bathrooms}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Tenant: {property.currentTenant ? "Occupied" : "None"}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Chip
                    label={property.status}
                    color={
                      property.status === "Available" ? "success" : 
                      property.status === "Occupied" ? "primary" : "warning"
                    }
                    size="small"
                  />
                  {property.images && property.images.length > 1 && (
                    <Typography variant="caption" color="text.secondary">
                      +{property.images.length - 1} more
                    </Typography>
                  )}
                </Box>
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
                  onClick={() => handleDelete(property._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {properties.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No properties found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your first property to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Property
          </Button>
        </Box>
      )}

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
            required
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            margin="dense"
            label="Property Type"
            select
            fullWidth
            variant="outlined"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mb: 2 }}
            SelectProps={{ native: true }}
            required
          >
            <option value="">Select Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            <option value="Studio">Studio</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Other">Other</option>
          </TextField>
          <TextField
            margin="dense"
            label="Monthly Rent"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.rent}
            onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              margin="dense"
              label="Bedrooms"
              type="number"
              variant="outlined"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
              inputProps={{ min: 0 }}
            />
            <TextField
              margin="dense"
              label="Bathrooms"
              type="number"
              variant="outlined"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
              inputProps={{ min: 0 }}
            />
          </Box>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

          {/* Image Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Property Images
            </Typography>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              multiple
              type="file"
              onChange={handleImageSelect}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                sx={{ mb: 2 }}
              >
                Add Images
              </Button>
            </label>

            {imagePreview.length > 0 && (
              <ImageList sx={{ width: '100%', maxHeight: 200 }} cols={3} rowHeight={100}>
                {imagePreview.map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image.startsWith('blob:') ? image : `http://localhost:5000${image}`}
                      alt={`Property ${index + 1}`}
                      loading="lazy"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                    <ImageListItemBar
                      sx={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                      }}
                      position="top"
                      actionIcon={
                        <IconButton
                          sx={{ color: 'white' }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <CloseIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>
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
