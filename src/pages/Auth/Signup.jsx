import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus, Loader2, ArrowRight } from "lucide-react";

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

  const backgrounds = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=2070&q=80"
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

  // Shared Input Styles (Amber Focus)
  const inputStyle = `w-full pl-11 pr-4 py-3 rounded-2xl border-2 transition-all duration-300 outline-none ${
    isDark
      ? "bg-gray-800/40 border-gray-700/50 text-white focus:border-amber-500/50 focus:bg-gray-800/60"
      : "bg-white/50 border-gray-200 text-gray-900 focus:border-amber-500 focus:bg-white"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden font-sans">
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

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative z-10 w-full max-w-xl p-8 sm:p-10 rounded-[2.5rem] backdrop-blur-2xl border border-white/20 shadow-2xl ${
          isDark ? "bg-gray-900/80" : "bg-white/90"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ y: -10 }} animate={{ y: 0 }} className="inline-block p-3 rounded-3xl bg-white shadow-xl mb-4">
            <img src={navbarlogo} alt="Logo" className="w-14 h-14 object-contain" />
          </motion.div>
          <h2 className="text-3xl font-black bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 text-transparent bg-clip-text">
            Start Your Journey
          </h2>
          <p className={`text-sm mt-2 font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Create a partner account with HomoGet Properties
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500" size={18} />
              <input
                placeholder="First Name"
                className={inputStyle}
                {...register("firstname", { required: "Required" })}
              />
            </div>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500" size={18} />
              <input
                placeholder="Last Name"
                className={inputStyle}
                {...register("lastname", { required: "Required" })}
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500" size={18} />
            <input
              type="email"
              placeholder="Email address"
              className={inputStyle}
              {...register("email", {
                required: "Email required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              })}
            />
            {errors.email && <p className="text-amber-500 text-[10px] font-bold uppercase ml-2 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500" size={18} />
              <input
                type="password"
                placeholder="Password"
                className={inputStyle}
                {...register("password", {
                  required: "Required",
                  minLength: { value: 8, message: "Min 8 chars" },
                })}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500" size={18} />
              <input
                type="password"
                placeholder="Confirm"
                className={inputStyle}
                {...register("confirmPassword", {
                  validate: (value) => value === watch("password") || "No match",
                })}
              />
            </div>
          </div>
          {(errors.password || errors.confirmPassword) && (
            <p className="text-amber-500 text-[10px] font-bold uppercase ml-2">
              {errors.password?.message || errors.confirmPassword?.message}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold tracking-widest uppercase text-sm shadow-xl flex items-center justify-center gap-2 group transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
            {isSubmitting ? "Registering..." : "Create Account"}
            {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Already a partner?{" "}
            <Link to="/login" className="text-amber-500 hover:text-amber-400 font-bold underline-offset-4 hover:underline transition-all">
              Sign In
            </Link>
          </p>
          <p className="text-[10px] mt-6 opacity-30 uppercase tracking-widest">
            © {new Date().getFullYear()} HomoGet Properties
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;