import express from "express";
import { requireRole } from "../middleware/auth.js";
import Property from "../models/Property.js";

const router = express.Router();

// Get available properties for tenants
router.get("/available", requireRole(["tenant"]), async (req, res) => {
  try {
    const { search, minPrice, maxPrice, propertyType, location } = req.query;
    
    // Build query for available properties
    let query = { 
      available: true, 
      status: "Available" 
    };

    // Apply filters
    if (minPrice || maxPrice) {
      query.rent = {};
      if (minPrice) query.rent.$gte = parseInt(minPrice);
      if (maxPrice) query.rent.$lte = parseInt(maxPrice);
    }

    if (propertyType) {
      query.type = propertyType;
    }

    if (location) {
      query.$or = [
        { location: { $regex: location, $options: 'i' } },
        { address: { $regex: location, $options: 'i' } }
      ];
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch properties from database
    let properties = await Property.find(query)
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Transform data for frontend compatibility
    properties = properties.map(property => ({
      id: property._id,
      title: property.title,
      description: property.description,
      rent: property.rent,
      deposit: property.deposit,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      location: property.location,
      address: property.address,
      amenities: property.amenities || [],
      images: property.images || [],
      landlord: {
        name: property.landlord?.name || "Property Owner",
        phone: property.landlord?.phone || "Contact via platform",
        email: property.landlord?.email || "Contact via platform",
        rating: 4.5 // Default rating for now
      },
      available: property.available,
      availableFrom: property.availableFrom || new Date().toISOString().split('T')[0],
      createdAt: property.createdAt
    }));

    // If no properties found in database, return mock data for demo
    if (properties.length === 0) {
      properties = [
        {
          id: 1,
          title: "Modern 2BHK Apartment",
          description: "Spacious 2-bedroom apartment with modern amenities in prime location",
          rent: 25000,
          deposit: 50000,
          type: "Apartment",
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          location: "Koramangala, Bangalore",
          address: "123 Main Street, Koramangala, Bangalore - 560034",
          amenities: ["Parking", "Gym", "Swimming Pool", "Security", "Power Backup"],
          images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400"
          ],
          landlord: {
            name: "Rajesh Kumar",
            phone: "+91 98765 43210",
            email: "rajesh.kumar@example.com",
            rating: 4.5
          },
          available: true,
          availableFrom: "2024-12-01",
          createdAt: new Date("2024-10-01")
        },
        {
          id: 2,
          title: "Cozy 1BHK Studio",
          description: "Perfect for young professionals, fully furnished studio apartment",
          rent: 18000,
          deposit: 36000,
          type: "Studio",
          bedrooms: 1,
          bathrooms: 1,
          area: 600,
          location: "Indiranagar, Bangalore",
          address: "456 Park Avenue, Indiranagar, Bangalore - 560038",
          amenities: ["Furnished", "WiFi", "AC", "Security", "Parking"],
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
          ],
          landlord: {
            name: "Priya Sharma",
            phone: "+91 87654 32109",
            email: "priya.sharma@example.com",
            rating: 4.8
          },
          available: true,
          availableFrom: "2024-11-25",
          createdAt: new Date("2024-09-15")
        }
      ];
    }

    res.json({
      properties,
      total: properties.length,
      available: properties.filter(p => p.available).length
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get property details by ID
router.get("/:id", requireRole(["tenant"]), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'name email phone')
      .lean();
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Transform data for frontend compatibility
    const transformedProperty = {
      id: property._id,
      title: property.title,
      description: property.description,
      rent: property.rent,
      deposit: property.deposit,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      location: property.location,
      address: property.address,
      amenities: property.amenities || [],
      images: property.images || [],
      landlord: {
        name: property.landlord?.name || "Property Owner",
        phone: property.landlord?.phone || "Contact via platform",
        email: property.landlord?.email || "Contact via platform",
        rating: 4.5
      },
      available: property.available,
      availableFrom: property.availableFrom || new Date().toISOString().split('T')[0],
      createdAt: property.createdAt
    };

    res.json(transformedProperty);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: error.message });
  }
});

// Express interest in a property
router.post("/:id/interest", requireRole(["tenant"]), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { message } = req.body;
    
    // Check if property exists
    const property = await Property.findById(propertyId).populate('landlord');
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // In a real application, this would:
    // 1. Create an interest record in the database
    // 2. Send notification to landlord
    // 3. Send confirmation email to tenant
    
    const interestRecord = {
      id: Date.now(),
      propertyId,
      tenantId: req.userData._id,
      tenantName: req.userData.name,
      tenantEmail: req.userData.email,
      tenantPhone: req.userData.phone,
      message: message || "I am interested in this property. Please contact me.",
      createdAt: new Date(),
      status: "pending"
    };

    // Increment inquiries count
    property.inquiries = (property.inquiries || 0) + 1;
    await property.save();

    res.status(201).json({
      message: "Interest expressed successfully! The landlord will contact you soon.",
      interest: interestRecord
    });
  } catch (error) {
    console.error("Error expressing interest:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;