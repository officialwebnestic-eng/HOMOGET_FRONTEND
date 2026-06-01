import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, 
  MapPin, Sparkles, Crown, Briefcase, Building, Landmark, 
  Home, Bed, Bath, Ruler, DollarSign,
  Calendar, ShieldAlert, Award, Car, FileText, Layers, Hash,
  FileCheck, FileWarning, UserCheck, Eye, Download, X,
  Phone, Mail, Globe, CreditCard, User, FileSignature
} from 'lucide-react';
import useGetAllProperty from './../../../hooks/useGetAllProperty';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import EmptyStateModel from '../../../model/EmptyStateModel';

// Helper to determine brand icon based on mode
const getModeConfig = (mode) => {
  switch (mode) {
    case 'Luxury': return { icon: <Crown size={18} />, label: "Luxury Collection", color: "#f59e0b" };
    case 'project': return { icon: <Landmark size={18} />, label: "Off-Plan Projects", color: "#8b5cf6" };
    case 'Commercial': return { icon: <Briefcase size={18} />, label: "Commercial Assets", color: "#06b6d4" };
    case 'Rent': return { icon: <Building size={18} />, label: "Rental Registry", color: "#10b981" };
    default: return { icon: <Sparkles size={18} />, label: "Inventory Registry", color: "#f59e0b" };
  }
};

