import express from "express";
import { requireRole } from "../middleware/auth.js";
import PropertyRequest from "../models/PropertyRequest.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

const router = express.Router();

// Get all current tenants for a landlord (from completed property requests)
router.get("/", requireRole(["landlord"]), async (req, res) => {
  try {
    console.log("Fetching current tenants for landlord:", req.userData._id);

    // Get all completed property requests for this landlord
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
      select: 'title location address rent type bedrooms bathrooms'
    })
    .sort({ assignedAt: -1 });

    console.log(`Found ${completedRequests.length} completed requests`);
    console.log("Completed requests:", completedRequests.map(r => ({
      id: r._id,
      tenant: r.tenant?.name,
      property: r.property?.title,
      status: r.status
    })));

    // Transform the data to match the expected tenant format
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

    console.log(`Returning ${tenants.length} current tenants`);
    res.json({ tenants });
  } catch (error) {
    console.error("Error fetching current tenants:", error);
    res.status(500).json({ 
      error: "Failed to fetch current tenants",
      message: error.message 
    });
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