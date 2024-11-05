// server/services/aiService.ts

import { Configuration, OpenAIApi } from "openai";
import { AppError } from "../middleware/errorHandler";

export class AiService {
  private static openai: OpenAIApi;

  static initialize() {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      })
    );
  }

  static async generateCompleteProposal(formData: any): Promise<string> {
    try {
      const prompt = `
        Generate a professional 3-page grant proposal based on the following information:
        
        Project Title: ${formData.projectTitle}
        Project Type: ${formData.projectType}
        
        Executive Summary:
        ${formData.summary}
        
        Problem Statement:
        ${formData.problemStatement}
        
        Target Audience:
        ${formData.targetAudience}
        
        Existing Solutions:
        ${formData.existingSolutions}
        
        Proposed Solution:
        ${formData.solutionDescription}
        
        Methodology:
        ${formData.methodology}
        
        Innovation Aspects:
        ${formData.innovation}
        
        Timeline:
        Duration: ${formData.projectDuration}
        Start Date: ${formData.startDate}
        Key Milestones: ${formData.milestones}
        
        Budget:
        Total Amount: ${formData.totalBudget}
        Breakdown: ${formData.budgetBreakdown}
        Resource Needs: ${formData.resourceNeeds}
        
        Impact:
        Expected Outcomes: ${formData.expectedOutcomes}
        Success Metrics: ${formData.successMetrics}
        Evaluation Plan: ${formData.evaluationPlan}
        
        Team:
        Key Members: ${formData.teamMembers}
        Organization Capability: ${formData.organizationCapability}
        Partnerships: ${formData.partnerships}
        
        Please generate a comprehensive, well-structured grant proposal that includes:
        1. A compelling executive summary
        2. Clear problem statement and needs assessment
        3. Detailed project description and methodology
        4. Well-defined goals and objectives
        5. Specific timeline and milestones
        6. Detailed budget justification
        7. Expected outcomes and evaluation methods
        8. Organizational capacity and team qualifications
        
        Format the proposal professionally with appropriate sections, subsections, and maintain a persuasive tone throughout.
      `;

      const completion = await this.openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert grant writer with decades of experience in securing funding for various organizations.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased for longer content
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.2,
      });

      const generatedProposal = completion.data.choices[0]?.message?.content;

      if (!generatedProposal) {
        throw new AppError("Failed to generate proposal", 500);
      }

      return generatedProposal;
    } catch (error) {
      console.error("AI generation error:", error);
      throw new AppError(
        "Failed to generate complete proposal. Please try again.",
        error.response?.status || 500
      );
    }
  }
}
