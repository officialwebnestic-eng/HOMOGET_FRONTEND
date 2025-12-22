import { useState, useContext, useEffect, useRef } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon, BellIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import {
  Home,
  Image,
  Info,
  Mail,
  FileText,
  Building,
  Calendar,
  Users,
  ShoppingCart,
  Sparkles,
  Bot,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navbarlogo } from "../../ExportImages";
import { useSidebar } from "../../context/SidebarContext";


const commonNavigation = [
  { name: "Home", href: "/", icon: Home, current: true },
  { name: "Gallery", href: "/gallery", icon: Image, current: true },
  { name: "AboutUs", href: "/about", icon: Info, current: true },
  { name: "ContactUs", href: "/contactus", icon: Mail, current: true },
  {
    name: "Information",
    href: "#",
    icon: Info,
    current: false,
    dropdown: [
      { name: "Blogs", href: "/blog", icon: FileText, description: "Latest news and insights" },
      { name: "Testimonials", href: "/testimonials", icon: Building, description: "See what our clients say" },
      { name: "Appointment", href: "/selectappoinmentproperty", icon: Calendar, description: "Book a site visit or meeting" },
      { name: "HelpLine", href: "/helpcenter", icon: Mail, description: "Get support and FAQs" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    icon: Sparkles,
    current: false,
    dropdown: [
      { name: "Property Listing", href: "/propertylisting", icon: Building, description: "List your property" },
      { name: "Agent Support", href: "/agentsupport", icon: Users, description: "Get expert help" },
      { name: "Schedule Visit", href: "/selectappoinmentproperty", icon: Calendar, description: "Book appointments" },
      { name: "Legal Support", href: "/documentationsupport", icon: FileText, description: "Documentation help" },
      { name: "Home Loan", href: "/homeloanrequestform", icon: ShoppingCart, description: "Financing options" },
      { name: "Virtual Tours", href: "/walkthrough", icon: Bot, description: "3D property views" },
    ],
  },
];

const authenticatedNavigation = [
  { name: "MyProperties", href: "/getPropertyshell", icon: Building, current: true },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { logoutUser, user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRefs = useRef({});
  const profileDropdownRef = useRef();
  const { isOpen } = useSidebar();


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  ``

  const themeClasses = {
    dark: {
      bg: scrollY > 50 ? "bg-gray-900/98 backdrop-blur-xl" : "bg-gray-900/95 backdrop-blur-lg",
      text: "text-gray-100",
      hover: "hover:bg-gray-800/80 hover:text-white",
      border: "border-gray-700/50",
      dropdown: "bg-gray-800/98 backdrop-blur-xl shadow-2xl",
      button: "bg-gray-700/80 hover:bg-gray-600 text-gray-100",
      accentButton: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl",
      profileText: "text-gray-200",
      divider: "border-gray-600/50",
      shadow: "shadow-xl shadow-gray-900/20",
      glow: "shadow-blue-500/20"
    },
    light: {
      bg: scrollY > 50 ? "bg-white/98 backdrop-blur-xl" : "bg-white/95 backdrop-blur-lg",
      text: "text-gray-700",
      hover: "hover:bg-gray-50/80 hover:text-gray-900",
      border: "border-gray-200/50",
      dropdown: "bg-white/98 backdrop-blur-xl shadow-2xl",
      button: "bg-gray-50/80 hover:bg-gray-100 text-gray-700",
      accentButton: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl",
      profileText: "text-gray-600",
      divider: "border-gray-200/50",
      shadow: "shadow-xl shadow-gray-200/20",
      glow: "shadow-blue-500/20"
    }
  };


  const currentTheme = themeClasses[theme] || themeClasses.light;

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) return commonNavigation;
    if (user.role === "user") return [...commonNavigation, ...authenticatedNavigation];
    return [];
  };

  const navigation = getNavigationItems();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  // Detect outside clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Check all dynamic dropdown refs ('Information' and 'Services')
      const isOutsideDropdown = Object.values(dropdownRefs.current).every(ref =>
        ref && !ref.contains(event.target)
      );

      // Check profile dropdown ref
      const isOutsideProfile = profileDropdownRef.current && !profileDropdownRef.current.contains(event.target);

      if (isOutsideDropdown && isOutsideProfile) {
        setIsProfileOpen(false);
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-500 ${currentTheme.bg} ${currentTheme.border} ${currentTheme.shadow} border-b`}>
      {({ open }) => (
        <>

          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            {/* Main flex container */}
            <div className="flex h-16 lg:h-20 items-center justify-between relative">

              {/* Logo / Brand - Mobile & Desktop */}
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center flex-shrink-0">
                <Link to="/">
                  <div className={`rounded-lg flex items-center justify-center transition-all duration-300 ${isOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"} ${isOpen ? "w-0 overflow-hidden" : "w-30"} lg:w-auto`}>
                    <img
                      src={navbarlogo}
                      alt="Company Logo"
                      className="h-auto w-24 md:w-30 lg:w-30 object-contain"
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation & CTA Wrapper */}
              <div className="hidden md:flex items-center justify-center flex-1">
                {/* Navigation Links */}
                <div className="flex items-center space-x-2 lg:space-x-4">
                  {navigation.map((item) => (
                    <div
                      key={item.name}
                      className="relative group"
                      // Assign ref dynamically for each dropdown
                      ref={item.dropdown ? el => dropdownRefs.current[item.name] = el : null}
                    >
                      {item.dropdown ? (
                        <>
                          {/* Dropdown Button */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => toggleDropdown(item.name)}
                            className={`flex items-center px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-200 ${currentTheme.hover} ${currentTheme.text} relative group`}
                          >
                            <item.icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                            {item.name}
                            {/* Arrow icon */}
                            <motion.svg
                              animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                            {/* underline effect */}
                            <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                          </motion.button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {openDropdown === item.name && (
                              <motion.div
                                variants={dropdownVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className={`absolute left-0 mt-2 w-64 rounded-2xl ${currentTheme.dropdown} ${currentTheme.border} py-2 z-50 border`}
                              >
                                {/* Dropdown Header */}
                                <div className="px-3 py-2">
                                  <h3 className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.profileText} mb-2`}>
                                    {item.name === 'Services' ? 'Our Services' : 'Useful Info'}
                                  </h3>
                                </div>
                                {/* Sub Items */}
                                {item.dropdown.map((subItem, subIndex) => (
                                  <motion.button
                                    key={subItem.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIndex * 0.05 }}
                                    whileHover={{ x: 4, backgroundColor: currentTheme.hover.includes('gray-800') ? 'rgba(75, 85, 99, 0.8)' : 'rgba(243, 244, 246, 0.8)' }}
                                    onClick={() => { setOpenDropdown(null); navigate(subItem.href); }}
                                    className={`w-full text-left flex items-center px-4 py-3 text-sm transition-all duration-200 ${currentTheme.text} group`}
                                  >
                                    <div className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${currentTheme.button} group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white`}>
                                      <subItem.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{subItem.name}</div>
                                      <div className={`text-xs ${currentTheme.profileText}`}>
                                        {subItem.description}
                                      </div>
                                    </div>
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        // Direct link
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link
                            to={item.href}
                            className={`flex items-center px-3 lg:px-4 py-2 rounded-xl text-sm lg:text-base font-medium transition-all duration-200 ${currentTheme.hover} ${currentTheme.text} relative group`}
                          >
                            <item.icon className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                            {item.name}
                            {/* underline effect */}
                            <div className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA Button for user role */}
                {isAuthenticated && user.role === "user" && (
                  <div className="hidden lg:block ml-8 flex-shrink-0">
                    <NavLink to="/userpropertyregister">
                      <button
                        className={`px-6 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 ${currentTheme.accentButton} ${currentTheme.glow} transform hover:-translate-y-0.5`}
                      >
                        <span className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span>Sell Property</span>
                        </span>
                      </button>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Right icons & profile */}
              <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
                {/* Theme toggle */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${currentTheme.hover} group`}
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait">
                    {theme === "light" ? (
                      <motion.div key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                        <MoonIcon className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div key="sun" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                        <SunIcon className="h-5 w-5 text-yellow-400 group-hover:text-yellow-300" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Notification Bell with badge */}
                {isAuthenticated && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${currentTheme.hover} relative group`}
                    aria-label="Notifications"
                  >
                    <BellIcon className="h-5 w-5" />
                    {/* Notification Badge & Ping (Example) */}
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full animate-ping" />
                  </motion.button>
                )}

                {/* Profile Avatar & Dropdown */}
                {isAuthenticated ? (
                  <div className="relative" ref={profileDropdownRef}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={toggleProfileDropdown}
                      className={`flex items-center space-x-2 p-1.5 rounded-xl transition-all duration-200 ${currentTheme.hover} group`}
                    >
                      {/* Avatar with initials */}
                      <div className="relative">
                        <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                          {user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                        </div>
                        {/* Online status indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 rounded-full border-2 border-white" />
                      </div>
                      {/* User name & role (hidden on small screens) */}
                      <div className="hidden lg:block text-left">
                        <div className={`text-sm font-semibold ${currentTheme.text}`}>{user?.name || "User"}</div>
                        <div className={`text-xs ${currentTheme.profileText}`}>{user?.role || "Member"}</div>
                      </div>
                    </motion.button>

                    {/* Profile Dropdown Menu */}
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className={`absolute right-0 mt-2 w-60 md:w-64 rounded-2xl ${currentTheme.dropdown} ${currentTheme.border} py-2 z-50 border`}
                        >
                          {/* Profile Header */}
                          <div className={`px-4 py-3 border-b ${currentTheme.divider}`}>
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0).toUpperCase() || <User className="h-6 w-6" />}
                              </div>
                              <div>
                                <div className={`font-semibold ${currentTheme.text}`}>{user?.name || "User"}</div>
                                <div className={`text-sm ${currentTheme.profileText} truncate`}>{user?.email || ""}</div>
                              </div>
                            </div>
                          </div>

                          {/* Profile Links */}
                          <div className="py-2">
                            {[
                              { to: "/user-profile", icon: User, label: "Profile", desc: "View your profile" },
                              { to: "/settings", icon: Settings, label: "Settings", desc: "Account settings" },
                              { to: "/viewallbookings", icon: ShoppingCart, label: "Orders", desc: "Your bookings" },
                            ].map((item, index) => (
                              <motion.div key={item.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                                <Link
                                  to={item.to}
                                  onClick={() => setIsProfileOpen(false)}
                                  className={`flex items-center px-4 py-3 text-sm transition-all duration-200 ${currentTheme.hover} ${currentTheme.text} group`}
                                >
                                  <div className={`p-2 rounded-lg mr-3 transition-colors duration-200 ${currentTheme.button} group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white`}>
                                    <item.icon className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{item.label}</div>
                                    <div className={`text-xs ${currentTheme.profileText}`}>{item.desc}</div>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>

                          {/* Logout Button */}
                          <div className={`border-t ${currentTheme.divider} pt-2`}>
                            <motion.button
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              onClick={handleLogout}
                              className={`flex items-center w-full px-4 py-3 text-sm transition-all duration-200 ${currentTheme.hover} text-red-600 hover:text-red-500 group`}
                            >
                              {/* Logout Icon */}
                              <div className="p-2 rounded-lg mr-3 transition-colors duration-200 bg-red-50 group-hover:bg-red-500 group-hover:text-white">
                                <LogOut className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">Sign out</div>
                                <div className="text-xs text-red-400">Logout from account</div>
                              </div>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Login & Signup Buttons
                  <div className="hidden sm:flex space-x-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link to="/login" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentTheme.button}`}>
                        Login
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link to="/signup" className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-300 ${currentTheme.accentButton} ${currentTheme.glow}`}>
                        Signup
                      </Link>
                    </motion.div>
                  </div>
                )}

                {/* Mobile menu toggle button */}
                <div className="md:hidden">
                  <Disclosure.Button className={`p-2.5 rounded-xl transition-all duration-200 ${currentTheme.hover}`}>
                    <AnimatePresence mode="wait">
                      {open ? (
                        <motion.div
                          key="close"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.15 }}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Bars3Icon className="h-6 w-6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel
                as={motion.div}
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="md:hidden overflow-hidden"
              >
                <div className={`px-4 py-4 space-y-2 ${currentTheme.bg} border-t ${currentTheme.border}`}>
                  {navigation.map((item) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.indexOf(item) * 0.1 }}
                    >
                      {/* Dropdown in mobile menu */}
                      {item.dropdown ? (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${currentTheme.hover} ${currentTheme.text}`}
                          >
                            <div className="flex items-center">
                              <item.icon className="h-5 w-5 mr-3" />
                              {item.name}
                            </div>
                            {/* Arrow for dropdown */}
                            <motion.svg
                              animate={{ rotate: openDropdown === item.name ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </button>
                          {/* Dropdown items */}
                          {openDropdown === item.name && (
                            <motion.div
                              variants={mobileMenuVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="ml-4 mt-2 space-y-1 overflow-hidden"
                            >
                              {item.dropdown.map((subItem, subIndex) => (
                                <motion.button
                                  key={subItem.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: subIndex * 0.05 }}
                                  onClick={() => { setOpenDropdown(null); navigate(subItem.href); }}
                                  className={`flex items-center w-full rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 ${currentTheme.hover} ${currentTheme.text}`}
                                >
                                  <div className={`p-2 rounded-lg mr-3 ${currentTheme.button}`}>
                                    <subItem.icon className="h-4 w-4" />
                                  </div>
                                  {subItem.name}
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </>
                      ) : (
                        // Simple link
                        <Link
                          to={item.href}
                          className={`flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${currentTheme.hover} ${currentTheme.text}`}
                        >
                          <item.icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  {/* Mobile CTA for user role */}
                  {isAuthenticated && user.role === "user" && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navigation.length * 0.1 }} className="pt-4">
                      <NavLink to="/userpropertyregister">
                        <button className={`w-full px-4 py-3 text-white font-semibold rounded-xl transition-all duration-300 ${currentTheme.accentButton} flex items-center justify-center space-x-2`}>
                          <Building className="h-5 w-5" />
                          <span>Sell Property</span>
                        </button>
                      </NavLink>
                    </motion.div>
                  )}

                  {/* Auth buttons for mobile */}
                  {!isAuthenticated && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navigation.length * 0.1 }} className="flex space-x-3 pt-4">
                      <Link to="/login" className={`flex-1 text-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${currentTheme.button}`}>
                        Login
                      </Link>
                      <Link to="/signup" className={`flex-1 text-center px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${currentTheme.accentButton}`}>
                        Signup
                      </Link>
                    </motion.div>
                  )}
                </div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}