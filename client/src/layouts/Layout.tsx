import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  PenTool,
  Folder,
  CheckSquare,
  Settings,
  Bell,
  User,
  Menu,
  Search,
  ChevronRight,
} from "lucide-react";

interface NavLink {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { name: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
  {
    name: "Create Proposal",
    path: "/create",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: "Templates",
    path: "/template",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    name: "Proposal Editor",
    path: "/edit",
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    name: "My Proposals",
    path: "/proposals",
    icon: <Folder className="w-5 h-5" />,
  },
  {
    name: "Review",
    path: "/review",
    icon: <CheckSquare className="w-5 h-5" />,
  },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-2 lg:ml-0">
                <span className="text-xl font-semibold">Grant Portal</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6" />
              </button>

              <Link to="/settings" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen pt-16 
        group hover:w-64 w-16 transition-all duration-300 ease-in-out
        bg-white border-r border-gray-200 lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full px-3 py-4 overflow-hidden">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center p-2 rounded-lg group relative
                    ${
                      location.pathname === link.path
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <div className="min-w-[20px]">{link.icon}</div>
                  <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <ChevronRight className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              </li>
            ))}

            {/* Settings at bottom */}
            <li className="absolute bottom-4 w-[calc(100%-24px)]">
              <Link
                to="/settings"
                className={`flex items-center p-2 rounded-lg group relative
                  ${
                    location.pathname === "/settings"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <div className="min-w-[20px]">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="ml-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Settings
                </span>
                {location.pathname === "/settings" && (
                  <ChevronRight className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-16 pt-16 transition-all duration-300 ease-in-out">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
