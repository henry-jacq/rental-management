import express from "express";
import Payment from "../models/Payment.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { tenantId, propertyId, amount, month, dueDate, notes } = req.body;
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can create payment requests" });
    }
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    if (!property.landlord) {
      return res.status(400).json({ message: "Property has no landlord assigned" });
    }
    if (property.landlord.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "You don't own this property" });
    }
    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== "tenant") {
      return res.status(404).json({ message: "Tenant not found" });
    }
    const payment = await Payment.create({
      tenant: tenantId,
      landlord: req.user.id,
      property: propertyId,
      amount,
      month,
      dueDate,
      notes,
      status: "Pending"
    });
    const populatedPayment = await Payment.findById(payment._id)
      .populate('property', 'title location')
      .populate('tenant', 'name email');
    res.status(201).json({
      message: "Payment request created successfully",
      payment: populatedPayment
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/tenant", async (req, res) => {
  try {
    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Only tenants can access this" });
    }
    const payments = await Payment.find({ tenant: req.user.id })
      .populate('property', 'title location images')
      .populate('landlord', 'name email phone')
      .sort({ dueDate: -1 });
    const pending = payments.filter(p => p.status === "Pending" || p.status === "Overdue");
    const submitted = payments.filter(p => p.status === "Submitted");
    const verified = payments.filter(p => p.status === "Verified");
    res.json({ pending, submitted, verified, total: payments.length });
  } catch (error) {
    console.error("Error fetching tenant payments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/landlord", async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can access this" });
    }
    const payments = await Payment.find({ landlord: req.user.id })
      .populate('property', 'title location')
      .populate('tenant', 'name email')
      .sort({ dueDate: -1 });
    const summary = {
      totalPending: payments.filter(p => p.status === "Pending").length,
      totalOverdue: payments.filter(p => p.status === "Overdue").length,
      totalPaid: payments.filter(p => p.status === "Paid").length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      paidAmount: payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0)
    };
    res.json({ payments, summary });
  } catch (error) {
    console.error("Error fetching landlord payments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/mark-paid", async (req, res) => {
  try {
    const { paymentMethod, transactionId, paidDate, notes } = req.body;

    if (req.user.role !== "tenant") {
      return res.status(403).json({ message: "Only tenants can mark payments as paid" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.tenant.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (payment.status === "Verified") {
      return res.status(400).json({ message: "Payment is already verified" });
    }

    if (payment.status === "Submitted") {
      return res.status(400).json({ message: "Payment is already submitted for verification" });
    }

    payment.status = "Submitted";
    payment.paidDate = paidDate || new Date();
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;
    if (notes) payment.notes = notes;
    payment.rejectionReason = undefined; // Clear previous rejection reason
    
    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate('property', 'title location')
      .populate('landlord', 'name email');

    res.json({
      message: "Payment submitted for verification",
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Error marking payment as paid:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/verify", async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can verify payments" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.landlord.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (payment.status !== "Submitted") {
      return res.status(400).json({ message: "Payment must be submitted before verification" });
    }

    payment.status = "Verified";
    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate('property', 'title location')
      .populate('tenant', 'name email');

    res.json({
      message: "Payment verified successfully",
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;

    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can reject payments" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.landlord.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (payment.status !== "Submitted") {
      return res.status(400).json({ message: "Only submitted payments can be rejected" });
    }

    payment.status = "Pending";
    payment.rejectionReason = reason || "No reason provided";
    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate('property', 'title location')
      .populate('tenant', 'name email');

    res.json({
      message: "Payment rejected",
      payment: updatedPayment
    });
  } catch (error) {
    console.error("Error rejecting payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can delete payment requests" });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.landlord.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (payment.status === "Paid") {
      return res.status(400).json({ message: "Cannot delete paid payments" });
    }

    await Payment.findByIdAndDelete(req.params.id);

    res.json({ message: "Payment request deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
