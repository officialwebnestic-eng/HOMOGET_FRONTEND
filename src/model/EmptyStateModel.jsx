import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext"; // Adjust path as needed
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
  size = "medium", // small, medium, large
}) => {
  const { theme } = useTheme();

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
      padding: "p-6",
      iconSize: "h-16 w-16 mb-3",
      titleSize: "text-base",
      messageSize: "text-xs",
      buttonPadding: "px-3 py-1.5 text-xs",
    },
    medium: {
      padding: "p-8",
      iconSize: "h-24 w-24 mb-4",
      titleSize: "text-lg",
      messageSize: "text-sm",
      buttonPadding: "px-4 py-2 text-sm",
    },
    large: {
      padding: "p-12",
      iconSize: "h-32 w-32 mb-6",
      titleSize: "text-xl",
      messageSize: "text-base",
      buttonPadding: "px-6 py-3 text-base",
    },
  };
  const config = sizeConfig[size] || sizeConfig.medium;

  const colorSchemes = {
    inquiries: {
      iconBg: theme === "dark" ? "bg-blue-900/20" : "bg-blue-50",
      iconColor: theme === "dark" ? "text-blue-400" : "text-blue-500",
    },
    properties: {
      iconBg: theme === "dark" ? "bg-emerald-900/20" : "bg-emerald-50",
      iconColor: theme === "dark" ? "text-emerald-400" : "text-emerald-500",
    },
    users: {
      iconBg: theme === "dark" ? "bg-purple-900/20" : "bg-purple-50",
      iconColor: theme === "dark" ? "text-purple-400" : "text-purple-500",
    },
    bookings: {
      iconBg: theme === "dark" ? "bg-amber-900/20" : "bg-amber-50",
      iconColor: theme === "dark" ? "text-amber-400" : "text-amber-500",
    },
    appointments: {
      iconBg: theme === "dark" ? "bg-cyan-900/20" : "bg-cyan-50",
      iconColor: theme === "dark" ? "text-cyan-400" : "text-cyan-500",
    },
    search: {
      iconBg: theme === "dark" ? "bg-indigo-900/20" : "bg-indigo-50",
      iconColor: theme === "dark" ? "text-indigo-400" : "text-indigo-500",
    },
    filter: {
      iconBg: theme === "dark" ? "bg-pink-900/20" : "bg-pink-50",
      iconColor: theme === "dark" ? "text-pink-400" : "text-pink-500",
    },
    error: {
      iconBg: theme === "dark" ? "bg-red-900/20" : "bg-red-50",
      iconColor: theme === "dark" ? "text-red-400" : "text-red-500",
    },
    network: {
      iconBg: theme === "dark" ? "bg-orange-900/20" : "bg-orange-50",
      iconColor: theme === "dark" ? "text-orange-400" : "text-orange-500",
    },
    database: {
      iconBg: theme === "dark" ? "bg-teal-900/20" : "bg-teal-50",
      iconColor: theme === "dark" ? "text-teal-400" : "text-teal-500",
    },
    default: {
      iconBg: theme === "dark" ? "bg-slate-800/50" : "bg-slate-100",
      iconColor: theme === "dark" ? "text-slate-400" : "text-slate-500",
    },
  };

  const colors = colorSchemes[type] || colorSchemes.default;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };
  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.2 },
    },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } },
  };
  const floatingVariants = {
    float: {
      y: [-2, 2, -2],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const getDefaultTitle = () => {
    const titles = {
      inquiries: "No Inquiries Found",
      properties: "No Properties Available",
      users: "No Users Found",
      bookings: "No Bookings Yet",
      appointments: "No Appointments Scheduled",
      search: "No Search Results",
      filter: "No Results Found",
      error: "Something Went Wrong",
      network: "Connection Issue",
      database: "No Data Available",
      default: "Nothing Here Yet",
    };
    return title || titles[type] || titles.default;
  };

  const getDefaultMessage = () => {
    const messages = {
      inquiries: "You haven't received any inquiries yet. Check back later or adjust your filters.",
      properties: "No properties match your current criteria. Try adjusting your search parameters.",
      users: "No users found in the system. They may not have registered yet.",
      bookings: "No bookings have been made yet. Start by creating your first booking.",
      appointments: "No appointments are scheduled. Book your first appointment to get started.",
      search: "We couldn't find any results matching your search terms. Try different keywords.",
      filter: "No items match your current filters. Try broadening your search criteria.",
      error: "We encountered an unexpected error. Please try again or contact support.",
      network: "Unable to connect to the server. Please check your internet connection.",
      database: "The database appears to be empty or unavailable at the moment.",
      default: "This section is currently empty. Content will appear here when available.",
    };
    return message || messages[type] || messages.default;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl shadow-xl text-center relative overflow-hidden transition-all duration-500
  ${theme === "dark"
    ? "bg-gradient-to-br from-red-400 via-rose-00 to-red-400 border-red-800/50 hover:shadow-pink-900/40"
    : "bg-gradient-to-br from-pink-100 via-rose-200 to-amber-200 border-rose-200 hover:shadow-rose-400/40"
  }
  border backdrop-blur-xl hover:scale-[1.03]`}
    >
      {/* Background Effects */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${colors.iconBg} rounded-full blur-3xl opacity-30`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-24 h-24 ${colors.iconBg} rounded-full blur-2xl opacity-20`}
      ></div>

      {/* Icon with animation and glow */}
      <motion.div variants={itemVariants} className="relative z-10 p-4">
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          animate="float"
          className={`mx-auto ${sizeConfig[size]?.iconSize} ${colors.iconBg} rounded-2xl flex items-center justify-center backdrop-blur-sm relative overflow-hidden cursor-pointer`}
        >
          {/* Glow overlay */}
          <div
            className={`absolute inset-0 ${colors.iconBg} opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
          ></div>

          {/* Animated Icon */}
          <motion.div animate={floatingVariants.float} className="relative z-10">
            <IconComponent className={`${sizeConfig[size]?.iconSize} ${colors.iconColor}`} />
          </motion.div>

          {/* Sparkle effects */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 ${colors.iconColor} rounded-full opacity-0`}
                style={{
                  top: `${20 + i * 20}%`,
                  left: `${30 + i * 15}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Title and message */}
      <motion.div variants={itemVariants} className="relative z-10 px-4">
        <h3 className={`font-semibold mb-2 ${theme === "dark" ? "text-slate-100" : "text-slate-900"} ${sizeConfig[size]?.titleSize}`}>
          {title || getDefaultTitle()}
        </h3>
        <p className={`leading-relaxed ${theme === "dark" ? "text-slate-400" : "text-slate-600"} ${sizeConfig[size]?.messageSize}`}>
          {message || getDefaultMessage()}
        </p>
      </motion.div>

      {/* Action Buttons */}
      {(showResetButton || showActionButton) && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-6 px-4 relative z-10"
        >
          {showResetButton && onResetFilters && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onResetFilters}
              className={`${sizeConfig[size]?.buttonPadding} ${theme === "dark" ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-500/30" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border-emerald-200"} rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm flex items-center gap-2 justify-center hover:shadow-xl hover:shadow-emerald-500/30`}
            >
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </motion.button>
          )}
          {showActionButton && onActionClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onActionClick}
              className={`${sizeConfig[size]?.buttonPadding} ${theme === "dark" ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-indigo-500/30" : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-indigo-200"} rounded-xl font-semibold transition-all duration-300 border backdrop-blur-sm flex items-center gap-2 justify-center hover:shadow-xl hover:shadow-indigo-500/30`}
            >
              <Plus className="w-4 h-4" /> {actionButtonText}
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyStateModel;