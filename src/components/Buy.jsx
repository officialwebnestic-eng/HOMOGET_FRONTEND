import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FiTag, FiMaximize, FiLayers, FiArrowRight, FiSearch 
} from "react-icons/fi";
import { 
  MapPin, Building2, Home, IndianRupee, Ruler, Bed, Bath, Barcode, Wrench, ChevronDown 
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";

const Buy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // --- 1. FULL FILTER CONFIGURATION (10 FIELDS) ---
  const filterFields = [
    { name: "state", label: "Location", icon: <MapPin size={14} /> },
    { name: "propertytype", label: "Type", icon: <Home size={14} /> },
    { name: "price", label: "Price", icon: <IndianRupee size={14} /> },
    { name: "squarefoot", label: "Area", icon: <Ruler size={14} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
    { name: "bathroom", label: "Baths", icon: <Bath size={14} /> },
    { name: "floor", label: "Floor", icon: <Barcode size={14} /> },
    { name: "city", label: "City", icon: <MapPin size={14} /> },
    { name: "aminities", label: "Amenities", icon: <Wrench size={14} /> },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  
  // Initialize state with Buy listing type
  const [filters, setFilters] = useState({
    propertyListingType: "property",
    listingtype: "Buy", 
    state: "", 
    propertytype: "", 
    price: "",
    squarefoot: "",
    bedroom: "",
    bathroom: "",
    floor: "",
    city: "",
    aminities: ""
  });

  // --- 2. PARALLEL DATA FETCHING ---
  const { propertyList = [], loading } = useGetAllProperty(1, 20, filters);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePropertyClick = (property) => {
    navigate(`/property/${property._id}`, { state: { propertyData: property } });
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop" 
            alt="Corporate Dubai Architecture" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80 to-transparent' : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <FiTag className="text-amber-600" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Premium Acquisition</span>
            </div>
            <h1 className="flex flex-col leading-[0.85] mb-8">
              <span className={`text-4xl md:text-6xl font-serif tracking-tighter ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Property</span>
              <span className="text-4xl md:text-6xl font-serif italic font-light text-amber-500 tracking-tighter">Assets</span>
            </h1>
            <p className={`text-lg md:text-xl font-bold leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Secure your future with Dubai's most lucrative real estate opportunities. We curate high-yield residential and commercial investments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- ADVANCED 10-FILTER BAR --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-24 relative z-30">
        <div className={`w-full p-8 rounded-[3rem] border shadow-2xl backdrop-blur-xl ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          
          <div className="flex flex-col gap-6">
            {/* Top Row: Search */}
            <div className="relative w-full">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={20}/>
              <input 
                type="text"
                placeholder="Search by asset name or specific feature..."
                className={`w-full pl-16 pr-6 py-5 rounded-2xl text-[12px] font-bold uppercase tracking-widest outline-none border transition-all ${isDark ? 'bg-black border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-100 focus:border-amber-500'}`}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Bottom Row: 10 Filters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filterFields.map((field) => (
                <div key={field.name} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                    {field.icon}
                  </div>
                  <select
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleFilterChange}
                    className={`w-full pl-10 pr-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest appearance-none outline-none border cursor-pointer transition-all ${isDark ? 'bg-black/50 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-100 text-black focus:border-amber-500'}`}
                  >
                    <option value="">{field.label}</option>
                    {/* Add options based on your API data */}
                    <option value="Dubai">Dubai</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2+ Beds</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40" />
                </div>
              ))}
              
              <button 
                onClick={() => setFilters(prev => ({ ...prev, propertyname: searchQuery }))}
                className="lg:col-span-1 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl py-4 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
              >
                Find Assets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ASSET LISTING GRID --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
        {loading && <div className="text-center py-20 text-amber-500 animate-pulse font-black uppercase tracking-widest">Applying Selective Filters...</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {!loading && propertyList.map((asset, index) => (
            <motion.div
              key={asset._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-[3rem] overflow-hidden border transition-all duration-500 cursor-pointer ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200 hover:shadow-2xl hover:shadow-amber-500/10'}`}
              onClick={() => handlePropertyClick(asset)}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={asset.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={asset.propertyname} />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <div className="px-4 py-2 bg-amber-500 rounded-full text-black text-[10px] font-black uppercase tracking-widest">{asset.propertytype}</div>
                </div>
              </div>

              <div className="p-10">
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">{asset.city}</p>
                <h4 className={`text-2xl font-black mb-1 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.propertyname}</h4>
                <p className="text-amber-500 text-2xl font-black mb-8">AED {Number(asset.price).toLocaleString()}</p>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-8">
                  <div className="flex items-center gap-3">
                    <FiLayers className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{asset.bedroom} BEDS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMaximize className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{asset.squarefoot} SQFT</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Asset Details</button>
                  <div className="w-16 h-16 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <FiArrowRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buy;