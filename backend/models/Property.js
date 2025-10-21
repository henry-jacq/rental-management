import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ["Apartment", "House", "Condo", "Studio", "Townhouse", "Other"]
  },
  rent: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["Available", "Occupied", "Maintenance"],
    default: "Available"
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 1
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 1
  },
  area: {
    type: Number, // in square feet
    min: 0
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String // URLs to property images
  }],
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  leaseStartDate: {
    type: Date
  },
  leaseEndDate: {
    type: Date
  },
  deposit: {
    type: Number,
    min: 0,
    default: 0
  },
  utilities: {
    electricity: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    gas: { type: Boolean, default: false },
    internet: { type: Boolean, default: false },
    parking: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
PropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for tenant count
PropertySchema.virtual('tenantCount').get(function() {
  return this.currentTenant ? 1 : 0;
});

// Ensure virtual fields are serialized
PropertySchema.set('toJSON', {
  virtuals: true
});

const Property = mongoose.model("Property", PropertySchema);

export default Property;