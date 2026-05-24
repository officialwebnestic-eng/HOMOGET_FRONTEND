import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, ChevronDown, Phone, MessageSquare, Building2, 
  Calendar, TrendingUp, Clock, Sparkles, Eye, Award, Star, User,
  Mail,
  Share2,
  Heart
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";

// Sample placeholder data for when no real data is available
const sampleOffPlanProjects = [
  {
    _id: "sample_1",
    propertyname: "Emaar Beachfront Sunrise Tower",
    propertyTitleEn: "Emaar Beachfront Sunrise Tower",
    category: "Off-Plan",
    developerName: "Emaar Properties",
    city: "Dubai Harbour",
    community: "Dubai Harbour",
    price: 1850000,
    image: ["https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000"],
    deliveryDate: "Q4 2026",
    paymentPlan: "60/40 Post-Handover",
    completionPercentage: 45,
    propertytype: "Apartments",
    agentId: { 
      phone: "+971585919585",
      name: "Ahmed Al Mansouri",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4.9
    }
  },
  // ... rest of samples with agent info
];

const OffPlan = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "Off-Plan",
    developerName: "",
    city: "",
    propertytype: "",
  });

  const { propertyList = [], loading } = useGetAllProperty(1, 100, filters);

  const filterConfig = [
    { key: "developerName", label: "Developer", placeholder: "All Developers" },
    { key: "city", label: "Location", placeholder: "All Areas" },
    { key: "propertytype", label: "Property Type", placeholder: "All Types" },
  ];

  const getUniqueOptions = (fieldName) => {
    if (!propertyList || propertyList.length === 0) return [];
    const values = propertyList
      .filter(item => item.category === "Off-Plan")
      .map(item => item[fieldName])
      .filter(Boolean);
    return [...new Set(values)].sort();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "Off-Plan",
      developerName: "",
      city: "",
      propertytype: "",
    });
  };

  const offPlanProperties = useMemo(() => {
    if (!propertyList || propertyList.length === 0) return [];
    const filtered = propertyList.filter(item => item.category === "Off-Plan");
    return filtered.length > 0 ? filtered : sampleOffPlanProjects;
  }, [propertyList]);

  const hasRealData = propertyList?.some(item => item.category === "Off-Plan");

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      
      {/* ========== SIMPLE HEADER SECTION ========== */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-amber-500"></div>
              <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em]">Invest Early</span>
            </div>
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Latest <span className="text-amber-500">Off-Plan</span> Projects
            </h1>
            <p className={`text-sm mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Discover Dubai's most anticipated new developments with flexible payment plans
            </p>
          </div>
          
          {!hasRealData && offPlanProperties.length > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-500 text-[8px] font-bold uppercase">Sample Projects</span>
            </div>
          )}
        </div>
      </div>

      {/* ========== FILTER BAR ========== */}
      <div className="max-w-7xl mx-auto px-6">
        <div className={`p-5 rounded-2xl border shadow-lg backdrop-blur-xl ${isDark ? 'bg-neutral-900/80 border-white/10' : 'bg-white/95 border-slate-200'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filterConfig.map((field) => (
              <div key={field.key} className="relative">
                <label className={`text-[7px] font-black uppercase tracking-wider mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {field.label}
                </label>
                <select
                  name={field.key}
                  value={filters[field.key]}
                  onChange={handleFilterChange}
                  className={`w-full pl-3 pr-7 py-2.5 rounded-lg text-[10px] font-medium appearance-none outline-none border transition-all cursor-pointer ${isDark ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-black'}`}
                >
                  <option value="">{field.placeholder}</option>
                  {getUniqueOptions(field.key).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 bottom-3 text-amber-500 pointer-events-none" />
              </div>
            ))}
            
            <div className="flex gap-2 items-end">
              <button 
                onClick={clearFilters}
                className={`flex-1 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-black'}`}
              >
                Clear
              </button>
              <button className="flex-1 bg-amber-500 text-black text-[9px] font-bold uppercase rounded-lg py-2.5 hover:bg-amber-600 transition-all shadow-sm">
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PROJECTS GRID ========== */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Loading Projects...</span>
          </div>
        ) : offPlanProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offPlanProperties.map((project, idx) => {
              const agentName = project.agentId?.name || "Property Consultant";
              const agentImage = project.agentId?.profilePhoto;
              const agentRating = project.agentId?.rating || 4.8;
              
              return (
                <motion.div 
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/property/${project._id}`, { state: { propertyData: project } })}
                  className={`group rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${isDark ? 'bg-neutral-900 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 hover:shadow-lg'}`}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt={project.propertyname} 
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[8px] font-bold uppercase">
                        Off-Plan
                      </span>
                      {project.completionPercentage && (
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[8px] font-bold">
                          {project.completionPercentage}%
                        </span>
                      )}
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/80 backdrop-blur-sm text-white text-[8px] font-bold uppercase">
                        {project.propertytype || "Property"}
                      </span>
                    </div>
                    
                   
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Developer Name */}
                    <p className="text-amber-500 text-[9px] font-bold uppercase tracking-wider mb-1">
                      {project.developerName || project.developerId?.companyName || "Premium Developer"}
                    </p>
                    
                    {/* Project Name */}
                    <h3 className={`text-base font-bold mb-2 line-clamp-1 group-hover:text-amber-500 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {project.propertyname || project.propertyTitleEn}
                    </h3>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin size={10} className="text-amber-500" />
                      <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {project.city || project.community || "Dubai"}, UAE
                      </span>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-3 py-2 mb-3 border-t border-b border-slate-200 dark:border-white/10">
                      <div>
                        <p className="text-[7px] font-bold uppercase text-slate-400">Handover</p>
                        <p className="text-[11px] font-semibold">{project.deliveryDate || "Q4 2026"}</p>
                      </div>
                      <div>
                        <p className="text-[7px] font-bold uppercase text-slate-400">Payment</p>
                        <p className="text-[11px] font-semibold truncate">{project.paymentPlan || "Flexible"}</p>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[6px] font-bold uppercase text-slate-400">Starting From</p>
                        <p className="text-base font-bold text-amber-500">
                          AED {project.price?.toLocaleString()}
                        </p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-[8px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center gap-1">
                        <Eye size={10} /> View
                      </button>
                    </div>

                   <div className="flex items-center gap-3 py-3 mt-2 border-t border-gray-100 dark:border-white/5">
                                     <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
                                       {agentImage ? (
                                         <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
                                       ) : (
                                         <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                           {agentName.charAt(0)}
                                         </div>
                                       )}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                       <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Listed by</p>
                                       <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{agentName}</p>
                                     </div>
                                     <div className="flex items-center gap-1">
                                       <Star size={12} className="text-amber-500 fill-amber-500" />
                                       <span className="text-[10px] font-bold">{agentRating}</span>
                                     </div>
                                   </div>
                                      {/* Footer Action Bar */}
                                                     <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-white/5">
                                                       <div className="flex gap-4">
                                                         <button
                                                           onClick={(e) => handleWhatsApp(e, property)}
                                                           className="text-green-500 hover:scale-110 transition-transform"
                                                           title="WhatsApp Agent"
                                                         >
                                                           <FaWhatsapp size={25  } />
                                                         </button>
                                                         <button
                                                           onClick={(e) => handleCall(e, property.agentId?.phone || property.agentPhone)}
                                                           className="text-blue-500 hover:scale-110 transition-transform"
                                                           title="Call Agent"
                                                         >
                                                           <Phone size={25} />
                                                         </button>
                                                         <button
                                                           onClick={(e) => handleEmail(e, property)}
                                                           className="text-amber-500 hover:scale-110 transition-transform"
                                                           title="Email Agent"
                                                         >
                                                           <Mail size={25} />
                                                         </button>
                                                       </div>
                                                       <div className="flex items-center gap-4">
                                                         <Share2
                                                           size={18}
                                                           className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
                                                           onClick={(e) => {
                                                             e.stopPropagation();
                                                             navigator.share?.({
                                                               title: propertyTitle,
                                                               text: `Check out this property: ${propertyTitle}`,
                                                               url: window.location.href,
                                                             });
                                                           }}
                                                         />
                                                         <Heart
                                                           size={18}
                                                           className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                           onClick={(e) => {
                                                             e.stopPropagation();
                                                           }}
                                                         />
                                                       </div>
                                                     </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className={`inline-flex p-5 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} mb-3`}>
              <Building2 size={36} className="text-slate-400" />
            </div>
            <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No Off-Plan Projects Found</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Try adjusting your filters or check back later.
            </p>
            <button 
              onClick={clearFilters}
              className="mt-4 px-5 py-1.5 rounded-full bg-amber-500 text-black text-[9px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* ========== CTA SECTION ========== */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className={`p-8 rounded-2xl text-center bg-gradient-to-r ${isDark ? 'from-amber-900/15 to-black' : 'from-amber-50 to-white'} border border-amber-500/20`}>
          <Sparkles size={24} className="mx-auto text-amber-500 mb-2" />
          <h3 className={`text-xl font-serif font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Invest in Dubai's Future
          </h3>
          <p className={`text-xs mb-4 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Get exclusive access to off-plan projects and priority unit selection.
          </p>
          <Link to="/real-estate-agents" className="px-5 py-2 rounded-full bg-amber-500 text-black font-bold uppercase text-[9px] tracking-wider hover:bg-amber-600 transition-all shadow-sm">
            Contact Advisor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OffPlan;