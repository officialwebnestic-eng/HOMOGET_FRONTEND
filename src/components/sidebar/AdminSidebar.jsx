import { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronUp, Home, Users, Shield, BarChart2,
  CreditCard, Building, HelpCircle, Contact, ShoppingCart, Star,
  ClipboardList, Settings, Calendar
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
    const {  user, isAuthenticated } = useContext(AuthContext);
  
  const { theme } = useTheme();
  const { toggleSidebar, isOpen } = useSidebar();
  const isDark = theme === "dark";

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="relative">
      {/* Sidebar Toggle Button */}
      {/* <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2.5 rounded-xl transition-all duration-300 bg-indigo-600 text-white shadow-lg ${
          isOpen ? "left-60" : "left-4"
        }`}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button> */}

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 transition-all duration-300 ease-in-out border-r ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"} shadow-2xl`}
      >
        {/* Brand Logo */}
        <div className="flex items-center justify-center h-24 border-b border-slate-200 dark:border-slate-800">
          <Link 
  to={
    !isAuthenticated 
      ? "/" 
      : user.role === "admin" 
        ? "/admin-dashboard" 
        : user.role === "agent" 
          ? "/agent-dashboard" 
          : "/" // Default for standard users
  } 
  className="flex-shrink-0"
>
  <img src={navbarlogo} alt="Logo" className="h-10 lg:h-12 w-auto object-contain" />
</Link>
        </div>

        {/* Scrollable Navigation */}
        <nav className="h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar p-4 space-y-1">
          <NavItem to="/admin-dashboard" icon={<Home size={20} />} label="Dashboard" isDark={isDark} />

          <div className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mt-4">Management</div>
          
          <DropdownMenu
            icon={<Users size={20} />}
            label="User Management"
            menuKey="Users"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isDark={isDark}
            items={[
              { to: "/viewallagentlist", label: "View Agent List" },
              { to: "/addagent", label: "Add Agent" },
            ]}
          />

          <DropdownMenu
            icon={<Building size={20} />}
            label="Properties"
            menuKey="Properties"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isDark={isDark}
            items={[
              { to: "/addproperty", label: "Add Property" },
              { to: "/viewpropertylist", label: "Property List" },
            ]}
          />

          <DropdownMenu
            icon={<Calendar size={20} />}
            label="Appointments"
            menuKey="Appt"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isDark={isDark}
            items={[
              { to: "/getappoinment", label: "All Appointments" },
              { to: "/selectappoinmentproperty", label: "Create New" },
            ]}
          />

          <DropdownMenu
            icon={<CreditCard size={20} />}
            label="Financials"
            menuKey="Finance"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isDark={isDark}
            items={[
              { to: "/getalltransaction", label: "Transactions" },
              { to: "/payments", label: "Payments" },
              { to: "/commissions", label: "Commissions" },
            ]}
          />

          <NavItem to="/viewpropertyrequest" icon={<BarChart2 size={20} />} label="Sell Requests" isDark={isDark} />
          
          <div className="py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mt-4">Operations</div>

          <DropdownMenu
            icon={<ShoppingCart size={20} />}
            label="Bookings"
            menuKey="Bookings"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isDark={isDark}
            items={[{ to: "/viewallbookings", label: "View Bookings" }]}
          />

          <DropdownMenu
            icon={<Contact size={20} />}
            label="Manage Sessions"
            menuKey="Sessions"
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            isDark={isDark}
            items={[
              { to: "/viewallsession", label: "View All" },
              { to: "/createsession", label: "Create New" },
            ]}
          />

          <NavItem to="/gettourbooking" icon={<Users size={20} />} label="Tour List" isDark={isDark} />
          <NavItem to="/getresquset" icon={<ClipboardList size={20} />} label="Call Requests" isDark={isDark} />

          <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-4 space-y-1">
             <DropdownMenu
              icon={<Shield size={20} />}
              label="Configuration"
              menuKey="Config"
              openDropdown={openDropdown}
              toggleDropdown={toggleDropdown}
              isDark={isDark}
              items={[
                { to: "/permissions", label: "Permissions" },
                { to: "/roles", label: "Roles" },
              ]}
            />
            <NavItem to="/customerreviews" icon={<Star size={20} />} label="Reviews" isDark={isDark} />
            <NavItem to="/help" icon={<HelpCircle size={20} />} label="Help Center" isDark={isDark} />
          </div>
        </nav>
      </aside>
    </div>
  );
}

// Sub-component: Individual Nav Link
function NavItem({ to, icon, label, isDark }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center p-3 rounded-xl transition-all duration-200 group
        ${isActive 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
          : isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"}
      `}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="ml-3 font-semibold text-sm">{label}</span>
    </NavLink>
  );
}

// Sub-component: Dropdown Menu
function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, isDark }) {
  const isOpen = openDropdown === menuKey;

  return (
    <div className="space-y-1">
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group ${
          isOpen 
            ? isDark ? "bg-slate-800 text-white" : "bg-slate-100 text-indigo-600" 
            : isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"
        }`}
      >
        <span className="group-hover:text-indigo-500 transition-colors">{icon}</span>
        <span className="ml-3 flex-1 text-left font-semibold text-sm">{label}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {isOpen && (
        <div className="ml-9 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-1">
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) => `
                block py-2 text-sm font-medium transition-colors
                ${isActive ? "text-indigo-500" : isDark ? "text-slate-500 hover:text-white" : "text-slate-500 hover:text-indigo-600"}
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}