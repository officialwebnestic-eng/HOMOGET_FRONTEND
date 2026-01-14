import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

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
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2070&q=80"
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

      {/* 2. Top Navigation */}
      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-[#C5A059] transition-colors font-bold text-xs tracking-widest uppercase">
          <ArrowLeft size={16} /> Back to Website
        </Link>
      </div>

      {/* 3. The Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-[440px] p-8 sm:p-12 rounded-[2rem] backdrop-blur-3xl border shadow-2xl ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/90 border-white/20"
        }`}
      >
        <div className="text-center mb-10">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 rounded-full bg-[#C5A059] blur-2xl opacity-20 animate-pulse" />
            <img
              src={navbarlogo}
              alt="Logo"
              className={`w-20 h-20 object-contain relative z-10 ${isDark ? 'brightness-200' : ''}`}
            />
          </div>
          <h2 className={`text-2xl font-black tracking-tight uppercase mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Partner <span className="text-[#C5A059]">Portal</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <ShieldCheck size={14} className="text-[#C5A059]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">Dubai Regulatory Standard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onHandleSubmitLoginData)} className="space-y-5">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Registered Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="email@homoget.com"
                className={inputBase}
                {...register("email", { required: "Email is mandatory" })}
              />
            </div>
            {errors.email && <p className="text-[#C5A059] text-[10px] font-bold mt-1 uppercase">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Access Key
              </label>
              <Link to="/forget-password-request" className="text-[9px] font-black text-[#C5A059] hover:underline uppercase tracking-tighter">
                Forgot Key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={inputBase}
                {...register("password", { required: "Required" })}
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

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 group transition-all disabled:opacity-50 mt-4`}
          >
            {isSubmitting ? "Authenticating..." : "Authorize Login"}
            {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className={`text-[11px] font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Don't have a partner account?{" "}
            <Link to="/signup" className="text-[#C5A059] font-black uppercase hover:underline ml-1">
              Request Access
            </Link>
          </p>
        </div>
      </motion.div>

      {/* 4. Decorative Dubai Text */}
      <div className="hidden xl:block absolute right-12 bottom-12 z-10 pointer-events-none">
         <h1 className="text-[120px] font-black text-white/[0.03] leading-none uppercase select-none">
           Dubai<br/>Estate
         </h1>
      </div>
    </div>
  );
};

export default Login;