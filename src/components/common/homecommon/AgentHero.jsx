import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Filter, ChevronDown, ArrowRight, Sparkles, Building2 } from "lucide-react";

const AgentHero = ({ 
  selectedTab, 
  setSelectedTab, 
  searchQuery, 
  setSearchQuery, 
  showSuggestions, 
  setShowSuggestions, 
  propertyList, 
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
    /* Increased root z-index to ensure the hero area stays above the content below */
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-visible z-[40]">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <Sparkles className="w-3 h-3" /> Exclusive Portfolio 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
              Exceptional Homes. <br />
              <span className="italic font-light text-white/80">Tailored Experiences.</span>
            </h1>
          </motion.div>
        </div>

        {/* Search Hub */}
        <div className="max-w-5xl mx-auto relative z-[50]">
          {/* Tabs */}
          <div className="flex justify-center mb-0 relative z-10">
            <div className="flex bg-black/40 backdrop-blur-2xl p-1.5 rounded-t-2xl border-x border-t border-white/10">
              {["buy", "rent", "new projects", "commercial"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 uppercase tracking-widest ${
                    selectedTab === tab ? "bg-white text-slate-900 shadow-xl" : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main Search Bar - overflow-visible is mandatory */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl md:rounded-full p-2 shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-1 relative z-[60] overflow-visible">
            
            {/* Location Input */}
            <div className="flex-1 w-full relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Where would you like to live?"
                className="w-full pl-14 pr-6 py-4 bg-transparent text-slate-900 dark:text-white focus:outline-none text-lg"
              />
              
              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && propertyList && propertyList.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 right-0 mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[100] border border-slate-100 dark:border-slate-700"
                  >
                    <div className="p-3">
                      {propertyList.slice(0, 5).map((loc, i) => (
                        <button key={i} onClick={() => { setSearchQuery(`${loc.city}, ${loc.state}`); setShowSuggestions(false); }}
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between rounded-xl">
                          <span className="text-slate-700 dark:text-slate-200">{loc.city}, {loc.state}</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Property Type Dropdown */}
            <div className="w-full md:w-48 relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select 
                name="propertytype"
                value={filters.propertytype || ""}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-10 py-4 bg-transparent text-slate-700 dark:text-white appearance-none focus:outline-none cursor-pointer font-medium"
              >
                <option value="">All Types</option>
                {getUniqueValues(propertyList, "propertytype").map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* HOVER FILTER BUTTON */}
            <div 
              className="relative"
              onMouseEnter={() => setShowFilters(true)}
              onMouseLeave={() => setShowFilters(false)}
            >
              <button 
                className={`flex items-center gap-2 px-6 py-4 text-sm font-black uppercase tracking-widest transition-all rounded-full ${
                  showFilters ? 'text-amber-500 bg-amber-500/10' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* THE HOVER MODEL (Filter Card) */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    /* FIX: Increased z-index to 999 to ensure it floats above everything */
                    className="absolute top-full right-0 pt-4 z-[999] w-[320px] md:w-[600px] overflow-visible"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-white/10 p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Refine Search</h4>
                        <button onClick={resetFilters} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Clear All</button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filterFields.map((field) => {
                          if (field.name === "location" || field.name === "propertytype") return null;
                          return (
                            <div key={field.name} className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                {field.icon}
                              </div>
                              <select
                                name={field.name}
                                value={filters[field.name] || ""}
                                onChange={handleFilterChange}
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border-none text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-700 dark:text-slate-200"
                              >
                                <option value="">{field.label}</option>
                                {getUniqueValues(propertyList, field.name).map((opt) => (
                                  <option key={opt} value={opt}>{field.name === "price" ? `AED ${opt.toLocaleString()}` : opt}</option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Action Button */}
            <button 
              onClick={handleSubmit}
              className={`w-full md:w-auto px-10 py-4 ${colors.primary} text-white rounded-xl md:rounded-full font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all hover:brightness-110 active:scale-95 ml-1`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHero; 