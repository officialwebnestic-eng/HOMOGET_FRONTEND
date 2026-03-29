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

   // Inside registerUser
if (response?.data?.success) {
  // Check every possible location for the email
  const userEmail = response.data?.user?.email || 
                    response.data?.data?.email || 
                    response.data?.email ||
                    data.email; // Fallback to the email the user typed in the form

  if (!userEmail) {
    return addToast("Registration error: Could not verify email address.", "error");
  }

  setEmail(userEmail);
  addToast("Verification code sent to your email!", "success");
  navigate("/verifyemail", { state: { email: userEmail } });
}
  } catch (err) {
    // If backend returns "No token provided", it lands here
    const msg = err.response?.data?.message || "Server Error";
    addToast(msg, "error");
  }
};

 const LoginUser = async (data) => {
  try {
    const response = await http.post("/loginuser", data, {
      withCredentials: true,
    });

    if (response.status === 200 && response.data?.success) {
      const { userData: user } = response.data;
      
      // Update Context State
      setUserDetails({
        id: user._id,
        role: user.role,
        firstname: user.firstname || user.name || "",
        email: user.email,
      });

      addToast("Login successful", "success");

      // Normalize role for comparison
      const role = user.role?.toLowerCase().trim();

      setTimeout(() => {
        if (role === "admin") {
          // 1. Role is Admin
          navigate("/admin-dashboard");
        } else if (role !== "admin" && role !== "user") {
          // 2. Role is NOT admin AND NOT user (Agent/Staff/etc)
          navigate("/agent-dashboard");
        } else {
          // 3. Role is User (or anything else)
          navigate("/");
        }
      }, 100);

    } else {
      addToast(response.data?.message || "Invalid credentials", "error");
    }
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Something went wrong.";
    addToast(errorMessage, "error");
  }
};

  return {
    registerUser,
    LoginUser,
  };
};
