import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Filter, ChevronDown, ChevronUp, ArrowRight, Sparkles, Building2, Key } from "lucide-react";

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
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-10"></div>
      </div>

      {/* 2. Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-24">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-bold tracking-[0.2em] uppercase mb-4">
              <Sparkles className="w-3 h-3" /> Exclusive Portfolio 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white leading-tight">
              Exceptional Homes. <br />
              <span className="italic font-light text-white/80">Tailored Experiences.</span>
            </h1>
          </motion.div>
        </div>

        {/* 3. Search Hub */}
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-0 relative z-20">
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

          {/* Search Bar */}
          <motion.div layout className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl md:rounded-full p-3 shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row items-center gap-2">
              
              {/* Location Input with Suggestions */}
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
                  {showSuggestions && propertyList.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 border border-slate-100 dark:border-slate-700">
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

              <div className="hidden md:block w-[1px] h-10 bg-slate-200 dark:bg-slate-700 mx-2"></div>

              {/* Property Type Select */}
              <div className="w-full md:w-56 relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select 
                  name="propertytype"
                  value={filters.propertytype}
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

              {/* Search Button */}
              <button 
                onClick={handleSubmit}
                className={`w-full md:w-auto px-10 py-4 ${colors.primary} text-white rounded-xl md:rounded-full font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg`}
              >
                <Search className="w-5 h-5" />
                <span>Find Home</span>
              </button>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {filterFields.slice(2, 7).map(({ name, label, icon }) => (
                        <div key={name} className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                          </div>
                          <select
                            name={name}
                            value={filters[name] || ""}
                            onChange={handleFilterChange}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                          >
                            <option value="">{label}</option>
                            {getUniqueValues(propertyList, name).map((opt) => (
                              <option key={opt} value={opt}>{name === "price" ? `₹${opt.toLocaleString()}` : opt}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button onClick={resetFilters} className="text-xs font-bold text-slate-400 hover:text-amber-500 uppercase tracking-widest">Clear All</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Filter Toggle */}
          <div className="mt-6 flex justify-center">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
              <Filter className="w-4 h-4" /> 
              Advanced Search 
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHero;