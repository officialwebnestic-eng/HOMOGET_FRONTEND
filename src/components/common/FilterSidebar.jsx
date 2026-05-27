    // components/common/FilterSidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, X, SlidersHorizontal, 
  CheckCircle2, Plus, Minus, MapPin, Clock, Home,
  Bed, Bath, Ruler, DollarSign, Wifi, Car, Dumbbell,
  Waves, Coffee, Shield, Wind, Key, Award, Sparkles
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
 import { AMENITIES } from '../../helpers/AddPropertyHelpers';
const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onApplyFilters,
  onClearFilters,
  propertyCount = 0 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    bedrooms: true,
    bathrooms: true,
    propertyType: true,
    furnishing: true,
    area: true,
    amenities: true,
    keywords: true,
    virtualTours: false
  });
  const [selectedAmenities, setSelectedAmenities] = useState(filters.amenities || []);
  const [keywordInput, setKeywordInput] = useState('');
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAmenity = (amenity) => {
    let updated;
    if (selectedAmenities.includes(amenity)) {
      updated = selectedAmenities.filter(a => a !== amenity);
    } else {
      updated = [...selectedAmenities, amenity];
    }
    setSelectedAmenities(updated);
    onFilterChange({ target: { name: 'amenities', value: updated } });
  };

  const addKeyword = (keyword) => {
    if (keyword.trim()) {
      const currentKeywords = filters.keywords || [];
      if (!currentKeywords.includes(keyword.trim())) {
        const updated = [...currentKeywords, keyword.trim()];
        onFilterChange({ target: { name: 'keywords', value: updated } });
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    const updated = (filters.keywords || []).filter(k => k !== keyword);
    onFilterChange({ target: { name: 'keywords', value: updated } });
  };

  const handleAmenitySearch = (e) => {
    setAmenitySearch(e.target.value);
  };

  // Bedroom options
  const bedroomOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const bathroomOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Furnishing options
  const furnishingOptions = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Unfurnished', label: 'Unfurnished' },
    { value: 'Semi-Furnished', label: 'Partly Furnished' }
  ];

  // Property types from schema
  const propertyTypes = [
    "Apartments", "Bulk Units", "Bungalow", "Compound", "Duplex",
    "Full Floor", "Half Floor", "Hotel Apartment", "Penthouse",
    "Townhouse", "Villa", "Whole Building", "Business Center",
    "Coworking Space", "Factory", "Farm", "Labor Camp", "Land",
    "Office Space", "Retail", "Shop", "Showroom", "Staff Accommodation", "Warehouse"
  ];

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('pool')) return <Waves size={16} />;
    if (amenityLower.includes('gym')) return <Dumbbell size={16} />;
    if (amenityLower.includes('parking')) return <Car size={16} />;
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi size={16} />;
    if (amenityLower.includes('security') || amenityLower.includes('cctv')) return <Shield size={16} />;
    if (amenityLower.includes('cafe') || amenityLower.includes('restaurant')) return <Coffee size={16} />;
    if (amenityLower.includes('garden') || amenityLower.includes('park')) return <Award size={16} />;
    if (amenityLower.includes('spa') || amenityLower.includes('sauna')) return <Sparkles size={16} />;
    if (amenityLower.includes('concierge')) return <Key size={16} />;
    return <CheckCircle2 size={16} />;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full w-full sm:w-[400px] md:w-[450px] z-[1001]
        transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isDark ? 'bg-[#11141B]' : 'bg-white'}
        shadow-2xl border-l ${isDark ? 'border-white/10' : 'border-slate-200'}
      `}>
        {/* Header */}
        <div className={`sticky top-0 z-10 p-5 border-b ${isDark ? 'border-white/10 bg-[#11141B]' : 'border-slate-100 bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-amber-500" />
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Filters
              </h2>
              {propertyCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {propertyCount} results
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}
            >
              <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-500'} />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-5 space-y-6">
          
          {/* ===== PRICE RANGE ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Price Range (AED)</h3>
              </div>
              {expandedSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.price && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className={`text-[10px] font-medium mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Min Price
                        </label>
                        <input
                          type="number"
                          name="minPrice"
                          value={filters.minPrice || ''}
                          onChange={onFilterChange}
                          placeholder="0"
                          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <label className={`text-[10px] font-medium mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Max Price
                        </label>
                        <input
                          type="number"
                          name="maxPrice"
                          value={filters.maxPrice || ''}
                          onChange={onFilterChange}
                          placeholder="Any"
                          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {['500k', '1M', '2M', '5M', '10M'].map(price => (
                        <button
                          key={price}
                          onClick={() => {
                            const value = price === '500k' ? 500000 : 
                                        price === '1M' ? 1000000 :
                                        price === '2M' ? 2000000 :
                                        price === '5M' ? 5000000 : 10000000;
                            onFilterChange({ target: { name: 'maxPrice', value } });
                          }}
                          className={`px-3 py-1 rounded-full text-[9px] font-medium transition-all ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-100 hover:bg-slate-200'}`}
                        >
                          AED {price}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== BEDROOMS ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('bedrooms')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <Bed size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Bedrooms</h3>
              </div>
              {expandedSections.bedrooms ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.bedrooms && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <div className="grid grid-cols-4 gap-2">
                      {bedroomOptions.map(num => (
                        <button
                          key={num}
                          onClick={() => onFilterChange({ target: { name: 'bedroom', value: num === parseInt(filters.bedroom) ? '' : num } })}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            parseInt(filters.bedroom) === num
                              ? 'bg-amber-500 text-white'
                              : isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => onFilterChange({ target: { name: 'bedroom', value: filters.bedroom === '10+' ? '' : '10+' } })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          filters.bedroom === '10+'
                            ? 'bg-amber-500 text-white'
                            : isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        10+
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== BATHROOMS ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('bathrooms')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <Bath size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Bathrooms</h3>
              </div>
              {expandedSections.bathrooms ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.bathrooms && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <div className="grid grid-cols-4 gap-2">
                      {bathroomOptions.map(num => (
                        <button
                          key={num}
                          onClick={() => onFilterChange({ target: { name: 'bathroom', value: num === parseInt(filters.bathroom) ? '' : num } })}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            parseInt(filters.bathroom) === num
                              ? 'bg-amber-500 text-white'
                              : isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => onFilterChange({ target: { name: 'bathroom', value: filters.bathroom === '10+' ? '' : '10+' } })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          filters.bathroom === '10+'
                            ? 'bg-amber-500 text-white'
                            : isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        10+
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== PROPERTY TYPE ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('propertyType')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <Home size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Property Type</h3>
              </div>
              {expandedSections.propertyType ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.propertyType && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {propertyTypes.map(type => (
                        <label key={type} className="flex items-center gap-3 py-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(filters.propertytype || []).includes(type)}
                            onChange={() => {
                              const current = filters.propertytype || [];
                              const updated = current.includes(type)
                                ? current.filter(t => t !== type)
                                : [...current, type];
                              onFilterChange({ target: { name: 'propertytype', value: updated } });
                            }}
                            className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                          />
                          <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== FURNISHING ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('furnishing')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <Key size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Furnishing</h3>
              </div>
              {expandedSections.furnishing ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.furnishing && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-2">
                    {furnishingOptions.map(option => (
                      <label key={option.value} className="flex items-center gap-3 py-2 cursor-pointer">
                        <input
                          type="radio"
                          name="furnishingType"
                          value={option.value}
                          checked={filters.furnishingType === option.value}
                          onChange={onFilterChange}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                        />
                        <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                    <label className="flex items-center gap-3 py-2 cursor-pointer">
                      <input
                        type="radio"
                        name="furnishingType"
                        value=""
                        checked={!filters.furnishingType}
                        onChange={onFilterChange}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Any
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== AREA (Sqft) ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('area')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Property Size (sqft)</h3>
              </div>
              {expandedSections.area ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.area && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className={`text-[10px] font-medium mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Min sqft
                        </label>
                        <input
                          type="number"
                          name="minSquarefoot"
                          value={filters.minSquarefoot || ''}
                          onChange={onFilterChange}
                          placeholder="0"
                          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <label className={`text-[10px] font-medium mb-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Max sqft
                        </label>
                        <input
                          type="number"
                          name="maxSquarefoot"
                          value={filters.maxSquarefoot || ''}
                          onChange={onFilterChange}
                          placeholder="Any"
                          className={`w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== AMENITIES ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('amenities')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Amenities</h3>
              </div>
              {expandedSections.amenities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.amenities && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
                      {AMENITIES.slice(0, showAllAmenities ? AMENITIES.length : 12).map(amenity => (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                            selectedAmenities.includes(amenity)
                              ? 'bg-amber-500 text-black'
                              : isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {getAmenityIcon(amenity)}
                          <span className="truncate">{amenity}</span>
                        </button>
                      ))}
                    </div>
                    {AMENITIES.length > 12 && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="mt-3 text-xs text-amber-500 hover:underline"
                      >
                        {showAllAmenities ? 'Show Less' : `Show ${AMENITIES.length - 12} More Amenities`}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== KEYWORDS ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('keywords')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-lg">#</span>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Keywords</h3>
              </div>
              {expandedSections.keywords ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.keywords && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword(keywordInput)}
                        placeholder="e.g. beach, chiller free, golf view"
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm outline-none focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`}
                      />
                      <button
                        onClick={() => addKeyword(keywordInput)}
                        className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-600"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(filters.keywords || []).map(keyword => (
                        <span
                          key={keyword}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-600 text-xs"
                        >
                          {keyword}
                          <button onClick={() => removeKeyword(keyword)}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== VIRTUAL TOURS ===== */}
          <div className="border-b border-slate-200 dark:border-white/10 pb-4">
            <button
              onClick={() => toggleSection('virtualTours')}
              className="flex items-center justify-between w-full py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500">🎥</span>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Virtual Viewings</h3>
              </div>
              {expandedSections.virtualTours ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <AnimatePresence>
              {expandedSections.virtualTours && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-2">
                    <label className="flex items-center gap-3 py-2 cursor-pointer">
                      <input
                        type="radio"
                        name="virtualTour"
                        value="360"
                        checked={filters.has360Tour === 'true'}
                        onChange={() => onFilterChange({ target: { name: 'has360Tour', value: 'true' } })}
                        className="w-4 h-4 text-amber-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>360° Tours</span>
                    </label>
                    <label className="flex items-center gap-3 py-2 cursor-pointer">
                      <input
                        type="radio"
                        name="virtualTour"
                        value="video"
                        checked={filters.hasVideoTour === 'true'}
                        onChange={() => onFilterChange({ target: { name: 'hasVideoTour', value: 'true' } })}
                        className="w-4 h-4 text-amber-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Video Tours</span>
                    </label>
                    <label className="flex items-center gap-3 py-2 cursor-pointer">
                      <input
                        type="radio"
                        name="virtualTour"
                        value=""
                        checked={!filters.has360Tour && !filters.hasVideoTour}
                        onChange={() => {
                          onFilterChange({ target: { name: 'has360Tour', value: '' } });
                          onFilterChange({ target: { name: 'hasVideoTour', value: '' } });
                        }}
                        className="w-4 h-4 text-amber-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Any</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className={`sticky bottom-0 p-5 border-t ${isDark ? 'border-white/10 bg-[#11141B]' : 'border-slate-100 bg-white'}`}>
          <div className="flex gap-3">
            <button
              onClick={onClearFilters}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Clear All
            </button>
            <button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-600 transition-all shadow-md"
            >
              Show {propertyCount} Properties
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;