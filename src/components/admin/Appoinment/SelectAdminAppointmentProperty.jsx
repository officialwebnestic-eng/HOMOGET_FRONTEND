import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiSearch, FiMenu } from "react-icons/fi";
import { 
  MapPin, Home, Bed, Bath, ChevronDown, 
  ArrowRight, Building2, IndianRupee, Ruler, Barcode, Wrench
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";

export const filterFields = [
  { name: "state", label: "State", icon: <MapPin size={14} /> },
  { name: "listingtype", label: "Category", icon: <Building2 size={14} /> },
  { name: "propertytype", label: "Type", icon: <Home size={14} /> },
  { name: "price", label: "Price", icon: <IndianRupee size={14} /> },
  { name: "squarefoot", label: "Area", icon: <Ruler size={14} /> },
  { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
  { name: "bathroom", label: "Baths", icon: <Bath size={14} /> },
  { name: "floor", label: "Floor", icon: <Barcode size={14} /> },
  { name: "city", label: "City", icon: <MapPin size={14} /> },
  { name: "aminities", label: "Amenities", icon: <Wrench size={14} /> },
];

const SelectAdminAppointmentProperty = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    search: "", state: "", listingtype: "", propertytype: "", 
    price: "", squarefoot: "", bedroom: "", bathroom: "", 
    floor: "", city: "", aminities: "",
  });

  const [selectedProp, setSelectedProp] = useState(null);

  // --- FIX 1: CLEAN FILTERS BEFORE SENDING TO API ---
  // This prevents sending empty strings like {city: ""} which causes "0 results"
  const apiParams = useMemo(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "" && value !== null)
    );
    return activeFilters;
  }, [filters]);

  const { propertyList = [], loading } = useGetAllProperty(1, 100, apiParams);

  // --- FIX 2: CLIENT-SIDE SEARCH LOGIC ---
  const filteredProperties = useMemo(() => {
    if (!propertyList) return [];
    
    // If the search bar is empty, show the full list from the API
    if (!filters.search.trim()) return propertyList;

    const term = filters.search.toLowerCase().trim();
    return propertyList.filter((prop) => 
      prop.propertyname?.toLowerCase().includes(term) ||
      prop._id?.toLowerCase().includes(term) ||
      String(prop.price).includes(term)
    );
  }, [propertyList, filters.search]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSelectedProp(null);
  };

  const colors = {
    background: isDark ? "bg-[#0a0a0c]" : "bg-slate-50",
    card: isDark ? "bg-[#141417]" : "bg-white",
    text: isDark ? "text-white" : "text-[#161B26]",
    border: isDark ? "border-white/5" : "border-gray-200"
  };

  return (
    <div className={`flex min-h-screen ${colors.background} transition-colors duration-500`}>
      <main className="flex-1 w-full pb-32">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-12">
          <div className="max-w-[1400px] mx-auto flex justify-between items-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-[1px] bg-[#C5A059]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Admin Selection</span>
              </div>
              <h1 className={`text-7xl font-black uppercase tracking-tighter leading-none ${colors.text}`}>
                Select <br />
                <span className="italic font-serif text-[#C5A059] capitalize">Listing Asset.</span>
              </h1>
            </motion.div>
            
            <div className={`px-6 py-3 rounded-2xl border ${colors.border} ${colors.card}`}>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Results Found</p>
               <p className={`text-xl font-black ${colors.text}`}>{filteredProperties.length}</p>
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER BAR */}
        <div className="max-w-[1400px] mx-auto px-12 relative z-30">
          <div className={`p-6 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl ${isDark ? 'bg-[#141417]/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
            <div className="mb-4 relative">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-[#C5A059]" size={20} />
              <input
                type="text" name="search" placeholder="SEARCH ID, NAME, OR PRICE..." 
                value={filters.search} onChange={handleFilterChange}
                className={`w-full pl-14 pr-6 py-5 rounded-2xl text-xs font-bold outline-none border transition-all ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {filterFields.map((field) => (
                <div key={field.name} className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A059]">{field.icon}</div>
                  <select
                    name={field.name} value={filters[field.name]} onChange={handleFilterChange}
                    className={`w-full pl-10 pr-8 py-3 rounded-xl text-[10px] font-black uppercase appearance-none outline-none border ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-100 border-slate-200'}`}
                  >
                    <option value="">{field.label}</option>
                    {/* Add options here or leave as is if you are just using search for now */}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="max-w-[1400px] mx-auto px-12 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
               <div className="col-span-full py-20 text-center text-[#C5A059] font-black uppercase">Syncing Assets...</div>
            ) : filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <motion.div
                  layout
                  key={property._id} onClick={() => setSelectedProp(property)}
                  className={`group relative h-[480px] rounded-[2.5rem] overflow-hidden cursor-pointer border-2 transition-all duration-500 ${selectedProp?._id === property._id ? 'border-[#C5A059] scale-[1.02]' : 'border-transparent shadow-xl'}`}
                >
                  <img src={property.image?.[0]} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-[8px] font-black text-white uppercase">ID: {property._id.slice(-6)}</span>
                  </div>

                  {selectedProp?._id === property._id && (
                    <div className="absolute top-6 right-6 z-20 bg-[#C5A059] text-white p-2 rounded-full shadow-lg">
                      <FiCheckCircle size={16} />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <p className="text-[#C5A059] text-[9px] font-black uppercase mb-1 tracking-widest">{property.city}</p>
                    <h3 className="text-xl font-black text-white uppercase leading-tight mb-4">{property.propertyname}</h3>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1.5"><Bed size={14} className="text-[#C5A059]" /><span className="text-[10px] text-white font-bold">{property.bedroom || 0}</span></div>
                      <div className="flex items-center gap-1.5"><Bath size={14} className="text-[#C5A059]" /><span className="text-[10px] text-white font-bold">{property.bathroom || 0}</span></div>
                      <div className="ml-auto text-lg font-black text-white"><span className="text-[10px] text-[#C5A059] mr-1">AED</span>{Number(property.price).toLocaleString()}</div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-40 text-center">
                 <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No Matching Assets in Vault.</p>
                 <button onClick={() => setFilters({search: "", state: "", city: ""})} className="mt-4 text-[#C5A059] text-[10px] font-black uppercase border-b border-[#C5A059]">Reset Filters</button>
              </div>
            )}
          </div>
        </div>

        {/* FLOATING ACTION BAR */}
        <AnimatePresence>
          {selectedProp && (
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-10 left-0 right-0 z-50 flex justify-center px-6">
              <div className={`w-full max-w-2xl p-4 rounded-[2.5rem] shadow-2xl border flex items-center justify-between backdrop-blur-2xl ${isDark ? 'bg-[#161B26]/95 border-white/20' : 'bg-white/95 border-[#C5A059]'}`}>
                <div className="flex items-center gap-4">
                  <img src={selectedProp.image?.[0]} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                  <div>
                    <span className="text-[#C5A059] text-[8px] font-black uppercase tracking-widest">Selected Asset</span>
                    <p className={`text-sm font-black uppercase ${isDark ? 'text-white' : 'text-black'}`}>{selectedProp.propertyname}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/createadminappointment", { state: { property: selectedProp } })}
                  className="bg-[#C5A059] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2"
                >
                  Proceed to Schedule <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SelectAdminAppointmentProperty;