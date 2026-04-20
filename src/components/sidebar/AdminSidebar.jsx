import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronUp, Users, Shield, BarChart2,
  CreditCard, Building, ShoppingCart, Star,
  ClipboardList, Calendar, LogOut, LayoutDashboard, Compass,
  Building2
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import { AuthContext } from "../../context/AuthContext";

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

  // Luxury Theme Classes
  const ct = {
    bg: isDark ? "bg-[#0B0F1A] border-slate-800/50" : "bg-white border-slate-100",
    text: isDark ? "text-slate-400" : "text-slate-500",
    active: "bg-amber-500 text-black shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)]",
    hover: isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-slate-50 hover:text-slate-900",
    header: isDark ? "border-slate-800/50 bg-[#0B0F1A]/80" : "border-slate-100 bg-white/80"
  };



  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] lg:hidden" onClick={toggleSidebar} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full z-[160] transition-all duration-500 ease-in-out border-r flex flex-col shadow-2xl ${isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-[88px]"} ${ct.bg}`}>
        
        {/* LOGO AREA */}
        <div className={`flex items-center justify-between px-6 h-24 border-b backdrop-blur-md sticky top-0 z-20 ${ct.header}`}>
          <Link to={!isAuthenticated ? "/" : user?.role === "admin" ? "/admin-dashboard" : "/agent-dashboard"} className="overflow-hidden">
            <img src={navbarlogo} alt="Logo" className={`h-8 transition-all duration-500 ${!isOpen && "lg:scale-150 lg:ml-2"}`} />
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 p-2 hover:bg-white/5 rounded-lg"><X size={20}/></button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar no-scrollbar">
          <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" ct={ct} isOpen={isOpen} />
          
          <SectionLabel label="Portfolios" isOpen={isOpen} />
          
          <DropdownMenu 
            icon={<Users size={20} />} label="Agents" menuKey="Users" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} ct={ct} isOpen={isOpen}
            items={[{ to: "/viewallagentlist", label: "Registry" }, { to: "/addagent", label: "Onboard New" }]} 
          />
<DropdownMenu 
  icon={<Building2 size={20} />} // Changed to Building2 for Developers
  label="Developers" 
  menuKey="Developers"
  openDropdown={openDropdown} 
  toggleDropdown={toggleDropdown} 
  ct={ct} 
  isOpen={isOpen}
  items={[
    { to: "/createdeveloper", label: "Enroll Developer" }, 
    { to: "/viewdevelopers", label: "Developer Portfolio" }
  ]} 
/>

          <DropdownMenu 
            icon={<Building size={20} />} label="Property " menuKey="Prop" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} ct={ct} isOpen={isOpen}
            items={[{ to: "/addproperty", label: "List Property" }, { to: "/viewpropertylist", label: "All Properties" }]} 
          />

          <DropdownMenu 
            icon={<Calendar size={20} />} label="Appoinmentss" menuKey="Appt" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} ct={ct} isOpen={isOpen}
            items={[{ to: "/getappoinment", label: "Calendar" }, { to: "/selectadminappoinmentproperty", label: "New Viewing" }]} 
          />

          {/* <NavItem to="/viewpropertyrequest" icon={<Compass size={20} />} label="Acquisitions" ct={ct} isOpen={isOpen} /> */}

          <SectionLabel label="Operations" isOpen={isOpen} />

          <DropdownMenu 
            icon={<ShoppingCart size={20} />} label="Bookings" menuKey="Book" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} ct={ct} isOpen={isOpen}
            items={[{ to: "/viewallbookings", label: "Sales Logs" }]} 
          />

          <NavItem to="/getresquset" icon={<ClipboardList size={20} />} label="Call Logs" ct={ct} isOpen={isOpen} />

          <div className="pt-4 border-t border-slate-800/50 mt-4">
            <SectionLabel label="System" isOpen={isOpen} />
            <DropdownMenu 
              icon={<Shield size={20} />} label="Settings" menuKey="Config" 
              openDropdown={openDropdown} toggleDropdown={toggleDropdown} ct={ct} isOpen={isOpen}
              items={[{ to: "/permissions", label: "Access Control" }, { to: "/roles", label: "Role Manager" }]} 
            />
            <NavItem to="/customerreviews" icon={<Star size={20} />} label="Testimonials" ct={ct} isOpen={isOpen} />
          </div>
        </nav>

        {/* PROFILE/LOGOUT SECTION */}
        <div className={`p-4 mt-auto border-t transition-all duration-300 ${isDark ? "border-slate-800 bg-black/20" : "border-slate-100 bg-slate-50"}`}>
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full p-3 rounded-2xl transition-all text-red-500 hover:bg-red-500/10 font-black text-[10px] uppercase tracking-[0.2em]"
          >
            <LogOut size={20} />
            <span className={`ml-3 transition-opacity duration-300 ${!isOpen && "lg:opacity-0 lg:w-0"}`}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Design-Specific Sub-components
function SectionLabel({ label, isOpen }) {
  return (
    <div className={`py-3 text-[9px] font-black text-amber-500/60 uppercase tracking-[0.3em] px-3 mt-4 transition-opacity duration-300 ${!isOpen && "lg:opacity-0"}`}>
      {label}
    </div>
  );
}

function NavItem({ to, icon, label, ct, isOpen }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center p-3.5 rounded-2xl transition-all duration-300 group ${isActive ? ct.active : ct.text + " " + ct.hover}`}>
      <div className="transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <span className={`ml-4 font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${!isOpen && "lg:opacity-0 lg:w-0"}`}>
        {label}
      </span>
    </NavLink>
  );
}

function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, ct, isOpen }) {
  const isMenuOpen = openDropdown === menuKey;
  return (
    <div>
      <button 
        onClick={() => toggleDropdown(menuKey)} 
        className={`flex items-center w-full p-3.5 rounded-2xl transition-all duration-300 group ${isMenuOpen ? "bg-white/5 text-amber-500" : ct.text + " " + ct.hover}`}
      >
        <div className="group-hover:text-amber-500 transition-colors">{icon}</div>
        <span className={`ml-4 flex-1 text-left font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${!isOpen && "lg:opacity-0 lg:w-0"}`}>
          {label}
        </span>
        {isOpen && (isMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
      </button>
      
      {isMenuOpen && isOpen && (
        <div className="ml-6 mt-2 space-y-1 border-l border-slate-800 pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {items.map((item) => (
            <NavLink 
                key={item.to} 
                to={item.to} 
                className={({isActive}) => `block py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-amber-500" : "text-slate-500 hover:text-amber-400"}`}
            >
                {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function MapPinIcon(props) {
    return <Building {...props} />; // Placeholder as Lucide MapPin was missing in provided imports
}