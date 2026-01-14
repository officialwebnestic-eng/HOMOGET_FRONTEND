import React, { useState, useContext, useEffect, useRef } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { 
  MoonIcon, 
  SunIcon, 
  LogOut, 
  LayoutDashboard,
  PlusCircle,
  ChevronRight,
  User,
  Settings,
  Building2,
  ShieldCheck,
  Briefcase
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navbarlogo } from "../../ExportImages";
import { motion, AnimatePresence } from "framer-motion";

// Additional Dropdown Menu Items
const sidebarLinks = [
  { name: "MORTGAGE", href: "/mortgage", badge: "NEW" },
  { name: "FIND AGENT", href: "/agentsupport" },
  { name: "FIND DEVELOPER", href: "/find-developer" },
  { name: "DUBAI TRANSACTION", href: "/transactions", badge: "HOT" },
  { name: "MEASUREMENT SYSTEM", href: "/measurement" },
  { name: "RENT V/S BUY CALCULATOR", href: "/calculator" },
  { name: "TRENDS", href: "/trends", badge: "TRENDING" },
  { name: "EXPLORE", href: "/explore" },
  { name: "BLOG", href: "/blog" },
  { name: "PROPERTY LISTING", href: "/propertylisting" },
  { name: "TESTIMONIALS", href: "/testimonials" },
];

