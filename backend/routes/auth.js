import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role, name: user.name, email: user.email },
       process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP and expiry (10 minutes)
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563EB;">Password Reset OTP</h2>
        <p>Hello ${user.name},</p>
        <p>Your OTP for password reset is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #2563EB; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Rental Management System</p>
      </div>
    `;

    // Send email to user
    const emailSent = await sendEmail(email, "Password Reset OTP", emailHtml);
    
    if (!emailSent) {
      return res.status(500).json({ msg: "Failed to send email. Please check email configuration." });
    }
    
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Check if OTP exists and not expired
    if (!user.resetOTP || !user.resetOTPExpires) {
      return res.status(400).json({ msg: "No OTP found. Please request a new one." });
    }

    if (Date.now() > user.resetOTPExpires) {
      return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Password with OTP
router.post("/reset-password-otp", async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Verify OTP again
    if (!user.resetOTP || user.resetOTP !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (Date.now() > user.resetOTPExpires) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    
    // Clear OTP
    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    // Generate login token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ 
      message: "Password reset successful",
      token,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
