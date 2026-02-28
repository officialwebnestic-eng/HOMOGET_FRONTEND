import React, { useState, useEffect } from 'react';
import {
  Pencil, Trash2, MapPin, IndianRupee, Bed, Bath, Ruler, 
  Layers, Search, Filter, ChevronLeft, ChevronRight, 
  Sparkles, Crown, Landmark, Briefcase, Building
} from 'lucide-react';
import useGetAllProperty from '../../../hooks/useGetAllProperty';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import EmptyStateModel from '../../../model/EmptyStateModel';

// Helper to define UI look based on the page mode
const getPageConfig = (mode) => {
  switch (mode) {
    case 'Luxury': return { icon: <Crown size={20} />, label: "Luxury Collection", color: "#C5A059" };
    case 'project': return { icon: <Landmark size={20} />, label: "Off-Plan Projects", color: "#6366f1" };
    case 'Commercial': return { icon: <Briefcase size={20} />, label: "Commercial Assets", color: "#0ea5e9" };
    case 'Rent': return { icon: <Building size={20} />, label: "Rental Registry", color: "#10b981" };
    default: return { icon: <Sparkles size={20} />, label: "Property Registry", color: "#C5A059" };
  }
};

const PropertyDetails = ({ mode = "all" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const config = getPageConfig(mode);

  // Initialize filters based on the page "mode"
  const [filters, setFilters] = useState({
    propertyname: "", price: "", bedroom: "", city: "",
    // Logical schema filters
    segment: mode === "Luxury" ? "Luxury" : "",
    propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
    usageType: mode === "Commercial" ? "Commercial" : "",
    listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
  });

  // Re-run filters if user navigates between pages (e.g., Buy -> Rent)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      segment: mode === "Luxury" ? "Luxury" : "",
      propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
      usageType: mode === "Commercial" ? "Commercial" : "",
      listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
    }));
    setCurrentPage(1);
  }, [mode]);

  const limit = 6;
  const { propertyList, loading, pagination, deletePropertyById } = useGetAllProperty(currentPage, limit, filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${isDark ? 'bg-[#0F1219] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className={`mb-10 p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl text-white shadow-lg" style={{ backgroundColor: config.color }}>
                  {config.icon}
                </div>
                <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                  {config.label.split(' ')[0]} <span style={{ color: config.color }}>{config.label.split(' ')[1]}.</span>
                </h1>
              </div>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                {pagination?.totalItems || 0} Assets found in {mode} registry
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                <input 
                  placeholder="Search..."
                  value={filters.propertyname}
                  name="propertyname"
                  onChange={handleFilterChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-full border text-xs font-bold tracking-wider outline-none focus:ring-1 transition-all ${isDark ? 'bg-[#0F1219] border-white/10' : 'bg-slate-50 border-slate-200'}`}
                  style={{'--tw-ring-color': config.color}}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] border ${isDark ? 'bg-[#161B26] border-white/10' : 'bg-white border-slate-200'}`}
              >
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3].map(i => <div key={i} className={`h-[500px] rounded-[3rem] animate-pulse ${isDark ? 'bg-[#161B26]' : 'bg-slate-200'}`} />)}
           </div>
        ) : propertyList.length === 0 ? (
          <EmptyStateModel 
            title={`No ${mode} Assets`}
            message="We couldn't find any properties matching this category."
            onResetFilters={() => setCurrentPage(1)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => (
              <motion.div 
                layout key={property._id}
                className={`group rounded-[3rem] border overflow-hidden transition-all duration-500 hover:shadow-2xl ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100'}`}
              >
                {/* Media Stack */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute top-5 left-5 z-10 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-full">
                      {property.propertytype}
                    </span>
                    {property.segment === 'Luxury' && (
                       <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                        <Crown size={10} className="text-amber-500"/> Luxury
                       </span>
                    )}
                  </div>
                  
                  <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} className="h-full w-full">
                    {property.image?.map((img, i) => (
                      <SwiperSlide key={i}><img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" /></SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Content Block */}
                <div className="p-8">
                  <h3 className="text-2xl font-black italic tracking-tighter mb-1 truncate">{property.propertyname}</h3>
                  <p className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
                    <MapPin size={12} style={{ color: config.color }} /> {property.city}
                  </p>

                  <div className="text-3xl font-black tracking-tighter mb-8" style={{ color: config.color }}>
                    AED {property.price?.toLocaleString()}
                  </div>

                  {/* Dynamic Stats: Project vs Property */}
                  {property.propertyListingType === 'project' ? (
                     <div className={`p-5 rounded-[2rem] mb-8 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-slate-500">Handover</span>
                            <span className="text-[10px] font-black uppercase">{property.deliveryDate || 'TBA'}</span>
                        </div>
                        <div className="h-[1px] bg-white/5 my-3" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-slate-500">Developer</span>
                            <span className="text-[10px] font-black uppercase text-amber-500">{property.developerName}</span>
                        </div>
                     </div>
                  ) : (
                    <div className={`grid grid-cols-2 gap-4 p-5 rounded-[2rem] mb-8 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Bed size={14} className="opacity-30"/> {property.bedroom}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Bath size={14} className="opacity-30"/> {property.bathroom}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Ruler size={14} className="opacity-30"/> {property.squarefoot}</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase"><Layers size={14} className="opacity-30"/> Lvl {property.floor}</div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/updatepropertydetails/${property._id}`)} className="flex-1 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-white/5 transition-all">Edit</button>
                    <button onClick={() => deletePropertyById(property._id)} className="px-6 py-4 rounded-full bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;