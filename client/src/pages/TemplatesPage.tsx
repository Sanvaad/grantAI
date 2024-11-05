import React, { useState } from "react";
import {
  Search,
  FileText,
  Star,
  Filter,
  Eye,
  X,
  ChevronRight,
  Heart,
  Clock,
  DollarSign,
  BookOpen,
  AlertCircle,
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  complexity: "Basic" | "Intermediate" | "Advanced";
  grantAmount: string;
  sections: string[];
  preFilled: boolean;
  popularity: number;
  lastUsed?: string;
  favorite?: boolean;
}

const TemplatesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all");

  const templates: Template[] = [
    {
      id: "1",
      title: "Research Grant Template",
      description:
        "Comprehensive template for academic and scientific research proposals.",
      category: "Research",
      complexity: "Advanced",
      grantAmount: "$50,000 - $500,000",
      sections: [
        "Project Overview",
        "Research Objectives",
        "Methodology",
        "Expected Outcomes",
        "Budget Breakdown",
        "Timeline",
        "Research Team",
      ],
      preFilled: true,
      popularity: 456,
      lastUsed: "2 days ago",
    },
    {
      id: "2",
      title: "Community Development Grant",
      description:
        "Template for local community improvement and development projects.",
      category: "Community",
      complexity: "Intermediate",
      grantAmount: "$10,000 - $100,000",
      sections: [
        "Community Need",
        "Project Goals",
        "Implementation Plan",
        "Community Impact",
        "Budget",
        "Timeline",
      ],
      preFilled: true,
      popularity: 289,
      lastUsed: "1 week ago",
    },
    {
      id: "3",
      title: "Education Initiative Template",
      description:
        "Designed for educational programs and school improvement projects.",
      category: "Education",
      complexity: "Basic",
      grantAmount: "$5,000 - $50,000",
      sections: [
        "Program Overview",
        "Educational Goals",
        "Implementation Strategy",
        "Expected Results",
        "Budget Plan",
      ],
      preFilled: false,
      popularity: 345,
    },
  ];

  const categories = [
    "All",
    "Research",
    "Community",
    "Education",
    "Healthcare",
    "Arts",
  ];
  const complexityLevels = ["All", "Basic", "Intermediate", "Advanced"];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesComplexity =
      selectedComplexity === "all" ||
      template.complexity === selectedComplexity;
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const toggleFavorite = (templateId: string) => {
    setFavorites((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Grant Templates
          </h1>
          <p className="text-gray-600">
            Choose from our collection of professional grant proposal templates
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedComplexity}
                onChange={(e) => setSelectedComplexity(e.target.value)}
              >
                <option value="all">All Complexity Levels</option>
                {complexityLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {template.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(template.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={
                        favorites.includes(template.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{template.category}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{template.complexity}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {template.grantAmount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {template.popularity} uses
                  </span>
                  {template.preFilled && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Pre-filled
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreview(true);
                    }}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Use Template
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview Modal */}
        {showPreview && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTemplate.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {selectedTemplate.description}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {selectedTemplate.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {section}
                      </h3>
                      <p className="text-gray-600">
                        {selectedTemplate.preFilled
                          ? "This section includes pre-filled example content to help you get started."
                          : "This section provides a structured template for your content."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 mr-4"
                >
                  Close Preview
                </button>
                <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Use This Template
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
