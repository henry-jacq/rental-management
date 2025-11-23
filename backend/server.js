import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // must match the path
import dashboardRoutes from "./routes/dashboard.js";

import tenantsRoutes from "./routes/tenants.js";

import reportsRoutes from "./routes/reports.js";
import propertiesRoutes from "./routes/properties.js";
import propertyRequestsRoutes from "./routes/propertyRequests.js";
import landlordPropertiesRoutes from "./routes/landlordProperties.js";
import landlordAgreementsRoutes from "./routes/landlordAgreements.js";
import paymentsRoutes from "./routes/payments.js";
import { verifyToken } from "./middleware/auth.js";
import { attachUserData } from "./middleware/userMiddleware.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", verifyToken(), attachUserData, dashboardRoutes);

app.use("/api/tenants", verifyToken(), attachUserData, tenantsRoutes);
app.use("/api/reports", verifyToken(), attachUserData, reportsRoutes);
app.use("/api/properties", verifyToken(), attachUserData, propertiesRoutes);
app.use("/api/property-requests", verifyToken(), attachUserData, propertyRequestsRoutes);
app.use("/api/landlord-properties", verifyToken(), attachUserData, landlordPropertiesRoutes);
app.use("/api/landlord-agreements", verifyToken(), attachUserData, landlordAgreementsRoutes);
app.use("/api/payments", verifyToken(), attachUserData, paymentsRoutes);

app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? error.message : "Something went wrong"
  });
});

app.get("/", (req, res) => {
  res.send("Backend running!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
