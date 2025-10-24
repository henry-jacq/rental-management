import express from "express";
import { requireRole } from "../middleware/auth.js";
import User from "../models/User.js";
import PropertyRequest from "../models/PropertyRequest.js";
import Property from "../models/Property.js";

const router = express.Router();

router.get("/tenant", requireRole(["tenant"]), (req, res) => {
  // Use real user data from database
  const dashboardData = {
    message: `Welcome Tenant ${req.userData.name}`,
    user: {
      id: req.userData._id,
      name: req.userData.name,
      role: req.userData.role,
      email: req.userData.email,
      phone: req.userData.phone,
      initials: req.userData.initials
    },
    stats: {
      rentDue: req.userData.lease?.rentAmount || 0,

      leaseStatus: req.userData.lease?.status || "Pending",
      nextPaymentDate: "December 1, 2024" // TODO: Calculate next payment date
    },
    recentPayments: [
      // TODO: Fetch from payments collection
      { date: "2024-11-01", amount: req.userData.lease?.rentAmount || 1200, status: "Paid" },
      { date: "2024-10-01", amount: req.userData.lease?.rentAmount || 1200, status: "Paid" }
    ]
  };

  res.json(dashboardData);
});

router.get("/landlord", requireRole(["landlord"]), async (req, res) => {
  try {
    // Calculate active tenants from completed property requests
    const activeTenants = await PropertyRequest.countDocuments({
      landlord: req.userData._id,
      status: "Completed"
    });

    // Calculate total properties owned
    const totalProperties = await Property.countDocuments({
      landlord: req.userData._id
    });

    // Calculate monthly revenue from active leases
    const completedRequests = await PropertyRequest.find({
      landlord: req.userData._id,
      status: "Completed"
    });
    
    const monthlyRevenue = completedRequests.reduce((total, request) => {
      return total + (request.rentAmount || 0);
    }, 0);

    // Calculate occupancy rate
    const occupancyRate = totalProperties > 0 ? Math.round((activeTenants / totalProperties) * 100) : 0;

    const dashboardData = {
      message: `Welcome Landlord ${req.userData.name}`,
      user: {
        id: req.userData._id,
        name: req.userData.name,
        role: req.userData.role,
        email: req.userData.email,
        phone: req.userData.phone,
        initials: req.userData.initials
      },
      stats: {
        totalProperties,
        activeTenants,
        monthlyRevenue,
        occupancyRate
      },
      recentActivity: [
        // TODO: Fetch from payments collection
        { type: "Payment", description: "Recent rent payment received", amount: 1200 }
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching landlord dashboard:", error);
    res.status(500).json({ error: error.message });
  }
});

// User profile endpoint
router.get("/profile", async (req, res) => {
  try {
    // Use real user data from database (already fetched by middleware)
    const userProfile = {
      id: req.userData._id,
      name: req.userData.name,
      role: req.userData.role,
      email: req.userData.email,
      initials: req.userData.initials,
      phone: req.userData.phone || "",
      emergencyContact: req.userData.emergencyContact || "",
      joinDate: req.userData.createdAt ? new Date(req.userData.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) : "Not available",
      address: req.userData.address || {
        line1: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
      },
      kyc: {
        status: req.userData.kyc?.status || "Pending"
      },
      // Role-specific data
      ...(req.userData.role === 'landlord' && {
        propertiesOwned: req.userData.propertiesOwned || [],
        digitalSignature: req.userData.digitalSignature,
        company: req.userData.company
      }),
      ...(req.userData.role === 'tenant' && {
        propertyRented: req.userData.propertyRented,
        lease: req.userData.lease,

      })
    };

    res.json(userProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile endpoint
router.put("/profile", async (req, res) => {
  try {
    const { name, phone, emergencyContact, address, company } = req.body;
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (address) updateData.address = address;
    if (company && req.userData.role === 'landlord') updateData.company = company;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      req.userData._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        emergencyContact: updatedUser.emergencyContact,
        address: updatedUser.address,
        initials: updatedUser.name ? updatedUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : ""
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;