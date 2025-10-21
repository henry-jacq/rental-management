import mongoose from "mongoose";

const PropertyRequestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Agreement_Sent", "Agreement_Accepted", "Completed"],
      default: "Pending",
      index: true
    },
    // Agreement details when landlord responds
    selectedAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agreement"
    },
    customAgreementTerms: {
      type: String,
      trim: true
    },
    // Response from landlord
    landlordResponse: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    responseDate: {
      type: Date
    },
    // Agreement acceptance
    agreementAcceptedAt: {
      type: Date
    },
    // Property assignment
    assignedAt: {
      type: Date
    },
    // Lease details
    leaseStartDate: {
      type: Date
    },
    leaseEndDate: {
      type: Date
    },
    rentAmount: {
      type: Number
    },
    securityDeposit: {
      type: Number
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient querying
PropertyRequestSchema.index({ landlord: 1, status: 1, createdAt: -1 });
PropertyRequestSchema.index({ tenant: 1, status: 1, createdAt: -1 });
PropertyRequestSchema.index({ property: 1, status: 1 });

// Virtual for status display
PropertyRequestSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'Pending': 'Pending Review',
    'Approved': 'Approved',
    'Rejected': 'Rejected',
    'Agreement_Sent': 'Agreement Sent',
    'Agreement_Accepted': 'Agreement Accepted',
    'Completed': 'Completed'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for formatted creation date
PropertyRequestSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString() : '';
});

// Static method to find requests by landlord
PropertyRequestSchema.statics.findByLandlord = function(landlordId, filters = {}) {
  const query = { landlord: landlordId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.property) {
    query.property = filters.property;
  }
  
  return this.find(query)
    .populate('property', 'title location address rent images')
    .populate('tenant', 'name email phone')
    .populate('selectedAgreement', 'title terms')
    .sort({ createdAt: -1 })
    .lean(); // Use lean for better performance
};

// Static method to find requests by tenant
PropertyRequestSchema.statics.findByTenant = function(tenantId, filters = {}) {
  const query = { tenant: tenantId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  return this.find(query)
    .populate('property', 'title location address rent images')
    .populate('landlord', 'name email phone')
    .populate('selectedAgreement', 'title terms')
    .sort({ createdAt: -1 })
    .lean(); // Use lean for better performance
};

// Instance method to approve request
PropertyRequestSchema.methods.approve = function(landlordResponse) {
  this.status = 'Approved';
  this.landlordResponse = landlordResponse;
  this.responseDate = new Date();
  return this.save();
};

// Instance method to reject request
PropertyRequestSchema.methods.reject = function(landlordResponse) {
  this.status = 'Rejected';
  this.landlordResponse = landlordResponse;
  this.responseDate = new Date();
  return this.save();
};

// Instance method to send agreement
PropertyRequestSchema.methods.sendAgreement = function(agreementId, customTerms) {
  this.status = 'Agreement_Sent';
  this.selectedAgreement = agreementId;
  this.customAgreementTerms = customTerms;
  this.responseDate = new Date();
  return this.save();
};

// Instance method to accept agreement
PropertyRequestSchema.methods.acceptAgreement = function() {
  this.status = 'Agreement_Accepted';
  this.agreementAcceptedAt = new Date();
  return this.save();
};

// Instance method to complete and assign property
PropertyRequestSchema.methods.completeAssignment = function(leaseDetails) {
  this.status = 'Completed';
  this.assignedAt = new Date();
  this.leaseStartDate = leaseDetails.startDate;
  this.leaseEndDate = leaseDetails.endDate;
  this.rentAmount = leaseDetails.rentAmount;
  this.securityDeposit = leaseDetails.securityDeposit;
  return this.save();
};

// Pre-save middleware to validate tenant and landlord roles
PropertyRequestSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('tenant') || this.isModified('landlord')) {
    try {
      const User = mongoose.model('User');
      
      if (this.tenant) {
        const tenant = await User.findById(this.tenant);
        if (!tenant || tenant.role !== 'tenant') {
          throw new Error('Request tenant must be a user with tenant role');
        }
      }
      
      if (this.landlord) {
        const landlord = await User.findById(this.landlord);
        if (!landlord || landlord.role !== 'landlord') {
          throw new Error('Request landlord must be a user with landlord role');
        }
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

export default mongoose.model("PropertyRequest", PropertyRequestSchema);