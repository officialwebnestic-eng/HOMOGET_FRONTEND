import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Share2,
  Heart,
  Square,
  BedDouble,
  ArrowRight,
  Building,
  Briefcase,
  Home,
  Calendar,
  Crown,
  Sparkles,
  Clock,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import AgentHero from "./AgentHero";
import { filterFields } from "../../../helpers/FiltersHelpers";
import ShareModal from "../../../model/ShareModal";
import CurrencyDisplay from "./CurrencyDisplay";

const themeColors = {
  light: {
    background: "bg-gray-50",
    card: "bg-white",
    text: "text-slate-900",
    textSecondary: "text-slate-500",
    border: "border-slate-200/60",
    shadow: "shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
    badgeLight: "bg-slate-100",
  },
  dark: {
    background: "bg-[#0a0a0c]",
    card: "bg-[#141417]",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-white/5",
    shadow: "shadow-2xl",
    badgeLight: "bg-white/5",
  },
};

// Helper function to check property type
const isOffPlan = (property) => {
  return property?.category === "Off-Plan" || property?.propertyListingType === "project";
};

const isCommercial = (property) => {
  return property?.category === "Commercial";
};

const isRent = (property) => {
  return property?.offeringType === "Rent";
};

// Get property type icon
const getPropertyTypeIcon = (property) => {
  if (isOffPlan(property)) return <Crown size={14} className="text-purple-400" />;
  if (isCommercial(property)) return <Briefcase size={14} className="text-blue-400" />;
  return <Home size={14} className="text-amber-400" />;
};

// Get badge color based on property type
const getBadgeStyle = (property) => {
  if (isOffPlan(property)) {
    return "bg-gradient-to-r from-purple-600 to-pink-600";
  }
  if (isCommercial(property)) {
    return "bg-gradient-to-r from-blue-600 to-cyan-600";
  }
  return "bg-amber-500";
};

