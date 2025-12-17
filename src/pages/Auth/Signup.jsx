import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext"; 
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import bg1 from "../../assets/backgroundimage.jpg";

import { useToast } from "../../model/SuccessToasNotification";
const Signup = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [currentBg, setCurrentBg] = useState(0);
   const {addToast}=useToast()

  const backgrounds = [bg1, bg1,bg1];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      addToast("Account created successfully!","success");
      navigate("/verifyemail");
    } catch (error) {
      addToast(error.message || "Registration failed","error");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center  justify-center min-h-screen p-4 overflow-hidden">
    
      <div className="absolute top-0 left-0 w-full   h-full overflow-hidden">
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
        className={`relative w-full max-w-md rounded-3xl p-8 shadow-2xl  mt-10  backdrop-blur-sm bg-white/15 border-2 border-white/40 ${
          theme === "dark" ? "bg-gray-900/40" : "bg-white/20"
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
            Join the Adventure!
          </h2>
          <p className="text-white/80">Create your account to begin</p>
        </motion.div>
        
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                First Name
              </label>
              <input
                className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                id="firstName"
                type="text"
                placeholder="First Name"
                {...register("firstname", { required: "First Name is required" })}
              />
              {errors.firstname && (
                <motion.p 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-pink-300 mt-1 text-xs"
                >
                  {errors.firstname.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
                id="lastName"
                type="text"
                placeholder="Last Name"
                {...register("lastname", { required: "Last Name is required" })}
              />
              {errors.lastname && (
                <motion.p 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-pink-300 mt-1 text-xs"
                >
                  {errors.lastname.message}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Email */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
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
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <motion.p 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-pink-300 mt-1 text-xs"
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all"
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message: "Need uppercase and number",
                },
              })}
            />
            {errors.password && (
              <motion.p 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-pink-300 mt-1 text-xs"
              >
                {errors.password.message}
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
                  value === watch("password") || "Passwords don't match",
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
            transition={{ delay: 0.6 }}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${
                isSubmitting 
                  ? "bg-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
              }`}
              type="submit"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up Now"}
            </motion.button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6 text-sm"
        >
          <p className="text-white/70">
            Already have an account?{' '}
            <a 
              href="/login" 
              className="text-purple-300 hover:text-pink-300 font-medium hover:underline transition"
            >
              Log In
            </a>
          </p>
          <p className="text-xs mt-4 text-white/50">
            © {new Date().getFullYear()} Cartoon Network. All magic reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;