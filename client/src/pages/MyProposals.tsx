import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit3,
  Copy,
  Archive,
  Trash2,
  Download,
  ChevronDown,
  Eye,
  Calendar,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Proposal {
  id: string;
  title: string;
  type: string;
  status: "draft" | "submitted" | "approved" | "denied" | "reviewing";
  submissionDate?: string;
  lastModified: string;
  grantAmount: string;
  organization: string;
  dueDate?: string;
  progress: number;
}

const MyProposals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lastModified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const proposals: Proposal[] = [
    {
      id: "1",
      title: "Community Health Initiative",
      type: "Healthcare",
      status: "submitted",
      submissionDate: "2024-02-15",
      lastModified: "2024-02-15",
      grantAmount: "$75,000",
      organization: "Health Foundation",
      dueDate: "2024-03-01",
      progress: 100,
    },
    {
      id: "2",
      title: "Youth Education Program",
      type: "Education",
      status: "draft",
      lastModified: "2024-02-14",
      grantAmount: "$50,000",
      organization: "Education Trust",
      dueDate: "2024-03-15",
      progress: 65,
    },
    {
      id: "3",
      title: "AI Ethics Research Grant",
      type: "Research",
      status: "approved",
      submissionDate: "2024-01-20",
      lastModified: "2024-02-10",
      grantAmount: "$150,000",
      organization: "Tech Foundation",
      dueDate: "2024-02-01",
      progress: 100,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      denied: "bg-red-100 text-red-800",
      reviewing: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredProposals = proposals.filter((proposal) => {
    const matchesSearch =
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || proposal.status === statusFilter;
    const matchesType = typeFilter === "all" || proposal.type === typeFilter;

    let matchesDate = true;
    if (dateFilter === "thisMonth") {
      const thisMonth = new Date().getMonth();
      const proposalMonth = new Date(proposal.lastModified).getMonth();
      matchesDate = thisMonth === proposalMonth;
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const sortedProposals = [...filteredProposals].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    const order = sortOrder === "asc" ? 1 : -1;
    return aValue > bValue ? order : -order;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Proposals
          </h1>
          <p className="text-gray-600">
            Manage and track all your grant proposals
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
              <option value="reviewing">Under Review</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Research">Research</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>

        {/* Proposals Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center"
                      onClick={() => {
                        if (sortBy === "title") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("title");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      Title & Organization
                      {sortBy === "title" && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transform ${
                            sortOrder === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center"
                      onClick={() => {
                        if (sortBy === "lastModified") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("lastModified");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      Last Modified
                      {sortBy === "lastModified" && (
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transform ${
                            sortOrder === "desc" ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedProposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className={`hover:bg-gray-50 ${
                      selectedProposal === proposal.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => setSelectedProposal(proposal.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {proposal.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {proposal.organization}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}
                      >
                        {proposal.status.charAt(0).toUpperCase() +
                          proposal.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(proposal.lastModified).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {proposal.dueDate
                        ? new Date(proposal.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${proposal.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">
                          {proposal.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="p-1 text-gray-400 hover:text-gray-500"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-500"
                          title="Duplicate"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-500"
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-gray-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProposals.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No proposals found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProposals;
