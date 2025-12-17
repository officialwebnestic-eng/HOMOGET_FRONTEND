import { createContext, useEffect, useState, useMemo } from "react";
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

  const setUserDetails = (userData) => {
    setUser({
      id: userData.id,
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      role: userData.role,
      email: userData.email,
    });
    setIsAuthenticated(true);
  };


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


  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await http.get("/checkauth", { withCredentials: true });
        if (res.data.success && res.data.user) {
          setUserDetails({
            id: res.data.user._id,
            firstname: res.data.user.firstname ||  "",
            // lastname: res.data.user.lastname || "",
            role: res.data.user.role,
            email: res.data.user.email,
          });
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
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      setUserDetails,
      logoutUser,
      loading,
    }),
    [user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
