import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, 
  MapPin, Sparkles, Crown, Briefcase, Building, Landmark, 
  ChevronDown, Home, Bed, Bath, Ruler, DollarSign,
  Calendar, CheckCircle, ShieldAlert, Award, Compass, Car, FileText, Layers, Hash
} from 'lucide-react';
import useGetAllProperty from './../../../hooks/useGetAllProperty';
import { useTheme } from '../../../context/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';

// Helper to determine brand icon based on mode
const getModeConfig = (mode) => {
  switch (mode) {
    case 'Luxury': return { icon: <Crown size={22} />, label: "Luxury Collection", color: "#f59e0b", bgGradient: "from-amber-500/20 to-orange-500/20" };
    case 'project': return { icon: <Landmark size={22} />, label: "Off-Plan Projects", color: "#8b5cf6", bgGradient: "from-purple-500/20 to-violet-500/20" };
    case 'Commercial': return { icon: <Briefcase size={22} />, label: "Commercial Assets", color: "#06b6d4", bgGradient: "from-cyan-500/20 to-blue-500/20" };
    case 'Rent': return { icon: <Building size={22} />, label: "Rental Registry", color: "#10b981", bgGradient: "from-emerald-500/20 to-teal-500/20" };
    default: return { icon: <Sparkles size={22} />, label: "Inventory Registry", color: "#f59e0b", bgGradient: "from-amber-500/20 to-orange-500/20" };
  }
};

