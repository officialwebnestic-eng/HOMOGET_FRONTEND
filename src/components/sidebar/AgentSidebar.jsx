import { useState, useMemo, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown, ShoppingCart, Users, Package, Star,
  MessageSquare, Calendar, FileText, LayoutDashboard,
  ShieldCheck, Banknote, Briefcase, ChevronLeft, 
  BookOpen, Home, Settings, UserCheck
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";
import { PermissionContext } from "../../context/PermessionContenx";

export default function AgentSidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { theme } = useTheme();
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const isDark = theme === "dark";
  const { hasPermission, isLoading, permissions } = useContext(PermissionContext);

  // Debug: Log permissions to console
  useEffect(() => {
    if (!isLoading && permissions) {
      console.log("📋 Available Permissions:", permissions);
      console.log("📋 User Role:", permissions?.userRole);
    }
  }, [isLoading, permissions]);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };
  
  const isActiveRoute = (path) => location.pathname === path;

  const sidebarClasses = useMemo(() => {
    return `fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r backdrop-blur-xl shadow-2xl flex flex-col
    ${isOpen ? "w-72" : "w-0"} overflow-hidden
    ${isDark
        ? "bg-slate-900/95 border-slate-800 text-slate-100"
        : "bg-white/95 border-gray-200 text-gray-800"}`;
  }, [isOpen, isDark]);

  // Helper: Check if user has ANY permission for any of the dropdown items
  const hasAnyPermission = (items) => {
    if (!hasPermission || isLoading) return false;
    
    // If no permission items, return true (show by default)
    if (!items || items.length === 0) return true;
    
    return items.some(item => {
      if (!item.permission) return true; // No permission required
      const { action, module } = item.permission;
      const hasPerm = hasPermission(action, module);
      // Debug log
      if (!hasPerm) {
        console.log(`❌ Missing permission: ${action}:${module}`);
      }
      return hasPerm;
    });
  };

  // Helper: Debug permission check
  const debugPermission = (action, module) => {
    const result = hasPermission?.(action, module);
    console.log(`🔍 Check: ${action}:${module} = ${result}`);
    return result;
  };

  // Wait for permissions to load before rendering sidebar items
  if (isLoading) {
    return (
      <div className={`fixed top-0 left-0 z-40 h-screen w-72 transition-all duration-300 ease-in-out border-r backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center ${isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-gray-200"}`}>
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <aside className={sidebarClasses}>
        {isOpen && (
          <>
            {/* Branding */}
            <div className={`flex items-center justify-center h-10 md:h-20 border-b transition-all duration-300 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
              <Link to="/" className="hover:scale-105 transition-transform duration-300 flex items-center justify-center w-full px-3">
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
            
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar space-y-8">
              {/* Section: Overview */}
              <div>
                <p className={`px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                  Overview
                </p>
                <ul className="space-y-1">
                  <NavItem
                    to="/agent-dashboard"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    isActive={isActiveRoute("/agent-dashboard")}
                    isDark={isDark}
                  />
                  
                  <PermissionProtectedAction action="view" module="CustomerSupport Management">
                    <NavItem
                      to="/viewallinquary"
                      icon={<FileText size={20} />}
                      label="Customer Support"
                      isActive={isActiveRoute("/viewallinquary")}
                      isDark={isDark}
                    />
                  </PermissionProtectedAction>
                  
                  <PermissionProtectedAction action="view" module="AgentSupport Management">
                    <NavItem
                      to="/getresquset"
                      icon={<MessageSquare size={20} />}
                      label="Requests"
                      isActive={isActiveRoute("/getresquset")}
                      isDark={isDark}
                    />
                  </PermissionProtectedAction>
                </ul>
              </div>

              {/* Section: Management */}
              <div>
                <p className={`px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                  Management
                </p>
                <ul className="space-y-1">
                  {/* Staffing - Fixed module name to match your PermissionData */}
                  {hasAnyPermission([
                    { permission: { action: "create", module: "Team Management" } },
                    { permission: { action: "view", module: "Team Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<Users size={20} />}
                      label="Staffing"
                      menuKey="UserManagement"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/addagent", label: "Add Staff", permission: { action: "create", module: "Team Management" } },
                        { to: "/viewallagentlist", label: "View Staff List", permission: { action: "view", module: "Team Management" } },
                      ]}
                    />
                  )}

                  {/* Bookings */}
                  {hasAnyPermission([
                    { permission: { action: "view", module: "Booking Management" } },
                    { permission: { action: "create", module: "Booking Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<ShoppingCart size={20} />}
                      label="Bookings"
                      menuKey="Bookings"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/viewallbookings", label: "All Bookings", permission: { action: "view", module: "Booking Management" } },
                        { to: "/createbookingByAgent", label: "New Booking", permission: { action: "create", module: "Booking Management" } },
                      ]}
                    />
                  )}

                  {/* Blog Management - Fixed duplicate "Bookings" label */}
                  {hasAnyPermission([
                    { permission: { action: "view", module: "Blog Management" } },
                    { permission: { action: "create", module: "Blog Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<BookOpen size={20} />}
                      label="Blogs"
                      menuKey="Blogs"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/viewbloglist", label: "All Blogs", permission: { action: "view", module: "Blog Management" } },
                        { to: "/createblog", label: "Create Blog", permission: { action: "create", module: "Blog Management" } },
                      ]}
                    />
                  )}
                  
                  {/* Property Management */}
                  {hasAnyPermission([
                    { permission: { action: "create", module: "Property Management" } },
                    { permission: { action: "view", module: "Property Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<Home size={20} />}
                      label="Property"
                      menuKey="Property"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/addpropertybyagent", label: "Add Property", permission: { action: "create", module: "Property Management" } },
                        { to: "/propertydetailsagent", label: "View Property", permission: { action: "view", module: "Property Management" } },
                      ]}
                    />
                  )}

                  {/* Home Loans */}
                  {hasAnyPermission([
                    { permission: { action: "view", module: "Home Loan Management" } },
                    { permission: { action: "create", module: "Home Loan Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<Banknote size={20} />}
                      label="Home Loans"
                      menuKey="homeloan"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/viewhomeloanrequest", label: "View Request", permission: { action: "view", module: "Home Loan Management" } },
                        { to: "/homeloanrequestform", label: "Apply for Loan", permission: { action: "create", module: "Home Loan Management" } },
                      ]}
                    />
                  )}

                  {/* Appointments */}
                  {hasAnyPermission([
                    { permission: { action: "create", module: "Appoinment Management" } },
                    { permission: { action: "view", module: "Appoinment Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<Calendar size={20} />}
                      label="Appointments"
                      menuKey="Appointment"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/selectappoinmentproperty", label: "Schedule New", permission: { action: "create", module: "Appoinment Management" } },
                        { to: "/getappoinment", label: "View Schedule", permission: { action: "view", module: "Appoinment Management" } },
                      ]}
                    />
                  )}

                  {/* Sessions */}
                  {hasAnyPermission([
                    { permission: { action: "view", module: "Session Management" } },
                    { permission: { action: "create", module: "Session Management" } }
                  ]) && (
                    <DropdownMenu
                      icon={<Briefcase size={20} />}
                      label="Sessions"
                      menuKey="ManageSession"
                      openDropdown={openDropdown}
                      toggleDropdown={toggleDropdown}
                      isDark={isDark}
                      items={[
                        { to: "/viewallsession", label: "All Sessions", permission: { action: "view", module: "Session Management" } },
                        { to: "/createsession", label: "Create Session", permission: { action: "create", module: "Session Management" } },
                      ]}
                    />
                  )}

                  {/* Settings - Added new section */}
                  {hasAnyPermission([
                    { permission: { action: "view", module: "Settings Management" } }
                  ]) && (
                    <NavItem
                      to="/settings"
                      icon={<Settings size={20} />}
                      label="Settings"
                      isActive={isActiveRoute("/settings")}
                      isDark={isDark}
                    />
                  )}
                </ul>
              </div>

              {/* Section: Social */}
              <div className="pt-4 border-t border-slate-800/10 dark:border-slate-800/50">
                <PermissionProtectedAction action="view" module="Review Management">
                  <NavItem
                    to="/customerreviews"
                    icon={<Star size={20} />}
                    label="Reviews"
                    isActive={isActiveRoute("/customerreviews")}
                    isDark={isDark}
                  />
                </PermissionProtectedAction>
              </div>
            </div>

            {/* Footer Profile */}
            <div className={`p-4 border-t ${isDark ? "border-slate-800" : "border-gray-100"}`}>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  A
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate">Agent Portal</p>
                  <p className="text-[10px] opacity-50 truncate">{permissions?.userRole || "Support Staff"}</p>
                </div>
                <ShieldCheck size={16} className="text-amber-500" />
              </div>
            </div>
          </>
        )}
      </aside>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-20 left-0 z-50 p-2 rounded-r-xl transition-all duration-300 ${
          isDark ? "bg-slate-800 text-white" : "bg-white text-gray-800 shadow-md"
        } ${isOpen ? "left-72" : "left-0"}`}
      >
        <ChevronLeft size={16} className={`transition-transform duration-300 ${!isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Global Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? "#475569" : "#cbd5e1"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "#64748b" : "#94a3b8"};
        }
      `}</style>
    </div>
  );
}

// NavItem component
function NavItem({ to, icon, label, isActive, isDark }) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative
        ${isActive
            ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
            : isDark
              ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
              : "text-gray-600 hover:text-amber-600 hover:bg-gray-100"
          }`}
      >
        <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-amber-500"}`}>
          {icon}
        </span>
        <span className="ml-3 text-sm font-semibold tracking-wide">{label}</span>
      </Link>
    </li>
  );
}

// DropdownMenu component
function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, isDark }) {
  const isOpen = openDropdown === menuKey;
  const location = useLocation();
  const { hasPermission } = useContext(PermissionContext);

  const isChildActive = (childTo) => location.pathname === childTo;
  
  // Filter items based on permissions
  const visibleItems = items.filter(item => {
    if (!item.permission) return true;
    const { action, module } = item.permission;
    return hasPermission?.(action, module) || false;
  });

  // Don't render dropdown if no visible items
  if (visibleItems.length === 0) return null;

  return (
    <li>
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group
        ${isOpen
            ? isDark ? "bg-slate-800/80 text-white" : "bg-amber-50 text-amber-600"
            : isDark ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-gray-600 hover:text-amber-600 hover:bg-gray-100"
          }`}
      >
        <span className={`transition-transform duration-200 group-hover:scale-110 ${isOpen ? "text-amber-500" : "text-amber-500/70"}`}>
          {icon}
        </span>
        <span className="ml-3 text-sm font-semibold tracking-wide flex-1 text-left">{label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-amber-500" : "opacity-50"}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 py-2" : "max-h-0"
          }`}
      >
        <ul className={`ml-6 border-l-2 ${isDark ? "border-slate-800" : "border-gray-200"} space-y-1`}>
          {visibleItems.map((item, idx) => {
            const childActive = isChildActive(item.to);
            const content = (
              <Link
                key={idx}
                to={item.to}
                className={`flex items-center py-2 px-5 text-xs font-medium rounded-r-lg transition-all duration-200
                ${childActive
                    ? isDark ? "text-amber-400 bg-amber-400/5" : "text-amber-600 bg-amber-50"
                    : isDark ? "text-slate-500 hover:text-amber-400 hover:bg-amber-400/5" : "text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-3 ${childActive ? "bg-amber-500" : isDark ? "bg-slate-700" : "bg-gray-300"
                  }`} />
                {item.label}
              </Link>
            );

            return item.permission ? (
              <PermissionProtectedAction key={idx} action={item.permission.action} module={item.permission.module}>
                {content}
              </PermissionProtectedAction>
            ) : (
              <li key={idx}>{content}</li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}