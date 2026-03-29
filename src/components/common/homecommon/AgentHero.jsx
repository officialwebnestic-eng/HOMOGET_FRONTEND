import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Filter, ChevronDown } from "lucide-react";

const AgentHero = ({ 
  searchQuery, 
  setSearchQuery, 
  showSuggestions, 
  setShowSuggestions, 
  propertyList = [], 
  filters, 
  handleFilterChange, 
  showFilters, 
  setShowFilters, 
  onSuggestionClick,     
  onSearchButtonClick,   
  filterFields, 
  getUniqueValues
}) => {
  const [apiSuggestions, setApiSuggestions] = useState([]);

useEffect(() => {
  const fetchLocations = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setApiSuggestions([]);
      return;
    }

    try {
      // Changed type to 'amenity' to satisfy API requirements
      // Kept categories as 'building.residential' to find property names
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}` +
        `&filter=countrycode:ae` + 
        `&type=amenity` + 
        `&categories=building.residential,accommodation` + 
        `&bias=proximity:55.2708,25.2048&limit=6&apiKey=199288dedc924de189f73fcb8b3b3c61`
      );

      const data = await response.json();

      if (data.features) {
        const locations = data.features.map(f => ({
          name: f.properties.name || f.properties.address_line1.split(',')[0],
          subText: f.properties.address_line2 || `${f.properties.suburb || ''}, ${f.properties.city || ''}`
        }));
        setApiSuggestions(locations);
      }
    } catch (err) {
      console.error("Location API error:", err);
    }
  };


  

  const debounce = setTimeout(fetchLocations,50);
  return () => clearTimeout(debounce);
}, [searchQuery]);

  return (
    <div className="relative min-h-[50vh] md:min-h-[80vh] flex items-center justify-center overflow-visible z-[40]">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80" alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#0a0a0c]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-10 pb-10 md:pb-20">
        <div className="text-center mb-6 md:mb-10">
            <h1 className="text-5xl md:text-9xl font-serif text-white mb-2">Homoget<span className="text-amber-500">.</span></h1>
            <p className="text-white/60 text-[8px] md:text-sm font-light uppercase tracking-[0.4em]">The Future of Real Estate Search</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-full p-1 md:p-1.5 shadow-2xl border border-white/20 flex items-center">
            
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 md:left-6 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, community or building..."
                className="w-full pl-10 md:pl-16 pr-4 py-3 md:py-5 bg-transparent text-slate-900 dark:text-white focus:outline-none text-sm md:text-lg"
              />

              <AnimatePresence>
                {showSuggestions && apiSuggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[100]">
                    <div className="py-2">
                      <div className="px-6 py-2 text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 mb-2">Suggested Locations</div>
                      {apiSuggestions.map((loc, i) => (
                        <button 
                          key={i} 
                          onMouseDown={() => onSuggestionClick(loc.name)} 
                          className="w-full text-left px-6 py-4 hover:bg-slate-100 dark:hover:bg-white/5 flex items-start gap-4 transition-colors group"
                        >
                          <MapPin className="w-5 h-5 mt-1 text-slate-400 group-hover:text-amber-500" />
                          <div>
                            <p className="text-base font-bold text-slate-800 dark:text-white leading-tight">{loc.name}</p>
                            <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider">{loc.subText}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative hidden md:flex items-center" onMouseEnter={() => setShowFilters(true)} onMouseLeave={() => setShowFilters(false)}>
              <button className="flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-amber-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Refine</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full right-0 pt-4 z-[99] w-[500px]">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 border border-white/10">
                       <div className="grid grid-cols-2 gap-4">
                         {filterFields?.slice(0, 9).map((field) => (
                           <select
                             key={field.name}
                             name={field.name}
                             value={filters[field.name] || ""}
                             onChange={handleFilterChange}
                             className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-[10px] font-bold uppercase outline-none text-slate-700 dark:text-white cursor-pointer"
                           >
                             <option value="">{field.label}</option>
                             {getUniqueValues(propertyList, field.name).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                           </select>
                         ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={onSearchButtonClick}
              className="ml-1 md:ml-2 p-3 md:px-8 md:py-4 bg-amber-500 text-black rounded-full flex items-center justify-center min-w-[40px] md:min-w-[140px] hover:bg-black hover:text-white transition-all shadow-lg"
            >
              <span className="hidden md:block font-black uppercase text-[10px] tracking-tight">Search Now</span>
              <Search className="md:hidden w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showSuggestions && <div className="fixed inset-0 z-[30]" onMouseDown={() => setShowSuggestions(false)} />}
    </div>
  );
};

export default AgentHero;