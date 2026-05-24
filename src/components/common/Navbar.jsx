import React, { useState, useContext, useEffect, useRef } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import {
  MoonIcon,
  SunIcon,
  LogOut,
  ChevronRight,
  Settings,
  Menu as MenuLucide,
  Home,
  TrendingUp,
  Building2,
  MapPin,
  Briefcase,
  User,
  Heart,
  DollarSign,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navbarlogo } from "../../ExportImages";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarLinks } from "../../helpers/NavbarHelpers";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logoutUser, user, isAuthenticated } = useContext(AuthContext);
  const { toggleSidebar } = useSidebar();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef();
  const isDark = theme === "dark";

  const showSidebarToggle = isAuthenticated && user?.role !== "user";

  // Helper function to navigate with filters
  const navigateWithFilters = (filters) => {
    navigate("/properties", { state: { filters } });
  };

  // Navigation handlers
  const handleBuyClick = (subCategory = null) => {
    const filters = {
      offeringType: "Sale",
      category: "Residential",
      ...(subCategory && { propertytype: subCategory })
    };
    navigateWithFilters(filters);
  };

  const handleRentClick = (subCategory = null) => {
    const filters = {
      offeringType: "Rent",
      category: "Residential",
      ...(subCategory && { propertytype: subCategory })
    };
    navigateWithFilters(filters);
  };

  const handleOffPlanClick = (developer = null) => {
    const filters = {
      category: "Off-Plan",
      ...(developer && { developerName: developer })
    };
    navigateWithFilters(filters);
  };

  const handleCommercialClick = (type = null, offering = "Sale") => {
    const filters = {
      category: "Commercial",
      offeringType: offering,
      ...(type && { propertytype: type })
    };
    navigateWithFilters(filters);
  };

  const getNavItems = () => {
    if (!isAuthenticated || user?.role === "user") {
      return ["Home", "About Us", "Buy", "Rent", "Off-Plan", "Resources", "Careers"];
    }
    return ["Home", "About Us", "Resources", "Careers"]; // Added About Us for other roles too
  };

  const navItems = getNavItems();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsProfileOpen(false);
    navigate("/login");
  };

  const currentTheme = {
    bg: isDark ? "bg-[#0a0a0c]/95" : "bg-white/95",
    text: isDark ? "text-white" : "text-[#1a1a1e]",
    textSecondary: isDark ? "text-gray-400" : "text-slate-500",
    border: isDark ? "border-white/5" : "border-slate-100",
    dropdown: isDark
      ? "bg-[#161B26] border-white/10 shadow-2xl"
      : "bg-white border-slate-100 shadow-2xl",
    accent: "#ff8a00",
  };

  const renderBadge = (type) => {
    if (!type) return null;
    const colors = {
      HOT: "bg-red-500",
      NEW: "bg-blue-500",
      TRENDING: "bg-[#ff8a00]",
    };
    return (
      <span
        className={`ml-1.5 px-1.5 py-0.5 rounded text-[7px] font-black text-white uppercase ${colors[type]}`}
      >
        {type}
      </span>
    );
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-[100] backdrop-blur-xl ${currentTheme.bg} border-b ${currentTheme.border}`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <div className="flex items-center gap-3 lg:gap-6">
            {showSidebarToggle && (
              <button
                onClick={toggleSidebar}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[#ff8a00] text-black transition-all"
              >
                <MenuLucide size={20} />
              </button>
            )}
            <Link to="/" className="flex-shrink-0">
              <img
                src={navbarlogo}
                alt="Logo"
                className="h-15 md:h-30 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {(!isAuthenticated || user?.role === "user") && (
            <div className="hidden xl:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 lg:px-4 py-7 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} hover:text-[#ff8a00] transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                className={`px-3 lg:px-4 py-7 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} hover:text-[#ff8a00] transition-colors`}
              >
                About Us
              </Link>

              {/* Buy Mega Menu */}
              <div
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu("Buy")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  className={`px-3 lg:px-4 flex items-center gap-1 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} ${activeMegaMenu === "Buy" ? "text-[#ff8a00]" : ""} transition-colors`}
                >
                  Buy
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${activeMegaMenu === "Buy" ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {activeMegaMenu === "Buy" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute left-0 top-full w-[90vw] max-w-[700px] rounded-2xl lg:rounded-[2rem] border overflow-hidden ${currentTheme.dropdown}`}
                    >
                      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[9px] lg:text-[10px] font-black text-[#ff8a00] uppercase mb-3 tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
                              Residential Sale
                            </h4>
                            <div className="flex flex-col gap-2">
                              {["Apartments", "Villas", "Townhouses", "Penthouses"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => handleBuyClick(item)}
                                  className="text-left text-xs lg:text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#ff8a00] transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[9px] lg:text-[10px] font-black text-[#ff8a00] uppercase mb-3 tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
                              Commercial Sale
                            </h4>
                            <div className="flex flex-col gap-2">
                              {["Office Space", "Retail", "Warehouse", "Land"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => handleCommercialClick(item, "Sale")}
                                  className="text-left text-xs lg:text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#ff8a00] transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleBuyClick()}
                          className="w-full lg:w-48 rounded-2xl lg:rounded-3xl p-5 bg-[#2D2D6E] text-white flex flex-col justify-end shadow-xl hover:scale-105 transition-transform"
                        >
                          <p className="text-[8px] lg:text-[9px] font-black uppercase opacity-60">
                            Buying Guide
                          </p>
                          <p className="text-sm lg:text-base font-black leading-tight mt-1">
                            Secure Your Asset
                          </p>
                          <ChevronRight size={14} className="mt-2 opacity-60" />
                        </button>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 p-3 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-white/10">
                        <button
                          onClick={() => handleBuyClick()}
                          className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/10 hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all"
                        >
                          <Home size={12} /> Residential
                        </button>
                        <button
                          onClick={() => handleCommercialClick(null, "Sale")}
                          className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/10 hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all"
                        >
                          <Building2 size={12} /> Commercial
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Rent Mega Menu */}
              <div
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu("Rent")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  className={`px-3 lg:px-4 flex items-center gap-1 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} ${activeMegaMenu === "Rent" ? "text-[#ff8a00]" : ""} transition-colors`}
                >
                  Rent
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {activeMegaMenu === "Rent" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute left-0 top-full w-[90vw] max-w-[700px] rounded-2xl lg:rounded-[2rem] border overflow-hidden ${currentTheme.dropdown}`}
                    >
                      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[9px] lg:text-[10px] font-black text-[#ff8a00] uppercase mb-3 tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
                              Residential Rent
                            </h4>
                            <div className="flex flex-col gap-2">
                              {["Apartments", "Studios", "Villas", "Short Term"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => handleRentClick(item)}
                                  className="text-left text-xs lg:text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#ff8a00] transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[9px] lg:text-[10px] font-black text-[#ff8a00] uppercase mb-3 tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
                              Commercial Rent
                            </h4>
                            <div className="flex flex-col gap-2">
                              {["Office Space", "Retail", "Warehouse"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => handleCommercialClick(item, "Rent")}
                                  className="text-left text-xs lg:text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#ff8a00] transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRentClick()}
                          className="w-full lg:w-48 rounded-2xl lg:rounded-3xl p-5 bg-[#5D46A0] text-white flex flex-col justify-end shadow-xl hover:scale-105 transition-transform"
                        >
                          <p className="text-[8px] lg:text-[9px] font-black uppercase opacity-60">
                            Rental Insights
                          </p>
                          <p className="text-sm lg:text-base font-black leading-tight mt-1">
                            Find Your Home
                          </p>
                          <ChevronRight size={14} className="mt-2 opacity-60" />
                        </button>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 p-3 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-white/10">
                        <button
                          onClick={() => handleRentClick()}
                          className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/10 hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all"
                        >
                          <MapPin size={12} /> Find Agent
                        </button>
                        <button
                          onClick={() => handleRentClick("Short Term")}
                          className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/10 hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all"
                        >
                          <TrendingUp size={12} /> Short Term
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Off-Plan Mega Menu */}
              <div
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu("Off-Plan")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  className={`px-3 lg:px-4 flex items-center gap-1 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} ${activeMegaMenu === "Off-Plan" ? "text-[#ff8a00]" : ""} transition-colors`}
                >
                  Off-Plan
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {activeMegaMenu === "Off-Plan" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute left-0 top-full w-[90vw] max-w-[700px] rounded-2xl lg:rounded-[2rem] border overflow-hidden ${currentTheme.dropdown}`}
                    >
                      <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-[9px] lg:text-[10px] font-black text-[#ff8a00] uppercase mb-3 tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
                              New Launches
                            </h4>
                            <div className="flex flex-col gap-2">
                              {["Emaar Projects", "Damac Hills", "Nakheel", "Sobha Realty"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => handleOffPlanClick(item.split(" ")[0])}
                                  className="text-left text-xs lg:text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#ff8a00] transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[9px] lg:text-[10px] font-black text-[#ff8a00] uppercase mb-3 tracking-widest border-b border-slate-200 dark:border-white/10 pb-2">
                              By Handover
                            </h4>
                            <div className="flex flex-col gap-2">
                              {["Handover 2025", "Handover 2026", "Handover 2027"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => navigateWithFilters({ category: "Off-Plan", deliveryDate: item.split(" ")[1] })}
                                  className="text-left text-xs lg:text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-[#ff8a00] transition-all"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleOffPlanClick()}
                          className="w-full lg:w-48 rounded-2xl lg:rounded-3xl p-5 bg-[#ff8a00] text-white flex flex-col justify-end shadow-xl hover:scale-105 transition-transform"
                        >
                          <p className="text-[8px] lg:text-[9px] font-black uppercase opacity-60">
                            High ROI Projects
                          </p>
                          <p className="text-sm lg:text-base font-black leading-tight mt-1">
                            Invest Early
                          </p>
                          <ChevronRight size={14} className="mt-2 opacity-60" />
                        </button>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 p-3 flex flex-wrap items-center gap-2 border-t border-slate-200 dark:border-white/10">
                        <button
                          onClick={() => navigate("/project-map")}
                          className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/10 hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all"
                        >
                          <MapPin size={12} /> Project Map
                        </button>
                        <button
                          onClick={() => navigateWithFilters({ category: "Off-Plan", hasPaymentPlan: true })}
                          className="px-3 py-1.5 bg-white dark:bg-white/10 rounded-xl text-[8px] font-black uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/10 hover:border-[#ff8a00] hover:text-[#ff8a00] transition-all"
                        >
                          <DollarSign size={12} /> Payment Plans
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu("resources")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  className={`px-3 lg:px-4 flex items-center gap-1 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} ${activeMegaMenu === "resources" ? "text-[#ff8a00]" : ""} transition-colors`}
                >
                  Resources <ChevronDownIcon className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {activeMegaMenu === "resources" && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`absolute left-0 top-full w-64 rounded-2xl lg:rounded-[2rem] border p-3 ${currentTheme.dropdown}`}
                    >
                      {sidebarLinks.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center justify-between px-4 lg:px-5 py-3 rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${currentTheme.text} hover:bg-[#ff8a00] hover:text-white transition-all`}
                        >
                          {item.name} {renderBadge(item.badge)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/contact-us"
                className={`px-3 lg:px-4 py-7 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} hover:text-[#ff8a00] transition-colors flex items-center gap-2`}
              >
                Contact Us
               
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 lg:p-2.5 rounded-full transition-all ${isDark ? "text-amber-400 bg-white/5" : "text-slate-600 bg-slate-100"}`}
            >
              {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-4 lg:px-7 py-2 lg:py-3 text-[9px] lg:text-[10px] font-black uppercase tracking-widest rounded-full bg-[#ff8a00] text-white shadow-lg shadow-orange-500/20 hover:bg-[#e67c00] transition-all"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-[#ff8a00] border-2 border-white/20 flex items-center justify-center text-white font-black hover:scale-105 transition-all"
                >
                  {user?.firstname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className={`absolute right-0 mt-3 w-72 rounded-2xl lg:rounded-[2rem] border overflow-hidden ${currentTheme.dropdown}`}
                    >
                      <div className={`px-5 py-4 border-b ${currentTheme.border}`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-lg">
                            {user?.firstname?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${currentTheme.text}`}>
                              {user?.firstname} {user?.lastname}
                            </p>
                            <p className={`text-[10px] ${currentTheme.textSecondary} truncate`}>
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <span className="inline-block px-2 py-1 rounded-full bg-[#ff8a00]/10 text-[#ff8a00] text-[8px] font-black uppercase tracking-wider">
                          {user?.role || "USER"} PRO
                        </span>
                      </div>

                      <div className="p-2">
                        {user?.role === "user" && (
                          <>
                            <Link
                              to="/user-profile"
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black tracking-widest ${currentTheme.text} hover:bg-[#ff8a00]/10 transition-all`}
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <User size={16} className="text-[#ff8a00]" />
                              My Profile
                            </Link>
                            <Link
                              to="/my-properties"
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black tracking-widest ${currentTheme.text} hover:bg-[#ff8a00]/10 transition-all`}
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Home size={16} className="text-[#ff8a00]" />
                              My Properties
                            </Link>
                            <Link
                              to="/wishlist"
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black tracking-widest ${currentTheme.text} hover:bg-[#ff8a00]/10 transition-all`}
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Heart size={16} className="text-[#ff8a00]" />
                              Wishlist
                            </Link>
                          </>
                        )}

                        {user?.role !== "user" && (
                          <Link
                            to={`/${user?.role?.toLowerCase()}-dashboard`}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black tracking-widest ${currentTheme.text} hover:bg-[#ff8a00]/10 transition-all`}
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Home size={16} className="text-[#ff8a00]" />
                            Dashboard
                          </Link>
                        )}

                        <Link
                          to="/settings"
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black tracking-widest ${currentTheme.text} hover:bg-[#ff8a00]/10 transition-all`}
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={16} className="text-[#ff8a00]" />
                          Settings
                        </Link>

                        <div className={`border-t ${currentTheme.border} my-2`} />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden p-2 text-current"
            >
              <Bars3Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed inset-0 z-[200] flex flex-col ${isDark ? "bg-[#0a0a0c] text-white" : "bg-white text-[#1a1a1e]"}`}
          >
            <div className={`p-5 sm:p-8 flex items-center justify-between border-b ${currentTheme.border}`}>
              <img src={navbarlogo} alt="Logo" className="h-8 sm:h-10" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 sm:p-3 bg-red-500/10 text-red-500 rounded-full"
              >
                <XMarkIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-lg sm:text-xl font-black uppercase tracking-widest ${currentTheme.text} border-b ${currentTheme.border} pb-4`}
              >
                Home
              </Link>
              <Link
                to="/about-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-lg sm:text-xl font-black uppercase tracking-widest ${currentTheme.text} border-b ${currentTheme.border} pb-4`}
              >
                About Us
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleBuyClick();
                }}
                className={`block w-full text-left text-lg sm:text-xl font-black uppercase tracking-widest ${currentTheme.text} border-b ${currentTheme.border} pb-4`}
              >
                Buy
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleRentClick();
                }}
                className={`block w-full text-left text-lg sm:text-xl font-black uppercase tracking-widest ${currentTheme.text} border-b ${currentTheme.border} pb-4`}
              >
                Rent
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleOffPlanClick();
                }}
                className={`block w-full text-left text-lg sm:text-xl font-black uppercase tracking-widest ${currentTheme.text} border-b ${currentTheme.border} pb-4`}
              >
                Off-Plan
              </button>
 <Link
                to="/contact-us"
                className={`px-3 lg:px-4 py-7 text-[10px] lg:text-[11px] font-black uppercase tracking-widest ${currentTheme.text} hover:text-[#ff8a00] transition-colors flex items-center gap-2`}
              >
                Contact Us
               
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}