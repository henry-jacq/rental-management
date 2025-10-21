import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'view', 'agreement'

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/property-requests/tenant', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAgreement = async (requestId) => {
    if (!confirm('Are you sure you want to accept this agreement? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/property-requests/${requestId}/accept-agreement`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchRequests();
        setDialogOpen(false);
        alert('Agreement accepted successfully! The landlord will now complete the property assignment.');
      } else {
        const errorData = await response.json();
        alert(`Failed to accept agreement: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error accepting agreement:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleOpenDialog = (request, type) => {
    setSelectedRequest(request);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setDialogType('');
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'warning',
      'Approved': 'info',
      'Rejected': 'error',
      'Agreement_Sent': 'primary',
      'Agreement_Accepted': 'success',
      'Completed': 'success'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <AccessTimeIcon />,
      'Approved': <CheckCircleIcon />,
      'Rejected': <CancelIcon />,
      'Agreement_Sent': <SendIcon />,
      'Agreement_Accepted': <AssignmentIcon />,
      'Completed': <CheckCircleIcon />
    };
    return icons[status] || <AccessTimeIcon />;
  };

  const getWorkflowSteps = () => [
    'Request Sent',
    'Under Review',
    'Agreement Received',
    'Agreement Accepted',
    'Property Assigned'
  ];

  const getActiveStep = (status) => {
    const stepMap = {
      'Pending': 0,
      'Approved': 1,
      'Agreement_Sent': 2,
      'Agreement_Accepted': 3,
      'Completed': 4,
      'Rejected': -1
    };
    return stepMap[status] || 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Property Requests
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
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
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Review
              </Typography>
              <Typography variant="h4">
                {requests.filter(r => r.status === "Pending").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Awaiting Action
              </Typography>
              <Typography variant="h4">
                {requests.filter(r => r.status === "Agreement_Sent").length}
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
              <Typography variant="h4">
                {requests.filter(r => r.status === "Completed").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Landlord</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <HomeIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2">
                        {request.property?.title || 'Unknown Property'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.property?.location || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{request.property?.rent?.toLocaleString() || 'N/A'}/month
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2 }}>
                      {request.landlord?.name?.charAt(0) || 'L'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {request.landlord?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {request.landlord?.email || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(request.status)}
                    label={request.statusDisplay || request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ minWidth: 200 }}>
                    <Stepper activeStep={getActiveStep(request.status)} orientation="horizontal" alternativeLabel>
                      {getWorkflowSteps().map((label, index) => (
                        <Step key={label}>
                          <StepLabel>{index < 3 ? '' : ''}</StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {request.status === 'Agreement_Sent' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleOpenDialog(request, 'agreement')}
                      >
                        Review Agreement
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenDialog(request, 'view')}
                    >
                      View
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No property requests found. Start by browsing available properties and expressing interest.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Request Dialog */}
      <Dialog open={dialogOpen && dialogType === 'view'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Property Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HomeIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle1">{selectedRequest.property?.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRequest.property?.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₹{selectedRequest.property?.rent?.toLocaleString()}/month
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Landlord Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      {selectedRequest.landlord?.name?.charAt(0) || 'L'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{selectedRequest.landlord?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRequest.landlord?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Your Message</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.message || 'No message provided'}
                  </Typography>
                </Grid>

                {selectedRequest.landlordResponse && (
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Landlord Response</Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {selectedRequest.landlordResponse}
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Request Progress</Typography>
                  <Stepper activeStep={getActiveStep(selectedRequest.status)} orientation="vertical">
                    {getWorkflowSteps().map((label, index) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                          <Typography variant="body2" color="text.secondary">
                            {index === 0 && 'Your request has been sent to the landlord'}
                            {index === 1 && 'Landlord is reviewing your request'}
                            {index === 2 && 'Agreement has been sent for your review'}
                            {index === 3 && 'You have accepted the agreement terms'}
                            {index === 4 && 'Property has been assigned to you'}
                          </Typography>
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Agreement Review Dialog */}
      <Dialog open={dialogOpen && dialogType === 'agreement'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Review Agreement</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Please review the agreement terms for {selectedRequest.property?.title}
              </Alert>
              
              <Typography variant="h6" gutterBottom>Agreement Terms</Typography>
              <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedRequest.customAgreementTerms || 
                   selectedRequest.selectedAgreement?.terms || 
                   'No agreement terms available'}
                </Typography>
              </Paper>

              <Alert severity="warning" sx={{ mb: 2 }}>
                By accepting this agreement, you agree to the terms and conditions outlined above. 
                Please read carefully before proceeding.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={() => handleAcceptAgreement(selectedRequest._id)} 
            variant="contained" 
            color="success"
            startIcon={<CheckCircleIcon />}
          >
            Accept Agreement
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestsPage;