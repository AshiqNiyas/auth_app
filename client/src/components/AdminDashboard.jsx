import React from "react";
import { useAuth } from "../AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Admin Panel, {user?.email || "Admin"}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          You have administrative privileges.
        </p>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 mb-6">
          <p className="text-gray-700 text-left">
            As an administrator, you have access to advanced settings, user
            management, and system configurations. This area is restricted to
            authorized personnel only.
          </p>
          <ul className="list-disc list-inside text-left text-gray-700 mt-4 space-y-2">
            <li>Manage Users</li>
            <li>View System Logs</li>
            <li>Configure Settings</li>
            <li>Generate Reports</li>
          </ul>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
