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
        console.error("Cannot login - AuthProvider missing");
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
    
    // ✅ Only use withCredentials - no token handling needed
    const response = await http.post("/loginuser", data, {
      withCredentials: true,
    });

    console.log("📡 Login response:", response.data);

    if (response.status === 200 && response.data?.success) {
      const { userData: user } = response.data;
      
      // ✅ Store ONLY user info in localStorage (not token)
      // The token is stored in HTTP-only cookie by the backend
      const userToStore = {
        id: user._id,
        role: user.role,
        firstname: user.name || user.firstname || "",
        email: user.email,
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
      
      // Update auth context
      if (setUserDetails) {
        setUserDetails(user);
      }
      
      addToast("Login successful", "success");

      const role = user.role?.toLowerCase().trim();
      
      // ✅ Role-based redirection
      // Small delay to ensure cookie is set
      setTimeout(() => {
        if (role === "admin") {
          // Admin users go to admin dashboard
          window.location.href = "/admin-dashboard";
        } else if (role === "agent" || role === "freelancer" || (role !== "admin" && role !== "user")) {
          // Agents, freelancers, and any other non-admin/non-user roles go to agent dashboard
          window.location.href = "/agent-dashboard";
        } else {
          // Regular users go to homepage
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