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
  Home as HomeIcon,
  Sparkles,
  Zap,
  SlidersHorizontal,
  TrendingUp,
  Heart,
  Star,
  Shield,
  Clock,
  Brain,
  ThumbsUp,
  Grid3x3,
  List
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../axios/axios";
import FilterSidebar from "../FilterSidebar";
import SortBar from "./SortBar ";

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
  onApplyFilters,
  onClearFilters,
  currentSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults
}) => {
  const navigate = useNavigate();
  const [internalSearchQuery, setInternalSearchQuery] = useState(externalSearchQuery || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  const sidebarRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // ========== GOOGLE GEMINI API ==========
  const GEMINI_API_KEY = "AIzaSyCZ7WFdsYoZrT79QaJsXT5wu5yA5yT8IDQ";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters, setShowFilters]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && showFilters) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showFilters, setShowFilters]);

  // Get AI recommendations
  const getGeminiRecommendations = async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      const prompt = `You are a Dubai real estate expert. Based on the user search: "${query}", provide 3 property recommendations in JSON format only, no extra text. Use this exact structure:
      {
        "recommendations": [
          {
            "type": "property type name",
            "locations": ["location1", "location2"],
            "priceRange": "price range in AED",
            "roi": "expected ROI percentage",
            "matchScore": 85,
            "description": "short description"
          }
        ]
      }`;
      
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.recommendations || [];
        }
      }
      return fallbackRecommendations(query);
    } catch (error) {
      console.error("Gemini API error:", error);
      return fallbackRecommendations(query);
    }
  };

  // Fallback recommendations
  const fallbackRecommendations = (query) => {
    const recommendations = [];
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes("luxury") || queryLower.includes("premium") || queryLower.includes("villa")) {
      recommendations.push({
        type: "Luxury Villas",
        locations: ["Palm Jumeirah", "Emirates Hills", "Al Barari"],
        priceRange: "AED 5M - 50M+",
        roi: "5-7%",
        matchScore: 95,
        description: "Premium luxury villas with private beaches"
      });
    }
    
    if (queryLower.includes("beach") || queryLower.includes("sea view")) {
      recommendations.push({
        type: "Beachfront Apartments",
        locations: ["Dubai Marina", "JBR", "La Mer"],
        priceRange: "AED 1.5M - 10M",
        roi: "6-8%",
        matchScore: 92,
        description: "Stunning sea view apartments"
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        type: "Popular Properties",
        locations: ["Downtown Dubai", "Dubai Marina", "Business Bay"],
        priceRange: "AED 500K - 5M",
        roi: "6-9%",
        matchScore: 80,
        description: "Most sought-after properties in Dubai"
      });
    }
    
    return recommendations;
  };

  // Fetch AI suggestions
  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (!internalSearchQuery || internalSearchQuery.length < 2 || !aiMode) {
        setAiSuggestions([]);
        return;
      }
      
      setIsAiLoading(true);
      try {
        const suggestions = await getGeminiRecommendations(internalSearchQuery);
        setAiSuggestions(suggestions.length > 0 ? suggestions : fallbackRecommendations(internalSearchQuery));
      } catch (error) {
        console.error("AI suggestions error:", error);
        setAiSuggestions(fallbackRecommendations(internalSearchQuery));
      } finally {
        setIsAiLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchAiSuggestions, 800);
    return () => clearTimeout(debounce);
  }, [internalSearchQuery, aiMode]);

  // Sync internal state with external prop
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setInternalSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // ========== LOCATION SEARCH USING YOUR BACKEND API ==========
  const searchLocations = async (query) => {
    if (query.trim().length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await http.get(`/locations/search?query=${encodeURIComponent(query)}`);
      const result = response.data;
      
      if (result && result.success && result.data) {
        setLocationSuggestions(result.data);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error("Location search error:", err);
      setLocationSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInternalSearchQuery(value);
    setSelectedIndex(-1);
    
    if (externalSetSearchQuery) {
      externalSetSearchQuery(value);
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      searchLocations(value);
    }, 400);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || locationSuggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < locationSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && locationSuggestions[selectedIndex]) {
          handleLocationSelect(locationSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const handleLocationSelect = (location) => {
    setInternalSearchQuery(location.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    if (externalSetSearchQuery) {
      externalSetSearchQuery(location.name);
    }
    if (externalOnSuggestionClick) {
      externalOnSuggestionClick(location.name);
    }
    
    setLocationSuggestions([]);
  };

  // Get icon based on location type
  const getLocationIcon = (type) => {
    switch (type) {
      case 'COMMUNITY': return <HomeIcon size={14} />;
      case 'SUBCOMMUNITY': return <MapPin size={14} />;
      case 'TOWER': return <Building2 size={14} />;
      case 'BUILDING': return <Building2 size={14} />;
      case 'LANDMARK': return <Landmark size={14} />;
      default: return <MapPin size={14} />;
    }
  };

  // Get badge info for location type
  const getBadgeInfo = (type) => {
    switch (type) {
      case 'COMMUNITY':
        return { color: "bg-emerald-500/20 text-emerald-500", text: "Community" };
      case 'SUBCOMMUNITY':
        return { color: "bg-blue-500/20 text-blue-500", text: "Area" };
      case 'TOWER':
        return { color: "bg-amber-500/20 text-amber-500", text: "Tower" };
      case 'BUILDING':
        return { color: "bg-purple-500/20 text-purple-500", text: "Building" };
      case 'LANDMARK':
        return { color: "bg-rose-500/20 text-rose-500", text: "Landmark" };
      default:
        return { color: "bg-slate-500/20 text-slate-400", text: "Location" };
    }
  };

  // MAIN SEARCH HANDLER
  const handleSearch = () => {
    const searchTerm = internalSearchQuery.trim();
    
    const queryParams = new URLSearchParams();
    
    if (searchTerm) {
      queryParams.append('search', searchTerm);
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && value !== "all") {
          if (Array.isArray(value) && value.length > 0) {
            queryParams.append(key, value.join(','));
          } else if (typeof value === 'string' && value !== "") {
            queryParams.append(key, value);
          }
        }
      });
    }
    
    if (externalOnSearchButtonClick) {
      externalOnSearchButtonClick();
    } else if (externalOnSuggestionClick) {
      externalOnSuggestionClick(searchTerm);
    }
    
    const queryString = queryParams.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ''}`);
    
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setInternalSearchQuery("");
    setLocationSuggestions([]);
    setSelectedIndex(-1);
    if (externalSetSearchQuery) {
      externalSetSearchQuery("");
    }
    inputRef.current?.focus();
  };

  const activeFiltersCount = () => {
    if (!filters) return 0;
    let count = 0;
    if (filters.propertytype?.length) count += filters.propertytype.length;
    if (filters.bedroom) count++;
    if (filters.bathroom) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.city) count++;
    return count;
  };

  const hasActiveFilters = activeFiltersCount() > 0;

  const handleFilterApply = () => {
    if (onApplyFilters) {
      onApplyFilters();
    }
    setShowFilters(false);
    const queryParams = new URLSearchParams();
    if (internalSearchQuery) {
      queryParams.append('search', internalSearchQuery);
    }
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "" && value !== "all") {
          if (Array.isArray(value) && value.length > 0) {
            queryParams.append(key, value.join(','));
          } else if (typeof value === 'string' && value !== "") {
            queryParams.append(key, value);
          }
        }
      });
    }
    const queryString = queryParams.toString();
    navigate(`/properties${queryString ? `?${queryString}` : ''}`);
  };

  const handleFilterClear = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="relative min-h-[75vh] md:min-h-[80vh] flex items-center justify-center overflow-visible z-[40]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
          alt="Dubai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        {/* TITLE */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-2 tracking-tight">
            Homoget<span className="text-amber-500">.</span>
          </h1>
          <p className="text-white/70 uppercase tracking-[0.3em] text-[8px] md:text-[9px] lg:text-[10px] mt-2 font-medium">
            AI-Powered Real Estate Discovery
          </p>
        </div>

        {/* SEARCH BAR CONTAINER */}
        <div className="w-full max-w-3xl mx-auto relative" ref={suggestionRef}>
          {/* Main Search Bar */}
          <div className="relative">
            <div className="relative flex flex-wrap items-center w-full bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all">
              
              {/* Search Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
              
              {/* Search Input */}
              <input
                ref={inputRef}
                type="text"
                value={internalSearchQuery}
                onFocus={() => {
                  if (locationSuggestions.length > 0 && internalSearchQuery.length >= 2) {
                    setShowSuggestions(true);
                  }
                }}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search by community, tower, or area..."
                className="flex-1 min-w-[150px] bg-transparent pl-11 pr-2 py-3.5 text-slate-800 dark:text-white outline-none text-sm md:text-base placeholder:text-slate-600 placeholder:text-xs md:placeholder:text-sm"
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-1 px-2">
                {/* AI Mode Toggle */}
                <button
                  onClick={() => setAiMode(!aiMode)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all ${
                    aiMode 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md" 
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium hidden sm:inline">AI</span>
                </button>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all ${
                    hasActiveFilters
                      ? "bg-amber-500 text-white" 
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium hidden sm:inline">Filter</span>
                  {hasActiveFilters && (
                    <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[8px] flex items-center justify-center">
                      {activeFiltersCount()}
                    </span>
                  )}
                </button>

                {/* Clear Button */}
                {internalSearchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400 hover:text-amber-500 transition-colors" />
                  </button>
                )}

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="ml-1 px-4 md:px-5 py-1.5 rounded-full bg-amber-500 text-black font-semibold text-[10px] md:text-[11px] tracking-wide hover:bg-black hover:text-white transition-all shadow-sm whitespace-nowrap"
                >
                  <span className="hidden xs:inline">Search</span>
                  <Search className="inline xs:hidden w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI SUGGESTIONS */}
            {aiMode && internalSearchQuery.length >= 2 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[9px] text-purple-300 font-medium">AI Smart Recommendations</span>
                </div>
                
                {isAiLoading ? (
                  <div className="flex items-center justify-center py-4 bg-white/5 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-[9px] text-purple-300 ml-2">Analyzing...</span>
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiSuggestions.map((rec, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
                        onClick={() => {
                          setInternalSearchQuery(rec.type);
                          handleSearch();
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white">{rec.type}</h4>
                            {rec.locations && (
                              <p className="text-[8px] text-purple-300 mt-1">
                                📍 {Array.isArray(rec.locations) ? rec.locations.slice(0, 2).join(", ") : rec.locations}
                              </p>
                            )}
                            {rec.priceRange && (
                              <p className="text-[7px] text-purple-400/70">💰 {rec.priceRange}</p>
                            )}
                          </div>
                          {rec.matchScore && (
                            <div className="flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              <span className="text-[8px] font-bold text-amber-400">{rec.matchScore}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* LOCATION SUGGESTIONS DROPDOWN - ORIGINAL DESIGN */}
            <AnimatePresence>
              {showSuggestions && !aiMode && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border overflow-hidden z-[999]"
                >
                  <div className="px-4 py-2 border-b bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[8px] font-bold uppercase text-amber-500">Popular Locations in Dubai</p>
                  </div>

                  {isLoading ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto text-amber-500" />
                    </div>
                  ) : locationSuggestions.length > 0 ? (
                    <div className="max-h-[320px] overflow-y-auto">
                      {locationSuggestions.map((location, index) => {
                        const badge = getBadgeInfo(location.type);
                        return (
                          <button
                            key={location.id || index}
                            onClick={() => handleLocationSelect(location)}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 group ${
                              selectedIndex === index ? 'bg-amber-500/10' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:text-amber-500">
                                {getLocationIcon(location.type)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm group-hover:text-amber-500">
                                  {location.name}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {location.path_name || location.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-[7px] px-1.5 py-0.5 rounded-full ${badge.color}`}>
                                    {badge.text}
                                  </span>
                                  {location.type && (
                                    <span className="text-[7px] text-slate-400 uppercase">
                                      {location.type}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ChevronDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>



        {/* FILTER SIDEBAR COMPONENT */}
        <div ref={sidebarRef}>
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleFilterApply}
            onClearFilters={handleFilterClear}
            propertyCount={totalResults || propertyList.length}
            filterFields={filterFields}
            getUniqueValues={getUniqueValues}
            propertyList={propertyList}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentHero;