import React, { useState, useEffect } from 'react';
import {
  Pencil, Trash2, MapPin, Bed, Bath, Ruler, 
  Layers, Search, Filter, ChevronLeft, ChevronRight, 
  Sparkles, Crown, Landmark, Briefcase, Building,
  ShieldCheck, Wallet, Calendar, Phone, Mail, ExternalLink
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import useGetAllProperty from '../../../hooks/useGetAllProperty';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { useTheme } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import EmptyStateModel from '../../../model/EmptyStateModel';

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

  const [filters, setFilters] = useState({
    propertyname: "", price: "", bedroom: "", city: "",
    segment: mode === "Luxury" ? "Luxury" : "",
    propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
    listingtype: (mode === "Rent" || mode === "Buy") ? mode : "",
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      segment: mode === "Luxury" ? "Luxury" : "",
      propertyListingType: mode === "project" ? "project" : (mode === "all" ? "" : "property"),
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
        
        {/* Header & Advanced Filter Section */}
        <div className={`mb-10 p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-2xl text-white shadow-lg" style={{ backgroundColor: config.color }}>{config.icon}</div>
                <h1 className="text-3xl font-serif italic tracking-tighter capitalize">
                  {config.label.split(' ')[0]} <span style={{ color: config.color }}>{config.label.split(' ')[1]}</span>
                </h1>
              </div>
              <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.4em]">
                {pagination?.totalItems || 0} SECURED ASSETS IN {propertyList[0]?.city || 'DUBAI'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                <input 
                  placeholder="Filter by Asset Name..."
                  name="propertyname"
                  value={filters.propertyname}
                  onChange={handleFilterChange}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 transition-all ${isDark ? 'bg-[#0F1219] border-white/10' : 'bg-slate-50 border-slate-200'}`}
                  style={{'--tw-ring-color': config.color}}
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${showFilters ? 'bg-amber-500 border-amber-500 text-black' : (isDark ? 'bg-[#161B26] border-white/10' : 'bg-white border-slate-200')}`}
              >
                <Filter size={14} /> {showFilters ? 'Hide Filters' : 'Advanced Filters'}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
                  {['Dubai', 'Abu Dhabi', 'Sharjah'].map(city => (
                    <button key={city} onClick={() => handleFilterChange({target: {name: 'city', value: filters.city === city ? '' : city}})}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${filters.city === city ? 'bg-amber-500 text-black border-amber-500' : 'border-white/5 hover:border-amber-500'}`}
                    >{city}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gallery Grid */}
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3].map(i => <div key={i} className={`h-[500px] rounded-[3rem] animate-pulse ${isDark ? 'bg-[#161B26]' : 'bg-slate-200'}`} />)}
           </div>
        ) : propertyList.length === 0 ? (
          <EmptyStateModel title="No Assets Found" message="Refine your criteria or contact our concierge." onResetFilters={() => setFilters({propertyname: ""})} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyList.map((property) => (
              <motion.div 
                layout key={property._id}
                onClick={() => navigate(`/property/${property._id}`)}
                className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-700 cursor-pointer hover:shadow-2xl ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100'}`}
              >
                {/* Media Stack */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                      {property.listingtype}
                    </span>
                    {property.isOffPlan && (
                       <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/20">
                        Off-Plan
                       </span>
                    )}
                  </div>
                  
                  <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} className="h-full w-full">
                    {property.image?.map((img, i) => (
                      <SwiperSlide key={i}><img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" /></SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Floating Agent Connect */}
                  <div className="absolute bottom-4 right-4 z-20 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-all duration-500">
                    <a href={`https://wa.me/${property.agentId?.phone}`} className="p-3 bg-green-500 text-white rounded-xl shadow-xl hover:scale-110 transition-transform"><FaWhatsapp size={16}/></a>
                    <a href={`tel:${property.agentId?.phone}`} className="p-3 bg-blue-500 text-white rounded-xl shadow-xl hover:scale-110 transition-transform"><Phone size={16}/></a>
                    <a href={`mailto:${property.agentId?.email}`} className="p-3 bg-amber-500 text-black rounded-xl shadow-xl hover:scale-110 transition-transform"><Mail size={16}/></a>
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif italic tracking-tighter truncate w-2/3">{property.propertyname}</h3>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Trakheesi</p>
                      <p className="text-[9px] font-bold text-amber-500">{property.trakheesiNumber}</p>
                    </div>
                  </div>
                  
                  <p className="flex items-center gap-1 text-[9px] text-slate-500 font-black uppercase tracking-widest mb-6">
                    <MapPin size={10} className="text-amber-500" /> {property.community}, {property.city}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-xs font-serif text-slate-500">AED</span>
                    <span className="text-3xl font-serif italic text-amber-500">{property.price?.toLocaleString()}</span>
                    <span className="text-[8px] font-black uppercase text-slate-500 ml-2">{property.priceUnit}</span>
                  </div>

                  {/* Schema Conditional Details */}
                  {property.isOffPlan ? (
                     <div className={`p-5 rounded-2xl space-y-3 mb-8 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
                        <div className="flex justify-between items-center text-[9px] font-black uppercase">
                            <span className="text-slate-500 flex items-center gap-1"><Calendar size={12}/> Handover</span>
                            <span>{property.deliveryDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-black uppercase">
                            <span className="text-slate-500 flex items-center gap-1"><Landmark size={12}/> Developer</span>
                            <span className="text-amber-500">{property.developerId?.companyName || 'Elite Dev'}</span>
                        </div>
                        <div className="w-full bg-white/5 h-[2px] overflow-hidden rounded-full">
                           <div className="bg-amber-500 h-full" style={{width: `${property.completionPercentage}%`}} />
                        </div>
                     </div>
                  ) : (
                    <div className={`grid grid-cols-2 gap-4 p-5 rounded-2xl mb-8 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter"><Bed size={12} className="text-amber-500"/> {property.bedroom} Bed</div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter"><Bath size={12} className="text-amber-500"/> {property.bathroom} Bath</div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter"><Ruler size={12} className="text-amber-500"/> {property.squarefoot} ft²</div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter"><ShieldCheck size={12} className="text-amber-500"/> {property.ownerShipType}</div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/updatepropertydetails/${property._id}`); }} 
                      className="flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 hover:bg-amber-500 hover:text-black transition-all"
                    >Manage Asset</button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePropertyById(property._id); }} 
                      className="px-5 py-4 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                    ><Trash2 size={14}/></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-4 rounded-full border border-white/10 hover:bg-amber-500 transition-all"><ChevronLeft size={20}/></button>
          <span className="font-serif italic text-xl">Page {currentPage} of {pagination?.totalPages || 1}</span>
          <button onClick={() => setCurrentPage(p => p + 1)} className="p-4 rounded-full border border-white/10 hover:bg-amber-500 transition-all"><ChevronRight size={20}/></button>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetails;