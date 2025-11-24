import express from "express";
import { requireRole } from "../middleware/auth.js";
import Property from "../models/Property.js";
import PropertyRequest from "../models/PropertyRequest.js";

const router = express.Router();

router.get("/available", requireRole(["tenant"]), async (req, res) => {
  try {
    const { search, minPrice, maxPrice, propertyType, location } = req.query;

    let query = {
      available: true,
      status: "Available"
    };

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

    let properties = await Property.find(query)
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

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
      rentalType: property.rentalType || "Rental",
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
          rentalType: "Both",
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
          rentalType: "Rental",
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
    res.status(500).json({ 
      error: "Failed to fetch properties",
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get("/:id", requireRole(["tenant", "landlord"]), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'name email phone')
      .lean();

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

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
      rentalType: property.rentalType || "Rental",
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

router.post("/:id/interest", requireRole(["tenant"]), async (req, res) => {
  try {
    const propertyId = req.params.id;
    const { message } = req.body;

    const property = await Property.findById(propertyId).populate('landlord');
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (!property.available) {
      return res.status(400).json({ message: "Property is not available" });
    }

    const existingRequest = await PropertyRequest.findOne({
      property: propertyId,
      tenant: req.userData._id,
      status: { $in: ["Pending", "Approved", "Agreement_Sent"] }
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending request for this property"
      });
    }

    const propertyRequest = new PropertyRequest({
      property: propertyId,
      tenant: req.userData._id,
      landlord: property.landlord._id,
      message: message || "I am interested in this property."
    });

    await propertyRequest.save();

    property.inquiries = (property.inquiries || 0) + 1;
    await property.save();

    res.status(201).json({
      message: "Your request has been sent to the property owner!",
      request: propertyRequest
    });
  } catch (error) {
    console.error("Error expressing interest:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/tenants", requireRole(["landlord"]), async (req, res) => {
  try {
    const landlordId = req.userData._id;

    const properties = await Property.find({
      landlord: landlordId,
      currentTenant: { $exists: true, $ne: null }
    }).populate('currentTenant', 'name email phone lease');

    const tenants = properties.map(property => ({
      _id: property.currentTenant._id,
      name: property.currentTenant.name,
      email: property.currentTenant.email,
      phone: property.currentTenant.phone,
      property: {
        _id: property._id,
        title: property.title,
        location: property.location,
        rent: property.rent
      },
      lease: property.currentTenant.lease || {
        startDate: property.leaseStartDate,
        endDate: property.leaseEndDate,
        status: 'Active',
        rentAmount: property.rent
      }
    }));

    res.json({ tenants });
  } catch (error) {
    console.error("Error fetching current tenants:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;