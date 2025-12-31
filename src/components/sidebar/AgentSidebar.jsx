import { useState, useMemo } from "react";
import {
   ChevronDown,  ShoppingCart, Users,
  Package, Star, MessageSquare, Calendar, FileText, LayoutDashboard,
  ShieldCheck, Banknote, Briefcase
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import { navbarlogo } from "../../ExportImages";
import PermissionProtectedAction from "../../Authorization/PermissionProtectedActions";

export default function AgentSidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { theme } = useTheme();
  const {isOpen } = useSidebar();
  const isDark = theme === 'dark';

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const sidebarClasses = useMemo(() => {
    return `fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r
    ${isOpen ? "w-72" : "w-0"} overflow-hidden backdrop-blur-xl shadow-2xl
    ${isDark 
      ? 'bg-slate-900/95 border-slate-800 text-slate-100' 
      : 'bg-white/95 border-gray-200 text-gray-800'}`;
  }, [isOpen, isDark]);

  return (
    <div className="relative">
      {/* Dynamic Toggle Button */}
    

      <aside className={sidebarClasses}>
        {isOpen && (
          <div className="flex flex-col h-full">
            {/* Branding */}
            <div className={`flex items-center justify-center h-24 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
              <a href="/" className="hover:scale-105 transition-transform duration-300">
                <img src={navbarlogo} alt="Logo" className="h-12 w-auto object-contain" />
              </a>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar space-y-8">
              {/* SECTION: Overview */}
              <div>
                <p className={`px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                  Overview
                </p>
                <ul className="space-y-1">
                  <NavItem href="/agent-dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" isActive={true} theme={theme} />
                  
                  <PermissionProtectedAction action="view" module="CustomerSupport Management">
                    <NavItem href="/viewallinquary" icon={<FileText size={20}/>} label="Customer Support" theme={theme} />
                  </PermissionProtectedAction>

                  <PermissionProtectedAction action="view" module="AgentSupport Management">
                    <NavItem href="/getresquset" icon={<MessageSquare size={20}/>} label="Requests" theme={theme} />
                  </PermissionProtectedAction>
                </ul>
              </div>

              {/* SECTION: Operations */}
              <div>
                <p className={`px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                  Management
                </p>
                <ul className="space-y-1">
                  <DropdownMenu
                    icon={<Users size={20} />}
                    label="Staffing"
                    menuKey="UserManagement"
                    theme={theme}
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    items={[
                      { href: "/addagent", label: "Add Staff", permission: { action: "create", module: "Team Management" } },
                      { href: "/viewallagentlist", label: "View Staff List", permission: { action: "view", module: "Team Management" } },
                    ]}
                  />

                  <DropdownMenu
                    icon={<ShoppingCart size={20} />}
                    label="Bookings"
                    menuKey="Bookings"
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    theme={theme}
                    items={[
                      { href: "/viewallbookings", label: "All Bookings", permission: { action: "view", module: "Booking Management" } },
                      { href: "/createbookingByAgent", label: "New Booking", permission: { action: "create", module: "Booking Management" } },
                    ]}
                  />

                  <DropdownMenu
                    icon={<Package size={20} />}
                    label="Property"
                    menuKey="Property"
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    theme={theme}
                    items={[
                      { href: "/addproperty", label: "Add New", permission: { action: "create", module: "Property Management" } },
                      { href: "/propertydetailsagent", label: "Details", permission: { action: "view", module: "Property Management" } }
                    ]}
                  />

                  <DropdownMenu
                    icon={<Banknote size={20} />}
                    label="Home Loans"
                    menuKey="homeloan"
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    theme={theme}
                    items={[
                      { href: "/viewhomeloanrequest", label: "View Request", permission: { action: "view", module: "Home Loan Management" } },
                      { href: "/homeloanrequestform", label: "Apply for Loan", permission: { action: "create", module: "Home Loan Management" } }
                    ]}
                  />

                  <DropdownMenu
                    icon={<Calendar size={20} />}
                    label="Appointments"
                    menuKey="Appointment"
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    theme={theme}
                    items={[
                      { href: "/selectappoinmentproperty", label: "Schedule New", permission: { action: "create", module: "Appoinment Management" } },
                      { href: "/getappoinment", label: "View Schedule", permission: { action: "view", module: "Appoinment Management" } }
                    ]}
                  />

                  <DropdownMenu
                    icon={<Briefcase size={20} />}
                    label="Sessions"
                    menuKey="ManageSession"
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    theme={theme}
                    items={[
                      { href: "/viewallsession", label: "All Sessions", permission: { action: "view", module: "Session Management" } },
                      { href: "/createsession", label: "Create Session", permission: { action: "create", module: "Session Management" } }
                    ]}
                  />
                </ul>
              </div>

              {/* SECTION: Social */}
              <div className="pt-4 border-t border-slate-800/10 dark:border-slate-800/50">
                <PermissionProtectedAction action="view" module="Review Management">
                  <NavItem href="/customerreviews" icon={<Star size={20}/>} label="Reviews" theme={theme} />
                </PermissionProtectedAction>
              </div>
            </div>

            {/* Footer / Profile Placeholder */}
            <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
               <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">A</div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate">Agent Portal</p>
                    <p className="text-[10px] opacity-50 truncate">Support Staff</p>
                  </div>
                  <ShieldCheck size={16} className="text-blue-500" />
               </div>
            </div>
          </div>
        )}
      </aside>

      {/* Global CSS for Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: ${isDark ? '#334155' : '#cbd5e1'}; 
          border-radius: 10px; 
        }
      `}</style>
    </div>
  );
}

// Sub-component: NavItem
function NavItem({ href, icon, label, isActive = false, theme }) {
  const isDark = theme === 'dark';
  return (
    <li>
      <a
        href={href}
        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative
        ${isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          : isDark 
            ? "hover:bg-slate-800/80 text-slate-400 hover:text-white" 
            : "hover:bg-gray-100 text-gray-600 hover:text-blue-600"
        }`}
      >
        <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-blue-500'}`}>
          {icon}
        </span>
        <span className="ml-3 text-sm font-semibold tracking-wide">{label}</span>
      </a>
    </li>
  );
}

// Sub-component: DropdownMenu
function DropdownMenu({ icon, label, menuKey, openDropdown, toggleDropdown, items, theme }) {
  const isOpen = openDropdown === menuKey;
  const isDark = theme === 'dark';

  return (
    <li>
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group
        ${isOpen 
          ? isDark ? "bg-slate-800 text-white" : "bg-blue-50 text-blue-600"
          : isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-gray-100 text-gray-600"}`}
      >
        <span className={`transition-transform duration-200 group-hover:scale-110 ${isOpen ? 'text-blue-500' : 'text-blue-500/70'}`}>
          {icon}
        </span>
        <span className="ml-3 text-sm font-semibold tracking-wide flex-1 text-left">{label}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : "opacity-40"}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-96 py-2" : "max-h-0"}`}>
        <ul className={`ml-6 border-l-2 ${isDark ? 'border-slate-800' : 'border-gray-100'} space-y-1`}>
          {items.map((item, idx) => {
            const content = (
              <a
                href={item.href}
                className={`flex items-center py-2 px-5 text-xs font-medium rounded-r-lg transition-all duration-200
                ${isDark ? "text-slate-500 hover:text-blue-400 hover:bg-blue-400/5" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-3 ${isDark ? 'bg-slate-700' : 'bg-gray-300'}`}></span>
                {item.label}
              </a>
            );

            return (
              <li key={idx}>
                {item.permission ? (
                  <PermissionProtectedAction action={item.permission.action} module={item.permission.module}>
                    {content}
                  </PermissionProtectedAction>
                ) : content}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}