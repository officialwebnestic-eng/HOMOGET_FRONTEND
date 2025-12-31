import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

// Context & Hooks
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { navbarlogo } from "../../ExportImages";

const Login = () => {
  const { theme } = useTheme();
  const { LoginUser } = useAuth();
  const isDark = theme === "dark";

  const [currentBg, setCurrentBg] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const backgrounds = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=2070&q=80"
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onHandleSubmitLoginData = (data) => {
    LoginUser(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Combined Template Literal (Corrected the closing bracket issue)
  const inputBase = `w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 transition-all duration-300 outline-none ${
    isDark
      ? "bg-gray-800/40 border-gray-700/50 text-white focus:border-amber-500/50 focus:bg-gray-800/60"
      : "bg-white/50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden font-sans">
      {/* Dynamic Background Engine */}
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
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isDark ? "bg-black/60" : "bg-black/40"
          }`}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 w-full max-w-md p-8 sm:p-10 rounded-[2.5rem] backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${
          isDark ? "bg-gray-900/80" : "bg-white/90"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block p-4 rounded-3xl bg-white shadow-xl mb-4"
          >
            <img
              src={navbarlogo}
              alt="HomoGet Logo"
              className="w-16 h-16 object-contain"
            />
          </motion.div>
          <h2 className="text-3xl font-black bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 text-transparent bg-clip-text">
            HomoGet Properties
          </h2>
          <p
            className={`text-sm mt-2 font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Secure Partner Portal Login
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onHandleSubmitLoginData)}
          className="space-y-6"
        >
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-bold uppercase tracking-widest ml-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Email Identity
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors"
                size={18}
              />
              <input
                type="email"
                placeholder="agent@homoget.com"
                className={inputBase}
                {...register("email", {
                  required: "Email is mandatory",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              className={`text-xs font-bold uppercase tracking-widest ml-1 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Security Key
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputBase}
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex justify-between items-center px-1">
            <a
              href="/forget-password-request"
              className="text-xs font-bold text-amber-600 hover:text-amber-500 transition-colors"
            >
              RESET KEY?
            </a>
            <div className="h-1 w-1 bg-gray-400 rounded-full" />
            <a
              href="/signup"
              className="text-xs font-bold text-amber-600 hover:text-amber-500 transition-colors"
            >
              JOIN PLATFORM
            </a>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 20px -10px rgba(245, 158, 11, 0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold tracking-widest uppercase text-sm shadow-lg flex items-center justify-center gap-2 group transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Verifying..." : "Authorize Access"}
            {!isSubmitting && (
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;