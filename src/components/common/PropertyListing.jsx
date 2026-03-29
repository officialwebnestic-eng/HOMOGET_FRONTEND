import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, Filter, MapPin, Bed, Bath, Ruler, 
  ChevronLeft, ChevronRight, ArrowRight,
  Phone, Mail, Building2, Home, Barcode, Wrench, Calendar,
  IndianRupee, ChevronDown
} from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";

const PropertyListing = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    city: "", propertytype: "", price: "", squarefoot: "",
    bedroom: "", bathroom: "", floor: "", state: "", aminities: ""
  });

  // CATCH REDIRECT FROM HOME PAGE
  useEffect(() => {
    if (location.state?.initialSearch) {
      const incomingSearch = location.state.initialSearch;
      setSearchQuery(incomingSearch);
      // Sync the city filter with the incoming search query
      setFilters(prev => ({ ...prev, city: incomingSearch }));
    }
  }, [location.state]);

  const limit = 20; 
  const { propertyList = [], loading, pagination = {} } = useGetAllProperty(currentPage, limit, filters);

  const filterFields = [
    { name: "city", label: "CITY", icon: <MapPin size={14} className="text-[#ff8a00]" /> },
    { name: "propertytype", label: "TYPE", icon: <Home size={14} className="text-[#ff8a00]" /> },
    { name: "price", label: "PRICE", icon: <IndianRupee size={14} className="text-[#ff8a00]" /> },
    { name: "squarefoot", label: "AREA", icon: <Ruler size={14} className="text-[#ff8a00]" /> },
    { name: "bedroom", label: "BEDS", icon: <Bed size={14} className="text-[#ff8a00]" /> },
    { name: "bathroom", label: "BATHS", icon: <Bath size={14} className="text-[#ff8a00]" /> },
    { name: "floor", label: "FLOOR", icon: <Barcode size={14} className="text-[#ff8a00]" /> },
    { name: "state", label: "LOCATION", icon: <MapPin size={14} className="text-[#ff8a00]" /> },
    { name: "aminities", label: "AMENITIES", icon: <Wrench size={14} className="text-[#ff8a00]" /> },
  ];

const filteredProperties = useMemo(() => {
  if (!propertyList) return [];
  return propertyList.filter(item => {
    // 1. Improved Search Logic: Check multiple fields
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
                          item.propertyname?.toLowerCase().includes(searchLower) || 
                          item.city?.toLowerCase().includes(searchLower) ||
                          item.state?.toLowerCase().includes(searchLower);
    
    // 2. Flexible Dropdown Logic
    const matchesDropdowns = Object.keys(filters).every(key => {
      if (!filters[key]) return true;
      // Use 'includes' instead of '===' for partial matches (e.g. "Al Furjan" matches "Al Furjan, Dubai")
      return String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase());
    });

    return matchesSearch && matchesDropdowns;
  });
}, [propertyList, searchQuery, filters]);

  const getUniqueValues = (key) => {
    return [...new Set(propertyList.map(item => item[key]).filter(Boolean))].sort();
  };

