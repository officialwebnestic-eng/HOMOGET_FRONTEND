import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Share2,
  Heart,
  Plus,
  Square,
  BedDouble,
  ArrowRight
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
  },
  dark: {
    background: "bg-[#0a0a0c]",
    card: "bg-[#141417]",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-white/5",
    shadow: "shadow-2xl",
  },
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
  const isDark = theme === "dark";

  const { propertyList = [], loading } = useGetAllProperty(
    currentPage,
    20,
    useMemo(() => filters, [filters])
  );

  const handlePropertyClick = useCallback(
    (property) => {
      navigate(`/property/${property._id}`, {
        state: { propertyData: property },
      });
    },
    [navigate]
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

  const eliteProperties = propertyList.slice(0, 9);
  const insightProperties = propertyList.slice(9, 20);

  return (
    <div className={`${colors.background} min-h-screen pb-20 transition-colors duration-300`}>
      <AgentHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        onSuggestionClick={handleSuggestionClick}
        onSearchButtonClick={handleSearchButtonClick}
        propertyList={propertyList}
        filters={filters}
        handleFilterChange={(e) => setFilters({ ...filters, [e.target.name]: e.target.value })}
        filterFields={filterFields}
        getUniqueValues={(data, key) => [...new Set(data.flatMap((item) => item[key]))].filter(Boolean).sort()}
        setShowFilters={setShowFilters}
        showFilters={showFilters}
      />

      <div className="max-w-7xl mx-auto px-4   sm:px-6 lg:px-8  py-24  relative z-20">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between  items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
             <div className="h-1 w-12  bg-amber-500 rounded-full" />
             <h2 className={`text-2xl    md:text-4xl font-serif ${colors.text}`}>
                Exclusive <span className="text-amber-500 italic">Properties</span>
             </h2>
          </div>
          <button 
            onClick={() => navigate("/propertylisting")}
            className="px-8 py-3 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            View All Properties <ArrowRight size={16} />
          </button>
        </div>

        {/* PROPERTY GRID (MATCHING SCREENSHOT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eliteProperties.map((property) => (
            <motion.div
              key={property._id}
              whileHover={{ y: -10 }}
              className={`rounded-[2.5rem] overflow-hidden ${colors.card} ${colors.shadow} border ${colors.border} group cursor-pointer flex flex-col`}
              onClick={() => handlePropertyClick(property)}
            >
              {/* Image Container */}
              <div className="relative h-72 w-full overflow-hidden">
                <img
                  src={property.image?.[0]}
                  alt={property.propertyname}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-[#1a1a2e] text-white text-[9px] font-black uppercase rounded-md tracking-wider">
                    {property.propertytype || "HOUSE"}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase rounded-md tracking-wider">
                    FOR {property.listingtype || "RENT"}
                  </span>
                </div>

                {/* Location Overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <MapPin size={12} className="text-amber-400" />
                  <span className="text-[10px] font-bold truncate max-w-[150px]">
                    {property.address || property.city}, UAE
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-7 flex-1">
                <h3 className={`text-xl font-bold mb-2 truncate ${colors.text}`}>
                  {property.propertyname}
                </h3>
                <p className="text-amber-500 text-lg font-black mb-6">
                  AED {Number(property.price).toLocaleString()}
                  {property.listingtype === "Rent" && <span className="text-xs text-gray-400 font-normal ml-1">/ Year</span>}
                </p>

                {/* Features Bar */}
                <div className="flex items-center gap-6 py-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-gray-500">
                    <BedDouble size={16} className="text-amber-500" />
                    <span className="text-[11px] font-bold uppercase">{property.bedroom || 2} BHK</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Square size={14} className="text-amber-500" />
                    <span className="text-[11px] font-bold uppercase">{property.squarefoot || 0} Sq.Ft</span>
                  </div>
                </div>

                {/* Footer Icon Bar (Matching Screenshot) */}
                <div className="flex items-center justify-end gap-5 pt-4 mt-auto border-t border-gray-100 dark:border-white/5">
                   <Share2 size={18} className="text-gray-400 hover:text-amber-500 transition-colors" />
                   <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
                   <Plus size={20} className="text-gray-400 hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* MARKET INSIGHTS SECTION (CLEANER STYLE) */}
        {insightProperties.length > 0 && (
          <div className="mt-24 mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-0.5 w-8 bg-amber-500" />
              <h2 className={`text-2xl font-serif ${colors.text}`}>
                Market <span className="text-amber-500 italic">Insights</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insightProperties.map((property) => (
                <motion.div
                  key={property._id}
                  onClick={() => handlePropertyClick(property)}
                  whileHover={{ scale: 1.02 }}
                  className={`group p-4 rounded-3xl ${colors.card} border ${colors.border} flex items-center gap-5 cursor-pointer shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={property.image?.[0]}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm mb-1 truncate ${colors.text}`}>
                      {property.propertyname}
                    </h4>
                    <div className="flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span className={`text-[10px] font-bold uppercase ${colors.textSecondary}`}>
                        {property.city}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-amber-500 font-bold text-sm">
                        AED {Number(property.price).toLocaleString()}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Agentfilter;