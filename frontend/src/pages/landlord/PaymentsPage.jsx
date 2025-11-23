import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, Card, CardContent, Grid, IconButton
} from '@mui/material';
import { Payment as PaymentIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    amount: '',
    month: '',
    monthInput: '', // For the month picker (YYYY-MM format)
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [paymentsRes, tenantsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payments/landlord', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/tenants', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setPayments(paymentsRes.data.payments || []);
      setTenants(tenantsRes.data.tenants || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setPayments([]);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    const now = new Date();
    const currentMonthInput = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setFormData({ 
      tenantId: '', 
      propertyId: '', 
      amount: '', 
      month: '', 
      monthInput: currentMonthInput,
      dueDate: '', 
      notes: '' 
    });
    setError('');
  };

  const handleTenantChange = (value) => {
    const [tenantId, propertyId] = value.split('|');
    const tenant = tenants.find(t => t._id === tenantId);
    const amount = tenant?.property?.rent || '';
    setFormData({ ...formData, tenantId, propertyId, amount });
  };

  const handleCreatePayment = async () => {
    if (!formData.tenantId || !formData.propertyId || !formData.amount || !formData.month || !formData.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/payments', {
        tenantId: formData.tenantId,
        propertyId: formData.propertyId,
        amount: parseFloat(formData.amount),
        month: formData.month,
        dueDate: formData.dueDate,
        notes: formData.notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Payment request created successfully!');
      setDialogOpen(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('Delete this payment request?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Payment deleted successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete payment');
    }
  };

  const handleVerifyPayment = async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/payments/${paymentId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Payment verified successfully!');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify payment');
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const reason = window.prompt('Reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/payments/${paymentId}/reject`, 
        { reason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setSuccess('Payment rejected');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to reject payment');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Verified') return 'success';
    if (status === 'Submitted') return 'info';
    if (status === 'Overdue') return 'error';
    return 'warning';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const pendingCount = payments.filter(p => p.status === 'Pending').length;
  const submittedCount = payments.filter(p => p.status === 'Submitted').length;
  const overdueCount = payments.filter(p => p.status === 'Overdue').length;
  const verifiedCount = payments.filter(p => p.status === 'Verified').length;
  const totalCollected = payments.filter(p => p.status === 'Verified').reduce((sum, p) => sum + p.amount, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <PaymentIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4">Payment Management</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Request Payment
        </Button>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && !dialogOpen && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>Pending</Typography>
              <Typography variant="h4">{pendingCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>Awaiting Verification</Typography>
              <Typography variant="h4">{submittedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>Verified</Typography>
              <Typography variant="h4">{verifiedCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" gutterBottom>Total Collected</Typography>
              <Typography variant="h4">₹{totalCollected.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tenant</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>{payment.tenant?.name}</TableCell>
                  <TableCell>{payment.property?.title}</TableCell>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(payment.dueDate)}</TableCell>
                  <TableCell>
                    <Chip label={payment.status} color={getStatusColor(payment.status)} size="small" />
                  </TableCell>
                  <TableCell>
                    {payment.status === 'Submitted' && (
                      <Box display="flex" gap={1}>
                        <Button size="small" variant="contained" color="success" onClick={() => handleVerifyPayment(payment._id)}>
                          Approve
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleRejectPayment(payment._id)}>
                          Reject
                        </Button>
                      </Box>
                    )}
                    {payment.status === 'Pending' && (
                      <IconButton size="small" color="error" onClick={() => handleDeletePayment(payment._id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {payment.status === 'Verified' && (
                      <Typography variant="caption">Completed</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" py={3}>No payments found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Payment Request</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            select
            fullWidth
            label="Select Tenant & Property"
            value={`${formData.tenantId}|${formData.propertyId}`}
            onChange={(e) => handleTenantChange(e.target.value)}
            margin="normal"
            required
          >
            {tenants.filter(t => t.property && t.property._id && t.property.rent).map((tenant) => (
              <MenuItem key={tenant._id} value={`${tenant._id}|${tenant.property._id}`}>
                {tenant.name} - {tenant.property.title} (₹{tenant.property.rent.toLocaleString()}/month)
              </MenuItem>
            ))}
            {tenants.filter(t => t.property && t.property._id && t.property.rent).length === 0 && (
              <MenuItem disabled>No tenants with properties found</MenuItem>
            )}
          </TextField>

          {formData.amount && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Rent Amount: ₹{parseFloat(formData.amount).toLocaleString()}/month
            </Alert>
          )}

          <TextField
            fullWidth
            type="month"
            label="Month"
            value={formData.monthInput}
            onChange={(e) => {
              // Convert YYYY-MM to "Month Year" format
              const [year, month] = e.target.value.split('-');
              const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
              const monthName = monthNames[parseInt(month) - 1];
              setFormData({ 
                ...formData, 
                monthInput: e.target.value,
                month: `${monthName} ${year}` 
              });
            }}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            helperText="Select month and year"
          />

          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Optional notes"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleCreatePayment} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Create Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentsPage;
