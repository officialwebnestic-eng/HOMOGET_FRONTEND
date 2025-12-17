import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Home,
  ShoppingCart,
  Users,
  Package,
  Star,
  MessageSquare,
  Calendar,
  FileText,
 
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";

export default function AgentSidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { theme } = useTheme();
  const { toggleSidebar, isOpen } = useSidebar();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="relative">
      {/* Toggle Button with Theme Support */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-6 left-6 z-50 p-3 rounded-xl backdrop-blur-lg border transition-all duration-300 shadow-lg hover:scale-105 ${isOpen
          ? `left-[17rem] ${theme === 'dark'
            ? 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700/90'
            : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-gray-50/90'
          }`
          : theme === 'dark'
            ? 'bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700/90'
            : 'bg-white/90 border-gray-200 text-gray-700 hover:bg-gray-50/90'
          }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen font-inter transition-all duration-300 ease-in-out
        ${isOpen ? "w-72" : "w-0"} overflow-hidden ${theme === 'dark'
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 border-r border-slate-700/50'
            : 'bg-gradient-to-b from-white via-gray-50 to-gray-100 border-r border-gray-200/50'
          } backdrop-blur-xl shadow-2xl`}
      >
        {isOpen && (
          <>
            {/* Logo Section */}
            <div className={`flex items-center justify-center h-20 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-200/50'
              } bg-gradient-to-r ${theme === 'dark'
                ? 'from-blue-900/20 to-purple-900/20'
                : 'from-blue-50 to-purple-50'
              }`}>
              <a href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src={navbarlogo}
                    alt="Company Logo"
                    className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
                    }`}></div>
                </div>
              </a>
            </div>

            {/* Navigation Content */}
            <div className="h-[calc(100vh-5rem)] overflow-y-auto py-6 px-4 custom-scrollbar">
              <ul className="space-y-2 font-medium">
                <NavItem
                  href="agent-dashboard"
                  icon={<Home className="w-5 h-5" />}
                  label="Dashboard"
                  isActive={true}
                  theme={theme}
                />

                <PermissionProtectedAction action="view" module="CustomerSupport Management">
                  <NavItem
                    href="/viewallinquary"
                    icon={<FileText className="w-5 h-5" />}
                    label="Customer Support"
                    theme={theme}
                  />
                </PermissionProtectedAction>

                <PermissionProtectedAction action="view" module="AgentSupport Management">
                  <NavItem
                    href="/getresquset"
                    icon={<MessageSquare className="w-5 h-5" />}
                    label="Requests"
                    theme={theme}
                  />

                </PermissionProtectedAction>
                <DropdownMenu
                  icon={<Users className="w-5 h-5" />}
                  label="User Management"
                  menuKey="UserManagement"
                  theme={theme}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    {

                      href: "/addagent", label: "Add Staff",
                      permission: { action: "create", module: "Team Management" }
                    },
                    {
                      href: "/viewallagentlist",
                      label: "View Staff List",
                      permission: { action: "view", module: "Team Management" }
                    },
                    {
                      href: "/agentdetails", label: "Staff Details",
                      permission: { action: "view", module: "Team Management" }
                    },
                  ]}
                />

                <DropdownMenu
                  icon={<ShoppingCart className="w-5 h-5" />}
                  label="Bookings"
                  menuKey="Bookings"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  theme={theme}
                  items={[
                    {
                      href: "/viewallbookings",
                      label: "View Bookings",
                      permission: { action: "view", module: "Booking Management" }
                    },
                    {
                      href: "/createbookingByAgent",
                      label: "Create Booking",
                      permission: { action: "create", module: "Booking Management" }
                    },
                    {
                      href: "/viewallbookingdetails",
                      label: "Booking Details",
                      permission: { action: "view", module: "Booking Management" }
                    }
                  ]}
                />

                <DropdownMenu
                  icon={<Package className="w-5 h-5" />}
                  label="Property"
                  menuKey="Property"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  theme={theme}
                  items={[
                    {
                      href: "/addproperty",
                      label: "Add Property",
                      permission: { action: "create", module: "Property Management" }
                    },
                    {
                      href: "/propertydetailsagent",
                      label: "Property Details",
                      permission: { action: "view", module: "Property Management" }
                    }
                  ]}
                />
                <DropdownMenu
                  icon={<Users className="w-5 h-5" />}
                  label="Home Loan Management"
                  menuKey="homeloan"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  theme={theme}
                  items={[
                    {
                      href: "/viewhomeloanrequest", label: "View Request",
                      permission: { action: "view", module: "Home Loan Managementt" }
                    },
                    { href: "/homeloanrequestform", label: "Request Loan", permission: { action: "create", module: "Home Loan Management" } }
                  ]}
                />

                <DropdownMenu
                  icon={<Calendar className="w-5 h-5" />}
                  label="Appointments"
                  menuKey="Appointment"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  theme={theme}
                  items={[
                    {
                      href: "/selectappoinmentproperty",
                      label: "Create Appointment",
                      permission: { action: "create", module: "Appoinment Management" }
                    },
                    {
                      href: "/getappoinment",
                      label: "View Appointments",
                      permission: { action: "view", module: "Appoinment Management" }
                    }
                  ]}
                />

                <DropdownMenu
                  icon={<Users className="w-5 h-5" />}
                  label="Manage Session"
                  menuKey="ManageSession"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  theme={theme}
                  items={[
                    {
                      href: "/viewallsession", label: "All Sessions",
                      permission: { action: "view", module: "Session Management" }
                    },
                    { href: "/createsession", label: "Create Session", permission: { action: "create", module: "Session Management" } }
                  ]}
                />

                <PermissionProtectedAction action="view" module="Review Management">
                  <NavItem
                    href="/customerreviews"
                    icon={<Star className="w-5 h-5" />}
                    label="Reviews"
                    theme={theme}
                  />
                </PermissionProtectedAction>
              </ul>
            </div>
          </>
        )}
      </aside>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#1e293b' : '#f1f5f9'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#475569' : '#cbd5e1'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
}

