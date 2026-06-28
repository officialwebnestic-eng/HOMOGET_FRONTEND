// hooks/useAuth.jsx
import { http } from "../axios/axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../model/SuccessToasNotification";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Debug log
  console.log("🔍 useAuth - AuthContext:", context ? "Available" : "MISSING");

  if (!context) {
    console.error("❌ useAuth must be used within AuthProvider");
    
    return {
      setUserDetails: () => {},
      LoginUser: async (data) => {
        addToast("Authentication error. Please refresh the page.", "error");
      },
      registerUser: async () => {},
      user: null,
      isAuthenticated: false,
      loading: false,
    };
  }

  const { setUserDetails } = context;

  const LoginUser = async (data) => {
    try {
      console.log("🔐 Login attempt with:", data.email);
      
      const response = await http.post("/loginuser", data, {
        withCredentials: true,
      });

      console.log("📡 Login response:", response.data);

      if (response.status === 200 && response.data?.success) {
        const { userData: user } = response.data;
        console.log("👤 User data from login:", user);
        console.log("🖼️ Profile photo from login:", user?.profilePhoto);
        console.log("🖼️ Image from login:", user?.image);

        // ✅ Store COMPLETE user info in localStorage
        const userToStore = {
          id: user._id,
          role: user.role,
          firstname: user.name || user.firstname || "",
          email: user.email,
          profilePhoto: user.profilePhoto || user.image || "",
          image: user.image || user.profilePhoto || "",
          phone: user.phone || "",
          address: user.address || "",
          bio: user.bio || "",
          skills: user.skills || [],
          // Agent specific fields
          agentId: user.agentId || "",
          reraLicenseNumber: user.reraLicenseNumber || "",
          experienceYears: user.experienceYears || 0,
          languages: user.languages || [],
          totalPropertiesSold: user.totalPropertiesSold || 0,
          totalRevenueGenerated: user.totalRevenueGenerated || 0,
          visaStatus: user.visaStatus || "",
          nationality: user.nationality || "",
          emiratesId: user.emiratesId || "",
          gender: user.gender || "",
          isPublic: user.isPublic !== undefined ? user.isPublic : true,
          isBlocked: user.isBlocked || false,
          status: user.status || "Active",
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
        
        localStorage.setItem("user", JSON.stringify(userToStore));
        
        // ✅ Update auth context with COMPLETE user data
        if (setUserDetails) {
          console.log("🔄 Setting user details in context:", user);
          setUserDetails(user);
        }
        
        addToast("Login successful", "success");

        const role = user.role?.toLowerCase().trim();
        
        // ✅ Role-based redirection
        setTimeout(() => {
          if (role === "admin") {
            window.location.href = "/admin-dashboard";
          } else if (role === "agent" || role === "freelancer" || (role !== "admin" && role !== "user")) {
            window.location.href = "/agent-dashboard";
          } else {
            window.location.href = "/";
          }
        }, 500);
      } else {
        addToast(response.data?.message || "Invalid credentials", "error");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      addToast(errorMessage, "error");
    }
  };

  const registerUser = async (data) => {
    try {
      const response = await http.post("/verify-email", data, {
        withCredentials: true,
      });
      if (response?.data?.success) {
        const userEmail = response.data?.user?.email || 
                          response.data?.data?.email || 
                          response.data?.email ||
                          data.email;
        if (!userEmail) {
          return addToast("Registration error: Could not verify email address.", "error");
        }
        addToast("Verification code sent to your email!", "success");
        navigate("/verifyemail", { state: { email: userEmail } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Server Error";
      addToast(msg, "error");
    }
  };

  return {
    setUserDetails,
    LoginUser,
    registerUser,
  };
};