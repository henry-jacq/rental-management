import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Avatar,
} from "@mui/material";
import {
  Build as BuildIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const MaintenancePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "Plumbing",
  });

  const [requests] = useState([
    {
      id: 1,
      title: "Leaky Kitchen Faucet",
      description: "The kitchen faucet has been dripping constantly",
      priority: "Medium",
      status: "In Progress",
      category: "Plumbing",
      dateSubmitted: "2024-10-15",
      assignedTo: "Mike's Plumbing",
    },
    {
      id: 2,
      title: "Broken Window Lock",
      description: "Window lock in bedroom is not functioning properly",
      priority: "Low",
      status: "Completed",
      category: "Hardware",
      dateSubmitted: "2024-10-10",
      assignedTo: "Handyman Services",
    },
    {
      id: 3,
      title: "Heating Issue",
      description: "Heating system not working properly in living room",
      priority: "High",
      status: "Open",
      category: "HVAC",
      dateSubmitted: "2024-10-20",
      assignedTo: "Not assigned",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "error";
      case "In Progress": return "warning";
      case "Completed": return "success";
      default: return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "default";
    }
  };

  const handleSubmitRequest = () => {
    // Handle form submission
    console.log("New request:", newRequest);
    setOpenDialog(false);
    setNewRequest({ title: "", description: "", priority: "Medium", category: "Plumbing" });
  };

  const stats = {
    total: requests.length,
    open: requests.filter(r => r.status === "Open").length,
    inProgress: requests.filter(r => r.status === "In Progress").length,
    completed: requests.filter(r => r.status === "Completed").length,
  };

  const StatCard = ({ icon, title, value, color = "primary" }) => (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
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
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Maintenance Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit and track maintenance requests for your unit.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<BuildIcon />}
            title="Total Requests"
            value={stats.total}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<ScheduleIcon />}
            title="Open"
            value={stats.open}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<BuildIcon />}
            title="In Progress"
            value={stats.inProgress}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<CheckCircleIcon />}
            title="Completed"
            value={stats.completed}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Requests List */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              My Requests
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              New Request
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {requests.map((request) => (
              <Box
                key={request.id}
                sx={{
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {request.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={request.status}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                      <Chip
                        label={request.priority}
                        color={getPriorityColor(request.priority)}
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label={request.category}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Submitted: {request.dateSubmitted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assigned to: {request.assignedTo}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Submit New Maintenance Request
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Request Title"
              value={newRequest.title}
              onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={newRequest.description}
              onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={newRequest.category}
              onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value }))}
            >
              <MenuItem value="Plumbing">Plumbing</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="HVAC">HVAC</MenuItem>
              <MenuItem value="Hardware">Hardware</MenuItem>
              <MenuItem value="Appliances">Appliances</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Priority"
              value={newRequest.priority}
              onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmitRequest} variant="contained" sx={{ ml: 1 }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MaintenancePage;