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
      setUserDetails({
        id: user._id,
        role: user.role,
        firstname: user.firstname || user.name || "", // Check both possible name fields
        email: user.email,
      });

      addToast("Login successful", "success");

      const role = user.role?.trim().toLowerCase();
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