const ViewPropertyList = ({ mode = "all" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const config = getModeConfig(mode);
  
  const [filters, setFilters] = useState({
    propertyTitleEn: "",
    price: "",
    bedroom: "",
    category: mode === "project" ? "Off-Plan" : (mode === "Commercial" ? "Commercial" : ""),
    offeringType: (mode === "Rent" || mode === "Buy") ? mode : "",
    propertytype: "",
    refrenceNo: ""
  });

  useEffect(() => {
    clearFilters();
  }, [mode]);

  const limit = 12;
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

  const handleDownload = (fileName, docType) => {
    if (fileName && fileName !== 'N/A') {
      window.open(`http://localhost:3000/properties/${fileName}`, '_blank');
    }
  };

  const openDocumentModal = (property) => {
    setSelectedProperty(property);
    setShowDocumentModal(true);
  };

  const filterFields = [
    { name: "propertyTitleEn", label: "Title", placeholder: "Search...", icon: <Home size={12} /> },
    { name: "refrenceNo", label: "Ref No", placeholder: "REF...", icon: <Hash size={12} /> },
    { name: "propertytype", label: "Type", placeholder: "Villa...", icon: <Building size={12} /> },
    { name: "bedroom", label: "Beds", placeholder: "Min...", icon: <Bed size={12} /> },
    { name: "price", label: "Max Price", placeholder: "AED", icon: <DollarSign size={12} /> },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Pagination
  const getPageNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
    const current = currentPage;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });
    return rangeWithDots;
  };

  return (
    <div className={`min-h-screen p-3 md:p-4 lg:p-6 transition-all duration-500 ${isDark ? 'bg-[#0f111a]' : 'bg-slate-50'}`}>
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 rounded-xl border transition-all ${isDark ? 'bg-[#161b26] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}
        >
          <div className="p-3 md:p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${config.bgGradient} shadow-inner`}>
                  <div style={{ color: config.color }}>{config.icon}</div>
                </div>
                <div>
                  <h1 className={`text-lg md:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {config.label}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Total: {pagination?.totalItems || 0}
                    </span>
                    <span className="text-slate-500 text-[9px]">•</span>
                    <span className="text-[9px] font-semibold text-amber-500">Page {currentPage} of {pagination?.totalPages || 1}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
                <div className="relative flex-1 min-w-[180px] md:min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    name="propertyTitleEn"
                    value={filters.propertyTitleEn}
                    onChange={handleFilterChange}
                    placeholder="Find property..."
                    className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-amber-500/50 ${
                      isDark ? 'bg-[#1b2230] border-white/10 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 placeholder-slate-400'
                    }`}
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                    showFilters 
                      ? 'bg-amber-500 text-white border-amber-500 shadow-lg' 
                      : `${isDark ? 'bg-[#1b2230] border-white/10 text-slate-300 hover:bg-white/5' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`
                  }`}
                >
                  <Filter size={12} /> {showFilters ? 'Hide' : 'Filters'}
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
                    {filterFields.map((field) => (
                      <div key={field.name} className="relative">
                        <label className={`text-[7px] font-bold uppercase tracking-wider mb-0.5 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {field.label}
                        </label>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
                            {field.icon}
                          </span>
                          <input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder}
                            value={filters[field.name]}
                            onChange={handleFilterChange}
                            className={`w-full pl-7 pr-2 py-1.5 rounded-lg border text-[10px] outline-none focus:ring-2 focus:ring-amber-500/40 ${
                              isDark ? 'bg-[#1b2230] border-white/10 text-white' : 'bg-slate-50 border-slate-200'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="flex items-end gap-2 lg:col-span-5 justify-end mt-1">
                      <button
                        onClick={clearFilters}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-[9px] font-bold uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-colors shadow-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Table View */}
        {loading ? (
          <div className="rounded-lg overflow-hidden border animate-pulse">
            <div className={`h-10 ${isDark ? 'bg-[#1b2230]' : 'bg-slate-100'}`} />
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`h-14 ${isDark ? 'bg-[#161b26]' : 'bg-white'} border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`} />
            ))}
          </div>
        ) : propertyList.length === 0 ? (
          <EmptyStateModel 
            type="properties"
            title="No Matching Records"
            message={`No data found for "${mode}". Try adjusting filters.`}
            onResetFilters={clearFilters}
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg  shadow-sm">
              <table className="w-full text-[10px]">
                <thead className={isDark ? 'bg-[#1b2230]' : 'bg-slate-100'}>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="px-2 py-2 text-left font-semibold">Img</th>
                    <th className="px-2 py-2 text-left font-semibold">Title / Ref</th>
                    <th className="px-2 py-2 text-left font-semibold">Agent</th>
                    <th className="px-2 py-2 text-left font-semibold">Category/Type</th>
                    <th className="px-2 py-2 text-left font-semibold">Location</th>
                    <th className="px-2 py-2 text-left font-semibold">Trakheesi</th>
                    <th className="px-2 py-2 text-left font-semibold">Specs</th>
                    <th className="px-2 py-2 text-left font-semibold">Price</th>
                    <th className="px-2 py-2 text-left font-semibold">Off-Plan</th>
                    <th className="px-2 py-2 text-left font-semibold">Owner Docs</th>
                    <th className="px-2 py-2 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {propertyList.map((property) => {
                    const isOffPlan = property.category === "Off-Plan";
                    const hasOffPlanDocs = property.offPlanDocuments && property.offPlanDocuments.length > 0;
                    const hasOwnerDocs = property.ownerDocuments && property.ownerDocuments.length > 0;
                    const agentName = property.agentId?.name || 'N/A';
                    const agentEmail = property.agentId?.email || '';
                    
                    return (
                      <tr 
                        key={property._id}
                        className={`hover:bg-amber-500/5 transition-colors cursor-pointer ${isDark ? 'bg-[#161b26]' : 'bg-white'}`}
                        onClick={() => navigate(`/property/${property._id}`, { state: { propertyData: property } })}
                      >
                        {/* Image */}
                        <td className="px-2 py-2">
                          <img 
                            src={property.image?.[0] || "https://placehold.co/40x40/e2e8f0/64748b?text=No"}
                            alt="img"
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        </td>
                        
                        {/* Title / Ref */}
                        <td className="px-2 py-2">
                          <div className="font-semibold text-[10px] line-clamp-1">{property.propertyTitleEn?.slice(0, 30)}</div>
                          <div className="text-[8px] text-slate-400 font-mono">REF: {property.refrenceNo?.slice(-8) || 'N/A'}</div>
                          <span className={`inline-block mt-0.5 px-1 py-0.5 rounded text-[7px] font-bold ${
                            property.publishingStatus === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {property.publishingStatus}
                          </span>
                        </td>
                        
                        {/* Agent */}
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <User size={10} className="text-amber-500" />
                            <span className="text-[9px] font-medium">{agentName}</span>
                          </div>
                          {agentEmail && (
                            <div className="text-[7px] text-slate-400 truncate max-w-[100px]">{agentEmail}</div>
                          )}
                         </td>
                        
                        {/* Category / Type */}
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            {property.category === 'Off-Plan' ? <Landmark size={10} className="text-purple-400" /> :
                             property.category === 'Commercial' ? <Briefcase size={10} className="text-cyan-400" /> :
                             <Home size={10} className="text-amber-400" />}
                            <span className="text-[9px]">{property.category}</span>
                          </div>
                          <div className="text-[8px] text-slate-400">{property.propertytype || 'N/A'}</div>
                          <div className="mt-0.5">
                            <span className={`px-1 py-0.5 rounded text-[7px] font-bold ${
                              property.offeringType === 'Rent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {property.offeringType}
                            </span>
                          </div>
                         </td>
                        
                        {/* Location */}
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <MapPin size={10} className="text-amber-400 flex-shrink-0" />
                            <span className="text-[9px] line-clamp-2 max-w-[150px]">{property.displayAddress || property.address || 'Dubai'}</span>
                          </div>
                          {property.community && (
                            <div className="text-[7px] text-slate-400 mt-0.5">{property.community}</div>
                          )}
                         </td>
                        
                        {/* Trakheesi Number */}
                        <td className="px-2 py-2">
                          {property.trakheesiNumber ? (
                            <div className="font-mono text-[9px] text-amber-400">{property.trakheesiNumber}</div>
                          ) : (
                            <span className="text-[8px] text-slate-500">—</span>
                          )}
                          {property.permitType && (
                            <div className="text-[7px] text-slate-400">{property.permitType}</div>
                          )}
                         </td>
                        
                        {/* Specs */}
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5 text-[9px]"><Bed size={8} /> {property.bedroom || 0}</span>
                            <span className="flex items-center gap-0.5 text-[9px]"><Bath size={8} /> {property.bathroom || 0}</span>
                          </div>
                          <div className="text-[8px] text-slate-400">{property.squarefoot?.toLocaleString()} sqft</div>
                          <div className="text-[8px] text-slate-400">{property.furnishingType?.slice(0, 6) || '---'}</div>
                         </td>
                        
                        {/* Price */}
                        <td className="px-2 py-2">
                          <div className="font-bold text-[10px] text-amber-500">{formatPrice(property.price)}</div>
                          {property.offeringType === 'Rent' && property.rentedPeriod && (
                            <div className="text-[7px] text-slate-400">/{property.rentedPeriod}</div>
                          )}
                          {property.cheques && (
                            <div className="text-[7px] text-slate-400">{property.cheques} chq</div>
                          )}
                         </td>
                        
                        {/* Off-Plan Documents */}
                        <td className="px-2 py-2 text-center">
                          {isOffPlan ? (
                            <div className="flex flex-col items-center gap-0.5">
                              {hasOffPlanDocs ? (
                                <>
                                  <span className="text-[8px] text-green-400">{property.offPlanDocuments.length} files</span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); openDocumentModal(property); }}
                                    className="p-1 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition"
                                  >
                                    <Eye size={10} />
                                  </button>
                                </>
                              ) : (
                                <span className="text-[8px] text-slate-500">No docs</span>
                              )}
                              {property.completionPercentage && (
                                <div className="w-12 mt-0.5">
                                  <div className="text-[6px] text-slate-400">{property.completionPercentage}%</div>
                                  <div className="w-full h-0.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${property.completionPercentage}%` }} />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[8px] text-slate-400">—</span>
                          )}
                         </td>
                        
                        {/* Owner Documents */}
                        <td className="px-2 py-2 text-center">
                          <div className="flex flex-col items-center gap-0.5">
                            {hasOwnerDocs ? (
                              <>
                                <span className="text-[8px] text-green-400">{property.ownerDocuments.length} files</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); openDocumentModal(property); }}
                                  className="p-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                                >
                                  <Eye size={10} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[8px] text-slate-500">No docs</span>
                            )}
                            {property.ownerName && (
                              <div className="text-[7px] text-slate-400 truncate max-w-[70px]">{property.ownerName?.slice(0, 15)}</div>
                            )}
                          </div>
                         </td>
                        
                        {/* Actions */}
                        <td className="px-2 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/updatepropertydetails/${property._id}`); }}
                              className="p-1 rounded hover:bg-amber-500/10 text-amber-500 transition"
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this property?')) deletePropertyById(property._id); }}
                              className="p-1 rounded hover:bg-red-500/10 text-red-500 transition"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                         </td>
                       </tr>
                    );
                  })}
                </tbody>
               </table>
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-white/10">
                <p className={`text-[9px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, pagination?.totalItems || 0)} of {pagination?.totalItems || 0}
                </p>
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-1.5 rounded-lg border transition-all disabled:opacity-30 ${
                      isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      className={`min-w-[26px] h-7 rounded-lg text-[9px] font-medium transition-all ${
                        currentPage === page
                          ? 'bg-amber-500 text-white shadow-lg'
                          : page === '...' 
                            ? 'cursor-default'
                            : isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, pagination?.totalPages || 1))}
                    disabled={currentPage === pagination?.totalPages}
                    className={`p-1.5 rounded-lg border transition-all disabled:opacity-30 ${
                      isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronRight size={14} />
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
              className={`relative w-full max-w-3xl max-h-[85vh] rounded-xl overflow-hidden ${isDark ? 'bg-[#161b26]' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-3 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <FileText size={14} className="text-amber-500" />
                    Documents - {selectedProperty.propertyTitleEn?.slice(0, 40)}
                  </h3>
                  <button onClick={() => setShowDocumentModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10">
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-3 overflow-y-auto max-h-[calc(85vh-60px)] space-y-4">
                {/* Off-Plan Documents */}
                {selectedProperty.category === "Off-Plan" && (
                  <div className="space-y-2">
                    <h4 className={`text-[11px] font-semibold flex items-center gap-1.5 text-purple-500`}>
                      <FileCheck size={12} /> Off-Plan Documents ({selectedProperty.offPlanDocuments?.length || 0})
                    </h4>
                    <div className="space-y-1">
                      {selectedProperty.offPlanDocuments && selectedProperty.offPlanDocuments.length > 0 ? (
                        selectedProperty.offPlanDocuments.map((doc, idx) => (
                          <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                            <div className="flex items-center gap-2">
                              <FileText size={12} className="text-purple-500" />
                              <span className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{doc}</span>
                            </div>
                            <button
                              onClick={() => handleDownload(doc, 'offplan')}
                              className="p-1 rounded hover:bg-purple-500/20 text-purple-500 transition"
                            >
                              <Download size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] text-slate-500">No off-plan documents available</div>
                      )}
                    </div>
                    
                    {/* Off-Plan Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {selectedProperty.deliveryDate && (
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Handover Date</p>
                          <p className="text-[9px] font-semibold">{formatDate(selectedProperty.deliveryDate)}</p>
                        </div>
                      )}
                      {selectedProperty.completionPercentage && (
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Completion</p>
                          <p className="text-[9px] font-semibold">{selectedProperty.completionPercentage}%</p>
                        </div>
                      )}
                      {selectedProperty.paymentPlan && (
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Payment Plan</p>
                          <p className="text-[9px] font-semibold">{selectedProperty.paymentPlan}</p>
                        </div>
                      )}
                      {selectedProperty.offPlanNocNumber && (
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">NOC/Permit</p>
                          <p className="text-[8px] font-mono">{selectedProperty.offPlanNocNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Owner Documents */}
                <div className="space-y-2">
                  <h4 className={`text-[11px] font-semibold flex items-center gap-1.5 text-blue-500`}>
                    <UserCheck size={12} /> Owner Documents ({selectedProperty.ownerDocuments?.length || 0})
                  </h4>
                  <div className="space-y-1">
                    {selectedProperty.ownerDocuments && selectedProperty.ownerDocuments.length > 0 ? (
                      selectedProperty.ownerDocuments.map((doc, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-blue-500" />
                            <span className={`text-[10px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{doc}</span>
                          </div>
                          <button
                            onClick={() => handleDownload(doc, 'owner')}
                            className="p-1 rounded hover:bg-blue-500/20 text-blue-500 transition"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-[10px] text-slate-500">No owner documents available</div>
                    )}
                  </div>
                  
                  {/* Owner Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {selectedProperty.ownerName && (
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className="text-[8px] text-slate-500">Owner Name</p>
                        <p className="text-[9px] font-semibold">{selectedProperty.ownerName}</p>
                      </div>
                    )}
                    {selectedProperty.ownerEmiratesId && (
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className="text-[8px] text-slate-500">Emirates ID</p>
                        <p className="text-[8px] font-mono">{selectedProperty.ownerEmiratesId}</p>
                      </div>
                    )}
                    {selectedProperty.ownerPassportNumber && (
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className="text-[8px] text-slate-500">Passport</p>
                        <p className="text-[8px] font-mono">{selectedProperty.ownerPassportNumber}</p>
                      </div>
                    )}
                    {selectedProperty.ownerIdNumber && (
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className="text-[8px] text-slate-500">ID Number</p>
                        <p className="text-[8px] font-mono">{selectedProperty.ownerIdNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RERA Compliance */}
                {selectedProperty.trakheesiNumber && (
                  <div className="space-y-2">
                    <h4 className={`text-[11px] font-semibold flex items-center gap-1.5 text-amber-500`}>
                      <ShieldAlert size={12} /> RERA Compliance
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <p className="text-[8px] text-slate-500">Trakheesi No</p>
                        <p className="text-[9px] font-mono">{selectedProperty.trakheesiNumber}</p>
                      </div>
                      {selectedProperty.permitType && (
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">Permit Type</p>
                          <p className="text-[9px] font-semibold">{selectedProperty.permitType}</p>
                        </div>
                      )}
                      {selectedProperty.reraORN && (
                        <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                          <p className="text-[8px] text-slate-500">RERA ORN</p>
                          <p className="text-[8px] font-mono">{selectedProperty.reraORN}</p>
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

export default ViewPropertyList;