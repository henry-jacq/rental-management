import express from "express";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get all tenants for a landlord
router.get("/", requireRole(["landlord"]), async (req, res) => {
  try {
    // In a real application, fetch from database based on landlord ID
    // const tenants = await Tenant.find({ landlordId: req.user.id });
    
    // For now, return landlord-specific mock data
    const tenants = [
      {
        id: 1,
        name: `Tenant 1 of ${req.userData.name}`,
        email: `tenant1.${req.userData._id}@example.com`,
        phone: "+1 234-567-8900",
        property: "Property A",
        leaseStart: "2024-01-01",
        leaseEnd: "2024-12-31",
        status: "Active",
        rent: 1200,
        landlordId: req.userData._id
      },
      {
        id: 2,
        name: `Tenant 2 of ${req.userData.name}`,
        email: `tenant2.${req.userData._id}@example.com`,
        phone: "+1 234-567-8901",
        property: "Property B",
        leaseStart: "2024-02-01",
        leaseEnd: "2025-01-31",
        status: "Active",
        rent: 1800,
        landlordId: req.userData._id
      }
    ];

    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new tenant
router.post("/", requireRole(["landlord"]), async (req, res) => {
  try {
    // In a real application, create in database
    // const tenant = await Tenant.create({ ...req.body, landlordId: req.user.id });
    
    const newTenant = {
      id: Date.now(),
      ...req.body,
      landlordId: req.userData._id
    };

    res.status(201).json(newTenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tenant
router.put("/:id", requireRole(["landlord"]), async (req, res) => {
  try {
    // In a real application, update in database
    // const tenant = await Tenant.findOneAndUpdate(
    //   { _id: req.params.id, landlordId: req.user.id },
    //   req.body,
    //   { new: true }
    // );
    
    const updatedTenant = {
      id: req.params.id,
      ...req.body,
      landlordId: req.userData._id
    };

    res.json(updatedTenant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tenant
router.delete("/:id", requireRole(["landlord"]), async (req, res) => {
  try {
    // In a real application, delete from database
    // await Tenant.findOneAndDelete({ _id: req.params.id, landlordId: req.user.id });
    
    res.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;