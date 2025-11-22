import express from "express";
import { requireRole } from "../middleware/auth.js";
import PropertyRequest from "../models/PropertyRequest.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Agreement from "../models/Agreement.js";

const router = express.Router();

// Create a new property request (tenant)
router.post("/", requireRole(["tenant"]), async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    // Validate property exists and is available
    const property = await Property.findById(propertyId).populate('landlord');
    if (!property) {
      return res.status(404).json({ 
        error: "Property not found" 
      });
    }

    if (!property.available) {
      return res.status(400).json({ 
        error: "Property is not available for requests" 
      });
    }

    // Check if tenant already has a pending request for this property
    const existingRequest = await PropertyRequest.findOne({
      property: propertyId,
      tenant: req.userData._id,
      status: { $in: ["Pending", "Approved", "Agreement_Sent"] }
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: "You already have a pending request for this property" 
      });
    }

    // Create new request
    const propertyRequest = new PropertyRequest({
      property: propertyId,
      tenant: req.userData._id,
      landlord: property.landlord._id,
      message: message || "I am interested in this property."
    });

    const savedRequest = await propertyRequest.save();
    await savedRequest.populate('property', 'title location address rent');
    await savedRequest.populate('landlord', 'name email');

    res.status(201).json({
      message: "Your request has been sent to the property owner!",
      request: savedRequest
    });
  } catch (error) {
    console.error("Error creating property request:", error);
    res.status(500).json({ 
      error: "Failed to send request",
      message: error.message 
    });
  }
});

