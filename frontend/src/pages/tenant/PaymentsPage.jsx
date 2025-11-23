import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, Card, CardContent, Grid
} from '@mui/material';
import '@mui/icons-material';
import axios from 'axios';

const PaymentsPage = () => {
  const [payments, setPayments] = useState({ pending: [], paid: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/payments/tenant', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError(error.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (payment) => {
    setSelectedPayment(payment);
    setDialogOpen(true);
    setPaymentMethod('');
    setTransactionId('');
    setPaidDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setError('');
  };

  const handleMarkAsPaid = async () => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/payments/${selectedPayment._id}/mark-paid`, {
        paymentMethod, transactionId, paidDate, notes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Payment marked as paid successfully!');
      setDialogOpen(false);
      fetchPayments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark payment as paid');
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" mb={3}>My Payments</Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && !dialogOpen && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Pending</Typography>
            <Typography variant="h5">{payments.pending.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Awaiting Approval</Typography>
            <Typography variant="h5">{payments.submitted.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Verified</Typography>
            <Typography variant="h5">{payments.verified.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body2">Total Due</Typography>
            <Typography variant="h5">
              ₹{payments.pending.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {payments.pending.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Box p={2} bgcolor="grey.100">
            <Typography variant="h6">Pending Payments ({payments.pending.length})</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.pending.map((payment) => (
                  <>
                    <TableRow key={payment._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">{payment.property?.title}</Typography>
                        <Typography variant="caption">{payment.property?.location}</Typography>
                      </TableCell>
                      <TableCell>{payment.month}</TableCell>
                      <TableCell><Typography variant="body1" fontWeight="bold">₹{payment.amount.toLocaleString()}</Typography></TableCell>
                      <TableCell>{formatDate(payment.dueDate)}</TableCell>
                      <TableCell><Chip label={payment.status} color={getStatusColor(payment.status)} size="small" /></TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" size="small" onClick={() => handleOpenDialog(payment)}>
                          Mark as Paid
                        </Button>
                      </TableCell>
                    </TableRow>
                    {payment.rejectionReason && (
                      <TableRow key={`${payment._id}-rejection`}>
                        <TableCell colSpan={6}>
                          <Alert severity="error" sx={{ m: 1 }}>
                            <Typography variant="body2" fontWeight="bold">Payment Rejected by Landlord</Typography>
                            <Typography variant="body2">Reason: {payment.rejectionReason}</Typography>
                          </Alert>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {payments.submitted.length > 0 && (
        <Paper sx={{ mb: 3 }}>
          <Box p={2} bgcolor="info.light">
            <Typography variant="h6">Awaiting Landlord Approval ({payments.submitted.length})</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Submitted Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.submitted.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{payment.property?.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{payment.property?.location}</Typography>
                    </TableCell>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(payment.paidDate)}</TableCell>
                    <TableCell>{payment.paymentMethod || '-'}</TableCell>
                    <TableCell><Chip label="Awaiting Approval" color="info" size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper>
        <Box p={2} bgcolor="grey.100">
          <Typography variant="h6">Verified Payments ({payments.verified.length})</Typography>
        </Box>
        {payments.verified.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.verified.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{payment.property?.title}</Typography>
                      <Typography variant="caption">{payment.property?.location}</Typography>
                    </TableCell>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(payment.paidDate)}</TableCell>
                    <TableCell>{payment.paymentMethod || '-'}</TableCell>
                    <TableCell><Chip label={payment.status} size="small" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box p={3} textAlign="center">
            <Typography>No payment history yet</Typography>
          </Box>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Payment as Paid</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {selectedPayment && (
            <Box mb={3} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="body2">Property</Typography>
              <Typography variant="h6" gutterBottom>{selectedPayment.property?.title}</Typography>
              <Typography variant="body2">Amount</Typography>
              <Typography variant="h5" gutterBottom>₹{selectedPayment.amount.toLocaleString()}</Typography>
              <Typography variant="body2">Month: {selectedPayment.month}</Typography>
            </Box>
          )}

          <TextField select fullWidth label="Payment Method" value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)} margin="normal" required>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
            <MenuItem value="Online">Online Payment</MenuItem>
          </TextField>

          <TextField fullWidth label="Transaction ID / Reference Number" value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)} margin="normal" placeholder="Optional" />

          <TextField fullWidth type="date" label="Payment Date" value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />

          <TextField fullWidth label="Notes" value={notes}
            onChange={(e) => setNotes(e.target.value)} margin="normal" multiline rows={2} placeholder="Optional notes" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleMarkAsPaid} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentsPage;
