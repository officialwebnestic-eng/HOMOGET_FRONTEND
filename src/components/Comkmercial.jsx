import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { 
  Phone, Mail, Calendar, ArrowRight, 
  Search, ChevronDown, MapPin, 
  User, Home, IndianRupee, Briefcase
} from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import useGetAllProperty from "../hooks/useGetAllProperty";
import { useTheme } from '../context/ThemeContext';

// --- EMPTY STATE MODEL ---
const EmptyStateModel = ({ isDark }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-32 px-6 text-center w-full"
  >
    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
      <Briefcase size={40} className="text-[#ff8a00]/50" />
    </div>
    <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Assets Found</h3>
    <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
      We couldn't find any off-plan commercial projects matching your current filters.
    </p>
  </motion.div>
);

const Commercial = () => {
  const { theme } = useTheme(); 
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // --- PROJECT-BASED FILTER FIELDS ---
  const filterFields = [
    { name: "city", label: "CITY", icon: <MapPin size={14} className="text-[#ff8a00]" /> },
    { name: "propertytype", label: "ASSET TYPE", icon: <Home size={14} className="text-[#ff8a00]" /> },
    { name: "price", label: "BUDGET", icon: <IndianRupee size={14} className="text-[#ff8a00]" /> },
    { name: "developerName", label: "DEVELOPER", icon: <User size={14} className="text-[#ff8a00]" /> },
    { name: "deliveryDate", label: "HANDOVER", icon: <Calendar size={14} className="text-[#ff8a00]" /> },
  ];

  const [filters, setFilters] = useState({
    propertyListingType: "project", 
    usageType: "Commercial",
    developerName: "",
    deliveryDate: "",
    city: "",
    propertytype: "",
    price: ""
  });

  const { propertyList = [], loading } = useGetAllProperty(1, 100, filters);

  // --- STRICT VALIDATION & SEARCH ---
  const validatedList = useMemo(() => {
    return propertyList.filter(item => {
      const isCommercialProject = item.propertyListingType === "project" && item.usageType === "Commercial";
      const matchesSearch = item.propertyname?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.developerName?.toLowerCase().includes(searchQuery.toLowerCase());
      return isCommercialProject && matchesSearch;
    });
  }, [propertyList, searchQuery]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getOptions = (name) => {
    const options = propertyList.map(item => item[name]).filter(Boolean);
    return [...new Set(options)].sort();
  };

  const handlePropertyClick = (item) => {
    navigate(`/property/${item._id}`, { state: { propertyData: item } });
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[65vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-50"
            alt="Commercial Real Estate"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0a0a0c]/80 to-[#0a0a0c]' : 'bg-gradient-to-b from-white/20 to-white'}`} />
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 mt-[-50px]">
          <h1 className={`text-7xl md:text-9xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-[#1a1a1e]'} leading-[0.8]`}>
            Prime <span className="font-serif italic font-light text-[#ff8a00] lowercase">Assets.</span>
          </h1>
          <p className={`max-w-md text-sm font-medium mt-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore premium off-plan commercial opportunities across the UAE's most strategic business hubs.
          </p>
        </div>
      </section>

      {/* --- DYNAMIC FILTER PANEL (EXACT DESIGN) --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-50">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
          {/* SEARCH BAR TOP */}
          <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-2 mb-8 w-full md:max-w-md">
            <Search className="text-[#ff8a00] ml-4" size={20} />
            <input 
              type="text" 
              placeholder="Search project or developer..." 
              className="w-full bg-transparent border-none outline-none px-4 py-2 text-sm font-bold text-slate-800 placeholder-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-y-8 gap-x-4">
            {filterFields.map((field, index) => (
              <div key={field.name} className={`relative px-2 ${index !== 4 ? 'md:border-r border-slate-100' : ''}`}>
                <label className="flex items-center gap-2 text-[10px] font-black text-[#1a1a1e] mb-2 tracking-widest uppercase">
                  {field.icon} {field.label}
                </label>
                <div className="relative">
                  <select
                    name={field.name}
                    onChange={handleFilterChange}
                    className="w-full bg-transparent text-[11px] font-bold text-slate-400 outline-none appearance-none cursor-pointer uppercase pr-6"
                  >
                    <option value="">SELECT {field.label}</option>
                    {getOptions(field.name).map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                </div>
              </div>
            ))}
            <button className="bg-[#ff8a00] text-white text-[11px] font-black uppercase rounded-2xl py-4 hover:bg-[#e67c00] transition-all tracking-widest shadow-lg shadow-orange-100">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* --- PROJECT GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {loading ? (
          <div className="text-center py-20 text-[#ff8a00] font-black animate-pulse uppercase tracking-widest">Validating Portfolio...</div>
        ) : (
          <>
            {validatedList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence>
                  {validatedList.map((item) => (
                    <motion.div 
                      key={item._id}
                      whileHover={{ y: -10 }}
                      className={`group relative h-[500px] rounded-[3.5rem] overflow-hidden border shadow-2xl transition-all duration-500 ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'}`}
                    >
                      {/* Image Layer */}
                      <img 
                        src={item.image?.[0]} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={item.propertyname} 
                        onClick={() => handlePropertyClick(item)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                      {/* Badges */}
                      <div className="absolute top-8 left-8 flex gap-2 z-20">
                        <span className="px-4 py-1.5 rounded-lg bg-[#ff8a00] text-white text-[9px] font-black uppercase tracking-widest">
                          {item.propertytype}
                        </span>
                        <span className="px-4 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest">
                          OFF-PLAN
                        </span>
                      </div>

                      {/* Always Visible Action Icons */}
                      <div className="absolute top-8 right-6 flex flex-col gap-3 z-30">
                        <a href={`https://wa.me/${item.agentId?.phone?.replace(/\s+/g, '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-90 transition-transform">
                          <FaWhatsapp size={20} />
                        </a>
                        <a href={`tel:${item.agentId?.phone}`} className="w-10 h-10 bg-[#3b82f6] text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-90 transition-transform">
                          <Phone size={18} fill="currentColor" />
                        </a>
                        <a href={`mailto:${item.agentId?.email}`} className="w-10 h-10 bg-[#ff8a00] text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-90 transition-transform">
                          <Mail size={18} />
                        </a>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-10 z-20" onClick={() => handlePropertyClick(item)}>
                        <p className="text-[#ff8a00] text-[10px] font-black uppercase tracking-widest mb-1">{item.developerName || "Premium Developer"}</p>
                        <h3 className="text-2xl font-serif text-white mb-4 leading-tight group-hover:text-[#ff8a00] transition-colors uppercase tracking-tighter">
                          {item.propertyname}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-6">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Starting From</p>
                              <p className="text-xl font-bold text-white tracking-tighter">
                                AED {Number(item.price).toLocaleString()}
                              </p>
                           </div>
                           <button className="w-11 h-11 bg-[#ff8a00] rounded-full flex items-center justify-center text-white shadow-lg">
                             <ArrowRight size={22} />
                           </button>
                        </div>

                        <div className="flex gap-6 pt-5 border-t border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-2"><MapPin size={14} className="text-[#ff8a00]" /> {item.city}</span>
                          <span className="flex items-center gap-2"><Calendar size={14} className="text-[#ff8a00]" /> {item.deliveryDate || "2026"}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyStateModel isDark={isDark} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Commercial;