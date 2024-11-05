// src/types/index.ts
export interface UserDocument extends Document {
  email: string;
  password: string;
  name: string;
  organization?: string;
  role: "user" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ProposalSection {
  title: string;
  content: string;
  aiGenerated: boolean;
  lastModified: Date;
}

export interface ProposalDocument extends Document {
  userId: string;
  projectTitle: string;
  organizationType: string;
  missionStatement?: string;
  targetAmount?: number;
  projectTimeline?: string;
  targetAudience?: string;
  objectives: string[];
  teamSize?: number;
  sections: {
    executiveSummary?: ProposalSection;
    needStatement?: ProposalSection;
    projectDescription?: ProposalSection;
    methodology?: ProposalSection;
    evaluation?: ProposalSection;
    sustainability?: ProposalSection;
    budget?: ProposalSection;
  };
  status: "draft" | "in_review" | "completed";
  version: number;
}

export interface CustomRequest extends Request {
  user?: UserDocument;
}
