// context/AuthContext.jsx
import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { http } from "../axios/axios";
import { useToast } from "../model/SuccessToasNotification";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setUserDetails = useCallback((userData) => {
    console.log("Setting user details:", userData);
    setUser({
      id: userData._id || userData.id || "",
      firstname: userData.firstname || userData.name?.split(" ")[0] || "",
      lastname: userData.lastname || userData.name?.split(" ")[1] || "",
      role: userData.role || "",
      email: userData.email || "",
    });
    setIsAuthenticated(true);
  }, []);

  const logoutUser = async () => {
    try {
      const res = await http.post("/logoutuser", {}, { withCredentials: true });
      if (res.data.success) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user"); // Only remove user, token is in cookie
        addToast("Logged out successfully", "success");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout error:", err);
      addToast("Logout failed", "error");
    }
  };

// context/AuthContext.jsx
useEffect(() => {
  const verifyUser = async () => {
    setLoading(true);
    try {
      const res = await http.get("/checkauth", { 
        withCredentials: true 
      }).catch(err => {
        // If cookie is expired or invalid, clear it
        if (err.response?.status === 401) {
          console.log("⚠️ Cookie expired or invalid");
          // Clear the expired cookie
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        return null;
      });
      
      console.log("📡 Auth check response:", res?.data);
      
      if (res?.data?.success && res.data.user) {
        const backendUser = res.data.user;
        setUser({
          id: backendUser.id || backendUser._id,
          firstname: backendUser.name?.split(" ")[0] || backendUser.firstname || "",
          lastname: backendUser.name?.split(" ")[1] || backendUser.lastname || "",
          role: backendUser.role,
          email: backendUser.email,
        });
        setIsAuthenticated(true);
        console.log("✅ User authenticated via cookie:", backendUser.role);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  verifyUser();
}, []);




  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      setUserDetails,
      logoutUser,
      loading,
    }),
    [user, isAuthenticated, loading, setUserDetails]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};