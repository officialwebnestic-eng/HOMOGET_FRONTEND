import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, IndianRupee, Bed, Bath, Ruler, 
  ChevronLeft, ChevronRight, Filter, Sparkles 
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const PropertyListingSection = ({
  propertyList, theme, colors, loading, filters, 
  handleFilterChange, filterFields, getUniqueValues, 
  setFilters, setSearchQuery, setCurrentPage, 
  currentPage, pagination, limit, openModal, handleBuyNow
}) => {
  const isDark = theme === "dark";

  return (
    <div className={`w-full py-20 px-4 transition-colors duration-500 ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- SECTION HEADER --- */}
        <div className="mb-16 text-center space-y-4">
          <motion.span 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]"
          >
            Available Portfolios
          </motion.span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Dream <span className="text-blue-600 italic font-serif font-light lowercase">Properties</span>
          </h2>
        </div>

        {/* --- PREMIUM FILTER BAR --- */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
              <Filter size={14} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest mr-2">Quick Filters</span>
            </div>

            {filterFields.map(({ name, label, icon }) => {
              const options = getUniqueValues(propertyList, name);
              return (
                <div key={name} className="relative group">
                  <select
                    name={name}
                    value={filters[name] || ""}
                    onChange={handleFilterChange}
                    className={`pl-10 pr-8 py-2.5 rounded-full border text-xs font-bold appearance-none transition-all cursor-pointer outline-none
                      ${isDark 
                        ? "bg-slate-900 border-white/10 text-slate-300 hover:border-blue-500/50" 
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-500"}
                    `}
                  >
                    <option value="">{label}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-blue-500 transition-colors">
                    {React.cloneElement(icon, { size: 14 })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- GRID SYSTEM --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fetching Listings...</p>
          </div>
        ) : propertyList.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <div className="relative inline-block mb-8">
               <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
               <img src="https://cdn3d.iconscout.com/3d/premium/thumb/no-house-found-5665724-4721949.png" alt="Empty" className="w-48 h-48 relative z-10 mx-auto" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Matches Found</h3>
            <button
              onClick={() => { setFilters({}); setSearchQuery(""); }}
              className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-blue-700 transition-all"
            >
              Clear All Search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {propertyList.map((property, index) => (
              <motion.div
                key={property._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`group rounded-[2rem] overflow-hidden border transition-all duration-500 ${
                  isDark ? 'bg-slate-900/40 border-white/5 hover:border-blue-500/30' : 'bg-white border-slate-200 hover:border-blue-500 shadow-xl shadow-slate-200/50'
                }`}
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} className="h-full group-hover:scale-105 transition-transform duration-700">
                    {property.image?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} alt="Property" className="w-full h-full object-cover" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* Floating Status Badges */}
                  <div className="absolute top-5 left-5 z-10 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full w-fit">
                      {property.propertytype || "Residential"}
                    </span>
                    <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full w-fit flex items-center gap-1">
                      <Sparkles size={10} /> Verified
                    </span>
                  </div>

                  <div className="absolute bottom-5 right-5 z-10">
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-2xl">
                      <p className="text-xs font-black text-slate-400 uppercase leading-none mb-1">Starting At</p>
                      <p className="text-lg font-black text-blue-600 flex items-center leading-none">
                        <IndianRupee size={16} strokeWidth={3} />
                        {(property.price / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-3">
                    <MapPin size={12} /> {property.city}, {property.state}
                  </div>
                  <h3 className={`text-2xl font-bold tracking-tighter uppercase mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {property.propertyname}
                  </h3>

                  {/* Tech Specs */}
                  <div className={`grid grid-cols-3 gap-4 p-4 rounded-2xl mb-6 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                    <div className="text-center border-r border-white/10">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Beds</p>
                      <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bedroom}</p>
                    </div>
                    <div className="text-center border-r border-white/10">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Baths</p>
                      <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bathroom}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Sq.Ft</p>
                      <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.squarefoot}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleBuyNow(property); }}
                    className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Experience Now
                    <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* --- PREMIUM PAGINATION --- */}
        {!loading && pagination?.totalPages > 1 && (
          <div className="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Viewing {((currentPage - 1) * limit) + 1} — {Math.min(currentPage * limit, pagination.totalItems)} of {pagination.totalItems}
             </p>
             
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/5">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-full text-[10px] font-black transition-all ${
                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListingSection;