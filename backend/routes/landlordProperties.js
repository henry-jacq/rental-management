import express from "express";
import { requireRole } from "../middleware/auth.js";
import Property from "../models/Property.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/properties';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get all properties for the logged-in landlord
router.get("/", requireRole(["landlord"]), async (req, res) => {
    try {
        const properties = await Property.find({ landlord: req.userData._id })
            .populate('currentTenant', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(properties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get a specific property by ID
router.get("/:id", requireRole(["landlord"]), async (req, res) => {
    try {
        const property = await Property.findOne({
            _id: req.params.id,
            landlord: req.userData._id
        }).populate('currentTenant', 'name email phone');

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (error) {
        console.error("Error fetching property:", error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new property
router.post("/", requireRole(["landlord"]), async (req, res) => {
    try {
        const {
            title,
            description,
            rent,
            deposit,
            type,
            bedrooms,
            bathrooms,
            area,
            location,
            address,
            amenities,
            furnished,
            parking,
            petFriendly,
            preferredTenantType,
            minimumLeasePeriod,
            rentalType
        } = req.body;

        const property = new Property({
            title,
            description,
            rent: parseFloat(rent),
            deposit: parseFloat(deposit),
            type,
            bedrooms: parseInt(bedrooms),
            bathrooms: parseInt(bathrooms),
            area: parseInt(area),
            location,
            address,
            amenities: amenities || [],
            furnished: furnished || "Unfurnished",
            parking: parking || false,
            petFriendly: petFriendly || false,
            preferredTenantType: preferredTenantType || "Any",
            minimumLeasePeriod: parseInt(minimumLeasePeriod) || 12,
            rentalType: rentalType || "Rental",
            landlord: req.userData._id,
            available: true,
            status: "Available"
        });

        const savedProperty = await property.save();
        await savedProperty.populate('currentTenant', 'name email phone');

        res.status(201).json(savedProperty);
    } catch (error) {
        console.error("Error creating property:", error);
        res.status(500).json({ error: error.message });
    }
});

// Update a property
router.put("/:id", requireRole(["landlord"]), async (req, res) => {
    try {
        const property = await Property.findOneAndUpdate(
            { _id: req.params.id, landlord: req.userData._id },
            req.body,
            { new: true, runValidators: true }
        ).populate('currentTenant', 'name email phone');

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.json(property);
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ error: error.message });
    }
});

// Delete a property
router.delete("/:id", requireRole(["landlord"]), async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({
            _id: req.params.id,
            landlord: req.userData._id
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Delete associated images
        if (property.images && property.images.length > 0) {
            property.images.forEach(imagePath => {
                const fullPath = path.join(process.cwd(), imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        res.json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        res.status(500).json({ error: error.message });
    }
});

// Upload property images
router.post("/:id/images", requireRole(["landlord"]), upload.array('images', 10), async (req, res) => {
    try {
        const property = await Property.findOne({
            _id: req.params.id,
            landlord: req.userData._id
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        const imagePaths = req.files.map(file => `/uploads/properties/${file.filename}`);

        // Add new images to existing ones
        property.images = [...(property.images || []), ...imagePaths];
        await property.save();

        res.json({
            message: "Images uploaded successfully",
            images: imagePaths,
            property: property
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ error: error.message });
    }
});

// Remove a specific image from property
router.delete("/:id/images/:imageIndex", requireRole(["landlord"]), async (req, res) => {
    try {
        const property = await Property.findOne({
            _id: req.params.id,
            landlord: req.userData._id
        });

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        const imageIndex = parseInt(req.params.imageIndex);
        if (imageIndex < 0 || imageIndex >= property.images.length) {
            return res.status(400).json({ message: "Invalid image index" });
        }

        // Delete the image file
        const imagePath = property.images[imageIndex];
        const fullPath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }

        // Remove from array
        property.images.splice(imageIndex, 1);
        await property.save();

        res.json({
            message: "Image removed successfully",
            property: property
        });
    } catch (error) {
        console.error("Error removing image:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;