import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { navbarlogo } from "../../ExportImages";

import bg1 from "../../assets/backgroundimage.jpg";
import bg2 from "../../assets/backgroundimage.jpg";
import bg3 from "../../assets/backgroundimage.jpg";

const Login = () => {
  const { theme } = useTheme();
  const { LoginUser } = useAuth();

  const [currentBg, setCurrentBg] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const backgrounds = [bg1, bg2, bg3];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onHandleSubmitLoginData = (data) => {
    LoginUser(data);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            animate={{
              opacity: currentBg === index ? 1 : 0,
              scale: currentBg === index ? 1 : 1.05,
            }}
            transition={{ duration: 1.5 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-3xl
        backdrop-blur-lg border border-white/20 shadow-2xl
        ${theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <img src={navbarlogo} alt="Logo" className="w-20 h-20 mx-auto mb-4" /> {/* Increased size */}
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 text-transparent bg-clip-text">
            Welcome to HomoGet Properties
          </h2>
          <p className="text-sm sm:text-base opacity-80 mt-2">
            Access your property dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onHandleSubmitLoginData)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="text"
              className="w-full mt-1 p-3 rounded-xl border focus:ring-2 focus:ring-amber-500"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 pr-12 rounded-xl border focus:ring-2 focus:ring-amber-500"
                {...register("password", {
                  required: "Password is required",
                  minLength: 8,
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between text-sm">
            <a href="/forget-password-request" className="text-amber-500 hover:underline">
              Forgot password?
            </a>
            <a href="/signup" className="text-amber-500 hover:underline">
              Create account
            </a>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 text-white font-semibold"
          >
            Sign In
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;