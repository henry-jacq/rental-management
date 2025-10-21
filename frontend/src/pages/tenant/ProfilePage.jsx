import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useUser } from "../../contexts/UserContext";

const ProfilePage = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentAddress: "",
    emergencyContact: "",
    joinDate: "January 2024",
  });

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      // Fetch user profile data from API
      fetchUserProfile();
      setProfile({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(' ') || "",
        email: user.email || "",
        currentAddress: "", // Will be loaded from API
        emergencyContact: "", // Will be loaded from API
        joinDate: "", // Will be loaded from API
      });
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/dashboard/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        setProfile(prev => ({
          ...prev,
          currentAddress: profileData.address ? 
            `${profileData.address.line1 || ''}, ${profileData.address.city || ''}, ${profileData.address.state || ''} ${profileData.address.postalCode || ''}`.trim() : 
            "Address not available",
          emergencyContact: profileData.emergencyContact || "Not provided",
          joinDate: profileData.joinDate || "Not available"
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        emergencyContact: profile.emergencyContact
      };

      const response = await fetch('http://localhost:5000/api/dashboard/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        // Update user context with new data
        setIsEditing(false);
        // Optionally show success message
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your personal information and account details.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3, textAlign: "center" }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: "secondary.main", 
                  fontSize: "3rem",
                  mx: "auto",
                  mb: 2
                }}
              >
                {user?.initials || "T"}
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {user?.name || "Tenant"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {user?.email}
              </Typography>
              <Chip 
                label="Tenant" 
                color="secondary" 
                sx={{ mb: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 1 }}>
                <HomeIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Current Resident
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Member since {profile.joinDate}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
                <Button
                  variant={isEditing ? "contained" : "outlined"}
                  startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Address"
                    value={profile.currentAddress}
                    disabled={true}
                    multiline
                    rows={2}
                    helperText="Contact your landlord to update your address"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    value={profile.emergencyContact}
                    onChange={(e) => handleProfileChange("emergencyContact", e.target.value)}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>

              {isEditing && (
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;