import React from "react";
import { motion } from "framer-motion";
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
      iconSize: 20,
      titleSize: "text-base",
      messageSize: "text-[11px]",
      buttonPadding: "px-4 py-2",
    },
    medium: {
      container: "p-12 max-w-xl",
      iconSize: 28,
      titleSize: "text-xl md:text-2xl",
      messageSize: "text-xs",
      buttonPadding: "px-6 py-2.5",
    },
    large: {
      container: "p-16 max-w-3xl",
      iconSize: 36,
      titleSize: "text-3xl md:text-4xl",
      messageSize: "text-sm",
      buttonPadding: "px-8 py-3.5",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`relative mx-auto w-full border text-left transition-colors duration-300 ${config.container} ${
        isDark
          ? "border-slate-800 bg-slate-900/40 text-slate-200"
          : "border-slate-200 bg-slate-50/50 text-slate-800"
      }`}
    >
      {/* Top Border Amber Accent Highlight */}
      <div className="absolute top-0 left-0 h-[2px] w-12 bg-amber-500" />

      <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
        
        {/* Minimal Icon Box */}
        <motion.div variants={itemVariants} className="flex-shrink-0">
          <div className={`flex items-center justify-center p-4 border rounded-xl ${
            isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200 bg-white shadow-sm"
          }`}>
            <IconComponent
              size={config.iconSize}
              className="text-amber-500"
              strokeWidth={1.5}
            />
          </div>
        </motion.div>

        {/* Clean Content Stack */}
        <div className="flex-1 space-y-3 w-full">
          <motion.div variants={itemVariants} className="space-y-1">
            <h3 className={`font-black tracking-tight ${config.titleSize}`}>
              {title || "No Records Found"}
            </h3>
            {message !== null && (
              <p className={`font-medium tracking-wide ${isDark ? "text-slate-400" : "text-slate-500"} ${config.messageSize}`}>
                {message || "The requested index dataset is currently unpopulated."}
              </p>
            )}
          </motion.div>

          {/* Clean Interactive Action Tray */}
          {(showResetButton || showActionButton) && (
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-3">
              {showResetButton && onResetFilters && (
                <button
                  onClick={onResetFilters}
                  className={`group flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all ${config.buttonPadding} ${
                    isDark
                      ? "bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <RefreshCw
                    size={12}
                    className="group-hover:rotate-180 transition-transform duration-500"
                  />
                  Reset Filters
                </button>
              )}

              {showActionButton && onActionClick && (
                <button
                  onClick={onActionClick}
                  className={`group flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-black bg-amber-500 hover:bg-amber-400 active:scale-98 transition-all rounded-xl shadow-md shadow-amber-500/10 ${config.buttonPadding}`}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  {actionButtonText}
                </button>
              )}
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};

export default EmptyStateModel;