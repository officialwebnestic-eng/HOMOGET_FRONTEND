import React, { useState } from 'react';
import { DubaiCurrencyImage } from "../../../ExportImages";

const CurrencyDisplay = ({ 
  price, 
  period, 
  currency, 
  isDark, 
  className = "",
  priceClassName = "",
  imageClassName = "",
  periodClassName = "",
  showImageOnly = false,
  showPeriod = true,
  imageSize = "md", // sm, md, lg
  periodPosition = "right" // "right" or "below"
}) => {
  const [imageError, setImageError] = useState(false);
  
  const isAED = currency === "AED";
  const shouldShowPeriod = showPeriod && period && period !== "Total Amount";
  const formattedPeriod = shouldShowPeriod ? `/ ${period}` : "";
  
  // Image size mappings
  const imageSizes = {
    sm: "h-4 sm:h-5 md:h-6",
    md: "h-6 sm:h-8 md:h-10",
    lg: "h-8 sm:h-10 md:h-12"
  };
  
  // Price size mappings
  const priceSizes = {
    sm: "text-base sm:text-lg md:text-xl",
    md: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    lg: "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
  };
  
  const formatNumber = () => {
    const num = Number(price);
    if (isNaN(num)) return "On Request";
    return num.toLocaleString();
  };
  
  const formatPriceWithSymbol = () => {
    const formattedNumber = formatNumber();
    
    if (isAED) {
      return formattedNumber;
    }
    
    const currencySymbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      SAR: "﷼",
      QAR: "﷼",
      KWD: "د.ك",
      BHD: "د.ب",
      INR: "₹",
      CAD: "C$",
      AUD: "A$"
    };
    
    const symbol = currencySymbols[currency] || currency;
    return `${symbol} ${formattedNumber}`;
  };
  
  const renderPeriod = () => {
    if (!shouldShowPeriod) return null;
    
    return (
      <span className={`${periodPosition === "right" ? "ml-1" : "mt-1"} text-xs text-gray-400 font-normal ${periodClassName}`}>
        {formattedPeriod}
      </span>
    );
  };
  
  if (!price && price !== 0) return null;
  
  // Image only mode
  if (showImageOnly) {
    return (
      isAED && !imageError && (
        <img 
          src={DubaiCurrencyImage}
          alt="Dubai Currency"
          className={`${imageSizes[imageSize]} w-auto object-contain ${imageClassName}`}
          onError={() => setImageError(true)}
        />
      )
    );
  }
  
  // Period below price (vertical layout)
  if (periodPosition === "below") {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex items-center gap-2 flex-wrap">
          {isAED && !imageError && (
            <img 
              src={DubaiCurrencyImage}
              alt="Dubai Currency"
              className={`${imageSizes[imageSize]} w-auto object-contain ${imageClassName}`}
              onError={() => setImageError(true)}
            />
          )}
          <p className={`font-bold font-serif text-amber-500 ${priceSizes[imageSize]} ${priceClassName}`}>
            {formatPriceWithSymbol()}
          </p>
        </div>
        {renderPeriod()}
      </div>
    );
  }
  
  // Default: Period on the right (horizontal layout)
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {isAED && !imageError && (
        <img 
          src={DubaiCurrencyImage}
          alt="Dubai Currency"
          className={`${imageSizes[imageSize]} w-auto object-contain ${imageClassName}`}
          onError={() => setImageError(true)}
        />
      )}
      <p className={`font-bold font-serif text-amber-500 ${priceSizes[imageSize]} ${priceClassName}`}>
        {formatPriceWithSymbol()}
        {periodPosition === "right" && renderPeriod()}
      </p>
      {periodPosition === "right" && !shouldShowPeriod && renderPeriod()}
    </div>
  );
};

export default CurrencyDisplay;