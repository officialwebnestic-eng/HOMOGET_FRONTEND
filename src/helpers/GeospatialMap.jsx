import React, { memo } from 'react';
import { Navigation } from 'lucide-react';

const GeospatialMap = memo(({ property, isDark }) => {
  // Extracting address or community data
  const locationQuery = property?.address || property?.community || property?.city;
  const coords = property?.coordinates; // Format: { lat: 25.xxx, lng: 55.xxx }
  
  if (!locationQuery && !coords) return null;

  // --- TOMTOM CONFIGURATION ---
  const TOMTOM_KEY = "k4W9ISMQC3Ro9ivC9ZWSyHUVuaghvrAq";
  
  // TomTom Static API uses 'lon,lat' format for coordinates
  const position = coords ? `${coords.lng},${coords.lat}` : encodeURIComponent(locationQuery);
  
  // Style: 'night' for dark mode, 'main' for light mode
  const mapStyle = isDark ? 'night' : 'main';
  const zoom = 14;

  // Optimized static image URL (webp format for better performance)
  const staticMapUrl = `https://api.tomtom.com/map/1/staticimage?key=${TOMTOM_KEY}&zoom=${zoom}&center=${position}&format=webp&layer=basic&style=${mapStyle}&width=1200&height=675&view=Unified`;

  const handleOpenNavigation = () => {
    // Falls back to Google Maps web viewer if coordinates aren't precise enough
    const webMapUrl = coords 
      ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`;
    
    window.open(webMapUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={`py-20 md:py-32 ${isDark ? "bg-black" : "bg-white"}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Side: Address Details */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500">
              Geospatial Position
            </h3>
            <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Verified Infrastructure
            </p>
          </div>

          <div className="max-w-md">
            <p className={`text-2xl md:text-3xl font-light italic leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              {locationQuery}
            </p>
          </div>

          <button
            onClick={handleOpenNavigation}
            className={`group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] border-b border-amber-500/30 pb-3 transition-all duration-300 ${
              isDark ? 'text-white hover:text-amber-500' : 'text-zinc-900 hover:text-amber-600'
            }`}
          >
            <Navigation size={14} className="text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
            Access Interactive Maps
          </button>
        </div>

        {/* Right Side: Map Display */}
        <div 
          className="relative aspect-video bg-zinc-900 border border-white/5 overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-2xl"
          onClick={handleOpenNavigation}
        >
          <img
            loading="lazy"
            src={staticMapUrl}
            alt="TomTom Property Location"
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isDark ? 'opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100' : 'opacity-100'
            }`}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800";
            }}
          />

          {/* Map Marker Decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-amber-500/20 rounded-full animate-ping duration-[2500ms]" />
              <div className="absolute w-10 h-10 bg-amber-500/30 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
            </div>
          </div>

          {/* Vignette for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity duration-500" />
        </div>

      </div>
    </section>
  );
});

export default GeospatialMap;





