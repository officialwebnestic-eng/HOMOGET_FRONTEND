import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Share2,
  Heart,
  Plus,
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
  User,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import AgentHero from "./AgentHero";
import { filterFields } from "../../../helpers/FiltersHelpers";

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

const Agentfilter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Fetching property data with active filters
  const { propertyList = [], loading } = useGetAllProperty(
    currentPage,
    20,
    useMemo(() => filters, [filters]),
  );

  const handlePropertyClick = useCallback(
    (property) => {
      navigate(`/property/${property._id}`, {
        state: { propertyData: property },
      });
    },
    [navigate],
  );

  const handleSuggestionClick = (locationName) => {
    setSearchQuery(locationName);
    setShowSuggestions(false);
    const mainLocation = locationName.split(" ")[0];
    setFilters((prev) => ({ ...prev, city: mainLocation }));
  };

  const handleSearchButtonClick = () => {
    navigate("/propertylisting", { state: { initialSearch: searchQuery } });
  };

  // Updated handleWhatsApp to send two sequential messages
  const handleWhatsApp = (e, property) => {
    e.stopPropagation();

    const propertyName = property.propertyname || property.propertyTitleEn;
    const price = `AED ${Number(property.price).toLocaleString()}`;
    const location = property.community || property.city;
    const propertyId = property._id;

    // First message to management
    const managementNumber = "971585852283";
    const managementMsg = encodeURIComponent(
      `*New Client Interest Alert!*\n\n` +
        `Property: ${propertyName}\n` +
        `Price: ${price}\n` +
        `Location: ${location}\n` +
        `ID: ${propertyId}\n` +
        `Type: ${isOffPlan(property) ? 'Off-Plan' : property.category || 'Residential'}\n` +
        `Offering: ${property.offeringType || 'Sale'}`
    );

    // Second message to agent
    const agentNumber = property.agentId?.phone || property.agentPhone || "971500000000";
    const agentMsg = encodeURIComponent(
      `Hello! I am interested in viewing your listing: *${propertyName}*.\n\n` +
        `📍 Location: ${location}\n` +
        `💰 Price: ${price}\n` +
        `🏷️ Type: ${isOffPlan(property) ? 'Off-Plan Project' : property.propertytype || 'Property'}\n\n` +
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
    window.location.href = `mailto:info@homoget.ae?subject=${encodeURIComponent(subject)}`;
  };

  const eliteProperties = propertyList.slice(0, 9);
  const insightProperties = propertyList.slice(9, 20);

  return (
    <div
      className={`${colors.background} min-h-screen pb-20 transition-colors duration-300`}
    >
      <AgentHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        onSuggestionClick={handleSuggestionClick}
        onSearchButtonClick={handleSearchButtonClick}
        propertyList={propertyList}
        filters={filters}
        handleFilterChange={(e) =>
          setFilters({ ...filters, [e.target.name]: e.target.value })
        }
        filterFields={filterFields}
        getUniqueValues={(data, key) =>
          [...new Set(data.flatMap((item) => item[key]))].filter(Boolean).sort()
        }
        setShowFilters={setShowFilters}
        showFilters={showFilters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-20">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <h2 className={`text-2xl md:text-4xl font-serif ${colors.text}`}>
              Exclusive{" "}
              <span className="text-amber-500 italic">Properties</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/propertylisting")}
            className="px-8 py-3 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            View All Properties <ArrowRight size={16} />
          </button>
        </div>

        {/* PROPERTY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eliteProperties.map((property) => {
            const statusBadge = getStatusBadge(property);
            const isOffPlanProperty = isOffPlan(property);
            const isCommercialProperty = isCommercial(property);
            const propertyTitle = property.propertyTitleEn || property.propertyname;
            const propertyType = property.propertytype || (isCommercialProperty ? "Commercial Space" : "Residential");
            const location = property.community || property.city || "Dubai";
            const agentName = property.agentId?.name || "Property Consultant";
            const agentImage = property.agentId?.profileImage || property.agentImage;
            const agentRating = property.agentId?.rating || 4.8;

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

                  {/* Property Type Badge - Top Left */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg tracking-wider flex items-center gap-1.5 ${getBadgeStyle(property)}`}>
                      {getPropertyTypeIcon(property)}
                      {propertyType}
                    </span>
                  </div>

                  {/* Status Badge - Top Right */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 backdrop-blur-md text-[9px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${statusBadge.color}`}>
                      {statusBadge.icon}
                      {statusBadge.text}
                    </span>
                  </div>

                  {/* Off-Plan Progress Bar */}
                  {isOffPlanProperty && property.completionPercentage && (
                    <div className="absolute bottom-16 left-0 right-0 px-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-1">
                        <div className="flex items-center justify-between text-[8px] font-black uppercase text-white px-2 mb-1">
                          <span>Construction Progress</span>
                          <span>{property.completionPercentage}%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${property.completionPercentage || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

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
                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-2 truncate ${colors.text}`}>
                    {propertyTitle}
                  </h3>

                  {/* PRICE + PROPERTY TYPE */}
<div className="flex items-center justify-between gap-3 mb-3  mt-3 md:mt-5 flex-wrap">
  
  {/* PRICE SECTION */}
  <div>
    <p className="text-amber-500 text-lg font-black leading-tight">
      AED {Number(property.price).toLocaleString()}

      {isRent(property) && property.rentedPeriod && (
        <span className="text-xs text-gray-400 font-normal ml-1">
          /{" "}
          {property.rentedPeriod
            ?.toLowerCase()
            .replace("per ", "") || "year"}
        </span>
      )}
    </p>

    {isOffPlanProperty && property.paymentPlan && (
      <p className="text-xs text-gray-400 font-normal mt-1">
        {property.paymentPlan || "Flexible Payment Plan"}
      </p>
    )}
  </div>

  {/* PROPERTY TYPE */}
  <div className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10">
    <p className="text-black dark:text-white text-xs font-bold uppercase tracking-wide">
      {property.category}
    </p>
  </div>
</div>


                   
                   


                 



                



                  {/* Specifications - Conditional based on property type */}
                  {isCommercialProperty ? (
                    // Commercial Property Specs
                    <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Building size={16} className="text-blue-500" />
                        <span className="text-[11px] font-bold uppercase">
                          {propertyType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Square size={14} className="text-blue-500" />
                        <span className="text-[11px] font-bold uppercase">
                          {property.squarefoot?.toLocaleString() || 0} Sq.Ft
                        </span>
                      </div>
                    </div>
                  ) : isOffPlanProperty ? (
                    // Off-Plan Property Specs
                    <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar size={16} className="text-purple-500" />
                        <span className="text-[11px] font-bold uppercase">
                          Handover: {property.deliveryDate || "Q4 2026"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Building size={14} className="text-purple-500" />
                        <span className="text-[11px] font-bold uppercase">
                          {property.developerId?.companyName || "Premium Developer"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Residential Property Specs
                    <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2 text-gray-500">
                        <BedDouble size={16} className="text-amber-500" />
                        <span className="text-[11px] font-bold uppercase">
                          {property.bedroom || 2} Beds
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Square size={14} className="text-amber-500" />
                        <span className="text-[11px] font-bold uppercase">
                          {property.squarefoot?.toLocaleString() || 0} Sq.Ft
                        </span>
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
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Listed by
                      </p>
                      <p className={`text-xs font-bold truncate ${colors.text}`}>
                        {agentName}
                      </p>
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
                        <FaWhatsapp size={20} />
                      </button>
                      <button
                        onClick={(e) => handleCall(e, property.agentId?.phone || property.agentPhone)}
                        className="text-blue-500 hover:scale-110 transition-transform"
                        title="Call Agent"
                      >
                        <Phone size={18} />
                      </button>
                      <button
                        onClick={(e) => handleEmail(e, property)}
                        className="text-amber-500 hover:scale-110 transition-transform"
                        title="Email Agent"
                      >
                        <Mail size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Share2
                        size={18}
                        className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.share?.({
                            title: propertyTitle,
                            text: `Check out this property: ${propertyTitle}`,
                            url: window.location.href,
                          });
                        }}
                      />
                      <Heart
                        size={18}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to wishlist logic here
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* MARKET INSIGHTS - SECONDARY LISTINGS */}
        {insightProperties.length > 0 && (
          <div className="mt-24 mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-0.5 w-8 bg-amber-500" />
              <h2 className={`text-2xl font-serif ${colors.text}`}>
                Market <span className="text-amber-500 italic">Insights</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insightProperties.map((property) => {
                const isOffPlanProperty = isOffPlan(property);
                const statusBadge = getStatusBadge(property);
                const propertyTitle = property.propertyTitleEn || property.propertyname;
                const location = property.community || property.city || "Dubai";

                return (
                  <motion.div
                    key={property._id}
                    onClick={() => handlePropertyClick(property)}
                    whileHover={{ scale: 1.02 }}
                    className={`group p-4 rounded-3xl ${colors.card} border ${colors.border} flex items-center gap-5 cursor-pointer shadow-sm hover:shadow-md transition-all`}
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100 relative">
                      <img
                        src={property.image?.[0]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={propertyTitle}
                      />
                      {isOffPlanProperty && (
                        <div className="absolute top-0 right-0 w-6 h-6 bg-purple-500 flex items-center justify-center rounded-bl-xl">
                          <Crown size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-bold text-sm truncate ${colors.text}`}>
                          {propertyTitle}
                        </h4>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded ${statusBadge.color}`}>
                          {statusBadge.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span className={`text-[9px] font-bold uppercase ${colors.textSecondary} truncate`}>
                          {location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-amber-500 font-bold text-xs">
                          AED {Number(property.price).toLocaleString()}
                        </p>
                        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && propertyList.length === 0 && (
          <div className="text-center py-20">
            <Building size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className={`text-xl font-serif ${colors.text} mb-2`}>No Properties Found</h3>
            <p className={colors.textSecondary}>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agentfilter;