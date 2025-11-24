import express from "express";
import { requireRole } from "../middleware/auth.js";
import PropertyRequest from "../models/PropertyRequest.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", requireRole(["landlord"]), async (req, res) => {
  try {

    const completedRequests = await PropertyRequest.find({
      landlord: req.userData._id,
      status: "Completed"
    })
    .populate({
      path: 'tenant',
      select: 'name email phone lease propertyRented'
    })
    .populate({
      path: 'property',
      select: 'title location address rent type bedrooms bathrooms deposit'
    })
    .sort({ assignedAt: -1 });

    const tenants = completedRequests.map(request => ({
      _id: request.tenant._id,
      name: request.tenant.name,
      email: request.tenant.email,
      phone: request.tenant.phone || "Not provided",
      property: {
        _id: request.property._id,
        title: request.property.title,
        location: request.property.location,
        address: request.property.address,
        rent: request.property.rent,
        type: request.property.type,
        bedrooms: request.property.bedrooms,
        bathrooms: request.property.bathrooms
      },
      lease: {
        startDate: request.leaseStartDate,
        endDate: request.leaseEndDate,
        status: "Active", // All completed requests are active
        rentAmount: request.rentAmount,
        securityDeposit: request.securityDeposit
      },
      assignedAt: request.assignedAt,
      requestId: request._id
    }));

    res.json({ tenants });
  } catch (error) {
    console.error("Error fetching current tenants:", error);
    res.status(500).json({ 
      error: "Failed to fetch current tenants",
      message: error.message 
    });
  }
});

router.post("/", requireRole(["landlord"]), async (req, res) => {
  try {

    
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

router.put("/:id", requireRole(["landlord"]), async (req, res) => {
  try {

    
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

router.delete("/:id", requireRole(["landlord"]), async (req, res) => {
  try {

    
    res.json({ message: "Tenant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;