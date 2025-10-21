import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // Mock data - replace with API calls
  useEffect(() => {
    setPayments([
      {
        id: 1,
        tenant: "John Doe",
        property: "Sunset Apartments",
        amount: 1200,
        dueDate: "2024-12-01",
        paidDate: "2024-11-28",
        status: "Paid",
        method: "UPI",
        reference: "TXN123456789",
      },
      {
        id: 2,
        tenant: "Jane Smith",
        property: "Garden Villa",
        amount: 1800,
        dueDate: "2024-12-01",
        paidDate: null,
        status: "Pending",
        method: null,
        reference: null,
      },
      {
        id: 3,
        tenant: "Bob Johnson",
        property: "City Center",
        amount: 1500,
        dueDate: "2024-11-01",
        paidDate: "2024-11-05",
        status: "Overdue",
        method: "Bank Transfer",
        reference: "TXN987654321",
      },
    ]);
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || payment.status === statusFilter;
    const matchesDate = dateFilter === "All" || 
                       (dateFilter === "This Month" && new Date(payment.dueDate).getMonth() === new Date().getMonth()) ||
                       (dateFilter === "Overdue" && payment.status === "Overdue");
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueAmount = payments
    .filter(p => p.status === "Overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Payments Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="success.main">
                ₹{totalRevenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Payments
              </Typography>
              <Typography variant="h4" color="warning.main">
                ₹{pendingAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overdue Amount
              </Typography>
              <Typography variant="h4" color="error.main">
                ₹{overdueAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Collection Rate
              </Typography>
              <Typography variant="h4">
                {Math.round((totalRevenue / (totalRevenue + pendingAmount + overdueAmount)) * 100)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search by tenant or property..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <FormControl fullWidth>
                <InputLabel>Date</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="This Month">This Month</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("All");
                    setDateFilter("All");
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Reference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.tenant}</TableCell>
                <TableCell>{payment.property}</TableCell>
                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentsPage;
