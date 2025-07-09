import React, { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Stores user details like email, role
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  // Replace with your actual backend URL
  const API_BASE_URL = "http://localhost:5000/api/auth";

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // In a real app, make a request to your backend's /api/auth/me endpoint
        // to verify the HTTP-only cookie and get user details.
        // If the cookie is valid, the backend will return user info.
        const response = await fetch(`${API_BASE_URL}/me`, {
          credentials: "include",
        }); // 'include' sends cookies
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data);
          setUserRole(data.role);
        } else {
          // If not authenticated or token invalid, clear state
          setIsAuthenticated(false);
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async ({ email, password, setError }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important to receive HTTP-only cookie
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setIsAuthenticated(true);
      setUser(data.user);
      setUserRole(data.user.role);
      // No need to store token in localStorage, cookie handles it
      window.location.hash =
        data.user.role === "admin" ? "/admin-dashboard" : "/dashboard";
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ email, password, setError }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important to receive HTTP-only cookie
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setIsAuthenticated(true);
      setUser(data.user);
      setUserRole(data.user.role);
      window.location.hash = "/dashboard"; // Redirect to dashboard after registration
    } catch (error) {
      setError(
        error.message || "Registration failed. User might already exist."
      );
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include", // Important to send cookie for logout
      });

      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      window.location.hash = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout API fails, clear client-side state
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      window.location.hash = "/login";
    } finally {
      setLoading(false);
    }
  };

  const authContextValue = {
    isAuthenticated,
    user,
    userRole,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
