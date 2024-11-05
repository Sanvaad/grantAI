import React, { useState } from "react";
import {
  Check,
  AlertCircle,
  Download,
  Edit3,
  ChevronRight,
  ChevronDown,
  FileText,
  AlertTriangle,
  X,
  ExternalLink,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string;
  status: "complete" | "incomplete" | "warning";
  lastModified: string;
  warnings?: string[];
  wordCount: number;
  requiredWordCount?: { min: number; max: number };
}

const SubmissionReview = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const sections: Section[] = [
    {
      id: "executive-summary",
      title: "Executive Summary",
      content:
        "Our organization seeks $75,000 to implement an innovative community health program...",
      status: "complete",
      lastModified: "2 hours ago",
      wordCount: 250,
      requiredWordCount: { min: 200, max: 300 },
    },
    {
      id: "problem-statement",
      title: "Problem Statement",
      content:
        "The community faces significant healthcare accessibility challenges...",
      status: "warning",
      lastModified: "1 day ago",
      warnings: [
        "Consider adding more statistical evidence",
        "Reference recent studies or data",
      ],
      wordCount: 450,
      requiredWordCount: { min: 400, max: 600 },
    },
    {
      id: "budget",
      title: "Budget",
      content: "Detailed budget breakdown...",
      status: "incomplete",
      lastModified: "3 days ago",
      warnings: ["Missing overhead costs calculation"],
      wordCount: 150,
    },
  ];

  const requirements = [
    { id: 1, text: "All sections completed", met: false },
    { id: 2, text: "Budget details provided", met: false },
    { id: 3, text: "Supporting documents attached", met: true },
    { id: 4, text: "Contact information verified", met: true },
    { id: 5, text: "Word count requirements met", met: true },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      complete: "text-green-600 bg-green-100",
      incomplete: "text-red-600 bg-red-100",
      warning: "text-yellow-600 bg-yellow-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <Check className="h-5 w-5 text-green-600" />;
      case "incomplete":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Review Your Proposal
              </h1>
              <p className="mt-1 text-gray-600">
                Community Health Initiative Grant
              </p>
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              disabled={sections.some((s) => s.status === "incomplete")}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Proposal
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Sections */}
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === section.id ? null : section.id
                      )
                    }
                  >
                    <div className="flex items-start">
                      {getStatusIcon(section.status)}
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Last edited {section.lastModified}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-400 hover:text-gray-600">
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transform transition-transform ${
                          expandedSection === section.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {expandedSection === section.id && (
                    <div className="mt-4">
                      <div className="prose max-w-none">
                        <p className="text-gray-700">{section.content}</p>
                      </div>

                      {section.warnings && section.warnings.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                          <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-yellow-800">
                                Review Suggestions
                              </h4>
                              <ul className="mt-2 text-sm text-yellow-700">
                                {section.warnings.map((warning, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="mr-2">•</span>
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>{section.wordCount} words</span>
                        {section.requiredWordCount && (
                          <span>
                            Required: {section.requiredWordCount.min}-
                            {section.requiredWordCount.max} words
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Requirements Checklist */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Submission Requirements
              </h2>
              <div className="space-y-4">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                        req.met ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {req.met ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <span
                      className={`ml-3 text-sm ${
                        req.met ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF Preview
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <FileText className="h-5 w-5 mr-2" />
                  Print Preview
                </button>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Submission Guidelines
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Review all sections carefully before submission
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Ensure all required documents are attached
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Verify budget calculations and totals
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Ready to Submit?
            </h3>
            <p className="text-gray-600 mb-6">
              Once submitted, you won't be able to make further changes to your
              proposal.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle submission
                  setShowSubmitModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionReview;
