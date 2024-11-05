// src/routes/index.ts
import express from "express";
import authRoutes from "./authRoutes";
import proposalRoutes from "./proposalRoutes";
import { apiLimiter } from "../middleware/rateLimiter";

const router = express.Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Apply API rate limiter to all routes
router.use(apiLimiter);

// Mount route modules
router.use("/auth", authRoutes);
router.use("/proposals", proposalRoutes);

// 404 handler
router.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

export default router;
