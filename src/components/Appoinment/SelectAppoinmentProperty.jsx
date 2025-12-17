import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Ruler, Bed, Bath, MapPin, IndianRupee, Home, Building2, Barcode, Wrench,
  Search, ArrowRight, X, ChevronDown
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";
import { AnimatePresence } from "framer-motion";
import { useLoading } from "../../model/LoadingModel";

// Utility to get unique options for filters
const getUniqueValues = (data, key) => {
  return [...new Set(data.map((item) => item[key]).filter(Boolean))];
};

const SelectAppointmentProperty = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    propertyname: "", price: "", bedroom: "", bathroom: "",
    squarefoot: "", floor: "", zipcode: "", propertytype: "",
    listingtype: "", state: "", city: "", aminities: "",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [expandedFilters, setExpandedFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const { theme } = useTheme();
  const navigate = useNavigate();
  const limit = 6;
  const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });

  const { propertyList, loading, pagination } = useGetAllProperty(currentPage, limit, filters);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  // Search handlers
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(false);
  };

  const handleSubmitSearch = () => {
    setFilters((prev) => ({ ...prev, city: searchQuery }));
    setCurrentPage(1);
  };

  // Navigation
  const handleBuyNow = (property) => {
    navigate("/createappoinment", { state: { property } });
  };

  // Modal handlers
  const openModal = (property) => setSelectedProperty(property);
  const closeModal = () => setSelectedProperty(null);

  // Theme styles
  const themeClasses = {
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      card: "bg-gray-700",
      input: "bg-gray-600 text-white placeholder-gray-400",
      border: "border-gray-600",
      button: "bg-blue-600 hover:bg-blue-700",
      modal: "bg-gray-700 text-white",
      paginationDisabled: "bg-gray-700 text-gray-500 cursor-not-allowed",
      paginationHover: "hover:bg-gray-700",
      paginationActive: "bg-blue-500 text-white",
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      card: "bg-white",
      input: "bg-white text-gray-800 placeholder-gray-500",
      border: "border-gray-300",
      button: "bg-blue-600 hover:bg-blue-700",
      modal: "bg-white text-gray-800",
      paginationDisabled: "bg-gray-200 text-gray-400 cursor-not-allowed",
      paginationHover: "hover:bg-gray-100",
      paginationActive: "bg-blue-500 text-white",
    },
  };
  const currentTheme = themeClasses[theme] || themeClasses.light;

  // Filter options
  const filterOptions = [
    {
      name: "state",
      label: "Location",
      icon: <MapPin size={16} className="text-red-500" />,
    },
    {
      name: "listingtype",
      label: "Category",
      icon: <Barcode size={16} className="text-green-500" />,
    },
    {
      name: "propertytype",
      label: "Property Type",
      icon: <Home size={16} className="text-blue-500" />,
    },
    {
      name: "price",
      label: "Price",
      icon: <IndianRupee size={16} className="text-yellow-500" />,
    },
    {
      name: "squarefoot",
      label: "Area (sq ft)",
      icon: <Ruler size={16} className="text-purple-500" />,
    },
    {
      name: "bedroom",
      label: "Bedrooms",
      icon: <Bed size={16} className="text-pink-500" />,
    },
    {
      name: "bathroom",
      label: "Bathrooms",
      icon: <Bath size={16} className="text-indigo-500" />,
    },
    {
      name: "floor",
      label: "Floor",
      icon: <Building2 size={16} className="text-gray-500" />,
    },
    {
      name: "city",
      label: "City",
      icon: <MapPin size={16} className="text-orange-500" />,
    },
    {
      name: "aminities",
      label: "Amenities",
      icon: <Wrench size={16} className="text-lime-500" />,
    },
  ];

  return (
    <div className={`w-full py-8 ${currentTheme.bg} transition-colors duration-300`}>
      
      {/* Header & Search */}
      <div className="max-w-7xl mx-auto px-4  mt-10  lg:mt-14 md:mt-12 mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${currentTheme.text} text-center`}>
          Select Property for Appointment
        </h1>
        <p className={`text-center ${currentTheme.text} opacity-80`}>
          Find your perfect property and schedule a viewing
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Search by ID, name, email, or status..."
          value={searchQuery}
          onChange={handleSearch}
          className={`w-full md:flex-1 p-3 rounded-lg ${currentTheme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          onClick={handleSubmitSearch}
          className={`px-4 py-3 rounded-lg ${currentTheme.button} font-semibold`}
        >
          Search
        </button>
      </div>

      {/* Show/Hide Filters Button */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <button
          onClick={() => setExpandedFilters(!expandedFilters)}
          className={`flex items-center gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
        >
          <ChevronDown
            className={`transition-transform duration-300 ${expandedFilters ? 'rotate-180' : ''}`}
            size={18}
          />
          {expandedFilters ? "Hide Filters" : "Show All Filters"}
        </button>
      </div>

      {/* Filters Section */}
      <div
        className={`max-w-7xl mx-auto px-4 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-300 ${
          expandedFilters ? 'opacity-100' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        {filterOptions.map(({ name, label, icon }) => {
          const options = getUniqueValues(propertyList, name);
          return (
            <div key={name} className="relative rounded-lg p-3 shadow hover:shadow-lg transition-shadow duration-200">
              <label className={`absolute -top-2 left-3 px-2 text-xs ${currentTheme.text}`}>
                {label}
              </label>
              <select
                name={name}
                value={filters[name] || ""}
                onChange={handleFilterChange}
                className={`w-full p-3 rounded-lg ${currentTheme.border} ${currentTheme.input} appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8`}
              >
                <option value="">All {label}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {name === "price" ? `₹${opt}` : opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>
            </div>
          );
        })}
      </div>


      {loading ? (
          <LoadingModel loading={true} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {propertyList.map((property) => (
            <motion.div
              key={property.id}
              className={`${currentTheme.card} rounded-2xl shadow-xl overflow-hidden relative transition-transform hover:scale-105`}
              whileHover={{ y: -5 }}
            >
              {/* Image Carousel */}
              <div
                className="relative cursor-pointer"
                onClick={() => openModal(property)}
              >
                <Swiper
                  spaceBetween={10}
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000 }}
                  loop
                  modules={[Autoplay, Pagination]}
                  className="w-full h-48"
                >
                  {property.image?.map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={img} alt="Property" className="w-full h-48 object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className= {` text-lg font-semibold">View Details ${currentTheme.text}` }></span>
                </div>
              </div>
              
              {/* Property Info */}
              <div className="p-4 space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-red-400 bg-clip-text text-transparent">
                  {property.propertyname}
                </h2>
                <div className={`flex justify-between items-center text-sm ${currentTheme.text}`}>
                  <div className="flex items-center gap-1">
                    <Home size={16} /> {property.propertytype}
                  </div>
                  <div className="flex items-center gap-1 font-semibold">
                    <IndianRupee size={16} /> {property.price}
                  </div>
                </div>
                   <div className={`flex justify-between items-center text-sm ${currentTheme.text}`}>

                  <div className="flex items-center gap-1">
                    <MapPin size={16} /> {property.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin size={16} /> {property.city}
                  </div>
                </div>
                      <div className={`flex justify-between items-center text-sm ${currentTheme.text}`}>

                  <div className="flex items-center gap-1">
                    <Bed size={16} /> {property.bedroom} Beds
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath size={16} /> {property.bathroom} Baths
                  </div>
                  <div className="flex items-center gap-1">
                    <Ruler size={16} /> {property.squarefoot} sqft
                  </div>
                </div>
                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(property);
                  }}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-semibold"
                >
                  Select Property <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for property details */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={`max-w-4xl w-full  ${currentTheme.bg} rounded-xl p-6 overflow-y-auto max-h-[90vh] relative shadow-2xl`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className={`absolute top-4 right-4 text-xl ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <X />
              </button>
              
              {/* Property Details Header */}
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-red-400 bg-clip-text text-transparent">{selectedProperty.propertyname}</h2>
              
              {/* Image Carousel */}
              <Swiper
                spaceBetween={10}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                modules={[Autoplay, Pagination]}
                className="w-full h-64 mb-6 rounded-lg"
              >
                {selectedProperty.image?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt={`Slide ${i}`} className="w-full h-64 object-cover rounded-lg" />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Property Info */}
              <div className={`p-4 rounded-xl shadow-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-50'}`}>
                {/* Price & Type */}
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-2 font-bold text-lg text-red-600">
                    <IndianRupee size={20} /> {selectedProperty.price}
                  </span>
                  <div className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {selectedProperty.listingtype}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Home className="text-blue-500" size={18} />
                    <span>{selectedProperty.propertytype}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-blue-500" size={18} />
                    <span>
                      {selectedProperty.city}, {selectedProperty.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="text-blue-500" size={18} />
                    <span>{selectedProperty.bedroom} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="text-blue-500" size={18} />
                    <span>{selectedProperty.bathroom} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="text-blue-500" size={18} />
                    <span>{selectedProperty.squarefoot} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="text-blue-500" size={18} />
                    <span>Floor {selectedProperty.floor}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p>{selectedProperty.address}</p>
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

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(selectedProperty);
                    closeModal();
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white py-3 rounded-lg flex justify-center items-center gap-2 font-semibold"
                >
                  Select This Property
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between mt-8 space-y-4 md:space-y-0">
          <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * limit, pagination.totalCount)}</span> of{" "}
            <span className="font-medium">{pagination.totalCount}</span> results
          </div>
          
          {/* Pagination Controls */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md ${currentPage === 1 ? currentTheme.paginationDisabled : currentTheme.paginationHover}`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
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
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 border rounded-md ${currentPage === pageNum ? currentTheme.paginationActive : currentTheme.paginationHover}`}
                >
                  {pageNum}
                </button>
              );
            })}
            {pagination.totalPages > 5 && (
              <span className="px-4 py-2">...</span>
            )}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 border rounded-md ${currentPage === pagination.totalPages ? currentTheme.paginationDisabled : currentTheme.paginationHover}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectAppointmentProperty;