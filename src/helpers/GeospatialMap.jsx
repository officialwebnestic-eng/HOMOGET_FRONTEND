import React, { memo, useState } from 'react';
import { Navigation, MapPin, Copy, Check, ExternalLink } from 'lucide-react';

const GeospatialMap = memo(({ property, isDark }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  // Debug: Log what we're receiving
  console.log("Property data:", {
    locationName: property?.locationName,
    locationLat: property?.locationLat,
    locationLng: property?.locationLng,
    displayAddress: property?.displayAddress
  });
  
  // Extract coordinates - check ALL possible locations
  let latitude = null;
  let longitude = null;
  
  if (property) {
    // Priority 1: locationLat/locationLng (from your API)
    if (property.locationLat && property.locationLng) {
      latitude = parseFloat(property.locationLat);
      longitude = parseFloat(property.locationLng);
      console.log("Using locationLat/Lng:", latitude, longitude);
    }
    // Priority 2: coordinates object
    else if (property.coordinates?.lat && property.coordinates?.lng) {
      latitude = parseFloat(property.coordinates.lat);
      longitude = parseFloat(property.coordinates.lng);
      console.log("Using coordinates object:", latitude, longitude);
    }
  }
  
  // If no valid coordinates, default to Dubai
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    latitude = 25.2048;
    longitude = 55.2708;
    console.log("Using default Dubai coordinates");
  }
  
  const locationQuery = property?.locationName || property?.displayAddress || property?.address || property?.community || property?.city || "Dubai";
  
  // Get BRN and ORN numbers
  const brnNumber = property?.brnNumber || property?.agentId?.reraLicenseNumber || "N/A";
  const ornNumber = property?.reraORN || "N/A";
  
  // OpenStreetMap Static Image URL (No API Key Required!)
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=14&size=800x450&markers=${latitude},${longitude},lightblue1`;
  
  // Alternative: Google Static Map (commented, use if OSM fails)
  // const GOOGLE_KEY = "AIzaSyD1Ybb7xTb4rwOtTbHUSg8J7chgoaSvWdM";
  // const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=14&size=800x450&markers=color:0xf59e0b%7C${latitude},${longitude}&key=${GOOGLE_KEY}`;

  const handleOpenNavigation = () => {
    const webMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`;
    window.open(webMapUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(`${latitude}, ${longitude}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCoordinates = () => {
    return `${latitude.toFixed(6)}°, ${longitude.toFixed(6)}°`;
  };

  return (
    <section className={`py-16 md:py-24 ${isDark ? "bg-black/40" : "bg-gray-50"} border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-3">
            Property Location
          </h3>
          <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Verified Geospatial Position
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Side: Location Details */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-500" />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  Exact Address
                </span>
              </div>
              <p className={`text-lg md:text-xl font-light italic leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
                {locationQuery}
              </p>
            </div>

            {/* Coordinates */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-amber-500" />
                <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  GPS Coordinates
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <code className={`px-3 py-2 rounded-lg text-xs font-mono ${isDark ? 'bg-white/5 text-amber-400' : 'bg-gray-100 text-amber-600'}`}>
                  {formatCoordinates()}
                </code>
                <button
                  onClick={handleCopyCoordinates}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                >
                  {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Regulatory Info */}
            <div className={`pt-3 mt-2 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-[7px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    BRN Number
                  </p>
                  <p className={`text-xs font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    {brnNumber !== "N/A" ? brnNumber : "N/A"}
                  </p>
                </div>
                <div>
                  <p className={`text-[7px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    ORN Number
                  </p>
                  <p className={`text-xs font-mono font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    {ornNumber !== "N/A" ? ornNumber : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleOpenNavigation}
                className={`group flex items-center gap-2 px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-amber-500 text-black hover:bg-amber-400' 
                    : 'bg-amber-500 text-black hover:bg-amber-600'
                }`}
              >
                <Navigation size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                Open in Map
              </button>
              
              <button
                onClick={handleOpenGoogleMaps}
                className={`group flex items-center gap-2 px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 border ${
                  isDark 
                    ? 'border-white/20 text-white hover:border-amber-500 hover:text-amber-500' 
                    : 'border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-500'
                }`}
              >
                <ExternalLink size={12} /> 
                Google Maps
              </button>
            </div>
          </div>

          {/* Right Side: Map Display */}
          <div 
            className="relative aspect-video bg-zinc-900 border border-white/10 overflow-hidden rounded-2xl group cursor-pointer shadow-xl"
            onClick={handleOpenNavigation}
          >
            {!imgError ? (
              <img
                loading="lazy"
                src={staticMapUrl}
                alt="Property Location Map"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Map image failed to load:", staticMapUrl);
                  setImgError(true);
                }}
              />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                <MapPin size={48} className="text-amber-500 mb-3" />
                <p className="text-sm font-medium">Map view unavailable</p>
                <p className="text-xs opacity-60 mt-1">{locationQuery}</p>
                <button
                  onClick={handleOpenGoogleMaps}
                  className="mt-4 px-4 py-2 bg-amber-500 text-black rounded-xl text-[9px] font-bold uppercase tracking-wider"
                >
                  Open in Google Maps
                </button>
              </div>
            )}

            {/* Map Marker Decoration */}
            {!imgError && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative">
                  <div className="absolute w-16 h-16 bg-amber-500/20 rounded-full animate-ping duration-[2000ms]" />
                  <div className="absolute w-8 h-8 bg-amber-500/30 rounded-full animate-pulse" />
                  <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
              <span className="bg-black/80 text-white px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Navigation size={10} /> Click to view full map
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

GeospatialMap.displayName = 'GeospatialMap';

export default GeospatialMap;