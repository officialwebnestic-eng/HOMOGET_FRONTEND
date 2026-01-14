import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowRight, ChevronLeft, RefreshCcw, MailCheck } from "lucide-react";

// Context & Utils
import { useTheme } from "../../context/ThemeContext";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";

const VerifyOtp = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  const email = location.state?.email;

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);

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

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const res = await http.post(
        `/verifytoken?email=${encodeURIComponent(email)}`,
        { otp: data.otp }
      );

      if (res.data?.success) {
        addToast("OTP verified successfully!", "success");
        navigate("/forget-password", { state: { email, otp: data.otp } });
      } else {
        addToast(res.data?.message || "Invalid OTP", "error");
      }
    } catch (error) {
      addToast(error.response?.data?.message || "OTP verification failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCountdown(30);
      addToast("New security code dispatched.", "success");
    } catch {
      addToast("Failed to resend code", "error");
    }
  };

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

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
        <Link to="/forget-password-request" className="flex items-center gap-2 text-white/70 hover:text-[#C5A059] transition-colors font-bold text-xs tracking-widest uppercase">
          <ChevronLeft size={16} /> Edit Email
        </Link>
      </div>

      {/* 3. Verification Card */}
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
            Secure <span className="text-[#C5A059]">Verification</span>
          </h2>
          <div className="flex flex-col items-center gap-1 opacity-60">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Verification code sent to</p>
            <p className={`text-xs font-bold ${isDark ? "text-white" : "text-black"}`}>{email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="relative">
            <input
              type="text"
              maxLength="6"
              placeholder="0 0 0 0 0 0"
              className={`w-full py-5 rounded-xl text-center text-3xl font-black tracking-[0.5em] border transition-all duration-300 outline-none ${
                isDark
                  ? "bg-black/40 border-white/10 text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 placeholder-white/10"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 placeholder-gray-200"
              }`}
              {...register("otp", {
                required: "Required",
                pattern: { value: /^[0-9]{6}$/, message: "Invalid Code" },
              })}
            />
            {errors.otp && (
              <p className="text-[#C5A059] text-center text-[10px] font-black mt-2 uppercase">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Action and Resend Logic */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <MailCheck size={18} />}
              {isSubmitting ? "Verifying..." : "Validate Access"}
            </motion.button>

            <div className="text-center">
              {countdown > 0 ? (
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                  <RefreshCcw size={12} className="animate-spin-slow" />
                  <span>Resend available in {countdown}s</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[10px] font-black text-[#C5A059] hover:underline uppercase tracking-widest"
                >
                  Dispatch New Code
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-12 text-center border-t border-white/10 pt-6">
          <p className="text-[9px] opacity-30 uppercase tracking-[0.3em] font-black">
            © {new Date().getFullYear()} HomoGet Properties
          </p>
        </div>
      </motion.div>

      {/* Decorative Background Text */}
      <div className="hidden xl:block absolute right-12 bottom-12 z-10 pointer-events-none">
         <h1 className="text-[120px] font-black text-white/[0.03] leading-none uppercase select-none">
           Verify<br/>Access
         </h1>
      </div>
    </div>
  );
};

export default VerifyOtp;