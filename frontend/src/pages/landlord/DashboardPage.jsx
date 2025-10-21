import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalProperties: 0, 
    activeTenants: 0, 
    monthlyRevenue: 0,
    occupancyRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    initials: ""
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
        if (dashboardRes.data?.recentActivity) setRecentActivity(dashboardRes.data.recentActivity);
        if (dashboardRes.data?.user) setUser(dashboardRes.data.user);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        // Fallback to default values if API fails
        setUser({
          name: "Landlord User",
          email: "landlord@example.com",
          phone: "+91 98765 43210",
          initials: "LU"
        });
      } finally {
        setLoading(false);
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
              {user.email} • {user.phone}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your properties today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<HomeIcon />}
            title="Total Properties"
            value={stats.totalProperties}
            subtitle="2 new this month"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Active Tenants"
            value={stats.activeTenants}
            subtitle="5 new this month"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AttachMoneyIcon />}
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue?.toLocaleString()}`}
            subtitle="+12% from last month"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            subtitle="Above average"
            color="success"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={index}
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
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Chip
                          label={activity.type}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                      <Typography variant="body1">
                        {activity.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Add New Property
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    List a new rental property
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Review Applications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    3 pending applications
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Generate Report
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly financial summary
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;