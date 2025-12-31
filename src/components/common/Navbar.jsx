import React, { useState, useContext, useEffect, useRef } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { 
  MoonIcon, 
  SunIcon, 
  LogOut, 
  User, 
  Settings, 
  LayoutDashboard,
  Home,
  Image as ImageIcon,
  Info,
  Mail,
  FileText,
  Building,
  Calendar,
  Users,
  ShoppingCart,
  Sparkles,
  Bot
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import { motion, AnimatePresence } from "framer-motion";

const commonNavigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "AboutUs", href: "/about", icon: Info },
  { name: "ContactUs", href: "/contactus", icon: Mail },
  {
    name: "Information",
    href: "#",
    icon: Info,
    dropdown: [
      { name: "Blogs", href: "/blog", icon: FileText, description: "Latest news and insights" },
      { name: "Testimonials", href: "/testimonials", icon: Building, description: "See what our clients say" },
      { name: "Appointment", href: "/selectappoinmentproperty", icon: Calendar, description: "Book a site visit" },
      { name: "HelpLine", href: "/helpcenter", icon: Mail, description: "Get support and FAQs" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    icon: Sparkles,
    dropdown: [
      { name: "Property Listing", href: "/propertylisting", icon: Building, description: "List your property" },
      { name: "Agent Support", href: "/agentsupport", icon: Users, description: "Get expert help" },
      { name: "Legal Support", href: "/documentationsupport", icon: FileText, description: "Documentation help" },
      { name: "Home Loan", href: "/homeloanrequestform", icon: ShoppingCart, description: "Financing options" },
      { name: "Virtual Tours", href: "/walkthrough", icon: Bot, description: "3D property views" },
    ],
  },
];

const authenticatedNavigation = [
  { name: "MyProperties", href: "/getPropertyshell", icon: Building },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logoutUser, user, isAuthenticated } = useContext(AuthContext);
  const { isOpen, toggleSidebar } = useSidebar();
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const navigate = useNavigate();
  const profileDropdownRef = useRef();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const themeClasses = {
    dark: {
      bg: scrollY > 20 ? "bg-gray-950/90 backdrop-blur-xl" : "bg-gray-950",
      text: "text-slate-200",
      hover: "hover:bg-white/10 hover:text-white",
      border: "border-white/10",
      dropdown: "bg-gray-900 border-white/10 shadow-2xl",
      profileText: "text-slate-400",
      divider: "border-white/5",
      button:"bg-gradient-to-r from-white to-gray-500 hover:shadow-lg transform active:scale-95",
       buttontext:"text-white"
    },
    light: {
      bg: scrollY > 20 ? "bg-white/90 backdrop-blur-xl" : "bg-white",
      text: "text-slate-900",
      hover: "hover:bg-slate-100 hover:text-slate-900",
      border: "border-slate-200",
      dropdown: "bg-white border-slate-200 shadow-xl",
      profileText: "text-slate-500",
      divider: "border-slate-100",
      button:"bg-gradient-to-r from-black to-gray-500 hover:shadow-lg transform active:scale-95",
      buttontext:"text-white"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const handleLogout = async () => {
    await logoutUser();
    setIsProfileOpen(false);
    navigate("/login");
  };

  const navigation = !isAuthenticated 
    ? commonNavigation 
    : (user.role === "user" ? [...commonNavigation, ...authenticatedNavigation] : commonNavigation);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <nav className={`w-full z-40 transition-all duration-300 ${currentTheme.bg} border-b ${currentTheme.border}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrollY > 20 ? 'h-16' : 'h-20'}`}>
          
          {/* LEFT: Toggle Button + Logo */}
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button (Shows for Admin/Agent) */}
            {isAuthenticated && user?.role !== "user" && (
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-xl transition-all ${currentTheme.hover} ${currentTheme.text}`}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

         <Link 
  to={
    user?.role === "admin" 
      ? "/admin-dashboard" 
      : isAuthenticated 
        ? "/agent-dashboard" 
        : "/"
  } 
  className="flex-shrink-0"
>
  <img 
    src={navbarlogo} 
    alt="Logo" 
    className={`
      ${scrollY > 20 ? 'h-8 md:h-25' : 'h-10 md:h-20 lg:h-25'} 
      w-auto object-contain transition-all duration-300
    `} 
  />
</Link>
          </div>

          {/* CENTER: Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative" 
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)} 
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${currentTheme.text} ${currentTheme.hover}`}>
                      {item.name}
                      <ChevronDownIcon className="h-3 w-3" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className={`absolute left-0 mt-2 w-72 rounded-2xl border p-2 z-[60] ${currentTheme.dropdown}`}>
                          {item.dropdown.map((sub) => (
                            <Link key={sub.name} to={sub.href} className={`flex items-start gap-3 p-3 rounded-xl ${currentTheme.hover}`}>
                              <sub.icon className="h-4 w-4 mt-1 text-blue-500" />
                              <div>
                                <div className="font-bold text-sm leading-tight">{sub.name}</div>
                                <div className="text-[11px] opacity-60 leading-tight">{sub.description}</div>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link to={item.href} className={`px-4 py-2 rounded-full text-sm font-medium ${currentTheme.text} ${currentTheme.hover}`}>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-2 rounded-full ${currentTheme.text} ${currentTheme.hover}`}>
              {isDark ? <SunIcon size={20} className="text-yellow-400" /> : <MoonIcon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className={`flex items-center gap-2 p-1 pr-3 rounded-full border ${currentTheme.border} ${currentTheme.hover}`}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user?.firstname?.charAt(0) || <User size={14}/>}
                  </div>
                  <span className={`hidden sm:block text-sm font-bold ${currentTheme.text}`}>{user?.firstname}</span>
                  <ChevronDownIcon className={`h-3 w-3 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className={`absolute right-0 mt-3 w-60 rounded-2xl border p-2 z-[60] ${currentTheme.dropdown}`}>
                      <div className="px-3 py-2 border-b mb-1">
                        <p className="text-[10px] font-bold uppercase opacity-50 tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold truncate">{user?.email}</p>
                      </div>
                      
                      {user.role !== "user" && (
                        <Link to={user.role === "admin" ? "/admin-dashboard" : "/agent-dashboard"} className={`flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium ${currentTheme.hover}`}>
                          <LayoutDashboard size={16} className="text-blue-500" /> Dashboard
                        </Link>
                      )}
                      
                      <Link to="/user-profile" className={`flex items-center gap-3 p-2.5 rounded-xl text-sm font-medium ${currentTheme.hover}`}>
                        <Settings size={16} className="opacity-70" /> Settings
                      </Link>
                      
                      <div className={`my-1 border-t ${currentTheme.divider}`} />
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10">
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-4 py-2 text-sm font-bold ${currentTheme.text}`}>Login</Link>
                <Link to="/signup" className={`px-5 py-2 text-sm font-bold ${currentTheme.buttontext}   ${currentTheme.button} rounded-full transition-colors shadow-lg shadow-blue-500/20`}>
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}