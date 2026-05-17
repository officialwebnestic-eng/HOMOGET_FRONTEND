import React, { useState } from 'react';
import WalkThroughPage from './WalkThroughPage';
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HomeModernIcon, 
  ViewfinderCircleIcon, 
  CalendarIcon,
  ArrowsPointingOutIcon 
} from "@heroicons/react/24/outline";

const VirtualTourAndWalkthrough = () => {
  const { theme } = useTheme();
  // State to track which room the 3D canvas should focus on
  const [activeRoom, setActiveRoom] = useState(null);

  const isDark = theme === "dark";
  const activeColor = isDark ? "text-teal-400" : "text-blue-600";

  const rooms = [
    {
      id: "living",
      name: "Living Room",
      position: [2, 2, 5], // Coordinates for the 3D Camera
      description: "Elegant fireplace and expansive modern design.",
      image: "https://images.pexels.com/photos/2425012/pexels-photo-2425012.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "bedroom",
      name: "Master Suite",
      position: [-5, 2, -2],
      description: "Spacious layout with premium interactive points.",
      image: "https://images.pexels.com/photos/1777023/pexels-photo-1777023.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "kitchen",
      name: "Gourmet Kitchen",
      position: [0, 2, -8],
      description: "Modern appliances and chef-grade countertops.",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: "bathroom",
      name: "Luxury Bath",
      position: [4, 2, -4],
      description: "Premium finishes and spa-like amenities.",
      image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-all duration-500 ${isDark ? "bg-[#0f172a]" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* --- HEADER --- */}
        <header className="text-center mb-20">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`inline-flex p-3 rounded-2xl mb-6 ${isDark ? "bg-teal-500/10" : "bg-blue-50"}`}>
              <HomeModernIcon className={`h-10 w-10 ${activeColor}`} />
            </div>
            <h1 className={`text-5xl font-black tracking-tight mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Twin</span> Exploration
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Experience a high-fidelity 3D reconstruction of the property. Use the controls below to jump between curated perspectives.
            </p>
          </motion.div>
        </header>

        {/* --- MAIN 3D SHOWCASE --- */}
        <div className="relative group mb-20">
          <motion.div 
            layout
            className={`relative rounded-[2.5rem] overflow-hidden border-4 shadow-2xl transition-all
              ${isDark ? "border-slate-800 bg-slate-900" : "border-white bg-white"}`}
            style={{ height: '600px' }}
          >
            {/* The 3D Engine Component */}
            <WalkThroughPage activeRoom={activeRoom} />
            
            {/* Overlay UI Controls */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-white text-xs font-bold border border-white/10">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE 3D RENDER
              </div>
            </div>

            <button className="absolute bottom-6 right-6 p-4 bg-white/10 backdrop-blur-xl hover:bg-white/20 rounded-2xl border border-white/20 transition-all">
              <ArrowsPointingOutIcon className="h-6 w-6 text-white" />
            </button>
          </motion.div>
        </div>

        {/* --- ROOM NAVIGATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {rooms.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -10 }}
              onClick={() => setActiveRoom(room)}
              className={`cursor-pointer group relative rounded-3xl overflow-hidden border-2 transition-all p-2
                ${activeRoom?.id === room.id 
                  ? (isDark ? "border-teal-500 bg-teal-500/5" : "border-blue-500 bg-blue-50") 
                  : (isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white")
                }`}
            >
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <ViewfinderCircleIcon className="absolute bottom-4 right-4 h-8 w-8 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-3 pb-3">
                <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{room.name}</h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>{room.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- BOOKING CTA --- */}
        <motion.div 
          className={`mt-32 p-12 rounded-[3rem] text-center relative overflow-hidden
            ${isDark ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200 shadow-xl"}`}
        >
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-1 w-32 rounded-b-full ${isDark ? "bg-teal-500" : "bg-blue-500"}`} />
          <CalendarIcon className={`h-12 w-12 mx-auto mb-6 ${activeColor}`} />
          <h2 className={`text-4xl font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>Live Guided Tour</h2>
          <p className={`text-lg mb-10 max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Prefer a guided experience? Join a live session with our property specialist.
          </p>
          <NavLink
            to="/virtualtoure"
            className="px-10 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform inline-flex items-center gap-2"
          >
            Reserve Your Slot
            <ArrowsPointingOutIcon className="h-5 w-5 rotate-45" />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
};

export default VirtualTourAndWalkthrough;