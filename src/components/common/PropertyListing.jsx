import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Search, Filter, MapPin, Bed, Bath, Ruler, 
  ChevronLeft, ChevronRight, ArrowRight,
  Phone, Mail, Building2, Home, Barcode, Wrench, Calendar,
  IndianRupee, ChevronDown, Briefcase, Crown, Sparkles, 
  Clock, User, Star, Share2, Heart, DollarSign, Eye
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
  const [filters, setFilters] = useState({
    city: "", propertytype: "", price: "", squarefoot: "",
    bedroom: "", bathroom: "", floor: "", state: "", aminities: "",
    offeringType: "", category: ""
  });

  // CATCH REDIRECT FROM HOME PAGE
  useEffect(() => {
    if (location.state?.initialSearch) {
      const incomingSearch = location.state.initialSearch;
      setSearchQuery(incomingSearch);
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


  useEffect(() => {
  if (location.state?.filters) {
    const incomingFilters = location.state.filters;
    setFilters(prev => ({ ...prev, ...incomingFilters }));
  }
}, [location.state]);

  const getUniqueValues = (key) => {
    if (!propertyList) return [];
    return [...new Set(propertyList.map(item => item[key]).filter(Boolean))].sort();
  };

  const handleTopSearch = () => {
    setFilters({ ...filters, city: searchQuery, state: "" });
    setCurrentPage(1);
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

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION --- */}
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

          {/* SEARCH BAR */}
          <div className="relative z-50 w-full max-w-2xl mb-8">
            <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full border border-white/20 p-2 shadow-2xl">
              <Search className="text-amber-500 ml-4" size={20} />
              <input 
                type="text" 
                placeholder="Search city or project..." 
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-sm font-bold text-slate-800 placeholder-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTopSearch()}
              />
              <button 
                onClick={handleTopSearch}
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
        {/* Mobile Filter Toggle */}
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
                        onChange={(e) => setFilters({...filters, [field.name]: e.target.value})}
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
                  onClick={() => {
                    setFilters({ city: "", propertytype: "", price: "", squarefoot: "", bedroom: "", bathroom: "", floor: "", state: "", aminities: "", offeringType: "", category: "" });
                    setCurrentPage(1);
                  }}
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
        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {propertyList.length} Properties Found
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.length > 0 ? (
              propertyList.map((property) => {
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
                      
                      {/* Overlay Gradient */}
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

                      {/* Location Badge */}
                      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <MapPin size={10} className="text-amber-400" />
                        <span className="text-[9px] font-bold truncate max-w-[120px]">{location}, UAE</span>
                      </div>

                      {/* WhatsApp Floating Button */}
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

                      {/* Conditional Property Specs */}
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

                      {/* Price */}
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-[9px] font-black text-slate-400">AED</span>
                        <span className="text-xl font-black text-amber-500">{Number(property.price).toLocaleString()}</span>
                        {isRent(property) && property.rentedPeriod && (
                          <span className="text-[8px] text-slate-400 font-medium">/{property.rentedPeriod?.toLowerCase().replace("per ", "")?.slice(0, 3)}</span>
                        )}
                      </div>

                      {/* Off-Plan Progress Bar */}
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

                      {/* Agent Info */}
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

                      {/* Action Buttons */}
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
              })
            ) : (
              <div className="col-span-full text-center py-20">
                <div className={`inline-flex p-6 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} mb-4`}>
                  <Search size={48} className="text-slate-400" />
                </div>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No matching properties found</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2`}>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* --- PAGINATION --- */}
        {pagination.totalPages > 1 && (
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