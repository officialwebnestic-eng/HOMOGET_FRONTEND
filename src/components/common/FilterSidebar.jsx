// components/common/FilterSidebar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronUp, X, SlidersHorizontal, 
  CheckCircle2, Plus, Minus, MapPin, Clock, Home,
  Bed, Bath, Ruler, DollarSign, Wifi, Car, Dumbbell,
  Waves, Coffee, Shield, Wind, Key, Award, Sparkles,
  ArrowLeft, Video, Menu,ChevronRight 
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
  const [showMainMenu, setShowMainMenu] = useState(true);
  
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

  // Sync state with filters prop when it changes
  useEffect(() => {
    setSelectedAmenities(filters.amenities || []);
  }, [filters.amenities]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAmenity = (amenity) => {
    let updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
      
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

  const bedroomOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  const bathroomOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const furnishingOptions = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Unfurnished', label: 'Unfurnished' },
    { value: 'Semi-Furnished', label: 'Partly Furnished' }
  ];

  const propertyTypes = [
    "Apartments", "Bulk Units", "Bungalow", "Compound", "Duplex",
    "Full Floor", "Half Floor", "Hotel Apartment", "Penthouse",
    "Townhouse", "Villa", "Whole Building", "Business Center",
    "Coworking Space", "Factory", "Farm", "Labor Camp", "Land",
    "Office Space", "Retail", "Shop", "Showroom", "Staff Accommodation", "Warehouse"
  ];

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('pool')) return <Waves size={15} />;
    if (amenityLower.includes('gym')) return <Dumbbell size={15} />;
    if (amenityLower.includes('parking')) return <Car size={15} />;
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi size={15} />;
    if (amenityLower.includes('security') || amenityLower.includes('cctv')) return <Shield size={15} />;
    if (amenityLower.includes('cafe') || amenityLower.includes('restaurant')) return <Coffee size={15} />;
    if (amenityLower.includes('garden') || amenityLower.includes('park')) return <Award size={15} />;
    if (amenityLower.includes('spa') || amenityLower.includes('sauna')) return <Sparkles size={15} />;
    if (amenityLower.includes('concierge')) return <Key size={15} />;
    return <CheckCircle2 size={15} />;
  };

  const handleResetAndBack = () => {
    onClearFilters();
    setShowMainMenu(true);
  };

  const handleBackToMenu = () => {
    setShowMainMenu(true);
  };

  // Main Menu Options
  const mainMenuOptions = [
    { id: 'price', icon: <DollarSign size={16} />, label: 'Price Range', color: 'amber' },
    { id: 'bedrooms', icon: <Bed size={16} />, label: 'Bedrooms', color: 'blue' },
    { id: 'bathrooms', icon: <Bath size={16} />, label: 'Bathrooms', color: 'cyan' },
    { id: 'propertyType', icon: <Home size={16} />, label: 'Property Type', color: 'emerald' },
    { id: 'furnishing', icon: <Key size={16} />, label: 'Furnishing', color: 'purple' },
    { id: 'area', icon: <Ruler size={16} />, label: 'Area Size', color: 'rose' },
    { id: 'amenities', icon: <Sparkles size={16} />, label: 'Amenities', color: 'pink' },
    { id: 'keywords', icon: <HashIcon size={16} />, label: 'Keywords', color: 'indigo' },
    { id: 'virtualTours', icon: <Video size={16} />, label: 'Virtual Tours', color: 'orange' },
  ];

  // Render main menu
  const renderMainMenu = () => (
    <div className="space-y-1">
      <div className="mb-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mx-auto mb-2 flex items-center justify-center">
          <SlidersHorizontal size={24} className="text-white" />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider">Filter Menu</h3>
        <p className="text-[9px] text-slate-400 mt-1">Select a category to refine</p>
      </div>
      
      {mainMenuOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            setShowMainMenu(false);
            // Expand the selected section
            setExpandedSections(prev => ({ ...prev, [option.id]: true }));
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
            isDark 
              ? 'border-white/5 hover:bg-white/10' 
              : 'border-slate-100 hover:bg-slate-50'
          } group`}
        >
          <div className={`w-8 h-8 rounded-lg bg-${option.color}-500/10 flex items-center justify-center text-${option.color}-500 group-hover:scale-105 transition-transform`}>
            {option.icon}
          </div>
          <span className="flex-1 text-left text-xs font-bold uppercase tracking-wider">
            {option.label}
          </span>
          <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay - half screen on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000]"
            onClick={onClose}
            style={{ 
              '@media (minWidth: 640px)': { 
                backgroundColor: 'rgba(0,0,0,0.4)'
              } 
            }}
          />
        )}
      </AnimatePresence>

      {/* Main Drawer Container - Half screen on mobile, full on desktop */}
      <aside className={`
        fixed top-0 right-0 h-[100dvh] z-[1001]
        transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        ${isDark ? 'bg-[#0d111a] text-slate-100' : 'bg-white text-slate-800'}
        shadow-[0_0_60px_rgba(0,0,0,0.15)] border-l ${isDark ? 'border-white/5' : 'border-slate-100'}
        w-[85vw] sm:w-[440px]
      `}>
        
        {/* Sticky Modular Header */}
        <div className={`p-5 border-b shrink-0 ${isDark ? 'border-white/5 bg-[#121824]' : 'border-slate-100 bg-slate-50/80'} backdrop-blur-md`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back to Menu Button - Only shows in filter view (not main menu) */}
              {!showMainMenu && (
                <button 
                  onClick={handleBackToMenu}
                  className={`p-2 rounded-xl transition-all ${
                    isDark ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeft size={16} className="text-amber-500" />
                </button>
              )}
              
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-amber-500" />
                <h2 className="text-base font-bold uppercase tracking-wider">
                  {showMainMenu ? 'Filters Menu' : 'Filter Options'}
                </h2>
                {propertyCount > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-500/10 text-amber-600'}`}>
                    {propertyCount} Match
                  </span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-200/60 text-slate-500'}`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 scrollbar-thin dark:scrollbar-track-transparent">
          
          {showMainMenu ? (
            renderMainMenu()
          ) : (
            <>
              {/* ===== PRICE RANGE FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <DollarSign size={15} />
                    </div>
                    <span>Price Range (AED)</span>
                  </div>
                  {expandedSections.price ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
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
                        <div className="flex items-center gap-3">
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Min</span>
                            <input
                              type="number"
                              name="minPrice"
                              value={filters.minPrice || ''}
                              onChange={onFilterChange}
                              placeholder="0"
                              className={`w-full pl-11 pr-3 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-[#141923] border-white/5 text-white' : 'bg-white border-slate-200'}`}
                            />
                          </div>
                          <div className="w-2 h-[2px] bg-slate-300 dark:bg-slate-700" />
                          <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">Max</span>
                            <input
                              type="number"
                              name="maxPrice"
                              value={filters.maxPrice || ''}
                              onChange={onFilterChange}
                              placeholder="Any"
                              className={`w-full pl-11 pr-3 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-[#141923] border-white/5 text-white' : 'bg-white border-slate-200'}`}
                            />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
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
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all border ${
                                isDark ? 'bg-white/5 hover:bg-white/10 border-transparent' : 'bg-white hover:bg-slate-100 border-slate-200'
                              }`}
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

              {/* ===== BEDROOMS FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('bedrooms')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Bed size={15} />
                    </div>
                    <span>Bedrooms</span>
                  </div>
                  {expandedSections.bedrooms ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
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
                        <div className="grid grid-cols-5 gap-1.5">
                          {bedroomOptions.map(num => {
                            const active = parseInt(filters.bedroom) === num;
                            return (
                              <button
                                key={num}
                                onClick={() => onFilterChange({ target: { name: 'bedroom', value: num === parseInt(filters.bedroom) ? '' : num } })}
                                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                                  active
                                    ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm shadow-amber-500/10'
                                    : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {num}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => onFilterChange({ target: { name: 'bedroom', value: filters.bedroom === '9+' ? '' : '9+' } })}
                            className={`col-span-2 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              filters.bedroom === '9+'
                                ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                                : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            9+ Beds
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== BATHROOMS FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('bathrooms')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Bath size={15} />
                    </div>
                    <span>Bathrooms</span>
                  </div>
                  {expandedSections.bathrooms ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
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
                        <div className="grid grid-cols-5 gap-1.5">
                          {bathroomOptions.map(num => {
                            const active = parseInt(filters.bathroom) === num;
                            return (
                              <button
                                key={num}
                                onClick={() => onFilterChange({ target: { name: 'bathroom', value: num === parseInt(filters.bathroom) ? '' : num } })}
                                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                                  active
                                    ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                                    : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {num}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => onFilterChange({ target: { name: 'bathroom', value: filters.bathroom === '9+' ? '' : '9+' } })}
                            className={`col-span-2 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              filters.bathroom === '9+'
                                ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                                : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            9+ Baths
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== PROPERTY TYPE FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('propertyType')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Home size={15} />
                    </div>
                    <span>Property Classification</span>
                  </div>
                  {expandedSections.propertyType ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {expandedSections.propertyType && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3">
                        <div className="space-y-1 max-h-52 overflow-y-auto pr-2 divide-y divide-slate-100 dark:divide-white/5">
                          {propertyTypes.map(type => {
                            const isChecked = (filters.propertytype || []).includes(type);
                            return (
                              <label key={type} className="flex items-center justify-between py-2.5 cursor-pointer group">
                                <span className={`text-xs font-medium transition-colors ${isChecked ? 'text-amber-500 font-semibold' : 'text-slate-400 dark:text-slate-300 group-hover:text-slate-600'}`}>
                                  {type}
                                </span>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    const current = filters.propertytype || [];
                                    const updated = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
                                    onFilterChange({ target: { name: 'propertytype', value: updated } });
                                  }}
                                  className="w-4 h-4 rounded border-slate-300 dark:border-white/10 text-amber-500 focus:ring-amber-500 dark:bg-white/5"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== FURNISHING FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('furnishing')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Key size={15} />
                    </div>
                    <span>Furnishing Layer</span>
                  </div>
                  {expandedSections.furnishing ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {expandedSections.furnishing && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 grid grid-cols-2 gap-2">
                        {furnishingOptions.map(option => {
                          const active = filters.furnishingType === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => onFilterChange({ target: { name: 'furnishingType', value: option.value } })}
                              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                                active 
                                  ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                                  : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                        <button
                          onClick={() => onFilterChange({ target: { name: 'furnishingType', value: '' } })}
                          className={`col-span-2 p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            !filters.furnishingType 
                              ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                              : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          All Layouts
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== AREA FILTERS ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('area')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Ruler size={15} />
                    </div>
                    <span>Property Size Area</span>
                  </div>
                  {expandedSections.area ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {expandedSections.area && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex items-center gap-3">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            name="minSquarefoot"
                            value={filters.minSquarefoot || ''}
                            onChange={onFilterChange}
                            placeholder="Min size"
                            className={`w-full pl-3 pr-12 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-[#141923] border-white/5 text-white' : 'bg-white border-slate-200'}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">sqft</span>
                        </div>
                        <div className="w-2 h-[2px] bg-slate-300 dark:bg-slate-700" />
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            name="maxSquarefoot"
                            value={filters.maxSquarefoot || ''}
                            onChange={onFilterChange}
                            placeholder="Max size"
                            className={`w-full pl-3 pr-12 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-[#141923] border-white/5 text-white' : 'bg-white border-slate-200'}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">sqft</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== AMENITIES FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('amenities')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Sparkles size={15} />
                    </div>
                    <span>Premium Amenities</span>
                  </div>
                  {expandedSections.amenities ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {expandedSections.amenities && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1.5 scrollbar-thin">
                          {AMENITIES.slice(0, showAllAmenities ? AMENITIES.length : 10).map(amenity => {
                            const isSelected = selectedAmenities.includes(amenity);
                            return (
                              <button
                                key={amenity}
                                onClick={() => toggleAmenity(amenity)}
                                className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium transition-all border text-left truncate ${
                                  isSelected
                                    ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                                    : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className={isSelected ? 'text-black' : 'text-amber-500 shrink-0'}>
                                  {getAmenityIcon(amenity)}
                                </span>
                                <span className="truncate">{amenity}</span>
                              </button>
                            );
                          })}
                        </div>
                        {AMENITIES.length > 10 && (
                          <button
                            onClick={() => setShowAllAmenities(!showAllAmenities)}
                            className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 mt-1"
                          >
                            {showAllAmenities ? 'Show Fewer Options' : `View ${AMENITIES.length - 10} Additional Amenities`}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== KEYWORDS FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('keywords')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-sm">
                      #
                    </div>
                    <span>Custom Keywords</span>
                  </div>
                  {expandedSections.keywords ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
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
                            placeholder="e.g. Skyline view, Penthouse"
                            className={`flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-1 focus:ring-amber-500 ${isDark ? 'bg-[#141923] border-white/5 text-white' : 'bg-white border-slate-200'}`}
                          />
                          <button
                            onClick={() => addKeyword(keywordInput)}
                            className="px-4 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-600 transition-colors shrink-0"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(filters.keywords || []).map(keyword => (
                            <span
                              key={keyword}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-xs animate-fadeIn"
                            >
                              {keyword}
                              <button onClick={() => removeKeyword(keyword)} className="hover:text-amber-600 ml-0.5">
                                <X size={12} strokeWidth={2.5} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ===== VIRTUAL VIEWINGS FILTER ===== */}
              <div className={`p-4 rounded-2xl border transition-colors ${isDark ? 'border-white/5 bg-white/[0.01]' : 'border-slate-100 bg-slate-50/40'}`}>
                <button
                  onClick={() => toggleSection('virtualTours')}
                  className="flex items-center justify-between w-full font-bold text-sm text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Video size={14} />
                    </div>
                    <span>Virtual Media Options</span>
                  </div>
                  {expandedSections.virtualTours ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {expandedSections.virtualTours && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 grid grid-cols-3 gap-2">
                        <button
                          onClick={() => onFilterChange({ target: { name: 'has360Tour', value: 'true' } })}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            filters.has360Tour === 'true' 
                              ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                              : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          360° VR
                        </button>
                        <button
                          onClick={() => onFilterChange({ target: { name: 'hasVideoTour', value: 'true' } })}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            filters.hasVideoTour === 'true' 
                              ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                              : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Video Walk
                        </button>
                        <button
                          onClick={() => {
                            onFilterChange({ target: { name: 'has360Tour', value: '' } });
                            onFilterChange({ target: { name: 'hasVideoTour', value: '' } });
                          }}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                            !filters.has360Tour && !filters.hasVideoTour
                              ? 'bg-amber-500 text-black border-amber-500 font-bold' 
                              : isDark ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Any Media
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className={`p-5 border-t shrink-0 ${isDark ? 'border-white/5 bg-[#121824]' : 'border-slate-100 bg-white'}`}>
          {showMainMenu ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 text-center"
            >
              Close Menu
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleResetAndBack}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  isDark 
                    ? 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10' 
                    : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200'
                }`}
              >
                Reset & Back
              </button>
              <button
                onClick={() => {
                  onApplyFilters();
                  onClose();
                }}
                className="flex-[1.2] py-3 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 text-center"
              >
                Apply ({propertyCount})
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

// Helper component for Hash icon (since it wasn't imported)
const HashIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9" />
    <line x1="4" y1="15" x2="20" y2="15" />
    <line x1="10" y1="3" x2="8" y2="21" />
    <line x1="16" y1="3" x2="14" y2="21" />
  </svg>
);

export default FilterSidebar;