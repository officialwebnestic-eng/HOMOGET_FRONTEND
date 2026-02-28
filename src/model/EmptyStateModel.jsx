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
  
  // Brand Color Tokens
  const brandGold = "#C5A059";
  const brandOrange = "#F28C05"; // From your "FIND" button screenshot

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
    },
    medium: {
      container: "p-12 max-w-xl",
      iconBox: "w-24 h-24",
      iconSize: 40,
      titleSize: "text-3xl",
      messageSize: "text-xs",
    },
    large: {
      container: "p-20 max-w-3xl",
      iconBox: "w-32 h-32",
      iconSize: 56,
      titleSize: "text-5xl",
      messageSize: "text-sm",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Luxury Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], 
        staggerChildren: 0.15 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const ringVariants = {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.1, 0.25, 0.1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative mx-auto overflow-hidden rounded-[3rem] border text-center transition-all duration-700
        ${config.container}
        ${isDark 
          ? "bg-[#0F1219] border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.7)]" 
          : "bg-white border-slate-100 shadow-[0_40px_80px_rgba(0,0,0,0.04)]"
        }`}
    >
      {/* 1. Subtle Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-30" />
      <motion.div 
        animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[120px]" 
        style={{ backgroundColor: brandGold }} 
      />

      {/* 2. Animated Central Icon Hub */}
      <motion.div variants={itemVariants} className="relative flex justify-center mb-10">
        <div className={`relative ${config.iconBox} flex items-center justify-center`}>
          
          {/* Pulsing Aura */}
          <motion.div 
            variants={ringVariants}
            animate="animate"
            className="absolute inset-0 rounded-full border border-[#C5A059] opacity-20" 
          />
          
          {/* Rotating Orbital Border */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 rounded-full border border-dashed border-[#C5A059]/10" 
          />

          {/* Main Icon Vessel */}
          <motion.div
            whileHover={{ scale: 1.03, rotate: -2 }}
            className={`relative z-10 w-full h-full flex items-center justify-center rounded-[2.5rem] overflow-hidden border border-[#C5A059]/20 shadow-inner
              ${isDark ? "bg-[#161B22]" : "bg-slate-50"}`}
          >
            <IconComponent 
              size={config.iconSize} 
              style={{ color: brandGold }} 
              strokeWidth={1}
            />
            {/* Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </motion.div>

          <motion.div
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles size={24} style={{ color: brandGold }} />
          </motion.div>
        </div>
      </motion.div>

      {/* 3. Sanctuary Typography Pattern */}
      <motion.div variants={itemVariants} className="relative z-10 space-y-4">
        <h3 className={`font-extrabold tracking-tighter leading-none
          ${isDark ? "text-white" : "text-[#1A1A1A]"} ${config.titleSize}`}>
          {title || "Empty"} <span className="italic font-serif" style={{ color: brandGold }}>Registry.</span>
        </h3>
        
        <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 opacity-30" style={{ backgroundColor: brandGold }} />
            <p className={`font-black uppercase tracking-[0.4em] opacity-60 
              ${isDark ? "text-slate-400" : "text-slate-500"} ${config.messageSize}`}>
              {message || "The requested portfolio collection is currently unavailable."}
            </p>
            <div className="h-[1px] w-8 opacity-30" style={{ backgroundColor: brandGold }} />
        </div>
      </motion.div>

      {/* 4. Luxury Action Controls */}
      {(showResetButton || showActionButton) && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-5 justify-center mt-14 relative z-10"
        >
          {showResetButton && onResetFilters && (
            <motion.button
              whileHover={{ y: -2, backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onResetFilters}
              className={`group flex items-center gap-3 justify-center px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] transition-all border
                ${isDark 
                  ? "border-white/10 text-white" 
                  : "border-slate-200 text-[#1A1A1A]"}`}
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
              Sync Database
            </motion.button>
          )}

          {showActionButton && onActionClick && (
            <motion.button
              whileHover={{ y: -3, boxShadow: `0 20px 40px -10px rgba(242, 140, 5, 0.4)` }}
              whileTap={{ scale: 0.97 }}
              onClick={onActionClick}
              className="group flex items-center gap-3 justify-center px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-[0.3em] text-white transition-all shadow-xl"
              style={{ backgroundColor: brandOrange }}
            >
              <Plus size={16} strokeWidth={3} />
              {actionButtonText}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyStateModel;