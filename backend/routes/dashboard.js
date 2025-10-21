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
    stats: {
      rentDue: 1200,
      maintenanceRequests: 2,
      leaseStatus: "Active"
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
    stats: {
      totalProperties: 5,
      activeTenants: 12,
      monthlyRevenue: 8500
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

export default router;
