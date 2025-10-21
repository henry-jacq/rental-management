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
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [message, setMessage] = useState("");

  // Mock data - replace with API calls
  useEffect(() => {
    setPayments([
      {
        id: 1,
        month: "December 2024",
        amount: 1200,
        dueDate: "2024-12-01",
        paidDate: null,
        status: "Pending",
        method: null,
        reference: null,
      },
      {
        id: 2,
        month: "November 2024",
        amount: 1200,
        dueDate: "2024-11-01",
        paidDate: "2024-11-28",
        status: "Paid",
        method: "UPI",
        reference: "TXN123456789",
      },
      {
        id: 3,
        month: "October 2024",
        amount: 1200,
        dueDate: "2024-10-01",
        paidDate: "2024-10-05",
        status: "Paid",
        method: "Bank Transfer",
        reference: "TXN987654321",
      },
    ]);
  }, []);

  const handlePayment = () => {
    // API call to process payment
    setMessage("Payment processed successfully!");
    setOpenPayment(false);
    setPaymentAmount("");
    setPaymentMethod("");
    setTimeout(() => setMessage(""), 3000);
  };

  const pendingPayment = payments.find(p => p.status === "Pending");
  const totalPaid = payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Payment History
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
                Current Due
              </Typography>
              <Typography variant="h4" color="warning.main">
                ${pendingPayment?.amount || 0}
              </Typography>
              {pendingPayment && (
                <Typography variant="body2" color="text.secondary">
                  Due: {new Date(pendingPayment.dueDate).toLocaleDateString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Paid
              </Typography>
              <Typography variant="h4" color="success.main">
                ${totalPaid.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Payment History
              </Typography>
              <Typography variant="h4">
                {payments.filter(p => p.status === "Paid").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                On-Time Rate
              </Typography>
              <Typography variant="h4">
                95%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Actions */}
      {pendingPayment && (
        <Card sx={{ mb: 3, bgcolor: "warning.light" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Payment Due: ${pendingPayment.amount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due Date: {new Date(pendingPayment.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={() => setOpenPayment(true)}
                size="large"
              >
                Pay Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Payment History Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.month}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={payment.status}
                    color={
                      payment.status === "Paid" ? "success" :
                      payment.status === "Pending" ? "warning" : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{payment.method || "-"}</TableCell>
                <TableCell>{payment.reference || "-"}</TableCell>
                <TableCell>
                  {payment.status === "Paid" && (
                    <Button
                      size="small"
                      startIcon={<ReceiptIcon />}
                      onClick={() => {/* Download receipt */}}
                    >
                      Receipt
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Dialog */}
      <Dialog open={openPayment} onClose={() => setOpenPayment(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Make Payment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Debit Card">Debit Card</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
          <Button onClick={handlePayment} variant="contained">
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsPage;
