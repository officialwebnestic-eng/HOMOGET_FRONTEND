import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Search, MapPin, Home, IndianRupee, ArrowRight,
  Bed, Bath, Ruler, Building2, Wrench, X,
  Barcode, Filter, ChevronDown, ChevronUp, Star,
  Calendar, Phone, Mail, Share2, Maximize2
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Featured Properties Section */}
        <div className={`rounded-2xl ${colors.card} shadow-xl p-6 mb-16 border ${colors.border}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>
                Explore New Projects
              </h2>
              <p className={`${colors.textSecondary} mt-2`}>
                Discover the latest off-plan properties and be informed
              </p>
            </div>
            <NavLink to="/propertylisting">
              <button className={`mt-4 md:mt-0 flex items-center gap-2 ${colors.text} hover:${colors.textSecondary} transition-colors`}>
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </NavLink>
          </div>

          {/* Featured Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === "dark" ? "border-indigo-500" : "border-blue-500"}`}></div>
            </div>
          ) : propertyList.length === 0 ? (
            <div className="text-center py-16">
              <h3 className={`text-xl font-medium mb-2 ${colors.text}`}>
                No properties found
              </h3>
              <p className={`mb-6 ${colors.textSecondary}`}>
                Try adjusting your search filters
              </p>
              <button
                onClick={resetFilters}
                className={`px-6 py-3 rounded-xl font-medium ${colors.primary} text-white hover:shadow-lg transition-shadow`}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.slice(0, 3).map((property, index) => (
                <motion.div
                  key={property._id || index}
                  className={`rounded-2xl overflow-hidden shadow-lg ${colors.card} hover:shadow-xl transition-all duration-300 border ${colors.border}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  {/* Property Image */}
                  <div className="relative h-48">
                    {property.image?.[0] ? (
                      <img
                        src={property.image[0]}
                        alt={property.propertyname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center`}>
                        <Home className={`w-12 h-12 ${colors.textSecondary}`} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        theme === "dark" ? "bg-indigo-600 text-white" : "bg-blue-600 text-white"
                      }`}>
                        {property.propertytype || "Property"}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-900/80" : "bg-white/80"} backdrop-blur-sm`}>
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className={`font-bold text-lg mb-1 ${colors.text}`}>
                          {property.propertyname}
                        </h3>
                        <p className={`text-sm flex items-center ${colors.textSecondary}`}>
                          <MapPin className="w-3 h-3 mr-1" />
                          {property.city}, {property.state}
                        </p>
                      </div>
                      <div className={`text-right font-bold ${colors.text}`}>
                        <div className="text-sm">Launch price</div>
                        <div className="flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {property.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className={`flex items-center text-sm ${colors.textSecondary}`}>
                          <Bed className="w-4 h-4 mr-1" /> {property.bedroom || "0"}
                        </span>
                        <span className={`flex items-center text-sm ${colors.textSecondary}`}>
                          <Bath className="w-4 h-4 mr-1" /> {property.bathroom || "0"}
                        </span>
                        <span className={`flex items-center text-sm ${colors.textSecondary}`}>
                          <Ruler className="w-4 h-4 mr-1" /> {property.squarefoot || "0"}
                        </span>
                      </div>
                    </div>

                    {/* Amenities Preview */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.aminities &&
                        Array.isArray(property.aminities) &&
                        property.aminities.slice(0, 2).map((item, index) => {
                          try {
                            const parsed = JSON.parse(item);
                            const amenity = Array.isArray(parsed) ? parsed[0] : parsed;
                            return (
                              <span
                                key={index}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {amenity}
                              </span>
                            );
                          } catch {
                            return null;
                          }
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(property)}
                        className={`flex-1 py-2 rounded-lg border ${colors.border} ${
                          theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                        } transition-colors`}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(property);
                        }}
                        className={`flex-1 py-2 rounded-lg ${colors.primary} text-white ${colors.primaryHover} transition-colors`}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* All Properties Section */}
        <div className="mb-16">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-8 ${colors.text}`}>
            All Properties
          </h2>
          
          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyList.map((property, index) => (
              <motion.div
                key={property._id || index}
                className={`rounded-xl overflow-hidden ${colors.card} shadow-md hover:shadow-lg transition-shadow border ${colors.border}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Property Image */}
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      {property.image?.[0] ? (
                        <img
                          src={property.image[0]}
                          alt={property.propertyname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center`}>
                          <Home className={`w-8 h-8 ${colors.textSecondary}`} />
                        </div>
                      )}
                    </div>

                    {/* Property Info */}
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-1 ${colors.text}`}>
                        {property.propertyname}
                      </h4>
                      <p className={`text-xs flex items-center mb-2 ${colors.textSecondary}`}>
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.city}, {property.state}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`text-sm ${colors.text}`}>
                          <IndianRupee className="w-3 h-3 inline mr-1" />
                          {property.price.toLocaleString()}
                        </span>
                        <span className={`text-sm ${colors.textSecondary}`}>
                          <Bed className="w-3 h-3 inline mr-1" /> {property.bedroom}
                        </span>
                        <span className={`text-sm ${colors.textSecondary}`}>
                          <Bath className="w-3 h-3 inline mr-1" /> {property.bathroom}
                        </span>
                      </div>

                      <button
                        onClick={() => openModal(property)}
                        className={`text-sm font-medium ${colors.text} hover:${colors.textSecondary} transition-colors`}
                      >
                        View details →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {propertyList.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-6 py-3 rounded-lg ${colors.primary} text-white ${colors.primaryHover} transition-colors`}
              >
                Load More Properties
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Property Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className={`max-w-6xl w-full ${colors.modal} rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] border ${colors.border}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === "dark" 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                    : "bg-white hover:bg-gray-100 text-gray-700"
                } shadow-lg transition-colors`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="p-4 md:p-8">
                {/* Property Images Section */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Image */}
                    <div className="lg:col-span-2">
                      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                        <img
                          src={
                            selectedProperty.image?.[currentImageIndex] ||
                            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                          }
                          alt="Property"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Image Counter */}
                        <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
                          theme === "dark" ? "bg-gray-900/80 text-white" : "bg-white/90 text-gray-800"
                        } backdrop-blur-sm`}>
                          {currentImageIndex + 1} / {selectedProperty.image?.length || 1}
                        </div>

                        {/* Fullscreen Button */}
                        <button className={`absolute top-4 right-4 p-2 rounded-full ${
                          theme === "dark" ? "bg-gray-900/80 hover:bg-gray-800" : "bg-white/90 hover:bg-white"
                        } backdrop-blur-sm transition-colors`}>
                          <Maximize2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Thumbnails and Quick Info */}
                    <div className="space-y-6">
                      {/* Thumbnails */}
                      <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                        <h3 className={`text-sm font-semibold mb-3 ${colors.text}`}>Gallery</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedProperty.image && selectedProperty.image.length > 0 ? (
                            selectedProperty.image.slice(0, 6).map((imgSrc, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative h-20 overflow-hidden rounded-lg transition-all ${
                                  currentImageIndex === index 
                                    ? "ring-2 ring-blue-500 scale-105" 
                                    : "hover:scale-105"
                                }`}
                              >
                                <img 
                                  src={imgSrc} 
                                  alt={`Property Image ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 ${
                                  currentImageIndex === index 
                                    ? "bg-blue-500/20" 
                                    : "bg-black/10 hover:bg-black/20"
                                } transition-colors`}></div>
                              </button>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-4">
                              <Home className={`w-8 h-8 mx-auto mb-2 ${colors.textSecondary}`} />
                              <p className={`text-sm ${colors.textSecondary}`}>No images available</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"}`}>
                        <h3 className={`text-sm font-semibold mb-3 ${colors.text}`}>Property Info</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${colors.textSecondary}`}>Property Type</span>
                            <span className={`font-medium ${colors.text}`}>{selectedProperty.propertytype || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${colors.textSecondary}`}>Status</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedProperty.status === "Available" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {selectedProperty.status || "Available"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm ${colors.textSecondary}`}>Listed On</span>
                            <span className={`font-medium ${colors.text}`}>
                              {new Date(selectedProperty.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Details */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Title and Location */}
                    <div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.text}`}>
                            {selectedProperty.propertyname || "Luxury Property"}
                          </h2>
                          <p className={`font-medium ${colors.textSecondary} text-sm flex items-center`}>
                            <MapPin className="w-4 h-4 mr-2" />
                            {selectedProperty.address || "N/A"}, {selectedProperty.city || "City"}, {selectedProperty.state || "State"}
                          </p>
                        </div>
                        {/* Share and Favorite Buttons */}
                        <div className="flex gap-2 mt-4 md:mt-0">
                          <button className={`p-2 rounded-lg border ${colors.border} ${
                            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          } transition-colors`}>
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg border ${colors.border} ${
                            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          } transition-colors`}>
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Property Stats Grid */}
                    <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-800/50" : "bg-blue-50"} border ${colors.border}`}>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 ${
                            theme === "dark" ? "bg-gray-700" : "bg-white"
                          }`}>
                            <Bed className={`w-6 h-6 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                          </div>
                          <div className={`text-2xl font-bold ${colors.text}`}>{selectedProperty.bedroom || "0"}</div>
                          <div className={`text-sm ${colors.textSecondary}`}>Bedrooms</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 ${
                            theme === "dark" ? "bg-gray-700" : "bg-white"
                          }`}>
                            <Bath className={`w-6 h-6 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                          </div>
                          <div className={`text-2xl font-bold ${colors.text}`}>{selectedProperty.bathroom || "0"}</div>
                          <div className={`text-sm ${colors.textSecondary}`}>Bathrooms</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 ${
                            theme === "dark" ? "bg-gray-700" : "bg-white"
                          }`}>
                            <Ruler className={`w-6 h-6 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                          </div>
                          <div className={`text-2xl font-bold ${colors.text}`}>{selectedProperty.squarefoot || "0"}</div>
                          <div className={`text-sm ${colors.textSecondary}`}>Sq. Ft</div>
                        </div>
                        
                        <div className="text-center">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-3 ${
                            theme === "dark" ? "bg-gray-700" : "bg-white"
                          }`}>
                            <Barcode className={`w-6 h-6 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                          </div>
                          <div className={`text-2xl font-bold ${colors.text}`}>{selectedProperty.floor || "0"}</div>
                          <div className={`text-sm ${colors.textSecondary}`}>Floor</div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {selectedProperty.description && (
                      <div>
                        <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>Description</h3>
                        <p className={`${colors.textSecondary} leading-relaxed`}>
                          {selectedProperty.description}
                        </p>
                      </div>
                    )}

                    {/* Amenities */}
                    <div>
                      <h3 className={`text-xl font-semibold mb-4 ${colors.text}`}>Amenities</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedProperty.aminities && Array.isArray(selectedProperty.aminities) ? (
                          selectedProperty.aminities.map((item, index) => {
                            try {
                              const parsed = JSON.parse(item);
                              const amenities = Array.isArray(parsed) ? parsed : [parsed];
                              return amenities.map((amenity, i) => (
                                <div
                                  key={`${index}-${i}`}
                                  className={`flex items-center p-3 rounded-lg border ${colors.border} ${
                                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                                  } transition-colors`}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    theme === "dark" ? "bg-indigo-900/50" : "bg-blue-100"
                                  }`}>
                                    <Wrench className={`w-4 h-4 ${
                                      theme === "dark" ? "text-indigo-300" : "text-blue-600"
                                    }`} />
                                  </div>
                                  <span className={`text-sm ${colors.text}`}>{amenity}</span>
                                </div>
                              ));
                            } catch {
                              return (
                                <div
                                  key={index}
                                  className={`flex items-center p-3 rounded-lg border ${colors.border} ${
                                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                                  } transition-colors`}
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                    theme === "dark" ? "bg-indigo-900/50" : "bg-blue-100"
                                  }`}>
                                    <Wrench className={`w-4 h-4 ${
                                      theme === "dark" ? "text-indigo-300" : "text-blue-600"
                                    }`} />
                                  </div>
                                  <span className={`text-sm ${colors.text}`}>{item}</span>
                                </div>
                              );
                            }
                          })
                        ) : (
                          <p className={`text-sm ${colors.textSecondary}`}>No amenities listed</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Price and Actions */}
                  <div className="space-y-6">
                    {/* Price Card */}
                    <div className={`p-6 rounded-2xl shadow-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100"}`}>
                      <div className="mb-4">
                        <div className={`text-3xl md:text-4xl font-bold mb-1 ${colors.text}`}>
                          ₹{new Intl.NumberFormat('en-IN').format(selectedProperty.price) || "Price on request"}
                        </div>
                        {selectedProperty.price && selectedProperty.squarefoot && (
                          <div className={`text-sm ${colors.textSecondary}`}>
                            ₹{Math.round(selectedProperty.price / selectedProperty.squarefoot).toLocaleString()} per sq.ft
                          </div>
                        )}
                      </div>
                      
                      {/* Payment Plan */}
                      <div className={`mt-4 p-4 rounded-lg ${theme === "dark" ? "bg-gray-700/50" : "bg-white/50"}`}>
                        <h4 className={`text-sm font-semibold mb-2 ${colors.text}`}>Payment Plan</h4>
                        <ul className="space-y-2">
                          <li className="flex justify-between text-sm">
                            <span className={colors.textSecondary}>Down Payment</span>
                            <span className={colors.text}>20%</span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className={colors.textSecondary}>During Construction</span>
                            <span className={colors.text}>60%</span>
                          </li>
                          <li className="flex justify-between text-sm">
                            <span className={colors.textSecondary}>On Completion</span>
                            <span className={colors.text}>20%</span>
                          </li>
                        </ul>
                      </div>

                      {/* Contact Info */}
                      <div className={`mt-6 pt-6 border-t ${colors.border}`}>
                        <h4 className={`text-sm font-semibold mb-3 ${colors.text}`}>Contact Agent</h4>
                        <div className="space-y-3">
                          <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border ${colors.border} ${
                            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          } transition-colors`}>
                            <Phone className="w-4 h-4" />
                            <span>Call Now</span>
                          </button>
                          <button className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border ${colors.border} ${
                            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"
                          } transition-colors`}>
                            <Mail className="w-4 h-4" />
                            <span>Email Agent</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(selectedProperty);
                        }}
                        className={`w-full ${colors.primary} text-white py-3 px-6 rounded-xl ${colors.primaryHover} transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                      >
                        <Calendar className="w-5 h-5" />
                        <span>Schedule Visit</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(selectedProperty);
                        }}
                        className={`w-full border-2 border-yellow-400 text-yellow-600 dark:text-yellow-400 py-3 px-6 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-300 font-semibold flex items-center justify-center gap-2`}
                      >
                        <IndianRupee className="w-5 h-5" />
                        <span>Book Now</span>
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className={`p-4 rounded-xl border ${colors.border} ${theme === "dark" ? "bg-gray-800/30" : "bg-gray-50"}`}>
                      <h4 className={`text-sm font-semibold mb-3 ${colors.text}`}>Additional Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${colors.textSecondary}`}>Property ID</span>
                          <span className={`text-xs font-medium ${colors.text}`}>{selectedProperty._id?.slice(-8) || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${colors.textSecondary}`}>Zip Code</span>
                          <span className={`text-xs font-medium ${colors.text}`}>{selectedProperty.zipcode || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs ${colors.textSecondary}`}>Listing Type</span>
                          <span className={`text-xs font-medium ${colors.text}`}>{selectedProperty.listingtype || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`sticky bottom-0 z-10 flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t ${colors.border} ${
                theme === "dark" ? "bg-gray-800/95" : "bg-white/95"
              } backdrop-blur-sm`}>
                <div className="mb-4 sm:mb-0">
                  <p className={`text-sm ${colors.textSecondary}`}>
                    Interested in this property? Contact us for more details
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className={`px-6 py-2 border rounded-xl transition ${
                      theme === "dark" 
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Close
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(selectedProperty);
                    }}
                    className={`px-6 py-2 ${colors.primary} text-white rounded-xl ${colors.primaryHover} transition shadow-lg hover:shadow-xl flex items-center gap-2`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
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