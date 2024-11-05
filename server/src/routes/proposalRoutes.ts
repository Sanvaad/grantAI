// src/routes/proposalRoutes.ts
import express from "express";
import { ProposalController } from "../controllers/proposalController";
import { validateRequest } from "../middleware/validateRequest";
import { proposalSchema, sectionGenerationSchema } from "../validation/schemas";
import { auth } from "../middleware/auth";
import { apiLimiter, aiLimiter } from "../middleware/rateLimiter";
import { cacheMiddleware } from "../middleware/cache";

const router = express.Router();

// Apply auth middleware to all proposal routes
router.use(auth);

// Basic CRUD operations
router.post(
  "/",
  apiLimiter,
  validateRequest(proposalSchema),
  ProposalController.createProposal
);

router.get(
  "/",
  cacheMiddleware(300), // Cache for 5 minutes
  validateRequest(
    z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      status: z.string().optional(),
      search: z.string().optional(),
    })
  ),
  ProposalController.getProposals
);

router.get(
  "/:id",
  cacheMiddleware(300),
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
    })
  ),
  ProposalController.getProposal
);

router.patch(
  "/:id",
  apiLimiter,
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
      body: proposalSchema.partial(),
    })
  ),
  ProposalController.updateProposal
);

router.delete(
  "/:id",
  apiLimiter,
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
    })
  ),
  ProposalController.deleteProposal
);

// AI-related routes
router.post(
  "/:id/generate",
  aiLimiter,
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
      body: sectionGenerationSchema,
    })
  ),
  ProposalController.generateSection
);

router.post(
  "/:id/improve/:sectionName",
  aiLimiter,
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
      sectionName: z.string(),
      body: z.object({
        feedback: z.string().min(10),
      }),
    })
  ),
  ProposalController.improveSection
);

// Collaboration routes
router.post(
  "/:id/collaborate",
  apiLimiter,
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
      body: z.object({
        userId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
        role: z.enum(["editor", "viewer"]),
      }),
    })
  ),
  ProposalController.addCollaborator
);

// Version control routes
router.get(
  "/:id/versions/:sectionName",
  cacheMiddleware(300),
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
      sectionName: z.string(),
    })
  ),
  ProposalController.getSectionHistory
);

router.post(
  "/:id/revert/:sectionName",
  apiLimiter,
  validateRequest(
    z.object({
      id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid proposal ID"),
      sectionName: z.string(),
      body: z.object({
        version: z.number().int().positive(),
      }),
    })
  ),
  ProposalController.revertSection
);

export default router;
