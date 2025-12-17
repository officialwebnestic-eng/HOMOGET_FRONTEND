import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

// Import cartoon background images
import bg1 from "../assets/backgroundimage.jpg";


import { http } from "../axios/axios";
import { useToast } from "../model/SuccessToasNotification";

const VerifyEmail = () => {
  const { theme } = useTheme();
  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const { addToast } = useToast()




  const backgrounds = [bg1, 
     ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);


      const response = await http.post(`/createuser`, data);



      if (response.data?.success) {
        addToast(" registered successfully!", "success");
        navigate("/login");
      } else {
        addToast(response.data?.message || "Invalid OTP. Please try again.");
      }

    } catch (error) {
      console.error("OTP verification error:", error);
      addToast(
        error.response?.data?.message || "Failed to verify OTP. Please try again.", "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {

      setCountdown(30);
      addToast("New OTP sent to your email!", "success");
    } catch (error) {
      addToast(error.message || "Failed to resend OTP", "error");
    }
  };


  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Animated background slider */}
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
          <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Verify OTP
          </h2>
          <p className="text-white/80">Enter the 6-digit code sent to your email</p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2" htmlFor="otp">
              OTP Code
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all text-center text-2xl tracking-widest"
              id="otp"
              type="text"
              placeholder="••••••"
              maxLength="6"
              {...register("code", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Please enter a valid 6-digit OTP",
                },
              })}
            />
            {errors.otp && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-pink-300 mt-2 text-sm"
              >
                {errors.code.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            {countdown > 0 ? (
              <p className="text-white/70 text-sm">
                Resend OTP in {countdown} seconds
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-purple-300 hover:text-pink-300 font-medium text-sm hover:underline transition"
              >
                Resend OTP
              </button>
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
                : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
                }`}
              type="submit"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
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
              className="text-purple-300 hover:text-pink-300 font-medium hover:underline transition"
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

export default VerifyEmail;