import express from "express";
import { verifyToken } from "../../backend/middleware/auth.js";

const router = express.Router();

router.get("/tenant", verifyToken(["tenant"]), (req, res) => {
  res.json({ message: `Welcome Tenant ${req.user.id}` });
});

router.get("/landlord", verifyToken(["landlord"]), (req, res) => {
  res.json({ message: `Welcome Landlord ${req.user.id}` });
});

export default router;
