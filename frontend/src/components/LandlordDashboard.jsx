import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Home from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";

const LandlordDashboard = memo(() => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProperties: 0, activeTenants: 0, monthlyRevenue: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/landlord", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(res.data.message);
        if (res.data?.stats) setStats(res.data.stats);
        if (res.data?.recentActivity) setRecentActivity(res.data.recentActivity);
      } catch (err) {
        setMessage(err.response?.data?.msg || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom color="primary">
                Welcome, Landlord!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your rental properties and tenants efficiently.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Properties
                </Typography>
                <Typography variant="h3" color="primary">
                  {stats.totalProperties}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Properties
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tenants
                </Typography>
                <Typography variant="h3" color="primary">
                  {stats.activeTenants}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Tenants
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Manage Tenants
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue
                </Typography>
                <Typography variant="h3" color="primary">
                  ${stats.monthlyRevenue?.toLocaleString?.() || stats.monthlyRevenue}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monthly Income
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Reports
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {recentActivity?.length ? (
                recentActivity.map((item, idx) => (
                  <Typography key={idx} variant="body2" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    {item.type}: {item.description}{item.amount ? ` - $${item.amount}` : item.status ? ` - ${item.status}` : ""}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No recent activity</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : message ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {message}
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Dashboard loaded successfully
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
});

export default LandlordDashboard;
