import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { 
  Crown, MapPin, Search, Phone, Mail, MessageCircle,
  ChevronDown, User, Calendar, Home
} from 'lucide-react';
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";

const Luxury = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- 1. FUNCTIONAL STATE ---
  const [filters, setFilters] = useState({
    propertyListingType: "project", 
    segment: "Luxury",              // This must match your DB exactly
    developerName: "",
    deliveryDate: "",
    city: "",                       
    propertytype: ""
  });

  // Fetching data. 100 limit ensures we get enough to filter locally if needed.
  const { propertyList = [], loading } = useGetAllProperty(1, 100, filters);

  // --- 2. DYNAMIC OPTIONS LOGIC ---
  // We pull unique values from the ACTUAL data returned by the API
  const getUniqueOptions = (fieldName) => {
    return [...new Set(propertyList.map(item => item[fieldName]).filter(Boolean))].sort();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. REFINED FILTERING LOGIC ---
  const luxuryProjects = useMemo(() => {
    if (!propertyList) return [];

    return propertyList.filter(item => {
      // Ensure we only show 'project' types on this page
      const isProject = item.propertyListingType === "project";
      
      // Local search filter for the name
      const matchesSearch = item.propertyname.toLowerCase().includes(searchQuery.toLowerCase());

      /** * NOTE: If your JSON data is still labeled as "Standard", 
       * the API might return an empty list because of the 'filters' state above.
       * Ensure your DB has segment: "Luxury" for these items.
       */
      return isProject && matchesSearch;
    });
  }, [propertyList, searchQuery]);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Luxury Real Estate"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-white/40'} backdrop-blur-[2px]`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-8 shadow-xl">
              <Crown size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Acquisition</span>
            </div>
            
            <h1 className={`text-7xl md:text-[130px] leading-[0.8] font-black uppercase tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Luxury <br />
              <span className="text-amber-500 font-serif italic font-light">Collection</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- FILTER BAR --- */}
      <div className="max-w-[1400px] mx-auto px-6 -mt-24 relative z-30">
        <div className={`p-10 rounded-[3.5rem] border shadow-2xl backdrop-blur-3xl ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/95 border-slate-200'}`}>
          <div className="flex flex-col gap-8">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
              <input 
                type="text"
                placeholder="SEARCH BY ASSET NAME..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-16 pr-8 py-6 rounded-3xl text-sm font-bold uppercase outline-none border transition-all ${isDark ? 'bg-black border-white/10 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'}`}
              />
            </div>

            {/* Dropdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Developer", icon: <User size={16}/>, name: "developerName" },
                { label: "Handover", icon: <Calendar size={16}/>, name: "deliveryDate" },
                { label: "City", icon: <MapPin size={16}/>, name: "city" },
                { label: "Type", icon: <Home size={16}/>, name: "propertytype" }
              ].map((f) => (
                <div key={f.name} className="relative group">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">{f.icon}</div>
                   <select 
                    name={f.name}
                    value={filters[f.name]}
                    onChange={handleFilterChange}
                    className={`w-full pl-12 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase appearance-none border outline-none cursor-pointer transition-all ${isDark ? 'bg-black/50 border-white/5 text-white' : 'bg-white border-slate-100'}`}
                   >
                      <option value="">{f.label}</option>
                      {getUniqueOptions(f.name).map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                   </select>
                   <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- PROPERTY GRID --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
             <span className="text-amber-500 font-black text-[10px] uppercase tracking-widest">Verifying Assets...</span>
          </div>
        ) : luxuryProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {luxuryProjects.map((item) => (
              <motion.div 
                key={item._id}
                whileHover={{ y: -10 }}
                className={`group rounded-[3.5rem] overflow-hidden border transition-all duration-500 ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}
              >
                {/* Image Section */}
                <div 
                  className="relative h-72 overflow-hidden cursor-pointer" 
                  onClick={() => navigate(`/property/${item._id}`, { state: { propertyData: item } })}
                >
                  <img src={item.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.propertyname} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-amber-500 text-black px-4 py-1.5 rounded-full shadow-lg">
                    <Crown size={12} />
                    <span className="text-[9px] font-black uppercase">Elite Project</span>
                  </div>
                  <div className="absolute bottom-6 left-8">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{item.propertyname}</h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Handover</p>
                      <p className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.deliveryDate || "TBA"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Investment</p>
                      <p className="text-lg font-black text-amber-500">{item.currency || 'AED'} {Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="flex items-center justify-between gap-3">
                    <a href={`tel:${item.agentId?.phone}`} className="flex-1 flex items-center justify-center p-3.5 rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                      <Phone size={20} />
                    </a>
                    <a href={`mailto:${item.agentId?.email}`} className="flex-1 flex items-center justify-center p-3.5 rounded-2xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all">
                      <Mail size={20} />
                    </a>
                    <a 
                      href={`https://wa.me/${item.agentId?.phone?.replace(/\s+/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 flex items-center justify-center p-3.5 rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <h2 className={`text-2xl font-black uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>No Luxury Assets Found</h2>
             <p className="opacity-50 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Luxury;