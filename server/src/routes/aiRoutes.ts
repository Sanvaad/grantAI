// server/routes/aiRoutes.ts

import express from "express";
import { AiService } from "../services/aiService";
import { auth } from "../middleware/auth";
import { rateLimit } from "express-rate-limit";

const router = express.Router();

// Rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 50, // limit each IP to 50 requests per window
  message: "Too many requests from this IP, please try again after an hour",
});

// Apply authentication and rate limiting to all AI routes
router.use(auth);
router.use(aiLimiter);

// Route to generate content for a specific section
router.post("/generate", async (req, res) => {
  try {
    const { sectionName, proposal, temperature } = req.body;

    if (!sectionName || !proposal) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: sectionName and proposal",
      });
    }

    const content = await AiService.generateContent(
      sectionName,
      proposal,
      temperature
    );

    res.json({
      status: "success",
      data: { content },
    });
  } catch (error: any) {
    console.error("Generate content error:", error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Failed to generate content",
    });
  }
});

// Route to improve existing content
router.post("/improve", async (req, res) => {
  try {
    const { content, feedback } = req.body;

    if (!content || !feedback) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: content and feedback",
      });
    }

    const improvedContent = await AiService.improveContent(content, feedback);

    res.json({
      status: "success",
      data: { content: improvedContent },
    });
  } catch (error: any) {
    console.error("Improve content error:", error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Failed to improve content",
    });
  }
});

// Route to get available sections
router.get("/sections", (req, res) => {
  try {
    const sections = Object.keys(AiService.getSectionPrompts());
    res.json({
      status: "success",
      data: { sections },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch sections",
    });
  }
});

router.post("/generate-complete", auth, async (req, res) => {
  try {
    const { formData } = req.body;

    if (!formData) {
      return res.status(400).json({
        status: "error",
        message: "Missing form data",
      });
    }

    const proposal = await AiService.generateCompleteProposal(formData);

    res.json({
      status: "success",
      data: { proposal },
    });
  } catch (error: any) {
    console.error("Generate complete proposal error:", error);
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Failed to generate complete proposal",
    });
  }
});

export default router;
