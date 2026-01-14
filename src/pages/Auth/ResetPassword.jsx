import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, ArrowLeft, KeyRound } from "lucide-react";

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
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2070&q=80"
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

  const inputStyle = `w-full pl-11 pr-12 py-4 rounded-xl border transition-all duration-300 outline-none font-medium ${
    isDark
      ? "bg-black/40 border-white/10 text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* 1. Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
          />
        </AnimatePresence>
        <div className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/50"}`} />
      </div>

      {/* 2. Top Navigation */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/login" className="flex items-center gap-2 text-white/70 hover:text-[#C5A059] transition-colors font-bold text-xs tracking-widest uppercase">
          <ArrowLeft size={16} /> Cancel Reset
        </Link>
      </div>

      {/* 3. Reset Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-[440px] p-8 sm:p-12 rounded-[2.5rem] backdrop-blur-3xl border shadow-2xl ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white/20"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#C5A059] blur-2xl opacity-20 animate-pulse" />
            <img
              src={navbarlogo}
              alt="Logo"
              className={`w-16 h-16 object-contain relative z-10 ${isDark ? 'brightness-200' : ''}`}
            />
          </div>
          <h2 className={`text-2xl font-black tracking-tight uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Update <span className="text-[#C5A059]">Security</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <KeyRound size={14} className="text-[#C5A059]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Reset Partner Credentials</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* New Password */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              New Security Key
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                {...register("newPassword", {
                  required: "Password is required",
                  pattern: {
                    value: /^[A-Z][a-zA-Z@0-9]{7,15}$/,
                    message: "Caps, 8-16 chars, include @ & numbers",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-[#C5A059] text-[9px] font-black uppercase mt-1 ml-1 leading-tight">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Verify New Key
            </label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className={inputStyle}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (val) => val === watch("newPassword") || "Keys do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-[9px] font-black uppercase mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4`}
            type="submit"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
            {isSubmitting ? "Updating..." : "Authorize Update"}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-[10px] opacity-30 uppercase tracking-[0.3em] font-black">
            © {new Date().getFullYear()} HomoGet Properties
          </p>
        </div>
      </motion.div>

      {/* Decorative Text */}
      <div className="hidden xl:block absolute right-12 bottom-12 z-10 pointer-events-none">
         <h1 className="text-[120px] font-black text-white/[0.03] leading-none uppercase select-none">
           Dubai<br/>Security
         </h1>
      </div>
    </div>
  );
};

export default ResetPassword;