import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
 ArrowUpRight, Phone, Mail, ArrowRight, MapPin, ChevronRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import AgentHero from "./AgentHero";
import { filterFields } from "../../../helpers/FiltersHelpers";

const themeColors = {
  light: { background: "bg-gray-50", card: "bg-white", text: "text-gray-900", textSecondary: "text-gray-600", border: "border-gray-200" },
  dark: { background: "bg-[#0a0a0c]", card: "bg-[#141417]", text: "text-white", textSecondary: "text-gray-400", border: "border-white/5" },
};

const Agentfilter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState({
    state: "", listingtype: "", propertytype: "", price: "",
    squarefoot: "", bedroom: "", bathroom: "", floor: "",
    city: "", aminities: "",
  });

  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();
  const memoizedFilters = useMemo(() => filters, [filters]);

  // Ensure we fetch enough properties to fill both sections (20 per page)
  const { propertyList = [], loading } = useGetAllProperty(currentPage, 20, memoizedFilters);

  const handlePropertyClick = useCallback((property) => {
    navigate(`/property/${property._id}`, { state: { propertyData: property } });
  }, [navigate]);



    const getUniqueValues = (data, key) => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.flatMap(item => item[key]))].filter(Boolean).sort();
  };

  // Logic to split the list
  const eliteProperties = propertyList.slice(0, 9);
  const insightProperties = propertyList.slice(9, 20);

  return (
    <div className={`${colors.background} min-h-screen pb-20 overflow-x-hidden transition-colors duration-300`}>
         <AgentHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        propertyList={propertyList || []} // Safe fallback for .slice()
        filters={filters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterFields={filterFields}
        getUniqueValues={getUniqueValues}
        handleFilterChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
        handleSubmit={() => setFilters((prev) => ({ ...prev, city: searchQuery }))}
        resetFilters={() => setFilters({ state: "", listingtype: "", propertytype: "", price: "", squarefoot: "", bedroom: "", bathroom: "", floor: "", city: "", aminities: "" })}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
       {/* SECTION 1: ELITE SELECTION */}
<div className={`rounded-[3.5rem] ${colors.card} p-8 md:p-14 mb-16 border ${colors.border} shadow-2xl`}>
  
  {/* Header with Title and subtle Desktop Redirect */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
    <div>
      <h2 className={`text-4xl md:text-5xl font-serif ${colors.text}`}>
        Elite <span className="text-amber-500 italic">Selection</span>
      </h2>
      <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2 font-bold">Handpicked Luxury Residences</p>
    </div>
    
    <button 
      onClick={() => navigate('/propertylisting')} 
      className="hidden md:flex items-center gap-3 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] group transition-all"
    >
      View Full Collection 
      <div className="w-10 h-10 rounded-full border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
        <ArrowUpRight size={18} />
      </div>
    </button>
  </div>

  {/* Property Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
    {eliteProperties.length > 0 ? (
      eliteProperties.map((property) => (
        <motion.div
          key={property._id}
          whileHover={{ y: -12 }}
          onClick={() => handlePropertyClick(property)}
          className="group relative h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-900 cursor-pointer"
        >
          <img
            src={property.image?.[0]} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            alt={property.propertyname}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent z-10" />

          {/* Badges */}
          <div className="absolute top-6 left-6 flex gap-2 z-20">
            <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase rounded-lg">
              {property.propertytype || "RESIDENCE"}
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/20">
              {property.propertyListingType === 'project' ? 'Off-Plan' : property.listingtype || 'Ready'}
            </span>
          </div>

          {/* Vertical Contact Icons */}
          <div className="absolute top-6 right-6 flex flex-col gap-3 z-30">
            <div className="w-9 h-9 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><FaWhatsapp size={18} /></div>
            <div className="w-9 h-9 bg-[#3b82f6] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Phone size={16} fill="currentColor" /></div>
            <div className="w-9 h-9 bg-amber-500 text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Mail size={16} /></div>
          </div>

          <div className="absolute bottom-8 left-8 right-8 z-20">
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{property.city}, UAE</p>
            <h3 className="text-2xl font-serif text-white leading-tight mb-6">{property.propertyname}</h3>
            <div className="flex items-center justify-between">
               <p className="text-xl font-bold text-white uppercase tracking-tighter">
                 AED {Number(property.price).toLocaleString()}
               </p>
               <div className="w-11 h-11 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg group-hover:bg-white transition-colors">
                 <ArrowRight size={22} />
               </div>
            </div>
          </div>
        </motion.div>
      ))
    ) : (
      !loading && (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-gray-500 font-bold uppercase tracking-widest">No elite properties found.</p>
        </div>
      )
    )}
  </div>

  {/* Bottom Main Action Button */}
  <div className="mt-20 flex flex-col items-center">
    <div className={`w-px h-12 bg-gradient-to-b from-transparent to-amber-500/50 mb-8`} />
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/properties')}
      className="group relative px-14 py-6 rounded-full bg-amber-500 text-black font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-amber-500/30 overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-4">
        Explore Full Collection
        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
      </span>
      <div className="absolute inset-0 bg-black/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </motion.button>
  </div>
</div>

        {/* SECTION 2: MARKET INSIGHTS */}
        {insightProperties.length > 0 && (
          <div className="mb-20">
            <h2 className={`text-2xl font-serif mb-8 ${colors.text}`}>
              Market <span className="text-amber-500 italic">Insights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insightProperties.map((property) => (
                <motion.div
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  whileHover={{ x: 8 }}
                  className={`group p-4 rounded-[2rem] ${colors.card} border ${colors.border} flex items-center gap-5 cursor-pointer hover:border-amber-500 transition-all shadow-md`}
                >
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 relative bg-zinc-800">
                    <img src={property.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute bottom-1 left-1 bg-amber-500 text-[7px] font-black px-1.5 py-0.5 rounded text-black uppercase">
                      {property.propertyListingType === 'project' ? 'Off-Plan' : 'Ready'}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm mb-1 truncate ${colors.text}`}>{property.propertyname}</h4>
                    <div className="flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span className={`text-[10px] font-black uppercase ${colors.textSecondary}`}>{property.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-amber-500 font-bold text-sm">AED {Number(property.price).toLocaleString()}</p>
                      <ChevronRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agentfilter;