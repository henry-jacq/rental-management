import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const AgreementSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 200
    },
    description: { 
      type: String,
      trim: true,
      maxlength: 1000
    },
    terms: { 
      type: String, 
      required: true,
      trim: true
    },
    landlord: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true
    },
    property: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Property"
    },
    tenant: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },
    status: { 
      type: String, 
      enum: ["Draft", "Active", "Expired", "Terminated"],
      default: "Draft",
      index: true
    },
    documents: [DocumentSchema],
    signedAt: { type: Date },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

AgreementSchema.index({ landlord: 1, createdAt: -1 });
AgreementSchema.index({ landlord: 1, status: 1 });
AgreementSchema.index({ landlord: 1, property: 1 });
AgreementSchema.index({ landlord: 1, tenant: 1 });
AgreementSchema.index({ title: "text", description: "text", terms: "text" });

AgreementSchema.virtual('documentCount').get(function() {
  return this.documents ? this.documents.length : 0;
});

AgreementSchema.set('toJSON', { virtuals: true });
AgreementSchema.set('toObject', { virtuals: true });

AgreementSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'Draft': 'Draft',
    'Active': 'Active',
    'Expired': 'Expired',
    'Terminated': 'Terminated'
  };
  return statusMap[this.status] || this.status;
});

AgreementSchema.virtual('createdAtFormatted').get(function() {
  return this.createdAt ? this.createdAt.toLocaleDateString() : '';
});

AgreementSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

AgreementSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('landlord')) {
    try {
      const User = mongoose.model('User');
      const landlord = await User.findById(this.landlord);
      if (!landlord || landlord.role !== 'landlord') {
        throw new Error('Agreement landlord must be a user with landlord role');
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

AgreementSchema.pre('save', async function(next) {
  if (this.tenant && (this.isNew || this.isModified('tenant'))) {
    try {
      const User = mongoose.model('User');
      const tenant = await User.findById(this.tenant);
      if (!tenant || tenant.role !== 'tenant') {
        throw new Error('Agreement tenant must be a user with tenant role');
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

AgreementSchema.statics.findByLandlord = function(landlordId, filters = {}) {
  const query = { landlord: landlordId };
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.property) {
    query.property = filters.property;
  }
  
  if (filters.tenant) {
    query.tenant = filters.tenant;
  }
  
  if (filters.search) {
    query.$text = { $search: filters.search };
  }
  
  return this.find(query)
    .populate('property', 'title location address')
    .populate('tenant', 'name email phone')
    .sort({ createdAt: -1 });
};

AgreementSchema.methods.addDocument = function(documentData) {
  this.documents.push(documentData);
  return this.save();
};

AgreementSchema.methods.removeDocument = function(documentId) {
  this.documents.id(documentId).remove();
  return this.save();
};

AgreementSchema.methods.isEditable = function() {
  return this.status === 'Draft' || this.status === 'Active';
};

AgreementSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

export default mongoose.model("Agreement", AgreementSchema);