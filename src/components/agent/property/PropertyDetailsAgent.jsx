import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil, Trash2, Home, Tag, IndianRupee,
  Building2, Globe, Bath, Bed, Ruler, Layers, 
  Barcode, Wrench, Search, Filter, ChevronLeft, ChevronRight,
  MapPin, Sparkles, Crown, Briefcase, Landmark, Eye
} from 'lucide-react';
import useGetPropertyBuyUserId from '../../../hooks/useGetPropertyBuyUserId';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { notfound } from '../../../ExportImages';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';

const PropertyDetailsAgent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    propertyname: "",
    price: "",
    city: "",
    state: "",
    propertytype: "",
    bedroom: "",
  });
  const navigate = useNavigate();
  const limit = 6;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const brandColor = "#f59e0b"; // amber-500

  const { propertyList, loading, error, pagination, deletePropertyById } = useGetPropertyBuyUserId(currentPage, limit, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      propertyname: "",
      price: "",
      city: "",
      state: "",
      propertytype: "",
      bedroom: "",
    });
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deletePropertyById(id);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/updatepropertydetails/${id}`);
  };

  const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

  // Theme styles
  const themeStyles = {
    light: {
      bg: 'bg-slate-50',
      card: 'bg-white',
      border: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      input: 'bg-white border-slate-200 focus:ring-amber-500 focus:border-amber-500',
      buttonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      buttonDanger: 'bg-rose-50 hover:bg-rose-100 text-rose-600',
      tagBg: 'bg-amber-100 text-amber-700',
      iconColor: 'text-amber-500',
      price: 'text-amber-600',
      paginationActive: 'bg-amber-500 text-white shadow-sm',
      paginationInactive: 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
    },
    dark: {
      bg: 'bg-[#0a0a0c]',
      card: 'bg-[#11141B]',
      border: 'border-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      input: 'bg-[#0a0a0c] border-white/10 focus:ring-amber-500 focus:border-amber-500 text-white placeholder:text-slate-500',
      buttonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      buttonDanger: 'bg-rose-900/30 hover:bg-rose-900/50 text-rose-400',
      tagBg: 'bg-amber-500/20 text-amber-400',
      iconColor: 'text-amber-500',
      price: 'text-amber-400',
      paginationActive: 'bg-amber-500 text-white shadow-sm',
      paginationInactive: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10',
    },
  };

  const currentTheme = themeStyles[theme];

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header with title and filter toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-lg bg-amber-500/10">
                <Home size={18} className="text-amber-500" />
              </div>
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${currentTheme.textPrimary}`}>
                My <span style={{ color: brandColor }}>Properties</span>
              </h2>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${currentTheme.textSecondary}`}>
              {pagination?.totalItems || 0} Properties Listed • Page {currentPage} of {pagination?.totalPages || 1}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
              showFilters 
                ? 'bg-amber-500 text-white border-amber-500' 
                : `${currentTheme.card} ${currentTheme.border} ${currentTheme.textSecondary} hover:text-amber-500`
            }`}
          >
            <Filter size={14} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className={`p-6 rounded-2xl border ${currentTheme.card} ${currentTheme.border} shadow-sm`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      Property Name
                    </label>
                    <input
                      type="text"
                      name="propertyname"
                      value={filters.propertyname}
                      onChange={handleFilterChange}
                      placeholder="Search by name..."
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      Price (AED)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={filters.price}
                      onChange={handleFilterChange}
                      placeholder="Max price"
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                      placeholder="e.g., Dubai"
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={filters.state}
                      onChange={handleFilterChange}
                      placeholder="e.g., Dubai"
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      Property Type
                    </label>
                    <select
                      name="propertytype"
                      value={filters.propertytype}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                    >
                      <option value="">All Types</option>
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Office">Office</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      Bedrooms
                    </label>
                    <select
                      name="bedroom"
                      value={filters.bedroom}
                      onChange={handleFilterChange}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                    >
                      <option value="">Any</option>
                      {[1,2,3,4,5,6].map(b => <option key={b} value={b}>{b}+ Beds</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={clearFilters}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${currentTheme.buttonDanger}`}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-md ${currentTheme.buttonPrimary}`}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading / Error / Empty states */}
        {loading ? (
          <LoadingModel loading={true} />
        ) : error ? (
          <EmptyStateModel
            type="error"
            title="Error"
            message="Failed to load properties. Please try again."
            showResetButton
            onResetFilters={() => window.location.reload()}
          />
        ) : propertyList.length === 0 ? (
          <EmptyStateModel
            type="properties"
            title="No Properties"
            message="You haven't listed any properties yet."
            showActionButton
            actionButtonText="Add Property"
            onActionClick={() => navigate("/addpropertybyagent")}
          />
        ) : (
          <>
            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyList.map((property, idx) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${currentTheme.card} ${currentTheme.border} hover:shadow-xl cursor-pointer`}
                >
                  {/* Image Carousel */}
                  <div className="relative h-56 overflow-hidden">
                    {property.image?.length > 0 ? (
                      <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        className="h-full w-full"
                      >
                        {property.image.slice(0, 4).map((img, i) => (
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
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Home size={48} className="text-slate-600" />
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                        <p className={`text-sm font-bold ${currentTheme.price}`}>
                          AED {property.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Listing Type Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${currentTheme.tagBg}`}>
                        {property.listingtype || (property.offeringType === 'Rent' ? 'For Rent' : 'For Sale')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className={`text-lg font-bold mb-1 line-clamp-1 ${currentTheme.textPrimary}`}>
                      {property.propertyname || property.propertyTitleEn}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin size={12} className="text-amber-500" />
                      <span className={`text-[10px] ${currentTheme.textSecondary}`}>
                        {property.city}, {property.state || 'UAE'}
                      </span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-3 mb-3 border-t border-b border-slate-200 dark:border-white/10">
                      {property.bedroom > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Bed size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.bedroom}
                          </span>
                        </div>
                      )}
                      {property.bathroom > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Bath size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.bathroom}
                          </span>
                        </div>
                      )}
                      {property.squarefoot > 0 && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Ruler size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.squarefoot.toLocaleString()} sqft
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <PermissionProtectedAction action="update" module="Property Management">
                        <button
                          onClick={() => handleUpdate(property._id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${currentTheme.buttonPrimary}`}
                        >
                          <Pencil size={14} /> Edit
                        </button>
                      </PermissionProtectedAction>
                      
                      <PermissionProtectedAction action="delete" module="Property Management">
                        <button
                          onClick={() => handleDelete(property._id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${currentTheme.buttonDanger}`}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </PermissionProtectedAction>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-slate-200 dark:border-white/10">
                <p className={`text-[9px] font-medium ${currentTheme.textSecondary}`}>
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, pagination.totalItems)} of {pagination.totalItems} properties
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${currentTheme.paginationInactive}`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                            currentPage === pageNum
                              ? currentTheme.paginationActive
                              : currentTheme.paginationInactive
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${currentTheme.paginationInactive}`}
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

export default PropertyDetailsAgent;