const ViewPropertyList = ({ mode = "all" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = getModeConfig(mode);
  
  // Initial Filter State matching Mongoose model properties
  const [filters, setFilters] = useState({
    propertyTitleEn: "",
    price: "",
    bedroom: "",
    category: mode === "project" ? "Off-Plan" : (mode === "Commercial" ? "Commercial" : ""),
    offeringType: (mode === "Rent" || mode === "Buy") ? mode : "",
    propertytype: "",
    refrenceNo: ""
  });

  // Re-sync filters if mode prop changes
  useEffect(() => {
    clearFilters();
  }, [mode]);

  const limit = 6;
  const { propertyList, loading, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      propertyTitleEn: "",
      price: "",
      bedroom: "",
      category: mode === "project" ? "Off-Plan" : (mode === "Commercial" ? "Commercial" : ""),
      offeringType: (mode === "Rent" || mode === "Buy") ? mode : "",
      propertytype: "",
      refrenceNo: ""
    });
    setCurrentPage(1);
  };

  const filterFields = [
    { name: "propertyTitleEn", label: "Property Title", placeholder: "Search title...", icon: <Home size={14} /> },
    { name: "refrenceNo", label: "Reference No", placeholder: "REF-...", icon: <Hash size={14} /> },
    { name: "propertytype", label: "Property Type", placeholder: "Villa, Apartment...", icon: <Building size={14} /> },
    { name: "bedroom", label: "Bedrooms", placeholder: "Min Beds...", icon: <Bed size={14} /> },
    { name: "price", label: "Max Price", placeholder: "AED", icon: <DollarSign size={14} /> },
  ];

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${isDark ? 'bg-[#0f111a]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- MODERN HEADER SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 rounded-2xl border backdrop-blur-md transition-all ${isDark ? 'bg-[#161b26] border-white/5 shadow-xl shadow-black/20' : 'bg-white border-slate-200 shadow-sm'}`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-xl bg-gradient-to-r ${config.bgGradient} shadow-inner`}>
                <div style={{ color: config.color }}>{config.icon}</div>
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {config.label}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Total Assets: {pagination?.totalItems || 0}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[11px] font-semibold text-amber-500">Page {currentPage} of {pagination?.totalPages || 1}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions / Custom Filter Triggers */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  name="propertyTitleEn"
                  value={filters.propertyTitleEn}
                  onChange={handleFilterChange}
                  placeholder="Find property by English title..."
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500/50 ${
                    isDark ? 'bg-[#1b2230] border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 placeholder-slate-400'
                  }`}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  showFilters 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/20' 
                    : `${isDark ? 'bg-[#1b2230] border-white/10 text-slate-300 hover:bg-white/5' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`
                }`}
              >
                <Filter size={15} /> {showFilters ? 'Collapse Filters' : 'Advanced Filters'}
              </button>
            </div>
          </div>

          {/* Advanced Filter Panel Expansion */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  {filterFields.map((field) => (
                    <div key={field.name} className="relative">
                      <label className={`text-[10px] font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {field.label}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          {field.icon}
                        </span>
                        <input
                          type="text"
                          name={field.name}
                          placeholder={field.placeholder}
                          value={filters[field.name]}
                          onChange={handleFilterChange}
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-amber-500/40 ${
                            isDark ? 'bg-[#1b2230] border-white/10 text-white' : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-end gap-2 lg:col-span-5 justify-end mt-2">
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-md shadow-amber-500/10"
                    >
                      Apply Filter Engine
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* --- COMPREHENSIVE PROPERTY RENDERING GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-2xl overflow-hidden border animate-pulse ${isDark ? 'bg-[#161b26] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="h-56 bg-slate-700/20" />
                <div className="p-5 space-y-4">
                  <div className="h-5 bg-slate-700/20 rounded w-3/4" />
                  <div className="h-3 bg-slate-700/20 rounded w-1/2" />
                  <div className="h-12 bg-slate-700/20 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : propertyList.length === 0 ? (
          <EmptyStateModel 
            type="properties"
            title="No Matching Records"
            message={`The active system registry yields no data for "${mode}". Validate filters.`}
            onResetFilters={clearFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.map((property, idx) => {
                // Calculate Price per Sqft dynamically if virtual variable fallback needed
                const calculatedPricePerSqft = property.price && property.squarefoot 
                  ? (property.price / property.squarefoot).toFixed(1) 
                  : 'N/A';

                return (
                  <motion.div
                    key={property._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ y: -6 }}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                      isDark ? 'bg-[#161b26] border-white/5 hover:border-amber-500/30 hover:shadow-2xl hover:shadow-black/40' : 'bg-white border-slate-200 hover:shadow-xl'
                    }`}
                    onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
                  >
                    
                    {/* Media Slider Canvas */}
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      {property.image && property.image.length > 0 ? (
                        <Swiper
                          modules={[Autoplay, Pagination]}
                          autoplay={{ delay: 3500, disableOnInteraction: false }}
                          pagination={{ clickable: true, dynamicBullets: true }}
                          className="h-full w-full"
                        >
                          {property.image.map((img, i) => (
                            <SwiperSlide key={i}>
                              <img 
                                src={img} 
                                alt={property.propertyTitleEn} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                loading="lazy"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
                          <Building size={44} className="opacity-40 mb-2" />
                          <span className="text-xs tracking-wider">No Media Collateral Available</span>
                        </div>
                      )}
                      
                      {/* Top Badges Overlays */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider border border-white/10">
                          {property.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#161b26]/90 backdrop-blur-md text-amber-400 text-[9px] font-bold tracking-normal border border-amber-500/20">
                          REF: {property.refrenceNo || "N/A"}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 items-end">
                        <span className={`px-2.5 py-1 rounded-lg text-white text-[9px] font-black uppercase tracking-widest ${
                          property.offeringType === 'Rent' ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}>
                          For {property.offeringType}
                        </span>
                        {property.offeringType === 'Rent' && property.rentedPeriod && (
                          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] text-white">
                            {property.rentedPeriod}
                          </span>
                        )}
                      </div>
                      
                      {/* Financial Bottom Overlay Badge */}
                      <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-lg">
                          <p className="text-amber-400 font-extrabold text-base tracking-tight">
                            {property.currency || 'AED'} {property.price?.toLocaleString()}
                          </p>
                        </div>
                        
                        {property.publishingStatus && (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            property.publishingStatus === 'Published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {property.publishingStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Meta Core Content Container */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title & Arabic Indicator */}
                        <div className="mb-2">
                          <h3 className={`font-bold text-base tracking-tight line-clamp-1 group-hover:text-amber-500 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            {property.propertyTitleEn}
                          </h3>
                          {property.propertyTitleAr && (
                            <p className="text-right text-xs font-medium text-slate-500 font-arabic line-clamp-1 mt-0.5" dir="rtl">
                              {property.propertyTitleAr}
                            </p>
                          )}
                        </div>
                        
                        {/* Location Details (Display Address) */}
                        <div className="flex items-start gap-1 mb-4">
                          <MapPin size={13} className="text-amber-500 shrink-0 mt-0.5" />
                          <span className={`text-[11px] font-medium line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {property.displayAddress || property.address || "Dubai, UAE"}
                          </span>
                        </div>

                        {/* Property Characteristics Checklist (Mongoose Metrics) */}
                        <div className="grid grid-cols-4 gap-1.5 py-3 mb-4 bg-slate-100/50 dark:bg-white/[0.02] rounded-xl px-2 border border-slate-200/40 dark:border-white/5">
                          <div className="flex flex-col items-center justify-center p-1">
                            <Bed size={14} className="text-amber-500 mb-1" />
                            <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                              {property.bedroom || '0'} BR
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-1">
                            <Bath size={14} className="text-amber-500 mb-1" />
                            <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                              {property.bathroom || '0'} BA
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-1">
                            <Ruler size={14} className="text-amber-500 mb-1" />
                            <span className={`text-[9px] font-bold whitespace-nowrap ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                              {property.squarefoot?.toLocaleString()} <span className="text-[8px] font-normal text-slate-400">SqFt</span>
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-1">
                            <Compass size={14} className="text-amber-500 mb-1" />
                            <span className={`text-[9px] font-bold truncate max-w-full ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                              {property.furnishingType || 'Unfurnished'}
                            </span>
                          </div>
                        </div>

                        {/* Extended Internal Blueprint Data Row */}
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-[11px] border-b border-dashed border-slate-200 dark:border-white/5 pb-3">
                          <div className="flex items-center gap-1.5">
                            <Layers size={12} className="text-slate-400" />
                            <span className="text-slate-400">Type:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{property.propertytype || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Car size={12} className="text-slate-400" />
                            <span className="text-slate-400">Parking:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{property.parkingSlots || 0} Slots</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign size={12} className="text-slate-400" />
                            <span className="text-slate-400">SqFt Price:</span>
                            <span className="text-amber-500 font-bold">{calculatedPricePerSqft} {property.currency || 'AED'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400" />
                            <span className="text-slate-400">Cheques:</span>
                            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{property.cheques || 1}</span>
                          </div>
                        </div>

                        {/* RERA Regulatory Indicator Compliance Section */}
                        {property.trakheesiNumber && (
                          <div className="flex items-center justify-between gap-1 bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border border-amber-500/10 rounded-lg px-2.5 py-1.5 mb-4">
                            <div className="flex items-center gap-1">
                              <FileText size={11} className="text-amber-500" />
                              <span className="text-[10px] text-slate-400 font-medium">Permit ({property.permitType || 'RERA'}):</span>
                            </div>
                            <span className="text-[10px] text-amber-500 font-mono tracking-tight font-bold">{property.trakheesiNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Operations Interaction Cluster (Edit / Delete) */}
                      <div className="flex items-center justify-between gap-2.5 mt-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/updatepropertydetails/${property._id}`);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            isDark 
                              ? 'bg-[#1b2230] border-white/5 text-slate-300 hover:bg-amber-500 hover:text-white hover:border-amber-500' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-500 hover:text-white hover:border-amber-500'
                          }`}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={(e) => { 
                            e.stopPropagation();
                            if (window.confirm('Delete this listing out of the active database schema?')) deletePropertyById(property._id);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            isDark 
                              ? 'bg-[#1b2230] border-white/5 text-slate-300 hover:bg-rose-600 hover:text-white hover:border-rose-600' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-600 hover:text-white hover:border-rose-600'
                          }`}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* --- SYSTEM PAGINATION CONSOLE --- */}
            {pagination?.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-slate-200 dark:border-white/10">
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, pagination?.totalItems || 0)} of {pagination?.totalItems || 0} Active Properties
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-xl border transition-all disabled:opacity-20 ${
                      isDark ? 'border-white/10 hover:bg-white/5 bg-[#161b26]' : 'border-slate-200 hover:bg-slate-100 bg-white'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination?.totalPages || 1))].map((_, i) => {
                      let pageNum;
                      if (pagination?.totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= pagination?.totalPages - 2) pageNum = pagination?.totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                              : isDark ? 'bg-[#161b26] hover:bg-white/5 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, pagination?.totalPages || 1))}
                    disabled={currentPage === pagination?.totalPages}
                    className={`p-2.5 rounded-xl border transition-all disabled:opacity-20 ${
                      isDark ? 'border-white/10 hover:bg-white/5 bg-[#161b26]' : 'border-slate-200 hover:bg-slate-100 bg-white'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPropertyList;