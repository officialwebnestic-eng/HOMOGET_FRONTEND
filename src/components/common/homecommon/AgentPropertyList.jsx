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
  Sparkles
} from "lucide-react";

const AgentPropertyList = () => {
  const [latestProperty, setLatestProperty] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Premium Real Estate Palette
  const colors = {
    light: {
      background: "bg-slate-50",
      card: "bg-white",
      text: "text-slate-900",
      subText: "text-slate-500",
      border: "border-slate-200/60",
      pill: "bg-slate-100 text-slate-600",
      accent: "from-blue-600 to-indigo-600",
      shadow: "hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]"
    },
    dark: {
      background: "bg-slate-950",
      card: "bg-slate-900/50",
      text: "text-slate-50",
      subText: "text-slate-400",
      border: "border-slate-800",
      pill: "bg-slate-800/50 text-slate-300",
      accent: "from-indigo-500 to-purple-500",
      shadow: "hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)]"
    }
  };

  const ct = colors[theme] || colors.light;

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
    <div className={`min-h-screen flex items-center justify-center ${ct.background}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className={`font-medium animate-pulse ${ct.subText}`}>Curating Listings...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-20 px-6 transition-colors duration-500 ${ct.background}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20`}>
              <Sparkles size={16} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Newly Added</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${ct.text}`}>
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Properties</span>
            </h2>
          </div>
          <p className={`max-w-sm text-lg leading-relaxed ${ct.subText}`}>
            Explore our most sought-after residences chosen for their architectural excellence.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestProperty.map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative flex flex-col ${ct.card} ${ct.border} border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${ct.shadow}`}
            >
              {/* Image Section */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={property.image?.[0] || property.image || "https://images.unsplash.com/photo-1600585154340-be6191da95b8?auto=format&fit=crop&w=800"}
                  alt={property.propertyname}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                  <div className="backdrop-blur-md bg-white/20 border border-white/30 px-4 py-1.5 rounded-full">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{property.propertytype}</span>
                  </div>
                  <button className="p-3 rounded-full backdrop-blur-md bg-black/20 text-white hover:bg-red-500 transition-colors border border-white/20">
                    <Heart size={18} />
                  </button>
                </div>

                {/* Price Tag (Glassmorphism) */}
                <div className="absolute bottom-6 left-6">
                  <div className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 px-5 py-2 rounded-2xl shadow-xl border border-white/20">
                    <span className={`text-xl font-black ${ct.text}`}>
                      ₹{new Intl.NumberFormat('en-IN').format(property.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-2xl font-bold truncate ${ct.text}`}>
                    {property.propertyname}
                  </h3>
                  <div className={`p-2 rounded-full bg-blue-500/10 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <ArrowUpRight size={20} />
                  </div>
                </div>

                <div className={`flex items-center gap-1 mb-8 ${ct.subText}`}>
                  <MapPin size={16} className="text-blue-500" />
                  <span className="text-sm font-medium">{property.city}, {property.state}</span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-3 mt-auto">
                  <div className={`flex flex-col items-center justify-center p-3 rounded-3xl ${ct.pill} transition-colors group-hover:bg-blue-500/5`}>
                    <BedDouble size={20} className="mb-1 text-blue-500" />
                    <span className="text-xs font-bold">{property.bedroom} Beds</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-3 rounded-3xl ${ct.pill} transition-colors group-hover:bg-blue-500/5`}>
                    <Bath size={20} className="mb-1 text-blue-500" />
                    <span className="text-xs font-bold">{property.bathroom} Baths</span>
                  </div>
                  <div className={`flex flex-col items-center justify-center p-3 rounded-3xl ${ct.pill} transition-colors group-hover:bg-blue-500/5`}>
                    <Maximize size={20} className="mb-1 text-blue-500" />
                    <span className="text-xs font-bold">{property.squareFeet} sqft</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentPropertyList;