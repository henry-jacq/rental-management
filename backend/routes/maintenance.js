import express from "express";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get maintenance requests
router.get("/", requireRole(["landlord", "tenant"]), async (req, res) => {
  try {
    // In a real application, fetch from database based on user role and ID
    let requests = [];
    
    if (req.userData.role === "landlord") {
      // Fetch all maintenance requests for landlord's properties
      requests = [
        {
          id: 1,
          property: "Property A",
          tenant: `Tenant of ${req.userData.name}`,
          issue: "Plumbing issue in bathroom",
          priority: "Medium",
          status: "Open",
          dateCreated: "2024-10-15",
          assignedTo: "Maintenance Team",
          landlordId: req.userData._id
        },
        {
          id: 2,
          property: "Property B", 
          tenant: `Tenant of ${req.userData.name}`,
          issue: "Air conditioning not working",
          priority: "High",
          status: "In Progress",
          dateCreated: "2024-10-18",
          assignedTo: "HVAC Specialists",
          landlordId: req.userData._id
        }
      ];
    } else {
      // Fetch maintenance requests for specific tenant
      requests = [
        {
          id: 1,
          property: "Your Unit",
          tenant: req.userData.name,
          issue: "Kitchen faucet leaking",
          priority: "Medium",
          status: "Open",
          dateCreated: "2024-10-20",
          assignedTo: "Pending Assignment",
          tenantId: req.userData._id
        }
      ];
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create maintenance request
router.post("/", requireRole(["tenant", "landlord"]), async (req, res) => {
  try {
    // In a real application, create in database
    const newRequest = {
      id: Date.now(),
      ...req.body,
      dateCreated: new Date().toISOString().split('T')[0],
      status: "Open",
      [req.userData.role === "tenant" ? "tenantId" : "landlordId"]: req.userData._id
    };

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update maintenance request
router.put("/:id", requireRole(["landlord"]), async (req, res) => {
  try {
    // In a real application, update in database
    const updatedRequest = {
      id: req.params.id,
      ...req.body,
      landlordId: req.userData._id
    };

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;