// client ai service

import axios from "axios";

interface GenerationContext {
  projectTitle?: string;
  projectType?: string;
  organizationType?: string;
  targetPopulation?: string;
  [key: string]: any;
}

export class AIService {
  private static API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  private static getHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async generateCompleteProposal(
    formData: Record<string, any>
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_URL}/ai/generate-complete`,
        { formData },
        {
          headers: this.getHeaders(),
          timeout: 60000, // Extended timeout for longer generation
        }
      );

      if (!response.data?.data?.proposal) {
        throw new Error("Invalid response format from server");
      }

      return response.data.data.proposal;
    } catch (error: any) {
      console.error(
        "Complete proposal generation error:",
        error.response?.data || error.message
      );
      throw new Error(
        "Failed to generate complete proposal. Please try again."
      );
    }
  }

  static async generateContent(
    section: string,
    context: GenerationContext
  ): Promise<string> {
    try {
      console.log("Generating content for section:", section);
      console.log("Context:", context);

      const response = await axios.post(
        `${this.API_URL}/ai/generate`,
        {
          sectionName: section,
          proposal: context,
        },
        {
          headers: this.getHeaders(),
          timeout: 30000, // 30 second timeout
        }
      );

      if (!response.data?.data?.content) {
        throw new Error("Invalid response format from server");
      }

      return response.data.data.content;
    } catch (error: any) {
      console.error(
        "AI generation error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 401) {
        throw new Error("Authentication required");
      } else if (error.response?.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("Failed to generate content. Please try again.");
      }
    }
  }

  static async improveContent(
    content: string,
    feedback: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_URL}/ai/improve`,
        { content, feedback },
        {
          headers: this.getHeaders(),
          timeout: 30000,
        }
      );

      if (!response.data?.data?.content) {
        throw new Error("Invalid response format from server");
      }

      return response.data.data.content;
    } catch (error: any) {
      console.error(
        "AI improvement error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to improve content. Please try again.");
    }
  }
}