const handleTopSearch = () => {
  // Clear other specific filters that might conflict with a new search
  setFilters({
    ...filters,
    city: searchQuery,
    state: "" // Clear state if city is being searched manually
  });
  setCurrentPage(1);
};
  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[65vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000"
          alt="Dubai Skyline"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0a0a0c]/80 to-[#0a0a0c]' : 'bg-gradient-to-b from-white/20 to-white'}`} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-[-50px]">
          <h1 className={`text-7xl md:text-9xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#1a1a1e]'} leading-[0.8] mb-4`}>
            Property <br />
            <span className="text-[#ff8a00] font-serif italic font-light lowercase">Listings</span>
          </h1>
          <p className={`max-w-md text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
            Homoget Properties offers a verified portfolio of luxury assets ensuring full compliance with UAE market regulations.
          </p>

          {/* SEARCH BAR */}
          <div className="relative z-50 w-full max-w-2xl mb-8">
            <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full border border-white/20 p-2 shadow-2xl">
              <Search className="text-[#ff8a00] ml-4" size={20} />
              <input 
                type="text" 
                placeholder="Search city or project..." 
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTopSearch()}
              />
              <button 
                onClick={handleTopSearch}
                className="bg-[#ff8a00] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTER PANEL --- */}
      <section className="max-w-7xl mx-auto px-6 mt-[-100px] relative z-[60]">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4">
            {filterFields.map((field, index) => (
              <div key={field.name} className={`relative px-2 ${index % 5 !== 4 ? 'md:border-r border-slate-100' : ''}`}>
                <label className="flex items-center gap-2 text-[10px] font-black text-[#1a1a1e] mb-2 tracking-widest">
                  {field.icon} {field.label}
                </label>
                <div className="relative">
                  <select 
                    value={filters[field.name]}
                    onChange={(e) => setFilters({...filters, [field.name]: e.target.value})}
                    className="w-full bg-transparent text-[11px] font-bold text-slate-400 outline-none appearance-none cursor-pointer uppercase pr-6"
                  >
                    <option value="">SELECT {field.label}</option>
                    {getUniqueValues(field.name).map(v => <option key={v} value={v} className="text-black">{v}</option>)}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                </div>
              </div>
            ))}
            <div className="md:col-span-1 flex items-end">
              <button 
                onClick={() => setCurrentPage(1)}
                className="w-full bg-[#ff8a00] hover:bg-[#e67c00] text-white font-black text-[11px] py-4 rounded-2xl tracking-[0.2em] transition-all uppercase shadow-lg shadow-orange-200"
              >
                Apply All
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROPERTY GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#ff8a00]"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <motion.div 
                  key={property._id}
                  whileHover={{ y: -10 }}
                  className={`group relative h-[500px] rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-500 ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'}`}
                >
                  <img 
                     src={property.image?.[0]} 
                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                     alt={property.propertyname} 
                     onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

                  <div className="absolute top-8 left-8 flex gap-2 z-20">
                    <span className="px-4 py-1.5 rounded-lg bg-[#ff8a00] text-white text-[9px] font-black uppercase tracking-widest">
                      {property.propertytype}
                    </span>
                    <span className="px-4 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">
                      {property.isReady ? 'Ready' : 'Off-Plan'}
                    </span>
                  </div>

                  <div className="absolute top-8 right-6 flex flex-col gap-3 z-30">
                    <a href={`https://wa.me/${property.agentId?.phone}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg">
                      <FaWhatsapp size={20} />
                    </a>
                    <a href={`tel:${property.agentId?.phone}`} className="w-10 h-10 bg-[#3b82f6] text-white rounded-full flex items-center justify-center shadow-lg">
                      <Phone size={18} fill="currentColor" />
                    </a>
                    <a href={`mailto:${property.agentId?.email}`} className="w-10 h-10 bg-[#ff8a00] text-white rounded-full flex items-center justify-center shadow-lg">
                      <Mail size={18} />
                    </a>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-10 z-20" onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}>
                    <p className="text-[#ff8a00] text-[10px] font-black uppercase tracking-widest mb-2">{property.city}, UAE</p>
                    <h3 className="text-2xl font-serif text-white mb-4 leading-tight group-hover:text-[#ff8a00] transition-colors">
                      {property.propertyname}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-6">
                       <p className="text-xl font-bold text-white tracking-tighter uppercase">
                         AED {Number(property.price).toLocaleString()}
                       </p>
                       <button className="w-11 h-11 bg-[#ff8a00] rounded-full flex items-center justify-center text-white shadow-lg">
                         <ArrowRight size={22} />
                       </button>
                    </div>

                    <div className="flex gap-6 pt-5 border-t border-white/10 text-white/70 text-[11px] font-bold">
                      <span className="flex items-center gap-2"><Bed size={16} className="text-[#ff8a00]" /> {property.bedroom}</span>
                      <span className="flex items-center gap-2"><Bath size={16} className="text-[#ff8a00]" /> {property.bathroom}</span>
                      <span className="flex items-center gap-2"><Ruler size={16} className="text-[#ff8a00]" /> {property.squarefoot} ft²</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-500 font-bold uppercase tracking-widest">No matching properties found.</p>
              </div>
            )}
          </div>
        )}

        {/* --- PAGINATION --- */}
        {pagination.totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={`p-4 rounded-2xl border ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-800'} ${currentPage === 1 ? 'opacity-30' : 'hover:bg-[#ff8a00] hover:text-white transition-all'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-[#ff8a00] text-white shadow-xl scale-110' : `border border-slate-200 ${isDark ? 'text-white' : 'text-slate-800'}`}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`p-4 rounded-2xl border ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-800'} ${currentPage === pagination.totalPages ? 'opacity-30' : 'hover:bg-[#ff8a00] hover:text-white transition-all'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;