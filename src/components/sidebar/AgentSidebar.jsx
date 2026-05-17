import { useState, useMemo, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown, ShoppingCart, Users, Package, Star,
  MessageSquare, Calendar, FileText, LayoutDashboard,
  ShieldCheck, Banknote, Briefcase, ChevronLeft
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
  const { hasPermission, isLoading } = useContext(PermissionContext);

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

  // Helper: check if user has ANY permission for any of the dropdown items
  const hasAnyPermission = (items) => {
    if (!hasPermission) return false;
    return items.some(item =>
      item.permission && hasPermission(item.permission.action, item.permission.module)
    );
  };

  // Wait for permissions to load before rendering sidebar items (prevents flash)
  if (isLoading) return null;

  return (
    <div className="relative">
      <aside className={sidebarClasses}>
        {isOpen && (
          <>
            {/* Branding */}
            <div className={`flex items-center justify-center h-24 border-b ${isDark ? "border-slate-800" : "border-gray-100"}`}>
              <Link to="/" className="hover:scale-105 transition-transform duration-300">
                <img src={navbarlogo} alt="Logo" className="h-12 w-auto object-contain" />
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
                  {/* Dashboard – always visible */}
                  <NavItem
                    to="/agent-dashboard"
                    icon={<LayoutDashboard size={20} />}
                    label="Dashboard"
                    isActive={isActiveRoute("/agent-dashboard")}
                    isDark={isDark}
                  />
                  {/* Customer Support – hidden if no permission */}
                  <PermissionProtectedAction action="view" module="CustomerSupport Management">
                    <NavItem
                      to="/viewallinquary"
                      icon={<FileText size={20} />}
                      label="Customer Support"
                      isActive={isActiveRoute("/viewallinquary")}
                      isDark={isDark}
                    />
                  </PermissionProtectedAction>
                  {/* Requests – hidden if no permission */}
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
                  {/* Staffing – show only if user has any permission (view or create) on Team Management */}
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

                  {/* Property */}
                  {hasAnyPermission([
                    { permission: { action: "create", module: "Property Management" } },
                    { permission: { action: "view", module: "Property Management" } }
                  ]) && (
                      <DropdownMenu
                        icon={<Package size={20} />}
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

            {/* Footer Profile – always visible */}
            <div className={`p-4 border-t ${isDark ? "border-slate-800" : "border-gray-100"}`}>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? "bg-slate-800/50" : "bg-gray-50"}`}>
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  A
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold truncate">Agent Portal</p>
                  <p className="text-[10px] opacity-50 truncate">Support Staff</p>
                </div>
                <ShieldCheck size={16} className="text-amber-500" />
              </div>
            </div>
          </>
        )}
      </aside>

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

// NavItem component (unchanged)
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

// DropdownMenu component (unchanged)
function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, isDark }) {
  const isOpen = openDropdown === menuKey;
  const location = useLocation();

  const isChildActive = (childTo) => location.pathname === childTo;

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
          {items.map((item, idx) => {
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