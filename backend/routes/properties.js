import express from "express";
import Property from "../models/Property.js";
import User from "../models/User.js";
import { authenticateToken } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Get all properties for a landlord
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    const properties = await Property.find({ landlord: req.user.id })
      .populate('currentTenant', 'name email')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single property by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('currentTenant', 'name email phone')
      .populate('landlord', 'name email');

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user is the landlord or the current tenant
    if (req.user.role === "landlord" && property.landlord._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.user.role === "tenant" && (!property.currentTenant || property.currentTenant._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload property images
router.post("/upload-images", authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    // Generate URLs for uploaded images
    const imageUrls = req.files.map(file => `/uploads/properties/${file.filename}`);

    res.json({
      message: "Images uploaded successfully",
      images: imageUrls
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Server error during image upload" });
  }
});

// Create a new property
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    const {
      name,
      address,
      type,
      rent,
      status,
      description,
      bedrooms,
      bathrooms,
      area,
      amenities,
      deposit,
      utilities,
      images
    } = req.body;

    // Validate required fields
    if (!name || !address || !type || !rent) {
      return res.status(400).json({ 
        message: "Missing required fields: name, address, type, and rent are required" 
      });
    }

    const property = new Property({
      name,
      address,
      type,
      rent,
      status: status || "Available",
      description,
      bedrooms,
      bathrooms,
      area,
      amenities: amenities || [],
      deposit: deposit || 0,
      utilities: utilities || {},
      images: images || [],
      landlord: req.user.id
    });

    const savedProperty = await property.save();

    // Add property to landlord's propertiesOwned array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { propertiesOwned: savedProperty._id } }
    );

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a property
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns this property
    if (property.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You don't own this property." });
    }

    const {
      name,
      address,
      type,
      rent,
      status,
      description,
      bedrooms,
      bathrooms,
      area,
      amenities,
      deposit,
      utilities,
      images
    } = req.body;

    // Update fields
    if (name) property.name = name;
    if (address) property.address = address;
    if (type) property.type = type;
    if (rent) property.rent = rent;
    if (status) property.status = status;
    if (description !== undefined) property.description = description;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;
    if (area !== undefined) property.area = area;
    if (amenities) property.amenities = amenities;
    if (deposit !== undefined) property.deposit = deposit;
    if (utilities) property.utilities = { ...property.utilities, ...utilities };
    if (images) property.images = images;

    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a property
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns this property
    if (property.landlord.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You don't own this property." });
    }

    // Check if property is currently occupied
    if (property.currentTenant) {
      return res.status(400).json({ 
        message: "Cannot delete property with active tenant. Please end the lease first." 
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    // Remove property from landlord's propertiesOwned array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { propertiesOwned: req.params.id } }
    );

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get property statistics for landlord
router.get("/stats/overview", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    const totalProperties = await Property.countDocuments({ landlord: req.user.id });
    const occupiedProperties = await Property.countDocuments({ 
      landlord: req.user.id, 
      status: "Occupied" 
    });
    const availableProperties = await Property.countDocuments({ 
      landlord: req.user.id, 
      status: "Available" 
    });
    const maintenanceProperties = await Property.countDocuments({ 
      landlord: req.user.id, 
      status: "Maintenance" 
    });

    // Calculate total monthly revenue
    const occupiedProps = await Property.find({ 
      landlord: req.user.id, 
      status: "Occupied" 
    });
    const monthlyRevenue = occupiedProps.reduce((total, prop) => total + prop.rent, 0);

    res.json({
      totalProperties,
      occupiedProperties,
      availableProperties,
      maintenanceProperties,
      monthlyRevenue,
      occupancyRate: totalProperties > 0 ? ((occupiedProperties / totalProperties) * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error("Error fetching property stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete property image
router.delete("/images/:filename", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Access denied. Landlord role required." });
    }

    const filename = req.params.filename;
    const filePath = path.join('uploads/properties', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;