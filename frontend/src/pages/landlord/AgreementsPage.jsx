import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import axios from "axios";
import AgreementCard from "../../components/AgreementCard";
import AgreementDialog from "../../components/AgreementDialog";

const AgreementsPage = () => {
  // State management
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create', 'edit', 'preview'
  const [error, setError] = useState("");
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchAgreements();
    fetchProperties();
    fetchTenants();
  }, []);

  // Filter agreements when search/filter changes
  useEffect(() => {
    filterAgreements();
  }, [agreements, searchTerm, statusFilter, propertyFilter]);

  const fetchAgreements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/landlord/agreements", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAgreements(response.data.agreements || []);
      setError("");
    } catch (error) {
      console.error("Error fetching agreements:", error);
      setError("Failed to fetch agreements");
      setAgreements([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/landlord/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(response.data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    }
  };

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tenants", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(response.data || []);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      setTenants([]);
    }
  };

  const filterAgreements = () => {
    let filtered = agreements;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agreement =>
        agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(agreement => agreement.status === statusFilter);
    }

    // Property filter
    if (propertyFilter) {
      filtered = filtered.filter(agreement => agreement.property?._id === propertyFilter);
    }

    return filtered;
  };

  const handleCreateNew = () => {
    setSelectedAgreement(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (agreement) => {
    setSelectedAgreement(agreement);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handlePreview = (agreement) => {
    setSelectedAgreement(agreement);
    setDialogMode('preview');
    setDialogOpen(true);
  };

  const handleDelete = async (agreementId) => {
    if (!window.confirm("Are you sure you want to delete this agreement? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/landlord/agreements/${agreementId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from local state
      setAgreements(prev => prev.filter(agreement => agreement._id !== agreementId));
      setError("");
    } catch (error) {
      console.error("Error deleting agreement:", error);
      setError("Failed to delete agreement");
    }
  };

  const handleSaveAgreement = async (formData, mode) => {
    try {
      const token = localStorage.getItem("token");
      let response;

      if (mode === 'create') {
        response = await axios.post("http://localhost:5000/api/landlord/agreements", formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Add new agreement to the list
        setAgreements(prev => [response.data.agreement, ...prev]);
      } else if (mode === 'edit') {
        response = await axios.put(`http://localhost:5000/api/landlord/agreements/${selectedAgreement._id}`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update agreement in the list
        setAgreements(prev => prev.map(agreement => 
          agreement._id === selectedAgreement._id ? response.data.agreement : agreement
        ));
      }

      setError("");
    } catch (error) {
      console.error("Error saving agreement:", error);
      setError("Failed to save agreement");
      throw error; // Re-throw to let dialog handle the error
    }
  };



  const filteredAgreements = filterAgreements();

  // Calculate statistics
  const stats = {
    total: agreements.length,
    active: agreements.filter(a => a.status === "Active").length,
    draft: agreements.filter(a => a.status === "Draft").length,
    expired: agreements.filter(a => a.status === "Expired").length,
    terminated: agreements.filter(a => a.status === "Terminated").length,
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
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Rental Agreements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your rental agreements and documents.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          size="large"
        >
          New Agreement
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Agreements
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.total}
                  </Typography>
                </Box>
                <DescriptionIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Active
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.active}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Draft
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.draft}
                  </Typography>
                </Box>
                <DescriptionIcon sx={{ fontSize: 40, color: "info.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Expired
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {stats.expired}
                  </Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, color: "error.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search agreements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Draft">Draft</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Property</InputLabel>
                <Select
                  value={propertyFilter}
                  label="Property"
                  onChange={(e) => setPropertyFilter(e.target.value)}
                >
                  <MenuItem value="">All Properties</MenuItem>
                  {properties.map((property) => (
                    <MenuItem key={property._id} value={property._id}>
                      {property.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Agreements Grid */}
      {filteredAgreements.length > 0 ? (
        <Grid container spacing={3}>
          {filteredAgreements.map((agreement) => (
            <Grid item xs={12} sm={6} lg={4} key={agreement._id}>
              <AgreementCard
                agreement={agreement}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPreview={handlePreview}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <DescriptionIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {agreements.length === 0 ? "No agreements created yet" : "No agreements match your filters"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {agreements.length === 0 
              ? "Start by creating your first rental agreement to manage tenant relationships."
              : "Try adjusting your search criteria or filters to find agreements."}
          </Typography>
          {agreements.length === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              size="large"
            >
              Create Your First Agreement
            </Button>
          )}
        </Box>
      )}

      {/* Agreement Dialog */}
      <AgreementDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        mode={dialogMode}
        agreement={selectedAgreement}
        properties={properties}
        tenants={tenants}
        onSave={handleSaveAgreement}
        loading={loading}
      />
    </Box>
  );
};

export default AgreementsPage;