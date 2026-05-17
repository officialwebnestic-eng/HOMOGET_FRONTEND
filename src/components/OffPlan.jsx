import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, ChevronDown, Calendar, Phone, MessageSquare, Crown
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";

const OffPlan = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // --- 1. UPDATED STATE TO MATCH ALL FILTER KEYS ---
  const [filters, setFilters] = useState({
    propertyListingType: "project",
    developerName: "",
    city: "",
    propertytype: "",
    bedroom: "",    // Matches lowercase for API consistency
    bathroom: "",
    squarefoot: "",
    floor: ""
  });

  const { propertyList = [], loading } = useGetAllProperty(1, 100, filters);

  // --- 2. DEFINE FILTER CONFIGURATION ---
  // Using lowercase keys for logic, but uppercase labels for display
  const filterConfig = [
    { key: "developerName", label: "Developer" },
    { key: "city", label: "City" },
    { key: "propertytype", label: "Type" },
    { key: "bedroom", label: "Bedrooms" },
    { key: "bathroom", label: "Bathrooms" },
    { key: "squarefoot", label: "Area" },
    { key: "floor", label: "Floor" }
  ];

  const displayedProperties = useMemo(() => {
    if (!propertyList || propertyList.length === 0) return [];
    return propertyList.filter(item => item.propertyListingType === "project");
  }, [propertyList]);

  const getUniqueOptions = (fieldName) => {
    // Note: If your data uses "bedroom" but the key is "BEDROOM", adjust fieldName here
    return [...new Set(propertyList.map(item => item[fieldName]).filter(Boolean))].sort();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[65vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Off Plan Projects"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/40'}`} />
        </div>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-8 shadow-xl">
               <Crown size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">Exclusive Off-Plan</span>
             </div>
             <h1 className={`text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Off-Plan <br/> <span className="text-amber-500 italic font-serif lowercase">Projects</span>
             </h1>
          </motion.div>
        </div>
      </section>

      {/* FILTER BAR - UPDATED FOR MULTI-ROW GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-24 relative z-30">
        <div className={`p-8 rounded-[3.5rem] border shadow-2xl backdrop-blur-xl ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
             {filterConfig.map((field) => (
                <div key={field.key} className="relative">
                  <select
                    name={field.key}
                    value={filters[field.key]}
                    onChange={handleFilterChange}
                    className={`w-full pl-6 pr-10 py-5 rounded-3xl text-[10px] font-black uppercase appearance-none outline-none border transition-all ${isDark ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-black'}`}
                  >
                    <option value="">{field.label}</option>
                    {getUniqueOptions(field.key).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none" />
                </div>
             ))}
             <button className="bg-amber-500 text-black text-[11px] font-black uppercase rounded-3xl py-5 hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/20">
                Update Search
             </button>
          </div>
        </div>
      </div>

      {/* PROPERTY GRID */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Fetching Projects...</span>
          </div>
        ) : displayedProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {displayedProperties.map((item) => (
              <motion.div 
                key={item._id}
                whileHover={{ y: -15 }}
                className={`group rounded-[4rem] overflow-hidden border shadow-2xl transition-all duration-500 ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-white border-slate-100'}`}
              >
                {/* ... (Image Section remains same as your original) */}
                <div className="relative h-80 overflow-hidden">
                  <img src={item.image?.[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.propertyname} />
                  <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg border border-white/20">
                    {item.propertytype}
                  </div>
                  <div className="absolute top-8 right-8 flex flex-col gap-3 z-20">
                    <a href={`https://wa.me/${item.agentId?.phone}`} className="p-4 bg-[#25D366] text-white rounded-full"><MessageSquare size={18} fill="currentColor" /></a>
                    <a href={`tel:${item.agentId?.phone}`} className="p-4 bg-[#007AFF] text-white rounded-full"><Phone size={18} fill="currentColor" /></a>
                  </div>
                </div>

                <div className="p-10 cursor-pointer" onClick={() => navigate(`/property/${item._id}`, { state: { propertyData: item } })}>
                  <p className="text-amber-500 text-[11px] font-black uppercase tracking-[0.3em] mb-3">{item.developerName || "Premium Project"}</p>
                  <h3 className={`text-2xl font-serif italic mb-8 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.propertyname}</h3>
                  <div className="flex items-center justify-between pt-8 border-t border-black/5 dark:border-white/5">
                    <div className="flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60 dark:text-white/60"><MapPin size={14} className="text-amber-500" /> {item.city}</span>
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase opacity-60 dark:text-white/60"><Calendar size={14} className="text-amber-500" /> {item.deliveryDate || "TBA"}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-amber-500 font-black text-2xl italic tracking-tighter">AED {Number(item.price).toLocaleString()}</p>
                       <p className="text-[8px] uppercase font-black opacity-40 dark:text-white">Starting From</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <p className={`text-xl font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>No Projects Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffPlan;