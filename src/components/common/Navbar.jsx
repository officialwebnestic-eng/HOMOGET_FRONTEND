import React, { useState, useContext, useEffect, useRef } from "react";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { MoonIcon, SunIcon, LogOut, ChevronRight, Settings, Menu as MenuLucide, Home, TrendingUp, Building2, MapPin, User, Heart, DollarSign, Calendar } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { navbarlogo } from "../../ExportImages";
import { motion, AnimatePresence } from "framer-motion";
import { sidebarLinks } from "../../helpers/NavbarHelpers";
import ScheduleAppointmentModal from "../../model/ScheduleAppointmentModal";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logoutUser, user, isAuthenticated } = useContext(AuthContext);
  const { toggleSidebar } = useSidebar();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = useRef();
  const isDark = theme === "dark";

  const showSidebarToggle = isAuthenticated && user?.role !== "user";

  const navigateWithFilters = (filters) => {
    navigate("/properties", { state: { filters } });
    setActiveMegaMenu(null);
    setActiveMobileDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleBuyClick = (subCategory = null) => {
    const filters = { offeringType: "Sale", category: "Residential", ...(subCategory && { propertytype: subCategory }) };
    navigateWithFilters(filters);
  };

  const handleRentClick = (subCategory = null) => {
    const filters = { offeringType: "Rent", category: "Residential", ...(subCategory && { propertytype: subCategory }) };
    navigateWithFilters(filters);
  };

  const handleOffPlanClick = (developer = null) => {
    const filters = { category: "Off-Plan", ...(developer && { developerName: developer }) };
    navigateWithFilters(filters);
  };

  const handleCommercialClick = (type = null, offering = "Sale") => {
    const filters = { category: "Commercial", offeringType: offering, ...(type && { propertytype: type }) };
    navigateWithFilters(filters);
  };

  const getNavItems = () => {
    if (!isAuthenticated || user?.role === "user") {
      return ["Home", "About Us", "Buy", "Rent", "Off-Plan", "Resources", "Blogs", "Contact Us"];
    }
     return []
  
  };

  const navItems = getNavItems();

  // Mega menu content
  const buyMenuItems = {
    sections: [
      { title: "Residential Sale", items: ["Apartments", "Villas", "Townhouses", "Penthouses"], action: handleBuyClick },
      { title: "Commercial Sale", items: ["Office Space", "Retail", "Warehouse", "Land"], action: (item) => handleCommercialClick(item, "Sale") }
    ],
    promo: { title: "Secure Your Asset", subtitle: "Buying Guide", bgClass: "bg-[#2D2D6E]", action: () => handleBuyClick() },
    footer: [
      { label: "Residential", icon: <Home size={10} />, action: () => handleBuyClick() },
      { label: "Commercial", icon: <Building2 size={10} />, action: () => handleCommercialClick(null, "Sale") }
    ]
  };

  const rentMenuItems = {
    sections: [
      { title: "Residential Rent", items: ["Apartments", "Studios", "Villas", "Short Term"], action: handleRentClick },
      { title: "Commercial Rent", items: ["Office Space", "Retail", "Warehouse"], action: (item) => handleCommercialClick(item, "Rent") }
    ],
    promo: { title: "Find Your Home", subtitle: "Rental Insights", bgClass: "bg-[#5D46A0]", action: () => handleRentClick() },
    footer: [
      { label: "Find Agent", icon: <MapPin size={10} />, action: () => navigate("/agents") },
      { label: "Short Term", icon: <TrendingUp size={10} />, action: () => handleRentClick("Short Term") }
    ]
  };

  const offplanMenuItems = {
    sections: [
      { title: "New Launches", items: ["Emaar Projects", "Damac Hills", "Nakheel", "Sobha Realty"], action: (item) => handleOffPlanClick(item.split(" ")[0]) },
      { title: "By Handover", items: ["Handover 2025", "Handover 2026", "Handover 2027"], action: (item) => navigateWithFilters({ category: "Off-Plan", deliveryDate: item.split(" ")[1] }) }
    ],
    promo: { title: "Invest Early", subtitle: "High ROI Projects", bgClass: "bg-[#f59e0b]", action: () => handleOffPlanClick() },
    footer: [
      { label: "Project Map", icon: <MapPin size={10} />, action: () => navigate("/project-map") },
      { label: "Payment Plans", icon: <DollarSign size={10} />, action: () => navigateWithFilters({ category: "Off-Plan", hasPaymentPlan: true }) }
    ]
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setActiveMobileDropdown(null);
  }, [location]);

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

  const toggleMobileDropdown = (menuName) => {
    setActiveMobileDropdown(activeMobileDropdown === menuName ? null : menuName);
  };

  const renderBadge = (type) => {
    if (!type) return null;
    const colors = { HOT: "bg-red-500", NEW: "bg-blue-500", TRENDING: "bg-[#f59e0b]" };
    return <span className={`ml-1 px-1 py-0.5 rounded text-[6px] font-black text-white uppercase ${colors[type]}`}>{type}</span>;
  };

  const navLinkClass = "px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer";

  // Desktop dropdown component
  const DesktopDropdown = ({ isOpen, children }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-1 w-[620px] rounded-xl border overflow-hidden shadow-2xl z-50 bg-white dark:bg-[#161B26] border-slate-200 dark:border-white/10"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const SmallDesktopDropdown = ({ isOpen, children }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full left-0 mt-1 w-52 rounded-xl border p-2 z-50 bg-white dark:bg-[#161B26] border-slate-200 dark:border-white/10 shadow-2xl"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile dropdown component
  const MobileDropdown = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-slate-100 dark:border-white/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-[11px] font-bold uppercase tracking-wider"
      >
        {title}
        <ChevronDownIcon className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <nav className={`sticky top-0 z-[100] backdrop-blur-xl ${isDark ? "bg-[#0a0a0c]/95" : "bg-white/95"} border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-4">
            
            {/* Left Section */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {showSidebarToggle && (
                <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-[#f59e0b] text-black transition-all">
                  <MenuLucide size={16} />
                </button>
              )}
              {(user?.role === "user" || !isAuthenticated) && (
                <Link to="/" className="flex-shrink-0">
                  <img src={navbarlogo} alt="Logo" className="h-20 md:h-25 w-auto object-contain" />
                </Link>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-0.5">
                {navItems.map((item) => {
                  if (item === "Home") {
                    return (
                      <Link key={item} to="/" className={navLinkClass}>
                        {item}
                      </Link>
                    );
                  }
                  
                  if (item === "About Us" || item === "Contact Us") {
                    return (
                      <Link key={item} to={item === "About Us" ? "/about-us" : "/contact-us"} className={navLinkClass}>
                        {item}
                      </Link>
                    );
                  }
                  
                  if (item === "Blogs") {
                    return (
                      <Link key={item} to="/blog" className={navLinkClass}>
                        {item}
                        <span className="bg-amber-500 text-black text-[6px] px-1.5 py-0.5 rounded-full font-bold ml-1">NEW</span>
                      </Link>
                    );
                  }
                  
                  if (item === "Buy") {
                    return (
                      <div key={item} className="relative" onMouseEnter={() => setActiveMegaMenu("Buy")} onMouseLeave={() => setActiveMegaMenu(null)}>
                        <button className={`${navLinkClass} ${activeMegaMenu === "Buy" ? "text-amber-500" : ""}`}>
                          Buy <ChevronDownIcon className={`h-2.5 w-2.5 transition-transform ${activeMegaMenu === "Buy" ? "rotate-180" : ""}`} />
                        </button>
                        <DesktopDropdown isOpen={activeMegaMenu === "Buy"}>
                          <div className="p-4 flex gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              {buyMenuItems.sections.map((section, idx) => (
                                <div key={idx}>
                                  <h4 className="text-[9px] font-bold text-amber-500 uppercase mb-2 tracking-wider">{section.title}</h4>
                                  <div className="space-y-1">
                                    {section.items.map((subItem) => (
                                      <button key={subItem} onClick={() => section.action(subItem)} className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors py-1">
                                        {subItem}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={buyMenuItems.promo.action} className="w-36 rounded-lg p-3 bg-[#2D2D6E] text-white flex flex-col justify-end shadow-lg hover:scale-105 transition-transform">
                              <p className="text-[7px] font-bold uppercase opacity-60">{buyMenuItems.promo.subtitle}</p>
                              <p className="text-[11px] font-bold leading-tight mt-0.5">{buyMenuItems.promo.title}</p>
                              <ChevronRight size={12} className="mt-1 opacity-60" />
                            </button>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 p-3 flex gap-2 border-t">
                            {buyMenuItems.footer.map((footerItem, idx) => (
                              <button key={idx} onClick={footerItem.action} className="px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase flex items-center gap-1.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all">
                                {footerItem.icon} {footerItem.label}
                              </button>
                            ))}
                          </div>
                        </DesktopDropdown>
                      </div>
                    );
                  }
                  
                  if (item === "Rent") {
                    return (
                      <div key={item} className="relative" onMouseEnter={() => setActiveMegaMenu("Rent")} onMouseLeave={() => setActiveMegaMenu(null)}>
                        <button className={`${navLinkClass} ${activeMegaMenu === "Rent" ? "text-amber-500" : ""}`}>
                          Rent <ChevronDownIcon className={`h-2.5 w-2.5 transition-transform ${activeMegaMenu === "Rent" ? "rotate-180" : ""}`} />
                        </button>
                        <DesktopDropdown isOpen={activeMegaMenu === "Rent"}>
                          <div className="p-4 flex gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              {rentMenuItems.sections.map((section, idx) => (
                                <div key={idx}>
                                  <h4 className="text-[9px] font-bold text-amber-500 uppercase mb-2 tracking-wider">{section.title}</h4>
                                  <div className="space-y-1">
                                    {section.items.map((subItem) => (
                                      <button key={subItem} onClick={() => section.action(subItem)} className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors py-1">
                                        {subItem}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={rentMenuItems.promo.action} className="w-36 rounded-lg p-3 bg-[#5D46A0] text-white flex flex-col justify-end shadow-lg hover:scale-105 transition-transform">
                              <p className="text-[7px] font-bold uppercase opacity-60">{rentMenuItems.promo.subtitle}</p>
                              <p className="text-[11px] font-bold leading-tight mt-0.5">{rentMenuItems.promo.title}</p>
                              <ChevronRight size={12} className="mt-1 opacity-60" />
                            </button>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 p-3 flex gap-2 border-t">
                            {rentMenuItems.footer.map((footerItem, idx) => (
                              <button key={idx} onClick={footerItem.action} className="px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase flex items-center gap-1.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all">
                                {footerItem.icon} {footerItem.label}
                              </button>
                            ))}
                          </div>
                        </DesktopDropdown>
                      </div>
                    );
                  }
                  
                  if (item === "Off-Plan") {
                    return (
                      <div key={item} className="relative" onMouseEnter={() => setActiveMegaMenu("Off-Plan")} onMouseLeave={() => setActiveMegaMenu(null)}>
                        <button className={`${navLinkClass} ${activeMegaMenu === "Off-Plan" ? "text-amber-500" : ""}`}>
                          Off-Plan <ChevronDownIcon className={`h-2.5 w-2.5 transition-transform ${activeMegaMenu === "Off-Plan" ? "rotate-180" : ""}`} />
                        </button>
                        <DesktopDropdown isOpen={activeMegaMenu === "Off-Plan"}>
                          <div className="p-4 flex gap-4">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              {offplanMenuItems.sections.map((section, idx) => (
                                <div key={idx}>
                                  <h4 className="text-[9px] font-bold text-amber-500 uppercase mb-2 tracking-wider">{section.title}</h4>
                                  <div className="space-y-1">
                                    {section.items.map((subItem) => (
                                      <button key={subItem} onClick={() => section.action(subItem)} className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors py-1">
                                        {subItem}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button onClick={offplanMenuItems.promo.action} className="w-36 rounded-lg p-3 bg-[#f59e0b] text-black flex flex-col justify-end shadow-lg hover:scale-105 transition-transform">
                              <p className="text-[7px] font-bold uppercase opacity-60">{offplanMenuItems.promo.subtitle}</p>
                              <p className="text-[11px] font-bold leading-tight mt-0.5">{offplanMenuItems.promo.title}</p>
                              <ChevronRight size={12} className="mt-1 opacity-60" />
                            </button>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 p-3 flex gap-2 border-t">
                            {offplanMenuItems.footer.map((footerItem, idx) => (
                              <button key={idx} onClick={footerItem.action} className="px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase flex items-center gap-1.5 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all">
                                {footerItem.icon} {footerItem.label}
                              </button>
                            ))}
                          </div>
                        </DesktopDropdown>
                      </div>
                    );
                  }
                  
                  if (item === "Resources") {
                    return (
                      <div key={item} className="relative" onMouseEnter={() => setActiveMegaMenu("resources")} onMouseLeave={() => setActiveMegaMenu(null)}>
                        <button className={`${navLinkClass} ${activeMegaMenu === "resources" ? "text-amber-500" : ""}`}>
                          Resources <ChevronDownIcon className="h-2.5 w-2.5" />
                        </button>
                        <SmallDesktopDropdown isOpen={activeMegaMenu === "resources"}>
                          {sidebarLinks.map((link) => (
                            <Link key={link.name} to={link.href} className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-all" onClick={() => setActiveMegaMenu(null)}>
                              {link.name} {renderBadge(link.badge)}
                            </Link>
                          ))}
                        </SmallDesktopDropdown>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </div>

            {/* Right Section with Schedule Appointment Button */}
         {/* Right Section with Schedule Appointment Button */}
<div className="flex items-center gap-1 sm:gap-2 lg:gap-2 flex-shrink-0">
  
  {/* Schedule Appointment Button - Fully Responsive */}
  <button
    onClick={() => setShowAppointmentModal(true)}
    className="group relative px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-[7px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 overflow-visible flex-shrink-0"
  >
    {/* NEW Badge */}
    <div className="absolute -top-1.5 -right-1 sm:-top-2 sm:-right-2 z-10 overflow-visible">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white text-[4px] sm:text-[6px] md:text-[7px] font-black px-0.5 sm:px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
          NEW
        </div>
      </div>
    </div>

    {/* Icon - hidden on smallest screens */}
    <div className="hidden xs:flex relative">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform"
      >
        <path d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 0V3h3m4.5 0v15H6V3.75a.75.75 0 0 1 .75-.75H6m12 15v.75a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18h12Z" />
      </svg>
    </div>

    {/* Text variations by screen size */}
    <span className="relative tracking-wide whitespace-nowrap hidden sm:inline">
      REQUEST APPOINTMENT
    </span>
    <span className="relative tracking-wide whitespace-nowrap sm:hidden">
      BOOK NOW
    </span>

    {/* Pulse indicator */}
    <div className="hidden sm:flex w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
  </button>

  {/* Theme Toggle */}
  <button 
    onClick={toggleTheme} 
    className={`p-1.5 rounded-full transition-all flex-shrink-0 ${isDark ? "text-amber-400 bg-white/5" : "text-slate-600 bg-slate-100"}`}
  >
    {isDark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
  </button>

  {/* Auth Section */}
  {!isAuthenticated ? (
    <Link to="/login" className="px-3 sm:px-4 py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-500 text-white shadow-md hover:bg-amber-600 transition-all flex-shrink-0 whitespace-nowrap">
      Login
    </Link>
  ) : (
    <div className="relative flex-shrink-0" ref={profileDropdownRef}>
      {/* Profile button */}
      <button 
        onClick={() => setIsProfileOpen(!isProfileOpen)} 
        className="h-7 w-7 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 border-2 border-white/20 flex items-center justify-center text-white font-bold text-[11px] hover:scale-105 transition-all"
      >
        {user?.firstname?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
      </button>
      
      {/* Profile Dropdown */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl border overflow-hidden shadow-2xl bg-white dark:bg-[#161B26] border-slate-200 dark:border-white/10"
            style={{ zIndex: 9999 }}
          >
            <div className="p-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-[11px]">
                  {user?.firstname?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold truncate">{user?.firstname} {user?.lastname}</p>
                  <p className="text-[8px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[6px] font-bold uppercase tracking-wider">
                {user?.role || "USER"}
              </span>
            </div>
            
            <div className="p-1">
              {user?.role === "user" && (
                <>
                  <Link to="/user-profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold hover:bg-amber-500/10 transition-all" onClick={() => setIsProfileOpen(false)}>
                    <User size={12} className="text-amber-500" /> Profile
                  </Link>
                  <Link to="/my-properties" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold hover:bg-amber-500/10 transition-all" onClick={() => setIsProfileOpen(false)}>
                    <Home size={12} className="text-amber-500" /> My Properties
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold hover:bg-amber-500/10 transition-all" onClick={() => setIsProfileOpen(false)}>
                    <Heart size={12} className="text-amber-500" /> Wishlist
                  </Link>
                </>
              )}

              {user?.role !== "user" && (
                <Link to={`/${user?.role?.toLowerCase()}-dashboard`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold hover:bg-amber-500/10 transition-all" onClick={() => setIsProfileOpen(false)}>
                  <Home size={12} className="text-amber-500" /> Dashboard
                </Link>
              )}

              <Link to="/settings" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold hover:bg-amber-500/10 transition-all" onClick={() => setIsProfileOpen(false)}>
                <Settings size={12} className="text-amber-500" /> Settings
              </Link>
              
              <div className="border-t my-1 border-slate-100 dark:border-white/10" />
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-bold text-red-500 hover:bg-red-500/10 transition-all">
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )}

  {/* Mobile Menu Toggle */}
  <button 
    onClick={() => setIsMobileMenuOpen(true)} 
    className="lg:hidden p-1.5 text-current flex-shrink-0"
  >
    <Bars3Icon className="h-6 w-6" />
  </button>
</div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu with Dropdowns */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed inset-0 z-[200] flex flex-col ${isDark ? "bg-[#0a0a0c]" : "bg-white"}`}
          >
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
              <img src={navbarlogo} alt="Logo" className="h-10" />
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full bg-red-500/10 text-red-500">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {/* Home */}
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-white/10">
                Home
              </Link>
              
              {/* About Us */}
              <Link to="/about-us" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-white/10">
                About Us
              </Link>
              
              {/* Buy Dropdown */}
              <MobileDropdown
                title="Buy"
                isOpen={activeMobileDropdown === "Buy"}
                onToggle={() => toggleMobileDropdown("Buy")}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase mb-2">Residential Sale</p>
                      <div className="space-y-1">
                        {buyMenuItems.sections[0].items.map((item) => (
                          <button key={item} onClick={() => handleBuyClick(item)} className="block text-[10px] font-medium py-1 hover:text-amber-500 w-full text-left">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase mb-2">Commercial Sale</p>
                      <div className="space-y-1">
                        {buyMenuItems.sections[1].items.map((item) => (
                          <button key={item} onClick={() => handleCommercialClick(item, "Sale")} className="block text-[10px] font-medium py-1 hover:text-amber-500 w-full text-left">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={buyMenuItems.promo.action} className="mt-2 w-full py-2 rounded-lg bg-[#2D2D6E] text-white text-[9px] font-bold uppercase">
                    {buyMenuItems.promo.title}
                  </button>
                </div>
              </MobileDropdown>
              
              {/* Rent Dropdown */}
              <MobileDropdown
                title="Rent"
                isOpen={activeMobileDropdown === "Rent"}
                onToggle={() => toggleMobileDropdown("Rent")}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase mb-2">Residential Rent</p>
                      <div className="space-y-1">
                        {rentMenuItems.sections[0].items.map((item) => (
                          <button key={item} onClick={() => handleRentClick(item)} className="block text-[10px] font-medium py-1 hover:text-amber-500 w-full text-left">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase mb-2">Commercial Rent</p>
                      <div className="space-y-1">
                        {rentMenuItems.sections[1].items.map((item) => (
                          <button key={item} onClick={() => handleCommercialClick(item, "Rent")} className="block text-[10px] font-medium py-1 hover:text-amber-500 w-full text-left">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={rentMenuItems.promo.action} className="mt-2 w-full py-2 rounded-lg bg-[#5D46A0] text-white text-[9px] font-bold uppercase">
                    {rentMenuItems.promo.title}
                  </button>
                </div>
              </MobileDropdown>
              
              {/* Off-Plan Dropdown */}
              <MobileDropdown
                title="Off-Plan"
                isOpen={activeMobileDropdown === "Off-Plan"}
                onToggle={() => toggleMobileDropdown("Off-Plan")}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase mb-2">New Launches</p>
                      <div className="space-y-1">
                        {offplanMenuItems.sections[0].items.map((item) => (
                          <button key={item} onClick={() => handleOffPlanClick(item.split(" ")[0])} className="block text-[10px] font-medium py-1 hover:text-amber-500 w-full text-left">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-amber-500 uppercase mb-2">By Handover</p>
                      <div className="space-y-1">
                        {offplanMenuItems.sections[1].items.map((item) => (
                          <button key={item} onClick={() => navigateWithFilters({ category: "Off-Plan", deliveryDate: item.split(" ")[1] })} className="block text-[10px] font-medium py-1 hover:text-amber-500 w-full text-left">
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={offplanMenuItems.promo.action} className="mt-2 w-full py-2 rounded-lg bg-[#f59e0b] text-black text-[9px] font-bold uppercase">
                    {offplanMenuItems.promo.title}
                  </button>
                </div>
              </MobileDropdown>
              
              {/* Resources Dropdown */}
              <MobileDropdown
                title="Resources"
                isOpen={activeMobileDropdown === "Resources"}
                onToggle={() => toggleMobileDropdown("Resources")}
              >
                <div className="grid grid-cols-1 gap-1 pl-2">
                  {sidebarLinks.map((link) => (
                    <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between py-2 text-[10px] font-medium hover:text-amber-500">
                      {link.name} {renderBadge(link.badge)}
                    </Link>
                  ))}
                </div>
              </MobileDropdown>
              
              {/* Contact Us */}
              <Link to="/contact-us" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-white/10">
                Contact Us
              </Link>
              
              {/* Careers */}
              <Link to="/careers" onClick={() => setIsMobileMenuOpen(false)} className="block py-3 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 dark:border-white/10">
                Careers <span className="ml-1 bg-amber-500 text-black text-[6px] px-1.5 py-0.5 rounded-full font-bold">HIRING</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        isDark={isDark}
      />

      <style jsx>{`
        .relative {
          position: relative;
        }
        
        .absolute {
          position: absolute;
        }
        
        /* Ensure dropdown appears above all content */
        [style*="zIndex: 9999"] {
          z-index: 9999 !important;
        }
      `}</style>
    </>
  );
}