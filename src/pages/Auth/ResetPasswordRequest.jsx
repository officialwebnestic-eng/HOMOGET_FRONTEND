import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowRight, Loader2, ChevronLeft, Fingerprint, ShieldEllipsis } from "lucide-react";

// Context & Utils
import { useTheme } from "../../context/ThemeContext";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";


const ResetPasswordRequest = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgrounds = [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2070&q=80"
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await http.post("/forgot-password", { email: data.email });

      if (res.data?.success) {
        addToast("Security OTP sent to your inbox!", "success");
        navigate("/verify-otp", { state: { email: data.email } });
      } else {
        addToast(res.data?.message || "User not found", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "Failed to initiate reset",
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

  const inputStyle = `w-full pl-11 pr-4 py-4 rounded-xl border transition-all duration-300 outline-none font-medium ${
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
          <ChevronLeft size={16} /> Back to Sign In
        </Link>
      </div>

      {/* 3. Request Card */}
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
            Account <span className="text-[#C5A059]">Recovery</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <ShieldEllipsis size={14} className="text-[#C5A059]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Authentication Request</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Partner Identity (Email)
            </label>
            <div className="relative group">
              <Mail 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059] transition-colors" 
                size={18} 
              />
              <input
                type="email"
                placeholder="partner@homoget.ae"
                className={inputStyle}
                {...register("email", {
                  required: "Identity verification required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid identity format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-[#C5A059] text-[9px] font-black uppercase mt-1 ml-1 leading-tight">
                {errors.email.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 group transition-all disabled:opacity-50 mt-4`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
            {isSubmitting ? "Initiating..." : "Request Security OTP"}
            {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
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

export default ResetPasswordRequest;