import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  FileX,
  Users,
  Home,
  ShoppingCart,
  Calendar,
  MessageSquare,
  AlertCircle,
  Database,
  Filter,
  Wifi,
  RefreshCw,
  Plus,
  Sparkles,
} from "lucide-react";

const EmptyStateModel = ({
  type = "default",
  title,
  message,
  showResetButton = false,
  onResetFilters,
  showActionButton = false,
  actionButtonText = "Add New",
  onActionClick,
  customIcon,
  size = "medium",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Brand colors (luxury gold & vibrant orange)
  const brandGold = "#C5A059";
  const brandOrange = "#F28C05";

  const iconMap = {
    inquiries: MessageSquare,
    properties: Home,
    users: Users,
    bookings: ShoppingCart,
    appointments: Calendar,
    search: Search,
    filter: Filter,
    error: AlertCircle,
    network: Wifi,
    database: Database,
    default: FileX,
  };

  const IconComponent = customIcon || iconMap[type] || iconMap.default;

  const sizeConfig = {
    small: {
      container: "p-6 max-w-sm",
      iconBox: "w-16 h-16",
      iconSize: 24,
      titleSize: "text-lg",
      messageSize: "text-[10px]",
      buttonPadding: "px-6 py-2",
    },
    medium: {
      container: "p-12 max-w-xl",
      iconBox: "w-24 h-24",
      iconSize: 40,
      titleSize: "text-3xl",
      messageSize: "text-xs",
      buttonPadding: "px-8 py-3",
    },
    large: {
      container: "p-20 max-w-3xl",
      iconBox: "w-32 h-32",
      iconSize: 56,
      titleSize: "text-5xl",
      messageSize: "text-sm",
      buttonPadding: "px-10 py-4",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // 3D perspective variants (for the card itself)
  const cardVariants = {
    hidden: { opacity: 0, y: 30, rotateX: -10 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.1,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: isDark
        ? "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,160,89,0.2)"
        : "0 40px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(197,160,89,0.3)",
      transition: { duration: 0.3 },
    },
  };

  const iconContainerVariants = {
    hidden: { scale: 0.8, rotateY: -30, opacity: 0 },
    visible: {
      scale: 1,
      rotateY: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.2 },
    },
    float: {
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const ringVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.15, 0.4, 0.15],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`relative mx-auto overflow-hidden rounded-[2.5rem] border text-center transition-all duration-500
        perspective-1000 transform-gpu
        ${config.container}
        ${
          isDark
            ? "bg-gradient-to-br from-[#0F1219] to-[#0B0E14] border-white/10 shadow-2xl"
            : "bg-gradient-to-br from-white to-slate-50/80 border-slate-100 shadow-xl"
        }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* 3D Depth Layers */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-transparent via-black/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      {/* Floating Orbs (3D blur) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl"
      />

      {/* Central Icon with 3D depth */}
      <motion.div variants={itemVariants} className="relative flex justify-center mb-8">
        <div className="relative perspective-500">
          <motion.div
            variants={iconContainerVariants}
            animate="float"
            className={`relative ${config.iconBox} flex items-center justify-center transform-gpu`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Outer glowing ring */}
            <motion.div
              variants={ringVariants}
              animate="animate"
              className="absolute inset-0 rounded-full border-2 border-amber-500/30 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
            />

            {/* Rotating orbital ring */}
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 rounded-full border border-dashed border-amber-500/20"
              style={{ transformStyle: "preserve-3d" }}
            />

            {/* Main icon container with 3D shadow and gradient border */}
            <motion.div
              whileHover={{ rotateX: 5, rotateY: 5, scale: 1.05 }}
              className={`relative z-10 w-full h-full flex items-center justify-center rounded-2xl overflow-hidden
                bg-gradient-to-br ${isDark ? "from-[#1A1F2E] to-[#11141B]" : "from-white to-slate-50"}
                shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_20px_40px_-12px_rgba(0,0,0,0.3)]
                border border-white/10`}
              style={{ transform: "translateZ(15px)" }}
            >
              <IconComponent
                size={config.iconSize}
                style={{ color: brandGold, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" }}
                strokeWidth={1.5}
              />
              {/* Glass highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent pointer-events-none" />
            </motion.div>

            {/* Decorative sparkling star */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-3 -right-3"
            >
              <Sparkles size={20} className="text-amber-400 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Text Content */}
      <motion.div variants={itemVariants} className="relative z-10 space-y-4">
        <h3
          className={`font-extrabold tracking-tighter leading-tight
          ${isDark ? "text-white" : "text-[#1A1A1A]"} ${config.titleSize}`}
        >
          {title || "Empty"}{" "}
          <span className="italic font-serif" style={{ color: brandGold }}>
            Registry.
          </span>
        </h3>

        <div className="flex items-center justify-center gap-3">
          <div
            className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500/60"
          />
          <p
            className={`font-black uppercase tracking-[0.4em] opacity-70
            ${isDark ? "text-slate-300" : "text-slate-600"} ${config.messageSize}`}
          >
            {message ||
              "The requested portfolio collection is currently unavailable."}
          </p>
          <div
            className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500/60"
          />
        </div>
      </motion.div>

      {/* Buttons with 3D hover effect */}
      {(showResetButton || showActionButton) && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-5 justify-center mt-12 relative z-10"
        >
          {showResetButton && onResetFilters && (
            <motion.button
              whileHover={{
                y: -3,
                scale: 1.02,
                boxShadow: "0 15px 30px -10px rgba(0,0,0,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={onResetFilters}
              className={`group flex items-center gap-2 justify-center rounded-full font-black uppercase text-[9px] tracking-[0.3em] transition-all duration-300
                border ${config.buttonPadding}
                ${
                  isDark
                    ? "border-white/20 text-white hover:border-amber-500/50 hover:bg-white/5"
                    : "border-slate-200 text-slate-700 hover:border-amber-500/50 hover:bg-slate-50"
                }`}
            >
              <RefreshCw
                size={14}
                className="group-hover:rotate-180 transition-transform duration-700"
              />
              Sync Database
            </motion.button>
          )}

          {showActionButton && onActionClick && (
            <motion.button
              whileHover={{
                y: -3,
                scale: 1.02,
                boxShadow: "0 25px 40px -12px rgba(242,140,5,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onActionClick}
              className={`group flex items-center gap-2 justify-center rounded-full font-black uppercase text-[9px] tracking-[0.3em] text-white transition-all duration-300
                bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg ${config.buttonPadding}`}
              style={{ boxShadow: "0 8px 20px -6px rgba(242,140,5,0.4)" }}
            >
              <Plus size={16} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              {actionButtonText}
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Subtle 3D edge highlight */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
    </motion.div>
  );
};

export default EmptyStateModel;