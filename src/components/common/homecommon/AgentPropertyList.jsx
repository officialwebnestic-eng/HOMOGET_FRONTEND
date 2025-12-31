import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  ArrowUpRight, 
  Heart,
  Navigation,
  Sparkles
} from "lucide-react";

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

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="relative">
        <div className="w-20 h-20 border-2 border-blue-500/20 rounded-full border-t-blue-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 bg-blue-500/10 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <section className={`py-24 px-6 transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="relative mb-20 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-blue-500" />
              <span className="text-blue-500 font-bold tracking-[0.3em] text-xs uppercase">Curated Selection</span>
            </div>
            <h2 className={`text-5xl md:text-7xl font-serif italic ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Latest <span className="font-sans not-italic font-black uppercase tracking-tighter">Listings</span>
            </h2>
          </motion.div>
          
          <div className={`absolute -right-20 -top-20 opacity-[0.03] pointer-events-none ${isDark ? 'text-white' : 'text-black'}`}>
            <Navigation size={400} />
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {latestProperty.map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative md:col-span-6 lg:col-span-4 rounded-3xl overflow-hidden border transition-all duration-500 ${
                isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
              } hover:border-blue-500/50`}
            >
              {/* Image Hero Container */}
              <div className="relative h-[450px] overflow-hidden">
                <img
                  src={property.image?.[0] || "https://images.unsplash.com/photo-1600585154340-be6191da95b8?auto=format&fit=crop&w=800"}
                  alt={property.propertyname}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                
                {/* Floating UI */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded">
                      {property.listingtype || "Premier"}
                    </span>
                    {idx === 0 && (
                      <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1">
                        <Sparkles size={10} /> New
                      </span>
                    )}
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all">
                    <Heart size={18} />
                  </button>
                </div>

                {/* Bottom Image Info */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="mb-2">
                         <span className="text-4xl font-black tracking-tighter">
                            ₹{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(property.price / 100000)}L
                         </span>
                         <span className="text-sm opacity-60 ml-2 font-medium">Starting from</span>
                    </div>
                    <h3 className="text-2xl font-bold leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                        {property.propertyname}
                    </h3>
                </div>
              </div>

              {/* Technical Detail Bar */}
              <div className={`p-6 flex items-center justify-between border-t transition-colors ${
                isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/50'
              }`}>
                <div className="flex gap-6">
                   <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Beds</span>
                        <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bedroom.toString().padStart(2, '0')}</span>
                   </div>
                   <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Baths</span>
                        <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bathroom.toString().padStart(2, '0')}</span>
                   </div>
                   <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Area</span>
                        <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.squarefoot}</span>
                   </div>
                </div>

                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-full text-white cursor-pointer shadow-lg shadow-blue-500/20"
                >
                    <ArrowUpRight size={24} />
                </motion.div>
              </div>

              {/* Location Tag */}
              <div className={`px-6 py-4 flex items-center gap-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <MapPin size={14} className="text-blue-500" />
                <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {property.city}, {property.state}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="mt-20 text-center">
            <button className={`px-12 py-5 rounded-full border-2 font-bold uppercase tracking-[0.2em] text-sm transition-all ${
                isDark 
                ? 'border-white text-white hover:bg-white hover:text-black' 
                : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
            }`}>
                View Full Collection
            </button>
        </div>
      </div>
    </section>
  );
};

export default AgentPropertyList;