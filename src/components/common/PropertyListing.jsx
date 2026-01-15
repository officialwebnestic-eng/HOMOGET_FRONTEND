import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Bed, Ruler, X, ArrowRight, Search, Filter, Calendar, Sparkles
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";

const PropertyListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const limit = 6;
  const listRef = useRef(null);

  const { propertyList, loading } = useGetAllProperty(currentPage, limit, filters);

  const colors = {
    amber: "text-amber-500",
    bgAmber: "bg-amber-500",
    text: isDark ? "text-white" : "text-[#1a1a1e]",
    textSec: isDark ? "text-slate-400" : "text-slate-600",
    border: isDark ? "border-white/10" : "border-slate-200",
    inputBg: isDark ? "bg-white/10" : "bg-slate-100",
  };

  const getUniqueValues = (data, key) => {
    if (!data) return [];
    return [...new Set(data.map((item) => item[key]).filter(Boolean))].sort();
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0a0a0c]" : "bg-white"}`}>
      
      {/* --- HERO SECTION: PRIVACY POLICY STYLE --- */}
      <section className="relative w-full h-[80vh] flex items-center overflow-hidden">
        {/* Background Overlay Logic */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent" : "bg-gradient-to-r from-white via-white/90 to-transparent"}`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl space-y-6">
            {/* Top Badge */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={12} className="text-amber-500" /> Premium Collection
              </span>
            </motion.div>

            {/* Typography inspired by Screenshot */}
            <div className="space-y-0">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className={`text-7xl md:text-8xl font-black tracking-tighter ${colors.text} leading-[0.85]`}
              >
                Property
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-7xl md:text-8xl font-serif italic font-light text-amber-500 leading-[1.1]"
              >
                Listings
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className={`max-w-md text-lg leading-relaxed ${colors.textSec}`}
            >
              Homoget Properties offers a verified portfolio of luxury assets, ensuring full compliance with UAE market regulations and transparency.
            </motion.p>

            {/* --- SEARCH & FILTER HUB --- */}
            <div className="pt-6 relative z-50">
              <div className={`flex flex-col md:flex-row items-center p-2 rounded-2xl md:rounded-full border ${colors.border} ${colors.inputBg} backdrop-blur-xl shadow-2xl w-full max-w-2xl`}>
                <div className="flex-1 flex items-center px-4 w-full">
                  <Search className="text-amber-500 w-5 h-5 mr-3" />
                  <input 
                    type="text" 
                    placeholder="Search city or project..." 
                    className={`bg-transparent border-none outline-none text-sm w-full py-3 focus:ring-0 ${colors.text}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${showFilters ? 'text-amber-500' : 'text-slate-500'}`}
                >
                  <Filter size={16} /> Filters
                </button>

                <button className="w-full md:w-auto bg-amber-500 text-black px-10 py-4 rounded-xl md:rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all">
                  Search
                </button>
              </div>

              {/* Advanced Filters Dropdown */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className={`absolute left-0 right-0 mt-4 p-6 rounded-[2rem] border ${colors.border} ${isDark ? "bg-[#121214]" : "bg-white"} shadow-3xl grid grid-cols-1 md:grid-cols-3 gap-6`}
                  >
                    {['city', 'propertytype', 'bedroom'].map((field) => (
                      <div key={field}>
                        <label className="text-[9px] font-black uppercase text-amber-500 tracking-widest block mb-2">{field}</label>
                        <select 
                          value={filters[field] || ""}
                          onChange={(e) => setFilters({...filters, [field]: e.target.value})}
                          className={`w-full bg-white/5 border ${colors.border} rounded-xl py-2.5 px-4 text-xs outline-none ${colors.text}`}
                        >
                          <option value="" className={isDark ? "bg-[#0a0a0c]" : "bg-white"}>All {field}s</option>
                          {getUniqueValues(propertyList, field).map(v => (
                            <option key={v} value={v} className={isDark ? "bg-[#0a0a0c]" : "bg-white"}>{v}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROPERTY GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {propertyList.map((property, index) => (
            <motion.div 
              key={property._id || index}
              whileHover={{ y: -10 }}
              className={`group relative h-[450px] rounded-[2.5rem] overflow-hidden border ${colors.border} bg-white/5`}
            >
              <img src={property.image?.[0]} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              <div className="absolute top-8 left-8">
                <span className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest">
                  {property.propertytype}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-6 group-hover:translate-y-0 transition-all duration-500">
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">{property.city}</p>
                <h3 className="text-3xl font-serif text-white mb-6 leading-tight">{property.propertyname}</h3>
                <div className="flex gap-6 mb-8 text-white/60 text-xs font-bold">
                  <span className="flex items-center gap-2"><Bed size={16} className="text-amber-500" /> {property.bedroom} BHK</span>
                  <span className="flex items-center gap-2"><Ruler size={16} className="text-amber-500" /> {property.squarefoot} ft²</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedProperty(property)}
                    className="flex-1 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                  >
                    View Asset
                  </button>
                  <button onClick={() => navigate("/bookings", { state: { property } })} className="p-4 bg-amber-500 text-black rounded-2xl hover:scale-110 transition-transform">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- COMPACT MODAL --- */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex justify-center items-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`max-w-5xl w-full bg-[#0a0a0c] rounded-[3rem] overflow-hidden border border-white/10 relative max-h-[90vh] overflow-y-auto`}>
               <button onClick={() => setSelectedProperty(null)} className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-amber-500 hover:text-black flex items-center justify-center transition-all"><X size={24}/></button>
               <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-[400px] lg:h-full bg-black"><img src={selectedProperty.image?.[currentImageIndex]} className="w-full h-full object-cover opacity-80" /></div>
                  <div className="p-12 space-y-8">
                     <h2 className="text-5xl font-serif text-white">{selectedProperty.propertyname}</h2>
                     <p className="text-amber-500 font-black uppercase tracking-widest text-xs">{selectedProperty.city}</p>
                     <div className="p-8 rounded-[2rem] bg-amber-500 text-black">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Asset Value</p>
                        <p className="text-5xl font-serif">₹{selectedProperty.price.toLocaleString()}</p>
                     </div>
                     <button className="w-full py-5 bg-amber-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-amber-400 transition-all">Schedule Appointment</button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyListing;