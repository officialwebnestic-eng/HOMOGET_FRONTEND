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
    console.log("🔄 Setting user details:", userData);
    
    const profilePhoto = userData?.profilePhoto || userData?.image || "";
    const image = userData?.image || userData?.profilePhoto || "";
    
    const userObj = {
      id: userData._id || userData.id || "",
      firstname: userData.firstname || userData.name?.split(" ")[0] || "",
      lastname: userData.lastname || userData.name?.split(" ")[1] || "",
      role: userData.role || "",
      email: userData.email || "",
      profilePhoto: profilePhoto,
      image: image,
      phone: userData.phone || "",
      address: userData.address || "",
      bio: userData.bio || "",
      skills: userData.skills || [],
      agentId: userData.agentId || "",
      reraLicenseNumber: userData.reraLicenseNumber || "",
      experienceYears: userData.experienceYears || 0,
      languages: userData.languages || [],
      totalPropertiesSold: userData.totalPropertiesSold || 0,
      totalRevenueGenerated: userData.totalRevenueGenerated || 0,
      visaStatus: userData.visaStatus || "",
      nationality: userData.nationality || "",
      emiratesId: userData.emiratesId || "",
      gender: userData.gender || "",
      isPublic: userData.isPublic !== undefined ? userData.isPublic : true,
      isBlocked: userData.isBlocked || false,
      status: userData.status || "Active",
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
    
    console.log("✅ User object set:", userObj);
    console.log("🖼️ Profile photo in userObj:", userObj.profilePhoto);
    
    setUser(userObj);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userObj));
  }, []);

  const logoutUser = async () => {
    try {
      const res = await http.post("/logoutuser", {}, { withCredentials: true });
      if (res.data.success) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        addToast("Logged out successfully", "success");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout error:", err);
      addToast("Logout failed", "error");
    }
  };

  // ✅ FIX: Auth check with better handling
  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        // First try to get user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.id) {
              console.log("📦 Loaded user from localStorage:", parsedUser);
              setUser(parsedUser);
              setIsAuthenticated(true);
              // Don't set loading to false yet - we'll verify with backend
            }
          } catch (e) {
            console.error("Error parsing stored user:", e);
            localStorage.removeItem("user");
          }
        }

        // Always verify with backend
        const res = await http.get("/checkauth", { 
          withCredentials: true 
        }).catch(err => {
          if (err.response?.status === 401) {
            console.log("⚠️ Cookie expired or invalid");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
          return null;
        });
        
        console.log("📡 Auth check response:", res?.data);
        
        if (res?.data?.success && res.data.user) {
          const backendUser = res.data.user;
          console.log("👤 Backend user data:", backendUser);
          console.log("🖼️ Backend profile photo:", backendUser?.profilePhoto);
          
          // ✅ Use backend data (it has the full profile)
          const userObj = {
            id: backendUser.id || backendUser._id || "",
            firstname: backendUser.name?.split(" ")[0] || backendUser.firstname || "",
            lastname: backendUser.name?.split(" ")[1] || backendUser.lastname || "",
            role: backendUser.role || "",
            email: backendUser.email || "",
            profilePhoto: backendUser.profilePhoto || backendUser.image || "",
            image: backendUser.image || backendUser.profilePhoto || "",
            phone: backendUser.phone || "",
            address: backendUser.address || "",
            bio: backendUser.bio || "",
            skills: backendUser.skills || [],
            agentId: backendUser.agentId || "",
            reraLicenseNumber: backendUser.reraLicenseNumber || "",
            experienceYears: backendUser.experienceYears || 0,
            languages: backendUser.languages || [],
            totalPropertiesSold: backendUser.totalPropertiesSold || 0,
            totalRevenueGenerated: backendUser.totalRevenueGenerated || 0,
            visaStatus: backendUser.visaStatus || "",
            nationality: backendUser.nationality || "",
            emiratesId: backendUser.emiratesId || "",
            gender: backendUser.gender || "",
            isPublic: backendUser.isPublic !== undefined ? backendUser.isPublic : true,
            isBlocked: backendUser.isBlocked || false,
            status: backendUser.status || "Active",
            createdAt: backendUser.createdAt,
            updatedAt: backendUser.updatedAt,
          };
          
          console.log("✅ Setting user from backend:", userObj);
          console.log("🖼️ Profile photo from backend:", userObj.profilePhoto);
          
          setUser(userObj);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userObj));
        } else {
          // If backend fails and we have localStorage, keep it
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setIsAuthenticated(false);
          setUser(null);
        }
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