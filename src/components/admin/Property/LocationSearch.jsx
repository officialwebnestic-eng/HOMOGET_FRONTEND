import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, X, ChevronRight, Home, Building2, Building, TreePine, Landmark } from "lucide-react";
import { http } from "../../../axios/axios";
const LocationSearch = ({
    onLocationSelect,
    initialValue = "",
    isDark = false,
    error,
    required = true
}) => {
    const [locationQuery, setLocationQuery] = useState(initialValue);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const debounceTimerRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get icon based on location type
    const getLocationIcon = (type) => {
        switch (type) {
            case 'COMMUNITY': return <Home size={14} />;
            case 'SUBCOMMUNITY': return <TreePine size={14} />;
            case 'TOWER': return <Building2 size={14} />;
            case 'BUILDING': return <Building size={14} />;
            case 'LANDMARK': return <Landmark size={14} />;
            default: return <MapPin size={14} />;
        }
    };

    // Get color based on type
    const getLocationTypeColor = (type) => {
        switch (type) {
            case 'COMMUNITY': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'SUBCOMMUNITY': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'TOWER': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'BUILDING': return 'bg-purple-500/10 text-purple-600 border-purple-200';
            case 'LANDMARK': return 'bg-rose-500/10 text-rose-600 border-rose-200';
            default: return 'bg-slate-500/10 text-slate-600 border-slate-200';
        }
    };

    // Get readable type label
    const getTypeLabel = (type) => {
        switch (type) {
            case 'COMMUNITY': return 'COMMUNITY';
            case 'SUBCOMMUNITY': return 'SUBCOMMUNITY';
            case 'TOWER': return 'TOWER';
            case 'BUILDING': return 'BUILDING';
            case 'LANDMARK': return 'LANDMARK';
            default: return 'LOCATION';
        }
    };

    // 🌟 CALL NEW BACKEND CONTROLLER ENDPOINT HERE
    const searchLocations = useCallback(async (query) => {
        if (query.trim().length < 2) {
            setLocationSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setLoading(true);

        try {
            // Direct call to your newly unified local + Google API text search route
            const response = await http.get(`/locations/search?query=${encodeURIComponent(query)}`);

            // ✅ Axios automatically parses incoming JSON and places it inside '.data'
            const result = response.data;

            setLoading(false);

            if (result && result.success && result.data) {
                // Receives the clean, enriched dataset (up to 20 or more elements)
                setLocationSuggestions(result.data);
                setShowSuggestions(true);
            } else {
                setLocationSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (err) {
            console.error("Backend Search Controller request error:", err);
            setLocationSuggestions([]);
            setShowSuggestions(false);
            setLoading(false);
        }
    }, []);

    // Handle input change with debounce
    const handleInputChange = (e) => {
        const value = e.target.value;
        setLocationQuery(value);
        setSelectedIndex(-1);

        if (selectedLocation) setSelectedLocation(null);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            searchLocations(value);
        }, 400); // 400ms is ideal for balancing server load and UI responsiveness
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions || locationSuggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < locationSuggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && locationSuggestions[selectedIndex]) {
                    handleSelectLocation(locationSuggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
            default:
                break;
        }
    };

    const handleSelectLocation = (location) => {
        setSelectedLocation(location);
        setLocationQuery(location.name);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onLocationSelect(location); // Returns clean backend structure object directly to form container
    };

    const clearLocation = () => {
        setSelectedLocation(null);
        setLocationQuery("");
        setLocationSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onLocationSelect(null);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all text-sm font-medium ${isDark ? "bg-[#1A1F2B] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`;

    const labelClass = "text-[10px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider";
    const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

    return (
        <div ref={searchRef} className="relative">
            <label className={labelClass}>
                <MapPin size={12} className="inline mr-1" />
                Search Location {required && requiredStar}
            </label>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" size={16} />
                <input
                    ref={inputRef}
                    value={locationQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (locationSuggestions.length > 0 && locationQuery.length >= 2) {
                            setShowSuggestions(true);
                        }
                    }}
                    className={`${inputClass} pl-12`}
                    placeholder="Search community, building, or area... (e.g., 'Marina', 'Greens', 'Downtown', 'Burj')"
                    autoComplete="off"
                />
                {loading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-amber-500" size={16} />
                )}
                {locationQuery && !loading && (
                    <button
                        type="button"
                        onClick={clearLocation}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Selected Location Display */}
            {selectedLocation && !showSuggestions && (
                <div className={`mt-3 p-3 rounded-xl border ${getLocationTypeColor(selectedLocation.type)} ${isDark ? "bg-opacity-10" : "bg-opacity-100"
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-white/20">
                            {getLocationIcon(selectedLocation.type)}
                        </div>
                        <div className="flex-1">
                            <p className="text-[9px] font-bold uppercase text-amber-500 tracking-wider">Selected Location</p>
                            <p className="text-sm font-bold">{selectedLocation.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{selectedLocation.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${getLocationTypeColor(selectedLocation.type)}`}>
                                    {getTypeLabel(selectedLocation.type)}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={clearLocation}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && locationSuggestions.length > 0 && (
                <div
                    className={`absolute z-[110] w-full mt-2 border rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ${isDark ? "bg-[#1A1F2B]/98 border-white/10" : "bg-white/98 border-slate-200"
                        }`}
                >
                    {/* Header */}
                    <div className={`px-4 py-2 border-b ${isDark ? "border-white/10 bg-white/5" : "border-slate-100 bg-slate-50"}`}>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-slate-400">
                                {locationSuggestions.length} location{locationSuggestions.length !== 1 ? 's' : ''} found
                            </span>
                            <span className="text-[8px] text-slate-400">
                                Press ESC to close
                            </span>
                        </div>
                    </div>

                    {/* Scrollable Results */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {locationSuggestions.map((loc, idx) => (
                            <div
                                key={loc.id || idx}
                                onClick={() => handleSelectLocation(loc)}
                                className={`px-4 py-3 cursor-pointer transition-all hover:bg-amber-500/10 border-b last:border-0 group ${selectedIndex === idx ? 'bg-amber-500/20' : ''
                                    } ${isDark ? "border-white/5" : "border-slate-100"}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className={`p-2 rounded-lg transition-all group-hover:bg-amber-500/20 ${isDark ? "bg-white/5" : "bg-slate-100"
                                        }`}>
                                        {getLocationIcon(loc.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        {/* Title */}
                                        <p className="text-sm font-bold truncate">{loc.name}</p>

                                        {/* Full path / breadcrumb */}
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <ChevronRight size={10} className="text-amber-500 flex-shrink-0" />
                                            <p className="text-[10px] text-slate-500 truncate">
                                                {loc.path_name || loc.title}
                                            </p>
                                        </div>

                                        {/* Type Badge */}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${getLocationTypeColor(loc.type)}`}>
                                                {getTypeLabel(loc.type)}
                                            </span>
                                            <span className="text-[8px] text-slate-400">
                                                {loc.isFromGoogle ? "Verified via Search Index" : "Local Inventory Reference"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow indicator */}
                                    <ChevronRight size={14} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {showSuggestions && locationQuery.length >= 2 && locationSuggestions.length === 0 && !loading && (
                <div className={`absolute z-[110] w-full mt-2 border rounded-xl shadow-2xl overflow-hidden p-6 text-center ${isDark ? "bg-[#1A1F2B]/98 border-white/10" : "bg-white/98 border-slate-200"
                    }`}>
                    <MapPin size={32} className="mx-auto mb-2 text-slate-400" />
                    <p className="text-sm font-medium">No locations found</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Try searching for "Dubai Marina", "Downtown Dubai", "Palm Jumeirah", or "Burj Khalifa"
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                        {['Dubai Marina', 'Downtown Dubai', 'The Greens', 'Burj Khalifa', 'Palm Jumeirah'].map(suggestion => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                    setLocationQuery(suggestion);
                                    searchLocations(suggestion);
                                }}
                                className="text-[9px] px-2 py-1 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                            >
                                Try "{suggestion}"
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {error && <p className="text-red-500 text-[9px] mt-1">{error}</p>}

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#1A1F2B' : '#f1f1f1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#3a3f4b' : '#cbd5e1'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#4a4f5b' : '#94a3b8'};
        }
      `}</style>
        </div>
    );
};

export default LocationSearch;





















