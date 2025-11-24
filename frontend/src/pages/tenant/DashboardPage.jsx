import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [currentProperty, setCurrentProperty] = useState(null);
  const [propertyRequests, setPropertyRequests] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [hasActiveProperty, setHasActiveProperty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        await fetchCurrentProperty(token);

        await fetchPropertyRequests(token);

        await fetchMyProperties(token);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const fetchCurrentProperty = async (token) => {
    try {
      if (user.propertyRented) {
        const propertyRes = await axios.get(`http://localhost:5000/api/properties/${user.propertyRented}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (propertyRes.data) {
          setCurrentProperty(propertyRes.data);
          setHasActiveProperty(true);
        }
      }
    } catch (err) {
      console.error("Error fetching current property:", err);
    }
  };

  const fetchPropertyRequests = async (token) => {
    try {
      const requestsRes = await axios.get("http://localhost:5000/api/property-requests/tenant", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (requestsRes.data?.requests) {
        setPropertyRequests(requestsRes.data.requests);

        const completedRequest = requestsRes.data.requests.find(req => req.status === 'Completed');
        if (completedRequest && !currentProperty) {
          setCurrentProperty(completedRequest.property);
          setHasActiveProperty(true);
        }
      }
    } catch (err) {
      console.error("Error fetching property requests:", err);
    }
  };

  const fetchMyProperties = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/property-requests/tenant?status=Completed", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.requests) {
        const acquiredProperties = response.data.requests.map(request => ({
          ...request.property,
          id: request.property._id,
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
      }
    } catch (err) {
      console.error("Error fetching my properties:", err);
      setMyProperties([]);
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color = "primary", action, onClick }) => (
    <Card 
      sx={{ 
        height: "100%",
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[4],
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
        {action && (
          <Button variant="contained" size="small" fullWidth color={color}>
            {action}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Show loading while UserContext is loading
  if (userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect if no user data
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography>Please log in to access the dashboard.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56, fontSize: "1.5rem" }}>
            {user.initials || "T"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              Welcome back, {user.name || "Tenant"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Manage your rental account and property requests.
        </Typography>
      </Box>

      {/* Current Property Section */}
      {hasActiveProperty && currentProperty && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 3, display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
              My Current Property
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                {currentProperty.images && currentProperty.images.length > 0 ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:5000${currentProperty.images[0]}`}
                    alt={currentProperty.title}
                    sx={{ borderRadius: 1 }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {currentProperty.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                  <Typography variant="body1" color="text.secondary">
                    {currentProperty.location}
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Monthly Rent</Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                      ₹{currentProperty.rent?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
                    <Typography variant="h6">{currentProperty.bedrooms}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
                    <Typography variant="h6">{currentProperty.bathrooms}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="text.secondary">Area</Typography>
                    <Typography variant="h6">{currentProperty.area} sqft</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {currentProperty.amenities?.slice(0, 4).map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                  {currentProperty.amenities?.length > 4 && (
                    <Chip
                      label={`+${currentProperty.amenities.length - 4} more`}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  )}
                </Box>

                {user.lease && (
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`Status: ${user.lease.status}`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Property Requests Status */}
      

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<HomeIcon />}
            title="My Properties"
            value={myProperties.length}
            subtitle={myProperties.length > 0 
              ? `${myProperties.filter(p => p.lease?.status === 'Active').length} active • ₹${myProperties.reduce((total, p) => total + (p.lease?.rentAmount || p.rent || 0), 0).toLocaleString()}/month`
              : "No properties acquired"}
            color="primary"
            onClick={() => navigate('/tenant/properties')}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<AssignmentIcon />}
            title="Property Requests"
            value={propertyRequests.length}
            subtitle={propertyRequests.length > 0 ? `${propertyRequests.filter(r => r.status === 'Pending').length} pending` : "No requests submitted"}
            color="secondary"
            onClick={() => navigate('/tenant/requests')}
          />
        </Grid>
      </Grid>

    
        
    </Box>
  );
};

export default DashboardPage;