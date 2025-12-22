import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../model/SuccessToasNotification";
import { navbarlogo } from "../../ExportImages";
import bg1 from "../../assets/backgroundimage.jpg";

const Signup = () => {
  const { theme } = useTheme();
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [currentBg, setCurrentBg] = useState(0);

  const backgrounds = [bg1, bg1, bg1];

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

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className={`relative z-10 w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-3xl
        backdrop-blur-lg border border-white/20 shadow-2xl
        ${theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-900"}`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          {/* Logo, size 20 */}
          <img src={navbarlogo} alt="Logo" className="w-20 h-20 mx-auto mb-4" />

          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
            Create Your Account
          </h2>
          <p className="text-sm sm:text-base opacity-80 mt-2">
            Join us and start your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="First Name"
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500"
              {...register("firstname", { required: "First name required" })}
            />
            <input
              placeholder="Last Name"
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500"
              {...register("lastname", { required: "Last name required" })}
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500"
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500"
              {...register("password", {
                required: "Password required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-purple-500"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-700 hover:from-purple-600 hover:to-pink-700 transition-all"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 opacity-80">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;