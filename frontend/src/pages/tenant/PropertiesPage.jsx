import { useState, useEffect } from "react";
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
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [rentalType, setRentalType] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [favorites, setFavorites] = useState(new Set());
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [contactProperty, setContactProperty] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        filterProperties();
    }, [properties, searchTerm, priceRange, propertyType, rentalType]);

    const fetchProperties = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/properties/available", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProperties(data.properties);
            } else {
                console.error("Failed to fetch properties");
                // Fallback to mock data
                const mockProperties = [
                    {
                        id: 1,
                        title: "Modern 2BHK Apartment",
                        description: "Spacious 2-bedroom apartment with modern amenities in prime location",
                        rent: 25000,
                        deposit: 50000,
                        type: "Apartment",
                        bedrooms: 2,
                        bathrooms: 2,
                        area: 1200,
                        location: "Koramangala, Bangalore",
                        address: "123 Main Street, Koramangala, Bangalore - 560034",
                        amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup"],
                        images: [
                            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
                            "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400"
                        ],
                        landlord: {
                            name: "Rajesh Kumar",
                            phone: "+91 98765 43210",
                            email: "rajesh.kumar@example.com",
                            rating: 4.5
                        },
                        available: true,
                        availableFrom: "2024-12-01"
                    },
                    {
                        id: 2,
                        title: "Cozy 1BHK Studio",
                        description: "Perfect for young professionals, fully furnished studio apartment",
                        rent: 18000,
                        deposit: 36000,
                        type: "Studio",
                        bedrooms: 1,
                        bathrooms: 1,
                        area: 600,
                        location: "Indiranagar, Bangalore",
                        address: "456 Park Avenue, Indiranagar, Bangalore - 560038",
                        amenities: ["Furnished", "WiFi", "AC", "Security", "Parking"],
                        images: [
                            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
                            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
                        ],
                        landlord: {
                            name: "Priya Sharma",
                            phone: "+91 87654 32109",
                            email: "priya.sharma@example.com",
                            rating: 4.8
                        },
                        available: true,
                        availableFrom: "2024-11-25"
                    },
                    {
                        id: 3,
                        title: "Luxury 3BHK Villa",
                        description: "Spacious villa with garden, perfect for families",
                        rent: 45000,
                        deposit: 90000,
                        type: "Villa",
                        bedrooms: 3,
                        bathrooms: 3,
                        area: 2000,
                        location: "Whitefield, Bangalore",
                        address: "789 Garden View, Whitefield, Bangalore - 560066",
                        amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Supply"],
                        images: [
                            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
                            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
                        ],
                        landlord: {
                            name: "Amit Patel",
                            phone: "+91 76543 21098",
                            email: "amit.patel@example.com",
                            rating: 4.3
                        },
                        available: true,
                        availableFrom: "2024-12-15"
                    },
                    {
                        id: 4,
                        title: "Budget 1BHK Apartment",
                        description: "Affordable housing option with basic amenities",
                        rent: 12000,
                        deposit: 24000,
                        type: "Apartment",
                        bedrooms: 1,
                        bathrooms: 1,
                        area: 500,
                        location: "Electronic City, Bangalore",
                        address: "321 Tech Park Road, Electronic City, Bangalore - 560100",
                        amenities: ["Security", "Water Supply", "Parking"],
                        images: [
                            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400"
                        ],
                        landlord: {
                            name: "Sunita Reddy",
                            phone: "+91 65432 10987",
                            email: "sunita.reddy@example.com",
                            rating: 4.0
                        },
                        available: false,
                        availableFrom: "2025-01-01"
                    }
                ];
                setProperties(mockProperties);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setLoading(false);
        }
    };

    const filterProperties = () => {
        let filtered = properties;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(property =>
                property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Price range filter
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

        // Property type filter
        if (propertyType) {
            filtered = filtered.filter(property => property.type === propertyType);
        }

        // Rental type filter
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
            const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/interest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message || "I am interested in this property. Please contact me to discuss further."
                })
            });

            if (response.ok) {
                const data = await response.json();
                // Show success message
                alert(data.message || "Your request has been sent to the property owner!");
            } else {
                throw new Error('Failed to send request');
            }
        } catch (error) {
            console.error("Error expressing interest:", error);
            throw error;
        }
    };

    const PropertyCard = ({ property }) => (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ position: "relative" }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000${property.images[0]}`}
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
                    Available Properties
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Find your perfect rental home from our available properties.
                </Typography>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                placeholder="Search properties..."
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

            {/* Properties Grid */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <Typography>Loading properties...</Typography>
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

            {filteredProperties.length === 0 && !loading && (
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
                                    src={`http://localhost:5000${selectedProperty.images[0]}`}
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