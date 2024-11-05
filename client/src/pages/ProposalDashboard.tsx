import React from "react";
import { Search, Plus, Clock, Edit3 } from "lucide-react";

interface Proposal {
  id: string;
  title: string;
  type: string;
  status: "draft" | "submitted" | "pending";
  lastModified: string;
  progress: number;
}

const ProposalDashboard = () => {
  const recentProposals: Proposal[] = [
    {
      id: "1",
      title: "Community Health Initiative",
      type: "Non-Profit Grant",
      status: "draft",
      lastModified: "2 hours ago",
      progress: 65,
    },
    {
      id: "2",
      title: "Research on AI Ethics",
      type: "Research Grant",
      status: "submitted",
      lastModified: "1 day ago",
      progress: 100,
    },
    {
      id: "3",
      title: "Youth Education Program",
      type: "Generic Grant",
      status: "pending",
      lastModified: "3 days ago",
      progress: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "submitted":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, Alex!
            </h1>
            <p className="mt-1 text-gray-500">
              Continue working on your grant proposals or start a new one.
            </p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            New Proposal
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-96">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search proposals..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Recent
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Status
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            Type
          </button>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentProposals.map((proposal) => (
          <div
            key={proposal.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {proposal.title}
                  </h3>
                  <p className="text-sm text-gray-500">{proposal.type}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    proposal.status
                  )}`}
                >
                  {proposal.status.charAt(0).toUpperCase() +
                    proposal.status.slice(1)}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{proposal.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${proposal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {proposal.lastModified}
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalDashboard;
