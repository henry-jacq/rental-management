import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { useUser } from "../../contexts/UserContext";

const DashboardPage = () => {
  const { user, loading: userLoading } = useUser();

  const [stats, setStats] = useState({ 
    totalProperties: 0, 
    activeTenants: 0, 
    monthlyRevenue: 0,
    occupancyRate: 0
  });
  const [agreementStats, setAgreementStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    expired: 0
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch dashboard data
        const dashboardRes = await axios.get("http://localhost:5000/api/dashboard/landlord", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (dashboardRes.data?.stats) setStats(dashboardRes.data.stats);


        // Fetch agreements statistics
        const agreementsRes = await axios.get("http://localhost:5000/api/landlord/agreements/stats/summary", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (agreementsRes.data?.stats) {
          setAgreementStats(agreementsRes.data.stats);
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
        // Keep existing user data from context if API fails
      }
    };
    fetchData();
  }, []);

  const StatCard = ({ icon, title, value, subtitle, color = "primary" }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
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
      </CardContent>
    </Card>
  );

  if (userLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }


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
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, fontSize: "1.5rem" }}>
            {user.initials || "L"}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              Welcome back, {user.name || "Landlord"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<HomeIcon />}
            title="Total Properties"
            value={stats.totalProperties}
            // subtitle="2 new this month"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Active Tenants"
            value={stats.activeTenants}
            // subtitle="5 new this month"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AttachMoneyIcon />}
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue?.toLocaleString()}`}
            // subtitle="+12% from last month"
            color="warning"
          />
        </Grid>
      </Grid>


    </Box>
  );
};

export default DashboardPage;