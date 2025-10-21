import mongoose from "mongoose";

const PaymentVaultSchema = new mongoose.Schema(
  {
    upiId: { type: String },
    bankName: { type: String },
    accountHolderName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { _id: false }
);

const LeaseDetailsSchema = new mongoose.Schema(
  {
    leaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Lease" },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, enum: ["Pending", "Active", "Terminated"], default: "Pending" },
    rentAmount: { type: Number },
    securityDeposit: { type: Number },
  },
  { _id: false }
);

const KYCSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["Pending", "Verified", "Rejected"], default: "Pending" },
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ["tenant", "landlord"], required: true },

    // Common
    address: { type: AddressSchema },
    paymentVault: { type: PaymentVaultSchema },
    kyc: { type: KYCSchema },

    // Landlord specific
    propertiesOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
    digitalSignature: { type: String }, // URL or base64

    // Tenant specific
    propertyRented: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    lease: { type: LeaseDetailsSchema },
    uploadedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
