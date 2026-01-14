import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize, 
  ArrowUpRight, 
  Heart,
  Navigation,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const accentColor = "#C5A059"; // Dubai Luxury Gold

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
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="w-16 h-16 border-t-2 border-amber-500 rounded-full" 
      />
    </div>
  );

  return (
    <section className={`py-32 px-6 transition-colors duration-1000 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Header */}
        <header className="relative mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="z-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[2px] w-12 bg-amber-500" />
              <span className="text-amber-500 font-black tracking-[0.4em] text-[10px] uppercase">Curated Portfolio</span>
            </div>
            <h2 className={`text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] ${isDark ? 'text-white' : 'text-slate-950'}`}>
              PREMIER <br/>
              <span className="font-serif italic font-light text-amber-600">Listings.</span>
            </h2>
          </motion.div>

          <p className={`max-w-xs text-sm font-medium leading-relaxed mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Explore the most sought-after residences in Dubai, hand-picked for their architectural significance and investment potential.
          </p>
          
          <div className="absolute -right-10 -top-20 opacity-[0.04] select-none pointer-events-none">
            <h2 className="text-[20rem] font-black italic tracking-tighter">HG</h2>
          </div>
        </header>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-8">
          {latestProperty.map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`group relative md:col-span-6 lg:col-span-4 flex flex-col h-full`}
            >
              {/* Media Container */}
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl">
                <img
                  src={property.image?.[0] || "https://images.unsplash.com/photo-1600585154340-be6191da95b8?auto=format&fit=crop&w=800"}
                  alt={property.propertyname}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                />
                
                {/* Visual Layers */}
                <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-950 via-slate-950/20' : 'from-slate-900/60 via-transparent'} opacity-80`} />
                
                {/* Top Badge UI */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <span className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                      {property.listingtype || "Elite"}
                    </span>
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-amber-500 hover:text-black transition-all">
                    <Heart size={20} />
                  </button>
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-black text-white tracking-tighter">
                           {property.price > 9999999 
                             ? `₹${(property.price / 10000000).toFixed(2)}Cr` 
                             : `₹${(property.price / 100000).toFixed(1)}L`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin size={12} className="text-amber-500" />
                        {property.city}
                    </div>
                </div>
              </div>

              {/* Content / Info Section */}
              <div className="px-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <h3 className={`text-2xl font-black uppercase tracking-tighter leading-tight ${isDark ? 'text-white' : 'text-slate-950'} group-hover:text-amber-600 transition-colors`}>
                        {property.propertyname}
                    </h3>
                    <motion.div 
                        whileHover={{ rotate: 45 }}
                        className="p-3 rounded-full border border-amber-500/20 text-amber-500"
                    >
                        <ArrowUpRight size={24} />
                    </motion.div>
                </div>

                {/* Technical Specs Bar */}
                <div className={`grid grid-cols-3 gap-4 py-6 border-y ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Beds</span>
                        <div className="flex items-center gap-2">
                            <BedDouble size={14} className="text-amber-500" />
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bedroom}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Baths</span>
                        <div className="flex items-center gap-2">
                            <Bath size={14} className="text-amber-500" />
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.bathroom}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Sq.Ft</span>
                        <div className="flex items-center gap-2">
                            <Maximize size={14} className="text-amber-500" />
                            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.squarefoot}</span>
                        </div>
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Massive Luxury CTA
        <div className="mt-32 border-t border-slate-100 dark:border-white/5 pt-20">
            <button className="group flex items-center justify-between w-full text-start">
                <span className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    View the full <br/>
                    <span className="text-amber-500 italic font-serif font-light">2026 Collection</span>
                </span>
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-500">
                    <ChevronRight size={40} className={`group-hover:text-black transition-colors ${isDark ? 'text-white' : 'text-black'}`} />
                </div>
            </button>
        </div> */}
      </div>
    </section>
  );
};

export default AgentPropertyList;