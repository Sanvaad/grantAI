// src/pages/GeneratedProposal.tsx
import React from "react";
import { useLocation } from "react-router-dom";

interface GeneratedProposalProps {
  formData: Record<string, any>;
  generatedContent: Record<string, string>;
}

const GeneratedProposal: React.FC = () => {
  const location = useLocation();
  const { formData, generatedContent } =
    location.state as GeneratedProposalProps;

  const sections = [
    {
      title: "Executive Summary",
      content: generatedContent.summary || formData.summary,
    },
    {
      title: "Problem Statement",
      content: generatedContent.problemStatement || formData.problemStatement,
    },
    {
      title: "Target Audience",
      content: generatedContent.targetAudience || formData.targetAudience,
    },
    {
      title: "Solution Description",
      content:
        generatedContent.solutionDescription || formData.solutionDescription,
    },
    {
      title: "Methodology",
      content: generatedContent.methodology || formData.methodology,
    },
    {
      title: "Timeline & Milestones",
      content: generatedContent.milestones || formData.milestones,
    },
    {
      title: "Budget & Resources",
      content: `Total Budget: $${formData.totalBudget}\n\n${
        generatedContent.budgetBreakdown || formData.budgetBreakdown
      }`,
    },
    {
      title: "Expected Outcomes",
      content: generatedContent.expectedOutcomes || formData.expectedOutcomes,
    },
    {
      title: "Team & Organization",
      content: `${generatedContent.teamMembers || formData.teamMembers}\n\n${
        generatedContent.organizationCapability ||
        formData.organizationCapability
      }`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              {formData.projectTitle}
            </h1>
            <p className="mt-2 text-gray-600">{formData.projectType}</p>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className={`${
                  index !== 0 ? "mt-8 pt-8 border-t border-gray-200" : ""
                }`}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-blue max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedProposal;
