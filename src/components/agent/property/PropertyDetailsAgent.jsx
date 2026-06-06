import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil, Trash2, Home, Tag, IndianRupee,
  Building2, Globe, Bath, Bed, Ruler, Layers, 
  Barcode, Wrench, Search, Filter, ChevronLeft, ChevronRight,
  MapPin, Sparkles, Crown, Briefcase, Landmark, Eye,
  FileText, FileCheck, UserCheck, ShieldCheck, Download, X,
  Calendar
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
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    propertyname: "",
    price: "",
    city: "",
    state: "",
    propertytype: "",
    bedroom: "",
  });
  const navigate = useNavigate();
  const limit = 9;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const brandColor = "#f59e0b";

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

  const handleDownload = (fileName, docType) => {
    if (fileName && fileName !== 'N/A') {
      window.open(`http://localhost:3000/properties/${fileName}`, '_blank');
    }
  };

  const openDocumentModal = (property) => {
    setSelectedProperty(property);
    setShowDocumentModal(true);
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const LoadingModel = useLoading({ type: "list", count: 6, showIcon: true });

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
        
        {/* Header */}
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
              {propertyList.map((property, idx) => {
                const isOffPlan = property.category === "Off-Plan";
                const hasOffPlanDocs = property.offPlanDocuments && property.offPlanDocuments.length > 0;
                const hasOwnerDocs = property.ownerDocuments && property.ownerDocuments.length > 0;
                const hasTrakheesi = property.trakheesiNumber;
                
                return (
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
                            {formatPrice(property.price)}
                          </p>
                        </div>
                      </div>
                      
                      {/* Listing Type Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase ${currentTheme.tagBg}`}>
                          {property.offeringType === 'Rent' ? 'For Rent' : 'For Sale'}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase bg-black/50 backdrop-blur-sm text-white`}>
                          {property.category || 'Residential'}
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
                          {property.displayAddress || property.address || `${property.city}, Dubai`}
                        </span>
                      </div>

                      {/* Document Indicators */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {isOffPlan && hasOffPlanDocs && (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[7px] font-bold uppercase flex items-center gap-0.5">
                            <FileCheck size={8} /> Off-Plan
                          </span>
                        )}
                        {hasOwnerDocs && (
                          <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[7px] font-bold uppercase flex items-center gap-0.5">
                            <FileText size={8} /> Owner Docs
                          </span>
                        )}
                        {hasTrakheesi && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[7px] font-bold uppercase flex items-center gap-0.5">
                            <ShieldCheck size={8} /> RERA
                          </span>
                        )}
                      </div>

                      {/* Specs Grid */}
                      <div className="grid grid-cols-3 gap-2 py-3 mb-3 border-t border-b border-slate-200 dark:border-white/10">
                        <div className="flex items-center justify-center gap-1.5">
                          <Bed size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.bedroom || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <Bath size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.bathroom || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5">
                          <Ruler size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.squarefoot?.toLocaleString()} sqft
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 py-3 mb-3 border-t border-b border-slate-200 dark:border-white/10">
                        <div className="flex items-center justify-center gap-1.5">
                          <Calendar size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.listingStartDate || "No Date"}
                          </span>
                        </div>
                       
                        <div className="flex items-center justify-center gap-1.5">
                          <Calendar size={14} className="text-amber-500" />
                          <span className={`text-xs font-medium ${currentTheme.textPrimary}`}>
                            {property.listingEndDate || "No Date"}
                          </span>
                        </div>
                      </div>

                      {/* Trakheesi Number (if available) */}
                      {hasTrakheesi && (
                        <div className="mb-3 px-2 py-1 rounded-lg bg-amber-500/5 border border-amber-500/10">
                          <p className="text-[7px] text-amber-400 font-bold uppercase tracking-wider">Trakheesi No</p>
                          <p className="text-[9px] font-mono text-amber-500">{property.trakheesiNumber}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
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

                        {(hasOffPlanDocs || hasOwnerDocs) && (
                          <button
                            onClick={() => openDocumentModal(property)}
                            className="px-3 py-2 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
                            title="View Documents"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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

      {/* Document Modal */}
      <AnimatePresence>
        {showDocumentModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDocumentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden ${currentTheme.card}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-4 border-b ${currentTheme.border}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${currentTheme.textPrimary}`}>
                    <FileText size={18} className="text-amber-500" />
                    Documents - {selectedProperty.propertyname || selectedProperty.propertyTitleEn}
                  </h3>
                  <button onClick={() => setShowDocumentModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
                {/* Off-Plan Documents */}
                {selectedProperty.category === "Off-Plan" && selectedProperty.offPlanDocuments?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold flex items-center gap-2 text-purple-500`}>
                      <FileCheck size={16} /> Off-Plan Documents ({selectedProperty.offPlanDocuments.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedProperty.offPlanDocuments.map((doc, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                          <div className="flex items-center gap-3">
                            <FileText size={14} className="text-purple-500" />
                            <span className={`text-sm ${currentTheme.textPrimary}`}>{doc}</span>
                          </div>
                          <button
                            onClick={() => handleDownload(doc, 'offplan')}
                            className="p-1.5 rounded hover:bg-purple-500/20 text-purple-500 transition"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Off-Plan Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      {selectedProperty.deliveryDate && (
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Handover Date</p>
                          <p className="text-xs font-semibold">{formatDate(selectedProperty.deliveryDate)}</p>
                        </div>
                      )}
                      {selectedProperty.completionPercentage && (
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Completion</p>
                          <p className="text-xs font-semibold">{selectedProperty.completionPercentage}%</p>
                        </div>
                      )}
                      {selectedProperty.paymentPlan && (
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Payment Plan</p>
                          <p className="text-xs font-semibold">{selectedProperty.paymentPlan}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Owner Documents */}
                {selectedProperty.ownerDocuments?.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold flex items-center gap-2 text-blue-500`}>
                      <UserCheck size={16} /> Owner Documents ({selectedProperty.ownerDocuments.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedProperty.ownerDocuments.map((doc, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                          <div className="flex items-center gap-3">
                            <FileText size={14} className="text-blue-500" />
                            <span className={`text-sm ${currentTheme.textPrimary}`}>{doc}</span>
                          </div>
                          <button
                            onClick={() => handleDownload(doc, 'owner')}
                            className="p-1.5 rounded hover:bg-blue-500/20 text-blue-500 transition"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Owner Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      {selectedProperty.ownerName && (
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Owner Name</p>
                          <p className="text-xs font-semibold">{selectedProperty.ownerName}</p>
                        </div>
                      )}
                      {selectedProperty.ownerEmiratesId && (
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Emirates ID</p>
                          <p className="text-[10px] font-mono">{selectedProperty.ownerEmiratesId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* RERA Compliance */}
                {selectedProperty.trakheesiNumber && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-semibold flex items-center gap-2 text-amber-500`}>
                      <ShieldCheck size={16} /> RERA Compliance
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className="text-[8px] text-slate-500">Trakheesi No</p>
                        <p className="text-xs font-mono">{selectedProperty.trakheesiNumber}</p>
                      </div>
                      {selectedProperty.permitType && (
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Permit Type</p>
                          <p className="text-xs font-semibold">{selectedProperty.permitType}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetailsAgent;