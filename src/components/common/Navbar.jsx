import { useState, useContext, useEffect, useRef } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline"; // Added Chevron
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

  // REAL ESTATE PREMIUM THEME PALETTE
  const themeClasses = {
    dark: {
      bg: scrollY > 20 ? "bg-gray-950/80 backdrop-blur-xl" : "bg-transparent",
      text: "text-slate-200",
      hover: "hover:bg-white/10 hover:text-white",
      border: scrollY > 20 ? "border-white/10" : "border-transparent",
      dropdown: "bg-gray-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10",
      button: "bg-white/5 hover:bg-white/10 text-slate-200",
      accentButton: "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20",
      profileText: "text-slate-400",
      divider: "border-white/5",
      shadow: scrollY > 20 ? "shadow-2xl" : "",
      glow: "shadow-blue-500/10"
    },
    light: {
      bg: scrollY > 20 ? "bg-white/80 backdrop-blur-xl" : "bg-transparent",
      text: "text-slate-700",
      hover: "hover:bg-slate-100/80 hover:text-slate-900",
      border: scrollY > 20 ? "border-slate-200/60" : "border-transparent",
      dropdown: "bg-white/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-slate-200/60",
      button: "bg-slate-100 hover:bg-slate-200 text-slate-700",
      accentButton: "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-200",
      profileText: "text-slate-500",
      divider: "border-slate-100",
      shadow: scrollY > 20 ? "shadow-sm" : "",
      glow: "shadow-slate-300"
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

  useEffect(() => {
    function handleClickOutside(event) {
      const isOutsideDropdown = Object.values(dropdownRefs.current).every(ref =>
        ref && !ref.contains(event.target)
      );
      const isOutsideProfile = profileDropdownRef.current && !profileDropdownRef.current.contains(event.target);

      if (isOutsideDropdown && isOutsideProfile) {
        setIsProfileOpen(false);
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.3 } },
  };

  return (
    <Disclosure as="nav" className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${currentTheme.bg} ${currentTheme.shadow} border-b ${currentTheme.border}`}>
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`flex items-center justify-between transition-all duration-300 ${scrollY > 20 ? 'h-16' : 'h-20'}`}>
              
              {/* BRAND LOGO */}
              <motion.div whileHover={{ scale: 1.02 }} className="flex-shrink-0">
                <Link to="/">
                    <img
                      src={navbarlogo}
                      alt="Logo"
                      className="h-9 w-auto object-contain"
                    />
                </Link>
              </motion.div>

              {/* DESKTOP MENU */}
              <div className="hidden md:flex items-center justify-center flex-1 ml-10">
                <div className="flex items-center space-x-1">
                  {navigation.map((item) => (
                    <div
                      key={item.name}
                      className="relative"
                      ref={item.dropdown ? el => dropdownRefs.current[item.name] = el : null}
                    >
                      {item.dropdown ? (
                        <div onMouseEnter={() => setOpenDropdown(item.name)} onMouseLeave={() => setOpenDropdown(null)}>
                          <button
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[15px] font-medium transition-all ${currentTheme.text} ${currentTheme.hover}`}
                          >
                            {item.name}
                            <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {openDropdown === item.name && (
                              <motion.div
                                variants={dropdownVariants}
                                initial="hidden" animate="visible" exit="hidden"
                                className={`absolute left-0 mt-2 w-72 rounded-3xl border p-2 z-50 ${currentTheme.dropdown}`}
                              >
                                {item.dropdown.map((subItem, idx) => (
                                  <motion.button
                                    key={subItem.name}
                                    onClick={() => { setOpenDropdown(null); navigate(subItem.href); }}
                                    className={`w-full text-left flex items-start gap-4 p-3 rounded-2xl transition-all ${currentTheme.hover} group`}
                                  >
                                    <div className={`mt-0.5 p-2 rounded-xl transition-colors ${currentTheme.button} group-hover:bg-blue-600 group-hover:text-white`}>
                                      <subItem.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-sm leading-none mb-1">{subItem.name}</div>
                                      <div className={`text-xs leading-tight ${currentTheme.profileText}`}>
                                        {subItem.description}
                                      </div>
                                    </div>
                                  </motion.button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          to={item.href}
                          className={`flex items-center px-4 py-2 rounded-full text-[15px] font-medium transition-all ${currentTheme.text} ${currentTheme.hover}`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE ACTIONS */}
              <div className="flex items-center gap-2 lg:gap-4">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-all ${currentTheme.hover} ${currentTheme.text}`}
                >
                  {theme === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} className="text-yellow-400" />}
                </button>

                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {user.role === "user" && (
                      <Link to="/userpropertyregister" className="hidden lg:block">
                        <button className={`px-5 py-2.5 text-sm font-bold text-white rounded-full transition-all ${currentTheme.accentButton}`}>
                          Sell Property
                        </button>
                      </Link>
                    )}
                    
                    <div className="relative" ref={profileDropdownRef}>
                      <button onClick={toggleProfileDropdown} className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200/50 hover:bg-slate-50 transition-all">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-md">
                          {user?.name?.charAt(0)}
                        </div>
                        <span className={`hidden lg:block text-sm font-semibold ${currentTheme.text}`}>Account</span>
                      </button>
                      
                      {/* Standard Profile Dropdown items remain here inside AnimatePresence... */}
                    </div>
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    <Link to="/login" className={`px-5 py-2.5 text-sm font-semibold ${currentTheme.text}`}>Login</Link>
                    <Link to="/signup" className={`px-6 py-2.5 text-sm font-bold text-white rounded-full transition-all ${currentTheme.accentButton}`}>
                      Signup
                    </Link>
                  </div>
                )}

                {/* MOBILE TOGGLE */}
                <div className="md:hidden">
                  <Disclosure.Button className={`p-2 rounded-xl ${currentTheme.text}`}>
                    {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE PANEL (Slide out style) */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel static as={motion.div} variants={mobileMenuVariants} initial="hidden" animate="visible" exit="hidden"
                className={`fixed inset-y-0 right-0 w-full max-w-xs z-50 ${currentTheme.bg} shadow-2xl border-l ${currentTheme.border} md:hidden`}
              >
                <div className="flex flex-col h-full p-6">
                  <div className="flex items-center justify-between mb-8">
                     <img src={navbarlogo} alt="Logo" className="h-8 w-auto" />
                     <Disclosure.Button className={currentTheme.text}><XMarkIcon className="h-6 w-6" /></Disclosure.Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {item.dropdown ? (
                          <div className="space-y-1">
                            <div className={`px-4 py-3 text-lg font-bold ${currentTheme.text}`}>{item.name}</div>
                            {item.dropdown.map(sub => (
                              <button key={sub.name} onClick={() => navigate(sub.href)} className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl ${currentTheme.hover} ${currentTheme.text}`}>
                                <sub.icon className="h-5 w-5 opacity-70" />
                                <span className="text-[15px]">{sub.name}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <Link to={item.href} className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold ${currentTheme.text} ${currentTheme.hover}`}>
                            {item.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isAuthenticated && (
                    <div className="pt-6 border-t border-slate-200 mt-auto flex flex-col gap-3">
                       <Link to="/login" className={`w-full py-4 text-center rounded-2xl font-bold ${currentTheme.button}`}>Login</Link>
                       <Link to="/signup" className={`w-full py-4 text-center rounded-2xl font-bold text-white ${currentTheme.accentButton}`}>Get Started</Link>
                    </div>
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