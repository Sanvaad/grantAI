// src/validation/schemas.ts
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  organization: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const proposalSchema = z.object({
  projectTitle: z
    .string()
    .min(3, "Project title must be at least 3 characters"),
  organizationType: z.enum([
    "nonprofit",
    "education",
    "research",
    "community",
    "other",
  ]),
  missionStatement: z.string().optional(),
  targetAmount: z
    .number()
    .positive("Target amount must be positive")
    .optional(),
  projectTimeline: z
    .object({
      startDate: z.string().datetime(),
      endDate: z.string().datetime(),
      duration: z.string(),
    })
    .optional(),
  targetAudience: z.string().optional(),
  objectives: z.array(z.string()).min(1, "At least one objective is required"),
  teamSize: z.number().int().positive().optional(),
});

export const sectionGenerationSchema = z.object({
  sectionName: z.enum([
    "executiveSummary",
    "needStatement",
    "projectDescription",
    "methodology",
    "evaluation",
    "sustainability",
    "budget",
  ]),
  temperature: z.number().min(0).max(1).optional(),
});
