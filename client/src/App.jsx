import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./utils/ProtectedRoute";

const AppContent = () => {
  const { isAuthenticated, userRole, loading, login, register } = useAuth();
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.slice(1) || "/"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || "/");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Redirect authenticated users from '/' to their dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && currentPath === "/") {
      window.location.hash =
        userRole === "admin" ? "/admin-dashboard" : "/dashboard";
    }
  }, [loading, isAuthenticated, userRole, currentPath]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          Loading application...
        </div>
      </div>
    );
  }

  return (
    <div className="font-inter">
      {currentPath === "/login" && (
        <AuthForm type="login" onSubmit={login} isLoading={loading} />
      )}
      {currentPath === "/register" && (
        <AuthForm type="register" onSubmit={register} isLoading={loading} />
      )}
      {currentPath === "/dashboard" && (
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <Dashboard />
        </ProtectedRoute>
      )}
      {currentPath === "/admin-dashboard" && (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      )}
      {currentPath === "/" && !isAuthenticated && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Welcome to the Auth App!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Please login or register to continue.
          </p>
          <div className="flex space-x-4">
            <a
              href="#/login"
              className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </a>
            <a
              href="#/register"
              className="bg-green-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
