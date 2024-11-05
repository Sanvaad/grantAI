import React, { useState } from "react";
import {
  Bell,
  User,
  CreditCard,
  Shield,
  Mail,
  Computer,
  ChevronRight,
  Clock,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: string;
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
    marketing: boolean;
  };
  sessions: {
    device: string;
    location: string;
    lastActive: string;
    isCurrentSession: boolean;
  }[];
}

const UserProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Sample user data
  const [user, setUser] = useState<UserProfile>({
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    avatar: "/api/placeholder/100/100",
    plan: "Professional",
    notifications: {
      email: true,
      push: false,
      updates: true,
      marketing: false,
    },
    sessions: [
      {
        device: "Chrome on MacOS",
        location: "San Francisco, CA",
        lastActive: "2 minutes ago",
        isCurrentSession: true,
      },
      {
        device: "Mobile App on iPhone",
        location: "San Francisco, CA",
        lastActive: "2 days ago",
        isCurrentSession: false,
      },
    ],
  });

  const TabButton = ({ name, current }: { name: string; current: boolean }) => (
    <button
      onClick={() => setActiveTab(name.toLowerCase())}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${
          current ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {name}
    </button>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Profile & Settings</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 border-b pb-3">
        <TabButton name="Profile" current={activeTab === "profile"} />
        <TabButton
          name="Notifications"
          current={activeTab === "notifications"}
        />
        <TabButton name="Subscription" current={activeTab === "subscription"} />
      </div>

      {/* Profile Section */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p className="text-gray-500 mb-6">
              Update your photo and personal details here.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Change Photo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Active Sessions Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-2">Active Sessions</h2>
            <p className="text-gray-500 mb-6">
              Manage your active sessions and login activity.
            </p>

            <div className="space-y-4">
              {user.sessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Computer className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-gray-500">
                        {session.location}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.isCurrentSession && (
                    <button className="text-red-600 hover:text-red-700">
                      End Session
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-2">
            Notification Preferences
          </h2>
          <p className="text-gray-500 mb-6">
            Choose how you want to be notified.
          </p>

          <div className="space-y-6">
            {Object.entries(user.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {key === "email" && (
                    <Mail className="h-5 w-5 text-gray-500" />
                  )}
                  {key === "push" && <Bell className="h-5 w-5 text-gray-500" />}
                  <span className="capitalize">{key} Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    className="sr-only peer"
                    onChange={() => {}}
                  />
                  <div
                    className="w-11 h-6 bg-gray-200 rounded-full peer 
                    peer-checked:bg-blue-600 after:content-[''] after:absolute 
                    after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                    after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"
                  ></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscription Section */}
      {activeTab === "subscription" && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
          <p className="text-gray-500 mb-6">
            You are currently on the {user.plan} plan.
          </p>

          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-lg">Professional Plan</p>
                  <p className="text-gray-600">$29/month</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Current Plan
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade Plan
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileSettings;
