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
  Divider,
  Alert,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useUser } from "../../contexts/UserContext";

const DashboardPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    rentDue: 0,
    maintenanceRequests: 0,
    leaseStatus: "Active",
    nextPaymentDate: "December 1, 2024"
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [propertyRequests, setPropertyRequests] = useState([]);
  const [hasActiveProperty, setHasActiveProperty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch dashboard data
        const dashboardRes = await axios.get("http://localhost:5000/api/dashboard/tenant", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (dashboardRes.data?.stats) setStats(dashboardRes.data.stats);

        // Format recent payments with currency
        if (dashboardRes.data?.recentPayments) {
          const formattedPayments = dashboardRes.data.recentPayments.map(payment => ({
            ...payment,
            amount: `₹${payment.amount.toLocaleString()}`
          }));
          setRecentPayments(formattedPayments);
        }

        // Fetch current property information
        await fetchCurrentProperty(token);

        // Fetch property requests
        await fetchPropertyRequests(token);

      } catch (err) {
        console.error("Error fetching data:", err);
        // Keep existing user data from context if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCurrentProperty = async (token) => {
    try {
      // Check if user has a current property from user context
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

        // Check if there's a completed request (assigned property)
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

  const StatCard = ({ icon, title, value, subtitle, color = "primary", action }) => (
    <Card sx={{ height: "100%" }}>
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
          Manage your rental account and stay up to date with payments.
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
                      icon={<CalendarIcon />}
                      label={`Lease: ${new Date(user.lease.startDate).toLocaleDateString()} - ${new Date(user.lease.endDate).toLocaleDateString()}`}
                      color="primary"
                      variant="outlined"
                    />
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
      {!hasActiveProperty && propertyRequests.length > 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            Property Request Status
          </Typography>
          {propertyRequests.map((request, index) => (
            <Box key={request._id} sx={{ mb: index < propertyRequests.length - 1 ? 1 : 0 }}>
              <Typography variant="body2">
                Request for <strong>{request.property?.title}</strong> -
                <Chip
                  label={request.statusDisplay || request.status}
                  size="small"
                  sx={{ ml: 1 }}
                  color={
                    request.status === 'Completed' ? 'success' :
                      request.status === 'Agreement_Sent' ? 'primary' :
                        request.status === 'Approved' ? 'info' :
                          request.status === 'Rejected' ? 'error' : 'warning'
                  }
                />
              </Typography>
            </Box>
          ))}
        </Alert>
      )}

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AttachMoneyIcon />}
            title="Next Payment"
            value={hasActiveProperty ? `₹${currentProperty?.rent?.toLocaleString() || stats.rentDue?.toLocaleString()}` : "No Property"}
            subtitle={hasActiveProperty ? `Due ${stats.nextPaymentDate}` : "Acquire a property first"}
            color={hasActiveProperty ? "error" : "default"}
            action={hasActiveProperty ? "Pay Now" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<BuildIcon />}
            title="Maintenance"
            value={stats.maintenanceRequests}
            subtitle="Open requests"
            color="warning"
            action={hasActiveProperty ? "View Requests" : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AssignmentIcon />}
            title="Property Requests"
            value={propertyRequests.length}
            subtitle={`${propertyRequests.filter(r => r.status === 'Pending').length} pending`}
            color="secondary"
            action="View Requests"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<ScheduleIcon />}
            title="Lease Status"
            value={hasActiveProperty ? (user.lease?.status || "Active") : "No Lease"}
            subtitle={hasActiveProperty ? "Property assigned" : "No active property"}
            color={hasActiveProperty ? "success" : "default"}
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                {hasActiveProperty ? "Recent Payments" : "Property Request Activity"}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {hasActiveProperty ? (
                  recentPayments.length > 0 ? (
                    recentPayments.map((payment, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          backgroundColor: "background.default",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Rent Payment
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {payment.date}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {payment.amount}
                          </Typography>
                          <Chip
                            label={payment.status}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No payment history available yet
                    </Typography>
                  )
                ) : (
                  propertyRequests.length > 0 ? (
                    propertyRequests.slice(0, 3).map((request, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 2,
                          backgroundColor: "background.default",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HomeIcon sx={{ mr: 2, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {request.property?.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={request.statusDisplay || request.status}
                          size="small"
                          color={
                            request.status === 'Completed' ? 'success' :
                              request.status === 'Agreement_Sent' ? 'primary' :
                                request.status === 'Approved' ? 'info' :
                                  request.status === 'Rejected' ? 'error' : 'warning'
                          }
                          variant="outlined"
                        />
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <HomeIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        No property requests yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Browse available properties to get started
                      </Typography>
                    </Box>
                  )
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                {hasActiveProperty ? "Landlord Information" : "Getting Started"}
              </Typography>

              {hasActiveProperty && currentProperty ? (
                <Box>
                  {/* Landlord Info */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {currentProperty.landlord?.name?.charAt(0) || 'L'}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentProperty.landlord?.name || 'Property Owner'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Property Landlord
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Contact Information */}
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                    Contact Information
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        {currentProperty.landlord?.email || 'Contact via platform'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 2, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2">
                        {currentProperty.landlord?.phone || 'Contact via platform'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Upcoming Events */}
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                    Upcoming Events
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 2,
                        backgroundColor: "background.default",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Avatar sx={{ bgcolor: "error.main", mr: 2, width: 32, height: 32 }}>
                        <AttachMoneyIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Rent Payment Due
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stats.nextPaymentDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <HomeIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    Find Your Perfect Home
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Browse available properties and submit requests to landlords
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button variant="contained" href="/tenant/properties">
                      Browse Properties
                    </Button>
                    {propertyRequests.length > 0 && (
                      <Button variant="outlined" href="/tenant/requests">
                        View Requests
                      </Button>
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;