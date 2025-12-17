import { useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Home,
  Users,
  Shield,
  BarChart2,
  CreditCard,
  Building,
  Mail,
  HelpCircle,
  Contact,
  ShoppingCart,
  Star,
  ClipboardList,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { useSidebar } from "../../context/SidebarContext";
import {  navbarlogo } from "../../ExportImages";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { theme } = useTheme();
  const { toggleSidebar, isOpen } = useSidebar();

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg transition-all bg-indigo-600 text-white shadow-lg ${
          isOpen ? "left-64" : ""
        }`}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"} shadow-xl`}
        aria-hidden={!isOpen}
      >
        {isOpen && (
          <>
            {/* Logo */}
            <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-800 px-4">
              <a href="/" className="flex items-center space-x-2">
                <img
                  src={navbarlogo}
                  alt="Company Logo"
                  className="w-20 md:w-24 object-contain transition-all duration-200"
                />
              </a>
            </div>

            {/* Scrollable menu */}
            <div className="h-[calc(100vh-5rem)] overflow-y-auto py-4 px-2">
              <ul className="space-y-2 font-medium">
                {/* Dashboard */}
                <NavItem
                  href="/admin-dashboard"
                  icon={<Home className="w-5 h-5 text-purple-600" />}
                  label="Dashboard"
                  isActive={true}
                  theme={theme}
                />

                {/* Other menu items with dropdowns */}
                <DropdownMenu
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  label="User Management"
                  menuKey="UserManagement"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/viewallagentlist", label: "View Agent List" },
                    { href: "/addagent", label: "Add Agent" },
                  ]}
                />

                <DropdownMenu
                  icon={<Building className="w-5 h-5 text-purple-600" />}
                  label="Properties"
                  menuKey="Properties"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/addproperty", label: "Add Property" },
                    { href: "/viewpropertylist", label: "Property List" },
                    { href: "/propertydetails", label: "Property Details" },
                  ]}
                />

                <DropdownMenu
                  icon={<CreditCard className="w-5 h-5 text-purple-600" />}
                  label="Transactions"
                  menuKey="Transactions"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/getalltransaction", label: "All Transactions" },
                    { href: "/payments", label: "Payments" },
                    { href: "/commissions", label: "Commissions" },
                  ]}
                />

                <DropdownMenu
                  icon={<CreditCard className="w-5 h-5 text-purple-600" />}
                  label="Appointment"
                  menuKey="Appointment"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/getappoinment", label: "All Appointments" },
                    { href: "/selectappoinmentproperty", label: "Create Appointment" },
                  ]}
                />

                {/* User Property Sell Requests */}
                <NavItem
                  href="/viewpropertyrequest"
                  icon={<BarChart2 className="w-5 h-5 text-purple-600" />}
                  label="User Property Sell Request"
                  theme={theme}
                />

                {/* Bookings */}
                <DropdownMenu
                  icon={<ShoppingCart className="w-5 h-5 text-purple-600" />}
                  label="Bookings"
                  menuKey="Bookings"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/viewallbookings", label: "View Booking" },
                  ]}
                />

                {/* Home Loan */}
                <DropdownMenu
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  label="Home Loan"
                  menuKey="HomeLoan"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/viewhomeloanrequest", label: "View Request" },
                    { href: "/homeloanrequestform", label: "Request Loan" },
                  ]}
                />

                {/* Blog Management */}
                <DropdownMenu
                  icon={<Shield className="w-5 h-5 text-purple-600" />}
                  label="Blog Management"
                  menuKey="Blog"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/createblog", label: "Create Blogs" },
                    { href: "/viewbloglist", label: "View All Blogs" },
                  ]}
                />

                {/* Manage Session */}
                <DropdownMenu
                  icon={<Contact className="w-5 h-5 text-purple-600" />}
                  label="Manage Session"
                  menuKey="ManageSession"
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  items={[
                    { href: "/viewallsession", label: "View All Sessions" },
                    { href: "/createsession", label: "Create Session" },
                  ]}
                />

                {/* Tour List */}
                <NavItem
                  href="/gettourbooking"
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                  label="Tour List"
                  theme={theme}
                />

                {/* View Agent Call Request */}
                <NavItem
                  href="/getresquset"
                  icon={<ClipboardList className="w-5 h-5 text-purple-600" />}
                  label="View Agent Call Request"
                  theme={theme}
                />

                {/* Divider and Settings */}
                <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-4">
                  <DropdownMenu
                    icon={<Shield className="w-5 h-5 text-purple-600" />}
                    label="Configuration"
                    menuKey="Configuration"
                    openDropdown={openDropdown}
                    toggleDropdown={toggleDropdown}
                    items={[
                      { href: "/permissions", label: "Permissions" },
                      { href: "/roles", label: "Roles" },
                    ]}
                  />

                  <NavItem
                    href="/customerreviews"
                    icon={<Star className="w-5 h-5 text-purple-600" />}
                    label="Customer Reviews"
                    theme={theme}
                  />

                  <NavItem
                    href="/help"
                    icon={<HelpCircle className="w-5 h-5 text-purple-600" />}
                    label="Help Center"
                    theme={theme}
                  />
                </div>
              </ul>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

// Navigation item component
function NavItem({ href, icon, label, isActive = false, theme }) {
  return (
    <li>
      <a
        href={href}
        className={`flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer ${
          isActive
            ? theme === "dark"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25"
              : "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
            : theme === "dark"
            ? "hover:bg-slate-800 hover:text-white"
            : "hover:bg-white hover:text-gray-900"
        }`}
      >
        <span
          className={`flex-shrink-0 ${isActive ? "text-white" : "text-purple-600"}`}
        >
          {icon}
        </span>
        <span className={`ml-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {label}
        </span>
      </a>
    </li>
  );
}

// Dropdown menu component
function DropdownMenu({
  icon,
  label,
  menuKey,
  openDropdown,
  toggleDropdown,
  items,
}) {
  const isOpen = openDropdown === menuKey;

  return (
    <li>
      <button
        onClick={() => toggleDropdown(menuKey)}
        className={`flex items-center w-full p-3 rounded-lg transition-colors ${
          isOpen ? "bg-gray-100 dark:bg-gray-800 text-indigo-600" : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        aria-expanded={isOpen}
      >
        <span
          className={`${
            isOpen ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          {icon}
        </span>
        <span className="ml-3 flex-1 text-left">{label}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <ul className="ml-8 mt-1 space-y-1">
          {items.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="block py-2 px-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}