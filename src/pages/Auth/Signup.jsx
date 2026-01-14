import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Landmark } from "lucide-react";

// Context & Hooks
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";

const Signup = () => {
  const { theme } = useTheme();
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const isDark = theme === "dark";

  const [currentBg, setCurrentBg] = useState(0);

  // Dubai Luxury Imagery
  const backgrounds = [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2070&q=80", 
    "https://images.unsplash.com/photo-1528981138400-c547374326a8?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=2070&q=80"
  ];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      addToast("Account created successfully!", "success");
      navigate("/verifyemail");
    } catch (error) {
      addToast(error?.message || "Registration failed", "error");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const inputStyle = `w-full pl-11 pr-4 py-3.5 rounded-xl border transition-all duration-300 outline-none font-medium ${
    isDark
      ? "bg-black/40 border-white/10 text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
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

      {/* 3. Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-[550px] p-8 sm:p-12 rounded-[2.5rem] backdrop-blur-3xl border shadow-2xl ${
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
          <h2 className={`text-3xl font-black tracking-tight uppercase mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Join the <span className="text-[#C5A059]">Elite</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <Landmark size={14} className="text-[#C5A059]" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Partner Registration Portal</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Identity Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>First Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#C5A059]" size={18} />
                <input
                  placeholder="E.g. Omar"
                  className={inputStyle}
                  {...register("firstname", { required: "Required" })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Last Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#C5A059]" size={18} />
                <input
                  placeholder="E.g. Zayed"
                  className={inputStyle}
                  {...register("lastname", { required: "Required" })}
                />
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Official Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#C5A059]" size={18} />
              <input
                type="email"
                placeholder="omar@dubaiestates.ae"
                className={inputStyle}
                {...register("email", {
                  required: "Email required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                })}
              />
            </div>
            {errors.email && <p className="text-[#C5A059] text-[10px] font-bold mt-1 uppercase">{errors.email.message}</p>}
          </div>

          {/* Security Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#C5A059]" size={18} />
                <input
                  type="password"
                  placeholder="Min 8 chars"
                  className={inputStyle}
                  {...register("password", {
                    required: "Required",
                    minLength: { value: 8, message: "Too short" },
                  })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verify Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#C5A059]" size={18} />
                <input
                  type="password"
                  placeholder="Confirm key"
                  className={inputStyle}
                  {...register("confirmPassword", {
                    validate: (value) => value === watch("password") || "Mismatch",
                  })}
                />
              </div>
            </div>
          </div>
          {(errors.password || errors.confirmPassword) && (
            <p className="text-[#C5A059] text-[10px] font-bold uppercase ml-1">
              {errors.password?.message || errors.confirmPassword?.message}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 group transition-all disabled:opacity-50 mt-4`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            {isSubmitting ? "Registering..." : "Create Account"}
            {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className={`text-xs font-medium ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            Already a registered partner?{" "}
            <Link to="/login" className="text-[#C5A059] font-black uppercase hover:underline ml-1 tracking-tighter">
              Login Here
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 mt-8 opacity-20">
            <ShieldCheck size={12} />
            <p className="text-[8px] uppercase tracking-widest font-black">Secure RSA Encrypted Registration</p>
          </div>
        </div>
      </motion.div>

      {/* Decorative Text */}
      <div className="hidden xl:block absolute right-12 bottom-12 z-10 pointer-events-none">
         <h1 className="text-[120px] font-black text-white/[0.03] leading-none uppercase select-none">
           Homo<br/>Get
         </h1>
      </div>
    </div>
  );
};

export default Signup;