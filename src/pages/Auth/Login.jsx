import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { navbarlogo } from "../../ExportImages";

const Login = () => {
  const { theme } = useTheme();
  const { LoginUser } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const [currentBg, setCurrentBg] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgrounds = [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2070&q=80"
  ];

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fixed: Properly handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await LoginUser(data);
      // LoginUser handles redirect internally
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compact input style (smaller padding)
  const inputBase = `w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 outline-none font-medium text-sm ${
    isDark
      ? "bg-black/40 border-white/10 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
      : "bg-white/60 border-gray-200 text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Background */}
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Top Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/80 hover:text-amber-400 transition-colors font-bold text-[10px] tracking-widest uppercase backdrop-blur-sm px-3 py-1.5 rounded-full bg-black/20"
        >
          <ArrowLeft size={14} /> Back to Website
        </Link>
      </div>

      {/* Decorative Dubai Text */}
      <div className="hidden xl:block absolute left-12 bottom-12 z-10 pointer-events-none">
        <h1 className="text-[140px] font-black text-white/[0.03] leading-none uppercase select-none">
          Dubai<br />Estates
        </h1>
      </div>

      {/* Login Card – reduced size */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`relative z-10 w-full max-w-[440px] p-6 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
          isDark
            ? "bg-black/50 border-white/20"
            : "bg-white/30 border-white/40 backdrop-blur-md"
        }`}
      >
        {/* Logo & Title – compact */}
        <div className="text-center mb-6">
          <div className="inline-block relative mb-3">
            <div className="absolute inset-0 rounded-full bg-amber-500 blur-2xl opacity-30 animate-pulse" />
            <img
              src={navbarlogo}
              alt="Logo"
              className={`w-20 h-20 object-contain relative z-10 mx-auto ${isDark ? "brightness-200" : ""}`}
            />
          </div>
          <h2 className={`text-2xl font-black tracking-tight uppercase mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
            Login <span className="text-amber-500">Portal</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <ShieldCheck size={12} className="text-amber-500" />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
              Dubai Regulatory Standard
            </p>
          </div>
        </div>

        {/* Form – reduced spacing */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="email@homoget.com"
                className={inputBase}
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && <p className="text-amber-500 text-[9px] font-bold mt-1 uppercase">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Access Key
              </label>
              <Link to="/forget-password-request" className="text-[8px] font-black text-amber-400 hover:text-amber-300 uppercase tracking-tighter transition">
                Forgot Key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputBase}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-amber-500 text-[9px] font-bold mt-1 uppercase">{errors.password.message}</p>}
          </div>

          {/* Submit Button – compact */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 group transition-all disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Authorize Login
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer – reduced spacing */}
        <div className="mt-6 text-center">
          <p className={`text-[10px] font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Don't have a partner account?{" "}
            <Link to="/signup" className="text-amber-500 font-black uppercase hover:underline ml-1">
              Request Access
            </Link>
          </p>
        </div>

        {/* Decorative Sparkles (smaller) */}
        <div className="absolute -top-4 -right-4 opacity-30">
          <Sparkles size={32} className="text-amber-500" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;