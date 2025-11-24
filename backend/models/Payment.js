import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
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
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    month: {
      type: String,
      required: true,
      trim: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    paidDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ["Pending", "Submitted", "Verified", "Overdue"],
      default: "Pending",
      index: true
    },
    paymentMethod: {
      type: String,
      trim: true
    },
    transactionId: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

PaymentSchema.index({ tenant: 1, status: 1, dueDate: -1 });
PaymentSchema.index({ landlord: 1, status: 1, dueDate: -1 });

export default mongoose.model("Payment", PaymentSchema);
