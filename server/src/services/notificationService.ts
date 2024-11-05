// src/services/notificationService.ts
import { EmailService } from "./emailService";
import { User } from "../models/User";
import { Proposal } from "../models/Proposal";
import { AppError } from "../middleware/errorHandler";

export class NotificationService {
  // Handle proposal-related notifications
  static async handleProposalNotifications(
    type: "created" | "updated" | "collaborator_added" | "ai_generated",
    proposalId: string,
    userId: string,
    additionalData?: any
  ): Promise<void> {
    try {
      const proposal = await Proposal.findById(proposalId);
      const user = await User.findById(userId);

      if (!proposal || !user) {
        throw new AppError("Proposal or user not found", 404);
      }

      switch (type) {
        case "created":
          await EmailService.sendProposalCreated(
            user.email,
            proposal.projectTitle,
            proposalId
          );
          break;

        case "collaborator_added":
          const collaborator = await User.findById(
            additionalData.collaboratorId
          );
          if (collaborator) {
            await EmailService.sendCollaborationInvite(
              collaborator.email,
              user.name,
              proposal.projectTitle,
              `${process.env.FRONTEND_URL}/proposals/${proposalId}/accept-invite`
            );
          }
          break;

        case "ai_generated":
          await EmailService.sendAIGenerationComplete(
            user.email,
            proposal.projectTitle,
            additionalData.sectionName,
            proposalId
          );
          break;
      }
    } catch (error) {
      console.error("Notification error:", error);
      throw new AppError("Failed to send notification", 500);
    }
  }

  // Schedule review reminders
  static async scheduleReviewReminder(
    proposalId: string,
    userId: string,
    dueDate: Date
  ): Promise<void> {
    const proposal = await Proposal.findById(proposalId);
    const user = await User.findById(userId);

    if (!proposal || !user) {
      throw new AppError("Proposal or user not found", 404);
    }

    // Schedule reminder for 3 days before due date
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 3);

    // You might want to use a task scheduler like node-cron or bull here
    // For now, we'll just check if we should send the reminder
    if (new Date() >= reminderDate) {
      await EmailService.sendProposalReviewReminder(
        user.email,
        proposal.projectTitle,
        dueDate,
        proposalId
      );
    }
  }

  // Send batch notifications (e.g., weekly digest)
  static async sendWeeklyDigest(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get user's proposals updated in the last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentProposals = await Proposal.find({
      userId,
      updatedAt: { $gte: lastWeek },
    });

    if (recentProposals.length > 0) {
      await EmailService.sendEmail({
        to: user.email,
        subject: "Your Weekly Proposal Digest",
        template: "weeklyDigest",
        context: {
          userName: user.name,
          proposals: recentProposals.map((p) => ({
            title: p.projectTitle,
            status: p.status,
            lastUpdated: p.updatedAt.toLocaleDateString(),
          })),
        },
      });
    }
  }
}
