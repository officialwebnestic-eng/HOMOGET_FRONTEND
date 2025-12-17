import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import AgentSidebar from "../components/sidebar/AgentSidebar";
import { AuthContext } from "../context/AuthContext";

const BaseLayout = ({ userRole }) => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();

  let sidebarcomponent = null;

  if (user.role ===  "admin") {
    sidebarcomponent = <AdminSidebar />;
  } else if (user.role && user.role !== "user") {

    sidebarcomponent = <AgentSidebar />;
  } else {
    sidebarcomponent = null; 
  }
// 
  return (
    <div
      className={`flex h-screen w-full relative overflow-hidden ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      <div
        className={`fixed lg:relative z-50 transition-all duration-300 ease-in-out ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {sidebarcomponent}
      </div>

      <div
        className={`flex-1 overflow-auto transition-all mt-16 duration-300 ${
          isOpen ? "lg:ml-64 ml-0 " : "lg:ml-2 ml-0"
        } p-4 mt-4`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default BaseLayout;
