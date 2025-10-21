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
  PhotoCamera as PhotoCameraIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    firstName: "Jane",
    lastName: "Tenant",
    email: "jane.tenant@example.com",
    phone: "(555) 987-6543",
    emergencyContact: "John Doe - (555) 123-4567",
    currentAddress: "123 Main St, Apt 2A, City, State 12345",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    maintenanceUpdates: true,
    generalAnnouncements: true,
    marketingEmails: false,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    autoLogout: true,
  });

  const [privacy, setPrivacy] = useState({
    shareContactInfo: false,
    allowPropertyPhotos: true,
    dataCollection: false,
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

  const handlePrivacyChange = (field, value) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
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

  const handleSavePrivacy = () => {
    // Handle save privacy logic
    setSaveMessage("Privacy settings updated!");
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
              avatar={<PersonIcon />}
              title="Profile Information"
              subheader="Update your personal details"
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
                    label="Emergency Contact"
                    value={profile.emergencyContact}
                    onChange={(e) => handleProfileChange("emergencyContact", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Address"
                    multiline
                    rows={2}
                    value={profile.currentAddress}
                    onChange={(e) => handleProfileChange("currentAddress", e.target.value)}
                    InputProps={{ readOnly: true }}
                    helperText="Contact your landlord to update your address"
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
                <ListItem>
                  <ListItemText
                    primary="Auto Logout"
                    secondary="Automatically log out after 30 minutes of inactivity"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={security.autoLogout}
                      onChange={(e) => handleSecurityChange("autoLogout", e.target.checked)}
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
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              avatar={<NotificationsIcon />}
              title="Notification Preferences"
              subheader="Choose how you want to be notified"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.maintenanceUpdates}
                        onChange={(e) => handleNotificationChange("maintenanceUpdates", e.target.checked)}
                      />
                    }
                    label="Maintenance Updates"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.generalAnnouncements}
                        onChange={(e) => handleNotificationChange("generalAnnouncements", e.target.checked)}
                      />
                    }
                    label="General Announcements"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.marketingEmails}
                        onChange={(e) => handleNotificationChange("marketingEmails", e.target.checked)}
                      />
                    }
                    label="Marketing Emails"
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

        {/* Privacy Settings */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              avatar={<HomeIcon />}
              title="Privacy Settings"
              subheader="Control your privacy preferences"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.shareContactInfo}
                        onChange={(e) => handlePrivacyChange("shareContactInfo", e.target.checked)}
                      />
                    }
                    label="Share Contact Information"
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Allow landlord to share your contact info with service providers
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.allowPropertyPhotos}
                        onChange={(e) => handlePrivacyChange("allowPropertyPhotos", e.target.checked)}
                      />
                    }
                    label="Allow Property Photos"
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Allow photos of your unit for maintenance and inspection purposes
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={privacy.dataCollection}
                        onChange={(e) => handlePrivacyChange("dataCollection", e.target.checked)}
                      />
                    }
                    label="Data Collection"
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    Allow collection of usage data to improve services
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePrivacy}
                  >
                    Save Privacy Settings
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