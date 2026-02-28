import React, { useMemo } from "react";
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
  handleSubmit, 
  resetFilters, 
  filterFields, 
  getUniqueValues
}) => {

  // Extract unique locations for the dropdown
  const suggestions = useMemo(() => {
    if (!propertyList || propertyList.length === 0) return [];
    const seen = new Set();
    return propertyList
      .filter(p => {
        const duplicate = seen.has(p.city);
        seen.add(p.city);
        return !duplicate;
      })
      .map(p => ({ city: p.city, state: p.state }))
      .slice(0, 6);
  }, [propertyList]);

  const onSearchSubmit = () => {
    setShowSuggestions(false);
    handleSubmit();
  };

  return (
    <div className="relative min-h-[50vh] md:min-h-[80vh] flex items-center justify-center overflow-visible z-[40]">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#0a0a0c]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-10 pb-10 md:pb-20">
        
        {/* Branding */}
        <div className="text-center mb-6 md:mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-9xl font-serif tracking-tighter text-white mb-2">
              Homoget<span className="text-amber-500">.</span>
            </h1>
            <p className="text-white/60 text-[8px] md:text-sm font-light tracking-[0.4em] uppercase">
              The Future of Real Estate Search
            </p>
          </motion.div>
        </div>

        {/* Search Engine Bar */}
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-full p-1 md:p-1.5 shadow-2xl border border-white/20 flex items-center">
            
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 md:left-6 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                placeholder="Search city or project..."
                className="w-full pl-10 md:pl-16 pr-4 py-3 md:py-5 bg-transparent text-slate-900 dark:text-white focus:outline-none text-sm md:text-lg"
              />

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[100]"
                  >
                    <div className="py-2">
                      <div className="px-6 py-2 text-[10px] font-black text-amber-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 mb-2">
                        Suggested Locations
                      </div>
                      {suggestions.map((loc, i) => (
                        <button 
                          key={i} 
                          onMouseDown={() => {
                            setSearchQuery(loc.city);
                            setShowSuggestions(false);
                            onSearchSubmit(); // Direct redirect
                          }}
                          className="w-full text-left px-6 py-3 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-4 transition-colors group"
                        >
                          <MapPin className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{loc.city}</p>
                            <p className="text-[10px] text-slate-500">{loc.state}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Filter (Triggers redirect) */}
            <button onClick={onSearchSubmit} className="md:hidden p-2 text-slate-500 mr-1">
              <Filter className="w-5 h-5" />
            </button>

            {/* Desktop Filter */}
            <div 
              className="relative hidden md:flex items-center"
              onMouseEnter={() => setShowFilters(true)}
              onMouseLeave={() => setShowFilters(false)}
            >
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
                         {filterFields.slice(0, 9).map((field) => (
                           <select
                             key={field.name}
                             name={field.name}
                             value={filters[field.name] || ""}
                             onChange={handleFilterChange}
                             className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-[10px] font-bold uppercase outline-none text-slate-700 dark:text-white cursor-pointer"
                           >
                             <option value="">{field.label}</option>
                             {getUniqueValues(propertyList, field.name).map(opt => (
                               <option key={opt} value={opt}>{opt}</option>
                             ))}
                           </select>
                         ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Button (Triggers redirect even if empty) */}
            <button 
              onClick={onSearchSubmit}
              className="ml-1 md:ml-2 p-3 md:px-8 md:py-4 bg-amber-500 text-black rounded-full flex items-center justify-center min-w-[40px] md:min-w-[140px] hover:bg-black hover:text-white transition-all shadow-lg"
            >
              <span className="hidden md:block font-black uppercase text-[10px] tracking-tight">Search Now</span>
              <Search className="md:hidden w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Background Overlay to close suggestions */}
      {showSuggestions && (
        <div className="fixed inset-0 z-[30]" onMouseDown={() => setShowSuggestions(false)} />
      )}
    </div>
  );
};

export default AgentHero;