import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // must match the path
import dashboardRoutes from "./routes/dashboard.js";
import paymentsRoutes from "./routes/payments.js";
import tenantsRoutes from "./routes/tenants.js";
import maintenanceRoutes from "./routes/maintenance.js";
import reportsRoutes from "./routes/reports.js";
import propertiesRoutes from "./routes/properties.js";
import { verifyToken } from "./middleware/auth.js";
import { attachUserData } from "./middleware/userMiddleware.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // parse JSON bodies

// Serve static files for uploaded images
app.use('/uploads', express.static('uploads'));

// mount all routes
app.use("/api/auth", authRoutes);
// Apply user data middleware to all protected routes
app.use("/api/dashboard", verifyToken(), attachUserData, dashboardRoutes);
app.use("/api/payments", verifyToken(), attachUserData, paymentsRoutes);
app.use("/api/tenants", verifyToken(), attachUserData, tenantsRoutes);
app.use("/api/maintenance", verifyToken(), attachUserData, maintenanceRoutes);
app.use("/api/reports", verifyToken(), attachUserData, reportsRoutes);
app.use("/api/properties", verifyToken(), attachUserData, propertiesRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend running!");
});

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
