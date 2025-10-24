import { useState, useEffect } from "react";
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
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    occupancyRate: 0,
    monthlyBreakdown: []
  });
  const [propertyData, setPropertyData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, [reportType, dateRange]);

  const fetchReportsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Fetch financial data
      if (reportType === "financial") {
        const response = await fetch(`/api/reports/financial?range=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFinancialData(data);
        }
      }

      // Fetch property data
      if (reportType === "property") {
        const response = await fetch(`/api/reports/property?range=${dateRange}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPropertyData(data);
        }
      }


    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

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

    </Box>
  );
};

export default ReportsPage;