function NavItem({ href, icon, label, isActive = false, theme }) {
  return (
    <li>
      <a
        href={href}
        className={`flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
          ? theme === 'dark'
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
            : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
          : theme === 'dark'
            ? "hover:bg-slate-800/60 text-slate-300 hover:text-white hover:shadow-md"
            : "hover:bg-white/60 text-gray-600 hover:text-gray-900 hover:shadow-md"
          }`}
      >
        {/* Active Indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"></div>
        )}

        {/* Icon with Animation */}
        <span className={`transition-all duration-200 group-hover:scale-110 ${isActive
          ? "text-white"
          : theme === 'dark'
            ? "text-blue-400"
            : "text-blue-500"
          }`}>
          {icon}
        </span>

        {/* Label */}
        <span className="ml-4 font-medium tracking-wide">{label}</span>

        {/* Hover Effect Background */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
          }`}></div>
      </a>
    </li>
  );
}

function DropdownMenu({
  icon,
  label,
  menuKey,
  openDropdown,
  toggleDropdown,
  items,
  theme,
}) {
  const isOpen = openDropdown === menuKey;

  return (
    <li>
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isOpen
          ? theme === 'dark'
            ? "bg-slate-800/60 text-white shadow-md"
            : "bg-white/60 text-gray-900 shadow-md"
          : theme === 'dark'
            ? "hover:bg-slate-800/60 text-slate-300 hover:text-white hover:shadow-md"
            : "hover:bg-white/60 text-gray-600 hover:text-gray-900 hover:shadow-md"
          }`}
      >
        {/* Icon with Animation */}
        <span className={`transition-all duration-200 group-hover:scale-110 ${theme === 'dark' ? "text-blue-400" : "text-blue-500"
          }`}>
          {icon}
        </span>

        {/* Label */}
        <span className="ml-4 font-medium tracking-wide">{label}</span>

        {/* Chevron with Rotation */}
        <span className={`ml-auto transition-transform duration-200 ${isOpen ? "rotate-180" : ""
          } ${theme === 'dark' ? "text-slate-400" : "text-gray-400"}`}>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>

        {/* Hover Effect Background */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity rounded-xl ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
          }`}></div>
      </button>

      {/* Dropdown Items with Slide Animation */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}>
        <ul className={`ml-6 mt-2 space-y-1 border-l-2 border-opacity-30 pl-4 ${theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
          }`}>
          {items.map((item, idx) => {
            const content = (
              <a
                href={item.href}
                className={`block py-2.5 px-4 text-sm rounded-lg transition-all duration-200 group relative ${theme === 'dark'
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/40"
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/40"
                  } hover:shadow-sm hover:translate-x-1`}
              >
                {/* Bullet Point */}
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-3 transition-colors ${theme === 'dark'
                  ? "bg-slate-600 group-hover:bg-blue-400"
                  : "bg-gray-400 group-hover:bg-blue-500"
                  }`}></span>
                {item.label}
              </a>
            );


            return (
              <li key={idx}>
                {item.permission ? (
                  <PermissionProtectedAction
                    action={item.permission.action}
                    module={item.permission.module}
                  >
                    {content}
                  </PermissionProtectedAction>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}