import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, ShieldCheck, Waves, Trees, Dumbbell, 
  Zap, Droplets, Flame, Camera, Store, 
  Wind, Wifi, Warehouse, CheckCircle2, Sparkles,
  Lamp, Construction, Trash2
} from 'lucide-react';

const AmenitiesSection = ({ amenities = [] }) => {
  // --- LOGIC FIX START ---
  const getCleanAmenities = () => {
    if (!amenities || amenities.length === 0) return [];

    if (typeof amenities[0] === 'string' && amenities[0].startsWith('[')) {
      try {
        return JSON.parse(amenities[0]);
      } catch (e) {
        console.error("Deep parsing failed:", e);
        return [];
      }
    }
    return amenities;
  };

  const finalAmenities = getCleanAmenities();
  // --- LOGIC FIX END ---

  const getIcon = (name) => {
    const cleanName = name.trim().toUpperCase();
    
    const iconMap = {
      "POWER BACKUP": <Zap size={24} />,
      "GARDEN/PARK": <Trees size={24} />,
      "GARDEN": <Trees size={24} />,
      "CLUB HOUSE": <Warehouse size={24} />,
      "CLUBHOUSE": <Warehouse size={24} />,
      "SECURITY": <ShieldCheck size={24} />,
      "PARKING": <Car size={24} />,
      "SWIMMING POOL": <Waves size={24} />,
      "GYM": <Dumbbell size={24} />,
      "CCTV": <Camera size={24} />,
    };

    return iconMap[cleanName] || <CheckCircle2 size={24} />;
  };

  if (finalAmenities.length === 0) return null;

  return (
    <div className="mt-16 py-12 border-t border-gray-100 dark:border-white/5">
      {/* Header Container */}
      <div className="flex items-center gap-4 mb-10">
       
        <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-8 md:mb-12 flex items-center gap-2">
           <ShieldCheck size={12} />  Asset Amenities
          </h3>
          <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.25em] dark:text-zinc-400">
            Verified Infrastructure & Features
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {finalAmenities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            viewport={{ once: true }}
            className="group flex items-center gap-4 p-4 rounded-[1.75rem] bg-gray-50 dark:bg-white/[0.03] border border-transparent hover:border-amber-500/30 hover:bg-white dark:hover:bg-zinc-900 transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            {/* Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300 flex-shrink-0">
              {getIcon(item)}
            </div>

            {/* Label Block */}
            <div className="flex flex-col min-w-0 py-0.5 justify-center">
              <span className="text-[11px] font-black uppercase tracking-tight text-zinc-800 dark:text-zinc-200 truncate">
                {item}
              </span>
              <span className="text-[8px] font-bold uppercase text-green-600 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                Available
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSection;