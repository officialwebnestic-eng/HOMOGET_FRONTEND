import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { 
  MapPin, Home, IndianRupee, Ruler, Bed, Bath, Barcode, Wrench, ChevronDown, 
  Crown, Phone, Mail, Share2, Heart, Filter, X, SlidersHorizontal,
  Check, ChevronRight, Loader2, Building2, Layers, Grid3x3, List
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";
 import FilterSidebar from "./common/FilterSidebar";
  import SortBar from "./common/homecommon/SortBar ";

// Property type options
const PROPERTY_TYPES = [
  "Apartment", "Villa", "Townhouse", "Penthouse", "Compound", "Duplex",
  "Full Floor", "Half Floor", "Whole Building", "Bulk Rent Unit", 
  "Bungalow", "Hotel & Hotel Apartment"
];

const Rent = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [currentSort, setCurrentSort] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchLocation, setSearchLocation] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const locationInputRef = useRef(null);
  const locationSuggestionRef = useRef(null);

  const TOMTOM_API_KEY = "YDlNOyLlX4RImV4fciotLz74L5JXykXG";

  // --- FILTER CONFIGURATION ---
  const filterFields = [
    { name: "city", label: "City", icon: <MapPin size={14} /> },
    { name: "propertytype", label: "Property Type", icon: <Home size={14} /> },
    { name: "price", label: "Price", icon: <IndianRupee size={14} /> },
    { name: "squarefoot", label: "Area", icon: <Ruler size={14} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={14} /> },
    { name: "bathroom", label: "Baths", icon: <Bath size={14} /> },
    { name: "floor", label: "Floor", icon: <Barcode size={14} /> },
    { name: "state", label: "Location", icon: <MapPin size={14} /> },
    { name: "aminities", label: "Amenities", icon: <Wrench size={14} /> },
  ];

  const [filters, setFilters] = useState({
    offeringType: "Rent",
    listingtype: "For Rent", 
    propertyListingType: "property",
    city: "",
    propertytype: "",
    price: "",
    squarefoot: "",
    bedroom: "",
    bathroom: "",
    floor: "",
    state: "",
    aminities: ""
  });

  // Fetch location suggestions from TomTom
  useEffect(() => {
    const fetchLocations = async () => {
      if (!searchLocation || searchLocation.length < 2) {
        setLocationSuggestions([]);
        return;
      }

      setIsSearchingLocation(true);

      try {
        const response = await fetch(
          `https://api.tomtom.com/search/2/search/${encodeURIComponent(
            searchLocation
          )}.json?key=${TOMTOM_API_KEY}&countrySet=AE&limit=6&typeahead=true&lat=25.2048&lon=55.2708&radius=50000`
        );

        const data = await response.json();

        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: item.id,
            name: item.poi?.name ||
              item.address?.municipalitySubdivision ||
              item.address?.municipality ||
              item.address?.freeformAddress,
            address: item.address?.freeformAddress,
            lat: item.position?.lat,
            lng: item.position?.lon,
          }));
          setLocationSuggestions(formatted);
        }
      } catch (err) {
        console.error("TomTom API error:", err);
      } finally {
        setIsSearchingLocation(false);
      }
    };

    const debounce = setTimeout(fetchLocations, 400);
    return () => clearTimeout(debounce);
  }, [searchLocation]);

  // Handle click outside for location suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationSuggestionRef.current && !locationSuggestionRef.current.contains(event.target) &&
          locationInputRef.current && !locationInputRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetching Data - ONLY RENT PROPERTIES
  const { propertyList = [], loading, pagination = {} } = useGetAllProperty(currentPage, 12, filters);

  // Filter only rent properties
  const rentProperties = useMemo(() => {
    let properties = propertyList.filter(property => 
      property.offeringType === "Rent" || 
      property.listingtype === "For Rent" ||
      property.category === "Rent"
    );
    
    // Apply sorting
    switch (currentSort) {
      case 'price_asc':
        properties = [...properties].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        properties = [...properties].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'beds_asc':
        properties = [...properties].sort((a, b) => (a.bedroom || 0) - (b.bedroom || 0));
        break;
      case 'beds_desc':
        properties = [...properties].sort((a, b) => (b.bedroom || 0) - (a.bedroom || 0));
        break;
      case 'area_asc':
        properties = [...properties].sort((a, b) => (a.squarefoot || 0) - (b.squarefoot || 0));
        break;
      case 'area_desc':
        properties = [...properties].sort((a, b) => (b.squarefoot || 0) - (a.squarefoot || 0));
        break;
      case 'newest':
        properties = [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    return properties;
  }, [propertyList, currentSort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setShowFilterSidebar(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const cleared = {
      offeringType: "Rent",
      listingtype: "For Rent",
      propertyListingType: "property",
      city: "",
      propertytype: "",
      price: "",
      squarefoot: "",
      bedroom: "",
      bathroom: "",
      floor: "",
      state: "",
      aminities: ""
    };
    setFilters(cleared);
    setSearchLocation("");
    setCurrentPage(1);
    setShowFilterSidebar(false);
  };

  const handleLocationSelect = (location) => {
    setSearchLocation(location.name);
    setFilters(prev => ({ ...prev, city: location.name }));
    setShowLocationSuggestions(false);
    setCurrentPage(1);
  };

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      setFilters(prev => ({ ...prev, city: searchLocation }));
      setCurrentPage(1);
    }
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.city) count++;
    if (filters.propertytype) count++;
    if (filters.price) count++;
    if (filters.squarefoot) count++;
    if (filters.bedroom) count++;
    if (filters.bathroom) count++;
    return count;
  };

  // Get unique values for filter sidebar
  const getUniqueValues = (list, field) => {
    const values = list.map(p => p[field]).filter(Boolean);
    return [...new Set(values)].slice(0, 20);
  };

  // --- DUAL WHATSAPP LOGIC ---
  const handleWhatsAppAction = (e, property) => {
    e.stopPropagation();

    const emiratesNo = "971585852283";
    const agentNo = property.agentId?.phone?.replace(/\s+/g, '') || "971500000000";
    const agentName = property.agentId?.name || "the Agent";
    
    const propDetails = `*Property:* ${property.propertyname}\n*Price:* AED ${Number(property.price).toLocaleString()}\n*Location:* ${property.city}\n*Ref:* ${property._id}`;
    const agentDetails = `*Agent:* ${agentName}\n*Contact:* ${property.agentId?.phone}`;

    const msgToEmirates = encodeURIComponent(
      `*Rental Inquiry Alert*\n\n--- PROPERTY ---\n${propDetails}\n\n--- ASSIGNED AGENT ---\n${agentDetails}`
    );

    const msgToAgent = encodeURIComponent(
      `Hello ${agentName}, I am interested in renting: ${property.propertyname}.\n\nReference: ${property._id}`
    );

    window.open(`https://wa.me/${emiratesNo}?text=${msgToEmirates}`, "_blank");

    setTimeout(() => {
      if (window.confirm(`Management notified. Send direct message to agent ${agentName}?`)) {
        window.open(`https://wa.me/${agentNo}?text=${msgToAgent}`, "_blank");
      }
    }, 1000);
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.location.href = `tel:${phone || "+971585852283"}`;
  };

  const handleMail = (e, property) => {
    e.stopPropagation();
    window.location.href = `mailto:info@homoget.ae?subject=Rental Inquiry: ${property.propertyname}`;
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Luxury Rental" />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'}`} />
        </div>
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-8 shadow-xl">
              <Crown size={14} />
              <span className="text-[10px] font-serif tracking-widest uppercase">Premium Rental Collection</span>
            </div>
            
            <h1 className={`text-4xl md:text-6xl leading-[0.8] font-serif tracking-tighter mb-8 ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Rent <br />
              <span className="text-amber-500 font-serif italic font-light">Collection</span>
            </h1>

            <p className={`max-w-2xl text-lg md:text-xl font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              The most prestigious Rental Properties in the real estate market. 
              We curate high-yield residential and commercial rental properties.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- LOCATION SEARCH BAR --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-13 relative z-30">
        <div className={`w-full p-6 rounded-[2rem] border shadow-2xl backdrop-blur-xl ${isDark ? 'bg-neutral-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
          
          {/* Location Search Input */}
          <div className="relative mb-6" ref={locationSuggestionRef}>
            <div className="flex items-center bg-slate-100 dark:bg-white/10 rounded-2xl p-1">
              <MapPin className="text-amber-500 ml-3" size={18} />
              <input
                ref={locationInputRef}
                type="text"
                placeholder="Search by city, community or area..."
                value={searchLocation}
                onFocus={() => setShowLocationSuggestions(true)}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLocationSearch()}
                className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-sm"
              />
              <button
                onClick={handleLocationSearch}
                className="mr-1 px-5 py-2 rounded-full bg-amber-500 text-black font-semibold text-sm hover:bg-black hover:text-white transition-all"
              >
                Search
              </button>
            </div>
            
            {/* Location Suggestions Dropdown */}
            <AnimatePresence>
              {showLocationSuggestions && searchLocation.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border overflow-hidden z-[999]"
                >
                  <div className="px-4 py-2 border-b bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-[8px] font-bold uppercase text-amber-500">Popular Locations in UAE</p>
                  </div>
                  {isSearchingLocation ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto text-amber-500" />
                    </div>
                  ) : locationSuggestions.length > 0 ? (
                    <div className="max-h-[320px] overflow-y-auto">
                      {locationSuggestions.map((location, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors border-b last:border-0 group"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin size={14} className="text-slate-400 group-hover:text-amber-500" />
                            <div>
                              <p className="font-medium text-sm group-hover:text-amber-500">{location.name}</p>
                              {location.address && (
                                <p className="text-[10px] text-slate-500">{location.address}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter and Sort Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterSidebar(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeFiltersCount() > 0
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="text-sm font-medium">All Filters</span>
                {activeFiltersCount() > 0 && (
                  <span className="w-5 h-5 rounded-full bg-black text-white text-xs flex items-center justify-center">
                    {activeFiltersCount()}
                  </span>
                )}
              </button>
              
              {/* View Mode Toggle */}
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
              
              {/* Active filters display */}
              {activeFiltersCount() > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.city && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs">
                      {filters.city}
                      <button onClick={() => { setFilters(prev => ({ ...prev, city: "" })); setSearchLocation(""); }}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.propertytype && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs">
                      {filters.propertytype}
                      <button onClick={() => setFilters(prev => ({ ...prev, propertytype: "" }))}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.bedroom && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs">
                      {filters.bedroom} Beds
                      <button onClick={() => setFilters(prev => ({ ...prev, bedroom: "" }))}>
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* SortBar Component */}
            <SortBar
              currentSort={currentSort}
              onSortChange={setCurrentSort}
              totalResults={rentProperties.length}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>

      {/* --- LISTINGS GRID --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-amber-500 font-black uppercase tracking-wider">Loading Rental Properties...</p>
          </div>
        )}
        
        {!loading && rentProperties.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Home size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-bold mb-2">No Rental Properties Found</p>
            <p className="text-sm text-slate-500">Try adjusting your filters or search location</p>
            <button
              onClick={handleClearFilters}
              className="mt-6 px-6 py-2 rounded-full bg-amber-500 text-black text-sm font-medium hover:bg-amber-600 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
        
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          : "space-y-4"
        }>
          {!loading && rentProperties.map((property) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`group rounded-[2rem] overflow-hidden border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200'}`}
            >
              <div className="relative h-72 overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property._id}`)}>
                <img src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase border border-white/20">
                  {property.city || "Dubai"}
                </div>
                <div className="absolute top-6 right-6 px-4 py-2 bg-amber-500 rounded-full text-black text-[10px] font-black uppercase">
                  FOR RENT
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h4 className={`text-xl font-bold truncate max-w-[55%] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {property.propertyname || property.propertyTitleEn}
                  </h4>
                  <div className="text-amber-500 text-right">
                    <p className="text-xl font-black">AED {Number(property.price).toLocaleString()}</p>
                    <p className="text-[8px] font-bold uppercase opacity-50">/ Year</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={12} className="text-amber-500" />
                  <span className="text-[10px] text-slate-500 uppercase">{property.community || property.city || "Dubai"}, UAE</span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <Bed className="text-amber-500" size={14}/>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase">{property.bedroom || 0} Beds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="text-amber-500" size={14}/>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase">{property.bathroom || 0} Baths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="text-amber-500" size={14}/>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase">{property.squarefoot?.toLocaleString()} Sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="text-amber-500" size={14}/>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 uppercase">{property.propertytype || "Residential"}</span>
                  </div>
                </div>

                {/* Quick Connect Bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-4">
                    <button onClick={(e) => handleWhatsAppAction(e, property)} className="text-green-500 hover:scale-110 transition-transform">
                      <FaWhatsapp size={20} />
                    </button>
                    <button onClick={(e) => handleCall(e, property.agentId?.phone)} className="text-amber-500 hover:scale-110 transition-transform">
                      <Phone size={18} />
                    </button>
                    <button onClick={(e) => handleMail(e, property)} className="text-blue-500 hover:scale-110 transition-transform">
                      <Mail size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <Share2 size={18} className="text-slate-400 hover:text-amber-500 cursor-pointer transition-colors" />
                    <Heart size={18} className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/property/${property._id}`)}
                  className="w-full mt-6 py-3 rounded-full bg-amber-500 text-black text-[11px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                >
                  View Details
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && rentProperties.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-lg border hover:bg-amber-500 hover:text-white transition-all"
            >
              <ChevronRight className="rotate-180 w-5 h-5" />
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                let pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-amber-500 text-white'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={currentPage === pagination.totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-lg border hover:bg-amber-500 hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* FILTER SIDEBAR COMPONENT */}
      <FilterSidebar
        isOpen={showFilterSidebar}
        onClose={() => setShowFilterSidebar(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        propertyCount={rentProperties.length}
        filterFields={filterFields}
        getUniqueValues={getUniqueValues}
        propertyList={propertyList}
      />
    </div>
  );
};

export default Rent;