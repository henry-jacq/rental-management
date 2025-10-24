import { useState, useEffect } from "react";
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
  Alert,
  CircularProgress,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  Bed as BedIcon,
  Bathtub as BathtubIcon,
  SquareFoot as SquareFootIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import axios from "axios";

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rent: "",
    deposit: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    location: "",
    amenities: [],
    rentalType: "Rental",
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
      const response = await axios.get("http://localhost:5000/api/landlord-properties", {
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
    // Check if trying to edit a non-available property
    if (property && property.status !== "Available") {
      setError("Only available properties can be edited. Properties that are rented or have other statuses cannot be modified.");
      return;
    }

    setEditingProperty(property);
    if (property) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        rent: property.rent || "",
        deposit: property.deposit || "",
        type: property.type || "",
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        area: property.area || "",
        location: property.location || "",
        amenities: property.amenities || [],
        rentalType: property.rentalType || "Rental",
      });
      setImagePreview(property.images || []);
    } else {
      setFormData({
        title: "",
        description: "",
        rent: "",
        deposit: "",
        type: "",
        bedrooms: 1,
        bathrooms: 1,
        area: "",
        location: "",
        amenities: [],
        rentalType: "Rental",
      });
      setImagePreview([]);
    }
    setSelectedImages([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProperty(null);
    setSelectedImages([]);
    setImagePreview([]);
    setError("");
  };

  const handleViewOpen = (property) => {
    setViewingProperty(property);
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setViewingProperty(null);
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

    if (editingProperty && index < (editingProperty.images?.length || 0)) {
      // This is an existing image - we'll handle removal on server
      // For now, just remove from preview
    } else {
      // This is a newly selected image
      const selectedIndex = index - (editingProperty?.images?.length || 0);
      const newSelected = selectedImages.filter((_, i) => i !== selectedIndex);
      setSelectedImages(newSelected);
    }
  };

  const uploadImages = async (propertyId) => {
    if (selectedImages.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const formDataUpload = new FormData();

      selectedImages.forEach(image => {
        formDataUpload.append('images', image);
      });

      await axios.post(
        `http://localhost:5000/api/landlord-properties/${propertyId}/images`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      if (editingProperty) {
        // Update existing property
        await axios.put(
          `http://localhost:5000/api/landlord-properties/${editingProperty._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Upload new images if any
        if (selectedImages.length > 0) {
          await uploadImages(editingProperty._id);
        }
      } else {
        // Create new property
        const response = await axios.post(
          "http://localhost:5000/api/landlord-properties",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Upload images if any
        if (selectedImages.length > 0) {
          await uploadImages(response.data._id);
        }
      }

      // Refresh properties list
      await fetchProperties();
      handleClose();
      setError("");
    } catch (error) {
      console.error("Error saving property:", error);
      setError("Failed to save property. Please check all required fields.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    // Find the property to check its status
    const property = properties.find(p => p._id === id);

    if (property && property.status !== "Available") {
      setError("Only available properties can be deleted. Please ensure the property is not currently rented.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/landlord-properties/${id}`, {
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

  const handleAmenityChange = (amenity) => {
    const newAmenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: newAmenities });
  };

  const commonAmenities = [
    "Parking", "Gym", "Swimming Pool", "Security", "Power Backup",
    "Water Supply", "Internet", "AC", "Furnished", "Garden",
    "Balcony", "Elevator", "CCTV", "Playground", "Club House", "Pet Friendly"
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Properties Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            Manage your rental properties and track their status.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon fontSize="small" />
            Only available properties can be edited or deleted
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          size="large"
        >
          Add Property
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <Grid container spacing={3}>
          {properties.map((property) => (
            <Grid item xs={12} sm={6} lg={4} key={property._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: property.status !== "Available" ? '1px solid' : 'none',
                  borderColor: property.status !== "Available" ? 'grey.300' : 'transparent',
                  opacity: property.status !== "Available" ? 0.85 : 1,
                  position: 'relative'
                }}
              >
                {property.images && property.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000${property.images[0]}`}
                    alt={property.title}
                    sx={{ objectFit: "cover" }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {property.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {property.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BedIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {property.bedrooms}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BathtubIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {property.bathrooms}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <SquareFootIcon fontSize="small" color="action" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {property.area} sqft
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        ₹{property.rent?.toLocaleString()}/month
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Deposit: ₹{property.deposit?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Type: {property.rentalType || "Rental"}
                      </Typography>
                    </Box>
                    <Chip
                      label={property.status}
                      color={
                        property.status === "Available" ? "success" :
                          property.status === "Rented" ? "primary" : "warning"
                      }
                      size="small"
                      variant={property.status === "Available" ? "filled" : "outlined"}
                      icon={property.status !== "Available" ? <LockIcon fontSize="small" /> : undefined}
                    />
                  </Box>

                  {property.currentTenant && (
                    <Typography variant="body2" color="text.secondary">
                      Tenant: {property.currentTenant.name}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  {property.status === "Available" ? (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewOpen(property)}
                      >
                        View
                      </Button>
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
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LockIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {property.status === "Rented" ? "Currently rented" : "Not available"}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewOpen(property)}
                      >
                        View
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <HomeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No properties created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by adding your first rental property to manage tenants and track income.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            size="large"
          >
            Add Your First Property
          </Button>
        </Box>
      )}

      {/* Add/Edit Property Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          {editingProperty ? "Edit Property" : "Add New Property"}
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              {/* === Basic Information === */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Name"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Property Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Property Type"
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <MenuItem value="Apartment">Apartment</MenuItem>
                    <MenuItem value="House">House</MenuItem>
                    <MenuItem value="Villa">Villa</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                    <MenuItem value="Room">Room</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Rental Type</InputLabel>
                  <Select
                    value={formData.rentalType}
                    label="Rental Type"
                    onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                  >
                    <MenuItem value="Rental">Rental</MenuItem>
                    <MenuItem value="Lease">Lease</MenuItem>
                    <MenuItem value="Both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>

              {/* === Location Section === */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Location Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location / Area"
                  fullWidth
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </Grid>

              {/* === Property Details === */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Property Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Bedrooms"
                  type="number"
                  fullWidth
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Bathrooms"
                  type="number"
                  fullWidth
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })
                  }
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Area (sq ft)"
                  type="number"
                  fullWidth
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </Grid>

              {/* === Pricing === */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Pricing
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Monthly Rent"
                  type="number"
                  fullWidth
                  required
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Security Deposit"
                  type="number"
                  fullWidth
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* === Amenities === */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Amenities
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  {commonAmenities.map((amenity) => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      clickable
                      color={
                        formData.amenities.includes(amenity) ? "primary" : "default"
                      }
                      onClick={() => handleAmenityChange(amenity)}
                      variant={
                        formData.amenities.includes(amenity) ? "filled" : "outlined"
                      }
                    />
                  ))}
                </Box>
              </Grid>

              {/* === Images === */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Property Images
                </Typography>

                <label htmlFor="image-upload">
                  <input
                    accept="image/*"
                    id="image-upload"
                    multiple
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                  />
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload Images
                  </Button>
                </label>

                {imagePreview.length > 0 && (
                  <Grid container spacing={2}>
                    {imagePreview.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Box sx={{ position: "relative" }}>
                          <img
                            src={
                              image.startsWith("blob:")
                                ? image
                                : `http://localhost:5000${image}`
                            }
                            alt={`Property ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "120px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <IconButton
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "rgba(255,255,255,0.8)",
                            }}
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            sx={{ minWidth: 100 }}
          >
            {submitting ? <CircularProgress size={20} /> : editingProperty ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Property Dialog (Read-only) */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityIcon color="primary" />
          Property Details - {viewingProperty?.title}
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {viewingProperty && (
            <Box sx={{ p: 1 }}>
              {/* Property Images */}
              {viewingProperty.images && viewingProperty.images.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Property Images
                  </Typography>
                  <Grid container spacing={2}>
                    {viewingProperty.images.map((image, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <img
                          src={`http://localhost:5000${image}`}
                          alt={`Property ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Property Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.title}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Property Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.type}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Rental Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.rentalType || 'Rental'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={viewingProperty.status}
                    color={
                      viewingProperty.status === "Available" ? "success" :
                        viewingProperty.status === "Rented" ? "primary" : "warning"
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Description</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {viewingProperty.description || 'No description provided'}
                  </Typography>
                </Grid>

                {/* Location Details */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Location Details
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Location / Area</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.location}</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Full Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {viewingProperty.address || 'Not specified'}
                  </Typography>
                </Grid>

                {/* Property Details */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Property Details
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <BedIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.bedrooms}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <BathtubIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.bathrooms}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Area</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <SquareFootIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{viewingProperty.area} sqft</Typography>
                  </Box>
                </Grid>

                {/* Pricing */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Pricing
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Monthly Rent</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mt: 0.5 }}>
                    ₹{viewingProperty.rent?.toLocaleString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Security Deposit</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600, mt: 0.5 }}>
                    ₹{viewingProperty.deposit?.toLocaleString()}
                  </Typography>
                </Grid>

                {/* Amenities */}
                {viewingProperty.amenities && viewingProperty.amenities.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Amenities
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {viewingProperty.amenities.map((amenity, index) => (
                          <Chip
                            key={index}
                            label={amenity}
                            variant="outlined"
                            size="small"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </>
                )}

                {/* Additional Details */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Additional Details
                  </Typography>
                </Grid>

                {viewingProperty.createdAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Created Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(viewingProperty.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}

                {viewingProperty.updatedAt && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {new Date(viewingProperty.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Furnished Status</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {viewingProperty.furnished || 'Unfurnished'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Preferred Tenant Type</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {viewingProperty.preferredTenantType || 'Any'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Minimum Lease Period</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {viewingProperty.minimumLeasePeriod || 12} months
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Pet Friendly</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {viewingProperty.petFriendly ? 'Yes' : 'No'}
                  </Typography>
                </Grid>

                {/* Current Tenant Info (if rented) */}
                {viewingProperty.currentTenant && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                        Current Tenant
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Tenant Name</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {viewingProperty.currentTenant.name}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleViewClose} variant="outlined">
            Close
          </Button>
          {viewingProperty?.status === "Available" && (
            <Button
              onClick={() => {
                handleViewClose();
                handleOpen(viewingProperty);
              }}
              variant="contained"
              startIcon={<EditIcon />}
            >
              Edit Property
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default PropertiesPage;