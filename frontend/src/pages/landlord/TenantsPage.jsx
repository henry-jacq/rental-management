import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";

const TenantsPage = () => {
  const [requests, setRequests] = useState([]);
  const [currentTenants, setCurrentTenants] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'respond', 'agreement', 'assign'
  const [agreements, setAgreements] = useState([]);
  const [responseData, setResponseData] = useState({
    action: '',
    response: '',
    agreementId: '',
    customTerms: '',
    leaseStartDate: '',
    leaseEndDate: '',
    rentAmount: '',
    securityDeposit: ''
  });

  useEffect(() => {
    fetchPropertyRequests();
    fetchCurrentTenants();
    fetchAgreements();
  }, []);

  const fetchPropertyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/property-requests/landlord', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter out completed requests - they should only appear in Current Tenants tab
        const activeRequests = (data.requests || []).filter(request => request.status !== 'Completed');
        setRequests(activeRequests);
      } else {
        console.error('Failed to fetch property requests');
      }
    } catch (error) {
      console.error('Error fetching property requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentTenants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tenants', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Current tenants response:', data); // Debug log
        setCurrentTenants(data.tenants || []);
      } else {
        console.error('Failed to fetch current tenants:', response.status);
      }
    } catch (error) {
      console.error('Error fetching current tenants:', error);
    }
  };

  const fetchAgreements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/landlord-agreements', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAgreements(data.agreements || []);
      }
    } catch (error) {
      console.error('Error fetching agreements:', error);
    }
  };

  const handleOpenDialog = (request, type) => {
    setSelectedRequest(request);
    setDialogType(type);
    setDialogOpen(true);
    
    // Initialize response data based on dialog type
    if (type === 'assign' && request) {
      setResponseData({
        ...responseData,
        rentAmount: request.property?.rent || '',
        securityDeposit: (request.property?.rent || 0) * 2
      });
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
    setDialogType('');
    setResponseData({
      action: '',
      response: '',
      agreementId: '',
      customTerms: '',
      leaseStartDate: '',
      leaseEndDate: '',
      rentAmount: '',
      securityDeposit: ''
    });
  };

  const handleRespondToRequest = async () => {
    if (!responseData.action) {
      alert('Please select an action');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/property-requests/${selectedRequest._id}/respond`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: responseData.action,
          response: responseData.response
        })
      });

      if (response.ok) {
        await fetchPropertyRequests();
        handleCloseDialog();
        alert('Response sent successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to respond: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleSendAgreement = async () => {
    if (!responseData.customTerms && !responseData.agreementId) {
      alert('Please provide agreement terms or select a template');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/property-requests/${selectedRequest._id}/send-agreement`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agreementId: responseData.agreementId || null,
          customTerms: responseData.customTerms
        })
      });

      if (response.ok) {
        await fetchPropertyRequests();
        handleCloseDialog();
        alert('Agreement sent successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to send agreement: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending agreement:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleCompleteAssignment = async () => {
    const propertyRentalType = selectedRequest?.property?.rentalType || 'Rental';

    // Validate required fields based on property type
    if (!responseData.rentAmount) {
      alert('Please fill in the monthly rent amount');
      return;
    }

    // Validation for Lease properties - lease dates are mandatory
    if (propertyRentalType === 'Lease') {
      if (!responseData.leaseStartDate || !responseData.leaseEndDate) {
        alert('Lease start and end dates are required for lease properties');
        return;
      }
      
      if (new Date(responseData.leaseStartDate) >= new Date(responseData.leaseEndDate)) {
        alert('Lease end date must be after start date');
        return;
      }
    }

    // Validation for Both properties - if lease dates are provided, both must be filled
    if (propertyRentalType === 'Both') {
      const hasStartDate = responseData.leaseStartDate;
      const hasEndDate = responseData.leaseEndDate;
      
      if (hasStartDate && !hasEndDate) {
        alert('Please provide lease end date or leave both dates empty for monthly rental');
        return;
      }
      
      if (!hasStartDate && hasEndDate) {
        alert('Please provide lease start date or leave both dates empty for monthly rental');
        return;
      }
      
      if (hasStartDate && hasEndDate && new Date(responseData.leaseStartDate) >= new Date(responseData.leaseEndDate)) {
        alert('Lease end date must be after start date');
        return;
      }
    }

    // Determine if this is a lease assignment or rental assignment
    const isLeaseAssignment = propertyRentalType === 'Lease' || 
      (propertyRentalType === 'Both' && responseData.leaseStartDate && responseData.leaseEndDate);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/property-requests/${selectedRequest._id}/complete-assignment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leaseStartDate: isLeaseAssignment ? responseData.leaseStartDate : null,
          leaseEndDate: isLeaseAssignment ? responseData.leaseEndDate : null,
          rentAmount: parseFloat(responseData.rentAmount),
          securityDeposit: parseFloat(responseData.securityDeposit),
          assignmentType: isLeaseAssignment ? 'lease' : 'rental' // Add assignment type for backend processing
        })
      });

      if (response.ok) {
        await fetchPropertyRequests();
        await fetchCurrentTenants();
        handleCloseDialog();
        
        const assignmentTypeText = isLeaseAssignment ? 'lease' : 'rental';
        alert(`Property assigned successfully as ${assignmentTypeText}!`);
      } else {
        const errorData = await response.json();
        alert(`Failed to complete assignment: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error completing assignment:', error);
      alert('Network error. Please try again.');
    }
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
    'Request Received',
    'Review & Respond',
    'Send Agreement',
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
          Property Requests & Tenants
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
       
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Tenants
              </Typography>
              <Typography variant="h4">
                {currentTenants.length}
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
              <Typography variant="h4">
                {requests.filter(r => ["Pending", "Approved", "Agreement_Sent", "Agreement_Accepted"].includes(r.status)).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Property Requests" />
        <Tab label="Current Tenants" />
      </Tabs>

      {tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Request Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Workflow</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 2 }}>
                        {request.tenant?.name?.charAt(0) || 'T'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {request.tenant?.name || 'Unknown'}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                          <EmailIcon sx={{ mr: 0.5, fontSize: 14 }} />
                          <Typography variant="body2" color="text.secondary">
                            {request.tenant?.email || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {request.property?.title || 'Unknown Property'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.property?.location || 'N/A'}
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
                      {request.status === 'Pending' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleOpenDialog(request, 'respond')}
                        >
                          Respond
                        </Button>
                      )}
                      {(request.status === 'Approved' || request.status === 'Pending') && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleOpenDialog(request, 'agreement')}
                        >
                          Send Agreement
                        </Button>
                      )}
                      {request.status === 'Agreement_Accepted' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleOpenDialog(request, 'assign')}
                        >
                          Assign Property
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(request, 'view')}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No property requests found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Lease Period</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentTenants.map((tenant) => (
                <TableRow key={tenant._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 2 }}>
                        {tenant.name?.charAt(0) || 'T'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {tenant.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                        <EmailIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">{tenant.email}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">{tenant.phone || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {tenant.property?.title || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tenant.property?.location || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {tenant.lease?.startDate ? new Date(tenant.lease.startDate).toLocaleDateString() : 'N/A'} - {tenant.lease?.endDate ? new Date(tenant.lease.endDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      ₹{tenant.lease?.rentAmount?.toLocaleString() || 'N/A'}/month
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tenant.lease?.status || 'Active'}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {currentTenants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No current tenants found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Response Dialog */}
      <Dialog open={dialogOpen && dialogType === 'respond'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Respond to Property Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Request from {selectedRequest.tenant?.name} for {selectedRequest.property?.title}
              </Alert>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Action</InputLabel>
                <Select
                  value={responseData.action}
                  onChange={(e) => setResponseData({ ...responseData, action: e.target.value })}
                >
                  <MenuItem value="approve">Approve Request</MenuItem>
                  <MenuItem value="reject">Reject Request</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Response Message"
                value={responseData.response}
                onChange={(e) => setResponseData({ ...responseData, response: e.target.value })}
                placeholder="Add a message for the tenant..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleRespondToRequest} variant="contained">
            Send Response
          </Button>
        </DialogActions>
      </Dialog>

      {/* Agreement Dialog */}
      <Dialog open={dialogOpen && dialogType === 'agreement'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Send Agreement</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Sending agreement to {selectedRequest.tenant?.name} for {selectedRequest.property?.title}
              </Alert>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Agreement Template</InputLabel>
                <Select
                  value={responseData.agreementId}
                  onChange={(e) => setResponseData({ ...responseData, agreementId: e.target.value })}
                >
                  <MenuItem value="">Custom Agreement</MenuItem>
                  {agreements.map((agreement) => (
                    <MenuItem key={agreement._id} value={agreement._id}>
                      {agreement.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Agreement Terms"
                value={responseData.customTerms}
                onChange={(e) => setResponseData({ ...responseData, customTerms: e.target.value })}
                placeholder="Enter custom agreement terms or modify selected template..."
                helperText="These terms will be sent to the tenant for review and acceptance"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSendAgreement} variant="contained">
            Send Agreement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={dialogOpen && dialogType === 'assign'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Complete Property Assignment</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                Agreement accepted! Complete the property assignment for {selectedRequest.tenant?.name}
              </Alert>
              
              {/* Property Type Information */}
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {selectedRequest.property?.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedRequest.property?.location}
                </Typography>
                <Chip 
                  label={`${selectedRequest.property?.rentalType || 'Rental'} Property`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2}>
                {/* Rental Properties - Show rental fields */}
                {selectedRequest.property?.rentalType === 'Rental' && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <strong>Rental Property:</strong> This is a monthly rental property. No fixed lease period required.
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Monthly Rent (₹)"
                        value={responseData.rentAmount}
                        onChange={(e) => setResponseData({ ...responseData, rentAmount: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Security Deposit (₹)"
                        value={responseData.securityDeposit}
                        onChange={(e) => setResponseData({ ...responseData, securityDeposit: e.target.value })}
                        helperText="Typically 1-3 months rent"
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* Lease Properties - Show lease fields */}
                {selectedRequest.property?.rentalType === 'Lease' && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <strong>Lease Property:</strong> This property requires a fixed lease period with start and end dates.
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Lease Start Date"
                        value={responseData.leaseStartDate}
                        onChange={(e) => setResponseData({ ...responseData, leaseStartDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                        InputProps={{
                          startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Lease End Date"
                        value={responseData.leaseEndDate}
                        onChange={(e) => setResponseData({ ...responseData, leaseEndDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        required
                        InputProps={{
                          startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Monthly Rent (₹)"
                        value={responseData.rentAmount}
                        onChange={(e) => setResponseData({ ...responseData, rentAmount: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Security Deposit (₹)"
                        value={responseData.securityDeposit}
                        onChange={(e) => setResponseData({ ...responseData, securityDeposit: e.target.value })}
                        helperText="Typically 1-3 months rent"
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* Both (Rental + Lease) Properties - Show all fields */}
                {selectedRequest.property?.rentalType === 'Both' && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <strong>Flexible Property:</strong> This property supports both rental and lease arrangements. 
                        Please specify lease dates to create a fixed-term lease, or leave them empty for a monthly rental.
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Lease Start Date (Optional)"
                        value={responseData.leaseStartDate}
                        onChange={(e) => setResponseData({ ...responseData, leaseStartDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        helperText="Leave empty for monthly rental"
                        InputProps={{
                          startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Lease End Date (Optional)"
                        value={responseData.leaseEndDate}
                        onChange={(e) => setResponseData({ ...responseData, leaseEndDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        helperText="Leave empty for monthly rental"
                        InputProps={{
                          startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Monthly Rent (₹)"
                        value={responseData.rentAmount}
                        onChange={(e) => setResponseData({ ...responseData, rentAmount: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Security Deposit (₹)"
                        value={responseData.securityDeposit}
                        onChange={(e) => setResponseData({ ...responseData, securityDeposit: e.target.value })}
                        helperText="Typically 1-3 months rent"
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                  </>
                )}

                {/* Default case - if rentalType is not set */}
                {!selectedRequest.property?.rentalType && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        <strong>Property Type Not Specified:</strong> Defaulting to rental property settings.
                      </Alert>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Monthly Rent (₹)"
                        value={responseData.rentAmount}
                        onChange={(e) => setResponseData({ ...responseData, rentAmount: e.target.value })}
                        required
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Security Deposit (₹)"
                        value={responseData.securityDeposit}
                        onChange={(e) => setResponseData({ ...responseData, securityDeposit: e.target.value })}
                        InputProps={{
                          startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCompleteAssignment} variant="contained" color="success">
            Complete Assignment
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={dialogOpen && dialogType === 'view'} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Tenant Information</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      {selectedRequest.tenant?.name?.charAt(0) || 'T'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{selectedRequest.tenant?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRequest.tenant?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
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

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Request Message</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.message || 'No message provided'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Workflow Progress</Typography>
                  <Stepper activeStep={getActiveStep(selectedRequest.status)} orientation="vertical">
                    {getWorkflowSteps().map((label, index) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                          <Typography variant="body2" color="text.secondary">
                            {index === 0 && 'Request submitted by tenant'}
                            {index === 1 && 'Landlord reviews and responds to request'}
                            {index === 2 && 'Agreement sent to tenant for review'}
                            {index === 3 && 'Tenant accepts the agreement terms'}
                            {index === 4 && 'Property assigned and lease activated'}
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
    </Box>
  );
};

export default TenantsPage;
