import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, 
  MapPin, Sparkles, Crown, Briefcase, Building, Landmark, 
  Eye, X, ChevronDown, Home, Bed, Bath, Ruler, DollarSign,
  Calendar, CheckCircle, AlertCircle, TrendingUp, Users
} from 'lucide-react';
import useGetAllProperty from './../../../hooks/useGetAllProperty';
import { useTheme } from '../../../context/ThemeContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';

// Helper to determine brand icon based on mode
const getModeConfig = (mode) => {
  switch (mode) {
    case 'Luxury': return { icon: <Crown size={20} />, label: "Luxury Collection", color: "#f59e0b", bgGradient: "from-amber-500/20 to-orange-500/20" };
    case 'project': return { icon: <Landmark size={20} />, label: "Off-Plan Projects", color: "#8b5cf6", bgGradient: "from-purple-500/20 to-violet-500/20" };
    case 'Commercial': return { icon: <Briefcase size={20} />, label: "Commercial Assets", color: "#06b6d4", bgGradient: "from-cyan-500/20 to-blue-500/20" };
    case 'Rent': return { icon: <Building size={20} />, label: "Rental Registry", color: "#10b981", bgGradient: "from-emerald-500/20 to-teal-500/20" };
    default: return { icon: <Sparkles size={20} />, label: "Inventory Registry", color: "#f59e0b", bgGradient: "from-amber-500/20 to-orange-500/20" };
  }
};

const ViewPropertyList = ({ mode = "all" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = getModeConfig(mode);
  
  // Initial Filter State based on Mode
  const [filters, setFilters] = useState({
    propertyname: "",
    price: "",
    bedroom: "",
    city: "",
    zipcode: "",
    propertytype: "",
    segment: mode === "Luxury" ? "Luxury" : "",
    propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
    usageType: mode === "Commercial" ? "Commercial" : "",
    listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
  });

  // Re-sync filters if mode prop changes
  useEffect(() => {
    clearFilters();
  }, [mode]);

  const limit = 6;
  const { propertyList, loading, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);
  const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      propertyname: "", price: "", bedroom: "", city: "", zipcode: "", propertytype: "",
      segment: mode === "Luxury" ? "Luxury" : "",
      propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
      usageType: mode === "Commercial" ? "Commercial" : "",
      listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
    });
    setCurrentPage(1);
  };

  const filterFields = [
    { name: "propertyname", label: "Property Name", placeholder: "Search by name...", icon: <Home size={14} /> },
    { name: "city", label: "City", placeholder: "Dubai, Abu Dhabi...", icon: <MapPin size={14} /> },
    { name: "propertytype", label: "Property Type", placeholder: "Villa, Apartment...", icon: <Building size={14} /> },
    { name: "bedroom", label: "Bedrooms", placeholder: "1, 2, 3...", icon: <Bed size={14} /> },
    { name: "price", label: "Max Price", placeholder: "AED", icon: <DollarSign size={14} /> },
  ];

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-6 md:p-8 rounded-2xl border transition-all ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${config.bgGradient}`}>
                <div style={{ color: config.color }}>{config.icon}</div>
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {config.label}
                </h1>
                <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Total {pagination?.totalItems || 0} Properties • Page {currentPage} of {pagination?.totalPages || 1}
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  name="propertyname"
                  value={filters.propertyname}
                  onChange={handleFilterChange}
                  placeholder="Search properties..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-amber-500 ${
                    isDark ? 'bg-[#0a0a0c] border-white/10 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  showFilters 
                    ? 'bg-amber-500 text-white' 
                    : `${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`
                }`}
              >
                <Filter size={14} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
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
                      <label className={`text-[8px] font-bold uppercase tracking-wider mb-1.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                          className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 ${
                            isDark ? 'bg-[#0a0a0c] border-white/10 text-white' : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-end gap-2">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-300 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`rounded-2xl overflow-hidden border animate-pulse ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="h-48 bg-slate-700/20" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-700/20 rounded w-3/4" />
                  <div className="h-3 bg-slate-700/20 rounded w-1/2" />
                  <div className="h-8 bg-slate-700/20 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : propertyList.length === 0 ? (
          <EmptyStateModel 
            type="properties"
            title="No Properties Found"
            message={`The ${mode} registry is currently empty. Try adjusting your filters.`}
            onResetFilters={clearFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.map((property, idx) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                    isDark ? 'bg-[#11141B] border-white/5 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:shadow-xl'
                  }`}
                  onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
                >
                  {/* Image Section */}
                  <div className="relative h-52 overflow-hidden">
                    {property.image?.length > 0 ? (
                      <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        className="h-full w-full"
                      >
                        {property.image.slice(0, 3).map((img, i) => (
                          <SwiperSlide key={i}>
                            <img 
                              src={img} 
                              alt={property.propertyname} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <Building size={40} className="text-white/20" />
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold uppercase">
                        {property.propertytype || 'Property'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white text-[9px] font-bold uppercase">
                        {property.listingtype || 'Sale'}
                      </span>
                    </div>
                    
                    {/* Price Tag */}
                    <div className="absolute bottom-3 left-3">
                      <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                        <p className="text-amber-500 font-bold text-sm">AED {property.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <h3 className={`font-bold text-lg mb-1 line-clamp-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {property.propertyname}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin size={12} className="text-amber-500" />
                      <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {property.city || property.community || 'Dubai'}, UAE
                      </span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 mb-3 border-y border-slate-200 dark:border-white/10">
                      {property.bedroom > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Bed size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {property.bedroom}
                          </span>
                        </div>
                      )}
                      {property.bathroom > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Bath size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {property.bathroom}
                          </span>
                        </div>
                      )}
                      {property.squarefoot > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Ruler size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {property.squarefoot.toLocaleString()} sqft
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/updatepropertydetails/${property._id}`);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                          isDark ? 'bg-white/5 text-slate-300 hover:bg-amber-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-amber-500 hover:text-white'
                        }`}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this property permanently?')) deletePropertyById(property._id);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${
                          isDark ? 'bg-white/5 text-slate-300 hover:bg-rose-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-rose-500 hover:text-white'
                        }`}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-slate-200 dark:border-white/10">
                <p className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, pagination?.totalItems || 0)} of {pagination?.totalItems || 0} properties
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination?.totalPages || 1))].map((_, i) => {
                      let pageNum;
                      if (pagination?.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination?.totalPages - 2) {
                        pageNum = pagination?.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-amber-500 text-white'
                              : isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
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
                    className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronRight size={18} />
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