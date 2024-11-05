import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/ai", aiRoutes);

// Health check route
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/grant-portal")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      status: "error",
      message: err.message || "Internal server error",
    });
  }
);

export default app;
