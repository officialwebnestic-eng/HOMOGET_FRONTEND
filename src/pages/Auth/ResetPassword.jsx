import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, Save, CheckCircle2 } from "lucide-react";

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

  // State from previous OTP step
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Watch password for matching validation
  const password = watch("password");

  useEffect(() => {
    if (!email || !otp) {
      addToast("Session expired. Please restart process.", "error");
      navigate("/login");
    }
  }, [email, otp, navigate, addToast]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await http.post("/resetpassword", {
        email,
        otp,
        newPassword: data.password
      });

      if (res.data?.success) {
        addToast("Access Key updated successfully", "success");
        navigate("/login");
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to update password", "error");
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

  const inputBase = `w-full pl-11 pr-12 py-4 rounded-xl border transition-all duration-300 outline-none font-medium ${
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

      {/* 2. Reset Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-[440px] p-8 sm:p-12 rounded-[2.5rem] backdrop-blur-3xl border shadow-2xl ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white/20"
        }`}
      >
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 transition-colors">Create a secure new password</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              New Access Key
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                className={inputBase}
                {...register("password", { 
                    required: "Access Key is required",
                    minLength: { value: 8, message: "Must be at least 8 characters" }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-[#C5A059] text-[10px] font-bold mt-1 uppercase">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Verify Key
            </label>
            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter Access Key"
                className={inputBase}
                {...register("confirmPassword", { 
                    required: "Please confirm your key",
                    validate: (value) => value === password || "Keys do not match"
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C5A059] transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[#C5A059] text-[10px] font-bold mt-1 uppercase">{errors.confirmPassword.message}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-6`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSubmitting ? "Updating..." : "Confirm New Access"}
          </motion.button>
        </form>

        <div className="mt-10 text-center border-t border-white/10 pt-6">
          <Link to="/login" className="text-[10px] font-black text-gray-500 hover:text-[#C5A059] uppercase tracking-widest transition-colors">
            Cancel and Return to Login
          </Link>
        </div>
      </motion.div>

      {/* Decorative Background Text */}
      <div className="hidden xl:block absolute left-12 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
         <h1 className="text-[120px] font-black text-white/[0.03] leading-none uppercase select-none rotate-90 origin-left">
           Secure<br/>Asset
         </h1>
      </div>
    </div>
  );
};

export default ResetPassword;