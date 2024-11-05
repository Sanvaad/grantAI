import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  HelpCircle,
  Check,
  X,
  Wand2,
  RefreshCw,
  FileText,
  Target,
  Calendar,
  DollarSign,
  Users,
  BarChart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AIService } from "../services/aiService";
import { useNavigate } from "react-router-dom";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  fields: FormField[];
  tips: string[];
  examples?: string;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select";
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  options?: string[];
  validation?: (value: string) => string | null;
  aiAssistEnabled?: boolean;
}

interface Toast {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "info";
}

const CreateProposal: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showGuidance, setShowGuidance] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<
    "saved" | "saving" | "unsaved"
  >("saved");
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [completedSections, setCompletedSections] = useState<Set<string>>(
    new Set()
  );
  const [generatedContent, setGeneratedContent] = useState<
    Record<string, string>
  >({});
  const [showGeneratedPreview, setShowGeneratedPreview] = useState<
    Record<string, boolean>
  >({});

  const navigate = useNavigate();

  useEffect(() => {
    // Get all filled fields in the current section that have AI assist enabled
    const currentFields = sections[currentSection].fields
      .filter((field) => field.aiAssistEnabled && formData[field.id])
      .map((field) => field.id);

    // Generate content for each field that doesn't have generated content yet
    currentFields.forEach((fieldId) => {
      if (!generatedContent[fieldId] && formData[fieldId]) {
        handleGenerateContent(fieldId);
      }
    });
  }, [currentSection]); // Only run when changing sections

  const sections: Section[] = [
    {
      id: "overview",
      title: "Project Overview",
      icon: <FileText className="h-5 w-5" />,
      description: "Provide a comprehensive overview of your project",
      fields: [
        {
          id: "projectTitle",
          label: "Project Title",
          type: "text",
          required: true,
          tooltip: "Choose a clear, descriptive title for your project",
          validation: (value: string): string | null =>
            value.length < 5 ? "Title must be at least 5 characters" : null,
        },
        {
          id: "projectType",
          label: "Project Type",
          type: "select",
          options: [
            "Research",
            "Community Development",
            "Education",
            "Healthcare",
            "Other",
          ],
          required: true,
        },
        {
          id: "summary",
          label: "Executive Summary",
          type: "textarea",
          required: true,
          placeholder: "Provide a brief summary of your project...",
          tooltip: "Summarize your project in 2-3 paragraphs",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Keep your title clear and specific",
        "Focus on the main problem you're addressing",
        "Highlight the unique aspects of your approach",
      ],
      examples:
        'Example Title: "Implementing AI-Driven Early Disease Detection in Rural Communities"',
    },
    {
      id: "problem",
      title: "Problem Statement",
      icon: <Target className="h-5 w-5" />,
      description: "Define the problem your project aims to solve",
      fields: [
        {
          id: "problemStatement",
          label: "Problem Description",
          type: "textarea",
          required: true,
          placeholder: "Describe the specific problem or challenge...",
          tooltip: "Clearly articulate the problem and its significance",
          aiAssistEnabled: true,
        },
        {
          id: "targetAudience",
          label: "Target Audience",
          type: "textarea",
          required: true,
          placeholder: "Describe who will benefit from your solution...",
          tooltip: "Identify the specific groups or communities affected",
          aiAssistEnabled: true,
        },
        {
          id: "existingSolutions",
          label: "Existing Solutions",
          type: "textarea",
          required: true,
          placeholder: "Describe current approaches and their limitations...",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Use data and statistics to demonstrate the problem's scope",
        "Explain why existing solutions are inadequate",
        "Connect the problem to your organization's mission",
      ],
      examples:
        "Problem: Despite advances in healthcare technology, rural communities face significant barriers...",
    },
    {
      id: "solution",
      title: "Proposed Solution",
      icon: <Wand2 className="h-5 w-5" />,
      description: "Detail your proposed solution and implementation plan",
      fields: [
        {
          id: "solutionDescription",
          label: "Solution Overview",
          type: "textarea",
          required: true,
          placeholder: "Describe your proposed solution...",
          aiAssistEnabled: true,
        },
        {
          id: "methodology",
          label: "Methodology",
          type: "textarea",
          required: true,
          placeholder: "Outline your approach and methods...",
          aiAssistEnabled: true,
        },
        {
          id: "innovation",
          label: "Innovation & Uniqueness",
          type: "textarea",
          required: true,
          placeholder: "Explain what makes your approach innovative...",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Be specific about your implementation approach",
        "Highlight the innovative aspects of your solution",
        "Explain how your solution addresses the root cause",
      ],
    },
    {
      id: "timeline",
      title: "Timeline & Milestones",
      icon: <Calendar className="h-5 w-5" />,
      description: "Outline your project timeline and key milestones",
      fields: [
        {
          id: "projectDuration",
          label: "Project Duration",
          type: "select",
          options: ["6 months", "12 months", "18 months", "24 months"],
          required: true,
        },
        {
          id: "startDate",
          label: "Proposed Start Date",
          type: "date",
          required: true,
        },
        {
          id: "milestones",
          label: "Key Milestones",
          type: "textarea",
          required: true,
          placeholder: "List your major project milestones and deadlines...",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Break down the project into clear phases",
        "Include specific deadlines for each milestone",
        "Consider potential delays in your timeline",
      ],
    },
    {
      id: "budget",
      title: "Budget & Resources",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Detail your project budget and resource requirements",
      fields: [
        {
          id: "totalBudget",
          label: "Total Budget Required",
          type: "number",
          required: true,
          tooltip: "Enter the total funding amount needed",
        },
        {
          id: "budgetBreakdown",
          label: "Budget Breakdown",
          type: "textarea",
          required: true,
          placeholder: "Provide a detailed breakdown of costs...",
          aiAssistEnabled: true,
        },
        {
          id: "resourceNeeds",
          label: "Resource Requirements",
          type: "textarea",
          required: true,
          placeholder:
            "List required personnel, equipment, and other resources...",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Include both direct and indirect costs",
        "Justify each major expense",
        "Consider including matching funds or in-kind contributions",
      ],
    },
    {
      id: "impact",
      title: "Impact & Evaluation",
      icon: <BarChart className="h-5 w-5" />,
      description:
        "Describe the expected impact and how you'll measure success",
      fields: [
        {
          id: "expectedOutcomes",
          label: "Expected Outcomes",
          type: "textarea",
          required: true,
          placeholder: "Describe the anticipated results and impact...",
          aiAssistEnabled: true,
        },
        {
          id: "successMetrics",
          label: "Success Metrics",
          type: "textarea",
          required: true,
          placeholder: "List specific, measurable indicators of success...",
          aiAssistEnabled: true,
        },
        {
          id: "evaluationPlan",
          label: "Evaluation Plan",
          type: "textarea",
          required: true,
          placeholder: "Describe how you will measure and evaluate outcomes...",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Use specific, measurable indicators",
        "Include both quantitative and qualitative metrics",
        "Consider long-term impact beyond the grant period",
      ],
    },
    {
      id: "team",
      title: "Team & Capacity",
      icon: <Users className="h-5 w-5" />,
      description: "Introduce your team and organizational capacity",
      fields: [
        {
          id: "teamMembers",
          label: "Key Team Members",
          type: "textarea",
          required: true,
          placeholder: "List key team members and their qualifications...",
          aiAssistEnabled: true,
        },
        {
          id: "organizationCapability",
          label: "Organizational Capability",
          type: "textarea",
          required: true,
          placeholder: "Describe your organization's relevant experience...",
          aiAssistEnabled: true,
        },
        {
          id: "partnerships",
          label: "Partnerships & Collaborations",
          type: "textarea",
          placeholder: "List any partner organizations and their roles...",
          aiAssistEnabled: true,
        },
      ],
      tips: [
        "Highlight relevant experience and expertise",
        "Demonstrate past successes",
        "Explain how partnerships strengthen your proposal",
      ],
    },
  ];

  // Helper function to map field IDs to AI service section names
  const getAISectionName = (fieldId: string): string => {
    const mappings: Record<string, string> = {
      summary: "executiveSummary",
      problemStatement: "needStatement",
      solutionDescription: "projectDescription",
      methodology: "methodology",
      evaluationPlan: "evaluation",
      budgetBreakdown: "budget",
      resourceNeeds: "sustainability",
    };
    return mappings[fieldId] || fieldId;
  };

  // Function to gather context from all completed sections
  const gatherContext = (): Record<string, any> => {
    return {
      projectTitle: formData.projectTitle || "",
      projectType: formData.projectType || "",
      organizationType: formData.organizationType || "",
      missionStatement: formData.organizationCapability || "",
      targetAmount: parseFloat(formData.totalBudget) || 0,
      projectTimeline: formData.projectDuration || "",
      targetAudience: formData.targetAudience || "",
      objectives: [formData.expectedOutcomes || ""].filter(Boolean),
    };
  };

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info"
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };
  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    setSavedStatus("unsaved");

    const field = sections[currentSection].fields.find((f) => f.id === fieldId);
    if (field?.validation) {
      const error = field.validation(value);
      setErrors((prev) => ({
        ...prev,
        [fieldId]: error || "",
      }));
    }

    // Check if we should trigger AI generation
    if (shouldTriggerGeneration(fieldId, value)) {
      // Debounce the generation to avoid too many API calls
      const timer = setTimeout(() => {
        if (!generatedContent[fieldId] && !isGenerating[fieldId]) {
          handleGenerateContent(fieldId);
        }
      }, 1500); // Wait 1.5 seconds after user stops typing

      // Cleanup the timer
      return () => clearTimeout(timer);
    }
  };

  const handleGenerateCompleteProposal = async () => {
    try {
      setIsGenerating((prev) => ({ ...prev, complete: true }));
      showToast(
        "Generating",
        "Creating your complete proposal. This may take a minute...",
        "info"
      );

      const completeProposal =
        await AIService.generateCompleteProposal(formData);

      // Store the complete proposal in state
      setGeneratedContent((prev) => ({
        ...prev,
        completeProposal,
      }));

      // Navigate to the preview page
      navigate("/generated-proposal", {
        state: {
          formData,
          completeProposal,
        },
      });
    } catch (error: any) {
      showToast(
        "Error",
        error.message || "Failed to generate complete proposal",
        "error"
      );
    } finally {
      setIsGenerating((prev) => ({ ...prev, complete: false }));
    }
  };

  const handleNextClick = () => {
    if (currentSection === sections.length - 1) {
      handleGenerateCompleteProposal();
    } else {
      setCurrentSection((prev) => Math.min(sections.length - 1, prev + 1));
    }
  };

  const shouldTriggerGeneration = (fieldId: string, value: string): boolean => {
    // Only trigger for required fields that have AI assist enabled
    const field = sections[currentSection].fields.find((f) => f.id === fieldId);
    if (!field?.aiAssistEnabled || !field.required) return false;

    // Check if the field has substantial content (e.g., at least 50 characters for text areas)
    if (field.type === "textarea" && value.length >= 50) return true;

    // For other field types, check if they're filled
    return value.length > 0;
  };

  const handleGenerateContent = async (fieldId: string) => {
    try {
      // Check if we're already generating content or if content exists
      if (isGenerating[fieldId] || generatedContent[fieldId]) {
        return;
      }

      setIsGenerating((prev) => ({ ...prev, [fieldId]: true }));

      const aiSectionName = getAISectionName(fieldId);
      const context = {
        ...gatherContext(),
        currentField: fieldId,
        currentContent: formData[fieldId] || "",
        currentSection: sections[currentSection].title,
      };

      const generatedContent = await AIService.generateContent(
        aiSectionName,
        context
      );

      setGeneratedContent((prev) => ({
        ...prev,
        [fieldId]: generatedContent,
      }));

      setShowGeneratedPreview((prev) => ({
        ...prev,
        [fieldId]: true,
      }));

      showToast(
        "AI Suggestion Ready",
        "Review the generated content below the field.",
        "info"
      );
    } catch (error: any) {
      console.error("Generation error:", error);
      showToast(
        "Error",
        error.message || "Failed to generate content. Please try again.",
        "error"
      );
    } finally {
      setIsGenerating((prev) => ({ ...prev, [fieldId]: false }));
    }
  };

  const handleImproveContent = async (fieldId: string) => {
    try {
      setIsGenerating((prev) => ({ ...prev, [fieldId]: true }));

      const currentContent = formData[fieldId] || "";
      const feedback =
        "Make it more concise and impactful while maintaining grant writing best practices";

      const improvedContent = await AIService.improveContent(
        currentContent,
        feedback
      );

      setGeneratedContent((prev) => ({
        ...prev,
        [fieldId]: improvedContent,
      }));

      setShowGeneratedPreview((prev) => ({
        ...prev,
        [fieldId]: true,
      }));

      showToast(
        "Success",
        "Content improved! Review and apply if satisfied.",
        "success"
      );
    } catch (error) {
      showToast(
        "Error",
        "Failed to improve content. Please try again.",
        "error"
      );
    } finally {
      setIsGenerating((prev) => ({ ...prev, [fieldId]: false }));
    }
  };

  const handleApplyGeneratedContent = (fieldId: string) => {
    const content = generatedContent[fieldId];
    if (content) {
      setFormData((prev) => ({
        ...prev,
        [fieldId]: content,
      }));
      setCompletedSections((prev) => new Set([...prev, fieldId]));
      setShowGeneratedPreview((prev) => ({
        ...prev,
        [fieldId]: false,
      }));
      showToast("Success", "Generated content applied!", "success");
    }
  };

  const handleSave = async () => {
    try {
      setSavedStatus("saving");
      // Implement your API call to save the form data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSavedStatus("saved");
      showToast(
        "Success",
        "Your proposal has been saved successfully.",
        "success"
      );
    } catch (error) {
      setSavedStatus("unsaved");
      showToast("Error", "Failed to save changes. Please try again.", "error");
    }
  };
  const GeneratedContentPreview: React.FC<{ fieldId: string }> = ({
    fieldId,
  }) => {
    if (!showGeneratedPreview[fieldId] || !generatedContent[fieldId]) {
      return null;
    }

    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium text-blue-900">
            AI Generated Content
          </h4>
          <button
            onClick={() =>
              setShowGeneratedPreview((prev) => ({
                ...prev,
                [fieldId]: false,
              }))
            }
            className="text-blue-500 hover:text-blue-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-60 overflow-y-auto">
          <p className="text-sm text-blue-800 whitespace-pre-wrap">
            {generatedContent[fieldId]}
          </p>
        </div>
        <div className="mt-3 flex space-x-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            onClick={() => handleApplyGeneratedContent(fieldId)}
          >
            Apply Content
          </button>
          <button
            className="px-3 py-1 bg-white text-blue-600 text-sm rounded-md border border-blue-600 hover:bg-blue-50"
            onClick={() => handleGenerateContent(fieldId)}
          >
            Generate New Version
          </button>
        </div>
      </div>
    );
  };

  const renderField = (field: FormField) => {
    const baseInputClass = `w-full px-4 py-2 rounded-lg border ${
      errors[field.id] ? "border-red-300" : "border-gray-300"
    } focus:outline-none focus:ring-2 focus:ring-blue-500`;

    const renderAIButtons = field.aiAssistEnabled && (
      <div className="mt-2 space-x-2">
        <button
          className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isGenerating[field.id] ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => handleGenerateContent(field.id)}
          disabled={isGenerating[field.id]}
        >
          {isGenerating[field.id] ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {isGenerating[field.id] ? "Generating..." : "Generate"}
        </button>
        {formData[field.id] && (
          <button
            className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isGenerating[field.id] ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleImproveContent(field.id)}
            disabled={isGenerating[field.id]}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Improve
          </button>
        )}
      </div>
    );

    const fieldContent = (() => {
      switch (field.type) {
        case "textarea":
          return (
            <div>
              <textarea
                className={`${baseInputClass} min-h-[120px]`}
                rows={5}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
              {renderAIButtons}
              <GeneratedContentPreview fieldId={field.id} />
            </div>
          );
        case "select":
          return (
            <select
              className={baseInputClass}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            >
              <option value="">Select an option</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        default:
          return (
            <input
              type={field.type}
              className={baseInputClass}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
            />
          );
      }
    })();

    return (
      <div key={field.id}>
        <div className="flex items-center mb-1">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.tooltip && (
            <div className="ml-2 group relative">
              <HelpCircle className="h-4 w-4 text-gray-400" />
              <div className="hidden group-hover:block absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg w-64">
                {field.tooltip}
              </div>
            </div>
          )}
        </div>
        {fieldContent}
        {errors[field.id] && (
          <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 pt-5">
        <div className="px-4 pb-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
        </div>
        <nav className="mt-4">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(index)}
              className={`w-full flex items-center px-4 py-2 text-sm ${
                currentSection === index
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {section.icon}
              <span className="ml-3">{section.title}</span>
              {Object.keys(formData).some((key) =>
                key.startsWith(section.id)
              ) && <Check className="ml-auto h-4 w-4 text-green-500" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round(((currentSection + 1) / sections.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentSection + 1) / sections.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="fixed top-4 right-4 z-50">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`mb-2 p-4 rounded-lg shadow-lg ${
                    toast.type === "success"
                      ? "bg-green-500"
                      : toast.type === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  } text-white`}
                >
                  <div className="font-semibold">{toast.title}</div>
                  <div className="text-sm">{toast.message}</div>
                </div>
              ))}
            </div>

            {/* Section Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {sections[currentSection].title}
                </h1>
                <p className="text-gray-600">
                  {sections[currentSection].description}
                </p>
              </div>

              <div className="space-y-6">
                {sections[currentSection].fields.map((field) =>
                  renderField(field)
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() =>
                    setCurrentSection((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentSection === 0}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    currentSection === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-4">
                  <span
                    className={`text-sm ${
                      savedStatus === "saved"
                        ? "text-green-500"
                        : savedStatus === "saving"
                          ? "text-gray-400"
                          : "text-yellow-500"
                    }`}
                  >
                    {savedStatus === "saved"
                      ? "All changes saved"
                      : savedStatus === "saving"
                        ? "Saving..."
                        : "Unsaved changes"}
                  </span>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Save className="h-5 w-5 mr-1" />
                    Save Draft
                  </button>
                  <button
                    onClick={handleNextClick}
                    disabled={
                      currentSection === sections.length - 1 &&
                      !formData.projectTitle
                    } // Add validation as needed
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {currentSection === sections.length - 1
                      ? "Generate Proposal"
                      : "Next"}
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Panel */}
        {showGuidance && (
          <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Guidance</h3>
              <button
                onClick={() => setShowGuidance(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tips</h4>
                <ul className="space-y-2">
                  {sections[currentSection].tips.map((tip, index) => (
                    <li key={index} className="flex text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {sections[currentSection].examples && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Example
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {sections[currentSection].examples}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProposal;
