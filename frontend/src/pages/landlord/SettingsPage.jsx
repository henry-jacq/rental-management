import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Landlord",
    email: "john.landlord@example.com",
    phone: "(555) 123-4567",
    company: "Landlord Properties LLC",
    address: "123 Business St, City, State 12345",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    maintenanceAlerts: true,
    paymentReminders: true,
    tenantMessages: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saveMessage, setSaveMessage] = useState("");

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Handle save profile logic
    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSaveNotifications = () => {
    // Handle save notifications logic
    setSaveMessage("Notification preferences updated!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleSaveSecurity = () => {
    // Handle save security logic
    setSaveMessage("Security settings updated!");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleChangePassword = () => {
    // Handle password change logic
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setOpenPasswordDialog(false);
    setSaveMessage("Password changed successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account settings and preferences
      </Typography>

      {saveMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {saveMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              avatar={<BusinessIcon />}
              title="Profile Information"
              subheader="Update your personal and business details"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} display="flex" justifyContent="center" sx={{ mb: 2 }}>
                  <Box position="relative">
                    <Avatar sx={{ width: 80, height: 80 }}>
                      {profile.firstName[0]}{profile.lastName[0]}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": { backgroundColor: "primary.dark" },
                      }}
                      size="small"
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={profile.company}
                    onChange={(e) => handleProfileChange("company", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Address"
                    multiline
                    rows={2}
                    value={profile.address}
                    onChange={(e) => handleProfileChange("address", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Save Profile
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              avatar={<SecurityIcon />}
              title="Security Settings"
              subheader="Manage your account security"
            />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={security.twoFactorAuth}
                      onChange={(e) => handleSecurityChange("twoFactorAuth", e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Login Alerts"
                    secondary="Get notified when someone logs into your account"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={security.loginAlerts}
                      onChange={(e) => handleSecurityChange("loginAlerts", e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="outlined"
                onClick={() => setOpenPasswordDialog(true)}
                sx={{ mr: 2 }}
              >
                Change Password
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveSecurity}
              >
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={<NotificationsIcon />}
              title="Notification Preferences"
              subheader="Choose how you want to be notified"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.emailNotifications}
                        onChange={(e) => handleNotificationChange("emailNotifications", e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.smsNotifications}
                        onChange={(e) => handleNotificationChange("smsNotifications", e.target.checked)}
                      />
                    }
                    label="SMS Notifications"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.maintenanceAlerts}
                        onChange={(e) => handleNotificationChange("maintenanceAlerts", e.target.checked)}
                      />
                    }
                    label="Maintenance Alerts"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.paymentReminders}
                        onChange={(e) => handleNotificationChange("paymentReminders", e.target.checked)}
                      />
                    }
                    label="Payment Reminders"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.tenantMessages}
                        onChange={(e) => handleNotificationChange("tenantMessages", e.target.checked)}
                      />
                    }
                    label="Tenant Messages"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveNotifications}
                  >
                    Save Notification Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleChangePassword}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;