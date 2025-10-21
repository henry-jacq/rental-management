import express from "express";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Get available properties for tenants
router.get("/available", requireRole(["tenant"]), async (req, res) => {
  try {
    const { search, minPrice, maxPrice, propertyType, location } = req.query;
    
    // In a real application, this would fetch from Property collection
    // For now, return mock data that can be filtered
    let properties = [
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
      },
      {
        id: 3,
        title: "Luxury 3BHK Villa",
        description: "Spacious villa with garden, perfect for families",
        rent: 45000,
        deposit: 90000,
        type: "Villa",
        bedrooms: 3,
        bathrooms: 3,
        area: 2000,
        location: "Whitefield, Bangalore",
        address: "789 Garden View, Whitefield, Bangalore - 560066",
        amenities: ["Garden", "Parking", "Security", "Power Backup", "Water Supply"],
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400"
        ],
        landlord: {
          name: "Amit Patel",
          phone: "+91 76543 21098",
          email: "amit.patel@example.com",
          rating: 4.3
        },
        available: true,
        availableFrom: "2024-12-15",
        createdAt: new Date("2024-10-10")
      },
      {
        id: 4,
        title: "Budget 1BHK Apartment",
        description: "Affordable housing option with basic amenities",
        rent: 12000,
        deposit: 24000,
        type: "Apartment",
        bedrooms: 1,
        bathrooms: 1,
        area: 500,
        location: "Electronic City, Bangalore",
        address: "321 Tech Park Road, Electronic City, Bangalore - 560100",
        amenities: ["Security", "Water Supply", "Parking"],
        images: [
          "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400"
        ],
        landlord: {
          name: "Sunita Reddy",
          phone: "+91 65432 10987",
          email: "sunita.reddy@example.com",
          rating: 4.0
        },
        available: false,
        availableFrom: "2025-01-01",
        createdAt: new Date("2024-09-20")
      },
      {
        id: 5,
        title: "Premium 2BHK with Balcony",
        description: "Beautiful apartment with city view and spacious balcony",
        rent: 32000,
        deposit: 64000,
        type: "Apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: 1100,
        location: "HSR Layout, Bangalore",
        address: "567 City View Apartments, HSR Layout, Bangalore - 560102",
        amenities: ["Balcony", "City View", "Gym", "Swimming Pool", "Security", "Parking"],
        images: [
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400"
        ],
        landlord: {
          name: "Kavitha Nair",
          phone: "+91 54321 09876",
          email: "kavitha.nair@example.com",
          rating: 4.7
        },
        available: true,
        availableFrom: "2024-11-30",
        createdAt: new Date("2024-10-05")
      }
    ];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      properties = properties.filter(property =>
        property.title.toLowerCase().includes(searchLower) ||
        property.location.toLowerCase().includes(searchLower) ||
        property.description.toLowerCase().includes(searchLower)
      );
    }

    if (minPrice) {
      properties = properties.filter(property => property.rent >= parseInt(minPrice));
    }

    if (maxPrice) {
      properties = properties.filter(property => property.rent <= parseInt(maxPrice));
    }

    if (propertyType) {
      properties = properties.filter(property => property.type === propertyType);
    }

    if (location) {
      properties = properties.filter(property =>
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sort by creation date (newest first)
    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      properties,
      total: properties.length,
      available: properties.filter(p => p.available).length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get property details by ID
router.get("/:id", requireRole(["tenant"]), async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    
    // In a real application, fetch from database
    // const property = await Property.findById(propertyId).populate('landlord');
    
    // Mock data for now
    const properties = [
      // ... same mock data as above
    ];
    
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Express interest in a property
router.post("/:id/interest", requireRole(["tenant"]), async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const { message } = req.body;
    
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

    // Mock response
    res.status(201).json({
      message: "Interest expressed successfully! The landlord will contact you soon.",
      interest: interestRecord
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;