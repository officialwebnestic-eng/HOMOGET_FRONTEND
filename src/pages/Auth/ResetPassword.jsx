import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import bg1 from "../../assets/backgroundimage.jpg";


import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";

const ResetPassword = () => {
  const { theme } = useTheme();

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation()
   const {addToast}=useToast()

  const email = location.state?.email;
  const otp = location.state?.otp;


  const backgrounds = [bg1]
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();



  const onSubmit = async (data) => {
     console.log(data)
    try {
      setIsSubmitting(true);
      const params = new URLSearchParams({ email, otp }).toString();
      const response = await http.post(`/reset-password?${params}`, {
        newPassword: data.newPassword,
      });
      console.log(response)

      if (response.data?.success) {
      addToast("Password reset successfully!","success");
        navigate("/login");
      } else {
      addToast(response.data.message || "Failed to reset password","error");
      }

    } catch (error) {
    addToast(
        error.response?.data?.message || error.message || "Something went wrong","error"
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
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${bg})`,
              zIndex: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: currentBg === index ? 1 : 0,
              scale: currentBg === index ? 1 : 1.05,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className={`relative w-full max-w-md rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-white/15 border-2 border-white/40 ${theme === "dark" ? "bg-gray-900/40" : "bg-white/20"
          }`}
      >

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 15
          }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Reset Password
          </h2>
          <p className="text-white/80">Enter your New Password  And Back to Login</p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all"
              id="password"
              type="password"
              placeholder="Abichal@123"
              {...register("newPassword", {
                required: "password  is required",
                pattern: {
                  value: /^[A-Z][a-zA-Z@0-9]{7,15}$/,
                  message:
                    "newPassword must start with an uppercase letter, contain '@', a number, and be 8-16 characters long",
                },
              })}
            />
            {errors.newPassword && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-cyan-300 mt-2 text-sm"
              >
                {errors.newPassword.message}
              </motion.p>
            )}
          </motion.div>



          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords don't match",
              })}
            />
            {errors.confirmPassword && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-pink-300 mt-1 text-xs"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}

              className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                }`}
              type="submit"
            >
              {isSubmitting ? "Sending Link..." : "Reset Password"}
            </motion.button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 text-sm"
        >
          <p className="text-white/70">
            Remember your password?{' '}
            <a
              href="/login"
              className="text-cyan-300 hover:text-blue-300 font-medium hover:underline transition"
            >
              Sign In
            </a>
          </p>
          <p className="text-xs mt-4 text-white/50">
            © {new Date().getFullYear()} Cartoon Network. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;