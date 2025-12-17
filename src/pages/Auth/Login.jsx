import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";

// Import cartoon-themed background images
import bg1 from "../../assets/backgroundimage.jpg";




const Login = () => {
  const { theme } = useTheme();
  const { LoginUser } = useAuth();
  const [currentBg, setCurrentBg] = useState(0);
  const [showPassword, setShowPassword] = useState(false)


  const backgrounds = [
    bg1,
    

  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onHandleSubmitLoginData = (data) => {
    LoginUser(data);
  };

  // Auto-rotate backgrounds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }




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
              scale: currentBg === index ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className={`relative w-full max-w-md rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-white/15 border-2 border-white/40 ${theme === "dark" ? "bg-gray-900/40" : "bg-white/20"
          }`}
      >
        {/* Cartoon-themed header */}
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
            Welcome Back!
          </h2>
          <p className="text-white/80">Enter your details to join the fun!</p>
        </motion.div>

        <form className="space-y-6" onSubmit={handleSubmit(onHandleSubmitLoginData)}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none focus:border-yellow-400 transition-all"
              id="email"
              type="text"
              placeholder="Enter your Email"
              aria-label="Enter your email"
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
                className="text-red-300 mt-2 p-2 bg-red-500/20 rounded-lg text-sm"
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="flex items-center  rounded-xl relative">
              <input
                className="w-full p-3 rounded-xl bg-white/25 border-2 border-white/40 placeholder-white/60 text-white focus:ring-2 focus:ring-yellow-400 focus:outline-none focus:border-yellow-400 transition-all"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                aria-label="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^[A-Z][a-zA-Z@0-9]{7,15}$/,
                    message:
                      "Password must start with an uppercase letter, contain '@', a number, and be 8-16 characters long",
                  },
                })}
              />
              <button
                onClick={handleShowPassword}
                className="absolute right-3 text-white"
                type="button"
              >
                {showPassword ? (
                  <span>🙈</span> // Or <EyeOff /> if you're using an icon library
                ) : (
                  <span>👁️</span> // Or <Eye />
                )}
              </button>
            </div>

            {errors.password && (
              <motion.p
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-red-300 mt-2 p-2 bg-red-500/20 rounded-lg text-sm"
              >
                {errors.password.message}
              </motion.p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-between items-center text-sm"
          >
            <a href="/forget-password-requset" className="text-cyan-300 hover:text-yellow-300 hover:underline transition">
              Forgot Password?
            </a>
            <a href="/signup" className="text-cyan-300 hover:text-yellow-300 hover:underline transition">
              Create Account
            </a>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 font-bold text-white shadow-lg"
            type="submit"
          >
            Sign In
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs mt-8 opacity-70"
        >
          Join our cartoon universe! © {new Date().getFullYear()} Cartoon Network
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;