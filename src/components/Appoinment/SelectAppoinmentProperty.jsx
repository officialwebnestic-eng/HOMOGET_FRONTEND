import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Ruler, Bed, Bath, MapPin, IndianRupee, Home, Building2, Barcode, Wrench,
  Search, ArrowRight, X, ChevronDown, Filter, Sparkles
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";
import { useLoading } from "../../model/LoadingModel";

const SelectAppointmentProperty = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ city: "", propertytype: "", listingtype: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const limit = 6;
  const { propertyList, loading, pagination } = useGetAllProperty(currentPage, limit, filters);
  const LoadingModel = useLoading({ type: "cards", count: 3 });

  // Luxury Theme Palette
  const colors = {
    brand: "#C5A059", // Dubai Gold
    bg: isDark ? "bg-slate-950" : "bg-slate-50",
    card: isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200",
    text: isDark ? "text-slate-100" : "text-slate-900",
    sub: isDark ? "text-slate-400" : "text-slate-500",
    accent: "from-amber-600 to-amber-400"
  };

  const handleBuyNow = (property) => navigate("/createappoinment", { state: { property } });

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-500 pb-20`}>
      
      {/* --- HERO HEADER --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={12} /> Personalized Viewings
            </span>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter ${colors.text}`}>
              Pick Your <span className="italic font-serif font-light text-amber-600">Sanctuary.</span>
            </h1>
            <p className={`max-w-xl mx-auto text-lg ${colors.sub}`}>
              Select a property from our signature collection to schedule your private tour.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- SEARCH & FILTER COMMAND CENTER --- */}
      <div className="max-w-5xl mx-auto px-6 mb-16 sticky top-24 z-30">
        <div className={`p-2 rounded-[2rem] border backdrop-blur-xl shadow-2xl ${colors.card} flex flex-col md:flex-row gap-2`}>
          <div className="flex-1 flex items-center px-4 gap-3">
            <Search className="text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search by city or property name..."
              className="w-full bg-transparent py-4 outline-none text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 p-1">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-6 py-3 rounded-2xl border ${isFilterOpen ? 'bg-amber-600 border-amber-600 text-white' : colors.card} text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all`}
            >
              <Filter size={14} /> Filters
            </button>
            <button 
              onClick={() => setFilters({ ...filters, city: searchQuery })}
              className="px-8 py-3 rounded-2xl bg-amber-600 text-white text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/20"
            >
              Find
            </button>
          </div>
        </div>

        {/* Extended Filters Drawer */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mt-4 overflow-hidden rounded-[2rem] border ${colors.card} p-8 shadow-2xl`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['propertytype', 'listingtype', 'state'].map((key) => (
                  <div key={key} className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-600">{key.replace('type', ' Type')}</label>
                    <select 
                      onChange={(e) => setFilters({...filters, [key]: e.target.value})}
                      className={`w-full p-4 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'} text-sm`}
                    >
                      <option value="">All {key.replace('type', 's')}</option>
                      {/* Mapping unique values here */}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- PROPERTY GRID --- */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <LoadingModel loading={true} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {propertyList.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group relative rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${colors.card} hover:shadow-2xl hover:shadow-amber-900/10`}
              >
                {/* Media Section */}
                <div className="h-72 relative overflow-hidden">
                  <Swiper
                    modules={[Autoplay, Pagination, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 3000 + idx * 500 }}
                    pagination={{ clickable: true }}
                    className="h-full"
                  >
                    {property.image?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="property" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute top-6 left-6 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {property.listingtype}
                    </span>
                  </div>
                  <div className="absolute bottom-6 right-6 z-10">
                    <div className="px-4 py-2 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center gap-1 shadow-xl">
                      <IndianRupee size={14} /> {property.price}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className={`text-2xl font-bold tracking-tight mb-2 group-hover:text-amber-600 transition-colors ${colors.text}`}>
                      {property.propertyname}
                    </h3>
                    <div className={`flex items-center gap-1 text-xs font-medium ${colors.sub}`}>
                      <MapPin size={14} className="text-amber-600" /> {property.city}, {property.state}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-800/50">
                    <div className="text-center">
                      <Bed size={16} className="mx-auto mb-1 text-amber-600" />
                      <p className={`text-[10px] font-black uppercase tracking-tighter ${colors.text}`}>{property.bedroom} Bed</p>
                    </div>
                    <div className="text-center">
                      <Bath size={16} className="mx-auto mb-1 text-amber-600" />
                      <p className={`text-[10px] font-black uppercase tracking-tighter ${colors.text}`}>{property.bathroom} Bath</p>
                    </div>
                    <div className="text-center">
                      <Ruler size={16} className="mx-auto mb-1 text-amber-600" />
                      <p className={`text-[10px] font-black uppercase tracking-tighter ${colors.text}`}>{property.squarefoot} ft²</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedProperty(property)}
                      className={`flex-1 py-4 rounded-2xl border ${colors.card} text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all`}
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => handleBuyNow(property)}
                      className="flex-[2] py-4 rounded-2xl bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/20"
                    >
                      Schedule viewing <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* --- DETAILED OVERLAY MODAL --- */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setSelectedProperty(null)} />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full max-w-6xl h-full ${colors.card} border rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row`}
            >
               {/* Left Media (60%) */}
               <div className="md:w-3/5 h-64 md:h-auto relative">
                 <img src={selectedProperty.image[0]} className="w-full h-full object-cover" alt="hero" />
                 <button onClick={() => setSelectedProperty(null)} className="absolute top-8 left-8 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-amber-600 transition-all">
                   <X size={20} />
                 </button>
               </div>

               {/* Right Info (40%) */}
               <div className="md:w-2/5 p-12 overflow-y-auto custom-scrollbar flex flex-col justify-between">
                 <div>
                    <span className="text-amber-600 font-black uppercase tracking-widest text-[10px]">{selectedProperty.propertytype}</span>
                    <h2 className={`text-4xl font-black tracking-tighter mt-2 mb-8 ${colors.text}`}>{selectedProperty.propertyname}</h2>
                    
                    <div className="space-y-8">
                       <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pricing</p>
                          <p className="text-2xl font-black text-amber-500">₹{selectedProperty.price}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Location</p>
                            <p className={`text-sm font-bold ${colors.text}`}>{selectedProperty.city}, {selectedProperty.state}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Floor</p>
                            <p className={`text-sm font-bold ${colors.text}`}>{selectedProperty.floor} of 20</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                   onClick={() => { handleBuyNow(selectedProperty); setSelectedProperty(null); }}
                   className="mt-12 w-full py-5 rounded-2xl bg-amber-600 text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-amber-900/40 hover:bg-amber-700 transition-all"
                 >
                    Confirm Tour
                 </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectAppointmentProperty;