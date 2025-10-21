import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Fab,
} from "@mui/material";
import {
  Build as BuildIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

const MaintenancePage = () => {
  const [requests, setRequests] = useState([]);
  const [openRequest, setOpenRequest] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "General",
  });
  const [message, setMessage] = useState("");

  // Mock data - replace with API calls
  useEffect(() => {
    setRequests([
      {
        id: 1,
        title: "Leaky Faucet",
        description: "Kitchen faucet is dripping constantly",
        category: "Plumbing",
        priority: "High",
        status: "In Progress",
        createdAt: "2024-11-25",
        updatedAt: "2024-11-28",
        assignedTo: "Maintenance Team",
        estimatedCompletion: "2024-12-02",
      },
      {
        id: 2,
        title: "Broken Light Switch",
        description: "Bedroom light switch is not working",
        category: "Electrical",
        priority: "Medium",
        status: "Pending",
        createdAt: "2024-11-30",
        updatedAt: "2024-11-30",
        assignedTo: null,
        estimatedCompletion: null,
      },
      {
        id: 3,
        title: "AC Not Cooling",
        description: "Air conditioning unit is not cooling properly",
        category: "HVAC",
        priority: "High",
        status: "Completed",
        createdAt: "2024-11-20",
        updatedAt: "2024-11-25",
        assignedTo: "HVAC Specialist",
        estimatedCompletion: "2024-11-25",
      },
    ]);
  }, []);

  const handleSubmit = () => {
    if (editingRequest) {
      setRequests(requests.map(r => 
        r.id === editingRequest.id 
          ? { ...r, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      ));
    } else {
      const newRequest = {
        id: Date.now(),
        ...formData,
        status: "Pending",
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        assignedTo: null,
        estimatedCompletion: null,
      };
      setRequests([newRequest, ...requests]);
    }
    setMessage(editingRequest ? "Request updated successfully!" : "Request submitted successfully!");
    setOpenRequest(false);
    setEditingRequest(null);
    setFormData({ title: "", description: "", priority: "Medium", category: "General" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setFormData({
      title: request.title,
      description: request.description,
      priority: request.priority,
      category: request.category,
    });
    setOpenRequest(true);
  };

  const handleClose = () => {
    setOpenRequest(false);
    setEditingRequest(null);
    setFormData({ title: "", description: "", priority: "Medium", category: "General" });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "In Progress": return "info";
      case "Completed": return "success";
      case "Cancelled": return "error";
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

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const inProgressCount = requests.filter(r => r.status === "In Progress").length;
  const completedCount = requests.filter(r => r.status === "Completed").length;

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Maintenance Requests
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" color="warning.main">
                {pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4" color="info.main">
                {inProgressCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" color="success.main">
                {completedCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Requests
              </Typography>
              <Typography variant="h4">
                {requests.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Requests Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                      {request.description.length > 50 
                        ? `${request.description.substring(0, 50)}...` 
                        : request.description
                      }
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>
                  <Chip
                    label={request.priority}
                    color={getPriorityColor(request.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{request.assignedTo || "-"}</TableCell>
                <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handleEdit(request)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Request Dialog */}
      <Dialog open={openRequest} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRequest ? "View/Edit Request" : "New Maintenance Request"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Plumbing">Plumbing</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="HVAC">HVAC</MenuItem>
              <MenuItem value="Appliance">Appliance</MenuItem>
              <MenuItem value="Structural">Structural</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Emergency">Emergency</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRequest ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => setOpenRequest(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MaintenancePage;
