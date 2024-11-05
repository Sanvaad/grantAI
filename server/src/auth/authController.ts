// src/controllers/authController.ts
import { Request, Response } from "express";
import { User } from "../models/User";
import { AppError } from "../middleware/errorHandler";
import { sendEmail } from "../utils/email";
import crypto from "crypto";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, organization } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError("Email already in use", 400);
      }

      // Create new user
      const user = new User({
        email,
        password,
        name,
        organization,
      });

      await user.save();

      // Generate token
      const token = user.generateAuthToken();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        status: "success",
        data: {
          user: userResponse,
          token,
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Get user with password
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new AppError("Invalid email or password", 401);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = user.generateAuthToken();

      res.json({
        status: "success",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            organization: user.organization,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw new AppError("No user found with that email address", 404);
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await user.save();

      // Send email
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/reset-password/${resetToken}`;

      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`,
      });

      res.json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      throw new AppError(
        "There was an error sending the email. Try again later!",
        500
      );
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      // Get user based on token
      const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user) {
        throw new AppError("Token is invalid or has expired", 400);
      }

      // Update password
      user.password = req.body.password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      // Log user in
      const token = user.generateAuthToken();

      res.json({
        status: "success",
        token,
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async updatePassword(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user.id).select("+password");

      // Check current password
      if (!(await user.comparePassword(req.body.currentPassword))) {
        throw new AppError("Your current password is wrong", 401);
      }

      // Update password
      user.password = req.body.newPassword;
      await user.save();

      // Log user in with new token
      const token = user.generateAuthToken();

      res.json({
        status: "success",
        token,
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }
}
