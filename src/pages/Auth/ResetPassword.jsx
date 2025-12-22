import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import bg1 from "../../assets/backgroundimage.jpg";

import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";
const ResetPassword = () => {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = location.state?.email;
  const otp = location.state?.otp;

  const backgrounds = [bg1];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const params = new URLSearchParams({ email, otp }).toString();
      const response = await http.post(`/reset-password?${params}`, {
        newPassword: data.newPassword,
      });

      if (response.data?.success) {
        addToast("Password reset successfully!", "success");
        navigate("/login");
      } else {
        addToast(response.data.message || "Failed to reset password", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || error.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentBg === index ? 1 : 0,
              scale: currentBg === index ? 1 : 1.05,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className={`relative w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-3xl 
        backdrop-blur-lg border border-white/20 shadow-2xl 
        ${theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <img src={navbarlogo} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-2">
            Reset Password
          </h2>
          <p className=" text-sm sm:text-base">
            Enter your new password and back to login
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-xl  focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
              {...register("newPassword", {
                required: "Password is required",
                pattern: {
                  value: /^[A-Z][a-zA-Z@0-9]{7,15}$/,
                  message:
                    "Password must start with uppercase, include '@', a number, and be 8-16 characters",
                },
              })}
            />
            {errors.newPassword && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-cyan-300 mt-2 text-sm"
              >
                {errors.newPassword.message}
              </motion.p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full p-3 rounded-xl   focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords don't match",
              })}
            />
            {errors.confirmPassword && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-pink-300 mt-1 text-xs"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-blue-500"
                }`}
              type="submit"
            >
              {isSubmitting ? "Sending Link..." : "Reset Password"}
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm opacity-70">
          <p>
            Remember your password?{" "}
            <a
              href="/login"
              className="text-amber-300 hover:text-amber-300 font-medium hover:underline transition"
            >
              Sign In
            </a>
          </p>
          <p className="mt-4 text-xs text-white/50">
            © {new Date().getFullYear()} Cartoon Network. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;