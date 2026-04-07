import React, { useState, useContext, useEffect, useRef } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext"; 
import { 
  MoonIcon, 
  SunIcon, 
  LogOut, 
  PlusCircle,
  ChevronRight,
  Settings,
  Menu as MenuLucide 
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navbarlogo } from "../../ExportImages";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarLinks, commonNavigation } from "../../helpers/NavbarHelpers";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logoutUser, user, isAuthenticated } = useContext(AuthContext);
  const { toggleSidebar } = useSidebar(); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef();
  const isDark = theme === "dark";

  const showSidebarToggle = isAuthenticated && user?.role !== "user";
  const showFullMenus = !isAuthenticated || user?.role === "user";

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

  // REPLACED: Removed scroll-based conditional logic
  const currentTheme = {
    bg: isDark ? "bg-black" : "bg-white",
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
      {/* FIXED: Removed transition-all duration-500 and sticky scroll logic */}
      <nav className={`sticky top-0 z-[50] ${currentTheme.bg} border-b ${currentTheme.border}`}>
        <div className="max-w-[1700px] mx-auto px-4 md:px-8">
          {/* FIXED: Height is now constant at h-20 */}
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              {showSidebarToggle && (
                <button 
                  onClick={toggleSidebar} 
                  className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors ${currentTheme.text}`}
                >
                  <MenuLucide size={22} />
                </button>
              )}
              <Link to="/">
                {/* FIXED: Logo size is now constant */}
                <img src={navbarlogo} alt="Logo" className="h-16 w-16 md:h-24 md:w-24 object-contain" />
              </Link>
            </div>
            
            <div className="hidden xl:flex items-center space-x-5">
              {showFullMenus && (
                <>
                  {commonNavigation.map((item) => (
                    <Link key={item.name} to={item.href} className={`text-[11px] font-black tracking-widest uppercase ${currentTheme.text} hover:opacity-60 transition-all`}>
                      {item.name} {renderBadge(item.badge)}
                    </Link>
                  ))}
                  <div className="relative" onMouseEnter={() => setOpenDropdown("menus")} onMouseLeave={() => setOpenDropdown(null)}>
                    <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${currentTheme.text}`}>
                      Resources <ChevronDownIcon className="h-3 w-3" />
                    </button>
                    <AnimatePresence>
                      {openDropdown === "menus" && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }} 
                          className={`absolute left-0 mt-4 w-64 rounded-2xl border p-2 ${currentTheme.dropdown}`}
                        >
                          {sidebarLinks.map((item) => (
                            <Link key={item.name} to={item.href} className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-bold ${currentTheme.text} hover:bg-black/5 dark:hover:bg-white/5`}>
                              {item.name} {renderBadge(item.badge)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {showFullMenus && isAuthenticated && (
                <Link to="/userpropertyregister" className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${currentTheme.addBtn}`}>
                  <PlusCircle size={14} /> Add Listing
                </Link>
              )}

              <button onClick={toggleTheme} className={`${currentTheme.text} p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors`}>
                {isDark ? <SunIcon size={20} className="text-amber-400" /> : <MoonIcon size={20} />}
              </button>

              {!isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase rounded-full border ${currentTheme.border} ${currentTheme.text} hover:bg-slate-50 dark:hover:bg-white/5 transition-colors`}>
                    Login
                  </Link>
                  <Link to="/signup" className={`px-4 md:px-6 py-2 text-[10px] font-black uppercase rounded-full bg-amber-500 text-black shadow-lg  transition-all`}>
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={profileDropdownRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)} 
                    className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs ring-2 ring-white/10 hover:scale-105 transition-transform"
                  >
                    {user?.firstname?.charAt(0).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                        className={`absolute right-0 mt-3 w-64 rounded-2xl border p-2 z-[110] ${currentTheme.dropdown}`}
                      >
                        <div className="px-4 py-3 border-b border-black/5 dark:border-white/10 mb-2">
                          <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">{user?.role} Account</p>
                          <p className={`text-sm font-bold truncate ${currentTheme.text}`}>{user?.email}</p>
                        </div>
                        <Link to="/user-profile" className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold ${currentTheme.text} hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}>
                          <Settings size={18}/> Settings
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={18}/> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {showFullMenus && (
                <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden p-1.5 ml-1">
                  <Bars3Icon className={`h-8 w-8 ${currentTheme.text}`} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY REMAINS THE SAME */}
      <AnimatePresence>
        {isMobileMenuOpen && showFullMenus && (
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "tween", duration: 0.3 }}
            className={`fixed inset-0 z-[200] flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}
          >
            <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <img src={navbarlogo} alt="Logo" className="h-8" />
                <button onClick={toggleTheme} className="p-2 border rounded-full border-current opacity-30">
                   {isDark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
                </button>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <XMarkIcon className="h-9 w-9" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-3 ml-2">Main Menu</p>
                <div className="flex flex-col gap-2">
                  {commonNavigation.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-xs font-bold flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95 ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center">{link.name} {renderBadge(link.badge)}</span>
                      <ChevronRight size={18} className="opacity-20" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4 mt-6 ml-2">Discover More</p>
                <div className="grid grid-cols-1 gap-2">
                  {sidebarLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      to={link.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-xs font-bold flex items-center justify-between p-4 rounded-2xl transition-all active:scale-95 ${
                        isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center">{link.name} {renderBadge(link.badge)}</span>
                      <ChevronRight size={14} className="opacity-20"/>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-6 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              {!isAuthenticated ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`py-4 text-center rounded-2xl font-black uppercase text-[10px] border ${currentTheme.border}`}>Login</Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="py-4 bg-amber-400 text-white text-center rounded-2xl font-black uppercase text-[10px]">Sign Up</Link>
                </div>
              ) : (
                <Link to="/userpropertyregister" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-amber-500 text-black text-center rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
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