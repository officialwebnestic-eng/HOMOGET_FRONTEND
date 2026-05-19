      import React from 'react';
import { Navigation, Car, Footprints, TrainFront, HelpCircle, ShieldCheck } from 'lucide-react';

// --- SUB-COMPONENT: INDIVIDUAL CARD ---
const LocationCard = ({ loc, idx, isDark }) => {
  const getTransportAssets = (type) => {
    const cleanType = type?.trim().toLowerCase() || '';

    if (cleanType.includes('drive') || cleanType.includes('car')) {
      return {
        label: "DRIVE",
        color: "text-orange-500",
        icon: <Car size={18} />,
        img: "https://image.shutterstock.com/image-vector/car-driving-holiday-trip-man-260nw-2342119313.jpg" 
      };
    }
    if (cleanType.includes('walk') || cleanType.includes('foot')) {
      return {
        label: "WALK",
        color: "text-orange-500",
        icon: <Footprints size={18} />,
        img: "https://static.vecteezy.com/system/resources/thumbnails/058/658/451/small_2x/cheerful-3d-woman-walking-in-stylized-animated-character-design-png.png"
      };
    }
    if (cleanType.includes('metro') || cleanType.includes('train')) {
      return {
        label: "METRO",
        color: "text-orange-500",
        icon: <TrainFront size={18} />,
        img: "https://image.shutterstock.com/image-vector/yellow-train-metro-locomotive-on-260nw-2409449257.jpg"
      };
    }
    return {
      label: "NEARBY",
      color: "text-amber-500",
      icon: <HelpCircle size={18} />,
      img: "https://illustrations.popsy.co/amber/map.svg"
    };
  };

  const asset = getTransportAssets(loc.transportType);

  return (
    /* h-full ensures all cards in the grid row stretch to the same height */
    <div className={`group relative flex flex-col h-full overflow-hidden rounded-[2rem] p-6 transition-all duration-500 ${
      isDark 
        ? "bg-[#12141c] text-white shadow-2xl shadow-black/50" 
        : "bg-white text-slate-900 shadow-xl shadow-slate-200/60"
    }`}>
      {/* Top Row */}
      <div className="flex justify-between items-start mb-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-[10px] font-bold ${
          isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"
        }`}>
          {String(idx + 1).padStart(2, '0')}
        </div>
        <div className={`${isDark ? "text-white/20" : "text-slate-200"}`}>
          {asset.icon}
        </div>
      </div>

      {/* Image Area - Fixed height for consistency */}
      <div className="relative h-40 w-full flex items-center justify-center mb-6">
        <img 
          src={asset.img} 
          alt={asset.label}
          className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 z-10"
        />
        <div className="absolute bottom-2 w-1/2 h-4 bg-black/5 blur-xl rounded-full" />
      </div>

      {/* Content Area - flex-grow pushes the bottom bar to the base */}
      <div className="space-y-1 flex-grow">
        <p className={`text-xs font-black tracking-widest ${asset.color}`}>
          {asset.label}
        </p>
        <h4 className="text-xl font-bold leading-tight truncate">
          {loc.locationName}
        </h4>
        <p className={`text-[10px] font-medium opacity-50 uppercase tracking-tighter`}>
          {loc.transportType} — {loc.time || '5 mins'}
        </p>
      </div>

      {/* Bottom Data Bar */}
      <div className="mt-6 pt-4 border-t border-dashed border-slate-200/50 dark:border-white/5 flex justify-between items-end">
        <div>
          <p className="text-[8px] font-bold text-amber-600 uppercase mb-1">Distance</p>
          <p className="text-lg font-black leading-none">{loc.distance}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold text-amber-600 uppercase mb-1">Travel Time</p>
          <p className="text-sm font-bold opacity-80 leading-none">{loc.time || '5 mins'}</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const NearbyLocations = ({ property, isDark }) => {
  if (!property?.nearByLocations || property.nearByLocations.length === 0) return null;

  return (
    <section className={`py-12 ${isDark ? 'bg-[#0a0c12]' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-8 md:mb-12 flex items-center gap-2">
               <ShieldCheck size={12} />  Nearby Landmarks
            </h3>
            <div className="h-1 w-12 bg-amber-500 mt-2 rounded-full" />
          </div>
          <Navigation className="text-amber-500 animate-bounce" size={24} />
        </div>
        
        {/* Changed grid-cols to 3 for large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {property.nearByLocations.map((loc, idx) => (
            <LocationCard 
              key={idx} 
              loc={loc} 
              idx={idx} 
              isDark={isDark} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyLocations;