import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Divider,
  Badge,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "payment",
      title: "Rent Payment Due",
      message: "Your rent payment of $1,750 is due on December 1st, 2024",
      date: "2024-10-20",
      time: "09:00 AM",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "maintenance",
      title: "Maintenance Request Update",
      message: "Your maintenance request for the leaky faucet has been assigned to Mike's Plumbing",
      date: "2024-10-19",
      time: "02:30 PM",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "info",
      title: "Property Inspection Scheduled",
      message: "Annual property inspection scheduled for November 15th, 2024 at 10:00 AM",
      date: "2024-10-18",
      time: "11:15 AM",
      read: true,
      priority: "medium",
    },
    {
      id: 4,
      type: "payment",
      title: "Payment Confirmation",
      message: "Your rent payment of $1,750 has been successfully processed",
      date: "2024-10-01",
      time: "08:45 AM",
      read: true,
      priority: "low",
    },
    {
      id: 5,
      type: "maintenance",
      title: "Maintenance Completed",
      message: "The heating system repair in your unit has been completed",
      date: "2024-09-28",
      time: "03:20 PM",
      read: true,
      priority: "low",
    },
  ]);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    maintenanceUpdates: true,
    generalAnnouncements: true,
  });

  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "payment":
        return <PaymentIcon color="primary" />;
      case "maintenance":
        return <BuildIcon color="warning" />;
      case "info":
        return <InfoIcon color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleDeleteAllRead = () => {
    setNotifications(prev =>
      prev.filter(notification => !notification.read)
    );
  };

  const handlePreferenceChange = (preference, value) => {
    setPreferences(prev => ({ ...prev, [preference]: value }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Stay updated with important messages and alerts
      </Typography>

      {/* Notification Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon color="primary" sx={{ mr: 2 }} />
                </Badge>
                <Box>
                  <Typography variant="h4" color="primary">
                    {notifications.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Notifications
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningIcon color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="error">
                    {unreadCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unread
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PaymentIcon color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="warning.main">
                    {notifications.filter(n => n.type === "payment").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Payment Related
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BuildIcon color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4" color="info.main">
                    {notifications.filter(n => n.type === "maintenance").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maintenance
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<MarkReadIcon />}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark All as Read
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteAllRead}
              color="error"
            >
              Delete Read
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<SettingsIcon />}
            onClick={() => setOpenSettingsDialog(true)}
          >
            Notification Settings
          </Button>
        </Box>
      </Paper>

      {/* Notifications List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Notifications
        </Typography>
        
        {notifications.length === 0 ? (
          <Box textAlign="center" py={4}>
            <NotificationsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You'll see important updates and messages here
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    backgroundColor: notification.read ? "transparent" : "action.hover",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: notification.read ? "normal" : "bold",
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          label={notification.priority}
                          color={getPriorityColor(notification.priority)}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.date} at {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      {!notification.read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <MarkReadIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Notification Settings Dialog */}
      <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Notification Preferences</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose how you want to receive notifications
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Delivery Methods
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.pushNotifications}
                    onChange={(e) => handlePreferenceChange("pushNotifications", e.target.checked)}
                  />
                }
                label="Push Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.smsNotifications}
                    onChange={(e) => handlePreferenceChange("smsNotifications", e.target.checked)}
                  />
                }
                label="SMS Notifications"
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Notification Types
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.paymentReminders}
                    onChange={(e) => handlePreferenceChange("paymentReminders", e.target.checked)}
                  />
                }
                label="Payment Reminders"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.maintenanceUpdates}
                    onChange={(e) => handlePreferenceChange("maintenanceUpdates", e.target.checked)}
                  />
                }
                label="Maintenance Updates"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.generalAnnouncements}
                    onChange={(e) => handlePreferenceChange("generalAnnouncements", e.target.checked)}
                  />
                }
                label="General Announcements"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setOpenSettingsDialog(false)}>
            Save Preferences
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;