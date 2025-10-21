import express from "express";
import { verifyToken } from "../../backend/middleware/auth.js";

const router = express.Router();

// Cache for dashboard data (in production, use Redis or similar)
const dashboardCache = new Map();

router.get("/tenant", verifyToken(["tenant"]), (req, res) => {
  const cacheKey = `tenant_${req.user.id}`;

  // Check cache first
  if (dashboardCache.has(cacheKey)) {
    const cachedData = dashboardCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < 300000) { // 5 minutes cache
      return res.json(cachedData.data);
    }
  }

  // Simulate some processing time
  const dashboardData = {
    message: `Welcome Tenant ${req.user.name}`,
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      email: "tenant@example.com", // In real app, fetch from database
      phone: "+91 87654 32109",
      initials: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    stats: {
      rentDue: 1200,
      maintenanceRequests: 2,
      leaseStatus: "Active",
      nextPaymentDate: "December 1, 2024"
    },
    recentPayments: [
      { date: "2024-11-01", amount: 1200, status: "Paid" },
      { date: "2024-10-01", amount: 1200, status: "Paid" }
    ]
  };

  // Cache the response
  dashboardCache.set(cacheKey, {
    data: dashboardData,
    timestamp: Date.now()
  });

  res.json(dashboardData);
});

router.get("/landlord", verifyToken(["landlord"]), (req, res) => {
  const cacheKey = `landlord_${req.user.id}`;

  // Check cache first
  if (dashboardCache.has(cacheKey)) {
    const cachedData = dashboardCache.get(cacheKey);
    if (Date.now() - cachedData.timestamp < 300000) { // 5 minutes cache
      return res.json(cachedData.data);
    }
  }

  // Simulate some processing time
  const dashboardData = {
    message: `Welcome Landlord ${req.user.name}`,
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      email: "landlord@example.com", // In real app, fetch from database
      phone: "+91 98765 43210",
      initials: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    },
    stats: {
      totalProperties: 5,
      activeTenants: 12,
      monthlyRevenue: 8500,
      occupancyRate: 92
    },
    recentActivity: [
      { type: "Payment", description: "Rent received from John Doe", amount: 1200 },
      { type: "Maintenance", description: "Plumbing issue reported", status: "In Progress" }
    ]
  };

  // Cache the response
  dashboardCache.set(cacheKey, {
    data: dashboardData,
    timestamp: Date.now()
  });

  res.json(dashboardData);
});

// User profile endpoint
router.get("/profile", verifyToken(["tenant", "landlord"]), async (req, res) => {
  try {
    // In a real application, you would fetch from database
    // const user = await User.findById(req.user.id).select('-password');

    const userProfile = {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role,
      email: req.user.role === "landlord" ? "landlord@example.com" : "tenant@example.com",
      phone: req.user.role === "landlord" ? "+91 98765 43210" : "+91 87654 32109",
      initials: req.user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      address: {
        line1: "123 Main Street",
        city: "Mumbai",
        state: "Maharashtra",
        postalCode: "400001",
        country: "India"
      },
      kyc: {
        status: "Verified"
      }
    };

    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