// Get status badge
const getStatusBadge = (property) => {
  if (isOffPlan(property)) {
    return { text: "OFF-PLAN", icon: <Calendar size={10} />, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
  }
  if (isRent(property)) {
    return { text: "FOR RENT", icon: <Clock size={10} />, color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
  }
  return { text: "FOR SALE", icon: <Sparkles size={10} />, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
};

// Wishlist Button Component
const WishlistButton = ({ property, isDark }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!isWishlisted) {
      if (!wishlist.includes(property._id)) {
        wishlist.push(property._id);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      }
    } else {
      const newWishlist = wishlist.filter(id => id !== property._id);
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  };

  return (
    <button
      onClick={handleWishlist}
      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart size={18} fill={isWishlisted ? "#ef4444" : "none"} className={isWishlisted ? "text-red-500" : ""} />
    </button>
  );
};

const Agentfilter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSort, setCurrentSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [shareProperty, setShareProperty] = useState(null);

  const [filters, setFilters] = useState({
    state: "",
    listingtype: "",
    propertytype: "",
    price: "",
    squarefoot: "",
    bedroom: "",
    bathroom: "",
    floor: "",
    city: "",
    aminities: "",
  });

  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();
  const location = useLocation();

  // Parse URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search");
    const city = params.get("city");
    const propertytype = params.get("propertytype");
    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    const bedroom = params.get("bedroom");

    if (search) setSearchQuery(search);
    if (city) setFilters(prev => ({ ...prev, city }));
    if (propertytype) setFilters(prev => ({ ...prev, propertytype }));
    if (minPrice) setFilters(prev => ({ ...prev, minPrice }));
    if (maxPrice) setFilters(prev => ({ ...prev, maxPrice }));
    if (bedroom) setFilters(prev => ({ ...prev, bedroom }));
  }, [location.search]);

  // Build active filters for API call
  const activeFilters = useMemo(() => {
    const active = { ...filters };
    if (searchQuery) {
      active.search = searchQuery;
    }
    return active;
  }, [filters, searchQuery]);

  // Fetching property data with active filters
  const { propertyList = [], loading, total } = useGetAllProperty(
    currentPage,
    20,
    activeFilters
  );

  const handlePropertyClick = useCallback(
    (property) => {
      navigate(`/property/${property._id}`, {
        state: { propertyData: property },
      });
    },
    [navigate],
  );

  const handleShareClick = (e, property) => {
    e.stopPropagation();
    setShareProperty(property);
  };

  const handleSuggestionClick = (locationName) => {
    setSearchQuery(locationName);
    setShowSuggestions(false);
    const mainLocation = locationName.split(" ")[0];
    setFilters((prev) => ({ ...prev, city: mainLocation }));
    setCurrentPage(1);
  };

  const handleSearchButtonClick = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (filters.city) params.append("city", filters.city);
    if (filters.propertytype) params.append("propertytype", filters.propertytype);
    if (filters.bedroom) params.append("bedroom", filters.bedroom);
    if (filters.bathroom) params.append("bathroom", filters.bathroom);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (filters.city) params.append("city", filters.city);
    if (filters.propertytype) params.append("propertytype", filters.propertytype);
    if (filters.bedroom) params.append("bedroom", filters.bedroom);
    if (filters.bathroom) params.append("bathroom", filters.bathroom);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setFilters({
      state: "",
      listingtype: "",
      propertytype: "",
      price: "",
      squarefoot: "",
      bedroom: "",
      bathroom: "",
      floor: "",
      city: "",
      aminities: "",
    });
    setSearchQuery("");
    setCurrentPage(1);
    navigate("/properties");
  };

  const getUniqueValues = (data, key) => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.flatMap((item) => item[key]).filter(Boolean))].sort();
  };

  const handleSortChange = (sortValue) => {
    setCurrentSort(sortValue);
    setCurrentPage(1);
  };

  const handleWhatsApp = (e, property) => {
    e.stopPropagation();

    const propertyName = property.propertyname || property.propertyTitleEn;
    const price = `AED ${Number(property.price).toLocaleString()}`;
    const location = property.community || property.city;
    const propertyId = property._id;
    const propertyUrl = `${window.location.origin}/property/${property._id}`;

    const managementNumber = "971585852283";
    const managementMsg = encodeURIComponent(
      `*New Client Interest Alert!*\n\n` +
        `Property: ${propertyName}\n` +
        `Price: ${price}\n` +
        `Location: ${location}\n` +
        `ID: ${propertyId}\n` +
        `Type: ${isOffPlan(property) ? 'Off-Plan' : property.category || 'Residential'}\n` +
        `Offering: ${property.offeringType || 'Sale'}\n` +
        `Link: ${propertyUrl}`
    );

    const agentNumber = property.agentId?.phone || property.agentPhone || "971500000000";
    const agentMsg = encodeURIComponent(
      `Hello! I am interested in viewing your listing: *${propertyName}*.\n\n` +
        `📍 Location: ${location}\n` +
        `💰 Price: ${price}\n` +
        `🏷️ Type: ${isOffPlan(property) ? 'Off-Plan Project' : property.propertytype || 'Property'}\n` +
        `🔗 Link: ${propertyUrl}\n\n` +
        `Please provide more details regarding viewing schedule and availability.`
    );

    window.open(`https://wa.me/${managementNumber}?text=${managementMsg}`, "_blank");

    setTimeout(() => {
      const confirmSecond = window.confirm(
        "✅ Message sent to Management.\n\nClick OK to notify the Agent directly on WhatsApp.",
      );
      if (confirmSecond) {
        window.open(`https://wa.me/${agentNumber}?text=${agentMsg}`, "_blank");
      }
    }, 1000);
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.location.href = `tel:${phone || "+971500000000"}`;
  };

  const handleEmail = (e, property) => {
    e.stopPropagation();
    const subject = `Inquiry: ${property.propertyname || property.propertyTitleEn}`;
    const body = `I'm interested in this property:\n\n${property.propertyname || property.propertyTitleEn}\nPrice: AED ${Number(property.price).toLocaleString()}\nLocation: ${property.community || property.city}\n\nPlease contact me for more details.`;
    window.location.href = `mailto:info@homoget.ae?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const eliteProperties = propertyList.slice(0, 9);

  return (
    <div className={`${colors.background} min-h-screen pb-20 transition-colors duration-300`}>
      <AgentHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        onSuggestionClick={handleSuggestionClick}
        onSearchButtonClick={handleSearchButtonClick}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        propertyList={propertyList}
        filters={filters}
        handleFilterChange={handleFilterChange}
        filterFields={filterFields}
        getUniqueValues={getUniqueValues}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={total || propertyList.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-20">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-slate-800 dark:text-white">
              Exclusive <span className="text-amber-500">Properties</span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/propertylisting")}
            className="px-8 py-3 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            View All Properties <ArrowRight size={16} />
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || filters.city || filters.propertytype || filters.bedroom) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
            <span className="text-xs text-slate-500">Active Filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[10px] font-bold flex items-center gap-1">
                🔍 {searchQuery}
                <button onClick={() => setSearchQuery("")} className="hover:text-white">×</button>
              </span>
            )}
            {filters.city && (
              <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-bold flex items-center gap-1">
                📍 {filters.city}
                <button onClick={() => setFilters(prev => ({ ...prev, city: "" }))} className="hover:text-white">×</button>
              </span>
            )}
            {filters.propertytype && (
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-bold flex items-center gap-1">
                🏷️ {filters.propertytype}
                <button onClick={() => setFilters(prev => ({ ...prev, propertytype: "" }))} className="hover:text-white">×</button>
              </span>
            )}
            {filters.bedroom && (
              <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded-lg text-[10px] font-bold flex items-center gap-1">
                🛏️ {filters.bedroom} Beds
                <button onClick={() => setFilters(prev => ({ ...prev, bedroom: "" }))} className="hover:text-white">×</button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="px-2 py-1 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-bold"
            >
              Clear All
            </button>
          </div>
        )}

        {/* PROPERTY GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : propertyList.length === 0 ? (
          <div className="text-center py-20">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-serif ${colors.text} mb-2`}>No Properties Found</h3>
            <p className={colors.textSecondary}>Try adjusting your filters or search criteria</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-full text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}`}>
            {(viewMode === "grid" ? eliteProperties : propertyList).map((property) => {
              const statusBadge = getStatusBadge(property);
              const isOffPlanProperty = isOffPlan(property);
              const isCommercialProperty = isCommercial(property);
              const propertyTitle = property.propertyTitleEn || property.propertyname;
              const propertyType = property.propertytype || (isCommercialProperty ? "Commercial Space" : "Residential");
              const location = property.community || property.city || "Dubai";
              const agentName = property.agentId?.name || "Property Consultant";
              const agentImage = property.agentId?.profilePhoto || property.name;
              const agentRating = property.agentId?.rating || 4.8;

              if (viewMode === "list") {
                return (
                  <div
                    key={property._id}
                    onClick={() => handlePropertyClick(property)}
                    className={`flex flex-col md:flex-row gap-4 p-4 rounded-2xl ${colors.card} ${colors.shadow} border ${colors.border} cursor-pointer hover:shadow-lg transition-all`}
                  >
                    <div className="md:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"}
                        alt={propertyTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <h3 className={`text-lg font-bold ${colors.text}`}>{propertyTitle}</h3>
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-bold ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <MapPin size={14} />
                        <span>{location}, UAE</span>
                      </div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1"><BedDouble size={14} /> {property.bedroom || 0}</div>
                        <div className="flex items-center gap-1"><Square size={14} /> {property.squarefoot?.toLocaleString()} sqft</div>
                      </div>
                      <p className="text-amber-500 font-bold text-lg">AED {Number(property.price).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={(e) => handleWhatsApp(e, property)} className="p-2 text-green-500 hover:scale-110 transition">
                        <FaWhatsapp size={20} />
                      </button>
                      <button onClick={(e) => handleCall(e, property.agentId?.phone)} className="p-2 text-blue-500 hover:scale-110 transition">
                        <Phone size={20} />
                      </button>
                      <button onClick={(e) => handleShareClick(e, property)} className="p-2 text-gray-400 hover:text-amber-500 transition">
                        <Share2 size={18} />
                      </button>
                      <WishlistButton property={property} isDark={theme === "dark"} />
                    </div>
                  </div>
                );
              }

              return (
                <motion.div
                  key={property._id}
                  whileHover={{ y: -10 }}
                  className={`rounded-[2.5rem] overflow-hidden ${colors.card} ${colors.shadow} border ${colors.border} group cursor-pointer flex flex-col transition-all duration-300`}
                  onClick={() => handlePropertyClick(property)}
                >
                  {/* Image Container */}
                  <div className="relative h-72 w-full overflow-hidden">
                    <img
                      src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"}
                      alt={propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Property Type Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg tracking-wider flex items-center gap-1.5 ${getBadgeStyle(property)}`}>
                        {getPropertyTypeIcon(property)}
                        {propertyType}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-[9px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <MapPin size={12} className="text-amber-400" />
                      <span className="text-[10px] font-bold truncate max-w-[150px]">
                        {location}, UAE
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-7 flex-1">
                    <h3 className={`text-xl font-bold mb-2 truncate ${colors.text}`}>
                      {propertyTitle}
                    </h3>

                    <div className="flex items-center justify-between gap-3 mb-3 mt-3 md:mt-5 flex-wrap">
                     <CurrencyDisplay 
  price={property.price} 
  period={isRent(property) ? property.rentedPeriod : null}
  currency={property?.currency || "AED"}
  isDark={theme === "dark"}
  priceClassName="text-lg font-black leading-tight"
  periodClassName="text-xs text-gray-400 font-normal"
/>
                      <div className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10">
                        <p className="text-black dark:text-white text-xs font-bold uppercase tracking-wide">
                          {property.category}
                        </p>
                      </div>
                    </div>

                    {isCommercialProperty ? (
                      <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Building size={16} className="text-blue-500" />
                          <span className="text-[11px] font-bold uppercase">{propertyType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Square size={14} className="text-blue-500" />
                          <span className="text-[11px] font-bold uppercase">{property.squarefoot?.toLocaleString() || 0} Sq.Ft</span>
                        </div>
                      </div>
                    ) : isOffPlanProperty ? (
                      <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar size={16} className="text-purple-500" />
                          <span className="text-[11px] font-bold uppercase">Handover: {property.deliveryDate || "Q4 2026"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <BedDouble size={16} className="text-amber-500" />
                          <span className="text-[11px] font-bold uppercase">{property.bedroom || 0} Beds</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <Square size={14} className="text-amber-500" />
                          <span className="text-[11px] font-bold uppercase">{property.squarefoot?.toLocaleString() || 0} Sq.Ft</span>
                        </div>
                      </div>
                    )}

                    {/* Agent Info Bar */}
                    <div className="flex items-center gap-3 py-3 mt-2 border-t border-gray-100 dark:border-white/5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
                        {agentImage ? (
                          <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                            {agentName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Listed by</p>
                        <p className={`text-xs font-bold truncate ${colors.text}`}>{agentName}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold">{agentRating}</span>
                      </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-white/5">
                      <div className="flex gap-4">
                        <button
                          onClick={(e) => handleWhatsApp(e, property)}
                          className="text-green-500 hover:scale-110 transition-transform"
                          title="WhatsApp Agent"
                        >
                          <FaWhatsapp size={22} />
                        </button>
                        <button
                          onClick={(e) => handleCall(e, property.agentId?.phone || property.agentPhone)}
                          className="text-blue-500 hover:scale-110 transition-transform"
                          title="Call Agent"
                        >
                          <Phone size={22} />
                        </button>
                        <button
                          onClick={(e) => handleEmail(e, property)}
                          className="text-amber-500 hover:scale-110 transition-transform"
                          title="Email Agent"
                        >
                          <Mail size={22} />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => handleShareClick(e, property)}
                          className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                          title="Share Property"
                        >
                          <Share2 size={18} />
                        </button>
                        <WishlistButton property={property} isDark={theme === "dark"} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {shareProperty && (
        <ShareModal 
          property={shareProperty} 
          onClose={() => setShareProperty(null)} 
          isDark={theme === "dark"} 
        />
      )}
    </div>
  );
};

export default Agentfilter;