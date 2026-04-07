import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Bed, Ruler, Bath, Phone, Mail, 
  ArrowUpRight, Search, Filter, LayoutGrid, List,
  Building2, Wallet, Tag,
  ArrowRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await http.get("/getlatestproperty");
        if (res.data.success) {
          setLatestProperty(res.data.data);
          setFilteredProperties(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = latestProperty;
    if (activeFilter !== "All") {
      result = result.filter(p => p.listingtype === activeFilter || p.propertyListingType === activeFilter.toLowerCase());
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.propertyname.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProperties(result);
  }, [activeFilter, searchQuery, latestProperty]);

  if (loading) return null;

  const cardBg = isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-100 shadow-sm';

  return (
    <section className={`py-16 px-6 ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER & FILTERS --- */}
         <div className="flex flex-col md:flex-row justify-between  items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
             <div className="h-1 w-12  bg-amber-500 rounded-full" />
             <h2 className={`text-2xl    md:text-4xl font-serif`}>
                Latest <span className="text-amber-500 italic">Properties</span>
             </h2>
          </div>
          <button 
            onClick={() => navigate("/propertylisting")}
            className="px-8 py-3 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-3 hover:bg-black transition-all shadow-lg"
          >
            View All Properties <ArrowRight size={16} />
          </button>
        </div>

      
        {/* --- PROPERTY GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property, idx) => (
              <motion.div
                layout
                key={property._id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group rounded-[2.5rem] border overflow-hidden transition-all hover:shadow-2xl ${cardBg}`}
              >
                {/* Image Section */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={property.image?.[0]}
                    alt={property.propertyname}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Floating Badges */}
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-amber-500 text-[9px] font-black uppercase rounded-lg border border-amber-500/30">
                      {property.propertytype}
                    </span>
                    <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black uppercase rounded-lg shadow-lg">
                      {property.propertyListingType === 'project' ? 'Off-Plan' : property.listingtype}
                    </span>
                  </div>

                  {/* Quick Connect Bar */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    <button className="p-3 bg-[#25D366] text-white rounded-xl hover:scale-110 transition-all"><FaWhatsapp size={16} /></button>
                    <button className="p-3 bg-blue-500 text-white rounded-xl hover:scale-110 transition-all"><Phone size={16} /></button>
                    <button className="p-3 bg-amber-500 text-black rounded-xl hover:scale-110 transition-all"><Mail size={16} /></button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={12} className="text-amber-500 shrink-0" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">{property.city}, UAE</p>
                  </div>

                  <h3 className={`text-xl font-bold leading-tight mb-4 group-hover:text-amber-500 transition-colors truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {property.propertyname}
                  </h3>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-500/10 mb-6">
                    <div className="text-center border-r border-slate-500/10">
                      <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Beds</p>
                      <div className="flex items-center justify-center gap-1">
                        <Bed size={12} className="text-amber-500"/>
                        <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bedroom || 'S'}</span>
                      </div>
                    </div>
                    <div className="text-center border-r border-slate-500/10">
                      <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Baths</p>
                      <div className="flex items-center justify-center gap-1">
                        <Bath size={12} className="text-amber-500"/>
                        <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bathroom || 0}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">Area</p>
                      <div className="flex items-center justify-center gap-1">
                        <Ruler size={12} className="text-amber-500"/>
                        <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.squarefoot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-tighter mb-0.5">Premium Listing Price</p>
                      <p className="text-2xl font-black text-amber-500 tracking-tighter">
                        <span className="text-[10px] mr-1">AED</span>
                        {Number(property.price).toLocaleString()}
                      </p>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                      <ArrowUpRight size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* --- NO RESULTS --- */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-slate-500/20 rounded-[3rem]">
            <Search size={48} className="mx-auto text-slate-500 mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">No matching assets found</h3>
            <p className="text-xs text-slate-600 mt-2">Try adjusting your filters or search query</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default AgentPropertyList;