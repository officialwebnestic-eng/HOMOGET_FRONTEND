import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";

import bg1 from "../../assets/backgroundimage.jpg";
import { navbarlogo } from "../../ExportImages";

const ResetPasswordRequest = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgrounds = [bg1];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await http.post("/forgot-password", {
        email: data.email,
      });

      if (res.data?.success) {
        addToast("Password reset link sent to your email!", "success");
        navigate("/verify-otp", { state: { email: data.email } });
      } else {
        addToast(res.data?.message || "Something went wrong", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to send reset link",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            animate={{
              opacity: currentBg === index ? 1 : 0,
              scale: currentBg === index ? 1 : 1.05,
            }}
            transition={{ duration: 1.5 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`relative z-10 w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-3xl
        backdrop-blur-lg border border-white/20 shadow-2xl
        ${theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
      >
        {/* Header */}
        <div className="text-center mb-8">
           <img src={navbarlogo} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-transparent bg-clip-text">
            Reset Password
          </h2>
          <p className="text-sm sm:text-base opacity-80 mt-2">
            We’ll send a reset otp to your email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:outline-none"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-amber-500 to-amber-600
            hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Sending Link..." : "Send Reset Link"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 opacity-80">
          Remember your password?{" "}
          <a href="/login" className="text-amber-400 hover:underline">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordRequest;
