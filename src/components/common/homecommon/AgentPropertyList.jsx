import { useEffect, useState } from "react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Maximize, ArrowRight } from "lucide-react";

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
    <section className={`py-24 px-6 ${isDark ? 'bg-[#0a0a0c]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {latestProperty.slice(0, 3).map((property, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative h-[520px] rounded-[3.5rem] overflow-hidden shadow-2xl bg-black"
            >
              {/* Main Image */}
              <img
                src={property.image?.[0]}
                alt={property.propertyname}
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
              />

              {/* Top Left Badge: Category */}
              <div className="absolute top-8 left-8">
                <span className="px-5 py-2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  {property.propertytype || "Apartment"}
                </span>
              </div>

              {/* Top Right Badge: Price Floating */}
              <div className="absolute top-8 right-8">
                <div className="bg-[#1a1a1c]/90 backdrop-blur-md px-6 py-3 rounded-[1.8rem] text-center shadow-2xl">
                  <p className="text-[8px] font-black uppercase tracking-tighter text-amber-500 mb-0.5">Price From</p>
                  <p className="text-sm font-bold text-white flex items-center justify-center gap-1">
                    <span className="text-[10px] text-gray-400">AED</span> {property.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Center Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 bg-gradient-to-t from-black via-black/10 to-transparent">
                <div className="space-y-4">
                  <div>
                    <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      {property.city}, UAE
                    </p>
                    <h3 className="text-3xl font-serif text-white leading-tight">
                      Luxury {property.propertyname}
                    </h3>
                  </div>

                  {/* Icon Specs Bar (Borders Removed) */}
                  <div className="flex items-center gap-6 text-white/80 py-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-amber-500/10">
                        <BedDouble size={14} className="text-amber-500" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-tighter">
                        {property.bedroom} Bedroom
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-amber-500/10">
                        <Maximize size={14} className="text-amber-500" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-tighter">
                        {property.squarefoot} SQFT
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Row (Borders Removed) */}
                  <div className="flex items-center gap-3 pt-4">
                    <button className="flex-1 py-4 bg-white/10 backdrop-blur-2xl text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                      Inquire Now
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center bg-amber-500 text-black rounded-[1.2rem] hover:scale-105 transition-transform shadow-xl shadow-amber-500/20">
                      <ArrowRight size={24} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentPropertyList;