import React from "react";
import { useAuth } from "../AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.hash = "/login";
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    window.location.hash = "/";
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100">
        <div className="text-2xl font-bold text-red-700">Access Denied</div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
