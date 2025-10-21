import express from "express";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get tenant payments
router.get("/tenant", requireRole(["tenant"]), async (req, res) => {
  try {
    // In a real application, fetch from database based on req.user.id
    // const payments = await Payment.find({ tenantId: req.user.id });
    
    // For now, return user-specific mock data
    const payments = [
      {
        id: 1,
        month: "December 2024",
        amount: 1200,
        dueDate: "2024-12-01",
        paidDate: null,
        status: "Pending",
        method: null,
        reference: null,
        tenantId: req.userData._id
      },
      {
        id: 2,
        month: "November 2024", 
        amount: 1200,
        dueDate: "2024-11-01",
        paidDate: "2024-11-28",
        status: "Paid",
        method: "UPI",
        reference: `TXN${req.userData._id}${Date.now()}`,
        tenantId: req.userData._id
      }
    ];

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get landlord payments
router.get("/landlord", requireRole(["landlord"]), async (req, res) => {
  try {
    // In a real application, fetch from database based on landlord's properties
    // const payments = await Payment.find({ landlordId: req.user.id });
    
    // For now, return landlord-specific mock data
    const payments = [
      {
        id: 1,
        tenant: `Tenant of ${req.userData.name}`,
        property: "Property A",
        amount: 1200,
        dueDate: "2024-12-01",
        paidDate: "2024-11-28",
        status: "Paid",
        method: "UPI",
        reference: `TXN${req.userData._id}001`,
        landlordId: req.userData._id
      },
      {
        id: 2,
        tenant: `Tenant of ${req.userData.name}`,
        property: "Property B",
        amount: 1800,
        dueDate: "2024-12-01",
        paidDate: null,
        status: "Pending",
        method: null,
        reference: null,
        landlordId: req.userData._id
      }
    ];

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;