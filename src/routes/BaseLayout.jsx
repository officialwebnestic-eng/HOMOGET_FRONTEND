import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useSidebar } from "../context/SidebarContext";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import AgentSidebar from "../components/sidebar/AgentSidebar";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import { AnimatePresence } from "framer-motion";

const BaseLayout = () => {
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();
  const isDark = theme === "dark";

  const renderSidebar = () => {
    if (user?.role === "admin") return <AdminSidebar />;
    return <AgentSidebar />;
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    }`}>
      
      
      
            <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {renderSidebar()}
      </aside>

      <main 
        className={`flex-1 flex flex-col h-full min-w-0 relative transition-all duration-300 ease-in-out ${
          isOpen ? "lg:ml-72" : "ml-0"
        }`}
      >
        <header className="flex-shrink-0 w-full z-40">
           <Navbar />
        </header>

        <div className="flex-1 overflow-y-auto scroll-smooth px-4 py-6 md:px-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;