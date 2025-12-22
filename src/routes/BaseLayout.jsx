import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import AgentSidebar from "../components/sidebar/AgentSidebar";
import { AuthContext } from "../context/AuthContext";

const BaseLayout = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();

  let SidebarComponent = null;

  if (user?.role === "admin") {
    SidebarComponent = <AdminSidebar />;
  } else if (user?.role && user.role !== "user") {
    SidebarComponent = <AgentSidebar />;
  }

  
  return (
    <div
      className={`flex h-screen w-full relative overflow-hidden ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      {SidebarComponent && (
        <div
          className={`fixed z-50 w-64 transition-all duration-300 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {SidebarComponent}
        </div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 p-4 mt-16 ${
          isOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default BaseLayout;
