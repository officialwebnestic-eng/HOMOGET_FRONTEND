import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Home, IndianRupee, 
  Bed, Bath, Ruler, Building2, Wrench, X,
  Barcode, Phone, Mail, Calendar, Sparkles, ChevronRight
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { useTheme } from "../../context/ThemeContext";
import useGetAllProperty from "../../hooks/useGetAllProperty";
import { propertiesListingImage } from "../../ExportImages";
import AgentHero from "./homecommon/AgentHero";
import PropertyListingSection from "./homecommon/PropertyListingSection";

const PropertyListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTab, setSelectedTab] = useState("buy");
  const [showFilters, setShowFilters] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const limit = 6;
  const listRef = useRef(null); // For scrolling to results

  const { propertyList, pagination, loading } = useGetAllProperty(currentPage, limit, filters);

  const filterFields = [
    { name: "city", label: "City", icon: <MapPin size={16} /> },
    { name: "propertytype", label: "Type", icon: <Home size={16} /> },
    { name: "listingtype", label: "Listing", icon: <Building2 size={16} /> },
    { name: "bedroom", label: "Beds", icon: <Bed size={16} /> },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSubmit = () => {
    setFilters(prev => ({ ...prev, city: searchQuery }));
    setCurrentPage(1);
    setShowSuggestions(false);
    // Smooth scroll to results
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetFilters = () => {
    setFilters({});
    setSearchQuery("");
    setShowFilters(false);
  };

  const getUniqueValues = (data, key) => {
    if (!data) return [];
    return [...new Set(data.map((item) => item[key]).filter(Boolean))].sort();
  };

  return (
    <div className={`transition-colors duration-500 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}>
      
      {/* --- HERO SECTION --- */}
      <AgentHero 
        theme={theme}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        propertyList={propertyList}
        filters={filters}
        setFilters={setFilters}
        handleSubmit={handleSubmit}
       getUniqueValues={getUniqueValues}
        propertiesListingImage={propertiesListingImage}
                colors={{ primary: "bg-amber-500", primaryHover: "hover:bg-amber-600" }}

      />

      {/* --- LISTING SECTION --- */}
      <div ref={listRef}>
        <PropertyListingSection 
          propertyList={propertyList}
          loading={loading}
          theme={theme}
          filters={filters}
          handleFilterChange={handleFilterChange}
          filterFields={filterFields}
          getUniqueValues={getUniqueValues}
          setFilters={setFilters}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pagination={pagination}
          limit={limit}
          openModal={(prop) => setSelectedProperty(prop)}
          handleBuyNow={(prop) => navigate("/bookings", { state: { property: prop } })}
        />
      </div>

      {/* --- PREMIUM PROPERTY MODAL --- */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedProperty(null)} />

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3rem] border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} shadow-2xl flex flex-col md:flex-row`}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-red-500 transition-all"
              >
                <X size={24} />
              </button>

              {/* Left: Image Gallery (60%) */}
              <div className="w-full md:w-[60%] h-[40vh] md:h-auto relative bg-black">
                <img 
                  src={selectedProperty.image?.[0]} 
                  className="w-full h-full object-cover opacity-80"
                  alt="Feature"
                />
                <div className="absolute bottom-10 left-10">
                    <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block">
                        {selectedProperty.propertytype}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        {selectedProperty.propertyname}
                    </h2>
                </div>
              </div>

              {/* Right: Content (40%) */}
              <div className="w-full md:w-[40%] p-8 md:p-12 overflow-y-auto">
                <div className="space-y-8">
                    {/* Price Tag */}
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Investment Value</p>
                        <h3 className={`text-4xl font-mono font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            ₹{new Intl.NumberFormat('en-IN').format(selectedProperty.price)}
                        </h3>
                    </div>

                    {/* Stats Grid */}
                    <div className={`grid grid-cols-3 gap-4 p-6 rounded-[2rem] ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <div className="text-center">
                            <Bed className="mx-auto mb-2 text-blue-500" size={20} />
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.bedroom}</p>
                        </div>
                        <div className="text-center">
                            <Bath className="mx-auto mb-2 text-blue-500" size={20} />
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.bathroom}</p>
                        </div>
                        <div className="text-center">
                            <Ruler className="mx-auto mb-2 text-blue-500" size={20} />
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.squarefoot}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Architecture & Design</p>
                        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {selectedProperty.description || "A masterclass in modern living, featuring open-concept layouts and premium finishes throughout."}
                        </p>
                    </div>

                    {/* Agent Card */}
                    <div className={`p-6 rounded-[2rem] border ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'} flex items-center gap-4`}>
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black">
                            {selectedProperty.agentId?.agentName?.[0] || "A"}
                        </div>
                        <div>
                            <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedProperty.agentId?.agentName || "Premium Agent"}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Verified Concierge</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                            Book Visit
                        </button>
                        <button className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-900 hover:bg-slate-100'}`}>
                            Contact Agent
                        </button>
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

export default PropertyListing;