import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, ChevronLeft, Fingerprint, ShieldEllipsis, CheckCircle2 } from "lucide-react";

// Context & Utils
import { useTheme } from "../../context/ThemeContext";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";

const ResetPassword = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  // Get data from Verify OTP step
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const password = watch("password");

  // Redirect if accessed without OTP verification
  useEffect(() => {
    if (!email || !otp) {
      addToast("Session expired. Please restart process.", "error");
      navigate("/forgot-password");
    }
  }, [email, otp, navigate, addToast]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Backend expects: email, otp, newPassword in the body
      const res = await http.post("/reset-password", { 
        email, 
        otp, 
        newPassword: data.password 
      });

      if (res.data?.success) {
        addToast("Access Key updated successfully!", "success");
        navigate("/login");
      } else {
        addToast(res.data?.message || "Failed to reset", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "Internal server error",
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
        <Link 
          to="/login" 
          className="flex items-center gap-2 text-white/70 hover:text-[#C5A059] transition-colors font-bold text-xs tracking-widest uppercase"
        >
          <ChevronLeft size={16} /> Cancel Reset
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
            Update <span className="text-[#C5A059]">Access Key</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <ShieldEllipsis size={14} className="text-[#C5A059]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Credential Update</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* New Password */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              New Password
            </label>
            <div className="relative group">
              <Lock 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" 
                size={18} 
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                {...register("password", {
                  required: "New password is required",
                  minLength: { value: 8, message: "Minimum 8 characters required" }
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
            {errors.password && (
              <p className="text-[#C5A059] text-[9px] font-black uppercase mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Verify New Password
            </label>
            <div className="relative group">
              <CheckCircle2 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" 
                size={18} 
              />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className={inputStyle}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match"
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059]"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#C5A059] text-[9px] font-black uppercase mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 group transition-all disabled:opacity-50 mt-4`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <ShieldEllipsis size={18} />}
            {isSubmitting ? "Updating..." : "Update Access Key"}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <Fingerprint size={12} />
            <p className="text-[8px] font-black uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} HomoGet Properties
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative Dubai Text */}
      <div className="hidden xl:block absolute right-12 bottom-12 z-10 pointer-events-none">
         <h1 className="text-[120px] font-black text-white/[0.03] leading-none uppercase select-none">
           Dubai<br/>Portal
         </h1>
      </div>
    </div>
  );
};

export default ResetPassword;