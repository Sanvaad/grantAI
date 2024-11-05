// src/services/emailService.ts
import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { AppError } from "../middleware/errorHandler";

interface EmailOptions {
  to: string | string[];
  subject: string;
  template: string;
  context: Record<string, any>;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  private static async loadTemplate(
    templateName: string
  ): Promise<HandlebarsTemplateDelegate> {
    const templatePath = path.join(
      __dirname,
      "../templates/emails",
      `${templateName}.hbs`
    );

    try {
      const template = await fs.promises.readFile(templatePath, "utf-8");
      return handlebars.compile(template);
    } catch (error) {
      throw new AppError(`Email template ${templateName} not found`, 500);
    }
  }

  static async sendEmail(options: EmailOptions): Promise<void> {
    try {
      // Load and compile template
      const template = await this.loadTemplate(options.template);
      const html = template(options.context);

      // Send email
      await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: Array.isArray(options.to) ? options.to.join(",") : options.to,
        subject: options.subject,
        html,
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new AppError("Failed to send email", 500);
    }
  }

  // Predefined email methods
  static async sendProposalCreated(
    to: string,
    proposalTitle: string,
    proposalId: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: "New Proposal Created",
      template: "proposalCreated",
      context: {
        proposalTitle,
        proposalUrl: `${process.env.FRONTEND_URL}/proposals/${proposalId}`,
      },
    });
  }

  static async sendCollaborationInvite(
    to: string,
    inviterName: string,
    proposalTitle: string,
    inviteUrl: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Collaboration Invite: ${proposalTitle}`,
      template: "collaborationInvite",
      context: {
        inviterName,
        proposalTitle,
        inviteUrl,
      },
    });
  }

  static async sendProposalReviewReminder(
    to: string,
    proposalTitle: string,
    dueDate: Date,
    proposalId: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Review Reminder: ${proposalTitle}`,
      template: "reviewReminder",
      context: {
        proposalTitle,
        dueDate: dueDate.toLocaleDateString(),
        proposalUrl: `${process.env.FRONTEND_URL}/proposals/${proposalId}`,
      },
    });
  }

  static async sendAIGenerationComplete(
    to: string,
    proposalTitle: string,
    sectionName: string,
    proposalId: string
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `AI Generation Complete: ${sectionName}`,
      template: "aiGenerationComplete",
      context: {
        proposalTitle,
        sectionName,
        proposalUrl: `${process.env.FRONTEND_URL}/proposals/${proposalId}`,
      },
    });
  }
}
