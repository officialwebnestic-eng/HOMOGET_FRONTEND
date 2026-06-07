import React from 'react';
import { Navigation, Car, Footprints, TrainFront, HelpCircle, ShieldCheck } from 'lucide-react';

// --- SUB-COMPONENT: INDIVIDUAL CARD ---
const LocationCard = ({ loc, idx, isDark }) => {
  // Safety check - if loc is invalid, return null
  if (!loc || !loc.locationName) return null;

  const getTransportAssets = (type) => {
    const cleanType = type?.trim().toLowerCase() || '';

    if (cleanType.includes('drive') || cleanType.includes('car')) {
      return {
        label: "DRIVE",
        color: "text-orange-500",
        icon: <Car size={14} />,
        img: "https://image.shutterstock.com/image-vector/car-driving-holiday-trip-man-260nw-2342119313.jpg" 
      };
    }
    if (cleanType.includes('walk') || cleanType.includes('foot')) {
      return {
        label: "WALK",
        color: "text-orange-500",
        icon: <Footprints size={14} />,
        img: "https://static.vecteezy.com/system/resources/thumbnails/058/658/451/small_2x/cheerful-3d-woman-walking-in-stylized-animated-character-design-png.png"
      };
    }
    if (cleanType.includes('metro') || cleanType.includes('train')) {
      return {
        label: "METRO",
        color: "text-orange-500",
        icon: <TrainFront size={14} />,
        img: "https://image.shutterstock.com/image-vector/yellow-train-metro-locomotive-on-260nw-2409449257.jpg"
      };
    }
    return {
      label: "NEARBY",
      color: "text-amber-500",
      icon: <HelpCircle size={14} />,
      img: "https://illustrations.popsy.co/amber/map.svg"
    };
  };

  const asset = getTransportAssets(loc.transportType);

  return (
    <div className={`group relative flex flex-col h-full overflow-hidden rounded-2xl p-4 transition-all duration-500 ${
      isDark 
        ? "bg-[#12141c] text-white shadow-lg shadow-black/50" 
        : "bg-white text-slate-900 shadow-md shadow-slate-200/60"
    }`}>
      {/* Top Row */}
      <div className="flex justify-between items-start mb-3">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full border text-[9px] font-bold ${
          isDark ? "border-white/10 text-white/40" : "border-slate-200 text-slate-400"
        }`}>
          {String(idx + 1).padStart(2, '0')}
        </div>
        <div className={`${isDark ? "text-white/20" : "text-slate-200"}`}>
          {asset.icon}
        </div>
      </div>

      {/* Image Area - Reduced size */}
      <div className="relative h-5 w-full flex items-center justify-center mb-4">
        <img 
          src={asset.img} 
          alt={asset.label}
          className="h-20 w-20 object-contain group-hover:scale-110 transition-transform duration-500 z-10"
        />
        <div className="absolute bottom-0 w-12 h-2 bg-black/5 blur-md rounded-full" />
      </div>

      {/* Content Area */}
      <div className="space-y-1 flex-grow">
        <p className={`text-[8px] font-black tracking-widest ${asset.color}`}>
          {asset.label}
        </p>
        <h4 className="text-base font-bold leading-tight truncate">
          {loc.locationName}
        </h4>
        <p className={`text-[8px] font-medium opacity-50 uppercase tracking-tighter`}>
          {loc.transportType} — {loc.distance || '5 mins'}
        </p>
      </div>

      {/* Bottom Data Bar - Reduced size */}
      <div className="mt-4 pt-3 border-t border-dashed border-slate-200/50 dark:border-white/5 flex justify-between items-end">
        <div>
          <p className="text-[7px] font-bold text-amber-600 uppercase mb-1">Distance</p>
          <p className="text-base font-black leading-none">{loc.distance || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="text-[7px] font-bold text-amber-600 uppercase mb-1">Travel Time</p>
          <p className="text-xs font-bold opacity-80 leading-none">{loc.time || '5 mins'}</p>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const NearbyLocations = ({ property, isDark }) => {
  // ✅ SAFETY CHECK 1: If property doesn't exist, show nothing
  if (!property) return null;
  
  // ✅ SAFETY CHECK 2: If nearByLocations doesn't exist or is not an array, show nothing
  if (!property.nearByLocations || !Array.isArray(property.nearByLocations)) return null;
  
  // ✅ SAFETY CHECK 3: Filter out invalid locations (empty or null)
  const validLocations = property.nearByLocations.filter(loc => 
    loc && loc.locationName && loc.locationName.trim() !== ''
  );
  
  // ✅ SAFETY CHECK 4: If no valid locations, show nothing
  if (validLocations.length === 0) return null;

  return (
    <section className={`py-8 ${isDark ? 'bg-[#0a0c12]' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-amber-600 mb-6 flex items-center gap-2">
              <ShieldCheck size={10} /> Nearby Landmarks
            </h3>
            <div className="h-0.5 w-10 bg-amber-500 mt-1 rounded-full" />
          </div>
          <Navigation className="text-amber-500" size={18} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {validLocations.map((loc, idx) => (
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