// Main Horizontal Links
const commonNavigation = [
  { name: "Home", href: "/" },
  { name: "Buy", href: "/buy" },
  { name: "Rent", href: "/rent" },
  { name: "Offplan", href: "/offplan", badge: "HOT" },
  { name: "Commercial", href: "/commercial" },
  { name: "Luxury", href: "/luxury" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contactus" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logoutUser, user, isAuthenticated } = useContext(AuthContext);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const navigate = useNavigate();
  const profileDropdownRef = useRef();
  const isDark = theme === "dark";

  // Handle Scroll Transparency
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Outside Click to Close Profile Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
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

  const themeClasses = {
    dark: {
      bg: scrollY > 20 ? "bg-black/95 backdrop-blur-md" : "bg-black",
      text: "text-white",
      hover: "hover:text-amber-500",
      border: "border-white/10",
      dropdown: "bg-neutral-900 border-white/10 shadow-2xl",
      buttonPrimary: "bg-white text-black hover:bg-neutral-200",
      buttonSecondary: "border border-white/20 text-white hover:bg-white/10",
      addBtn: "bg-amber-500 text-black hover:bg-amber-400"
    },
    light: {
      bg: scrollY > 20 ? "bg-white/95 backdrop-blur-md" : "bg-white",
      text: "text-slate-900",
      hover: "hover:text-blue-600",
      border: "border-slate-200",
      dropdown: "bg-white border-slate-200 shadow-xl",
      buttonPrimary: "bg-black text-white hover:bg-neutral-800",
      buttonSecondary: "border border-slate-300 text-slate-900 hover:bg-slate-50",
      addBtn: "bg-blue-600 text-white hover:bg-blue-700"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const renderBadge = (type) => {
    if (!type) return null;
    const colors = { HOT: "bg-red-500", NEW: "bg-blue-500", TRENDING: "bg-amber-500" };
    return (
      <span className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-black text-white uppercase ${colors[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${currentTheme.bg} border-b ${currentTheme.border}`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrollY > 20 ? 'h-16 lg:h-20' : 'h-20 lg:h-24'}`}>
            
            {/* 1. LOGO */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <img 
                  src={navbarlogo} 
                  alt="Logo" 
                  className={`${scrollY > 20 ? 'h-10 lg:h-14 w-32 lg:w-40' : 'h-12 lg:h-18 w-36 lg:w-48'} object-contain transition-all duration-300`} 
                />
              </Link>
            </div>


            {/* 2. DESKTOP CENTER NAVIGATION */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
              {commonNavigation.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className={`group relative text-sm font-bold tracking-tight ${currentTheme.text} ${currentTheme.hover} transition-all`}
                >
                  {item.name} {renderBadge(item.badge)}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-current transition-all group-hover:w-full" />
                </Link>
              ))}
              {/* {isAuthenticated && (
                <Link 
                  to="/getPropertyshell"
                  className={`flex items-center gap-2 px-3 lg:px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg ${currentTheme.text}  ${currentTheme.hover}`}
                >
                  <PlusCircle size={18} />
                  <span className="hidden xl:inline">My Property</span>
                </Link>
              )} */}

              {/* MENUS DROPDOWN */}
              <div 
                className="relative" 
                onMouseEnter={() => setOpenDropdown("menus")} 
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className={`flex items-center gap-1 text-sm font-extrabold uppercase tracking-widest ${currentTheme.text} ${currentTheme.hover}`}>
                  Menus <ChevronDownIcon className={`h-3 w-3 transition-transform ${openDropdown === 'menus' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === "menus" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                      className={`absolute right-0 mt-4 w-72 rounded-2xl border p-2 z-[110] ${currentTheme.dropdown}`}
                    >
                      <div className="grid grid-cols-1">
                        {sidebarLinks.map((item) => (
                          <Link 
                            key={item.name} 
                            to={item.href} 
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-bold tracking-widest ${currentTheme.text} hover:bg-white/5 transition-colors`}
                          >
                            {item.name} {renderBadge(item.badge)}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* 3. RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-2 lg:gap-5">
              
              {/* Add Property Button */}
              {isAuthenticated && (
                <Link 
                  to="/userpropertyregister" 
                  className={`flex items-center gap-2 px-3 lg:px-5 py-2 rounded-full text-xs font-bold transition-all shadow-lg ${currentTheme.addBtn}`}
                >
                  <PlusCircle size={18} />
                  <span className="hidden xl:inline">Add Property</span>
                </Link>
              )}

              {/* Theme Toggle */}
              <button onClick={toggleTheme} className={`${currentTheme.text} p-2 transition-transform hover:scale-110`}>
                {isDark ? <SunIcon size={20} className="text-amber-400" /> : <MoonIcon size={20} />}
              </button>

              {/* User Profile / Auth */}
              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={`px-4 lg:px-5 py-2 lg:py-2.5 text-xs font-bold rounded-full transition-all ${currentTheme.buttonSecondary}`}>
                    Login
                  </Link>
                  <Link to="/signup" className={`px-4 lg:px-6 py-2 lg:py-2.5 text-xs font-black rounded-full uppercase tracking-tighter transition-all shadow-lg ${currentTheme.buttonPrimary}`}>
                    Join
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                    className={`flex items-center gap-2 p-1 pr-2 lg:pr-4 rounded-full border ${currentTheme.border} hover:bg-white/5 transition-all`}
                  >
                    <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black text-xs font-black">
                      {user?.firstname?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className={`hidden xl:block text-sm font-bold ${currentTheme.text}`}>{user?.firstname}</span>
                    <ChevronDownIcon className={`h-3 w-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        className={`absolute right-0 mt-3 w-64 rounded-2xl border p-2 z-[110] ${currentTheme.dropdown}`}
                      >
                        <div className="px-4 py-3 border-b border-white/10 mb-2">
                          <p className="text-[10px] font-bold uppercase opacity-50 tracking-[0.2em]">Profile</p>
                          <p className={`text-sm font-bold truncate ${currentTheme.text}`}>{user?.email}</p>
                        </div>
                        
                        {user.role !== "user" && (
                          <Link 
                            to={user.role === "admin" ? "/admin-dashboard" : "/agent-dashboard"} 
                            onClick={() => setIsProfileOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${currentTheme.text} hover:bg-white/5`}
                          >
                            <LayoutDashboard size={18} className="text-amber-500" /> Dashboard
                          </Link>
                        )}
                        
                        <Link 
                          to="/user-profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium ${currentTheme.text} hover:bg-white/5`}
                        >
                          <Settings size={18} className="opacity-60" /> Account Settings
                        </Link>

                        <div className="my-2 border-t border-white/5" />
                        
                        <button 
                          onClick={handleLogout} 
                          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 lg:hidden rounded-xl border ${currentTheme.border} ${currentTheme.text}`}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed inset-0 z-[200] lg:hidden flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}
          >
            <div className={`flex items-center justify-between p-6 border-b ${currentTheme.border}`}>
              <img src={navbarlogo} alt="Logo" className="h-10 object-contain" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <XMarkIcon className="h-8 w-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <p className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em] mb-4">Navigation</p>
              {commonNavigation.map((link) => (
                <Link 
                  key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/5 text-lg font-bold"
                >
                  {link.name} {renderBadge(link.badge)} <ChevronRight size={18} className="opacity-30" />
                </Link>
              ))}

              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase opacity-40 tracking-[0.2em] mb-4">Explore More</p>
                <div className="grid grid-cols-1 gap-2">
                  {sidebarLinks.map((link) => (
                    <Link 
                      key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-bold"
                    >
                      {link.name} {renderBadge(link.badge)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <div className={`p-6 border-t ${currentTheme.border} bg-inherit grid grid-cols-2 gap-4`}>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 text-center rounded-2xl font-bold ${currentTheme.buttonSecondary}`}>Login</Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 text-center rounded-2xl font-bold ${currentTheme.buttonPrimary}`}>Join Now</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}