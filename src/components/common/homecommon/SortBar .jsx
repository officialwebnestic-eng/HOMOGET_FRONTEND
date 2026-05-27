// components/common/SortBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

const SortBar = ({ currentSort, onSortChange, totalResults = 0 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'beds_asc', label: 'Beds: Least to Most' },
    { value: 'beds_desc', label: 'Beds: Most to Least' },
    { value: 'area_asc', label: 'Area: Smallest to Largest' },
    { value: 'area_desc', label: 'Area: Largest to Smallest' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentLabel = () => {
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option ? option.label : 'Featured';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
          isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <ArrowUpDown size={14} />
        <span className="hidden sm:inline">Sort: {getCurrentLabel()}</span>
        <span className="sm:hidden">Sort</span>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-lg border overflow-hidden z-50 ${
          isDark ? 'bg-[#11141B] border-white/10' : 'bg-white border-slate-200'
        }`}>
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                currentSort === option.value
                  ? 'bg-amber-500/10 text-amber-500 font-medium'
                  : isDark ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortBar;