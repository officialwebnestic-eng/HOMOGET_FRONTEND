import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Filter, ChevronDown, ArrowRight, Building2 } from "lucide-react";

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
  getUniqueValues,
  colors 
}) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-visible z-[40]">
      
      {/* Background with Premium Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#0a0a0c]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-10 pb-20">
        
        {/* Google-Inspired Minimalist Branding */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-9xl font-serif tracking-tighter text-white mb-4">
              Homoget<span className="text-amber-500 text-3xl md:text-5xl">.</span>
            </h1>
            <p className="text-white/60 text-xs md:text-sm font-light tracking-[0.5em] uppercase">
              The Future of Real Estate Search
            </p>
          </motion.div>
        </div>

        {/* Unified Search Engine Bar */}
        <div className="max-w-4xl mx-auto relative group">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] md:rounded-full p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col md:flex-row items-center transition-all duration-500 focus-within:shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
            
            {/* Main Input Field */}
            <div className="flex-1 w-full relative flex items-center">
              <Search className="absolute left-6 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search by city, project or area..."
                className="w-full pl-16 pr-6 py-5 bg-transparent text-slate-900 dark:text-white focus:outline-none text-base md:text-lg placeholder:text-slate-400 placeholder:font-light"
              />
              
              {/* Suggestions Dropdown (Google Style) */}
              <AnimatePresence>
                {showSuggestions && propertyList && propertyList.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 0 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden z-[100] border border-slate-100 dark:border-white/10"
                  >
                    <div className="py-4">
                      {propertyList.slice(0, 5).map((loc, i) => (
                        <button 
                          key={i} 
                          onClick={() => { setSearchQuery(`${loc.city}`); setShowSuggestions(false); }}
                          className="w-full text-left px-8 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 group/item"
                        >
                          <MapPin className="w-4 h-4 text-slate-300 group-hover/item:text-amber-500" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{loc.city}, {loc.state}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vertical Divider (Hidden on Mobile) */}
            <div className="hidden md:block w-[1px] h-8 bg-slate-200 dark:bg-white/10 mx-2"></div>

            {/* Advanced Filters Interaction */}
            <div 
              className="relative w-full md:w-auto px-4 md:px-2 flex items-center justify-between"
              onMouseEnter={() => setShowFilters(true)}
              onMouseLeave={() => setShowFilters(false)}
            >
              <button className="flex items-center gap-2 px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-amber-500 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                <span>Refine</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Hover Filter Modal */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="absolute top-full right-0 pt-4 z-[999] w-full md:w-[500px]"
                  >
                    <div className="bg-white/95 dark:bg-slate-900 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/10 p-8">
                       <div className="flex justify-between items-center mb-6">
                         <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Advanced Parameters</span>
                         <button onClick={resetFilters} className="text-[9px] font-bold text-red-400 uppercase">Reset</button>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         {filterFields.slice(0, 6).map((field) => (
                           <select
                             key={field.name}
                             name={field.name}
                             value={filters[field.name] || ""}
                             onChange={handleFilterChange}
                             className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 text-[10px] font-bold uppercase outline-none text-slate-700 dark:text-white border-none"
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

              {/* Action Button */}
              <button 
                onClick={handleSubmit}
                className="md:ml-2 px-8 py-4 bg-amber-500 text-black rounded-full font-black uppercase text-[10px] tracking-tighter hover:bg-white hover:scale-105 transition-all shadow-lg"
              >
                Find Home
              </button>
            </div>
          </div>
          
        
        </div>
      </div>
    </div>
  );
};

export default AgentHero;