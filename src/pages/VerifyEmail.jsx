import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Loader2, MailCheck, ChevronLeft, RefreshCcw, ShieldAlert } from "lucide-react";
import { navbarlogo } from "../ExportImages";
import { useTheme } from "../context/ThemeContext";
import { http } from "../axios/axios";
import { useToast } from "../model/SuccessToasNotification";

const VerifyEmail = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  // 1. Session & State Management
  const emailFromState = location.state?.email;
  const hasRedirected = useRef(false);

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const backgrounds = [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2070&q=80"
  ];

  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect if no email is found (Prevents direct URL access)
  useEffect(() => {
    if (!emailFromState && !hasRedirected.current) {
      hasRedirected.current = true;
      addToast("Session expired. Please sign up again.", "error");
      navigate("/signup");
    }
  }, [emailFromState, navigate, addToast]);

  // 2. Submit Verification Code
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await http.post(`/createuser`, {
        code: data.code,
        email: emailFromState 
      });

      if (response.data?.success) {
        addToast("Account Verified Successfully!", "success");
        setTimeout(() => navigate("/login", { replace: true }), 1500);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid or expired code.";
      addToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Resend OTP Functionality
  const handleResendOtp = async () => {
    if (countdown > 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await http.post("/resend-otp", { email: emailFromState });

      if (response.data?.success) {
        setCountdown(30);
        addToast("A new security code has been sent to your inbox.", "success");
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to resend code.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timers & Background Cycle
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
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
      {/* Cinematic Background */}
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
        <div className={`absolute inset-0 ${isDark ? "bg-black/75" : "bg-black/55"}`} />
      </div>

      {/* Navigation */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/signup" className="flex items-center gap-2 text-white/70 hover:text-[#C5A059] transition-colors font-bold text-[10px] tracking-widest uppercase">
          <ChevronLeft size={14} /> Back to Signup
        </Link>
      </div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-[460px] p-8 sm:p-12 rounded-[3rem] backdrop-blur-3xl border shadow-2xl ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white/20"
        }`}
      >
        <div className="text-center mb-10">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#C5A059] blur-3xl opacity-20 animate-pulse" />
            <img src={navbarlogo} alt="Logo" className={`w-20 h-20 object-contain relative z-10 mx-auto ${isDark ? 'brightness-150' : ''}`} />
          </div>
          <h2 className={`text-2xl font-black tracking-tight uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Security <span className="text-[#C5A059]">Verification</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40 mb-2">Verification code sent to</p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20">
            <p className="text-xs font-bold text-[#C5A059]">{emailFromState || "Waiting for session..."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-center block mb-4 opacity-60">Enter 6-Digit Code</label>
            <input
              type="text"
              maxLength="6"
              autoComplete="one-time-code"
              placeholder="· · · · · ·"
              className={`w-full py-6 rounded-2xl text-center text-4xl font-black tracking-[0.4em] border transition-all duration-300 outline-none shadow-inner ${
                isDark 
                  ? "bg-black/40 border-white/10 text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30" 
                  : "bg-gray-100 border-gray-200 text-gray-900 focus:border-[#C5A059]"
              }`}
              {...register("code", { 
                required: true, 
                pattern: { value: /^[0-9]{6}$/, message: "Must be 6 digits" } 
              })}
            />
            {errors.code && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#C5A059] text-[10px] font-black mt-3 text-center uppercase tracking-widest">
                <ShieldAlert size={12} className="inline mr-1 mb-0.5" /> {errors.code.message || "Invalid Code Format"}
              </motion.p>
            )}
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#C5A059]/20 flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <MailCheck size={18} />}
              {isSubmitting ? "Authenticating..." : "Confirm & Activate"}
            </motion.button>

            <div className="text-center pt-2">
              {countdown > 0 ? (
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30">
                  <RefreshCcw size={12} className="animate-spin-slow" />
                  <span>Resend available in {countdown}s</span>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest hover:text-[#8E7037] hover:underline transition-all disabled:opacity-30"
                >
                  {isSubmitting ? "Sending..." : "Resend Security Code"}
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-widest font-bold opacity-30">
            Secure Encrypted Session • 256-bit AES
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;