// PropertyListing.jsx - Complete with Search Bar Input Field
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, Filter, MapPin, Bed, Bath, Ruler, 
  ChevronLeft, ChevronRight, ArrowRight,
  Phone, Mail, Building2, Home, Calendar,
  IndianRupee, ChevronDown, Briefcase, Crown, Sparkles, 
  Clock, User, Star, Share2, Heart, DollarSign, Eye, X, Loader2,
  Grid3x3, List, SlidersHorizontal
} from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";
import FilterSidebar from './FilterSidebar';
import SortBar from './homecommon/SortBar ';
import CurrencyDisplay from './homecommon/CurrencyDisplay';

// Helper functions for property type detection
const isOffPlan = (property) => {
  return property?.category === "Off-Plan" || property?.propertyListingType === "project";
};

const isCommercial = (property) => {
  return property?.category === "Commercial";
};

const isRent = (property) => {
  return property?.offeringType === "Rent";
};

const getPropertyTypeIcon = (property) => {
  if (isOffPlan(property)) return <Crown size={12} className="text-purple-400" />;
  if (isCommercial(property)) return <Briefcase size={12} className="text-blue-400" />;
  return <Home size={12} className="text-amber-400" />;
};

const getStatusBadge = (property) => {
  if (isOffPlan(property)) {
    return { 
      text: "OFF-PLAN", 
      icon: <Calendar size={10} />, 
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30" 
    };
  }
  if (isRent(property)) {
    return { 
      text: "FOR RENT", 
      icon: <Clock size={10} />, 
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30" 
    };
  }
  return { 
    text: "FOR SALE", 
    icon: <Sparkles size={10} />, 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30" 
  };
};

const PropertyListing = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentSort, setCurrentSort] = useState('featured');
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const searchTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const sidebarRef = useRef(null);
  
  const TOMTOM_API_KEY = "YDlNOyLlX4RImV4fciotLz74L5JXykXG";

  // Filters state
  const [filters, setFilters] = useState({
    city: "", 
    propertytype: [], 
    minPrice: "", 
    maxPrice: "",
    minSquarefoot: "",
    maxSquarefoot: "",
    bedroom: "", 
    bathroom: "", 
    furnishingType: "",
    amenities: [],
    keywords: [],
    has360Tour: "",
    hasVideoTour: "",
    offeringType: "", 
    category: ""
  });

  // Fetch location suggestions from TomTom
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery || searchQuery.length < 2) {
      setApiSuggestions([]);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/search/${encodeURIComponent(
            searchQuery
          )}.json?key=${TOMTOM_API_KEY}&countrySet=AE&limit=8&typeahead=true&lat=25.2048&lon=55.2708&radius=50000`
        );
        
        const data = await response.json();
        
        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: item.id,
            name: item.poi?.name || item.address?.municipalitySubdivision || item.address?.municipality || item.address?.freeformAddress,
            address: item.address?.freeformAddress,
            lat: item.position?.lat,
            lng: item.position?.lon,
            type: item.type || (item.poi ? "POI" : "Geography")
          }));
          
          setApiSuggestions(formatted);
        }
      } catch (err) {
        console.error("TomTom API error:", err);
        setApiSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsInputFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle location selection from search
  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setSelectedLocation(location);
    setShowSuggestions(false);
    setIsInputFocused(false);
    setHasSearched(true);
    setFilters(prev => ({ ...prev, city: location.name }));
    setCurrentPage(1);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery) {
      setHasSearched(true);
      setFilters(prev => ({ ...prev, city: searchQuery }));
      setCurrentPage(1);
      setIsInputFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsInputFocused(true);
    setShowSuggestions(true);
  };

  // Handle filter button click from input - opens sidebar
  const handleInputFilterClick = () => {
    setShowFilters(true);
  };

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
  }, [showFilters]);

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
  }, [showFilters]);

  // Catch redirect from home page
  useEffect(() => {
    if (location.state?.initialSearch) {
      const incomingSearch = location.state.initialSearch;
      setSearchQuery(incomingSearch);
      setSelectedLocation({ name: incomingSearch });
      setHasSearched(true);
      setFilters(prev => ({ ...prev, city: incomingSearch }));
    }
  }, [location.state]);

  // Prepare filters for API
  const apiFilters = useMemo(() => {
    const apiFilter = {};
    
    if (filters.city) apiFilter.city = filters.city;
    if (filters.category) apiFilter.category = filters.category;
    if (filters.offeringType) apiFilter.offeringType = filters.offeringType;
    if (filters.furnishingType) apiFilter.furnishingType = filters.furnishingType;
    
    if (filters.propertytype && filters.propertytype.length > 0) {
      apiFilter.propertytypeList = filters.propertytype.join(',');
    }
    if (filters.amenities && filters.amenities.length > 0) {
      apiFilter.amenities = filters.amenities.join(',');
    }
    
    if (filters.minPrice) apiFilter.minPrice = filters.minPrice;
    if (filters.maxPrice) apiFilter.maxPrice = filters.maxPrice;
    if (filters.minSquarefoot) apiFilter.minSquarefoot = filters.minSquarefoot;
    if (filters.maxSquarefoot) apiFilter.maxSquarefoot = filters.maxSquarefoot;
    if (filters.bedroom) apiFilter.bedroom = filters.bedroom;
    if (filters.bathroom) apiFilter.bathroom = filters.bathroom;
    
    return apiFilter;
  }, [filters]);

  const limit = 12; 
  const { propertyList = [], loading, pagination = {} } = useGetAllProperty(currentPage, limit, apiFilters);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const properties = [...propertyList];
    switch (currentSort) {
      case 'price_asc':
        return properties.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return properties.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'beds_asc':
        return properties.sort((a, b) => (a.bedroom || 0) - (b.bedroom || 0));
      case 'beds_desc':
        return properties.sort((a, b) => (b.bedroom || 0) - (a.bedroom || 0));
      case 'area_asc':
        return properties.sort((a, b) => (a.squarefoot || 0) - (b.squarefoot || 0));
      case 'area_desc':
        return properties.sort((a, b) => (b.squarefoot || 0) - (a.squarefoot || 0));
      case 'newest':
        return properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return properties;
    }
  }, [propertyList, currentSort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      city: "", propertytype: [], minPrice: "", maxPrice: "", 
      minSquarefoot: "", maxSquarefoot: "", bedroom: "", bathroom: "", 
      furnishingType: "", amenities: [], keywords: [], 
      has360Tour: "", hasVideoTour: "", offeringType: "", category: ""
    });
    
    setSearchQuery("");
    setSelectedLocation(null);
    setHasSearched(false);
    setCurrentPage(1);
  };

  const handleWhatsApp = (e, property) => {
    e.stopPropagation();
    const managementNo = "971585852283";
    const agentNo = property.agentId?.phone?.replace(/\s+/g, "") || "971500000000";
    const agentName = property.agentId?.name || "Property Consultant";
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    const msg = encodeURIComponent(`🏢 *Property Inquiry*\n\n🏠 ${propertyTitle}\n💰 AED ${Number(property.price).toLocaleString()}\n📍 ${property.community || property.city}\n\nI'm interested in this property.`);
    window.open(`https://wa.me/${managementNo}?text=${msg}`, "_blank");
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleMail = (e, property) => {
    e.stopPropagation();
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    const subject = encodeURIComponent(`Inquiry: ${propertyTitle}`);
    window.location.href = `mailto:info@homoget.ae?subject=${subject}`;
  };

  const handleShare = (e, property) => {
    e.stopPropagation();
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    if (navigator.share) {
      navigator.share({
        title: propertyTitle,
        text: `Check out this property: ${propertyTitle}`,
        url: window.location.href,
      });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      


<section className="relative w-full h-[60vh] md:h-[65vh] flex items-center overflow-visible">
  <div className="absolute inset-0 z-0">
    <img 
      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop" 
      className="w-full h-full object-cover" 
      alt="Luxury Property" 
    />
    <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/50'}`} />
  </div>
  
  <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-20">
    <motion.div 
      initial={{ opacity: 0, y: 40 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex items-center gap-3 px-4 py-2  mt-10 md:mt-0 rounded-full bg-amber-500 text-black mb-6 shadow-xl">
        <Crown size={14} />
        <span className="text-[10px] font-serif tracking-widest uppercase">Premium Collection</span>
      </div>
      
      <h1 className={`text-2xl md:text-4xl  leading-[1.1] font-serif font-bold mb-4 text-white`}>
        Find Your <br />
        <span className="text-amber-500">Dream Property</span>
      </h1>

      <p className={`max-w-2xl text-base md:text-lg font-light leading-relaxed mb-8 text-white/80`}>
        The most prestigious properties in the real estate market. 
        We curate high-yield residential and commercial properties across Dubai.
      </p>

      {/* SEARCH BAR INPUT FIELD - FIXED Z-INDEX */}
      <div className="relative w-full max-w-2xl" ref={containerRef}>
        <div className={`
          flex items-center bg-white/95 backdrop-blur-xl rounded-full border transition-all duration-300 p-1 shadow-2xl
          ${isInputFocused ? 'ring-2 ring-amber-500/50 border-amber-500/30' : 'border-white/20'}
        `}>
          <Search className="text-amber-500 ml-4" size={20} />
          <div className="relative flex-1">
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search by community, tower or area..." 
              className="w-full bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-400"
              value={searchQuery}
              onFocus={handleInputFocus}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <X size={16} className="text-slate-400 hover:text-amber-500 transition-colors" />
              </button>
            )}
            
            {/* LOCATION SUGGESTIONS - HIGH Z-INDEX */}
            <AnimatePresence>
              {showSuggestions && (searchQuery.length >= 2 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[9999]"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-wider">POPULAR LOCATIONS</p>
                  </div>
                  {isSearching ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" />
                    </div>
                  ) : apiSuggestions.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {apiSuggestions.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 group"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-white group-hover:text-amber-500 transition-colors">
                                {location.name}
                              </p>
                              {location.address && (
                                <p className="text-[10px] text-slate-500">{location.address}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchQuery.length >= 2 ? (
                    <div className="py-6 text-center">
                      <p className="text-xs text-slate-500">No locations found. Try a different search.</p>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* FILTER BUTTON */}
          <motion.button 
            onClick={handleInputFilterClick}
            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
            animate={{ 
              opacity: isInputFocused ? 1 : 0,
              width: isInputFocused ? 'auto' : 0,
              marginLeft: isInputFocused ? 8 : 0,
              paddingLeft: isInputFocused ? 12 : 0,
              paddingRight: isInputFocused ? 12 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`
              flex items-center gap-2 rounded-full bg-amber-500 text-black font-semibold text-sm
              hover:bg-amber-600 hover:scale-105 transition-all overflow-hidden whitespace-nowrap
            `}
            style={{ 
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <SlidersHorizontal size={16} />
            <span className="text-xs font-bold">Filters</span>
          </motion.button>
          
          {/* Search button */}
          <motion.button 
            onClick={handleSearch}
            className="ml-1 px-5 py-2 rounded-full bg-black text-white font-semibold text-xs hover:bg-amber-500 hover:text-black transition-all"
            animate={{
              marginLeft: isInputFocused ? 4 : 0
            }}
          >
            Search
          </motion.button>
        </div>
        
        {/* Hint text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: isInputFocused ? 1 : 0 }}
          className="text-white/60 text-[10px] mt-3 flex items-center justify-start gap-2"
        >
          <Filter size={10} />
          <span>Click the Filters button to refine your search by property type, price, bedrooms & more</span>
        </motion.p>
      </div>
    </motion.div>
  </div>
</section>
      
      {/* --- FILTER & SORT BAR --- */}
      <div className="sticky top-0  bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-all shadow-md"
              >
                <Filter size={16} /> All Filters
              </button>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}
                >
                  <Grid3x3 size={16} />
                </button>

                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 hidden sm:block">
                {sortedProperties.length} properties found
              </p>
              <SortBar currentSort={currentSort} onSortChange={setCurrentSort} totalResults={sortedProperties.length} />
            </div>
          </div>
        </div>
      </div>

    {/* --- PROPERTY GRID --- */}
<div className="max-w-7xl mx-auto px-6 py-8">
  {loading ? (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
    </div>
  ) : sortedProperties.length > 0 ? (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
      : "space-y-4"
    }>
      {sortedProperties.map((property, idx) => {
        const statusBadge = getStatusBadge(property);
        const isOffPlanProperty = isOffPlan(property);
        const isCommercialProperty = isCommercial(property);
        const propertyTitle = property.propertyTitleEn || property.propertyname;
        const propertyType = property.propertytype || (isCommercialProperty ? "Commercial" : "Residential");
        const location = property.locationName || property.address || "Dubai";
        const agentName = property.agentId?.name || "Property Consultant";
        const agentImage = property.agentId?.profilePhoto || property.agentId?.profileImage;
        const agentPhone = property.agentId?.phone || property.agentPhone || "+971500000000";
        const agentEmail = property.agentId?.email || "info@homoget.ae";
        const agentRating = property.agentId?.rating || 4.8;
        const agentReraLicense = property.agentId?.reraLicenseNumber || property.brnNumber || "N/A";
              const locationQuery = property?.displayAddress;

        // WhatsApp message
        const whatsappMsg = encodeURIComponent(
          `🏢 *Property Inquiry - Homoget*\n\n` +
          `🏠 *Property:* ${propertyTitle}\n` +
          `💰 *Price:* AED ${Number(property.price).toLocaleString()}${isRent(property) ? `/${property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}` : ""}\n` +
          `📍 *Location:* ${location}\n` +
          `📐 *Area:* ${property.squarefoot?.toLocaleString()} sqft\n\n` +
          `I'm interested in this property. Please share more details.`
        );

        const handleWhatsAppClick = (e) => {
          e.stopPropagation();
          window.open(`https://wa.me/${agentPhone.replace(/\s+/g, '')}?text=${whatsappMsg}`, "_blank");
        };

        const handleCallClick = (e) => {
          e.stopPropagation();
          window.location.href = `tel:${agentPhone}`;
        };

        const handleEmailClick = (e) => {
          e.stopPropagation();
          const subject = encodeURIComponent(`Inquiry: ${propertyTitle}`);
          window.location.href = `mailto:${agentEmail}?subject=${subject}`;
        };

        return viewMode === 'grid' ? (
          <motion.div 
            key={property._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
            className={`group rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#11141B]' : 'bg-white'} cursor-pointer border ${isDark ? 'border-white/5' : 'border-slate-200'}`}
          >
            {/* Image Container */}
            <div className="relative h-52 overflow-hidden">
              <img 
                src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt={propertyTitle} 
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${isOffPlanProperty ? 'bg-purple-600' : isCommercialProperty ? 'bg-blue-600' : 'bg-amber-500'} text-white`}>
                  {propertyType}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${statusBadge.color} backdrop-blur-sm`}>
                  {statusBadge.text}
                </span>
              </div>
              
              {/* Location Badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <MapPin size={10} className="text-amber-400" />
                <span className="text-[9px] text-white truncate max-w-[100px]">{location}</span>
              </div>
            </div>
            
            {/* Content Body */}
            <div className="p-4">
              {/* Agent Info Section */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-white/10">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
                  {agentImage ? (
                    <img src={agentImage} className="w-full h-full object-cover" alt={agentName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                      {agentName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Listed by</p>
                  <p className="text-xs font-bold truncate group-hover:text-amber-500 transition-colors">
                    {agentName}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="text-[9px] font-bold">{agentRating}</span>
                </div>
              </div>
              
              {/* Property Title */}
              <h3 className="font-bold text-base mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors">
                {propertyTitle}
              </h3>
              <div className="  flex justify-between items-center gap-1">
                  <span className="text-sm  ">{property.category}</span>
                   {/* Price */}
              <div className="mb-3">
        <CurrencyDisplay 
          price={property.price} 
          period={isRent(property) ? property.rentedPeriod : null}
          currency={property?.currency || "AED"}
          isDark={isDark}
          priceClassName="text-lg font-bold"
          periodClassName="text-xs text-slate-400 font-normal"
        />
      </div>
                </div>

                         <div className="inline-flex items-center py-4 gap-1.5">
                  {/* Animated location pin */}
                  <MapPin size={12} className="text-amber-500 dark:text-amber-400 drop-shadow-sm" />
                  
                  <span className="text-[10px] font-black uppercase tracking-wider text-black dark:text-white">
                    {locationQuery}
                  </span>
                  
                  {/* Small decorative slash */}
                  <span className="text-amber-500 dark:text-amber-400 font-black text-[10px]">/</span>
                </div>
              
              {/* Property Specs */}
              <div className="flex items-center gap-3 py-2 mb-2">
                <div className="flex items-center gap-1">
                  <Bed size={12} className="text-amber-500" />
                  <span className="text-xs">{property.bedroom || 0} Beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath size={12} className="text-amber-500" />
                  <span className="text-xs">{property.bathroom || 0} Baths</span>
                </div>
                 
                <div className="flex items-center gap-1">
                  <Ruler size={12} className="text-amber-500" />
                  <span className="text-xs">{property.squarefoot?.toLocaleString()} sqft</span>
                </div>
              </div>
              
             
      
      
              
              {/* Action Buttons - WhatsApp, Call, Email */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                <button
                  onClick={handleWhatsAppClick}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-500 text-white text-[9px] font-bold uppercase hover:bg-green-600 transition-all"
                >
                  <FaWhatsapp size={12} /> WhatsApp
                </button>
                <button
                  onClick={handleCallClick}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500 text-white text-[9px] font-bold uppercase hover:bg-blue-600 transition-all"
                >
                  <Phone size={12} /> Call
                </button>
                <button
                  onClick={handleEmailClick}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-amber-500 text-black text-[9px] font-bold uppercase hover:bg-amber-600 transition-all"
                >
                  <Mail size={12} /> Email
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          // List View
          <div
            key={property._id}
            onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
            className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200'}`}
          >
            {/* Image */}
            <img 
              src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"} 
              alt={propertyTitle} 
              className="w-full sm:w-40 h-32 rounded-lg object-cover" 
            />
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-[9px] font-bold">
                  {agentImage ? <img src={agentImage} className="w-full h-full rounded-full object-cover" /> : agentName.charAt(0)}
                </div>
                <span className="text-[10px] text-slate-500">Listed by {agentName}</span>
                <div className="flex items-center ml-auto">
                  <Star size={10} className="text-amber-500 fill-amber-500" />
                  <span className="text-[9px] ml-0.5">{agentRating}</span>
                </div>
              </div>
              
              <h3 className="font-bold text-base mb-1 line-clamp-1">{propertyTitle}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={12} className="text-amber-500" />
                <span className="text-xs text-slate-500">{location}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1"><Bed size={12} /> <span className="text-xs">{property.bedroom || 0}</span></div>
                <div className="flex items-center gap-1"><Bath size={12} /> <span className="text-xs">{property.bathroom || 0}</span></div>
                <div className="flex items-center gap-1"><Ruler size={12} /> <span className="text-xs">{property.squarefoot?.toLocaleString()} sqft</span></div>
              </div>

              
              <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                <p className="text-lg font-bold text-amber-500">
                  AED {property.price?.toLocaleString()}
                  {isRent(property) && property.rentedPeriod && (
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      / {property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}
                    </span>
                  )}
                </p>
                

                         <div className="inline-flex items-center gap-1.5">
                  {/* Animated location pin */}
                  <MapPin size={12} className="text-amber-500 dark:text-amber-400 drop-shadow-sm" />
                  
                  <span className="text-[10px] font-black uppercase tracking-wider text-black dark:text-white">
                    {locationQuery}
                  </span>
                  
                  {/* Small decorative slash */}
                  <span className="text-amber-500 dark:text-amber-400 font-black text-[10px]">/</span>
                </div>
                {/* Action Buttons for List View */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsAppClick}
                    className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                    title="WhatsApp Agent"
                  >
                    <FaWhatsapp size={14} />
                  </button>
                  <button
                    onClick={handleCallClick}
                    className="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                    title="Call Agent"
                  >
                    <Phone size={14} />
                  </button>
                  <button
                    onClick={handleEmailClick}
                    className="p-1.5 rounded-lg bg-amber-500 text-black hover:bg-amber-600 transition"
                    title="Email Agent"
                  >
                    <Mail size={14} />
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-[9px] font-bold uppercase hover:bg-amber-600 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="text-center py-20">
      <div className={`inline-flex p-6 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} mb-4`}>
        <Search size={48} className="text-slate-400" />
      </div>
      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
        No properties found
      </p>
      <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search criteria</p>
      <button onClick={handleClearFilters} className="mt-6 px-6 py-2 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase hover:bg-amber-600 transition">
        Clear Filters
      </button>
    </div>
  )}

  {/* Pagination */}
  {pagination.totalPages > 1 && sortedProperties.length > 0 && (
    <div className="mt-12 flex justify-center items-center gap-2">
      <button 
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => prev - 1)}
        className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500 hover:text-white'} ${isDark ? 'border-white/10' : 'border-slate-200'}`}
      >
        <ChevronLeft size={18} />
      </button>
      <div className="flex gap-1">
        {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
          let pageNum;
          if (pagination.totalPages <= 5) pageNum = i + 1;
          else if (currentPage <= 3) pageNum = i + 1;
          else if (currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
          else pageNum = currentPage - 2 + i;
          return (
            <button 
              key={i}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === pageNum ? 'bg-amber-500 text-white' : isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>
      <button 
        disabled={currentPage === pagination.totalPages}
        onClick={() => setCurrentPage(prev => prev + 1)}
        className={`p-2 rounded-lg border transition-all ${currentPage === pagination.totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500 hover:text-white'} ${isDark ? 'border-white/10' : 'border-slate-200'}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )}
</div>

      {/* Filter Sidebar */}
      <div ref={sidebarRef}>
        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          propertyCount={sortedProperties.length}
        />
      </div>
    </div>
  );
};

export default PropertyListing;