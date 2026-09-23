// components/home/AgentHero.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ChevronDown,
  X,
  Loader2,
  Building2,
  Landmark,
  Home as HomeIcon,
  SlidersHorizontal,
  Star,
  Brain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../../../axios/axios";
import FilterSidebar from "../FilterSidebar";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */
const EMPTY_FILTERS = {
  minPrice: "",
  maxPrice: "",
  bedroom: "",
  bathroom: "",
  propertytype: [],
  furnishingType: "",
  minSquarefoot: "",
  maxSquarefoot: "",
  amenities: [],
  keywords: [],
  has360Tour: "",
  hasVideoTour: "",
};

const FILTER_SCALAR_KEYS = [
  "bedroom",
  "bathroom",
  "minPrice",
  "maxPrice",
  "city",
  "furnishingType",
  "minSquarefoot",
  "maxSquarefoot",
  "has360Tour",
  "hasVideoTour",
];

const PRICE_SHORTCUTS = [
  { label: "500k", value: 500000 },
  { label: "1M", value: 1000000 },
  { label: "2M", value: 2000000 },
  { label: "5M", value: 5000000 },
  { label: "10M", value: 10000000 },
];

/* ------------------------------------------------------------------ */
/*  FALLBACK RECOMMENDATIONS (used if API fails)                       */
/* ------------------------------------------------------------------ */
const fallbackRecommendations = (query) => {
  const q = (query || "").toLowerCase();
  const results = [];

  if (/(luxury|premium|villa)/.test(q)) {
    results.push({
      type: "Luxury Villas",
      locations: ["Palm Jumeirah", "Emirates Hills", "Al Barari"],
      priceRange: "AED 5M – 50M+",
      roi: "5–7%",
      matchScore: 95,
      description: "Premium luxury villas with private beaches",
    });
  }

  if (/(beach|sea view|waterfront)/.test(q)) {
    results.push({
      type: "Beachfront Apartments",
      locations: ["Dubai Marina", "JBR", "La Mer"],
      priceRange: "AED 1.5M – 10M",
      roi: "6–8%",
      matchScore: 92,
      description: "Stunning sea view apartments",
    });
  }

  if (results.length === 0) {
    results.push({
      type: "Popular Properties",
      locations: ["Downtown Dubai", "Dubai Marina", "Business Bay"],
      priceRange: "AED 500K – 5M",
      roi: "6–9%",
      matchScore: 80,
      description: "Most sought-after properties in Dubai",
    });
  }

  return results;
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
const AgentHero = ({
  propertyList = [],
  filters = EMPTY_FILTERS,
  handleFilterChange = () => {},
  showFilters = false,
  setShowFilters = () => {},
  searchQuery: externalSearchQuery = "",
  setSearchQuery: externalSetSearchQuery,
  onSuggestionClick: externalOnSuggestionClick,
  onSearchButtonClick: externalOnSearchButtonClick,
  onApplyFilters,
  onClearFilters,
  totalResults = 0,
}) => {
  const navigate = useNavigate();

  /* ---------------- State ---------------- */
  const [internalSearchQuery, setInternalSearchQuery] = useState(
    externalSearchQuery || ""
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [videoError, setVideoError] = useState(false);

  const inputRef = useRef(null);
  const suggestionRef = useRef(null);
  const debounceTimerRef = useRef(null);

  /* ---------------- Sync external → internal ---------------- */
  useEffect(() => {
    if (
      externalSearchQuery !== undefined &&
      externalSearchQuery !== internalSearchQuery
    ) {
      setInternalSearchQuery(externalSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSearchQuery]);

  /* ---------------- Close suggestions on outside click ---------------- */
  useEffect(() => {
    if (!showSuggestions) return;

    const onDocClick = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showSuggestions]);

  /* ---------------- Escape closes suggestions ---------------- */
  useEffect(() => {
    if (!showSuggestions) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowSuggestions(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showSuggestions]);

  /* ================================================================ */
  /*  AI RECOMMENDATIONS                                              */
  /*  ⚠️  TODO: move this to backend /api/ai/recommendations          */
  /*     Right now the browser hits Gemini directly — the key will    */
  /*     be visible in DevTools. Rotate the key & proxy via your      */
  /*     own server as soon as possible.                              */
  /* ================================================================ */
  const getGeminiRecommendations = useCallback(async (query, signal) => {
    if (!query || query.length < 2) return [];

    // ⚠️ Prefer calling your own backend. Example:
    // const res = await http.post("/ai/recommendations", { query }, { signal });
    // return res.data.recommendations || [];
    //
    // The direct-call fallback below keeps things working for now.

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

      // NOTE: Replace with your own backend call.
      const apiKey = import.meta?.env?.VITE_GEMINI_KEY || "";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
        }),
      });

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return fallbackRecommendations(query);

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallbackRecommendations(query);

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.recommendations || fallbackRecommendations(query);
    } catch (error) {
      if (error.name === "AbortError") return [];
      console.error("AI recommendations error:", error);
      return fallbackRecommendations(query);
    }
  }, []);

  /* ---------------- Fetch AI suggestions on debounce ---------------- */
  useEffect(() => {
    if (!aiMode || internalSearchQuery.length < 2) {
      setAiSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsAiLoading(true);
      try {
        const suggestions = await getGeminiRecommendations(
          internalSearchQuery,
          controller.signal
        );
        setAiSuggestions(
          suggestions.length > 0
            ? suggestions
            : fallbackRecommendations(internalSearchQuery)
        );
      } finally {
        setIsAiLoading(false);
      }
    }, 800);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [internalSearchQuery, aiMode, getGeminiRecommendations]);

  /* ---------------- Location search (backend) ---------------- */
  const searchLocations = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await http.get(
        `/locations/search?query=${encodeURIComponent(query)}`
      );
      const result = response.data;

      if (result?.success && Array.isArray(result.data)) {
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
  }, []);

  /* ---------------- Input change with debounce ---------------- */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInternalSearchQuery(value);
    setSelectedIndex(-1);

    externalSetSearchQuery?.(value);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => searchLocations(value), 400);
  };

  /* ---------------- Keyboard nav in suggestion list ---------------- */
  const handleKeyDown = (e) => {
    if (!showSuggestions || locationSuggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < locationSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && locationSuggestions[selectedIndex]) {
          handleLocationSelect(locationSuggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
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

    externalSetSearchQuery?.(location.name);
    externalOnSuggestionClick?.(location.name);

    setLocationSuggestions([]);
  };

  const handleClearSearch = () => {
    setInternalSearchQuery("");
    setLocationSuggestions([]);
    setSelectedIndex(-1);
    externalSetSearchQuery?.("");
    inputRef.current?.focus();
  };

  /* ---------------- Icons + badges ---------------- */
  const getLocationIcon = (type) => {
    switch (type) {
      case "COMMUNITY":
        return <HomeIcon size={14} />;
      case "SUBCOMMUNITY":
        return <MapPin size={14} />;
      case "TOWER":
      case "BUILDING":
        return <Building2 size={14} />;
      case "LANDMARK":
        return <Landmark size={14} />;
      default:
        return <MapPin size={14} />;
    }
  };

  const getBadgeInfo = (type) => {
    switch (type) {
      case "COMMUNITY":
        return { color: "bg-emerald-500/20 text-emerald-500", text: "Community" };
      case "SUBCOMMUNITY":
        return { color: "bg-blue-500/20 text-blue-500", text: "Area" };
      case "TOWER":
        return { color: "bg-amber-500/20 text-amber-500", text: "Tower" };
      case "BUILDING":
        return { color: "bg-purple-500/20 text-purple-500", text: "Building" };
      case "LANDMARK":
        return { color: "bg-rose-500/20 text-rose-500", text: "Landmark" };
      default:
        return { color: "bg-slate-500/20 text-slate-400", text: "Location" };
    }
  };

  /* ---------------- Query string builder ---------------- */
  const buildQueryString = useCallback(
    (term = internalSearchQuery, f = filters) => {
      const params = new URLSearchParams();

      if (term?.trim()) params.append("search", term.trim());

      if (f) {
        Object.entries(f).forEach(([key, value]) => {
          if (!value || value === "" || value === "all") return;
          if (Array.isArray(value)) {
            if (value.length) params.append(key, value.join(","));
          } else {
            params.append(key, value);
          }
        });
      }

      return params.toString();
    },
    [internalSearchQuery, filters]
  );

  /* ---------------- Search + filter handlers ---------------- */
  const handleSearch = useCallback(() => {
    const qs = buildQueryString();

    externalOnSearchButtonClick?.(internalSearchQuery);

    if (!externalOnSearchButtonClick) {
      navigate(`/properties${qs ? `?${qs}` : ""}`);
    }

    setShowSuggestions(false);
  }, [
    buildQueryString,
    externalOnSearchButtonClick,
    internalSearchQuery,
    navigate,
  ]);

  const handleFilterApply = () => {
    setShowFilters(false);
    onApplyFilters?.();
    const qs = buildQueryString();
    navigate(`/properties${qs ? `?${qs}` : ""}`);
  };

  const handleFilterClear = () => {
    onClearFilters?.();
  };

  /* ---------------- Active filter badge count ---------------- */
  const activeFiltersCount = useMemo(() => {
    if (!filters) return 0;
    let count = 0;

    if (filters.propertytype?.length) count += filters.propertytype.length;
    if (filters.amenities?.length) count += filters.amenities.length;
    if (filters.keywords?.length) count += filters.keywords.length;

    FILTER_SCALAR_KEYS.forEach((k) => {
      if (filters[k]) count++;
    });

    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div className="relative min-h-[75vh] md:min-h-[80vh] flex items-center justify-center overflow-visible z-[40]">
      {/* ---------------- Background ---------------- */}
      <div className="absolute inset-0 z-0">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
            poster="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1920"
            onError={() => setVideoError(true)}
          >
            <source
              src="https://media.istockphoto.com/id/1735292197/video/american-neighborhood-during-golden-hour-sunset-aerial-shot-of-duplex-houses-and-homes-drone.jpg?b=1&s=640x640&k=20&c=5klZ8BMF8DOFRhfzZdx79xPfDGAFAPss2jTgCqRBplM="
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            src="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Dubai Skyline"
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* ---------------- Content ---------------- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-8 md:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-2 tracking-tight"
          >
            Homoget<span className="text-amber-500">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/70 uppercase tracking-[0.3em] text-[8px] md:text-[9px] lg:text-[10px] mt-2 font-medium"
          >
            AI-Powered Real Estate Discovery
          </motion.p>
        </div>

        {/* Search bar container */}
        <div
          className="w-full max-w-3xl mx-auto relative"
          ref={suggestionRef}
        >
          {/* Main search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative flex flex-wrap items-center w-full bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-xl border border-white/20 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={internalSearchQuery}
                onFocus={() => {
                  if (
                    locationSuggestions.length > 0 &&
                    internalSearchQuery.length >= 2 &&
                    !aiMode
                  ) {
                    setShowSuggestions(true);
                  }
                }}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search by community, tower, or area..."
                aria-label="Search properties"
                autoComplete="off"
                className="flex-1 min-w-[150px] bg-transparent pl-11 pr-2 py-3.5 text-slate-800 dark:text-white outline-none text-sm md:text-base placeholder:text-slate-600 placeholder:text-xs md:placeholder:text-sm"
              />

              <div className="flex items-center gap-1 px-2">
                {/* AI toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setAiMode((v) => !v);
                    setShowSuggestions(false);
                  }}
                  aria-pressed={aiMode}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all ${
                    aiMode
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium hidden sm:inline">
                    AI
                  </span>
                </button>

                {/* Filter button */}
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  aria-label="Open filters"
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all ${
                    hasActiveFilters
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium hidden sm:inline">
                    Filter
                  </span>
                  {hasActiveFilters && (
                    <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[8px] flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Clear */}
                {internalSearchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400 hover:text-amber-500 transition-colors" />
                  </button>
                )}

                {/* Search button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="ml-1 px-4 md:px-5 py-1.5 rounded-full bg-amber-500 text-black font-semibold text-[10px] md:text-[11px] tracking-wide hover:bg-black hover:text-white transition-all shadow-sm whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Search</span>
                  <Search className="inline sm:hidden w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* AI suggestions */}
          <AnimatePresence>
            {aiMode && internalSearchQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[9px] text-purple-300 font-medium">
                    AI Smart Recommendations
                  </span>
                </div>

                {isAiLoading ? (
                  <div className="flex items-center justify-center py-4 bg-white/5 rounded-xl">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-[9px] text-purple-300 ml-2">
                      Analyzing...
                    </span>
                  </div>
                ) : aiSuggestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {aiSuggestions.map((rec) => (
                      <button
                        key={`${rec.type}-${rec.matchScore}`}
                        type="button"
                        onClick={() => {
                          setInternalSearchQuery(rec.type);
                          setAiMode(false);
                          externalSetSearchQuery?.(rec.type);
                          navigate(
                            `/properties?search=${encodeURIComponent(rec.type)}`
                          );
                        }}
                        className="text-left bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30 hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {rec.type}
                            </h4>
                            {rec.locations && (
                              <p className="text-[8px] text-purple-300 mt-1 truncate">
                                📍{" "}
                                {Array.isArray(rec.locations)
                                  ? rec.locations.slice(0, 2).join(", ")
                                  : rec.locations}
                              </p>
                            )}
                            {rec.priceRange && (
                              <p className="text-[7px] text-purple-400/70 truncate">
                                💰 {rec.priceRange}
                              </p>
                            )}
                          </div>
                          {rec.matchScore && (
                            <div className="flex items-center gap-1 shrink-0">
                              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                              <span className="text-[8px] font-bold text-amber-400">
                                {rec.matchScore}%
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Location suggestions */}
          <AnimatePresence>
            {showSuggestions && !aiMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border overflow-hidden z-[999]"
              >
                <div className="px-4 py-2 border-b bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-[8px] font-bold uppercase text-amber-500">
                    Popular Locations in Dubai
                  </p>
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
                          type="button"
                          onClick={() => handleLocationSelect(location)}
                          className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b last:border-0 group ${
                            selectedIndex === index ? "bg-amber-500/10" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:text-amber-500">
                              {getLocationIcon(location.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm group-hover:text-amber-500 truncate">
                                {location.name}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                {location.path_name || location.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-[7px] px-1.5 py-0.5 rounded-full ${badge.color}`}
                                >
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

        {/* Filter sidebar */}
        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleFilterApply}
          onClearFilters={handleFilterClear}
          propertyCount={totalResults || propertyList.length}
        />
      </div>
    </div>
  );
};

export default AgentHero;