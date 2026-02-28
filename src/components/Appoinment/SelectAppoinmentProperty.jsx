import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowRight, FiCheckCircle, FiSearch 
} from "react-icons/fi";
import { 
  MapPin, Home, IndianRupee, Ruler, Bed, Bath, Barcode, Wrench, ChevronDown, 
  Crown, Layers, Sparkles, Phone, Mail, ChevronRight, ArrowRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";

const SelectAppointmentProperty = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // --- 1. CONFIGURATION ---
  const filterFields = [
    { name: "city", label: "City", icon: <MapPin size={14} /> },
    { name: "propertytype", label: "Type", icon: <Home size={14} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
    { name: "bathroom", label: "Baths", icon: <Bath size={14} /> },
  ];

  const colors = {
    background: isDark ? "bg-[#0a0a0c]" : "bg-gray-50",
    card: isDark ? "bg-[#141417]" : "bg-white",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white/5" : "border-gray-200"
  };

  // --- 2. STATE MANAGEMENT ---
  const [filters, setFilters] = useState({
    listingtype: "",
    propertyListingType: "",
    search: "",
    city: "",
    propertytype: "",
    bedroom: "",
    bathroom: "",
  });

  const [selectedPropId, setSelectedPropId] = useState(null);

  // --- 3. DATA FETCHING ---
  const memoizedFilters = useMemo(() => filters, [filters]);
  const { propertyList = [], loading } = useGetAllProperty(1, 20, memoizedFilters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setSelectedPropId(null);
  };

  const handleConfirmSelection = (property) => {
    if (!property) return;
    navigate("/createappoinment", { state: { property } });
  };

  // Split results for the two design sections
  const eliteProperties = propertyList.slice(0, 9);
  const insightProperties = propertyList.slice(9, 20);

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 pb-32 ${colors.background}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Luxury Rental" />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}`} />
        </div>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-8 shadow-xl">
              <Crown size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Selection</span>
            </div>
            <h1 className={`text-7xl md:text-[130px] leading-[0.8] font-black uppercase tracking-tighter mb-8 ${colors.text}`}>
              Book <br />
              <span className="text-amber-500 font-serif italic font-light lowercase">viewing</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- FILTER BAR --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-16 relative z-30">
        <div className={`w-full p-6 rounded-[3rem] border shadow-2xl backdrop-blur-2xl ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
            <div className="relative flex-grow lg:max-w-sm">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
              <input
                type="text"
                name="search"
                placeholder="SEARCH PROPERTIES..."
                value={filters.search}
                onChange={handleFilterChange}
                className={`w-full pl-14 pr-6 py-5 rounded-full text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-black focus:border-amber-500'}`}
              />
            </div>
            {filterFields.map((field) => (
              <div key={field.name} className="relative flex-grow min-w-[140px]">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500">{field.icon}</div>
                <select
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleFilterChange}
                  className={`w-full pl-12 pr-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest appearance-none outline-none border cursor-pointer transition-all ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-black focus:border-amber-500'}`}
                >
                  <option value="">{field.label}</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Apartment">Apartment</option>
                  <option value="1">1 Bed</option>
                </select>
                <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RESULTS SECTIONS --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        
        {/* 1. ELITE SELECTION GRID */}
        <div className={`rounded-[3.5rem] ${colors.card} p-8 md:p-14 mb-16 border ${colors.border} shadow-2xl`}>
          <div className="flex justify-between items-end mb-12">
            <h2 className={`text-4xl md:text-5xl font-serif ${colors.text}`}>
              Elite <span className="text-amber-500 italic">Selection</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              <div className="col-span-full py-20 text-center text-amber-500 animate-pulse font-black uppercase tracking-[0.3em]">Scanning Database...</div>
            ) : eliteProperties.map((property) => (
              <motion.div
                key={property._id}
                whileHover={{ y: -12 }}
                onClick={() => setSelectedPropId(property._id)}
                className={`group relative h-[500px] w-full rounded-[3rem] overflow-hidden shadow-2xl bg-zinc-900 cursor-pointer  transition-all duration-500 ${selectedPropId === property._id ? 'border-amber-500 scale-[1.02]' : 'border-transparent'}`}
              >
                <img src={property.image?.[0]} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent z-10" />

                {selectedPropId === property._id && (
                  <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[2px] z-20 flex items-center justify-center">
                    <div className="bg-amber-500 text-black p-4 rounded-full shadow-2xl"><FiCheckCircle size={32} /></div>
                  </div>
                )}

                {/* Contact Icons design from AgentFilter */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-30">
                  <div className="w-9 h-9 bg-[#25D366] text-white rounded-full flex items-center justify-center"><FaWhatsapp size={18} /></div>
                  <div className="w-9 h-9 bg-amber-500 text-black rounded-full flex items-center justify-center"><Phone size={16} /></div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 z-20">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{property.city}, UAE</p>
                  <h3 className="text-2xl font-serif text-white leading-tight mb-6 truncate">{property.propertyname}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold text-white uppercase tracking-tighter">AED {Number(property.price).toLocaleString()}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleConfirmSelection(property); }}
                      className="w-11 h-11 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg"
                    >
                      <ArrowRight size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2. MARKET INSIGHTS LIST */}
        {!loading && insightProperties.length > 0 && (
          <div className="mb-20">
            <h2 className={`text-2xl font-serif mb-8 ${colors.text}`}>
              Market <span className="text-amber-500 italic">Insights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insightProperties.map((property) => (
                <motion.div
                  key={property._id}
                  onClick={() => setSelectedPropId(property._id)}
                  whileHover={{ x: 8 }}
                  className={`group p-4 rounded-[2rem] ${colors.card} border ${selectedPropId === property._id ? 'border-amber-500 ring-1 ring-amber-500' : colors.border} flex items-center gap-5 cursor-pointer hover:border-amber-500 transition-all shadow-md`}
                >
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 relative bg-zinc-800">
                    <img src={property.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
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
      </div>

      {/* --- FLOATING CONFIRMATION BAR --- */}
      <AnimatePresence>
        {selectedPropId && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
            <div className={`p-6 rounded-[2.5rem] shadow-2xl border flex items-center justify-between gap-6 backdrop-blur-2xl ${isDark ? 'bg-neutral-900/90 border-white/20' : 'bg-white/90 border-amber-500'}`}>
              <div className="flex flex-col">
                <span className="text-amber-500 text-[9px] font-black uppercase tracking-tighter">Ready to proceed</span>
                <span className={`text-sm font-black truncate max-w-[180px] ${colors.text}`}>
                  {propertyList.find(p => p._id === selectedPropId)?.propertyname}
                </span>
              </div>
              <button 
                onClick={() => handleConfirmSelection(propertyList.find(p => p._id === selectedPropId))}
                className="bg-amber-500 text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-amber-500/20"
              >
                Schedule Tour
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectAppointmentProperty;