// src/middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
import { AppError } from "./errorHandler";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per 15 minutes
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 AI requests per hour
  message: "AI generation limit reached, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});
