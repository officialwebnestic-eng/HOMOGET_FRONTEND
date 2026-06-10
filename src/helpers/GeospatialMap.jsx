import React, { memo } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const GeospatialMap = memo(({ property, isDark }) => {
  
  // Extract coordinates
  let latitude = null;
  let longitude = null;
  
  if (property) {
    if (property.locationLat && property.locationLng) {
      latitude = parseFloat(property.locationLat);
      longitude = parseFloat(property.locationLng);
    }
    else if (property.coordinates?.lat && property.coordinates?.lng) {
      latitude = parseFloat(property.coordinates.lat);
      longitude = parseFloat(property.coordinates.lng);
    }
  }
  
  // Default to Dubai if no coordinates
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    latitude = 25.2048;
    longitude = 55.2708;
  }
  
  const locationQuery = property?.displayAddress;

  const handleOpenMap = () => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
  };

  return (
    <div className="p-3 rounded-xl border border-gray-200 bg-white">
      {/* Location Label */}
      <div className="mb-2">
        <span className="text-[2ppx] font-serif uppercase tracking-wider text-amber-500">
          Location
        </span>
      </div>
      
      {/* Address */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={14} className="text-amber-500" />
         <span className="text-xl font-serif text-black">
          {locationQuery}
        </span>
       
      </div>
      {/* Small Map Button */}
      <button
        onClick={handleOpenMap}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 bg-amber-500 text-black hover:bg-amber-400"
      >
        <Navigation size={10} /> 
        View on Map
      </button>
    </div>
  );
});

GeospatialMap.displayName = 'GeospatialMap';

export default GeospatialMap;