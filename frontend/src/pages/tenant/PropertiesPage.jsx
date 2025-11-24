import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Button,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Divider,
    IconButton,
    Tabs,
    Tab,
    Alert,
} from "@mui/material";

import {
    Search as SearchIcon,
    LocationOn as LocationIcon,
    Home as HomeIcon,
    Bed as BedIcon,
    Bathtub as BathtubIcon,
    SquareFoot as SquareFootIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Close as CloseIcon,
} from "@mui/icons-material";

import PropertyContactDialog from "../../components/PropertyContactDialog";

const PropertiesPage = () => {
    const [tabValue, setTabValue] = useState(0);

    const [myProperties, setMyProperties] = useState([]);
    const [myPropertiesLoading, setMyPropertiesLoading] = useState(true);

    const [availableProperties, setAvailableProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [availableLoading, setAvailableLoading] = useState(true);
    const [availableError, setAvailableError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [rentalType, setRentalType] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [favorites, setFavorites] = useState(new Set());
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [contactProperty, setContactProperty] = useState(null);

    useEffect(() => {
        fetchMyProperties();
        fetchAvailableProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [availableProperties, searchTerm, priceRange, propertyType, rentalType]);

    const fetchMyProperties = async () => {
        try {
            setMyPropertiesLoading(true);
            const token = localStorage.getItem("token");

            console.log("Fetching acquired properties for tenant...");

            const response = await axios.get("http://localhost:5000/api/property-requests/tenant?status=Completed", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Acquired properties API response:", response.data);

            const acquiredProperties = (response.data.requests || []).map(request => ({
                ...request.property,
                id: request.property._id,
                rentalType: request.property.rentalType || 'Rental',
                lease: {
                    startDate: request.leaseStartDate,
                    endDate: request.leaseEndDate,
                    rentAmount: request.rentAmount,
                    securityDeposit: request.securityDeposit,
                    status: 'Active'
                },
                requestId: request._id,
                assignedAt: request.assignedAt
            }));

            setMyProperties(acquiredProperties);
        } catch (error) {
            console.error("Error fetching acquired properties:", error);
            setMyProperties([]);
        } finally {
            setMyPropertiesLoading(false);
        }
    };

    const fetchAvailableProperties = async () => {
        try {
            setAvailableLoading(true);
            const token = localStorage.getItem("token");

            console.log("Fetching available properties for tenant...");

            const response = await axios.get("http://localhost:5000/api/properties/available", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("Available properties API response:", response.data);
            setAvailableProperties(response.data.properties || []);
            setAvailableError("");
        } catch (error) {
            console.error("Error fetching properties:", error);

            let errorMsg = "Failed to load properties. Please try again later.";
            
            if (error.response?.status === 401) {
                errorMsg = "Your session has expired. Please log in again.";
            } else if (error.response?.status === 403) {
                errorMsg = "Access denied. You don't have permission to view properties.";
            } else if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }

            setAvailableError(errorMsg);
            setAvailableProperties([]);
        } finally {
            setAvailableLoading(false);
        }
    };

    const filterProperties = () => {
        let filtered = availableProperties;

        if (searchTerm) {
            filtered = filtered.filter(property =>
                property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            filtered = filtered.filter(property => {
                if (max) {
                    return property.rent >= min && property.rent <= max;
                } else {
                    return property.rent >= min;
                }
            });
        }

        if (propertyType) {
            filtered = filtered.filter(property => property.type === propertyType);
        }

        if (rentalType) {
            filtered = filtered.filter(property =>
                property.rentalType === rentalType || property.rentalType === "Both"
            );
        }

        setFilteredProperties(filtered);
    };

    const toggleFavorite = (propertyId) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(propertyId)) {
            newFavorites.delete(propertyId);
        } else {
            newFavorites.add(propertyId);
        }
        setFavorites(newFavorites);
    };

    const handleViewDetails = (property) => {
        setSelectedProperty(property);
    };

    const handleCloseDetails = () => {
        setSelectedProperty(null);
    };

    const handleContactLandlord = (property) => {
        setContactProperty(property);
        setContactDialogOpen(true);
    };

    const handleSubmitContactRequest = async (propertyId, message) => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`http://localhost:5000/api/properties/${propertyId}/interest`, {
                message: message || "I am interested in this property. Please contact me to discuss further."
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            alert(response.data.message || "Your request has been sent to the property owner!");
            
            setContactDialogOpen(false);
            setContactProperty(null);
        } catch (error) {
            console.error("Error expressing interest:", error);

            let errorMessage = "Failed to send request. Please try again.";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = "Your session has expired. Please log in again.";
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data?.message || "You may have already submitted a request for this property.";
            }
            
            alert(errorMessage);
            throw error;
        }
    };

    const MyPropertyCard = ({ property }) => (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={property.images?.[0]?.startsWith('http') ? property.images[0] : `http://localhost:5000${property.images?.[0]}`}
                    alt={property.title}
                />
                <Chip
                    label={property.lease?.status || "Active"}
                    color="success"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: "success.main",
                        color: "white"
                    }}
                />
            </Box>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {property.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        {property.location}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {property.description}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                            ₹{property.lease?.rentAmount?.toLocaleString() || property.rent?.toLocaleString()}/month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Deposit Paid: ₹{property.lease?.securityDeposit?.toLocaleString() || property.deposit?.toLocaleString()}
                        </Typography>
                    </Box>
                </Box>

                {(property.lease || property.rentalType === 'Rental' || property.type === 'Rental') && (
                    <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>
                                {(property.rentalType === 'Rental' || property.type === 'Rental' || !property.lease?.endDate) ? 'Type:' : 'Lease Period:'}
                            </strong>
                        </Typography>
                        <Typography variant="body2">
                            {(property.rentalType === 'Rental' || property.type === 'Rental' || !property.lease?.endDate)
                                ? 'Rental'
                                : `${new Date(property.lease.startDate).toLocaleDateString()} - ${new Date(property.lease.endDate).toLocaleDateString()}`
                            }
                        </Typography>
                    </Box>
                )}

            </CardContent>
        </Card>
    );

    const PropertyCard = ({ property }) => (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={property.images[0]?.startsWith('http') ? property.images[0] : `http://localhost:5000${property.images[0]}`}
                    alt={property.title}
                />
                <IconButton
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.9)" }
                    }}
                    onClick={() => toggleFavorite(property.id)}
                >
                    {favorites.has(property.id) ? (
                        <FavoriteIcon color="error" />
                    ) : (
                        <FavoriteBorderIcon />
                    )}
                </IconButton>
                <Chip
                    label={property.available ? "Available" : "Not Available"}
                    color={property.available ? "success" : "default"}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        bgcolor: property.available ? "success.main" : "grey.500",
                        color: "white"
                    }}
                />
            </Box>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {property.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                        {property.location}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {property.description}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BedIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {property.bedrooms} Bed
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <BathtubIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {property.bathrooms} Bath
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
                            ₹{property.rent.toLocaleString()}/month
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Deposit: ₹{property.deposit.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Type: {property.rentalType || "Rental"}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewDetails(property)}
                        sx={{ flex: 1 }}
                    >
                        View Details
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleContactLandlord(property)}
                        disabled={!property.available}
                        sx={{ flex: 1 }}
                    >
                        Contact
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    Properties
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your acquired properties and browse available ones.
                </Typography>
            </Box>

            {/* Tabs */}
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
                <Tab label="My Properties" />
                <Tab label="Available Properties" />
            </Tabs>

            {/* Tab 0: My Properties */}
            {tabValue === 0 && (
                <Box>
                    {/* My Properties Summary */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="h4" color="primary">
                                        {myProperties.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Properties
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="h4" color="success.main">
                                        {myProperties.filter(p => p.lease?.status === 'Active').length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Leases
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="h4" color="info.main">
                                        ₹{myProperties.reduce((total, p) => total + (p.lease?.rentAmount || 0), 0).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Monthly Rent
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* My Properties Grid */}
                    {myPropertiesLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <Typography>Loading your properties...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {myProperties.map((property) => (
                                <Grid item xs={12} sm={6} lg={4} key={property.id}>
                                    <MyPropertyCard property={property} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {myProperties.length === 0 && !myPropertiesLoading && (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <HomeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                No properties acquired yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                You haven't acquired any properties yet. Browse available properties and submit requests to get started.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {/* Tab 1: Available Properties */}
            {tabValue === 1 && (
                <Box>
                    {/* Error Alert */}
                    {availableError && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {availableError}
                        </Alert>
                    )}

                    {/* Filters */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
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
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Price Range</InputLabel>
                                        <Select
                                            value={priceRange}
                                            label="Price Range"
                                            onChange={(e) => setPriceRange(e.target.value)}
                                        >
                                            <MenuItem value="">All Prices</MenuItem>
                                            <MenuItem value="0-15000">Under ₹15,000</MenuItem>
                                            <MenuItem value="15000-25000">₹15,000 - ₹25,000</MenuItem>
                                            <MenuItem value="25000-40000">₹25,000 - ₹40,000</MenuItem>
                                            <MenuItem value="40000">Above ₹40,000</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Property Type</InputLabel>
                                        <Select
                                            value={propertyType}
                                            label="Property Type"
                                            onChange={(e) => setPropertyType(e.target.value)}
                                        >
                                            <MenuItem value="">All Types</MenuItem>
                                            <MenuItem value="Apartment">Apartment</MenuItem>
                                            <MenuItem value="Studio">Studio</MenuItem>
                                            <MenuItem value="Villa">Villa</MenuItem>
                                            <MenuItem value="House">House</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Rental Type</InputLabel>
                                        <Select
                                            value={rentalType}
                                            label="Rental Type"
                                            onChange={(e) => setRentalType(e.target.value)}
                                        >
                                            <MenuItem value="">All Types</MenuItem>
                                            <MenuItem value="Rental">Rental</MenuItem>
                                            <MenuItem value="Lease">Lease</MenuItem>
                                            <MenuItem value="Both">Both</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Available Properties Grid */}
                    {availableLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <Typography>Loading available properties...</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredProperties.map((property) => (
                                <Grid item xs={12} sm={6} lg={4} key={property.id}>
                                    <PropertyCard property={property} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {filteredProperties.length === 0 && !availableLoading && (
                        <Box sx={{ textAlign: "center", py: 8 }}>
                            <HomeIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                No properties found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Try adjusting your search filters to find more properties.
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}



            {/* Property Details Dialog */}
            <Dialog
                open={!!selectedProperty}
                onClose={handleCloseDetails}
                maxWidth="md"
                fullWidth
            >
                {selectedProperty && (
                    <>
                        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">{selectedProperty.title}</Typography>
                            <IconButton onClick={handleCloseDetails}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ mb: 3 }}>
                                <img
                                    src={selectedProperty.images[0]?.startsWith('http') ? selectedProperty.images[0] : `http://localhost:5000${selectedProperty.images[0]}`}
                                    alt={selectedProperty.title}
                                    style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>Property Details</Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        {selectedProperty.description}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <LocationIcon fontSize="small" color="action" />
                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                            {selectedProperty.address}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 3, my: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <BedIcon fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                {selectedProperty.bedrooms} Bedrooms
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <BathtubIcon fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                {selectedProperty.bathrooms} Bathrooms
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center" }}>
                                            <SquareFootIcon fontSize="small" color="action" />
                                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                                {selectedProperty.area} sqft
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="h6" sx={{ mb: 1 }}>Amenities</Typography>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                                        {selectedProperty.amenities.map((amenity, index) => (
                                            <Chip key={index} label={amenity} size="small" variant="outlined" />
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Pricing</Typography>
                                            <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 1 }}>
                                                ₹{selectedProperty.rent.toLocaleString()}/month
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                Security Deposit: ₹{selectedProperty.deposit.toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                Available from: {selectedProperty.availableFrom}
                                            </Typography>

                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="h6" sx={{ mb: 2 }}>Landlord</Typography>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <Avatar sx={{ mr: 2 }}>
                                                    {selectedProperty.landlord.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {selectedProperty.landlord.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Rating: {selectedProperty.landlord.rating}/5
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <PhoneIcon fontSize="small" color="action" />
                                                <Typography variant="body2" sx={{ ml: 1 }}>
                                                    {selectedProperty.landlord.phone}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <EmailIcon fontSize="small" color="action" />
                                                <Typography variant="body2" sx={{ ml: 1 }}>
                                                    {selectedProperty.landlord.email}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetails}>Close</Button>
                            <Button
                                variant="contained"
                                onClick={() => handleContactLandlord(selectedProperty)}
                                disabled={!selectedProperty.available}
                            >
                                Contact Landlord
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Property Contact Dialog */}
            <PropertyContactDialog
                open={contactDialogOpen}
                onClose={() => setContactDialogOpen(false)}
                property={contactProperty}
                onSubmit={handleSubmitContactRequest}
            />
        </Box>
    );
};

export default PropertiesPage;