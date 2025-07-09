import React from "react";
import { useAuth } from "../AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl text-center border border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome, {user?.email || "User"}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This is your personalized user dashboard.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
          <p className="text-gray-700 text-left">
            Here you can find information and features specific to a regular
            user. This content is protected and only accessible after successful
            login.
          </p>
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

export default Dashboard;
