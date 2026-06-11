// components/WatermarkedImage.jsx
import React from 'react';
import { navbarlogo } from '../ExportImages';

const WatermarkedImage = ({ src, alt, className }) => {
  return (
    <div className="relative w-full h-full">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className || ''}`}
      />
      <div className="absolute bottom-3 right-3 z-20 opacity-60 pointer-events-none">
        <img 
          src={navbarlogo} 
          alt="Homoget" 
          className="w-12 h-12 md:w-14 md:h-14 object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default WatermarkedImage;