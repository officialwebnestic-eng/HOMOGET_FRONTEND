import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, ShieldCheck, Waves, Trees, Dumbbell, 
  Zap, Camera, Warehouse, CheckCircle2
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
      "POWER BACKUP": <Zap size={18} />,
      "GARDEN/PARK": <Trees size={18} />,
      "GARDEN": <Trees size={18} />,
      "CLUB HOUSE": <Warehouse size={18} />,
      "CLUBHOUSE": <Warehouse size={18} />,
      "SECURITY": <ShieldCheck size={18} />,
      "PARKING": <Car size={18} />,
      "SWIMMING POOL": <Waves size={18} />,
      "GYM": <Dumbbell size={18} />,
      "CCTV": <Camera size={18} />,
    };

    return iconMap[cleanName] || <CheckCircle2 size={18} />;
  };

  if (finalAmenities.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={12} className="text-amber-500" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
          Amenities
        </h3>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {finalAmenities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-amber-500/10 transition-all duration-300"
          >
            {/* Icon */}
            <div className="text-amber-500">
              {getIcon(item)}
            </div>

            {/* Label */}
            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate">
              {item}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesSection;