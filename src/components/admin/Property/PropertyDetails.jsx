import React, { useState } from 'react';
import {
  Eye, Pencil, Trash2, MapPin, Home, Tag, IndianRupee,
  Bed, Bath, Ruler, Layers, Building2, Globe, Barcode, Wrench,
  Search, Filter, ChevronLeft, ChevronRight, X, Sparkles
} from 'lucide-react';
import useGetAllProperty from '../../../hooks/useGetAllProperty';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// Import swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyDetails = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [filters, setFilters] = useState({
    propertyname: "", price: "", bedroom: "", bathroom: "",
    squarefoot: "", floor: "", zipcode: "", propertytype: "",
    listingtype: "", state: "", city: "", aminities: "",
  });

  const limit = 6;
  const { propertyList, loading, error, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Safe Amenity Parser helper
  const renderAmenities = (amenitiesData) => {
    if (!amenitiesData) return null;
    let list = [];
    try {
      // Handle double-encoded JSON or direct arrays
      const firstPass = typeof amenitiesData === 'string' ? JSON.parse(amenitiesData) : amenitiesData;
      list = Array.isArray(firstPass) ? firstPass : [firstPass];
      // Check if items inside are also stringified arrays
      if (typeof list[0] === 'string' && list[0].startsWith('[')) {
        list = JSON.parse(list[0]);
      }
    } catch (e) {
      list = Array.isArray(amenitiesData) ? amenitiesData : [amenitiesData];
    }
    
    return list.slice(0, 3).map((item, i) => (
      <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
        {item}
      </span>
    ));
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header Section */}
        <div className={`mb-8 p-6 md:p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                  <Sparkles size={20} />
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">Property Catalog</h1>
              </div>
              <p className="text-slate-500 font-medium text-sm">Browsing {pagination?.totalItems || 0} premium listings</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  placeholder="Quick search..."
                  value={filters.propertyname}
                  name="propertyname"
                  onChange={handleFilterChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${showFilters ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/40' : (isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}
              >
                <Filter size={18} />
                Refine Search
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className={`mt-8 pt-8 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  {['price', 'bedroom', 'city', 'propertytype'].map((f) => (
                    <div key={f}>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{f}</label>
                      <input 
                        name={f} value={filters[f]} onChange={handleFilterChange}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => <div key={i} className={`h-[450px] rounded-[2rem] animate-pulse ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => (
              <motion.div 
                layout key={property._id}
                className={`group rounded-[2.5rem] border overflow-hidden transition-all hover:shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/40 hover:shadow-black/60' : 'bg-white border-slate-200 hover:shadow-indigo-500/10'}`}
              >
                {/* Media Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase rounded-lg shadow-sm">
                      {property.propertytype}
                    </span>
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">
                      {property.listingtype}
                    </span>
                  </div>
                  
                  <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} className="h-full w-full">
                    {property.image?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Info Container */}
                <div className="p-7">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-black mb-1 line-clamp-1">{property.propertyname}</h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin size={12} className="text-indigo-500" /> {property.city}, {property.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-6">
                    <IndianRupee size={18} className="text-indigo-600 font-bold" />
                    <span className="text-2xl font-black text-indigo-600 tracking-tight">
                      {property.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Feature Grid */}
                  <div className={`grid grid-cols-2 gap-4 p-4 rounded-3xl mb-6 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Bed size={16} /></div>
                      <span className="text-xs font-bold">{property.bedroom} <span className="text-slate-500 font-medium">Beds</span></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><Bath size={16} /></div>
                      <span className="text-xs font-bold">{property.bathroom} <span className="text-slate-500 font-medium">Baths</span></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><Ruler size={16} /></div>
                      <span className="text-xs font-bold">{property.squarefoot} <span className="text-slate-500 font-medium">Sqft</span></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><Layers size={16} /></div>
                      <span className="text-xs font-bold">Lvl {property.floor}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {renderAmenities(property.aminities)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={() => navigate(`/updatepropertydetails/${property._id}`)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => deletePropertyById(property._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-rose-400' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Improved Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className={`p-2 rounded-2xl flex items-center gap-1 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button 
                  key={i} onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === pagination.totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;