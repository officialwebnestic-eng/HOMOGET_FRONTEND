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
      const userData = {
        name: `${data.firstname} ${data.lastname}`,
        email: data.email,
        password: data.password
      };

      const response = await registerUser(userData);
      
      if (response?.success) {
        addToast("Verification code sent to your email", "success");
        navigate("/verify-email", { 
          state: { email: data.email },
          replace: true 
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Registration Failed";
      addToast(errorMsg, "error");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  // Slightly more compact input style (smaller padding)
  const inputStyle = `w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 outline-none font-medium text-sm ${
    isDark
      ? "bg-black/40 border-white/10 text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20"
  }`;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-8 overflow-x-hidden">
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

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-[#C5A059] transition-colors font-black text-[10px] tracking-widest uppercase">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      {/* Smaller card – max-w-[480px], reduced padding */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full max-w-[480px] p-6 rounded-2xl backdrop-blur-2xl border shadow-2xl ${
          isDark ? "bg-black/50 border-white/10" : "bg-white/95 border-white/20"
        }`}
      >
        {/* Logo area – smaller height */}
        <div className="text-center mb-5">
          <div className="inline-block relative mb-3">
            <div className="absolute inset-0 rounded-full bg-[#C5A059] blur-2xl opacity-20 animate-pulse" />
            <img
              src={navbarlogo}
              alt="Logo"
              className={`w-20 h-20 md:w-24 md:h-24 object-contain relative z-10 mx-auto ${isDark ? 'brightness-125' : ''}`}
            />
          </div>
          <h2 className={`text-xl md:text-2xl font-black tracking-tight uppercase mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Join <span className="text-[#C5A059]">HOMOGET</span>
          </h2>
          <div className="flex items-center justify-center gap-2 opacity-60">
            <Landmark size={12} className="text-[#C5A059]" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em]">Partner Registration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Name row – slightly smaller gap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-60">First Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059]" size={15} />
                <input
                  placeholder="Rahul"
                  className={inputStyle}
                  {...register("firstname", { required: "First name is required" })}
                />
              </div>
              {errors.firstname && <p className="text-[#C5A059] text-[8px] font-bold uppercase mt-1">{errors.firstname.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-60">Last Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059]" size={15} />
                <input
                  placeholder="Sharma"
                  className={inputStyle}
                  {...register("lastname", { required: "Last name is required" })}
                />
              </div>
              {errors.lastname && <p className="text-[#C5A059] text-[8px] font-bold uppercase mt-1">{errors.lastname.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-60">Official Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059]" size={15} />
              <input
                type="email"
                placeholder="rahul@example.com"
                className={inputStyle}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                })}
              />
            </div>
            {errors.email && <p className="text-[#C5A059] text-[8px] font-bold mt-1 uppercase">{errors.email.message}</p>}
          </div>

          {/* Password row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-60">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059]" size={15} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputStyle}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-60">Verify Key</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C5A059]" size={15} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={inputStyle}
                  {...register("confirmPassword", {
                    validate: (value) => value === watch("password") || "Passwords mismatch",
                  })}
                />
              </div>
            </div>
          </div>
          {(errors.password || errors.confirmPassword) && (
            <p className="text-[#C5A059] text-[9px] font-black uppercase ml-1">
              {errors.password?.message || errors.confirmPassword?.message}
            </p>
          )}

          {/* Submit button – smaller padding */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8E7037] text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 group transition-all disabled:opacity-50 mt-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={15} /> : <UserPlus size={15} />}
            {isSubmitting ? "Generating Security Token..." : "Create Partner Account"}
            {!isSubmitting && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
          </motion.button>
        </form>

        {/* Footer – reduced spacing */}
        <div className="text-center mt-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Already registered?{" "}
            <Link to="/login" className="text-[#C5A059] font-black hover:underline ml-1">
              Login
            </Link>
          </p>
          <div className="flex items-center justify-center gap-2 mt-5 opacity-20">
            <ShieldCheck size={10} />
            <p className="text-[7px] uppercase tracking-[0.3em] font-black">RSA Secure Encryption</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;