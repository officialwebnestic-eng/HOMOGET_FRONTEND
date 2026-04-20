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
    border: isDark ? "border-white/5" : "border-slate-100",
    dropdown: isDark
      ? "bg-[#161B26] border-white/10 shadow-2xl"
      : "bg-white border-slate-100 shadow-2xl",
    accent: "#ff8a00",
  };

  const megaMenuData = {
    Buy: {
      sections: [
        {
          title: "Residential Sale",
          links: ["Apartments", "Villas", "Townhouses", "Penthouses"],
        },
        {
          title: "Buyer Tools",
          links: ["Mortgage Calculator", "Investment Guide", "Area Guides"],
        },
      ],
      promo: {
        title: "Secure Your Asset",
        subtitle: "Buying Guide",
        color: "bg-[#2D2D6E]",
      },
      footer: [
        { name: "Residential", icon: <Home size={14} /> },
        { name: "Commercial", icon: <Building2 size={14} /> },
      ],
    },
    Rent: {
      sections: [
        {
          title: "Residential Rent",
          links: ["Apartments", "Studios", "Villas", "Short Term"],
        },
        {
          title: "Renter Tools",
          links: ["Rent vs Buy", "Rental Map", "Community Guides"],
        },
      ],
      promo: {
        title: "Find Your Home",
        subtitle: "Rental Insights",
        color: "bg-[#5D46A0]",
      },
      footer: [
        { name: "Find Agent", icon: <MapPin size={14} /> },
        { name: "Short Term", icon: <TrendingUp size={14} /> },
      ],
    },
    "Off-Plan": {
      sections: [
        {
          title: "New Launches",
          links: ["Emaar Projects", "Damac Hills", "Nakheel"],
        },
        {
          title: "Investment",
          links: ["Handover 2026", "Luxury Projects", "Waterfront"],
        },
      ],
      promo: {
        title: "Invest Early",
        subtitle: "High ROI Projects",
        color: "bg-[#ff8a00]",
      },
      footer: [{ name: "Project Map", icon: <MapPin size={14} /> }],
    },
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
        <div className="max-w-[1700px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            {showSidebarToggle && (
              <button
                onClick={toggleSidebar}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[#ff8a00] text-white transition-all"
              >
                <MenuLucide size={20} />
              </button>
            )}
            <Link to="/">
              <img
                src={navbarlogo}
                alt="Logo"
                className="h-25 md:h30 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-7 text-[11px] font-black uppercase tracking-widest ${currentTheme.text} hover:text-[#ff8a00]`}
            >
              Home
            </Link>

            {/* Mega Menus */}
            {Object.keys(megaMenuData).map((key) => (
              <div
                key={key}
                className="relative py-7"
                onMouseEnter={() => setActiveMegaMenu(key)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  className={`px-4 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${currentTheme.text} ${activeMegaMenu === key ? "text-[#ff8a00]" : ""}`}
                >
                  {key}{" "}
                  <ChevronDownIcon
                    className={`h-3 w-3 transition-transform ${activeMegaMenu === key ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {activeMegaMenu === key && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute left-0 top-full w-[700px] rounded-[2.5rem] border overflow-hidden ${currentTheme.dropdown}`}
                    >
                      <div className="p-10 flex gap-10">
                        <div className="flex-1 grid grid-cols-2 gap-8">
                          {megaMenuData[key].sections.map((sec) => (
                            <div key={sec.title}>
                              <h4 className="text-[10px] font-black text-[#ff8a00] uppercase mb-4 tracking-widest border-b border-black/5 pb-2">
                                {sec.title}
                              </h4>
                              <div className="flex flex-col gap-3">
                                {sec.links.map((l) => (
                                  <Link
                                    key={l}
                                    to="/listings"
                                    className={`text-sm font-bold ${currentTheme.text} opacity-60 hover:opacity-100`}
                                  >
                                    {l}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className={`w-48 rounded-3xl p-6 ${megaMenuData[key].promo.color} text-white flex flex-col justify-end shadow-xl`}
                        >
                          <p className="text-[10px] font-black uppercase opacity-60">
                            {megaMenuData[key].promo.subtitle}
                          </p>
                          <p className="text-lg font-black leading-tight">
                            {megaMenuData[key].promo.title}
                          </p>
                        </div>
                      </div>
                      <div className="bg-black/5 p-4 flex items-center gap-3 border-t border-black/5">
                        {megaMenuData[key].footer.map((f) => (
                          <button
                            key={f.name}
                            className="px-4 py-2 bg-white dark:bg-white/10 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-black/5 hover:border-[#ff8a00]"
                          >
                            {f.icon} {f.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {/* Resources Dropdown */}
            <div
              className="relative py-7"
              onMouseEnter={() => setActiveMegaMenu("resources")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button
                className={`px-4 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${currentTheme.text} ${activeMegaMenu === "resources" ? "text-[#ff8a00]" : ""}`}
              >
                Resources <ChevronDownIcon className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {activeMegaMenu === "resources" && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute left-0 top-full w-64 rounded-[2rem] border p-3 ${currentTheme.dropdown}`}
                  >
                    {sidebarLinks.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center justify-between px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${currentTheme.text} hover:bg-[#ff8a00] hover:text-white transition-all`}
                      >
                        {item.name} {renderBadge(item.badge)}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/careers"
              className={`px-4 py-7 text-[11px] font-black uppercase tracking-widest ${currentTheme.text} hover:text-[#ff8a00] flex items-center gap-2`}
            >
              Careers{" "}
              <span className="bg-[#ff8a00] text-black text-[7px] px-2 py-0.5 rounded-full font-black">
                HIRING
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all ${isDark ? "text-amber-400 bg-white/5" : "text-slate-600 bg-slate-100"}`}
            >
              {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-7 py-3 text-[10px] font-black uppercase tracking-widest rounded-full bg-[#ff8a00] text-white shadow-lg shadow-orange-500/20"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-10 w-10 rounded-full bg-[#ff8a00] border-2 border-white/20 flex items-center justify-center text-white font-black hover:scale-105 transition-all"
                >
                  {user?.firstname?.charAt(0).toUpperCase()}
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute right-0 mt-4 w-64 rounded-[2.5rem] border p-3 ${currentTheme.dropdown}`}
                    >
                      <div className="px-5 py-4 border-b border-black/5 mb-2">
                        <p className="text-[8px] font-black text-[#ff8a00] uppercase tracking-widest">
                          {user?.role} PRO
                        </p>
                        <p
                          className={`text-sm font-bold truncate ${currentTheme.text}`}
                        >
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/user-profile"
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black tracking-widest ${currentTheme.text} hover:bg-black/5 transition-all`}
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-[11px] font-black text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="xl:hidden p-2 text-current"
            >
              <Bars3Icon className="h-8 w-8" />
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
            className={`fixed inset-0 z-[200] flex flex-col ${isDark ? "bg-[#0a0a0c] text-white" : "bg-white text-[#1a1a1e]"}`}
          >
            <div
              className={`p-8 flex items-center justify-between border-b ${currentTheme.border}`}
            >
              <img src={navbarlogo} alt="Logo" className="h-8" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 bg-red-500/10 text-red-500 rounded-full"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {["Home", "Buy", "Rent", "Off-Plan", "Resources", "Careers"].map(
                (link) => (
                  <Link
                    key={link}
                    to="#"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-xl font-black uppercase tracking-widest ${currentTheme.text} border-b ${currentTheme.border} pb-4`}
                  >
                    {link}
                  </Link>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
