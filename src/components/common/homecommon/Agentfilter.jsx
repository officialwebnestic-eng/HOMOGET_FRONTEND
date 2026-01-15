import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Search, MapPin, Home, IndianRupee, ArrowRight,
  Bed, Bath, Ruler, Building2, Wrench, X,
  Barcode, Filter, ChevronDown, ChevronUp, Star,
  Calendar, Phone, Mail, Share2, Maximize2,
  ChevronRight
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllProperty from "../../../hooks/useGetAllProperty";
import { homenew } from "../../../ExportImages";
import { RadialGradient } from "react-text-gradients";
import { useSpring, animated } from "@react-spring/web";
import AgentHero from "./AgentHero";

// Color Theme System
const themeColors = {
  light: {
    primary: "bg-gradient-to-r from-yellow-400 to-pink-600",
    primaryHover: "hover:from-yellow-500 hover:to-pink-700",
    secondary: "bg-amber-500",
    secondaryHover: "hover:bg-amber-600",
    background: "bg-gray-50",
    card: "bg-white",
    text: "text-gray-800",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
    input: "bg-white border-gray-300 focus:ring-blue-500",
    modal: "bg-white",
    gradientOverlay: "bg-gradient-to-t from-sky-300/40 via-slate-100/10 to-transparent",
    shadowOverlay: "shadow-[inset_0_-15px_30px_-10px_rgba(14,165,233,0.2)]"
  },
  dark: {
    primary: "bg-gradient-to-r from-yellow-400 to-pink-600",
    primaryHover: "hover:from-yellow-500 hover:to-pink-700",
    secondary: "bg-amber-400",
    secondaryHover: "hover:bg-amber-500",
    background: "bg-gray-900",
    card: "bg-gray-800",
    text: "text-gray-100",
    textSecondary: "text-gray-300",
    border: "border-gray-700",
    input: "bg-gray-700 border-gray-600 focus:ring-indigo-500",
    modal: "bg-gray-800",
    gradientOverlay: "bg-gradient-to-t from-indigo-900/20 via-slate-800 to-gray-900",
    shadowOverlay: "shadow-[inset_0_-20px_40px_-15px_rgba(124,58,237,0.3)]"
  }
};

const getUniqueValues = (data, key) => {
  return [...new Set(data.map((item) => item[key]).filter(Boolean))].sort();
};

