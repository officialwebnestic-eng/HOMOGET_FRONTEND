import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Bed, Ruler, ArrowRight, ChevronRight } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import AgentHero from "./AgentHero";

const themeColors = {
  light: { background: "bg-gray-50", card: "bg-white", text: "text-gray-800", textSecondary: "text-gray-600", border: "border-gray-200" },
  dark: { background: "bg-gray-900", card: "bg-gray-800", text: "text-gray-100", textSecondary: "text-gray-300", border: "border-gray-700" }
};

const Agentfilter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ city: "", propertytype: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();

  const { propertyList = [], loading } = useGetAllProperty(currentPage, 20, filters);

  // Optimized Navigation to Detail Page
  const handlePropertyClick = useCallback((property) => {
    navigate(`/property/${property._id}`, { state: { propertyData: property } });
  }, [navigate]);

  return (
    <div className={`${colors.background} min-h-screen pb-20`}>
      <AgentHero 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        propertyList={propertyList} filters={filters}
        handleFilterChange={(e) => setFilters({...filters, [e.target.name]: e.target.value})}
        handleSubmit={() => setFilters(prev => ({ ...prev, city: searchQuery }))}
        resetFilters={() => setFilters({ city: "", propertytype: "" })}
        colors={{ primary: "bg-amber-500" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        
        {/* SECTION 1: ELITE SELECTION (3 LARGE CARDS) */}
        <div className={`rounded-[2.5rem] ${colors.card} p-6 md:p-12 mb-16 border ${colors.border} shadow-2xl`}>
          <div className="flex justify-between items-end mb-10">
             <h2 className={`text-3xl md:text-4xl font-serif ${colors.text}`}>Featured <span className="text-amber-500 italic">Living</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.slice(0, 3).map((property) => (
              <motion.div 
                key={property._id}
                onClick={() => handlePropertyClick(property)}
                whileHover={{ y: -10 }}
                className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl"
              >
                <img src={property.image?.[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="px-4 py-1.5 bg-amber-500 text-black text-[9px] font-black uppercase rounded-full">{property.propertytype}</span>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-amber-500 text-[10px] font-black uppercase mb-1">{property.city}, UAE</p>
                  <h3 className="text-2xl font-serif mb-6">{property.propertyname}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold">AED {property.price?.toLocaleString()}</p>
                    <div className="p-3 bg-amber-500 text-black rounded-2xl"><ArrowRight size={20}/></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 2: MARKET INSIGHTS (SMALLER CARDS) */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-serif mb-8 ${colors.text}`}>Market <span className="text-amber-500 italic">Insights</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyList.slice(3).map((property) => (
              <motion.div
                key={property._id}
                onClick={() => handlePropertyClick(property)}
                whileHover={{ x: 5 }}
                className={`group p-4 rounded-[1.5rem] ${colors.card} border ${colors.border} flex items-center gap-5 cursor-pointer hover:border-amber-500/50 transition-all`}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={property.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className={`font-bold text-sm mb-1 truncate ${colors.text}`}>{property.propertyname}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span className={`text-[10px] font-black uppercase ${colors.textSecondary}`}>{property.city}</span>
                  </div>
                  <p className="text-amber-500 font-black text-sm">AED {property.price?.toLocaleString()}</p>
                </div>
                <ChevronRight className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agentfilter;