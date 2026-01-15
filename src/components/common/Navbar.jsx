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
  Settings,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navbarlogo } from "../../ExportImages";
import { motion, AnimatePresence } from "framer-motion";

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
  const location = useLocation();
  const profileDropdownRef = useRef();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location]);

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

  const currentTheme = {
    bg: scrollY > 20 
      ? (isDark ? "bg-black/90 backdrop-blur-xl" : "bg-white/90 backdrop-blur-xl") 
      : (isDark ? "bg-black" : "bg-white"),
    text: isDark ? "text-white" : "text-slate-900",
    border: isDark ? "border-white/10" : "border-slate-200",
    dropdown: isDark ? "bg-neutral-900 border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl",
    addBtn: isDark ? "bg-amber-500 text-black" : "bg-blue-600 text-white"
  };

  const renderBadge = (type) => {
    if (!type) return null;
    const colors = { HOT: "bg-red-500", NEW: "bg-blue-500", TRENDING: "bg-amber-500" };
    return (
      <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[7px] font-black text-white uppercase ${colors[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${currentTheme.bg} border-b ${currentTheme.border}`}>
        <div className="max-w-[1700px] mx-auto px-4 md:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrollY > 20 ? 'h-16 lg:h-20' : 'h-20 lg:h-24'}`}>
            
            {/* LOGO */}
            <Link to="/" className="flex-shrink-0">
              <img src={navbarlogo} alt="Logo" className={`${scrollY > 20 ? 'h-8 lg:h-10' : 'h-10 lg:h-12'} w-auto transition-all`} />
            </Link>

            {/* DESKTOP LINKS (Hides on smaller screens) */}
            <div className="hidden xl:flex items-center space-x-5">
              {commonNavigation.map((item) => (
                <Link key={item.name} to={item.href} className={`text-[11px] font-black tracking-widest uppercase ${currentTheme.text} hover:opacity-60 transition-all`}>
                  {item.name} {renderBadge(item.badge)}
                </Link>
              ))}
              
              {isAuthenticated && (
                <Link to="/getPropertyshell" className={`text-[11px] font-black tracking-widest uppercase ${currentTheme.text} hover:text-amber-500`}>
                  My Property
                </Link>
              )}

              {/* MENUS DROPDOWN */}
              <div className="relative" onMouseEnter={() => setOpenDropdown("menus")} onMouseLeave={() => setOpenDropdown(null)}>
                <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${currentTheme.text}`}>
                  Menus <ChevronDownIcon className="h-3 w-3" />
                </button>
                <AnimatePresence>
                  {openDropdown === "menus" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-4 w-64 rounded-2xl border p-2 ${currentTheme.dropdown}`}
                    >
                      {sidebarLinks.map((item) => (
                        <Link key={item.name} to={item.href} className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold ${currentTheme.text} hover:bg-white/5`}>
                          {item.name} {renderBadge(item.badge)}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ACTION SECTION */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <Link to="/userpropertyregister" className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${currentTheme.addBtn}`}>
                  <PlusCircle size={14} /> Add Listing
                </Link>
              )}

              <button onClick={toggleTheme} className={`${currentTheme.text} p-2`}>
                {isDark ? <SunIcon size={18} className="text-amber-400" /> : <MoonIcon size={18} />}
              </button>

              {!isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border ${currentTheme.border} ${currentTheme.text}`}>Login</Link>
                  <Link to="/signup" className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Join</Link>
                </div>
              ) : (
                <div className="relative" ref={profileDropdownRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs">
                      {user?.firstname?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute right-0 mt-3 w-64 rounded-2xl border p-2 z-[110] ${currentTheme.dropdown}`}
                      >
                         <div className="px-4 py-3 border-b border-white/10 mb-2">
                          <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Profile</p>
                          <p className={`text-sm font-bold truncate ${currentTheme.text}`}>{user?.email}</p>
                        </div>
                        <Link to="/user-profile" className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${currentTheme.text} hover:bg-white/5`}><Settings size={18}/> Settings</Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10"><LogOut size={18}/> Sign Out</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden p-2">
                <Bars3Icon className={`h-7 w-7 ${currentTheme.text}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* FULL RESPONSIVE MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.3 }}
            className={`fixed inset-0 z-[200] lg:hidden flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <img src={navbarlogo} alt="Logo" className="h-8" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><XMarkIcon className="h-8 w-8" /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Main Menu</p>
                {commonNavigation.map((link) => (
                  <Link key={link.name} to={link.href} className="flex items-center justify-between text-2xl font-black uppercase tracking-tighter">
                    {link.name} {renderBadge(link.badge)} <ChevronRight size={20} className="opacity-20" />
                  </Link>
                ))}
                {isAuthenticated && (
                   <Link to="/getPropertyshell" className="flex items-center justify-between text-2xl font-black uppercase tracking-tighter text-amber-500">
                    My Property <ChevronRight size={20} className="opacity-20" />
                  </Link>
                )}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Resources & Explore</p>
                <div className="grid grid-cols-1 gap-2">
                  {sidebarLinks.map((link) => (
                    <Link key={link.name} to={link.href} className={`text-xs font-bold flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                      {link.name} {renderBadge(link.badge)} <ChevronRight size={14} className="opacity-20"/>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/10">
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className={`py-4 text-center rounded-2xl font-bold border ${currentTheme.border}`}>Login</Link>
                  <Link to="/signup" className={`py-4 text-center rounded-2xl font-black ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Join</Link>
                </div>
              ) : (
                <Link to="/userpropertyregister" className="w-full py-4 bg-amber-500 text-black text-center rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
                   <PlusCircle size={18} /> Add Property
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}