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
import Chip from "@mui/material/Chip";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Home from "@mui/icons-material/Home";
import Logout from "@mui/icons-material/Logout";
import Receipt from "@mui/icons-material/Receipt";
import Schedule from "@mui/icons-material/Schedule";
import Build from "@mui/icons-material/Build";

const TenantDashboard = memo(() => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/tenant", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(res.data.message);
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Home sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tenant Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom color="primary">
                Welcome, Tenant!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your rental payments and maintenance requests.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rent Due
                </Typography>
                <Typography variant="h3" color="primary">
                  $1,200
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due in 5 days
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Pay Now
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Maintenance
                </Typography>
                <Typography variant="h3" color="primary">
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open Requests
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Requests
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Lease Status
                </Typography>
                <Chip label="Active" color="success" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Expires: Dec 2024
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Lease
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Payments
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rent Payment"
                    secondary="Paid on Nov 1, 2024 - $1,200"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Receipt />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rent Payment"
                    secondary="Paid on Oct 1, 2024 - $1,200"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Schedule />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rent Due"
                    secondary="December 1, 2024"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Build />
                  </ListItemIcon>
                  <ListItemText
                    primary="Maintenance Visit"
                    secondary="December 5, 2024"
                  />
                </ListItem>
              </List>
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

export default TenantDashboard;
