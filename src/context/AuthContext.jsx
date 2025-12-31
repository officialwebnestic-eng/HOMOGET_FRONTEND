import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import { http } from "../axios/axios";
import { useToast } from "../model/SuccessToasNotification";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { addToast } = useToast();

  const [user, setUser] = useState({
    id: "",
    firstname: "",
    lastname: "",
    role: "",
    email: "",
  });
   
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use useCallback to keep the function reference stable
  const setUserDetails = useCallback((userData) => {
    setUser({
      // Maps both _id (from DB) and id (from frontend logic)
      id: userData._id || userData.id || "",
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      role: userData.role || "",
      email: userData.email || "",
    });
    setIsAuthenticated(true);
  }, []);

  const logoutUser = async () => {
    try {
      const res = await http.post("/logoutuser", {}, { withCredentials: true });

      if (res.data.success) {
        setUser({
          id: "",
          firstname: "",
          lastname: "",
          role: "",
          email: "",
        });
        setIsAuthenticated(false);
        addToast("Logged out successfully");
      } else {
        addToast("Logout failed", "error");
      }
    } catch (err) {
      console.error("Logout error:", err?.response?.data || err.message);
      addToast("Logout failed", "error");
    }
  };

  // Check auth status on initial load or refresh
  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        const res = await http.get("/checkauth", { withCredentials: true });
        if (res.data.success && res.data.user) {
          setUserDetails(res.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [setUserDetails]);

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
      {/* This check prevents protected routes from redirecting 
        to login before the 'checkauth' API finishes 
      */}
      {!loading ? (
        children
      ) : (
        <div className="flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};