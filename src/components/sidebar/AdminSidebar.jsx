import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronUp, Users, Shield, BarChart2,
  CreditCard, Building, ShoppingCart, Star,
  ClipboardList, Calendar, LogOut, LayoutDashboard, Compass,
  Building2, Home, TrendingUp, Award, FileText, Settings,
  UserCheck, Clock, MapPin, DollarSign, Eye, Zap
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import { AuthContext } from "../../context/AuthContext";
// Missing imports
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus, Plus, Eye as EyeIcon } from "lucide-react";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, isAuthenticated, logoutUser } = useContext(AuthContext);
  const { theme } = useTheme();
  const { toggleSidebar, isOpen } = useSidebar();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (logoutUser) await logoutUser();
    navigate("/login");
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Enhanced Luxury Theme Classes
  const ct = {
    bg: isDark ? "bg-gradient-to-b from-[#0a0a0c] to-[#11141B] border-white/5" : "bg-white border-slate-200",
    text: isDark ? "text-slate-400" : "text-slate-500",
    textHover: isDark ? "text-white" : "text-slate-700",
    active: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20",
    activeIcon: "text-white",
    hover: isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-slate-50 hover:text-slate-800",
    header: isDark ? "border-white/5 bg-[#0a0a0c]/95" : "border-slate-100 bg-white/95",
    scrollbar: isDark ? "scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-amber-500/30" : "scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-amber-500/50"
  };

  // Sidebar width classes
  const sidebarWidth = isOpen ? "w-72" : "w-20";
  const contentPadding = isOpen ? "px-4" : "px-2";

  return (
    <>
      {/* OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 288 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 h-full z-[160] border-r flex flex-col shadow-2xl overflow-hidden ${ct.bg}`}
      >
        {/* LOGO AREA */}
       



          <div className={`flex items-center justify-center  h-10 md:h-15 border-b transition-all duration-300 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
  <Link             to={!isAuthenticated ? "/" : user?.role === "admin" ? "/admin-dashboard" : "/agent-dashboard"}
 className="hover:scale-105 transition-transform duration-300 flex items-center justify-center w-full px-3">
    <img 
      src={navbarlogo} 
      alt="Logo" 
      className="w-auto object-contain"
      style={{ 
        height: "clamp(7.5rem, 5vh, 3.5rem)",
        maxWidth: "90%"
      }} 
    />
  </Link>
</div>

       


        {/* NAVIGATION */}
        <nav className={`flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar ${ct.scrollbar}`}>
          {/* Dashboard */}
          <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" ct={ct} isOpen={isOpen} />

          {/* Section: Management */}
          <SectionLabel label="Management" isOpen={isOpen} />

          {/* Agents Dropdown */}
          <DropdownMenu
            icon={<Users size={20} />}
            label="Agents"
            menuKey="Users"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            ct={ct}
            isOpen={isOpen}
            items={[
              { to: "/viewallagentlist", label: "Agent Registry", icon: <UserCheck size={14} /> },
              { to: "/addagent", label: "Onboard Agent", icon: <UserPlus size={14} /> }
            ]}
          />



          {/* Developers Dropdown */}
          <DropdownMenu
            icon={<Building2 size={20} />}
            label="Developers"
            menuKey="Developers"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            ct={ct}
            isOpen={isOpen}
            items={[
              { to: "/createdeveloper", label: "Enroll Developer", icon: <Plus size={14} /> },
              { to: "/viewdevelopers", label: "Developer Portfolio", icon: <Building2 size={14} /> }
            ]}
          />

          {/* Properties Dropdown */}
          <DropdownMenu
            icon={<Building size={20} />}
            label="Properties"
            menuKey="Prop"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            ct={ct}
            isOpen={isOpen}
            items={[
              { to: "/addproperty", label: "List Property", icon: <Plus size={14} /> },
              { to: "/viewpropertylist", label: "All Properties", icon: <Eye size={14} /> }
            ]}
          />
          
          {/* Agents Dropdown */}
          <DropdownMenu
            icon={<Users size={20} />}
            label="Broker Property List"
            menuKey="Users"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            ct={ct}
            isOpen={isOpen}
            items={[
              { to: "/viewpropertyrequest", label: "Broker Property List", icon: <UserCheck size={14} /> },
            ]}
          />

          <DropdownMenu
            icon={<Calendar size={20} />}
            label="Blog Management" 
            menuKey="Appt"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            ct={ct}
            isOpen={isOpen}
            items={[
              { to: "/createblog", label: "Create Blog", icon: <Calendar size={14} /> },
              { to: "/viewbloglist", label: "View List", icon: <Clock size={14} /> }
            ]}
          />
          
          


          {/* Section: Operations */}
          <SectionLabel label="Operations" isOpen={isOpen} />

          {/* Bookings Dropdown */}
          <DropdownMenu
            icon={<ShoppingCart size={20} />}
            label="Bookings"
            menuKey="Book"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            ct={ct}
            isOpen={isOpen}
            items={[
              { to: "/viewallbookings", label: "Sales Logs", icon: <FileText size={14} /> }
            ]}
          />

          <NavItem to="/getresquset" icon={<ClipboardList size={20} />} label="Call Logs" ct={ct} isOpen={isOpen} />

          <NavItem to="/customerreviews" icon={<Star size={20} />} label="Testimonials" ct={ct} isOpen={isOpen} />

          {/* Section: System */}
          <div className="pt-4 mt-2">
            <SectionLabel label="System" isOpen={isOpen} />

            <DropdownMenu
              icon={<Shield size={20} />}
              label="Security"
              menuKey="Config"
              openDropdown={openDropdown}
              toggleDropdown={toggleDropdown}
              ct={ct}
              isOpen={isOpen}
              items={[
                { to: "/permissions", label: "Access Control", icon: <Shield size={14} /> },
                { to: "/roles", label: "Role Manager", icon: <Users size={14} /> }
              ]}
            />

          </div>
        </nav>

        {/* FOOTER SECTION - Analytics & Logout */}
        <div className={`p-4 mt-auto border-t transition-all duration-300 ${isDark ? "border-white/10 bg-black/20" : "border-slate-100 bg-slate-50/50"}`}>
          {/* Mini Analytics Card (only when sidebar is open) */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black uppercase tracking-wider text-amber-500">Today's Views</span>
                <Eye size={12} className="text-amber-500" />
              </div>
              <p className="text-lg font-black text-amber-500">1,847</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp size={10} className="text-emerald-500" />
                <span className="text-[8px] text-emerald-500">+12.5%</span>
              </div>
            </motion.div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group ${isDark ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"
              } font-black text-[10px] uppercase tracking-wider`}
          >
            <LogOut size={18} className="transition-transform group-hover:scale-110" />
            <span className={`ml-3 transition-all duration-300 ${!isOpen && "lg:opacity-0 lg:w-0 lg:ml-0"}`}>
              Sign Out
            </span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

// Section Label Component
function SectionLabel({ label, isOpen }) {
  return (
    <div className={`px-4 py-2 mt-2 ${!isOpen ? "lg:px-2" : ""}`}>
      <p className={`text-[9px] font-black text-amber-500/70 uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${!isOpen ? "lg:opacity-0 lg:scale-0" : "opacity-100"}`}>
        {label}
      </p>
      {!isOpen && (
        <div className="w-full h-px bg-gradient-to-r from-amber-500/30 to-transparent my-2" />
      )}
    </div>
  );
}

// Navigation Item Component
function NavItem({ to, icon, label, ct, isOpen, badge }) {
  return (
    <NavLink to={to} className={({ isActive }) => `
      relative flex items-center mx-3 p-3 rounded-xl transition-all duration-300 group
      ${isActive ? ct.active : `${ct.text} ${ct.hover}`}
      ${!isOpen ? "lg:justify-center" : ""}
    `}>
      <div className={`transition-all duration-300 ${!isOpen ? "lg:scale-110" : "group-hover:scale-105"}`}>
        {icon}
      </div>
      <span className={`ml-3 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${!isOpen ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100"}`}>
        {label}
      </span>
      {badge && isOpen && (
        <span className="ml-auto px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[8px] font-black">
          {badge}
        </span>
      )}
      {!isOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[9px] font-bold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </NavLink>
  );
}

// Dropdown Menu Component
function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, ct, isOpen }) {
  const isMenuOpen = openDropdown === menuKey;

  return (
    <div className="mx-2">
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group ${isMenuOpen ? "text-amber-500 bg-white/5" : `${ct.text} ${ct.hover}`} ${!isOpen ? "lg:justify-center" : ""}`}
      >
        <div className={`transition-all duration-300 ${!isOpen ? "lg:scale-110" : "group-hover:scale-105"}`}>
          {icon}
        </div>
        <span className={`ml-3 flex-1 text-left font-bold text-[10px] uppercase tracking-wider transition-all duration-300 ${!isOpen ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100"}`}>
          {label}
        </span>
        {isOpen && (
          <div className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}>
            <ChevronDown size={14} className="opacity-60" />
          </div>
        )}
      </button>

      {/* Dropdown Items */}
      {isMenuOpen && isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="ml-6 mt-1 space-y-1 border-l-2 border-amber-500/30 pl-3 overflow-hidden"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-2 py-2.5 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200
                ${isActive ? "text-amber-500 bg-amber-500/10" : `${ct.text} hover:text-amber-500 hover:bg-amber-500/5`}
              `}
            >
              {item.icon && <span className="opacity-60">{item.icon}</span>}
              {item.label}
            </NavLink>
          ))}
        </motion.div>
      )}

      {/* Tooltip for collapsed mode */}
      {!isOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[9px] font-bold rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );
}

