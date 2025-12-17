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

      if (response.status === 200 && response.data?.success === true) {
        const { userData: user } = response.data;

        // Save user details
        setUserDetails({
          id: user._id,
          role: user.role,
          firstname: user.name || "",
          email: user.email,
        });

        addToast("Login successful", "success");

        // Trim role to avoid extra spaces
        const role = user.role.trim().toLowerCase();

        // Role-based navigation
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "user") {
          navigate("/"); // or your user-specific route
        } else {
          // For any other roles, go to agent-dashboard or default
          navigate("/agent-dashboard");
        }
      } else {
        addToast(response.data?.message || "Invalid credentials", "error");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", err);
    }
  };





  return {
    registerUser,
    LoginUser,
  };
};