export const AnimatedContainer = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${reverse ? `-${distance}px` : `${distance}px`})`,
      opacity: 0
    },
    to: inView ? {
      transform: `translate${directions[direction]}(0px)`,
      opacity: 1
    } : {},
    config: { tension: 50, friction: 25 },
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

const Agentfilter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    propertyname: "", price: "", bedroom: "", bathroom: "",
    squarefoot: "", floor: "", zipcode: "", propertytype: "",
    listingtype: "", state: "", city: "", aminities: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState("buy");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();
  const limit = 6;

  const { propertyList, loading } = useGetAllProperty(currentPage, limit, filters);

  // Inside Agentfilter.jsx
const filterFields = [
  { name: "state", label: "Location", icon: <MapPin size={16} /> },
  { name: "listingtype", label: "Category", icon: <Building2 size={16} /> },
  { name: "propertytype", label: "Property Type", icon: <Home size={16} /> },
  { name: "price", label: "Price", icon: <IndianRupee size={16} /> },
  { name: "squarefoot", label: "Area (sq ft)", icon: <Ruler size={16} /> },
  { name: "bedroom", label: "Bedrooms", icon: <Bed size={16} /> },
  { name: "bathroom", label: "Bathrooms", icon: <Bath size={16} /> },
  { name: "floor", label: "Floor", icon: <Barcode size={16} /> },
  { name: "city", label: "City", icon: <MapPin size={16} /> },
  { name: "aminities", label: "Amenities", icon: <Wrench size={16} /> },
];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleBuyNow = (property) => {
    navigate("/bookings", { state: { property } });
  };

  const handleSubmit = () => {
  // Use the existing searchQuery and filters state
  setFilters(prev => ({ ...prev, city: searchQuery }));
  setCurrentPage(1);
  setShowSuggestions(false);
  // If you want to trigger a scroll or a specific API call, do it here
};

  const closeModal = () => {
    setSelectedProperty(null);
    setCurrentImageIndex(0);
  };
  
  const openModal = (property) => setSelectedProperty(property);

  // Handle outside click for suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSuggestions && !e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSuggestions]);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      propertyname: "", price: "", bedroom: "", bathroom: "",
      squarefoot: "", floor: "", zipcode: "", propertytype: "",
      listingtype: "", state: "", city: "", aminities: "",
    });
    setSearchQuery("");
    setShowFilters(false);
  };

  return (
    <div className={colors.background}>
      {/* Hero Section with Background Image */}
     
   <AgentHero 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        propertyList={propertyList}
        filters={filters}
        handleFilterChange={handleFilterChange}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        handleSubmit={handleSubmit}
        resetFilters={resetFilters}
        filterFields={filterFields}
        getUniqueValues={getUniqueValues}
        colors={{ primary: "bg-amber-500", primaryHover: "hover:bg-amber-600" }}
      />

      {/* Main Content */}
     {/* Main Content Wrapper - Lower z-index ensures Hero filters float on top */}
<div className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
  
  {/* 1. Featured Properties Section */}
  <div className={`rounded-[2.5rem] ${colors.card} backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] p-8 md:p-12 mb-20 border ${colors.border}`}>
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-8 bg-amber-500"></div>
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Elite Selection
          </span>
        </div>
        <h2 className={`text-4xl md:text-5xl font-serif leading-tight ${colors.text}`}>
          Featured <span className="italic font-light text-amber-500/90">Living</span>
        </h2>
        <p className={`${colors.textSecondary} max-w-md text-sm leading-relaxed font-medium`}>
          A hand-picked collection of Dubai's most prestigious architectural landmarks.
        </p>
      </div>
      
      <NavLink to="/propertylisting">
        <button className="group flex items-center gap-4 px-8 py-4 rounded-full bg-amber-500 text-black transition-all duration-500 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95">
          <span>View Full Collection</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </NavLink>
    </div>

    {/* Featured Properties Grid */}
    {loading ? (
      <div className="flex flex-col justify-center items-center h-80">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin"></div>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {propertyList.slice(0, 3).map((property, index) => (
          <motion.div
            key={property._id || index}
            className="group relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            {/* Image Box */}
            <div className="relative h-[420px] rounded-[2rem] overflow-hidden shadow-2xl">
              <img
                src={property.image?.[0]}
                alt={property.propertyname}
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />
              {/* Amber Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Top Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-amber-500 text-black shadow-xl">
                  {property.propertytype}
                </span>
                {property.isHot && (
                  <span className="px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-white/10 backdrop-blur-md text-white border border-white/20">
                    Hot Deal
                  </span>
                )}
              </div>

              {/* Price Tag Floating */}
              <div className="absolute top-6 right-6">
                 <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
                    <p className="text-[8px] font-black uppercase tracking-tighter text-amber-500">Starting</p>
                    <p className="text-sm font-bold text-white">₹{property.price.toLocaleString()}</p>
                 </div>
              </div>

              {/* Bottom Content Area */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">
                  {property.city}, {property.state}
                </p>
                <h3 className="text-2xl font-serif text-white mb-6 leading-tight">
                  {property.propertyname}
                </h3>
                
                {/* Specs Row */}
                <div className="flex items-center gap-6 mb-8 text-white/70">
                   <div className="flex items-center gap-2">
                     <Bed className="w-4 h-4 text-amber-500" />
                     <span className="text-xs font-bold">{property.bedroom} BHK</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Ruler className="w-4 h-4 text-amber-500" />
                     <span className="text-xs font-bold">{property.squarefoot} ft²</span>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => openModal(property)} className="flex-1 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    View Details
                  </button>
                  <button onClick={() => handleBuyNow(property)} className="p-4 bg-amber-500 text-black rounded-2xl hover:scale-110 transition-transform shadow-xl shadow-amber-500/40">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>

  {/* 2. Secondary Inventory List */}
  <div className="pb-32" >
    <div className="flex items-center gap-8 mb-12">
      <h2 className={`text-3xl font-serif ${colors.text}`}>Market <span className="italic font-light text-amber-500">Insights</span></h2>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {propertyList.map((property, index) => (
        <motion.div
          key={property._id || index}
          className={`group p-4 rounded-[1.5rem] ${colors.card} border ${colors.border} hover:border-amber-500/50 transition-all duration-500`}
          whileHover={{ x: 10 }}
        >
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
              <img src={property.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1">
              <h4 className={`font-bold text-sm mb-1 group-hover:text-amber-500 transition-colors ${colors.text}`}>
                {property.propertyname}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span className={`text-[10px] font-medium ${colors.textSecondary}`}>{property.city}</span>
              </div>
              <p className="text-xs font-black text-amber-500">₹{property.price.toLocaleString()}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
               <ChevronRight className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</div>
    <AnimatePresence>
  {selectedProperty && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex justify-center items-center p-4 md:p-6"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        /* REDUCED WIDTH: Changed max-w-7xl to max-w-5xl */
        className={`max-w-5xl w-full ${theme === "dark" ? "bg-neutral-900" : "bg-white"} rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] border ${colors.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Compact Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-amber-500 text-white hover:text-black backdrop-blur-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-11">
            
            {/* LEFT: MEDIA SECTION (Reduced to 6 columns) */}
            <div className="lg:col-span-6 p-6 space-y-6">
              {/* REDUCED IMAGE HEIGHT: Changed from 500px to 380px */}
              <div className="relative h-[250px] md:h-[380px] rounded-[1.5rem] overflow-hidden shadow-xl group">
                <img
                  src={selectedProperty.image?.[currentImageIndex] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"}
                  alt="Elite Home"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Minimalist Image Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/30 backdrop-blur-md rounded-full">
                  {selectedProperty.image?.slice(0, 5).map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1 rounded-full transition-all ${currentImageIndex === idx ? "w-4 bg-amber-500" : "w-1 bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Header Details */}
              <div className="space-y-4 px-2">
                <div className="space-y-1">
                  <h2 className={`text-2xl md:text-3xl font-serif ${colors.text}`}>
                    {selectedProperty.propertyname}
                  </h2>
                  <p className="flex items-center text-amber-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    {selectedProperty.city}, {selectedProperty.state}
                  </p>
                </div>

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Beds", val: selectedProperty.bedroom, icon: <Bed size={16}/> },
                    { label: "Baths", val: selectedProperty.bathroom, icon: <Bath size={16}/> },
                    { label: "Area", val: selectedProperty.squarefoot, icon: <Ruler size={16}/> },
                    { label: "Floor", val: selectedProperty.floor, icon: <Building2 size={16}/> }
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${colors.border} ${theme === "dark" ? "bg-white/5" : "bg-slate-50"} text-center`}>
                      <div className="flex justify-center text-amber-500 mb-1">{stat.icon}</div>
                      <p className={`text-sm font-bold ${colors.text}`}>{stat.val}</p>
                      <p className="text-[8px] font-black uppercase text-amber-500/60">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Description Snippet */}
                <p className={`text-xs leading-relaxed ${colors.textSecondary} line-clamp-3`}>
                  {selectedProperty.description}
                </p>
              </div>
            </div>

            {/* RIGHT: ACTION PANEL (Reduced to 5 columns) */}
            <div className={`lg:col-span-5 border-l ${colors.border} p-6 bg-gradient-to-br ${theme === "dark" ? "from-neutral-900 to-neutral-800" : "from-slate-50 to-white"}`}>
              <div className="space-y-6">
                
                {/* Minimalist Pricing Card */}
                <div className="p-6 rounded-[1.5rem] bg-amber-500 text-black shadow-lg">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Investment</p>
                  <p className="text-3xl font-serif">₹{selectedProperty.price.toLocaleString()}</p>
                  <div className="mt-4 pt-4 border-t border-black/10 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest">{selectedProperty.status}</span>
                    <span className="text-[10px] opacity-60">REF ID: {selectedProperty._id?.slice(-5)}</span>
                  </div>
                </div>

                {/* Primary Action */}
                <div className="space-y-3">
                  <button className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-md">
                    Schedule Visit
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className={`py-3 border ${colors.border} rounded-xl text-[9px] font-black uppercase tracking-widest ${colors.text} hover:bg-amber-500 hover:text-black transition-all`}>
                      WhatsApp
                    </button>
                    <button className={`py-3 border ${colors.border} rounded-xl text-[9px] font-black uppercase tracking-widest ${colors.text} hover:bg-amber-500 hover:text-black transition-all`}>
                      Contact
                    </button>
                  </div>
                </div>

                {/* Compact Amenities */}
                <div className="space-y-3">
                   <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500">Key Features</h4>
                   <div className="grid grid-cols-2 gap-2">
                     {selectedProperty.aminities?.slice(0, 4).map((item, idx) => (
                       <div key={idx} className="flex items-center gap-2 text-[10px] font-bold py-1">
                         <div className="w-1 h-1 rounded-full bg-amber-500" />
                         <span className={colors.textSecondary}>{item.replace(/[\[\]"]/g, '').slice(0, 15)}</span>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Payment Plan */}
                <div className={`p-4 rounded-xl border border-dashed ${colors.border}`}>
                  <div className="flex justify-between text-[10px] mb-2 font-black uppercase text-amber-500">
                    <span>Payment Structure</span>
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between"><span className={colors.textSecondary}>Initial</span><span className={colors.text}>20%</span></div>
                    <div className="flex justify-between"><span className={colors.textSecondary}>Construction</span><span className={colors.text}>50%</span></div>
                    <div className="flex justify-between"><span className={colors.textSecondary}>Completion</span><span className={colors.text}>30%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default Agentfilter;