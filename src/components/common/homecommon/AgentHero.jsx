import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Filter,
  ChevronDown,
  X,
  Loader2,
  Building2,
  Landmark,
  Home as HomeIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentHero = ({
  propertyList = [],
  filters,
  handleFilterChange,
  showFilters,
  setShowFilters,
  filterFields,
  getUniqueValues,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSuggestionClick: externalOnSuggestionClick,
  onSearchButtonClick: externalOnSearchButtonClick,
}) => {
  const navigate = useNavigate();
  const [internalSearchQuery, setInternalSearchQuery] = useState(externalSearchQuery || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);

  const TOMTOM_API_KEY = "YDlNOyLlX4RImV4fciotLz74L5JXykXG";

  // Sync internal state with external prop
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setInternalSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Fetch locations from TomTom API
  useEffect(() => {
    const fetchLocations = async () => {
      if (!internalSearchQuery || internalSearchQuery.length < 2) {
        setApiSuggestions([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/search/${encodeURIComponent(
            internalSearchQuery
          )}.json?key=${TOMTOM_API_KEY}&countrySet=AE&limit=8&typeahead=true&lat=25.2048&lon=55.2708&radius=50000`
        );

        const data = await response.json();

        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: item.id,
            name:
              item.poi?.name ||
              item.address?.municipalitySubdivision ||
              item.address?.municipality ||
              item.address?.freeformAddress,
            address: item.address?.freeformAddress,
            lat: item.position?.lat,
            lng: item.position?.lon,
            type: item.type || (item.poi ? "POI" : "Geography"),
            category: item.poi?.category || "area",
          }));
          setApiSuggestions(formatted);
        }
      } catch (err) {
        console.error("TomTom API error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchLocations, 400);
    return () => clearTimeout(debounce);
  }, [internalSearchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get icon based on location type
  const getLocationIcon = (type, category) => {
    if (type === "POI" || category === "building") {
      return <Building2 className="w-4 h-4" />;
    } else if (type === "Geography" || category === "area") {
      return <Landmark className="w-4 h-4" />;
    }
    return <HomeIcon className="w-4 h-4" />;
  };

  // Handle location selection - FIXED
  const handleLocationSelect = (location) => {
    // Update internal state
    setInternalSearchQuery(location.name);
    
    // Update parent state
    if (externalSetSearchQuery) {
      externalSetSearchQuery(location.name);
    }
    
    // Call parent's suggestion handler (this will update filters)
    if (externalOnSuggestionClick) {
      externalOnSuggestionClick(location.name);
    }
    
    // Close suggestions popup
    setShowSuggestions(false);
  };

  // Handle search button click - stay on same page and filter
  const handleSearch = () => {
    if (!internalSearchQuery || internalSearchQuery.trim() === "") return;

    if (externalSetSearchQuery) {
      externalSetSearchQuery(internalSearchQuery);
    }

    if (externalOnSearchButtonClick) {
      externalOnSearchButtonClick();
    } else if (externalOnSuggestionClick) {
      // If no separate search handler, use suggestion handler
      externalOnSuggestionClick(internalSearchQuery);
    }

    setShowSuggestions(false);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setInternalSearchQuery("");
    if (externalSetSearchQuery) {
      externalSetSearchQuery("");
    }
    setApiSuggestions([]);
    inputRef.current?.focus();
  };

  // Get badge info
  const getBadgeInfo = (type, category) => {
    if (type === "POI" || category === "building") {
      return { color: "bg-amber-500/20 text-amber-500", text: "Landmark" };
    } else if (type === "Geography" || category === "area") {
      return { color: "bg-blue-500/20 text-blue-500", text: "Community" };
    }
    return { color: "bg-slate-500/20 text-slate-400", text: "Area" };
  };

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-visible z-[40]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Dubai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        {/* TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-2 tracking-tight">
            Homoget<span className="text-amber-500">.</span>
          </h1>
          <p className="text-white/70 uppercase tracking-[0.3em] text-[10px] md:text-xs mt-3 font-medium">
            Luxury Real Estate Dubai
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto relative" ref={suggestionRef}>
          <div className="bg-white dark:bg-slate-900 rounded-full p-2 shadow-2xl flex items-center border border-white/10">
            {/* INPUT SECTION */}
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              
              <input
                ref={inputRef}
                type="text"
                value={internalSearchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => setInternalSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by community, tower or area..."
                className="w-full bg-transparent pl-14 pr-10 py-5 text-slate-900 dark:text-white outline-none text-base md:text-lg font-medium placeholder:text-slate-400"
              />

              {internalSearchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-amber-500 transition-colors" />
                </button>
              )}

              {/* SUGGESTIONS DROPDOWN */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-[999] border border-slate-200 dark:border-white/10"
                  >
                    {/* HEADER */}
                    <div className="px-5 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-amber-500">
                          Popular Locations in Dubai
                        </p>
                        <p className="text-[8px] text-slate-400 uppercase font-medium">Real Estate</p>
                      </div>
                    </div>

                    {/* LOADER */}
                    {isLoading ? (
                      <div className="py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" />
                        <p className="text-xs text-slate-500 mt-3 font-medium">Searching locations...</p>
                      </div>
                    ) : apiSuggestions.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto">
                        {apiSuggestions.map((location, index) => {
                          const badge = getBadgeInfo(location.type, location.category);
                          return (
                            <button
                              key={index}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full text-left px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5 last:border-0 group"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 group-hover:text-amber-500 transition-colors flex-shrink-0">
                                  {getLocationIcon(location.type, location.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm group-hover:text-amber-500 transition-colors">
                                      {location.name}
                                    </h3>
                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold ${badge.color}`}>
                                      {badge.text}
                                    </span>
                                  </div>
                                  {location.address && (
                                    <p className="text-[10px] text-slate-500 mt-1 truncate">
                                      {location.address}
                                    </p>
                                  )}
                                </div>
                                <Search className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      internalSearchQuery.length >= 2 && (
                        <div className="py-12 text-center">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <MapPin className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-sm text-slate-500 font-medium">
                            No locations found for "{internalSearchQuery}"
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">Try a different search term</p>
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FILTER BUTTON */}
            <div
              className="relative hidden md:flex items-center"
              onMouseEnter={() => setShowFilters(true)}
              onMouseLeave={() => setShowFilters(false)}
            >
              <button className="flex items-center gap-2 px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-amber-500 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                <span>Refine</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-full right-0 pt-4 z-[999] w-[480px]"
                  >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-white/10">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500 mb-4">Filter Properties</p>
                      <div className="grid grid-cols-2 gap-4">
                        {filterFields?.slice(0, 8).map((field) => (
                          <div key={field.name}>
                            <label className="text-[8px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                              {field.label}
                            </label>
                            <select
                              name={field.name}
                              value={filters[field.name] || ""}
                              onChange={handleFilterChange}
                              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-xs font-medium cursor-pointer"
                            >
                              <option value="">All</option>
                              {getUniqueValues(propertyList, field.name).map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SEARCH BUTTON */}
            <button
              onClick={handleSearch}
              className="ml-2 px-6 md:px-8 py-4 rounded-full bg-amber-500 text-black font-bold uppercase tracking-wider text-[10px] md:text-xs hover:bg-black hover:text-white transition-all shadow-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentHero;