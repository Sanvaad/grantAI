// src/routes/authRoutes.ts
import express from "express";
import { AuthController } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { registerSchema, loginSchema } from "../validation/schemas";
import { authLimiter } from "../middleware/rateLimiter";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateRequest(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  authLimiter,
  validateRequest(loginSchema),
  AuthController.login
);

router.post(
  "/forgot-password",
  authLimiter,
  validateRequest(z.object({ email: z.string().email() })),
  AuthController.forgotPassword
);

router.patch(
  "/reset-password/:token",
  authLimiter,
  validateRequest(
    z.object({
      password: z.string().min(8),
      passwordConfirm: z.string().min(8),
    })
  ),
  AuthController.resetPassword
);

router.patch(
  "/update-password",
  auth,
  validateRequest(
    z.object({
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    })
  ),
  AuthController.updatePassword
);

export default router;
