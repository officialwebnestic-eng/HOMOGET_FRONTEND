import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

// Context & Utils
import { useTheme } from "../../context/ThemeContext";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";

const ResetPassword = () => {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const isDark = theme === "dark";
  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Safely grab data passed from the OTP/Forgot Password stage
  const email = location.state?.email;
  const otp = location.state?.otp;

  const backgrounds = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=2070&q=80"
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!email || !otp) {
      addToast("Session expired. Please request a new OTP.", "error");
      return navigate("/forget-password-request");
    }

    try {
      setIsSubmitting(true);
      const params = new URLSearchParams({ email, otp }).toString();
      const response = await http.post(`/reset-password?${params}`, {
        newPassword: data.newPassword,
      });

      if (response.data?.success) {
        addToast("Security credentials updated!", "success");
        navigate("/login");
      } else {
        addToast(response.data.message || "Reset failed", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "Connection error. Try again.",
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
  }, [backgrounds.length]);

  // Unified Input Styles
  const inputStyle = `w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none ${
    isDark
      ? "bg-gray-800/40 border-gray-700/50 text-white focus:border-amber-500/50 focus:bg-gray-800/60"
      : "bg-white/50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden font-sans">
      {/* Background Engine */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
          />
        </AnimatePresence>
        <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? "bg-black/60" : "bg-black/30"}`} />
      </div>

      {/* Reset Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] backdrop-blur-2xl border border-white/20 shadow-2xl ${
          isDark ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            className="inline-block p-4 rounded-3xl bg-white shadow-lg mb-4"
          >
            <img src={navbarlogo} alt="Logo" className="w-14 h-14 object-contain" />
          </motion.div>
          <h2 className="text-3xl font-black bg-gradient-to-br from-amber-400 to-amber-700 text-transparent bg-clip-text">
            New Credentials
          </h2>
          <p className={`text-sm mt-2 font-medium opacity-70`}>
            Secure your account with a new password
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest ml-1 opacity-70">
              New Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                {...register("newPassword", {
                  required: "Password is required",
                  pattern: {
                    value: /^[A-Z][a-zA-Z@0-9]{7,15}$/,
                    message: "Start with Caps, 8-16 chars, include @ & numbers",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-amber-500 text-[10px] font-bold uppercase mt-1 ml-1 leading-tight">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest ml-1 opacity-70">
              Verify Password
            </label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className={inputStyle}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (val) => val === watch("newPassword") || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-rose-500 text-[10px] font-bold uppercase mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold tracking-widest uppercase text-sm shadow-xl flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="submit"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
            {isSubmitting ? "Updating..." : "Update Password"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 space-y-4">
          <Link to="/login" className="text-xs font-bold text-amber-600 hover:text-amber-500 uppercase tracking-tighter transition-all">
            Return to Sign In
          </Link>
          <p className="text-[10px] opacity-40 uppercase tracking-widest">
            © {new Date().getFullYear()} HomoGet Properties. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;