// Get all requests for landlord
router.get("/landlord", requireRole(["landlord"]), async (req, res) => {
  try {
    const { status, property, page = 1, limit = 50 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (property) filters.property = property;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Use aggregation for better performance
    const pipeline = [
      { $match: { landlord: req.userData._id, ...filters } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'properties',
          localField: 'property',
          foreignField: '_id',
          as: 'property',
          pipeline: [{ $project: { title: 1, location: 1, address: 1, rent: 1, images: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'tenant',
          foreignField: '_id',
          as: 'tenant',
          pipeline: [{ $project: { name: 1, email: 1, phone: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'agreements',
          localField: 'selectedAgreement',
          foreignField: '_id',
          as: 'selectedAgreement',
          pipeline: [{ $project: { title: 1, terms: 1 } }]
        }
      },
      {
        $addFields: {
          property: { $arrayElemAt: ['$property', 0] },
          tenant: { $arrayElemAt: ['$tenant', 0] },
          selectedAgreement: { $arrayElemAt: ['$selectedAgreement', 0] }
        }
      }
    ];
    
    const requests = await PropertyRequest.aggregate(pipeline);
    
    const total = await PropertyRequest.countDocuments({
      landlord: req.userData._id,
      ...filters
    });

    res.json({
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching property requests:", error);
    res.status(500).json({ 
      error: "Failed to fetch requests",
      message: error.message 
    });
  }
});

// Get all requests for tenant
router.get("/tenant", requireRole(["tenant"]), async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Use aggregation for better performance
    const pipeline = [
      { $match: { tenant: req.userData._id, ...filters } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'properties',
          localField: 'property',
          foreignField: '_id',
          as: 'property',
          pipeline: [{ $project: { title: 1, location: 1, address: 1, rent: 1, images: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'landlord',
          foreignField: '_id',
          as: 'landlord',
          pipeline: [{ $project: { name: 1, email: 1, phone: 1 } }]
        }
      },
      {
        $lookup: {
          from: 'agreements',
          localField: 'selectedAgreement',
          foreignField: '_id',
          as: 'selectedAgreement',
          pipeline: [{ $project: { title: 1, terms: 1 } }]
        }
      },
      {
        $addFields: {
          property: { $arrayElemAt: ['$property', 0] },
          landlord: { $arrayElemAt: ['$landlord', 0] },
          selectedAgreement: { $arrayElemAt: ['$selectedAgreement', 0] }
        }
      }
    ];
    
    const requests = await PropertyRequest.aggregate(pipeline);
    
    const total = await PropertyRequest.countDocuments({
      tenant: req.userData._id,
      ...filters
    });

    res.json({
      requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching tenant requests:", error);
    res.status(500).json({ 
      error: "Failed to fetch requests",
      message: error.message 
    });
  }
});

// Get specific request details
router.get("/:id", requireRole(["landlord", "tenant"]), async (req, res) => {
  try {
    const request = await PropertyRequest.findById(req.params.id)
      .populate('property', 'title location address rent images')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .populate('selectedAgreement');

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Check authorization
    const isAuthorized = request.tenant._id.toString() === req.userData._id.toString() ||
                        request.landlord._id.toString() === req.userData._id.toString();
    
    if (!isAuthorized) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ 
      error: "Failed to fetch request",
      message: error.message 
    });
  }
});

// Landlord responds to request (approve/reject)
router.put("/:id/respond", requireRole(["landlord"]), async (req, res) => {
  try {
    const { action, response } = req.body; // action: 'approve' or 'reject'
    
    const request = await PropertyRequest.findOne({
      _id: req.params.id,
      landlord: req.userData._id,
      status: "Pending"
    });

    if (!request) {
      return res.status(404).json({ 
        error: "Request not found or already processed" 
      });
    }

    if (action === 'approve') {
      await request.approve(response);
    } else if (action === 'reject') {
      await request.reject(response);
    } else {
      return res.status(400).json({ error: "Invalid action" });
    }

    await request.populate('property', 'title location address rent');
    await request.populate('tenant', 'name email phone');

    res.json({
      message: `Request ${action}d successfully`,
      request
    });
  } catch (error) {
    console.error("Error responding to request:", error);
    res.status(500).json({ 
      error: "Failed to respond to request",
      message: error.message 
    });
  }
});

// Landlord sends agreement to tenant
router.put("/:id/send-agreement", requireRole(["landlord"]), async (req, res) => {
  try {
    const { agreementId, customTerms } = req.body;
    
    const request = await PropertyRequest.findOne({
      _id: req.params.id,
      landlord: req.userData._id,
      status: { $in: ["Pending", "Approved"] }
    });

    if (!request) {
      return res.status(404).json({ 
        error: "Request not found or cannot send agreement" 
      });
    }

    // Validate agreement belongs to landlord
    if (agreementId) {
      const agreement = await Agreement.findOne({
        _id: agreementId,
        landlord: req.userData._id
      });
      
      if (!agreement) {
        return res.status(400).json({ error: "Invalid agreement selected" });
      }
    }

    await request.sendAgreement(agreementId, customTerms);
    await request.populate('property', 'title location address rent');
    await request.populate('tenant', 'name email phone');
    await request.populate('selectedAgreement', 'title terms');

    res.json({
      message: "Agreement sent to tenant successfully",
      request
    });
  } catch (error) {
    console.error("Error sending agreement:", error);
    res.status(500).json({ 
      error: "Failed to send agreement",
      message: error.message 
    });
  }
});

// Tenant accepts agreement
router.put("/:id/accept-agreement", requireRole(["tenant"]), async (req, res) => {
  try {
    const request = await PropertyRequest.findOne({
      _id: req.params.id,
      tenant: req.userData._id,
      status: "Agreement_Sent"
    });

    if (!request) {
      return res.status(404).json({ 
        error: "Request not found or agreement not available" 
      });
    }

    await request.acceptAgreement();
    await request.populate('property', 'title location address rent');
    await request.populate('landlord', 'name email phone');

    res.json({
      message: "Agreement accepted successfully",
      request
    });
  } catch (error) {
    console.error("Error accepting agreement:", error);
    res.status(500).json({ 
      error: "Failed to accept agreement",
      message: error.message 
    });
  }
});

// Tenant rejects agreement
router.put("/:id/reject-agreement", requireRole(["tenant"]), async (req, res) => {
  try {
    const { reason } = req.body;
    
    const request = await PropertyRequest.findOne({
      _id: req.params.id,
      tenant: req.userData._id,
      status: "Agreement_Sent"
    });

    if (!request) {
      return res.status(404).json({ 
        error: "Request not found or agreement not available" 
      });
    }

    // Reject the entire request - set status to Rejected
    request.status = "Rejected";
    request.landlordResponse = reason 
      ? `Tenant rejected the agreement. Reason: ${reason}` 
      : "Tenant rejected the agreement.";
    request.responseDate = new Date();
    
    await request.save();
    await request.populate('property', 'title location address rent');
    await request.populate('landlord', 'name email phone');

    res.json({
      message: "Agreement rejected. The property request has been closed.",
      request
    });
  } catch (error) {
    console.error("Error rejecting agreement:", error);
    res.status(500).json({ 
      error: "Failed to reject agreement",
      message: error.message 
    });
  }
});

// Landlord completes assignment (assigns property to tenant)
router.put("/:id/complete-assignment", requireRole(["landlord"]), async (req, res) => {
  try {
    const { leaseStartDate, leaseEndDate, rentAmount, securityDeposit } = req.body;
    
    const request = await PropertyRequest.findOne({
      _id: req.params.id,
      landlord: req.userData._id,
      status: "Agreement_Accepted"
    }).populate('property').populate('tenant');

    if (!request) {
      return res.status(404).json({ 
        error: "Request not found or not ready for assignment" 
      });
    }

    // Complete the assignment
    await request.completeAssignment({
      startDate: leaseStartDate ? new Date(leaseStartDate) : null,
      endDate: leaseEndDate ? new Date(leaseEndDate) : null,
      rentAmount: parseFloat(rentAmount),
      securityDeposit: parseFloat(securityDeposit)
    });

    // Update property status
    const property = await Property.findById(request.property._id);
    property.available = false;
    property.status = "Rented";
    property.currentTenant = request.tenant._id;
    
    // Only set lease dates if provided (for lease properties)
    if (leaseStartDate && leaseEndDate) {
      property.leaseStartDate = new Date(leaseStartDate);
      property.leaseEndDate = new Date(leaseEndDate);
    }
    await property.save();

    // Update tenant's rented property
    const tenant = await User.findById(request.tenant._id);
    tenant.propertyRented = request.property._id;
    
    // Create lease object with conditional dates
    const leaseData = {
      status: "Active",
      rentAmount: parseFloat(rentAmount),
      securityDeposit: parseFloat(securityDeposit)
    };
    
    // Only add lease dates if provided
    if (leaseStartDate && leaseEndDate) {
      leaseData.startDate = new Date(leaseStartDate);
      leaseData.endDate = new Date(leaseEndDate);
    }
    
    tenant.lease = leaseData;
    await tenant.save();

    await request.populate('property', 'title location address rent');
    await request.populate('tenant', 'name email phone');

    res.json({
      message: "Property assigned successfully",
      request
    });
  } catch (error) {
    console.error("Error completing assignment:", error);
    res.status(500).json({ 
      error: "Failed to complete assignment",
      message: error.message 
    });
  }
});

// Get request statistics for dashboard
router.get("/stats/summary", requireRole(["landlord"]), async (req, res) => {
  try {
    const landlordId = req.userData._id;
    
    const stats = await PropertyRequest.aggregate([
      { $match: { landlord: landlordId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
          approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
          agreementSent: { $sum: { $cond: [{ $eq: ["$status", "Agreement_Sent"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      approved: 0,
      agreementSent: 0,
      completed: 0
    };

    res.json({ stats: result });
  } catch (error) {
    console.error("Error fetching request stats:", error);
    res.status(500).json({ 
      error: "Failed to fetch request statistics",
      message: error.message 
    });
  }
});

export default router;