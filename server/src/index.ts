// server index.ts

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Basic routes
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Don't exit the process, let it retry
    setTimeout(connectDB, 5000);
  }
};

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize AI Service if OPENAI_API_KEY is present
    if (!process.env.OPENAI_API_KEY) {
      console.warn("Warning: OPENAI_API_KEY is not set");
    }

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer().catch(console.error);

export default app;
