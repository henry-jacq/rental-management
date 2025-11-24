import express from "express";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/financial", requireRole(["landlord"]), async (req, res) => {
  try {
    const { range } = req.query;

    const baseRevenue = 5000;
    const multiplier = range === "year" ? 12 : range === "quarter" ? 3 : 1;
    
    const financialData = {
      totalRevenue: baseRevenue * multiplier,
      totalExpenses: Math.floor(baseRevenue * multiplier * 0.2),
      netIncome: Math.floor(baseRevenue * multiplier * 0.8),
      occupancyRate: 85 + Math.floor(Math.random() * 15),
      monthlyBreakdown: [
        { 
          month: "Current Period", 
          revenue: baseRevenue, 
          expenses: Math.floor(baseRevenue * 0.2), 
          net: Math.floor(baseRevenue * 0.8) 
        }
      ],
      landlordId: req.userData._id
    };

    res.json(financialData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/property", requireRole(["landlord"]), async (req, res) => {
  try {

    const propertyData = [
      { 
        property: "Property A", 
        rent: 1200, 
        status: "Occupied", 
        tenant: `Tenant of ${req.userData.name}`,
        landlordId: req.userData._id
      },
      { 
        property: "Property B", 
        rent: 1800, 
        status: "Occupied", 
        tenant: `Tenant of ${req.userData.name}`,
        landlordId: req.userData._id
      }
    ];

    res.json(propertyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;