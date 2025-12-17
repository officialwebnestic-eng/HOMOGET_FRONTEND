import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Home, IndianRupee, ArrowRight,
  Bed, Bath, Ruler, Building2, Wrench, X,
  ChevronLeft, ChevronRight,
  Barcode
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";

import { propertiesListingImage } from "../../ExportImages";
import { animated, useSpring } from "@react-spring/web";

// Color Theme System
const themeColors = {
  light: {
    primary: "bg-gradient-to-r from-gray-500 to-gray-800",
    primaryHover: "hover:from-cyan-600 hover:to-blue-700",
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
    shadowOverlay: "shadow-[inset_0_-15px_30px_-10px_rgba(14,165,233,0.2)]",
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300",
    },
    pagination: {
      active: "bg-blue-600 text-white",
      inactive: "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
    },
    textColors: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      tertiary: "text-gray-500"
    }
  },
  dark: {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600",
    primaryHover: "hover:from-indigo-700 hover:to-purple-700",
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
    shadowOverlay: "shadow-[inset_0_-20px_40px_ -15px_rgba(124,58,237,0.3)]",
    button: {
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      secondary: "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600",
    },
    pagination: {
      active: "bg-indigo-600 text-white",
      inactive: "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
    },
    textColors: {
      primary: "text-gray-100",
      secondary: "text-gray-300",
      tertiary: "text-gray-400"
    }
  }
};

// Utility function for unique values
const getUniqueValues = (data, key) => {
  return [...new Set(data.map((item) => item[key]).filter(Boolean))].sort();
};

// Animated container for entrance animations
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

const PropertyListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    propertyname: "", price: "", bedroom: "", bathroom: "",
    squarefoot: "", floor: "", zipcode: "", propertytype: "",
    listingtype: "", state: "", city: "", aminities: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { theme } = useTheme();
  const colors = themeColors[theme];
  const currentTheme = themeColors[theme];
  const navigate = useNavigate();
  const limit = 6;

  const { propertyList, pagination, loading } = useGetAllProperty(currentPage, limit, filters);

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
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleBuyNow = (property) => {
    navigate("/bookings", { state: { property } });
  };

  const handleSubmit = (location = searchQuery) => {
    setFilters(prev => ({ ...prev, city: location }));
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  const closeModal = () => setSelectedProperty(null);
  const openModal = (property) => setSelectedProperty(property);

  // Click outside for suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSuggestions && !e.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSuggestions]);

  // Pagination range
  const getPaginationRange = () => {
    const totalPages = pagination?.totalPages || 1;
    const current = currentPage;
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) {
      range.unshift('...');
    }
    if (current + delta < totalPages - 1) {
      range.push('...');
    }
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    return range;
  };

  return (
    <div className={colors.background}>
      {/* Hero Section with background image */}
      <AnimatedContainer distance={50} direction="vertical">
        <div className="relative min-h-screen flex flex-col justify-center items-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0 rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${propertiesListingImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className={`${colors.gradientOverlay} backdrop-blur-[1px] ${colors.shadowOverlay}`} />
          </motion.div>

          {/* Search Box */}
          <div className="relative z-10 max-w-7xl w-full mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="max-w-2xl mx-auto search-container"
            >
              <div className={`flex flex-col md:flex-row gap-4 p-2 ${theme === "dark" ? "bg-gray-700/90" : "bg-white/90"} backdrop-blur-md rounded-2xl shadow-lg border ${colors.border}`}>
                {/* Search Input */}
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search by city or state"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-0 ${theme === "dark" ? "bg-gray-700/90 text-white" : "bg-white/90 text-gray-800"} focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>
                {/* Search Button */}
                <button
                  onClick={() => handleSubmit()}
                  className={`w-full md:w-auto ${colors.primary} text-white px-6 py-3 rounded-xl ${colors.primaryHover} flex items-center justify-center gap-2 font-medium shadow-md`}
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && propertyList.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute left-0 right-0 mt-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-xl shadow-xl divide-y ${theme === "dark" ? "divide-gray-700" : "divide-gray-100"} overflow-hidden z-20 border ${colors.border}`}
                  >
                    <div className="p-2">
                      <h3 className={`text-xs font-medium px-3 mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        Popular Locations
                      </h3>
                      {propertyList.slice(0, 5).map((location, index) => (
                        <motion.button
                          key={`${location.city}-${location.state}-${index}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          onClick={() => {
                            setSearchQuery(`${location.city}, ${location.state}`);
                            setFilters(prev => ({
                              ...prev,
                              city: location.city,
                              state: location.state
                            }));
                            setShowSuggestions(false);
                          }}
                          className={`w-full text-left px-3 py-2 ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"} rounded-lg flex items-center justify-between ${theme === "dark" ? "text-gray-300" : "text-gray-700"} transition-colors`}
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{location.city}, {location.state}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </AnimatedContainer>

      {/* Property Listing Section */}
      <div className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className={`text-center text-3xl font-bold mb-12 ${colors.text}`}>
          Find Your Dream Property with abichal
        </h1>

        {/* Filters with horizontal scroll on small screens */}
        <div className="overflow-x-auto w-full mb-8">
          <div className="flex gap-4 min-w-max px-2">
            {filterFields.map(({ name, label, icon }) => {
              const options = getUniqueValues(propertyList, name);
              return (
                <div key={name} className="relative min-w-[150px] flex-shrink-0">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {React.cloneElement(icon, { className: "w-4 h-4 text-gray-400" })}
                  </div>
                  <select
                    name={name}
                    value={filters[name] || ""}
                    onChange={handleFilterChange}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"} appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">{label}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>
                        {name === "price" ? `₹${opt.toLocaleString()}` : opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Property Grid with responsiveness */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === "dark" ? "border-indigo-500" : "border-blue-500"}`}></div>
          </div>
        ) : propertyList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-64 h-64 mb-6">
              <img
                src="https://cdn3d.iconscout.com/3d/premium/thumb/no-house-found-5665724-4721949.png"
                alt="No properties found"
                className="w-full h-full object-contain animate-float"
              />
            </div>
            <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              No properties found matching your criteria
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your search filters or browse our featured properties
            </p>
            <button
              onClick={() => {
                setFilters({
                  propertyname: "", price: "", bedroom: "", bathroom: "",
                  squarefoot: "", floor: "", zipcode: "", propertytype: "",
                  listingtype: "", state: "", city: "", aminities: "",
                });
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Property Cards - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {propertyList.map((property, index) => (
                <motion.div
                  key={property._id || index}
                  className={`rounded-2xl overflow-hidden shadow-lg ${colors.card}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {/* Image Carousel */}
                  <div
                    className="relative h-64 cursor-pointer group"
                    onClick={() => openModal(property)}
                  >
                    <Swiper
                      modules={[Autoplay, Pagination]}
                      autoplay={{ delay: 3000 }}
                      pagination={{ clickable: true }}
                      className="h-full w-full"
                    >
                      {property.image?.map((img, i) => (
                        <SwiperSlide key={i}>
                          <img
                            src={img}
                            alt={`Property ${i}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <p className="text-white text-lg font-semibold">View Details</p>
                          </div>
                          <div className={`absolute top-4 right-4 ${theme === "dark" ? "bg-indigo-600" : "bg-blue-600"} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
                            {property.propertytype || "Property"}
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* Property info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{property.propertyname}</h3>
                      <p className="flex items-center text-gray-200">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.city}, {property.state}
                      </p>
                    </div>
                    {/* Price badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <p className="text-sm font-semibold text-gray-800 flex items-center">
                        <IndianRupee className="w-4 h-4 mr-1" />
                        {property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    {/* Name and status */}
                    <div className="flex justify-between items-center mb-4 flex-wrap md:flex-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                        {property.propertyname}
                      </span>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <span className={`flex items-center text-sm ${colors.textSecondary}`}>
                          <Bed className="w-4 h-4 mr-1" /> {property.bedroom}
                        </span>
                        <span className={`flex items-center text-sm ${colors.textSecondary}`}>
                          <Bath className="w-4 h-4 mr-1" /> {property.bathroom}
                        </span>
                        <span className={`flex items-center text-sm ${colors.textSecondary}`}>
                          <Ruler className="w-4 h-4 mr-1" /> {property.squarefoot} sqft
                        </span>
                      </div>
                    </div>
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.aminities &&
                        Array.isArray(property.aminities) &&
                        property.aminities.map((item, index) => {
                          try {
                            const parsed = JSON.parse(item);
                            const list = Array.isArray(parsed) ? parsed : [parsed];
                            return list.map((val, i) => (
                              <span key={`${index}-${i}`} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {val}
                              </span>
                            ));
                          } catch {
                            return (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {item}
                              </span>
                            );
                          }
                        })}
                    </div>
                    {/* Book Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleBuyNow(property); }}
                      className={`w-full mt-4 ${colors.primary} text-white py-2 rounded-lg ${colors.primaryHover} transition-colors font-medium`}
                    >
                      Book Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className={`mt-12 px-4 md:px-6 py-3 border-t ${colors.border} flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`text-sm ${currentTheme.textColors.tertiary}`}>
                  Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * limit, pagination.totalItems)}</span> of{' '}
                  <span className="font-medium">{pagination.totalItems}</span> results
                </div>

                {/* Pagination controls */}
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition-colors ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <div className="flex items-center gap-1 flex-wrap">
                    {getPaginationRange().map((page, index) => (
                      page === '...' ? (
                        <span key={index} className="px-3 py-1 text-gray-500">...</span>
                      ) : (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition-colors ${
                            currentPage === page ? currentTheme.pagination.active : currentTheme.pagination.inactive
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition-colors ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Property Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity duration-300">
          <div
            className={`${colors.modal} rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-xl transform transition-all duration-300 scale-95 animate-fadeIn`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl transition transform hover:scale-110"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-4 p-6">
              {/* Left: Images */}
              <div className="lg:col-span-2 space-y-4">
                {/* Main Image */}
                <div className="relative h-96 w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={
                      selectedProperty.image?.[0] ||
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                    }
                    alt="Property"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {/* Photos count badge */}
                  <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-md">
                    {selectedProperty.images?.length || 0} Photos
                  </div>
                </div>

                {/* Thumbnails - scroll horizontally on small screens */}
                <div className="overflow-x-auto w-full">
                  <div className="flex gap-2 min-w-max px-2">
                    {selectedProperty.image?.map((imgSrc, index) => (
                      <div key={index} className="relative h-24 md:h-28 flex-shrink-0 overflow-hidden rounded-lg shadow-sm hover:scale-105 transition-transform duration-200">
                        <img src={imgSrc} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors duration-200"></div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Property Title & Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-1 text-gray-900">{selectedProperty.propertyname || "Luxury Property"}</h2>
                    <p className={`font-medium mb-2 ${theme === "dark" ? "text-indigo-400" : "text-blue-600"}`}>
                      {selectedProperty.propertytype || "Villa"}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedProperty.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {selectedProperty.status || "Available"}
                  </span>
                </div>
              </div>

              {/* Right: Details */}
              <div className={`p-6 bg-white rounded-2xl shadow-md border ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                {/* Address & Price */}
                <div className="mb-6 flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>
                      {selectedProperty.address || "N/A"}, {selectedProperty.city || "City"}, {selectedProperty.state || "State"} {selectedProperty.zipcode || ""}
                    </span>
                  </div>
                </div>

                {/* Price & per sqft */}
                <div className={`bg-gradient-to-r ${theme === "dark" ? "from-indigo-900/50 to-purple-900/50" : "from-blue-50 to-blue-100"} p-4 rounded-xl mb-6 shadow-inner`}>
                  <div className="text-3xl md:text-4xl font-bold mb-1 text-gray-900">
                    ₹{new Intl.NumberFormat('en-IN').format(selectedProperty.price) || "Price on request"}
                  </div>
                  {selectedProperty.pricePerSqft && (
                    <div className="text-sm text-gray-600">
                      ₹{selectedProperty.pricePerSqft} per sq.ft
                    </div>
                  )}
                </div>

                {/* Stats: Beds, Baths, Area */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Beds */}
                  <div className={`p-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
                    <div className="text-sm mb-1 text-gray-500">Beds</div>
                    <div className="flex items-center justify-center text-xl font-semibold text-gray-900">
                      <svg className="w-5 h-5 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      {selectedProperty.bedroom || "0"}
                    </div>
                  </div>
                  {/* Baths */}
                  <div className={`p-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
                    <div className="text-sm mb-1 text-gray-500">Baths</div>
                    <div className="flex items-center justify-center text-xl font-semibold text-gray-900">
                      <svg className="w-5 h-5 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {selectedProperty.bathroom || "0"}
                    </div>
                  </div>
                  {/* Area */}
                  <div className={`p-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
                    <div className="text-sm mb-1 text-gray-500">Area</div>
                    <div className="flex items-center justify-center text-xl font-semibold text-gray-900">
                      <svg className="w-5 h-5 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 010-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                      {selectedProperty.squareFeet || "0"} sqft
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProperty.aminities &&
                    Array.isArray(selectedProperty.aminities) &&
                    selectedProperty.aminities.map((item, index) => {
                      try {
                        const parsed = JSON.parse(item);
                        const list = Array.isArray(parsed) ? parsed : [parsed];

                        return list.map((val, i) => (
                          <span
                            key={`${index}-${i}`}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {val}
                          </span>
                        ));
                      } catch {
                        return (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                          >
                            {item}
                          </span>
                        );
                      }
                    })}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProperty.description || "This property offers..."}</p>
                </div>
              </div>
            </div>

            {/* Agent Details */}
            <div className="grid lg:grid-cols-2 gap-4 p-6 mt-8 border-t border-gray-300">
              {/* Agent Info */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl shadow-md border border-gray-200">
                <div className="relative">
                  <img
                    src={selectedProperty.agentImage || "https://randomuser.me/api/portraits/men/42.jpg"}
                    alt="Agent"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${selectedProperty.agentId?.status === "Active" ? "bg-green-400" : "bg-red-500"}`}
                  ></span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{selectedProperty.agentId?.agentName || "John Doe"}</h4>
                  <p className="text-sm text-gray-600">{selectedProperty.agentId?.role || "Property Agent"}</p>
                  {/* Contact options */}
                  <div className="mt-2 flex space-x-3 flex-wrap">
                    {/* Phone */}
                    <a
                      href={`tel:${selectedProperty.agent?.phone || '+911234567890'}`}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </a>
                    {/* Email */}
                    <a
                      href={`mailto:${selectedProperty.agentId?.email || 'agent@example.com'}`}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky footer action buttons */}
            <div className={`sticky bottom-0 z-10 flex justify-between items-center px-6 py-4 ${theme === "dark" ? "bg-gray-800 border-t border-gray-700" : "bg-white border-t border-gray-200"}`}>
              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 border rounded-lg transition ${theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  Close
                </button>
                <button className={`px-4 py-2 ${colors.primary} text-white rounded-lg hover:${colors.primaryHover} transition`}>
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyListing;