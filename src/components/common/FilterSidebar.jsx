// components/common/FilterSidebar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, X, SlidersHorizontal, CheckCircle2,
  Bed, Bath, Ruler, DollarSign, Wifi, Car, Dumbbell, Waves,
  Coffee, Shield, Key, Award, Sparkles, ArrowLeft, Video,
  ChevronRight, Hash, Home,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { AMENITIES } from '../../helpers/AddPropertyHelpers';

/* ================================================================== */
/*  DEFAULTS + NORMALIZER (fixes "Cannot read properties of undefined") */
/* ================================================================== */
const DEFAULT_FILTERS = {
  minPrice: '',
  maxPrice: '',
  bedroom: '',
  bathroom: '',
  propertytype: [],
  furnishingType: '',
  minSquarefoot: '',
  maxSquarefoot: '',
  amenities: [],
  keywords: [],
  has360Tour: '',
  hasVideoTour: '',
};

const normalizeFilters = (f) => ({
  minPrice: f?.minPrice ?? '',
  maxPrice: f?.maxPrice ?? '',
  bedroom: f?.bedroom ?? '',
  bathroom: f?.bathroom ?? '',
  propertytype: Array.isArray(f?.propertytype) ? f.propertytype : [],
  furnishingType: f?.furnishingType ?? '',
  minSquarefoot: f?.minSquarefoot ?? '',
  maxSquarefoot: f?.maxSquarefoot ?? '',
  amenities: Array.isArray(f?.amenities) ? f.amenities : [],
  keywords: Array.isArray(f?.keywords) ? f.keywords : [],
  has360Tour: f?.has360Tour ?? '',
  hasVideoTour: f?.hasVideoTour ?? '',
});

/* ================================================================== */
/*  STATIC COLOR MAP (fixes Tailwind dynamic class bug)               */
/* ================================================================== */
const COLOR_MAP = {
  amber:   'bg-amber-500/10 text-amber-500',
  blue:    'bg-blue-500/10 text-blue-500',
  cyan:    'bg-cyan-500/10 text-cyan-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  purple:  'bg-purple-500/10 text-purple-500',
  rose:    'bg-rose-500/10 text-rose-500',
  pink:    'bg-pink-500/10 text-pink-500',
  indigo:  'bg-indigo-500/10 text-indigo-500',
  orange:  'bg-orange-500/10 text-orange-500',
};

/* ================================================================== */
/*  COMPONENT                                                         */
/* ================================================================== */
const FilterSidebar = ({
  isOpen,
  onClose,
  filters: rawFilters,
  onFilterChange = () => {},
  onApplyFilters = () => {},
  onClearFilters = () => {},
  propertyCount = 0,
}) => {
  /* ---------- Normalized filters — never undefined ---------- */
  const filters = useMemo(() => normalizeFilters(rawFilters), [rawFilters]);

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
    virtualTours: false,
  });

  const [selectedAmenities, setSelectedAmenities] = useState(filters.amenities);
  const [keywordInput, setKeywordInput] = useState('');
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  /* ---------- Sync amenities with parent ---------- */
  useEffect(() => {
    setSelectedAmenities(filters.amenities);
  }, [filters.amenities]);

  /* ---------- Lock body scroll when open (fixes mobile scroll) ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  /* ---------- Handlers ---------- */
  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const toggleAmenity = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updated);
    onFilterChange({ target: { name: 'amenities', value: updated } });
  };

  const addKeyword = (keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const current = filters.keywords || [];
    if (!current.includes(trimmed)) {
      onFilterChange({
        target: { name: 'keywords', value: [...current, trimmed] },
      });
    }
    setKeywordInput('');
  };

  const removeKeyword = (keyword) => {
    const updated = filters.keywords.filter((k) => k !== keyword);
    onFilterChange({ target: { name: 'keywords', value: updated } });
  };

  const handleResetAndBack = () => {
    onClearFilters();
    setShowMainMenu(true);
  };

  const handleBackToMenu = () => setShowMainMenu(true);

  const handleVirtualTourAny = () => {
    // Batch both updates into one object to avoid stale-closure race
    onFilterChange({
      target: {
        name: '__batch',
        value: { has360Tour: '', hasVideoTour: '' },
      },
    });
  };

  /* ---------- Static option sets ---------- */
  const bedroomOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  const bathroomOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const furnishingOptions = [
    { value: 'Furnished', label: 'Furnished' },
    { value: 'Unfurnished', label: 'Unfurnished' },
    { value: 'Semi-Furnished', label: 'Partly Furnished' },
  ];

  const propertyTypes = [
    'Apartments', 'Bulk Units', 'Bungalow', 'Compound', 'Duplex',
    'Full Floor', 'Half Floor', 'Hotel Apartment', 'Penthouse',
    'Townhouse', 'Villa', 'Whole Building', 'Business Center',
    'Coworking Space', 'Factory', 'Farm', 'Labor Camp', 'Land',
    'Office Space', 'Retail', 'Shop', 'Showroom', 'Staff Accommodation',
    'Warehouse',
  ];

  const getAmenityIcon = (amenity) => {
    const a = amenity.toLowerCase();
    if (a.includes('pool')) return <Waves size={15} />;
    if (a.includes('gym')) return <Dumbbell size={15} />;
    if (a.includes('parking')) return <Car size={15} />;
    if (a.includes('wifi') || a.includes('internet')) return <Wifi size={15} />;
    if (a.includes('security') || a.includes('cctv')) return <Shield size={15} />;
    if (a.includes('cafe') || a.includes('restaurant')) return <Coffee size={15} />;
    if (a.includes('garden') || a.includes('park')) return <Award size={15} />;
    if (a.includes('spa') || a.includes('sauna')) return <Sparkles size={15} />;
    if (a.includes('concierge')) return <Key size={15} />;
    return <CheckCircle2 size={15} />;
  };

  /* ---------- Main menu options ---------- */
  const mainMenuOptions = [
    { id: 'price',        icon: <DollarSign size={16} />,        label: 'Price Range',        color: 'amber' },
    { id: 'bedrooms',     icon: <Bed size={16} />,               label: 'Bedrooms',           color: 'blue' },
    { id: 'bathrooms',    icon: <Bath size={16} />,              label: 'Bathrooms',          color: 'cyan' },
    { id: 'propertyType', icon: <Home size={16} />,              label: 'Property Type',      color: 'emerald' },
    { id: 'furnishing',   icon: <Key size={16} />,               label: 'Furnishing',         color: 'purple' },
    { id: 'area',         icon: <Ruler size={16} />,             label: 'Area Size',          color: 'rose' },
    { id: 'amenities',    icon: <Sparkles size={16} />,          label: 'Amenities',          color: 'pink' },
    { id: 'keywords',     icon: <Hash size={16} />,              label: 'Keywords',           color: 'indigo' },
    { id: 'virtualTours', icon: <Video size={16} />,             label: 'Virtual Tours',      color: 'orange' },
  ];

  /* ---------- Render main menu ---------- */
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
            setExpandedSections((prev) => ({ ...prev, [option.id]: true }));
          }}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all border ${
            isDark
              ? 'border-white/5 hover:bg-white/10'
              : 'border-slate-100 hover:bg-slate-50'
          } group`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${COLOR_MAP[option.color]}`}
          >
            {option.icon}
          </div>
          <span className="flex-1 text-left text-xs font-bold uppercase tracking-wider">
            {option.label}
          </span>
          <ChevronRight
            size={14}
            className="text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
          />
        </button>
      ))}
    </div>
  );

  /* ---------- Reusable section shell ---------- */
  const SectionCard = ({ children }) => (
    <div
      className={`p-4 rounded-2xl border transition-colors ${
        isDark
          ? 'border-white/5 bg-white/[0.01]'
          : 'border-slate-100 bg-slate-50/40'
      }`}
    >
      {children}
    </div>
  );

  /* ---------- Reusable section header ---------- */
  const SectionHeader = ({ icon, label, section }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full font-bold text-sm text-left"
      aria-expanded={expandedSections[section]}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
          {icon}
        </div>
        <span>{label}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp size={16} className="text-slate-400" />
      ) : (
        <ChevronDown size={16} className="text-slate-400" />
      )}
    </button>
  );

  /* ---------- Reusable animated collapsible ---------- */
  const Collapsible = ({ open, children }) => (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ---------- Pill button (bedrooms/bathrooms) ---------- */
  const Pill = ({ active, onClick, children, className = '' }) => (
    <button
      onClick={onClick}
      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${className} ${
        active
          ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm shadow-amber-500/10'
          : isDark
          ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9997] bg-black/60 backdrop-blur-md sm:bg-black/40 sm:backdrop-blur-sm"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Property filters"
        aria-hidden={!isOpen}
        className={`
          fixed top-0 right-0 h-[100dvh] z-[9998]
          transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          ${isDark ? 'bg-[#0d111a] text-slate-100' : 'bg-white text-slate-800'}
          shadow-[0_0_60px_rgba(0,0,0,0.15)] border-l
          ${isDark ? 'border-white/5' : 'border-slate-100'}
          w-[85vw] sm:w-[440px]
        `}
      >
        {/* ---------- Header ---------- */}
        <div
          className={`p-5 border-b shrink-0 ${
            isDark
              ? 'border-white/5 bg-[#121824]'
              : 'border-slate-100 bg-slate-50/80'
          } backdrop-blur-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!showMainMenu && (
                <button
                  onClick={handleBackToMenu}
                  aria-label="Back to filter menu"
                  className={`p-2 rounded-xl transition-all ${
                    isDark
                      ? 'border-white/5 bg-white/5 hover:bg-white/10'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
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
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      isDark
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {propertyCount} Match
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close filters"
              className={`p-2 rounded-xl transition-colors ${
                isDark
                  ? 'hover:bg-white/5 text-slate-400'
                  : 'hover:bg-slate-200/60 text-slate-500'
              }`}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ---------- Body ---------- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {showMainMenu ? (
            renderMainMenu()
          ) : (
            <>
              {/* ===== PRICE ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<DollarSign size={15} />}
                  label="Price Range (AED)"
                  section="price"
                />
                <Collapsible open={expandedSections.price}>
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                          Min
                        </span>
                        <input
                          type="number"
                          name="minPrice"
                          value={filters.minPrice}
                          onChange={onFilterChange}
                          placeholder="0"
                          className={`w-full pl-11 pr-3 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${
                            isDark
                              ? 'bg-[#141923] border-white/5 text-white'
                              : 'bg-white border-slate-200'
                          }`}
                        />
                      </div>
                      <div className="w-2 h-[2px] bg-slate-300 dark:bg-slate-700" />
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                          Max
                        </span>
                        <input
                          type="number"
                          name="maxPrice"
                          value={filters.maxPrice}
                          onChange={onFilterChange}
                          placeholder="Any"
                          className={`w-full pl-11 pr-3 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${
                            isDark
                              ? 'bg-[#141923] border-white/5 text-white'
                              : 'bg-white border-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: '500k', value: 500000 },
                        { label: '1M', value: 1000000 },
                        { label: '2M', value: 2000000 },
                        { label: '5M', value: 5000000 },
                        { label: '10M', value: 10000000 },
                      ].map(({ label, value }) => (
                        <button
                          key={label}
                          onClick={() =>
                            onFilterChange({
                              target: { name: 'maxPrice', value },
                            })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all border ${
                            isDark
                              ? 'bg-white/5 hover:bg-white/10 border-transparent'
                              : 'bg-white hover:bg-slate-100 border-slate-200'
                          }`}
                        >
                          AED {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== BEDROOMS ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Bed size={15} />}
                  label="Bedrooms"
                  section="bedrooms"
                />
                <Collapsible open={expandedSections.bedrooms}>
                  <div className="pt-4">
                    <div className="grid grid-cols-3 gap-1.5">
                      {bedroomOptions.map((num) => {
                        const active = parseInt(filters.bedroom, 10) === num;
                        return (
                          <Pill
                            key={num}
                            active={active}
                            onClick={() =>
                              onFilterChange({
                                target: {
                                  name: 'bedroom',
                                  value: active ? '' : num,
                                },
                              })
                            }
                          >
                            {num}
                          </Pill>
                        );
                      })}
                      <Pill
                        active={filters.bedroom === '9+'}
                        onClick={() =>
                          onFilterChange({
                            target: {
                              name: 'bedroom',
                              value: filters.bedroom === '9+' ? '' : '9+',
                            },
                          })
                        }
                      >
                        9+
                      </Pill>
                    </div>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== BATHROOMS ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Bath size={15} />}
                  label="Bathrooms"
                  section="bathrooms"
                />
                <Collapsible open={expandedSections.bathrooms}>
                  <div className="pt-4">
                    <div className="grid grid-cols-3 gap-1.5">
                      {bathroomOptions.map((num) => {
                        const active = parseInt(filters.bathroom, 10) === num;
                        return (
                          <Pill
                            key={num}
                            active={active}
                            onClick={() =>
                              onFilterChange({
                                target: {
                                  name: 'bathroom',
                                  value: active ? '' : num,
                                },
                              })
                            }
                          >
                            {num}
                          </Pill>
                        );
                      })}
                      <Pill
                        active={filters.bathroom === '9+'}
                        onClick={() =>
                          onFilterChange({
                            target: {
                              name: 'bathroom',
                              value: filters.bathroom === '9+' ? '' : '9+',
                            },
                          })
                        }
                      >
                        9+
                      </Pill>
                    </div>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== PROPERTY TYPE ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Home size={15} />}
                  label="Property Classification"
                  section="propertyType"
                />
                <Collapsible open={expandedSections.propertyType}>
                  <div className="pt-3">
                    <div className="space-y-1 max-h-52 overflow-y-auto pr-2 divide-y divide-slate-100 dark:divide-white/5">
                      {propertyTypes.map((type) => {
                        const isChecked = filters.propertytype.includes(type);
                        return (
                          <label
                            key={type}
                            className="flex items-center justify-between py-2.5 cursor-pointer group"
                          >
                            <span
                              className={`text-xs font-medium transition-colors ${
                                isChecked
                                  ? 'text-amber-500 font-semibold'
                                  : 'text-slate-400 dark:text-slate-300 group-hover:text-slate-600'
                              }`}
                            >
                              {type}
                            </span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                const updated = isChecked
                                  ? filters.propertytype.filter((t) => t !== type)
                                  : [...filters.propertytype, type];
                                onFilterChange({
                                  target: {
                                    name: 'propertytype',
                                    value: updated,
                                  },
                                });
                              }}
                              className="w-4 h-4 rounded border-slate-300 dark:border-white/10 text-amber-500 focus:ring-amber-500 dark:bg-white/5"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== FURNISHING ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Key size={15} />}
                  label="Furnishing Layer"
                  section="furnishing"
                />
                <Collapsible open={expandedSections.furnishing}>
                  <div className="pt-3 grid grid-cols-2 gap-2">
                    {furnishingOptions.map((option) => {
                      const active = filters.furnishingType === option.value;
                      return (
                        <Pill
                          key={option.value}
                          active={active}
                          onClick={() =>
                            onFilterChange({
                              target: {
                                name: 'furnishingType',
                                value: active ? '' : option.value,
                              },
                            })
                          }
                          className="p-2.5 text-center"
                        >
                          {option.label}
                        </Pill>
                      );
                    })}
                    <Pill
                      active={!filters.furnishingType}
                      onClick={() =>
                        onFilterChange({
                          target: { name: 'furnishingType', value: '' },
                        })
                      }
                      className="col-span-2 p-2.5 text-center"
                    >
                      All Layouts
                    </Pill>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== AREA ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Ruler size={15} />}
                  label="Property Size Area"
                  section="area"
                />
                <Collapsible open={expandedSections.area}>
                  <div className="pt-4 flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        name="minSquarefoot"
                        value={filters.minSquarefoot}
                        onChange={onFilterChange}
                        placeholder="Min size"
                        className={`w-full pl-3 pr-12 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${
                          isDark
                            ? 'bg-[#141923] border-white/5 text-white'
                            : 'bg-white border-slate-200'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                        sqft
                      </span>
                    </div>
                    <div className="w-2 h-[2px] bg-slate-300 dark:bg-slate-700" />
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        name="maxSquarefoot"
                        value={filters.maxSquarefoot}
                        onChange={onFilterChange}
                        placeholder="Max size"
                        className={`w-full pl-3 pr-12 py-2.5 rounded-xl border text-sm outline-none font-medium transition-all focus:ring-1 focus:ring-amber-500 ${
                          isDark
                            ? 'bg-[#141923] border-white/5 text-white'
                            : 'bg-white border-slate-200'
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                        sqft
                      </span>
                    </div>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== AMENITIES ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Sparkles size={15} />}
                  label="Premium Amenities"
                  section="amenities"
                />
                <Collapsible open={expandedSections.amenities}>
                  <div className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1.5">
                      {AMENITIES.slice(
                        0,
                        showAllAmenities ? AMENITIES.length : 10
                      ).map((amenity) => {
                        const isSelected = selectedAmenities.includes(amenity);
                        return (
                          <button
                            key={amenity}
                            onClick={() => toggleAmenity(amenity)}
                            className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-medium transition-all border text-left truncate ${
                              isSelected
                                ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                                : isDark
                                ? 'bg-[#141923] text-slate-300 border-white/5 hover:bg-white/10'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span
                              className={
                                isSelected ? 'text-black' : 'text-amber-500 shrink-0'
                              }
                            >
                              {getAmenityIcon(amenity)}
                            </span>
                            <span className="truncate">{amenity}</span>
                          </button>
                        );
                      })}
                    </div>
                    {AMENITIES.length > 10 && (
                      <button
                        onClick={() => setShowAllAmenities((s) => !s)}
                        className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1 mt-1"
                      >
                        {showAllAmenities
                          ? 'Show Fewer Options'
                          : `View ${AMENITIES.length - 10} Additional Amenities`}
                      </button>
                    )}
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== KEYWORDS ===== */}
              <SectionCard>
                <SectionHeader
                  icon={
                    <span className="font-black text-sm leading-none">#</span>
                  }
                  label="Custom Keywords"
                  section="keywords"
                />
                <Collapsible open={expandedSections.keywords}>
                  <div className="pt-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addKeyword(keywordInput);
                          }
                        }}
                        placeholder="e.g. Skyline view, Penthouse"
                        className={`flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-1 focus:ring-amber-500 ${
                          isDark
                            ? 'bg-[#141923] border-white/5 text-white'
                            : 'bg-white border-slate-200'
                        }`}
                      />
                      <button
                        onClick={() => addKeyword(keywordInput)}
                        className="px-4 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-600 transition-colors shrink-0"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {filters.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 font-medium text-xs"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="hover:text-amber-600 ml-0.5"
                            aria-label={`Remove ${keyword}`}
                          >
                            <X size={12} strokeWidth={2.5} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </Collapsible>
              </SectionCard>

              {/* ===== VIRTUAL TOURS ===== */}
              <SectionCard>
                <SectionHeader
                  icon={<Video size={14} />}
                  label="Virtual Media Options"
                  section="virtualTours"
                />
                <Collapsible open={expandedSections.virtualTours}>
                  <div className="pt-3 grid grid-cols-3 gap-2">
                    <Pill
                      active={filters.has360Tour === 'true'}
                      onClick={() =>
                        onFilterChange({
                          target: {
                            name: 'has360Tour',
                            value:
                              filters.has360Tour === 'true' ? '' : 'true',
                          },
                        })
                      }
                      className="p-2.5 text-center"
                    >
                      360° VR
                    </Pill>
                    <Pill
                      active={filters.hasVideoTour === 'true'}
                      onClick={() =>
                        onFilterChange({
                          target: {
                            name: 'hasVideoTour',
                            value:
                              filters.hasVideoTour === 'true' ? '' : 'true',
                          },
                        })
                      }
                      className="p-2.5 text-center"
                    >
                      Video Walk
                    </Pill>
                    <Pill
                      active={!filters.has360Tour && !filters.hasVideoTour}
                      onClick={handleVirtualTourAny}
                      className="p-2.5 text-center"
                    >
                      Any Media
                    </Pill>
                  </div>
                </Collapsible>
              </SectionCard>
            </>
          )}
        </div>

        {/* ---------- Footer ---------- */}
        <div
          className={`p-5 border-t shrink-0 ${
            isDark ? 'border-white/5 bg-[#121824]' : 'border-slate-100 bg-white'
          }`}
        >
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
                Reset &amp; Back
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

export default FilterSidebar;