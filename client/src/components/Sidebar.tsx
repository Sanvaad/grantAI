import { BookOpen, FileText, HelpCircle, Settings } from "lucide-react";
import React from "react";

export default function Sidebar() {
  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 pt-5">
      <nav className="mt-5 flex-1 px-2 space-y-1">
        <a
          href="#"
          className="group flex items-center px-2 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-600"
        >
          <FileText className="mr-3 h-5 w-5" />
          Dashboard
        </a>
        <a
          href="#"
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <BookOpen className="mr-3 h-5 w-5" />
          Resources
        </a>
        <a
          href="#"
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </a>
        <a
          href="#"
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <HelpCircle className="mr-3 h-5 w-5" />
          Help Center
        </a>
      </nav>
    </div>
  );
}
