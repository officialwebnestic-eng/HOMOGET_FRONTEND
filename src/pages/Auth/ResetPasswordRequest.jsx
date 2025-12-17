import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import bg1 from "../../assets/backgroundimage.jpg";


import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { useToast } from "../../model/SuccessToasNotification";

const ResetPasswordRequest = () => {
  const { theme } = useTheme();

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  const { addToast } = useToast()

  const backgrounds = [bg1];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await http.post('/forgot-password', {
        email: data.email
      });

      if (response.data?.success) {
        addToast("Password reset link sent to your email!", "success");
        navigate("/verify-otp", { state: { email: data.email } });

      } else {
        addToast(response.data?.message || "Something went wrong", "error");
      }

    } catch (error) {
      console.error("Forgot Password Error:", error);
      addToast(
        error.response?.data?.message || "Failed to send reset link", "error"
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
          <h2 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Reset Password
          </h2>
          <p className="text-white/80">We'll send you a link to reset your password</p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-pink-300 mt-2 text-sm"
              >
                {errors.email.message}
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
                  : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
                }`}
              type="submit"
            >
              {isSubmitting ? "Sending Link..." : "Send Reset Link"}
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

export default ResetPasswordRequest;