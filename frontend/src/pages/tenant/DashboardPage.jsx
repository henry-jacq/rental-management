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
  Button,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    rentDue: 1750, 
    maintenanceRequests: 1, 
    leaseStatus: "Active",
    nextPaymentDate: "December 1, 2024"
  });
  const [recentPayments, setRecentPayments] = useState([
    { amount: "$1,750", status: "Paid", date: "Nov 1, 2024" },
    { amount: "$1,750", status: "Paid", date: "Oct 1, 2024" },
    { amount: "$1,750", status: "Paid", date: "Sep 1, 2024" },
  ]);
  const [userName] = useState("Sarah Johnson"); // This would come from auth context

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/tenant", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.stats) setStats(res.data.stats);
        if (res.data?.recentPayments) setRecentPayments(res.data.recentPayments);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Welcome back, {userName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your rental account and stay up to date with payments.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AttachMoneyIcon />}
            title="Next Payment"
            value={`$${stats.rentDue?.toLocaleString()}`}
            subtitle={`Due ${stats.nextPaymentDate}`}
            color="error"
            action="Pay Now"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<BuildIcon />}
            title="Maintenance"
            value={stats.maintenanceRequests}
            subtitle="Open requests"
            color="warning"
            action="View Requests"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AssignmentIcon />}
            title="Lease Status"
            value={stats.leaseStatus}
            subtitle="Expires June 2025"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<ScheduleIcon />}
            title="Next Inspection"
            value="Dec 15"
            subtitle="Annual inspection"
            color="primary"
          />
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
                Recent Payments
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentPayments.map((payment, index) => (
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
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 3 }}>
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
                  <Avatar sx={{ bgcolor: "error.main", mr: 2, width: 40, height: 40 }}>
                    <AttachMoneyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Rent Payment Due
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      December 1, 2024
                    </Typography>
                  </Box>
                </Box>
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
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 40, height: 40 }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Property Inspection
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      December 15, 2024 at 10:00 AM
                    </Typography>
                  </Box>
                </Box>
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
                  <Avatar sx={{ bgcolor: "warning.main", mr: 2, width: 40, height: 40 }}>
                    <BuildIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Maintenance Visit
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      December 5, 2024 at 2:00 PM
                    </Typography>
                  </Box>
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