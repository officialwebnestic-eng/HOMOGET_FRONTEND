import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  MapPin, ChevronDown, Phone, MessageSquare, Building2, 
  Calendar, TrendingUp, Clock, Sparkles, Eye, Award, Star, User,
  Mail, Share2, Heart, Loader2,HelpCircle 
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import useGetAllProperty from "../hooks/useGetAllProperty";
import LocationSearch from "../components/admin/Property/LocationSearch";
import { http } from "../axios/axios";

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
      profilePhoto: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 4.9
    }
  },
  {
    _id: "sample_2",
    propertyname: "Damac Lagoons - Malibu Bay",
    propertyTitleEn: "Damac Lagoons - Malibu Bay",
    category: "Off-Plan",
    developerName: "Damac Properties",
    city: "Dubai South",
    community: "Damac Lagoons",
    price: 1500000,
    image: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000"],
    deliveryDate: "Q2 2027",
    paymentPlan: "70/30 Post-Handover",
    completionPercentage: 30,
    propertytype: "Villas",
    agentId: { 
      phone: "+971585919585",
      name: "Sarah Al Maktoum",
      profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 4.7
    }
  }
];

const OffPlan = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [loadingDevelopers, setLoadingDevelopers] = useState(false);

  const [filters, setFilters] = useState({
    category: "Off-Plan",
    developerName: "",
    locationName: "",
  });

  const { propertyList = [], loading } = useGetAllProperty(1, 100, filters);

  // ✅ Fetch developers on component mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoadingDevelopers(true);
        const response = await http.get("/developers");
        if (response.data.success) {
          const allDevelopers = response.data.data;
          setDevelopers(allDevelopers);
        }
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setLoadingDevelopers(false);
      }
    };
    fetchDevelopers();
  }, []);

  // ✅ Get unique developer names from the API response
  const getDeveloperOptions = () => {
    if (developers.length > 0) {
      return developers.map(dev => dev.companyName).filter(Boolean);
    }
    // Fallback: get from property list
    if (!propertyList || propertyList.length === 0) return [];
    const values = propertyList
      .filter(item => item.category === "Off-Plan")
      .map(item => item.developerName || item.developerId?.companyName)
      .filter(Boolean);
    return [...new Set(values)].sort();
  };

  // ✅ Handle location selection from LocationSearch
  const handleLocationSelect = (location) => {
    if (location) {
      setFilters(prev => ({ 
        ...prev, 
        locationName: location.name,
      }));
    } else {
      setFilters(prev => ({ 
        ...prev, 
        locationName: "",
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "Off-Plan",
      developerName: "",
      locationName: "",
    });
  };

  const offPlanProperties = useMemo(() => {
    if (!propertyList || propertyList.length === 0) return [];
    const filtered = propertyList.filter(item => item.category === "Off-Plan");
    return filtered.length > 0 ? filtered : sampleOffPlanProjects;
  }, [propertyList]);

  const hasRealData = propertyList?.some(item => item.category === "Off-Plan");

  // ✅ WhatsApp handler
  const handleWhatsApp = (e, property) => {
    e.stopPropagation();
    const managementNo = "971585852283";
    const agentNo = property.agentId?.phone?.replace(/\s+/g, "") || "971500000000";
    const propertyTitle = property.propertyTitleEn || property.propertyname || "Property";
    const price = property.price ? `AED ${Number(property.price).toLocaleString()}` : "Contact for price";
    const location = property.city || property.community || "Dubai";
    const propertyUrl = `${window.location.origin}/property/${property._id}`;
    
    const msg = encodeURIComponent(
      `🏢 *Property Inquiry - Homoget*\n\n` +
      `🏠 *${propertyTitle}*\n` +
      `💰 Price: ${price}\n` +
      `📍 Location: ${location}\n` +
      `🔗 Link: ${propertyUrl}\n\n` +
      `I'm interested in this off-plan property. Please share more details.`
    );
    
    window.open(`https://wa.me/${managementNo}?text=${msg}`, "_blank");
  };

  // ✅ Call handler
  const handleCall = (e, phone) => {
    e.stopPropagation();
    window.location.href = `tel:${phone || "+971500000000"}`;
  };

  // ✅ Email handler
  const handleEmail = (e, property) => {
    e.stopPropagation();
    const propertyTitle = property.propertyTitleEn || property.propertyname || "Property";
    const subject = `Inquiry: ${propertyTitle}`;
    const body = `I'm interested in this off-plan property:\n\n${propertyTitle}\nPrice: AED ${Number(property.price).toLocaleString()}\nLocation: ${property.city || property.community || "Dubai"}\n\nPlease contact me for more details.`;
    window.location.href = `mailto:info@homoget.ae?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

// =============================================
// REPLACE the entire return statement with this
// =============================================

return (
  <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
    
    {/* ========== HEADER SECTION ========== */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6 sm:pb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <div className="w-6 sm:w-8 h-px bg-amber-500"></div>
            <span className="text-amber-500 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.25em] sm:tracking-[0.3em]">
              Invest Early
            </span>
          </div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Latest <span className="text-amber-500">Off-Plan</span> Projects
          </h1>
          <p className={`text-xs sm:text-sm mt-1.5 sm:mt-2 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Discover Dubai's most anticipated new developments with flexible payment plans
          </p>
        </div>
        
        {!hasRealData && offPlanProperties.length > 0 && (
          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
            <span className="text-amber-500 text-[7px] sm:text-[8px] font-bold uppercase">Sample Projects</span>
          </div>
        )}
      </div>
    </div>

   {/* ========== FILTER BAR - Better Alignment ========== */}
<div className="max-w-6xl mx-auto px-4 sm:px-6">
  <div className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border shadow-lg backdrop-blur-xl ${isDark ? 'bg-neutral-900/80 border-white/10' : 'bg-white/95 border-slate-200'}`}>
    
    {/* Filter Row - Better Grid Layout */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
      
      {/* Developer Dropdown */}
      <div className="relative">
        <label className={`text-[7px] sm:text-[8px] font-black uppercase tracking-wider mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Developer
        </label>
        <select
          name="developerName"
          value={filters.developerName}
          onChange={(e) => setFilters(prev => ({ ...prev, developerName: e.target.value }))}
          className={`w-full pl-3 pr-7 py-2.5 rounded-lg text-[10px] sm:text-xs font-medium appearance-none outline-none border transition-all cursor-pointer ${isDark ? 'bg-black border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-black'}`}
        >
          <option value="">All Developers</option>
          {loadingDevelopers ? (
            <option value="" disabled>Loading...</option>
          ) : (
            getDeveloperOptions().map(dev => (
              <option key={dev} value={dev}>{dev}</option>
            ))
          )}
        </select>
        {loadingDevelopers ? (
          <Loader2 size={12} className="absolute right-3 bottom-3 text-amber-500 animate-spin pointer-events-none" />
        ) : (
          <ChevronDown size={12} className="absolute right-3 bottom-3 text-amber-500 pointer-events-none" />
        )}
      </div>

      {/* Location Search */}
      <div className="relative">
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          initialValue=""
          isDark={isDark}
          required={false}
        />
      </div>

      {/* Clear & Apply Buttons - Better Alignment */}
      <div className="flex gap-2 items-end sm:col-span-2 lg:col-span-1">
        <button 
          onClick={clearFilters}
          className={`flex-1 py-2.5 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-wider transition-all border ${isDark ? 'border-white/10 text-slate-400 hover:text-white hover:border-white/20' : 'border-slate-200 text-slate-500 hover:text-black hover:border-slate-300'}`}
        >
          Clear
        </button>
        <button className="flex-1 bg-amber-500 text-black text-[8px] sm:text-[9px] font-bold uppercase rounded-lg py-2.5 hover:bg-amber-600 transition-all shadow-sm">
          Apply
        </button>
      </div>
    </div>

    {/* Help Text & Project Count */}
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-200/50 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <HelpCircle size={12} className="text-amber-500 flex-shrink-0" />
        <span className={`text-[8px] sm:text-[9px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Need help? Ask our team
        </span>
        <span className="hidden sm:inline text-[8px] text-slate-400">•</span>
        <span className={`text-[8px] sm:text-[9px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {offPlanProperties.length} projects available
        </span>
      </div>
      {filters.developerName || filters.locationName ? (
        <span className={`text-[7px] sm:text-[8px] ${isDark ? 'text-amber-400' : 'text-amber-600'} font-medium`}>
          Filters applied
        </span>
      ) : null}
    </div>
  </div>
</div>

    {/* ========== PROJECTS GRID ========== */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-amber-500">Loading Projects...</span>
        </div>
      ) : offPlanProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {offPlanProperties.map((project, idx) => {
            const agentName = project.agentId?.name || "Property Consultant";
            const agentImage = project.agentId?.profilePhoto;
            const agentRating = project.agentId?.rating || 4.8;
            const propertyTitle = project.propertyTitleEn || project.propertyname;
            
            return (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/property/${project._id}`, { state: { propertyData: project } })}
                className={`group rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer ${isDark ? 'bg-neutral-900 border-white/10 hover:border-amber-500/40' : 'bg-white border-slate-200 hover:shadow-lg'}`}
              >
                {/* Image Section */}
                <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img 
                    src={project.image?.[0] || "https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg"} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={project.propertyname} 
                  />
                  
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500 text-black text-[7px] sm:text-[8px] font-bold uppercase">
                      Off-Plan
                    </span>
                    {project.completionPercentage && (
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[7px] sm:text-[8px] font-bold">
                        {project.completionPercentage}%
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-500/80 backdrop-blur-sm text-white text-[7px] sm:text-[8px] font-bold uppercase">
                      {project.propertytype || "Property"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-4">
                  <p className="text-amber-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider mb-0.5">
                    {project.developerName || project.developerId?.companyName || "Premium Developer"}
                  </p>
                  
                  <h3 className={`text-sm sm:text-base font-bold mb-1.5 line-clamp-1 group-hover:text-amber-500 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {project.propertyname || project.propertyTitleEn}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin size={10} className="text-amber-500 flex-shrink-0" />
                    <span className={`text-[8px] sm:text-[9px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {project.city || project.community || "Dubai"}, UAE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 py-1.5 sm:py-2 mb-2 border-t border-b border-slate-200 dark:border-white/10">
                    <div>
                      <p className="text-[6px] sm:text-[7px] font-bold uppercase text-slate-400">Handover</p>
                      <p className="text-[10px] sm:text-[11px] font-semibold">{project.deliveryDate || "Q4 2026"}</p>
                    </div>
                    <div>
                      <p className="text-[6px] sm:text-[7px] font-bold uppercase text-slate-400">Payment</p>
                      <p className="text-[10px] sm:text-[11px] font-semibold truncate">{project.paymentPlan || "Flexible"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[6px] sm:text-[7px] font-bold uppercase text-slate-400">Starting From</p>
                      <p className="text-sm sm:text-base font-bold text-amber-500">
                        AED {project.price?.toLocaleString()}
                      </p>
                    </div>
                    <button className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500 text-black text-[7px] sm:text-[8px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all flex items-center gap-1">
                      <Eye size={10} /> View
                    </button>
                  </div>

                  {/* Agent Info */}
                  <div className="flex items-center gap-2 py-2 mt-1 border-t border-gray-100 dark:border-white/5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 flex-shrink-0">
                      {agentImage ? (
                        <img src={agentImage} alt={agentName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                          {agentName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400">Listed by</p>
                      <p className={`text-[10px] sm:text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{agentName}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-[9px] sm:text-[10px] font-bold">{agentRating}</span>
                    </div>
                  </div>
                  
                  {/* Footer Action Bar */}
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100 dark:border-white/5">
                    <div className="flex gap-3 sm:gap-4">
                      <button
                        onClick={(e) => handleWhatsApp(e, project)}
                        className="text-green-500 hover:scale-110 transition-transform"
                        title="WhatsApp Agent"
                      >
                        <FaWhatsapp size={18} sm:size={20} />
                      </button>
                      <button
                        onClick={(e) => handleCall(e, project.agentId?.phone || project.agentPhone)}
                        className="text-blue-500 hover:scale-110 transition-transform"
                        title="Call Agent"
                      >
                        <Phone size={18} sm:size={20} />
                      </button>
                      <button
                        onClick={(e) => handleEmail(e, project)}
                        className="text-amber-500 hover:scale-110 transition-transform"
                        title="Email Agent"
                      >
                        <Mail size={18} sm:size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Share2
                        size={16}
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
                        size={16}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <div className={`inline-flex p-4 sm:p-5 rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} mb-3`}>
            <Building2 size={28} sm:size={32} className="text-slate-400" />
          </div>
          <p className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>No Off-Plan Projects Found</p>
          <p className={`text-[10px] sm:text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try adjusting your filters or check back later.
          </p>
          <button 
            onClick={clearFilters}
            className="mt-3 sm:mt-4 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-amber-500 text-black text-[8px] sm:text-[9px] font-bold uppercase tracking-wider hover:bg-amber-600 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>

    {/* ========== CTA SECTION ========== */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
      <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center bg-gradient-to-r ${isDark ? 'from-amber-900/15 to-black' : 'from-amber-50 to-white'} border border-amber-500/20`}>
        <Sparkles size={20} sm:size={24} className="mx-auto text-amber-500 mb-2" />
        <h3 className={`text-lg sm:text-xl font-serif font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Invest in Dubai's Future
        </h3>
        <p className={`text-[10px] sm:text-xs mb-4 max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Get exclusive access to off-plan projects and priority unit selection.
        </p>
        <Link to="/real-estate-agents" className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-amber-500 text-black font-bold uppercase text-[8px] sm:text-[9px] tracking-wider hover:bg-amber-600 transition-all shadow-sm">
          Contact Advisor
        </Link>
      </div>
    </div>
  </div>
);
};

export default OffPlan;