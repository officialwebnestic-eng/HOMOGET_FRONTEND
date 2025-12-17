import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Search, MapPin, Home, IndianRupee, ArrowRight,
  Bed, Bath, Ruler, Building2, Wrench, X,
  Barcode,
  HomeIcon
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

  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();
  const limit = 6;

  const { propertyList, loading } = useGetAllProperty(currentPage, limit, filters);

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

  const handleSubmit = (location = searchQuery) => {
    setFilters(prev => ({ ...prev, city: location }));
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  const closeModal = () => setSelectedProperty(null);
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

  return (
    <div className={colors.background} >
<div className={colors.background}>
  {/* Hero Section - Responsive Layout */}
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col lg:flex-row items-center justify-center`}>
    {/* Content and Image Container */}
    <div className="flex-1 flex flex-col-reverse lg:flex-row items-center lg:items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 py-8 w-full">
      
{/* Left Side - Text Content */}
<div className="w-full lg:w-1/2 px-4">
  {/* Heading */}
  <div className="flex items-start gap-3 mb-6">
    <HomeIcon className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-yellow-400 dark:text-pink-500 flex-shrink-0" />
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
      <RadialGradient
        gradient={["circle, rgba(251,191,36,1) 0%, rgba(244,63,94,1) 100%"]}
      >
        Find Your Property in Your Preferred City
      </RadialGradient>
      <br />
      <span
        className={`block mt-1 ${
          theme === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        Living Space
      </span>
    </h1>
  </div>

  {/* Description */}
  <p
    className={`text-sm sm:text-base md:text-lg leading-relaxed mb-6 max-w-lg ${
      colors.textSecondary
    }`}
  >
    Discover your dream home in the most sought-after locations with premium
    amenities and modern designs.
  </p>

  {/* Search Bar */}
  <div className="relative search-container mb-4">
    <div
      className={`flex flex-col sm:flex-row gap-3 p-2 ${
        theme === "dark" ? "bg-gray-800/90" : "bg-white/90"
      } backdrop-blur-md rounded-2xl shadow-lg border ${colors.border}`}
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search by city or state"
          className={`w-full pl-11 pr-4 py-3 rounded-xl border-0 text-sm sm:text-base ${
            theme === "dark"
              ? "bg-gray-700 text-white placeholder-gray-400"
              : "bg-white text-gray-800 placeholder-gray-500"
          } focus:ring-2 focus:ring-blue-500 transition-all`}
        />
      </div>
      {/* Search Button */}
      <button
        onClick={() => handleSubmit()}
        className={`sm:w-auto w-full ${colors.primary} text-white px-4 sm:px-6 py-3 rounded-xl ${colors.primaryHover} transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg hover:scale-105`}
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
          className={`absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto ${
            theme === "dark" ? "bg-gray-900/95" : "bg-white/95"
          } backdrop-blur-md rounded-xl shadow-2xl divide-y ${
            theme === "dark" ? "divide-gray-700" : "divide-gray-100"
          } z-50 border ${colors.border}`}
        >
          <div className="p-3">
            <h3
              className={`text-xs font-semibold uppercase tracking-wide px-3 mb-2 ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Popular Locations
            </h3>
            {propertyList.slice(0, 5).map((location, index) => (
              <motion.button
                key={`${location.city}-${location.state}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => {
                  setSearchQuery(`${location.city}, ${location.state}`);
                  setFilters((prev) => ({
                    ...prev,
                    city: location.city,
                    state: location.state,
                  }));
                  setShowSuggestions(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${
                  theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-50"
                } transition-colors group`}
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" />
                  <span>{location.city}, {location.state}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</div>


      {/* Right Side - Hero Image */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-4">
        <AnimatedContainer distance={80} direction="horizontal">
          <div className=" w-full max-w-lg h-[30vh] mb-10 mt-10 lg:h-full flex justify-center items-center">
            {/* Main Image Container */}
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={homenew}
                alt="Dream Property"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

           {/* Floating Property Card */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.6 }}
  className={`hidden sm:block absolute bottom-6 left-4 right-4 lg:left-6 lg:right-6 ${
    theme === "dark" ? "bg-gray-900/90" : "bg-white/90"
  } backdrop-blur-md rounded-2xl p-4 shadow-xl border ${colors.border}`}
>
  {/* Property Info */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
    <div>
      <h3 className={`font-bold text-xl md:text-2xl ${colors.text}`}>Luxury Villa</h3>
      <p className={`${colors.textSecondary} text-sm flex items-center`}>
        <MapPin className="w-4 h-4 mr-1" />
        Mumbai, Maharashtra
      </p>
    </div>
    <div className="text-right">
      <div className={`font-bold text-lg md:text-xl ${colors.text} flex items-center`}>
        <IndianRupee className="w-5 h-5" />
        2.5Cr
      </div>
      <div className={`text-sm ${colors.textSecondary}`}>₹5,000/sq ft</div>
    </div>
  </div>

  {/* Property Stats */}
  <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
    <span className={`flex items-center text-sm ${colors.textSecondary}`}>
      <Bed className="w-4 h-4 mr-1" /> 4 Beds
    </span>
    <span className={`flex items-center text-sm ${colors.textSecondary}`}>
      <Bath className="w-4 h-4 mr-1" /> 3 Baths
    </span>
    <span className={`flex items-center text-sm ${colors.textSecondary}`}>
      <Ruler className="w-4 h-4 mr-1" /> 2500 sqft
    </span>
  </div>
</motion.div>

            </div>

            {/* Decorative elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`absolute -top-4 -right-4 w-12 h-12 ${colors.primary} rounded-full blur-lg opacity-70`}
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className={`absolute -bottom-4 -left-4 w-8 h-8 ${colors.secondary} rounded-full blur-sm opacity-60`}
            ></motion.div>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  </div>
</div>














      

      {/* Property Listing Section */}
      <div className="w-full py-4 px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-center text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 ${colors.text}`}>
            Find Your Dream Property with Garden House
          </h2>
          <p className={`text-center ${colors.textSecondary} max-w-2xl mx-auto mb-12`}>
            Browse through our curated collection of premium properties across different locations and price ranges
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12"
        >
          {filterFields.map(({ name, label, icon }) => {
            const options = getUniqueValues(propertyList, name);
            return (
              <div key={name} className="relative w-full">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  {React.cloneElement(icon, { className: "w-4 h-4 text-gray-400" })}
                </div>
                <select
                  className={`w-full pl-10 pr-8 py-2 sm:py-3 rounded-xl border ${
                    theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-800"
                  } appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all`}
                  name={name}
                  value={filters[name] || ""}
                  onChange={handleFilterChange}
                >
                  <option value="">{label}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {name === "price" ? `₹${opt.toLocaleString()}` : opt}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Property Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === "dark" ? "border-indigo-500" : "border-blue-500"}`}></div>
          </div>
        ) : propertyList.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="w-64 h-64 mb-6">
              <img
                src="https://cdn3d.iconscout.com/3d/premium/thumb/no-house-found-5665724-4721949.png"
                alt="No properties found"
                className="w-full h-full object-contain animate-pulse"
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
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              Reset All Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {propertyList.map((property, index) => (
              <motion.div
                key={property._id || index}
                className={`rounded-2xl overflow-hidden shadow-lg ${colors.card} hover:shadow-2xl transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                {/* Property Image Carousel */}
                <div
                  className="relative h-64 cursor-pointer group overflow-hidden"
                  onClick={() => openModal(property)}
                >
                  <Swiper
                    modules={[Autoplay, Pagination]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    className="h-full w-full"
                    loop
                  >
                    {property.image?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img
                          src={img}
                          alt={`Property ${i}`}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <p className="text-white text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            View Details
                          </p>
                        </div>
                        <div className={`absolute top-2 right-2 ${theme === "dark" ? "bg-indigo-600" : "bg-blue-600"} text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                          {property.propertytype || "Property"}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  {/* Overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">{property.propertyname}</h3>
                    <p className="flex items-center text-gray-200 text-sm">
                      <MapPin className="w-4 h-4 mr-1" /> {property.city}, {property.state}
                    </p>
                  </div>
                  {/* Price Badge */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg text-sm font-semibold text-gray-800 flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" /> {property.price.toLocaleString()}
                  </div>
                </div>
                {/* Property Details */}
                <div className="p-4">
                  {/* Stats header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800"}`}>
                      {property.listingtype || "For Sale"}
                    </span>
                    <div className="flex space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Bed className="w-4 h-4" /> <span>{property.bedroom}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bath className="w-4 h-4" /> <span>{property.bathroom}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Ruler className="w-4 h-4" /> <span>{property.squarefoot}</span>
                      </div>
                    </div>
                  </div>
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.aminities &&
                      Array.isArray(property.aminities) &&
                      property.aminities.slice(0, 3).map((item, index) => {
                        try {
                          const parsed = JSON.parse(item);
                          const list = Array.isArray(parsed) ? parsed : [parsed];
                          return list.slice(0, 1).map((val, i) => (
                            <span
                              key={`${index}-${i}`}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                theme === "dark" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {val}
                            </span>
                          ));
                        } catch {
                          return (
                            <span
                              key={index}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                theme === "dark" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item}
                            </span>
                          );
                        }
                      })}
                    {property.aminities && property.aminities.length > 3 && (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.textSecondary}`}>
                        +{property.aminities.length - 3} more
                      </span>
                    )}
                  </div>
                  {/* Book Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(property);
                    }}
                    className={`w-full mt-4 ${colors.primary} text-white py-3 rounded-xl ${colors.primaryHover} transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Browse All Button */}
      <div className="pb-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <NavLink to="/propertylisting">
            <button
              className={`px-10 mt-10 sm:px-12 py-4 ${colors.primary} text-white font-semibold rounded-2xl transition-shadow shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto`}
            >
              <span>Browse Our All Property</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </NavLink>
        </motion.div>
      </div>

      {/* Property Modal - Responsive */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className={`max-w-7xl w-full ${colors.modal} rounded-3xl shadow-2xl overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} flex items-center justify-center transition-colors z-10`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Images Section */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Main Image */}
                  <div className="relative h-64 md:h-96 w-full bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={
                        selectedProperty.image?.[0] ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                      }
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  {/* Thumbnails */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-50"}`}>
                    {selectedProperty.image && selectedProperty.image.length > 0 ? (
                      selectedProperty.image.slice(0, 4).map((imgSrc, index) => (
                        <div key={index} className="relative h-20 overflow-hidden rounded-lg shadow-sm hover:scale-105 transform transition-transform duration-200 cursor-pointer">
                          <img src={imgSrc} alt={`Property Image ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors duration-200"></div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center text-gray-400 py-4">No images available</div>
                    )}
                  </div>
                  {/* Title & Location */}
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.text}`}>{selectedProperty.propertyname || "Luxury Property"}</h2>
                        <p className={`font-medium ${colors.textSecondary} text-sm flex items-center`}>
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedProperty.address || "N/A"}, {selectedProperty.city || "City"}, {selectedProperty.state || "State"}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedProperty.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {selectedProperty.status || "Available"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Sidebar - Details */}
                <div className="space-y-6">
                  {/* Price */}
                  <div className={`p-6 rounded-2xl shadow-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100"}`}>
                    <div className={`text-3xl md:text-4xl font-bold mb-2 ${colors.text}`}>
                      ₹{new Intl.NumberFormat('en-IN').format(selectedProperty.price) || "Price on request"}
                    </div>
                    {selectedProperty.pricePerSqft && (
                      <div className={`text-sm ${colors.textSecondary}`}>₹{selectedProperty.pricePerSqft} per sq.ft</div>
                    )}
                  </div>
                  {/* Property Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl text-center border ${theme === "dark" ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200"} shadow-sm`}>
                      <Bed className={`w-6 h-6 mx-auto mb-2 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                      <div className={`text-xl font-bold ${colors.text}`}>{selectedProperty.bedroom || "0"}</div>
                      <div className={`text-sm ${colors.textSecondary}`}>Beds</div>
                    </div>
                    <div className={`p-4 rounded-xl text-center border ${theme === "dark" ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200"} shadow-sm`}>
                      <Bath className={`w-6 h-6 mx-auto mb-2 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                      <div className={`text-xl font-bold ${colors.text}`}>{selectedProperty.bathroom || "0"}</div>
                      <div className={`text-sm ${colors.textSecondary}`}>Baths</div>
                    </div>
                    <div className={`p-4 rounded-xl text-center border ${theme === "dark" ? "bg-gray-700/50 border-gray-600" : "bg-white border-gray-200"} shadow-sm`}>
                      <Ruler className={`w-6 h-6 mx-auto mb-2 ${theme === "dark" ? "text-indigo-400" : "text-blue-500"}`} />
                      <div className={`text-xl font-bold ${colors.text}`}>{selectedProperty.squarefoot || "0"}</div>
                      <div className={`text-sm ${colors.textSecondary}`}>Sq.ft</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-3 ${colors.text}`}>Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.aminities &&
                        Array.isArray(selectedProperty.aminities) &&
                        selectedProperty.aminities.slice(0, 3).map((item, index) => {
                          try {
                            const parsed = JSON.parse(item);
                            const list = Array.isArray(parsed) ? parsed : [parsed];
                            return list.map((val, i) => (
                              <span
                                key={`${index}-${i}`}
                                className={`text-xs font-medium px-3 py-1 rounded-full ${
                                  theme === "dark" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {val}
                              </span>
                            ));
                          } catch {
                            return (
                              <span
                                key={index}
                                className={`text-xs font-medium px-3 py-1 rounded-full ${
                                  theme === "dark" ? "bg-indigo-100 text-indigo-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {item}
                              </span>
                            );
                          }
                        })}
                    </div>
                  </div>
                  {/* Schedule Visit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(selectedProperty);
                    }}
                    className={`w-full mt-4 ${colors.primary} text-white py-3 rounded-xl ${colors.primaryHover} transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                  >
                    <span>Schedule Visit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Description */}
              {selectedProperty.description && (
                <div className="px-6 pb-4">
                  <h3 className={`text-lg font-semibold mb-3 ${colors.text}`}>Description</h3>
                  <p className={`${colors.textSecondary} leading-relaxed`}>
                    {selectedProperty.description}
                  </p>
                </div>
              )}

              {/* Footer actions */}
              <div className={`sticky bottom-0 z-10 flex justify-between items-center px-4 sm:px-6 py-4 border-t ${theme === "dark" ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"}`}>
                <button
                  onClick={closeModal}
                  className={`px-4 sm:px-6 py-2 sm:py-3 border rounded-xl transition ${theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(selectedProperty);
                  }}
                  className={`px-6 sm:px-8 py-2 sm:py-3 ${colors.primary} text-white rounded-xl ${colors.primaryHover} transition shadow-lg hover:shadow-xl flex items-center gap-2`}
                >
                  <span>Schedule Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Agentfilter;