import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowRight, Loader2, ChevronLeft } from "lucide-react";

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
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=2070&q=80"
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
        // Passing email in state so verify-otp knows where to send the request
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
        <div className={`absolute inset-0 transition-colors duration-1000 ${isDark ? 'bg-black/60' : 'bg-black/40'}`} />
      </div>

      {/* Request Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2.5rem]
        backdrop-blur-2xl border border-white/20 shadow-2xl
        ${isDark ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
      >
        {/* Back to Login */}
        <Link 
          to="/login" 
          className="absolute left-8 top-8 flex items-center gap-1 text-xs font-bold uppercase tracking-tighter text-amber-500 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft size={14} /> Back
        </Link>

        {/* Header */}
        <div className="text-center mb-8 mt-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-block p-4 rounded-3xl bg-white shadow-xl mb-4"
          >
            <img src={navbarlogo} alt="HomoGet Logo" className="w-14 h-14 object-contain" />
          </motion.div>
          <h2 className="text-3xl font-black bg-gradient-to-br from-amber-400 to-amber-700 text-transparent bg-clip-text">
            Forgot Password?
          </h2>
          <p className={`text-sm mt-2 font-medium opacity-70`}>
            Enter your email to receive a secure OTP.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Registered Email
            </label>
            <div className="relative group">
              <Mail 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" 
                size={18} 
              />
              <input
                type="email"
                placeholder="identity@homoget.com"
                className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none
                  ${isDark 
                    ? "bg-gray-800/40 border-gray-700/50 text-white focus:border-amber-500/50 focus:bg-gray-800/60" 
                    : "bg-white/50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-amber-500 text-[10px] font-bold uppercase ml-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(245, 158, 11, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold tracking-widest uppercase text-sm shadow-lg flex items-center justify-center gap-2 group transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
            {isSubmitting ? "Verifying..." : "Send Reset Link"}
            {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </form>

        <p className="text-center text-[10px] mt-8 opacity-40 uppercase tracking-widest">
          © {new Date().getFullYear()} HomoGet Properties
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordRequest;