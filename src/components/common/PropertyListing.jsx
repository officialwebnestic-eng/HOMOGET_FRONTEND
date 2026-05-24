import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, Filter, MapPin, Bed, Bath, Ruler, 
  ChevronLeft, ChevronRight, ArrowRight,
  Phone, Mail, Building2, Home, Calendar,
  IndianRupee, ChevronDown, Briefcase, Crown, Sparkles, 
  Clock, User, Star, Share2, Heart, DollarSign, Eye, X, Loader2
} from 'lucide-react';
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  const searchTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  
  const TOMTOM_API_KEY = "YDlNOyLlX4RImV4fciotLz74L5JXykXG";

  const [filters, setFilters] = useState({
    city: "", propertytype: "", price: "", squarefoot: "",
    bedroom: "", bathroom: "", floor: "", state: "", aminities: "",
    offeringType: "", category: ""
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
    setHasSearched(true);
    // Update filter with selected city
    setFilters(prev => ({ ...prev, city: location.name }));
    setCurrentPage(1);
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery) {
      setHasSearched(true);
      setFilters(prev => ({ ...prev, city: searchQuery }));
      setCurrentPage(1);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Get location badge color
  const getLocationBadgeColor = (type) => {
    switch (type) {
      case "POI":
        return "bg-amber-500/20 text-amber-500";
      case "Geography":
        return "bg-blue-500/20 text-blue-500";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

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

  const limit = 20; 
  const { propertyList = [], loading, pagination = {} } = useGetAllProperty(currentPage, limit, filters);

  const filterFields = [
    { name: "city", label: "CITY", icon: <MapPin size={14} className="text-amber-500" /> },
    { name: "propertytype", label: "TYPE", icon: <Home size={14} className="text-amber-500" /> },
    { name: "category", label: "CATEGORY", icon: <Building2 size={14} className="text-amber-500" /> },
    { name: "offeringType", label: "OFFERING", icon: <DollarSign size={14} className="text-amber-500" /> },
    { name: "price", label: "PRICE", icon: <IndianRupee size={14} className="text-amber-500" /> },
    { name: "squarefoot", label: "AREA", icon: <Ruler size={14} className="text-amber-500" /> },
    { name: "bedroom", label: "BEDS", icon: <Bed size={14} className="text-amber-500" /> },
    { name: "bathroom", label: "BATHS", icon: <Bath size={14} className="text-amber-500" /> },
  ];

  const getUniqueValues = (key) => {
    if (!propertyList) return [];
    return [...new Set(propertyList.map(item => item[key]).filter(Boolean))].sort();
  };

  const handleWhatsApp = (e, property) => {
    e.stopPropagation();
    
    const managementNo = "971585852283";
    const agentNo = property.agentId?.phone?.replace(/\s+/g, "") || "971500000000";
    const agentName = property.agentId?.name || "Property Consultant";
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    const propertyType = property.propertytype || (isCommercial(property) ? "Commercial Space" : "Residential");
    const propertyStatus = isOffPlan(property) ? "Off-Plan" : (isRent(property) ? "Rental" : "Sale");

    const propDetails = `*Property:* ${propertyTitle}\n*Type:* ${propertyType}\n*Status:* ${propertyStatus}\n*Price:* AED ${Number(property.price).toLocaleString()}${isRent(property) ? `/${property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}` : ""}\n*Location:* ${property.community || property.city}\n*Area:* ${property.squarefoot?.toLocaleString()} sqft\n*Ref:* ${property._id}`;
    
    const msgToManagement = encodeURIComponent(`🏢 *NEW INQUIRY - HOMOGET*\n\n━━━━━━━━━━━━━━━━━━━━\n📋 *PROPERTY DETAILS*\n━━━━━━━━━━━━━━━━━━━━\n${propDetails}\n\n━━━━━━━━━━━━━━━━━━━━\n👤 *AGENT:* ${agentName}\n📞 *Contact:* ${agentNo}\n\n🕐 *Time:* ${new Date().toLocaleString()}`);
    
    const msgToAgent = encodeURIComponent(`👋 *Hello ${agentName},*\n\nI am interested in your listing:\n\n━━━━━━━━━━━━━━━━━━━━\n🏠 *${propertyTitle}*\n━━━━━━━━━━━━━━━━━━━━\n💰 *Price:* AED ${Number(property.price).toLocaleString()}\n📍 *Location:* ${property.community || property.city}\n📐 *Area:* ${property.squarefoot?.toLocaleString()} sqft\n\nPlease share viewing availability.`);

    window.open(`https://wa.me/${managementNo}?text=${msgToManagement}`, "_blank");
    
    setTimeout(() => {
      if (window.confirm(`✅ Inquiry sent to Management.\n\nNotify ${agentName} directly?`)) {
        window.open(`https://wa.me/${agentNo}?text=${msgToAgent}`, "_blank");
      }
    }, 1000);
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleMail = (e, property) => {
    e.stopPropagation();
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    const subject = encodeURIComponent(`Inquiry: ${propertyTitle}`);
    const body = encodeURIComponent(`Hello,\n\nI am interested in:\n\nProperty: ${propertyTitle}\nPrice: AED ${Number(property.price).toLocaleString()}\nLocation: ${property.community || property.city}\n\nPlease provide more information.`);
    window.location.href = `mailto:info@homoget.ae?subject=${subject}&body=${body}`;
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ 
      city: "", propertytype: "", price: "", squarefoot: "", 
      bedroom: "", bathroom: "", floor: "", state: "", aminities: "", 
      offeringType: "", category: "" 
    });
    setSearchQuery("");
    setSelectedLocation(null);
    setHasSearched(false);
    setCurrentPage(1);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION with TomTom Search --- */}
      <section className="relative w-full h-[65vh] flex items-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000"
          alt="Dubai Skyline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-[#0a0a0c]/80 to-[#0a0a0c]' : 'bg-gradient-to-b from-black/50 to-white'}`} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-[-50px]">
          <h1 className={`text-2xl md:text-4xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-white'} leading-[0.8] mb-4`}>
            Property <br />
            <span className="text-amber-500 font-serif italic font-light lowercase">Listings</span>
          </h1>
          <p className={`max-w-md text-sm font-medium text-white/80 mb-8`}>
            Homoget Properties offers a verified portfolio of luxury assets ensuring full compliance with UAE market regulations.
          </p>

          {/* SEARCH BAR WITH TOMTOM */}
          <div className="relative z-50 w-full max-w-2xl mb-8" ref={containerRef}>
            <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full border border-white/20 p-2 shadow-2xl">
              <Search className="text-amber-500 ml-4" size={20} />
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Search by community, tower or area..." 
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X size={16} className="text-slate-400 hover:text-amber-500" />
                  </button>
                )}
                
                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (searchQuery.length >= 2 || isSearching) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[100]"
                    >
                      <div className="px-5 py-3 border-b border-slate-100 dark:border-white/10">
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-wider">
                          Popular Locations in Dubai
                        </p>
                      </div>
                      
                      {isSearching ? (
                        <div className="py-8 text-center">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" />
                          <p className="text-xs text-slate-500 mt-2">Searching...</p>
                        </div>
                      ) : apiSuggestions.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {apiSuggestions.map((location, index) => (
                            <button
                              key={index}
                              onClick={() => handleLocationSelect(location)}
                              className="w-full text-left px-5 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
                            >
                              <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                      {location.name}
                                    </p>
                                    {location.type && (
                                      <span className={`text-[8px] px-2 py-0.5 rounded-full ${getLocationBadgeColor(location.type)}`}>
                                        {location.type}
                                      </span>
                                    )}
                                  </div>
                                  {location.address && (
                                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                      {location.address}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.length >= 2 ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-slate-500">No locations found</p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={handleSearch}
                className="bg-amber-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FILTER PANEL --- */}
      <section className="max-w-7xl mx-auto px-6 mt-[-100px] relative z-[60]">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-amber-500" />
              <span className="text-xs font-black uppercase">Filters</span>
            </div>
            <ChevronDown className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} size={18} />
          </button>
        </div>

        <AnimatePresence>
          {(showMobileFilters || window.innerWidth >= 768) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {filterFields.map((field) => (
                  <div key={field.name} className="relative">
                    <label className="flex items-center gap-2 text-[9px] font-black text-slate-500 mb-2 tracking-widest">
                      {field.icon} {field.label}
                    </label>
                    <div className="relative">
                      <select 
                        value={filters[field.name]}
                        onChange={handleFilterChange}
                        className="w-full bg-slate-50 text-[11px] font-bold text-slate-800 outline-none appearance-none cursor-pointer uppercase rounded-xl p-3 pr-8 border border-slate-100"
                      >
                        <option value="">ALL</option>
                        {getUniqueValues(field.name).map(v => (
                          <option key={v} value={v} className="text-black">{v}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={clearFilters}
                  className="flex-1 bg-slate-100 text-slate-600 font-black text-[10px] py-3 rounded-xl tracking-widest uppercase hover:bg-slate-200 transition-all"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setCurrentPage(1)}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] py-3 rounded-xl tracking-widest transition-all uppercase shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- PROPERTY GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-center mb-8">
          <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {hasSearched ? `Found ${propertyList.length} Properties ${selectedLocation ? `in ${selectedLocation.name}` : ''}` : `${propertyList.length} Properties Available`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
          </div>
        ) : propertyList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => {
              const statusBadge = getStatusBadge(property);
              const isOffPlanProperty = isOffPlan(property);
              const isCommercialProperty = isCommercial(property);
              const propertyTitle = property.propertyTitleEn || property.propertyname;
              const propertyType = property.propertytype || (isCommercialProperty ? "Commercial" : "Residential");
              const location = property.community || property.city || "Dubai";
              const agentName = property.agentId?.name || "Property Consultant";
              const agentImage = property.agentId?.profileImage;
              const agentRating = property.agentId?.rating || 4.8;
              const hasValidAgent = property.agentId && Object.keys(property.agentId).length > 0;

              return (
                <motion.div 
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  className={`group rounded-[2rem] overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl ${isDark ? 'bg-[#11141B]' : 'bg-white'} cursor-pointer flex flex-col border ${isDark ? 'border-white/5' : 'border-slate-100'}`}
                  onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={propertyTitle} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-white text-[8px] font-black uppercase rounded-lg flex items-center gap-1.5 shadow-lg ${
                        isOffPlanProperty ? "bg-gradient-to-r from-purple-600 to-pink-600" :
                        isCommercialProperty ? "bg-gradient-to-r from-blue-600 to-cyan-600" :
                        "bg-gradient-to-r from-amber-600 to-orange-600"
                      }`}>
                        {getPropertyTypeIcon(property)}
                        {propertyType}
                      </span>
                    </div>
                    
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-[8px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <MapPin size={10} className="text-amber-400" />
                      <span className="text-[9px] font-bold truncate max-w-[120px]">{location}, UAE</span>
                    </div>

                    <button
                      onClick={(e) => handleWhatsApp(e, property)}
                      className="absolute bottom-4 right-4 z-10 w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <FaWhatsapp size={18} className="text-white" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex-1">
                    <h3 className={`text-lg font-bold mb-1 line-clamp-1 group-hover:text-amber-500 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {propertyTitle}
                    </h3>

                    {isCommercialProperty ? (
                      <div className="flex items-center gap-3 py-2 mb-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Building2 size={12} className="text-blue-500" />
                          <span className="text-[9px] font-bold uppercase">{propertyType}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Ruler size={12} className="text-blue-500" />
                          <span className="text-[9px] font-bold uppercase">{property.squarefoot?.toLocaleString() || 0} sqft</span>
                        </div>
                      </div>
                    ) : isOffPlanProperty ? (
                      <div className="flex items-center gap-3 py-2 mb-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Calendar size={12} className="text-purple-500" />
                          <span className="text-[8px] font-bold uppercase">Handover: {property.deliveryDate || "2026"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Building2 size={12} className="text-purple-500" />
                          <span className="text-[8px] font-bold uppercase truncate">{property.developerId?.companyName?.slice(0, 12) || "Premium"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 py-2 mb-3 border-y border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-1.5">
                          <Bed size={12} className="text-amber-500" />
                          <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{property.bedroom || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath size={12} className="text-amber-500" />
                          <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{property.bathroom || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Ruler size={12} className="text-amber-500" />
                          <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{property.squarefoot?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-[9px] font-black text-slate-400">AED</span>
                      <span className="text-xl font-black text-amber-500">{Number(property.price).toLocaleString()}</span>
                      {isRent(property) && property.rentedPeriod && (
                        <span className="text-[8px] text-slate-400 font-medium">/{property.rentedPeriod?.toLowerCase().replace("per ", "")?.slice(0, 3)}</span>
                      )}
                    </div>

                    {isOffPlanProperty && property.completionPercentage && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[7px] font-black uppercase text-slate-400 mb-1">
                          <span>Construction Progress</span>
                          <span>{property.completionPercentage}%</span>
                        </div>
                        <div className="h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${property.completionPercentage}%` }} />
                        </div>
                      </div>
                    )}

                    {hasValidAgent && (
                      <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-white/5">
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
                          {agentImage ? (
                            <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-[10px] font-bold">
                              <User size={12} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">Listed by</p>
                          <p className={`text-[10px] font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{agentName}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Star size={8} className="text-amber-500 fill-amber-500" />
                          <span className="text-[8px] font-bold text-slate-500">{agentRating}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-white/5">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleCall(e, property.agentId?.phone)}
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                          title="Call Agent"
                        >
                          <Phone size={14} />
                        </button>
                        <button
                          onClick={(e) => handleMail(e, property)}
                          className="p-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all"
                          title="Email Agent"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={(e) => handleShare(e, property)}
                          className="p-2 rounded-xl bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white transition-all"
                          title="Share"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center gap-1"
                      >
                        View Details <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full text-center py-20">
            <div className={`inline-flex p-6 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} mb-4`}>
              <Search size={48} className="text-slate-400" />
            </div>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {hasSearched ? `No properties found in "${selectedLocation?.name || searchQuery}"` : "No properties found"}
            </p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>
              {hasSearched ? "Try a different location or adjust your filters" : "Try adjusting your filters or search criteria"}
            </p>
            {hasSearched && (
              <button 
                onClick={clearFilters}
                className="mt-6 px-6 py-2 rounded-full bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && propertyList.length > 0 && (
          <div className="mt-16 flex justify-center items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={`p-3 rounded-xl border transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500 hover:text-white hover:border-amber-500'} ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-800'}`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === pageNum ? 'bg-amber-500 text-white shadow-lg' : `${isDark ? 'text-white border-white/10' : 'text-slate-800 border-slate-200'} border hover:bg-amber-500 hover:text-white hover:border-amber-500`}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`p-3 rounded-xl border transition-all ${currentPage === pagination.totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-amber-500 hover:text-white hover:border-amber-500'} ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-800'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;