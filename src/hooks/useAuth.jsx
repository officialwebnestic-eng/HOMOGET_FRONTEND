import { http } from "../axios/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useState } from "react";
import { useToast } from "../model/SuccessToasNotification";

export const useAuth = () => {
  const { setUserDetails } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState([])
  const { addToast } = useToast()



  const registerUser = async (data) => {
    try {
      const response = await http.post("/verify-email", data);
      
      console.log(response.data.data.email)
      if (response.data?.success) {

        console.log(response.data.data.email)
        setEmail(response.data.data.email)
        addToast("Verification Code Sent Successsfully", "success");
        navigate("/verifyemail");
      } else {
        toast.error(response.data?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
      console.error("Error registering user:", err);
    }
  };

  const LoginUser = async (data) => {
  try {
    const response = await http.post("/loginuser", data, {
      withCredentials: true,
    });

    if (response.status === 200 && response.data?.success) {
      const { userData: user } = response.data;

      // 1. Update Global Auth State
      // Ensure we map the database fields (like _id) to your context fields
      setUserDetails({
        id: user._id,
        role: user.role,
        firstname: user.firstname || user.name || "", // Check both possible name fields
        email: user.email,
      });

      addToast("Login successful", "success");

      // 2. Prepare for Navigation
      const role = user.role?.trim().toLowerCase();

      // Use a small timeout or wait for state to propagate if using Protected Routes
      // This ensures the AuthContext is fully updated before the new route mounts
      setTimeout(() => {
        switch (role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "user":
            navigate("/");
            break;
          case "agent":
            navigate("/agent-dashboard");
            break;
          default:
            navigate("/"); // Safe fallback
            break;
        }
      }, 100); 

    } else {
      addToast(response.data?.message || "Invalid credentials", "error");
    }
  } catch (err) {
    // Standardize error message extraction
    const errorMessage = err.response?.data?.message || "Something went wrong. Please try again.";
    addToast(errorMessage, "error");
    console.error("Login process error:", err);
  }
};




  return {
    registerUser,
    LoginUser,
  };
};
