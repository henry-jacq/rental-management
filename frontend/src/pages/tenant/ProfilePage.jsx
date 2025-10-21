import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  Paper,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    property: "",
    leaseStart: "",
    leaseEnd: "",
    kycStatus: "Pending",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  // Mock data - replace with API calls
  useEffect(() => {
    setProfile({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      address: "123 Main St, City, State 12345",
      property: "Sunset Apartments - Unit 2A",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      kycStatus: "Verified",
    });
  }, []);

  const handleSave = () => {
    // API call to update profile
    setMessage("Profile updated successfully!");
    setEditing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original data
    setProfile({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      address: "123 Main St, City, State 12345",
      property: "Sunset Apartments - Unit 2A",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      kycStatus: "Verified",
    });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        My Profile
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {profile.email}
              </Typography>
              <Chip
                label={`KYC: ${profile.kycStatus}`}
                color={profile.kycStatus === "Verified" ? "success" : "warning"}
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6">
                  Personal Information
                </Typography>
                <Button
                  variant={editing ? "contained" : "outlined"}
                  startIcon={editing ? <SaveIcon /> : <EditIcon />}
                  onClick={editing ? handleSave : () => setEditing(true)}
                >
                  {editing ? "Save" : "Edit"}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="KYC Status"
                    value={profile.kycStatus}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <Chip
                          label={profile.kycStatus}
                          color={profile.kycStatus === "Verified" ? "success" : "warning"}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!editing}
                  />
                </Grid>
              </Grid>

              {editing && (
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Lease Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lease Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Property
                    </Typography>
                    <Typography variant="h6">
                      {profile.property}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Lease Start
                    </Typography>
                    <Typography variant="h6">
                      {new Date(profile.leaseStart).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Lease End
                    </Typography>
                    <Typography variant="h6">
                      {new Date(profile.leaseEnd).toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
