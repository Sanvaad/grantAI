import React, { useState } from "react";
import {
  Bold,
  Italic,
  List,
  Table,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Save,
  Download,
  Clock,
  HelpCircle,
  X,
  Check,
  ChevronRight,
  FileText,
  Undo,
  Redo,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string;
  guidelines: string[];
  examples: string;
  lastSaved?: string;
}

const ProposalEditor = () => {
  const [activeSection, setActiveSection] =
    useState<string>("executive-summary");
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const sections: Section[] = [
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: "Your executive summary content here...",
      guidelines: [
        "Keep it concise and clear",
        "Highlight the key points of your proposal",
        "Include your main objectives and expected outcomes",
        "Mention the total funding amount requested",
      ],
      examples:
        "Example: Our organization seeks $50,000 to implement an innovative education program...",
      lastSaved: "5 minutes ago",
    },
    {
      id: "problem-statement",
      title: "Problem Statement",
      content: "Describe the problem your project addresses...",
      guidelines: [
        "Clearly define the problem or need",
        "Include relevant statistics or research",
        "Explain why this problem needs to be addressed now",
        "Describe who is affected by this problem",
      ],
      examples: "Example: In our community, 40% of students lack access to...",
      lastSaved: "10 minutes ago",
    },
    // Add more sections as needed
  ];

  const handleSave = () => {
    setSaveStatus("saving");
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("saved");
    }, 1000);
  };

  const ToolbarButton = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <button
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
      onClick={onClick}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Community Health Initiative Grant
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`text-sm ${
                  saveStatus === "saved"
                    ? "text-green-500"
                    : saveStatus === "saving"
                      ? "text-gray-400"
                      : "text-yellow-500"
                }`}
              >
                {saveStatus === "saved"
                  ? "All changes saved"
                  : saveStatus === "saving"
                    ? "Saving..."
                    : "Unsaved changes"}
              </span>

              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Draft
              </button>

              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Section Navigation */}
        <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeSection === section.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                {section.title}
                {section.lastSaved && (
                  <Clock className="h-4 w-4 ml-auto text-gray-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-2">
              <div className="flex items-center space-x-2">
                <ToolbarButton
                  icon={<Bold className="h-5 w-5" />}
                  label="Bold"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<Italic className="h-5 w-5" />}
                  label="Italic"
                  onClick={() => {}}
                />
                <div className="h-5 border-l border-gray-300 mx-2" />
                <ToolbarButton
                  icon={<Heading1 className="h-5 w-5" />}
                  label="Heading 1"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<Heading2 className="h-5 w-5" />}
                  label="Heading 2"
                  onClick={() => {}}
                />
                <div className="h-5 border-l border-gray-300 mx-2" />
                <ToolbarButton
                  icon={<List className="h-5 w-5" />}
                  label="Bullet List"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<Table className="h-5 w-5" />}
                  label="Insert Table"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<Link className="h-5 w-5" />}
                  label="Insert Link"
                  onClick={() => {}}
                />
                <div className="h-5 border-l border-gray-300 mx-2" />
                <ToolbarButton
                  icon={<AlignLeft className="h-5 w-5" />}
                  label="Align Left"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<AlignCenter className="h-5 w-5" />}
                  label="Align Center"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<AlignRight className="h-5 w-5" />}
                  label="Align Right"
                  onClick={() => {}}
                />
                <div className="h-5 border-l border-gray-300 mx-2" />
                <ToolbarButton
                  icon={<Undo className="h-5 w-5" />}
                  label="Undo"
                  onClick={() => {}}
                />
                <ToolbarButton
                  icon={<Redo className="h-5 w-5" />}
                  label="Redo"
                  onClick={() => {}}
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 max-w-4xl mx-auto">
              <textarea
                className="w-full min-h-[500px] p-4 text-gray-800 text-lg border-0 focus:outline-none focus:ring-0 resize-none"
                placeholder="Start writing your proposal..."
                value={sections.find((s) => s.id === activeSection)?.content}
                onChange={() => setSaveStatus("unsaved")}
              />
            </div>
          </div>

          {/* Guidelines Sidebar */}
          {showGuidelines && (
            <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Section Guidelines
                </h3>
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Tips
                  </h4>
                  <ul className="space-y-2">
                    {sections
                      .find((s) => s.id === activeSection)
                      ?.guidelines.map((tip, index) => (
                        <li key={index} className="flex text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Example
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {sections.find((s) => s.id === activeSection)?.examples}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <Download className="h-5 w-5 mr-2" />
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalEditor;
