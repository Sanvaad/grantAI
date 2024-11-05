import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  FileText,
  ArrowLeft,
} from "lucide-react";

interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
  subsections?: FormSubsection[];
}

interface FormSubsection {
  id: string;
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "number" | "email";
  placeholder?: string;
  required?: boolean;
}

const ProposalForm = () => {
  const [currentTemplate, setCurrentTemplate] = useState<string>("generic");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [showTemplateSelect, setShowTemplateSelect] = useState(true);

  const templates = [
    {
      id: "generic",
      title: "Generic Grant Proposal",
      description:
        "A versatile template suitable for various grant applications",
    },
    {
      id: "nonprofit",
      title: "Non-Profit Grant Proposal",
      description: "Specialized template for non-profit organizations",
    },
    {
      id: "research",
      title: "Research Grant Proposal",
      description:
        "Comprehensive template for academic and scientific research",
    },
  ];

  const sections: Record<string, FormSection[]> = {
    generic: [
      {
        id: "basic-info",
        title: "Basic Information",
        fields: [
          { id: "date", label: "Date Submitted", type: "date", required: true },
          {
            id: "grant-name",
            label: "Grant Name",
            type: "text",
            required: true,
          },
          {
            id: "submitted-to",
            label: "Submitted To",
            type: "text",
            required: true,
          },
          {
            id: "submitted-by",
            label: "Submitted By",
            type: "text",
            required: true,
          },
          {
            id: "org-address",
            label: "Organization Address",
            type: "textarea",
            required: true,
          },
        ],
      },
      {
        id: "project-abstract",
        title: "Project Abstract",
        fields: [
          {
            id: "abstract",
            label: "Project Summary",
            type: "textarea",
            placeholder: "Provide a brief overview of your project...",
            required: true,
          },
        ],
      },
      {
        id: "need-statement",
        title: "Statement of Need",
        fields: [
          {
            id: "need-description",
            label: "Need Description",
            type: "textarea",
            placeholder:
              "Describe the need or problem your project addresses...",
            required: true,
          },
        ],
      },
      {
        id: "goals",
        title: "Goals & Objectives",
        fields: [
          {
            id: "goals",
            label: "Project Goals",
            type: "textarea",
            placeholder: "List your main project goals...",
            required: true,
          },
          {
            id: "objectives",
            label: "Specific Objectives",
            type: "textarea",
            placeholder: "List specific, measurable objectives...",
            required: true,
          },
        ],
      },
      {
        id: "budget",
        title: "Budget",
        fields: [
          {
            id: "total-amount",
            label: "Total Amount Requested",
            type: "number",
            required: true,
          },
          {
            id: "budget-breakdown",
            label: "Budget Breakdown",
            type: "textarea",
            placeholder: "Provide a detailed breakdown of your budget...",
            required: true,
          },
        ],
      },
    ],
    // Add other template sections here
  };

  const currentSections = sections[currentTemplate] || [];

  const handleInputChange = (
    sectionId: string,
    fieldId: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [fieldId]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  if (showTemplateSelect) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Select a Grant Proposal Template
        </h1>
        <div className="grid gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => {
                setCurrentTemplate(template.id);
                setShowTemplateSelect(false);
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {template.title}
                  </h2>
                  <p className="text-gray-600">{template.description}</p>
                </div>
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => setShowTemplateSelect(true)}
        className="flex items-center text-gray-600 mb-6 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {templates.find((t) => t.id === currentTemplate)?.title}
        </h1>
        <div className="flex items-center">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {currentSections.length}
          </div>
          <div className="ml-4 flex-1 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{
                width: `${((currentStep + 1) / currentSections.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentSections[currentStep].title}
          </h2>
          <div className="space-y-4">
            {currentSections[currentStep].fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={5}
                    placeholder={field.placeholder}
                    value={
                      formData[currentSections[currentStep].id]?.[field.id] ||
                      ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        currentSections[currentStep].id,
                        field.id,
                        e.target.value
                      )
                    }
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={field.placeholder}
                    value={
                      formData[currentSections[currentStep].id]?.[field.id] ||
                      ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        currentSections[currentStep].id,
                        field.id,
                        e.target.value
                      )
                    }
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800"
            }`}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </button>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev }))}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <Save className="h-5 w-5 mr-1" />
            Save Draft
          </button>

          {currentStep === currentSections.length - 1 ? (
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Proposal
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setCurrentStep((prev) =>
                  Math.min(currentSections.length - 1, prev + 1)
                )
              }
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;
