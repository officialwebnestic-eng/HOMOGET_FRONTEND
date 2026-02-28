import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
import { MapPin, Bed, Ruler, Bath, Phone, Mail, ArrowRight, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await http.get("/getlatestproperty");
        if (res.data.success) setLatestProperty(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) return null;

  return (
    <section className={` px-6 mb-5 md:mb-10 ${isDark ? 'bg-[#0a0a0c] ' : 'bg-gray-50'} `}>
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION 1: ELITE SELECTION (Top 3 Large Cards) */}
        <h2 className={`text-4xl md:text-5xl font-serif mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Featured <span className="text-amber-500 italic">Living</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {(latestProperty || []).slice(0, 3).map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative h-[520px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl bg-zinc-900 cursor-pointer"
            >
              <img
                src={property.image?.[0]}
                alt={property.propertyname}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent" />

              {/* Top Left Badges */}
              <div className="absolute top-8 left-8 flex gap-2 z-20">
                <span className="px-4 py-1.5 bg-amber-500 text-black text-[9px] font-black uppercase rounded-lg shadow-xl">
                  {property.propertytype || "RESIDENCE"}
                </span>
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/20">
                  {property.propertyListingType === 'project' ? 'Off-Plan' : property.listingtype || 'Ready'}
                </span>
              </div>

              {/* VERTICAL ACTION ICONS (Top Right) */}
              <div className="absolute top-8 right-6 flex flex-col gap-3 z-30">
                <div className="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg"><FaWhatsapp size={20} /></div>
                <div className="w-10 h-10 bg-[#3b82f6] text-white rounded-full flex items-center justify-center shadow-lg"><Phone size={18} fill="currentColor" /></div>
                <div className="w-10 h-10 bg-amber-500 text-black rounded-full flex items-center justify-center shadow-lg"><Mail size={18} /></div>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-8 left-8 right-8 z-10">
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{property.city}, UAE</p>
                <h3 className="text-2xl font-serif text-white leading-tight mb-4 group-hover:text-amber-400 transition-colors">{property.propertyname}</h3>
                
                <div className="flex items-center justify-between mb-4">
                   <p className="text-xl font-bold text-white uppercase tracking-tighter">
                     AED {Number(property.price).toLocaleString()}
                   </p>
                   <button className="w-11 h-11 bg-amber-500 rounded-full flex items-center justify-center text-black shadow-lg"><ArrowRight size={22} /></button>
                </div>

                <div className="flex items-center gap-5 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-1.5"><Bed size={14} className="text-amber-500" /><span className="text-xs font-bold text-white/80">{property.bedroom || 0}</span></div>
                  <div className="flex items-center gap-1.5"><Bath size={14} className="text-amber-500" /><span className="text-xs font-bold text-white/80">{property.bathroom || 0}</span></div>
                  <div className="flex items-center gap-1.5"><Ruler size={14} className="text-amber-500" /><span className="text-[10px] font-bold text-white/80 uppercase">{property.squarefoot} SQFT</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* SECTION 2: MARKET INSIGHTS (Properties 4 onwards) */}
        {latestProperty.length > 3 && (
          <div className="mt-10">
            <h2 className={`text-2xl font-serif mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Market <span className="text-amber-500 italic">Insights</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestProperty.slice(3, 12).map((property, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 10 }}
                  className={`group p-4 rounded-[2rem] flex items-center gap-5 cursor-pointer transition-all shadow-lg border ${isDark ? 'bg-[#141417] border-white/5 hover:border-amber-500' : 'bg-white border-gray-100 hover:border-amber-500'}`}
                >
                  {/* Small Thumb Image */}
                  <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden shrink-0 relative bg-zinc-800">
                    <img src={property.image?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    <div className="absolute bottom-1 left-1 bg-amber-500 text-[7px] font-black px-1.5 py-0.5 rounded text-black uppercase">
                       {property.propertyListingType === 'project' ? 'Off-Plan' : 'Ready'}
                    </div>
                  </div>
                  
                  {/* Small Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm mb-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{property.propertyname}</h4>
                    <div className="flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span className={`text-[10px] font-black uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{property.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-amber-500 font-bold text-sm">AED {Number(property.price).toLocaleString()}</p>
                      <ChevronRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AgentPropertyList;