import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronUp, Home, Users, Shield, BarChart2,
  CreditCard, Building, Contact, ShoppingCart, Star,
  ClipboardList, Calendar, LogOut, LayoutDashboard
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

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] lg:hidden" onClick={toggleSidebar} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full w-72 z-[160] transition-transform duration-300 ease-in-out border-r flex flex-col ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden"} ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"} shadow-2xl`}>
        
        {/* LOGO AREA */}
        <div className="flex items-center justify-between px-6 h-24 border-b border-slate-200 dark:border-slate-800">
          <Link to={!isAuthenticated ? "/" : user.role === "admin" ? "/admin-dashboard" : "/agent-dashboard"}>
            <img src={navbarlogo} alt="Logo" className="h-10 w-auto" />
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400"><X size={20}/></button>
        </div>

        {/* ALL SIDEBAR LINKS PRESERVED */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" isDark={isDark} />
          
          <div className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mt-4">Management</div>
          
          <DropdownMenu 
            icon={<Users size={20} />} label="User Management" menuKey="Users" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} isDark={isDark}
            items={[{ to: "/viewallagentlist", label: "Agent List" }, { to: "/addagent", label: "Add Agent" }]} 
          />

          <DropdownMenu 
            icon={<Building size={20} />} label="Properties" menuKey="Prop" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} isDark={isDark}
            items={[{ to: "/addproperty", label: "Add Property" }, { to: "/viewpropertylist", label: "Property List" }]} 
          />

          <DropdownMenu 
            icon={<Calendar size={20} />} label="Appointments" menuKey="Appt" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} isDark={isDark}
            items={[{ to: "/getappoinment", label: "All Appointments" }, { to: "/selectappoinmentproperty", label: "Create New" }]} 
          />

          <NavItem to="/viewpropertyrequest" icon={<BarChart2 size={20} />} label="Sell Requests" isDark={isDark} />

          <div className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mt-4">Operations</div>

          <DropdownMenu 
            icon={<ShoppingCart size={20} />} label="Bookings" menuKey="Book" 
            openDropdown={openDropdown} toggleDropdown={toggleDropdown} isDark={isDark}
            items={[{ to: "/viewallbookings", label: "All Bookings" }]} 
          />

          <NavItem to="/gettourbooking" icon={<Users size={20} />} label="Tour List" isDark={isDark} />
          <NavItem to="/getresquset" icon={<ClipboardList size={20} />} label="Call Requests" isDark={isDark} />

          <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-4">
            <DropdownMenu 
              icon={<Shield size={20} />} label="Configuration" menuKey="Config" 
              openDropdown={openDropdown} toggleDropdown={toggleDropdown} isDark={isDark}
              items={[{ to: "/permissions", label: "Permissions" }, { to: "/roles", label: "Roles" }]} 
            />
            <NavItem to="/customerreviews" icon={<Star size={20} />} label="Reviews" isDark={isDark} />
          </div>
        </nav>

        {/* LOGOUT SECTION */}
        <div className={`p-4 border-t ${isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-slate-50"}`}>
          <button onClick={handleLogout} className="flex items-center w-full p-3 rounded-xl transition-all text-red-500 hover:bg-red-500/10 font-bold">
            <LogOut size={20} />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

// Sub-components
function NavItem({ to, icon, label, isDark }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all ${isActive ? "bg-indigo-600 text-white shadow-lg" : isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}`}>
      {icon} <span className="ml-3 font-semibold text-sm">{label}</span>
    </NavLink>
  );
}

function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, isDark }) {
  const isOpen = openDropdown === menuKey;
  return (
    <div>
      <button onClick={() => toggleDropdown(menuKey)} className={`flex items-center w-full p-3 rounded-xl transition-all ${isOpen ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
        {icon} <span className="ml-3 flex-1 text-left font-semibold text-sm">{label}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && (
        <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 pl-4">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className="block py-2 text-sm text-slate-500 hover:text-indigo-600">{item.label}</NavLink>
          ))}
        </div>
      )}
    </div>
  );
}