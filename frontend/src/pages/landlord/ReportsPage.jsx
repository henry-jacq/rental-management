import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";
import {
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
} from "@mui/icons-material";

const ReportsPage = () => {
  const [reportType, setReportType] = useState("financial");
  const [dateRange, setDateRange] = useState("month");

  const financialData = {
    totalRevenue: 15750,
    totalExpenses: 3200,
    netIncome: 12550,
    occupancyRate: 92,
    monthlyBreakdown: [
      { month: "October 2024", revenue: 5250, expenses: 800, net: 4450 },
      { month: "September 2024", revenue: 5250, expenses: 1200, net: 4050 },
      { month: "August 2024", revenue: 5250, expenses: 1200, net: 4050 },
    ]
  };

  const propertyData = [
    { property: "123 Main St, Apt 2A", rent: 1750, status: "Occupied", tenant: "John Doe" },
    { property: "456 Oak Ave, Unit 1B", rent: 1800, status: "Occupied", tenant: "Jane Smith" },
    { property: "789 Pine St, Apt 3C", rent: 1700, status: "Occupied", tenant: "Bob Johnson" },
    { property: "321 Elm St, Unit 2B", rent: 1650, status: "Vacant", tenant: "-" },
  ];

  const maintenanceData = [
    { month: "October 2024", requests: 8, completed: 6, pending: 2, cost: 1200 },
    { month: "September 2024", requests: 12, completed: 10, pending: 2, cost: 1800 },
    { month: "August 2024", requests: 6, completed: 6, pending: 0, cost: 900 },
  ];

  const handleExportReport = () => {
    // Handle report export functionality
    console.log("Exporting report...");
  };

  const renderFinancialReport = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <MoneyIcon color="success" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h5" color="success.main">
                  ₹{financialData.totalRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <TrendingUpIcon color="error" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h5" color="error.main">
                  ₹{financialData.totalExpenses.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Expenses
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <AssessmentIcon color="primary" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h5" color="primary">
                  ₹{financialData.netIncome.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Income
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center">
              <HomeIcon color="info" sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h5" color="info.main">
                  {financialData.occupancyRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Occupancy Rate
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Financial Breakdown
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell align="right">Revenue</TableCell>
                  <TableCell align="right">Expenses</TableCell>
                  <TableCell align="right">Net Income</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {financialData.monthlyBreakdown.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell align="right">₹{row.revenue.toLocaleString()}</TableCell>
                    <TableCell align="right">₹{row.expenses.toLocaleString()}</TableCell>
                    <TableCell align="right">₹{row.net.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderPropertyReport = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Property Performance Report
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell align="right">Monthly Rent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Tenant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {propertyData.map((property, index) => (
              <TableRow key={index}>
                <TableCell>{property.property}</TableCell>
                <TableCell align="right">₹{property.rent.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={property.status}
                    color={property.status === "Occupied" ? "success" : "warning"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{property.tenant}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderMaintenanceReport = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Maintenance Report
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell align="right">Total Requests</TableCell>
              <TableCell align="right">Completed</TableCell>
              <TableCell align="right">Pending</TableCell>
              <TableCell align="right">Total Cost</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {maintenanceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.month}</TableCell>
                <TableCell align="right">{row.requests}</TableCell>
                <TableCell align="right">{row.completed}</TableCell>
                <TableCell align="right">{row.pending}</TableCell>
                <TableCell align="right">₹{row.cost.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate comprehensive reports for your rental properties
      </Typography>

      {/* Report Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportType}
                label="Report Type"
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="financial">Financial Report</MenuItem>
                <MenuItem value="property">Property Report</MenuItem>
                <MenuItem value="maintenance">Maintenance Report</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportReport}
              fullWidth
            >
              Export Report
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Content */}
      {reportType === "financial" && renderFinancialReport()}
      {reportType === "property" && renderPropertyReport()}
      {reportType === "maintenance" && renderMaintenanceReport()}
    </Box>
  );
};

export default ReportsPage;