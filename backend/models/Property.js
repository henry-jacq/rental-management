import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    type: { 
      type: String, 
      enum: ["Apartment", "Studio", "Villa", "House", "Room"], 
      required: true 
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 1 }, // in square feet
    location: { type: String, required: true },
    address: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }], // URLs to property images
    landlord: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    available: { type: Boolean, default: true },
    availableFrom: { type: Date, default: Date.now },
    
    // Additional property details
    furnished: { 
      type: String, 
      enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      default: "Unfurnished"
    },
    parking: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    
    // Lease preferences
    preferredTenantType: {
      type: String,
      enum: ["Family", "Bachelor", "Working Professional", "Student", "Any"],
      default: "Any"
    },
    minimumLeasePeriod: { type: Number, default: 12 }, // in months
    
    // Property status
    status: {
      type: String,
      enum: ["Available", "Rented", "Under Maintenance", "Inactive"],
      default: "Available"
    },
    
    // Current tenant (if rented)
    currentTenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    
    // Lease information
    leaseStartDate: { type: Date },
    leaseEndDate: { type: Date },
    
    // Property verification
    verified: { type: Boolean, default: false },
    verificationDate: { type: Date },
    
    // Analytics
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for property age
PropertySchema.virtual('propertyAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Index for search functionality
PropertySchema.index({ 
  title: 'text', 
  description: 'text', 
  location: 'text',
  address: 'text'
});

// Index for filtering
PropertySchema.index({ rent: 1, type: 1, location: 1, available: 1 });

export default mongoose.model("Property", PropertySchema);