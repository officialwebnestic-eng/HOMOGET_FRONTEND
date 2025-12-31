import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import AgentSidebar from "../components/sidebar/AgentSidebar";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";

const BaseLayout = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();
  const isDark = theme === "dark";

 const renderSidebar = () => {
  // If the user is specifically an admin, show the Admin Sidebar
  if (user?.role === "admin") {
    return <AdminSidebar />;
  }

  // For any other role (agent, user, guest), show the Agent Sidebar
  return <AgentSidebar />;
};

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebar()}
      </aside>

      {/* Main Wrapper - The margin moves EVERYTHING inside (Navbar + Content) */}
      <main 
        className={`flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300 ease-in-out ${
          isOpen ? "lg:ml-72" : "ml-0"
        }`}
      >
        {/* Navbar is first child of Main */}
        <Navbar />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;




