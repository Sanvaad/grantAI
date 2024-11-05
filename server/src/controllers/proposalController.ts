// src/controllers/proposalController.ts
import { Request, Response } from "express";
import { Proposal } from "../models/Proposal";
import { AiService } from "../services/aiService";
import { AppError } from "../middleware/errorHandler";
import { CustomRequest } from "../types";
import { NotificationService } from "src/services/notificationService";

export class ProposalController {
  static async createProposal(req: CustomRequest, res: Response) {
    try {
      const proposal = new Proposal({
        ...req.body,
        userId: req.user!.id,
      });

      await proposal.save();

      res.status(201).json({
        status: "success",
        data: {
          proposal,
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async getProposals(req: CustomRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const query = { userId: req.user!.id };

      // Apply filters if any
      if (req.query.status) {
        query.status = req.query.status;
      }

      if (req.query.search) {
        query.$text = { $search: req.query.search as string };
      }

      const proposals = await Proposal.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Proposal.countDocuments(query);

      res.json({
        status: "success",
        data: {
          proposals,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async getProposal(req: CustomRequest, res: Response) {
    try {
      const proposal = await Proposal.findOne({
        _id: req.params.id,
        userId: req.user!.id,
      });

      if (!proposal) {
        throw new AppError("Proposal not found", 404);
      }

      res.json({
        status: "success",
        data: {
          proposal,
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async updateProposal(req: CustomRequest, res: Response) {
    try {
      const proposal = await Proposal.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user!.id,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!proposal) {
        throw new AppError("Proposal not found", 404);
      }

      res.json({
        status: "success",
        data: {
          proposal,
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async deleteProposal(req: CustomRequest, res: Response) {
    try {
      const proposal = await Proposal.findOneAndDelete({
        _id: req.params.id,
        userId: req.user!.id,
      });

      if (!proposal) {
        throw new AppError("Proposal not found", 404);
      }

      res.json({
        status: "success",
        data: null,
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async generateSection(req: CustomRequest, res: Response) {
    try {
      const { id } = req.params;
      const { sectionName, temperature } = req.body;

      const proposal = await Proposal.findOne({
        _id: id,
        userId: req.user!.id,
      });

      if (!proposal) {
        throw new AppError("Proposal not found", 404);
      }

      const content = await AiService.generateContent(
        sectionName,
        proposal,
        temperature
      );

      // Update proposal with generated content
      proposal.sections[sectionName] = {
        title: sectionName,
        content,
        aiGenerated: true,
        lastModified: new Date(),
        version: (proposal.sections[sectionName]?.version || 0) + 1,
        history: [
          ...(proposal.sections[sectionName]?.history || []),
          {
            content: proposal.sections[sectionName]?.content,
            modifiedAt: new Date(),
            modifiedBy: req.user!.id,
          },
        ],
      };

      await proposal.save();


      // Send notification

      await NotificationService.handleProposalNotifications(
        'ai_generated',
        id,
        req.user!.id,
        { sectionName }
      );

      res.json({ /* ... */ });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }

      res.json({
        status: "success",
        data: {
          section: proposal.sections[sectionName],
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }

  static async improveSection(req: CustomRequest, res: Response) {
    try {
      const { id, sectionName } = req.params;
      const { feedback } = req.body;

      const proposal = await Proposal.findOne({
        _id: id,
        userId: req.user!.id,
      });

      if (!proposal) {
        throw new AppError("Proposal not found", 404);
      }

      const currentSection = proposal.sections[sectionName];
      if (!currentSection) {
        throw new AppError("Section not found", 404);
      }

      const improvedContent = await AiService.improveContent(
        currentSection.content,
        feedback
      );

      // Update section with improved content
      proposal.sections[sectionName] = {
        ...currentSection,
        content: improvedContent,
        lastModified: new Date(),
        version: currentSection.version + 1,
        history: [
          ...currentSection.history,
          {
            content: currentSection.content,
            modifiedAt: new Date(),
            modifiedBy: req.user!.id,
          },
        ],
      };

      await proposal.save();

      res.json({
        status: "success",
        data: {
          section: proposal.sections[sectionName],
        },
      });
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
    }
  }
}
