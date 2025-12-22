import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "../../model/SuccessToasNotification";
import { useLocation, useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";

import bg1 from "../../assets/backgroundimage.jpg";
 import {navbarlogo} from "../../ExportImages";

const VerifyOtp = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const email = location.state?.email;

  const [currentBg, setCurrentBg] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const backgrounds = [bg1];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const res = await http.post(
        `/verifytoken?email=${encodeURIComponent(email)}`,
        { otp: data.otp }
      );

      if (res.data?.success) {
        addToast("OTP verified successfully!", "success");
        navigate("/forget-password", {
          state: { email, otp: data.otp },
        });
      } else {
        addToast(res.data?.message || "Invalid OTP", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "OTP verification failed",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCountdown(30);
      addToast("New OTP sent to your email!", "success");
    } catch {
      addToast("Failed to resend OTP", "error");
    }
  };

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
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
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgrounds.map((bg, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
            animate={{
              opacity: currentBg === i ? 1 : 0,
              scale: currentBg === i ? 1 : 1.05,
            }}
            transition={{ duration: 1.5 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`relative z-10 w-full max-w-md p-6 sm:p-8 rounded-3xl
        backdrop-blur-lg border border-white/20 shadow-2xl
        ${theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
      >

        {/* Header */}
        <div className="text-center mb-8">
          <img src={navbarlogo} alt="Logo" className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-transparent bg-clip-text">
            Verify OTP
          </h2>
          <p className="text-sm opacity-80 mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              type="text"
              maxLength="6"
              placeholder="••••••"
              className="w-full p-4 rounded-xl text-center text-2xl tracking-widest border focus:ring-2 focus:ring-purple-500 focus:outline-none"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "Enter a valid 6-digit OTP",
                },
              })}
            />
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Resend */}
          <div className="text-center text-sm">
            {countdown > 0 ? (
              <p className="opacity-70">
                Resend OTP in {countdown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-black hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-amber-500 to-amber-600
            hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 opacity-80">
          Back to{" "}
          <a href="/login" className="text-amber-400 hover:underline">
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;
