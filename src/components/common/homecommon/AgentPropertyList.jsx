import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bed,
  Ruler,
  Bath,
  Phone,
  Mail,
  ArrowUpRight,
  Search,
  ArrowRight,
  Share2,
  Heart,
  Building,
  Briefcase,
  Home,
  Calendar,
  Crown,
  Sparkles,
  Clock,
  User,
  Star,
  DollarSign,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import CurrencyDisplay from "./CurrencyDisplay";

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

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await http.get("/getlatestproperty");
        if (res.data.success) {
          setLatestProperty(res.data.data);
          setFilteredProperties(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = latestProperty;
    if (activeFilter !== "All") {
      result = result.filter(
        (p) =>
          p.listingtype === activeFilter ||
          p.propertyListingType === activeFilter.toLowerCase() ||
          p.offeringType === activeFilter
      );
    }
    if (searchQuery) {
      result = result.filter(
        (p) =>
          (p.propertyname || p.propertyTitleEn || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.city || p.community || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.propertytype || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProperties(result);
  }, [activeFilter, searchQuery, latestProperty]);

  // DUAL WHATSAPP LOGIC with enhanced messaging
  const handleWhatsAppAction = (e, property) => {
    e.stopPropagation();

    const managementNo = "971585852283";
    const agentNo = property.agentId?.phone?.replace(/\s+/g, "") || "971500000000";
    const agentName = property.agentId?.name || "Property Consultant";
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    const propertyType = property.propertytype || (isCommercial(property) ? "Commercial Space" : "Residential");
    const propertyStatus = isOffPlan(property) ? "Off-Plan" : (isRent(property) ? "Rental" : "Sale");

    const propDetails = `*Property:* ${propertyTitle}\n*Type:* ${propertyType}\n*Status:* ${propertyStatus}\n*Price:* ${property.currency || "AED"} ${Number(property.price).toLocaleString()}${isRent(property) ? `/${property.rentedPeriod?.toLowerCase().replace("per ", "") || "year"}` : ""}\n*Location:* ${property.community || property.city}\n*Area:* ${property.squarefoot?.toLocaleString()} sqft\n*Ref:* ${property._id}`;
    
    const agentDetails = `*Agent:* ${agentName}\n*Contact:* ${property.agentId?.phone}\n*Email:* ${property.agentId?.email || "N/A"}`;

    // Message for Management
    const msgToManagement = encodeURIComponent(
      `🏢 *NEW INQUIRY - HOMOGET*\n\n━━━━━━━━━━━━━━━━━━━━\n📋 *PROPERTY DETAILS*\n━━━━━━━━━━━━━━━━━━━━\n${propDetails}\n\n━━━━━━━━━━━━━━━━━━━━\n👤 *ASSIGNED AGENT*\n━━━━━━━━━━━━━━━━━━━━\n${agentDetails}\n\n━━━━━━━━━━━━━━━━━━━━\n🕐 *Inquiry Time:* ${new Date().toLocaleString()}\n📱 *Via:* Property Listing Page`
    );

    // Message for Agent
    const msgToAgent = encodeURIComponent(
      `👋 *Hello ${agentName},*\n\nI am interested in your property listing:\n\n━━━━━━━━━━━━━━━━━━━━\n🏠 *${propertyTitle}*\n━━━━━━━━━━━━━━━━━━━━\n💰 *Price:* ${property.currency || "AED"} ${Number(property.price).toLocaleString()}\n📍 *Location:* ${property.community || property.city}\n📐 *Area:* ${property.squarefoot?.toLocaleString()} sqft\n🏷️ *Type:* ${propertyType}\n\n━━━━━━━━━━━━━━━━━━━━\n📅 *Could you please share:*\n• Viewing availability\n• Payment terms\n• Additional property details\n\nThank you!`
    );

    // Open Management Chat
    window.open(`https://wa.me/${managementNo}?text=${msgToManagement}`, "_blank");

    // Open Agent Chat after confirmation
    setTimeout(() => {
      const notifyAgent = window.confirm(
        "✅ Inquiry sent to Management.\n\nWould you like to notify " + agentName + " directly on WhatsApp as well?"
      );
      if (notifyAgent) {
        window.open(`https://wa.me/${agentNo}?text=${msgToAgent}`, "_blank");
      }
    }, 1000);
  };

  const handleCall = (e, phone) => {
    e.stopPropagation();
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleMail = (e, property) => {
    e.stopPropagation();
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    const subject = encodeURIComponent(`Inquiry: ${propertyTitle} - Property ID: ${property._id}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in the following property:\n\nProperty: ${propertyTitle}\nPrice: ${property.currency || "AED"} ${Number(property.price).toLocaleString()}\nLocation: ${property.community || property.city}\n\nPlease provide more information.\n\nThank you.`
    );
    window.location.href = `mailto:info@homoget.ae?subject=${subject}&body=${body}`;
  };

  const handleShare = (e, property) => {
    e.stopPropagation();
    const propertyTitle = property.propertyTitleEn || property.propertyname;
    if (navigator.share) {
      navigator.share({
        title: propertyTitle,
        text: `Check out this amazing property: ${propertyTitle}`,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className={`py-16 px-6 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-[2.5rem] h-[500px] animate-pulse ${isDark ? "bg-[#11141B]" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cardBg = isDark
    ? "bg-[#11141B] border-white/5"
    : "bg-white border-slate-100 shadow-sm";

  // Filter buttons for quick navigation
  const filterButtons = [
    { label: "All", value: "All" },
    { label: "For Sale", value: "Sale" },
    { label: "For Rent", value: "Rent" },
    { label: "Off-Plan", value: "Off-Plan" },
    { label: "Commercial", value: "Commercial" },
  ];

  return (
    <section
      className={`py-16 px-6 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Latest <span className="text-amber-500">Properties</span> 
            </h1>
          </div>
          <button
            onClick={() => navigate("/propertylisting")}
            className="px-8 py-3 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            View All Properties <ArrowRight size={16} />
          </button>
        </div>

        {/* --- FILTER & SEARCH BAR --- */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeFilter === filter.label
                    ? "bg-amber-500 text-black"
                    : isDark
                    ? "bg-[#11141B] text-white/60 hover:bg-white/10"
                    : "bg-white text-slate-500 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-11 pr-5 py-3 rounded-full text-sm w-64 lg:w-80 outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                isDark ? "bg-[#11141B] text-white border-white/10" : "bg-white text-slate-900 border-slate-200"
              } border`}
            />
          </div>
        </div>

        {/* --- PROPERTY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, idx) => {
              const statusBadge = getStatusBadge(property);
              const isOffPlanProperty = isOffPlan(property);
              const isCommercialProperty = isCommercial(property);
              const propertyTitle = property.propertyTitleEn || property.propertyname;
              const propertyType = property.propertytype || (isCommercialProperty ? "Commercial" : "Residential");
              const location = property.community || property.city || "Dubai";
              const agentName = property.agentId?.name || "Property Consultant";
              const agentImage = property.agentId?.profilePhoto;
              const agentRating = property.agentId?.rating || 4.8;
              const hasValidAgent = property.agentId && Object.keys(property.agentId).length > 0;

              return (
                <motion.div
                  layout
                  key={property._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8 }}
                  className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-300 hover:shadow-2xl ${cardBg} cursor-pointer flex flex-col`}
                  onClick={() =>
                    navigate(`/property/${property._id}`, {
                      state: { propertyData: property },
                    })
                  }
                >
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={property.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"}
                      alt={propertyTitle}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg flex items-center gap-1.5 ${
                        isOffPlanProperty ? "bg-gradient-to-r from-purple-600 to-pink-600" :
                        isCommercialProperty ? "bg-gradient-to-r from-blue-600 to-cyan-600" :
                        "bg-gradient-to-r from-amber-600 to-orange-600"
                      }`}>
                        {getPropertyTypeIcon(property)}
                        {propertyType}
                      </span>
                    </div>
                    
                    <div className="absolute top-5 right-5 z-10">
                      <span className={`px-3 py-1.5 backdrop-blur-md text-[9px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${statusBadge.color}`}>
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Off-Plan Progress Bar */}
                    {isOffPlanProperty && property.completionPercentage && (
                      <div className="absolute bottom-20 left-0 right-0 px-4 z-10">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                          <div className="flex items-center justify-between text-[8px] font-black uppercase text-white px-2 mb-1">
                            <span>Construction Progress</span>
                            <span>{property.completionPercentage}%</span>
                          </div>
                          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${property.completionPercentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Badge */}
                    <div className="absolute bottom-5 left-5 z-10 flex items-center gap-1.5 text-white bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <MapPin size={12} className="text-amber-400" />
                      <span className="text-[10px] font-bold truncate max-w-[150px]">
                        {location}, UAE
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1">
                    <h3
                      className={`text-lg font-bold leading-tight mb-2 group-hover:text-amber-500 transition-colors line-clamp-1 ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      {propertyTitle}
                    </h3>

                    {/* Conditional Property Specs */}
                    {isCommercialProperty ? (
                      <div className="flex items-center gap-4 py-3 border-y border-slate-500/10 mb-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Building size={14} className="text-blue-500" />
                          <span className="text-[10px] font-bold uppercase">
                            {propertyType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Ruler size={14} className="text-blue-500" />
                          <span className="text-[10px] font-bold uppercase">
                            {property.squarefoot?.toLocaleString() || 0} Sq.Ft
                          </span>
                        </div>
                      </div>
                    ) : isOffPlanProperty ? (
                      <div className="flex items-center gap-4 py-3 border-y border-slate-500/10 mb-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} className="text-purple-500" />
                          <span className="text-[9px] font-bold uppercase">
                            Handover: {property.deliveryDate || "2026"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                          <Building size={14} className="text-purple-500" />
                          <span className="text-[9px] font-bold uppercase truncate">
                            {property.developerId?.companyName?.slice(0, 12) || "Premium"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-500/10 mb-4">
                        <div className="text-center">
                          <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">
                            Beds
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <Bed size={12} className="text-amber-500" />
                            <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                              {property.bedroom || 0}
                            </span>
                          </div>
                        </div>
                        <div className="text-center border-x border-slate-500/10">
                          <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">
                            Baths
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <Bath size={12} className="text-amber-500" />
                            <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                              {property.bathroom || 0}
                            </span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">
                            Area
                          </p>
                          <div className="flex items-center justify-center gap-1">
                            <Ruler size={12} className="text-amber-500" />
                            <span className={`text-xs font-black ${isDark ? "text-white" : "text-slate-900"}`}>
                              {property.squarefoot?.toLocaleString() || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                   <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-[8px] font-black uppercase text-slate-400 tracking-tighter mb-0.5">
        {isOffPlanProperty ? "Starting From" : "Listing Price"}
      </p>
      <CurrencyDisplay 
        price={property.price} 
        period={isRent(property) ? property.rentedPeriod : null}
        currency={property?.currency || "AED"}
        isDark={isDark}
        priceClassName="text-xl font-black tracking-tighter"
        periodClassName="text-[8px] text-slate-400 font-normal"
        imageSize="sm"
      />
    </div>
    <button className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
      <ArrowUpRight size={20} />
    </button>
  </div>

                    {/* Agent Info Section - Enhanced */}
                    {hasValidAgent && (
                      <div className="flex items-center gap-3 py-3 mt-2 border-t border-gray-100 dark:border-white/5">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
                          {agentImage ? (
                            <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                              <User size={14} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                            Listed by
                          </p>
                          <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                            {agentName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-amber-500 fill-amber-500" />
                          <span className="text-[9px] font-bold text-slate-500">{agentRating}</span>
                        </div>
                      </div>
                    )}

                    {/* Quick Connect Bar */}
                    <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 dark:border-white/5">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => handleWhatsAppAction(e, property)}
                          className="text-green-500 hover:scale-110 transition-transform"
                          title="WhatsApp Agent"
                        >
                          <FaWhatsapp size={18} />
                        </button>
                        <button
                          onClick={(e) => handleCall(e, property.agentId?.phone)}
                          className="text-amber-500 hover:scale-110 transition-transform"
                          title="Call Agent"
                        >
                          <Phone size={16} />
                        </button>
                        <button
                          onClick={(e) => handleMail(e, property)}
                          className="text-blue-500 hover:scale-110 transition-transform"
                          title="Email Agent"
                        >
                          <Mail size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Share2
                          size={16}
                          className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                          onClick={(e) => handleShare(e, property)}
                        />
                        <Heart
                          size={16}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add to wishlist functionality
                            const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
                            if (!wishlist.includes(property._id)) {
                              wishlist.push(property._id);
                              localStorage.setItem("wishlist", JSON.stringify(wishlist));
                              alert("Added to wishlist!");
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* --- NO RESULTS --- */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-slate-500/20 rounded-[3rem]">
            <Search
              size={48}
              className="mx-auto text-slate-500 mb-4 opacity-20"
            />
            <h3 className={`text-xl font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-slate-400"}`}>
              No matching assets found
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Try adjusting your filters or search criteria
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredProperties.length > 0 && filteredProperties.length >= 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/propertylisting")}
              className="px-8 py-3 rounded-full border-2 border-amber-500 text-amber-500 text-xs font-black uppercase tracking-wider hover:bg-amber-500 hover:text-black transition-all"
            >
              Load More Properties <ArrowRight size={14} className="inline ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AgentPropertyList;