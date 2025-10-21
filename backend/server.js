import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // must match the path
import dashboardRoutes from "./routes/dashboard.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); // parse JSON bodies


// after app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// mount auth routes
app.use("/api/auth", authRoutes);

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
