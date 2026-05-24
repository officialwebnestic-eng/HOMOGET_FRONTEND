import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { AuthContext } from "../../../context/AuthContext";
import {
  Upload,
  X,
  MapPin,
  Loader2,
  Sparkles,
  ShieldCheck,
  FileText,
  Wallet,
  Building2,
  Plus,
  Trash2,
  Search,
  Globe,
  Bed,
  Bath,
  Layers,
  Navigation,
  Home,
  Camera,
  CheckCircle2,
  User,
  Hash,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Video,
  Circle,
  Award,
  Eye
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";

// Import Helpers
import { DUBAI_AREAS, AMENITIES } from "../../../helpers/AddPropertyHelpers";

const AddPropertyByAgent = () => {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";
  const containerRef = useRef(null);

  // --- States ---
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [langTab, setLangTab] = useState("en");
  const [developers, setDevelopers] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAmenity, setSearchAmenity] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

  const searchTimeoutRef = useRef(null);
  const TOMTOM_API_KEY = "YDlNOyLlX4RImV4fciotLz74L5JXykXG";

  const filteredAmenities = AMENITIES.filter((item) =>
    item.toLowerCase().includes(searchAmenity.toLowerCase())
  );

  const CURRENCIES = ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "OMR", "KWD", "BHD"];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      permitType: "RERA",
      category: "Residential",
      offeringType: "Sale",
      propertyUnit: "Square Ft",
      currency: "AED",
      amenities: [],
      propertyAge: "Brand New",
      status: "Active",
      nearByLocations: [{ locationName: "", distance: "", transportType: "Drive" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nearByLocations",
  });

  // --- Watchers ---
  const watchCategory = watch("category");
  const watchOffering = watch("offeringType");
  const watchPermit = watch("permitType");
  const watchAmenities = watch("amenities") || [];

  // --- Dynamic Enums ---
  const resTypes = [
    "Apartments", "Bulk Units", "Bungalow", "Compound", "Duplex",
    "Hotel Apartment", "Penthouse", "Townhouse", "Villa", "Whole Building"
  ];
  const commTypes = [
    "Business Center", "Coworking Space", "Factory", "Farm", "Full Floor",
    "Half Floor", "Labor Camp", "Land", "Office Space", "Retail", "Shop",
    "Showroom", "Staff Accommodation", "Warehouse", "Whole Building"
  ];
  const offPlanTypes = ["Apartments", "Villas", "Townhouses", "Penthouses", "Land"];

  const getPropertyTypes = () => {
    if (watchCategory === "Commercial") return commTypes;
    if (watchCategory === "Off-Plan") return offPlanTypes;
    return resTypes;
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoadingDevs(true);
        const res = await http.get("/developers");
        if (res.data.success) setDevelopers(res.data.data);
      } catch (err) {
        console.error("Dev Fetch Error:", err);
      } finally {
        setLoadingDevs(false);
      }
    };
    fetchDevelopers();
  }, []);

  // TomTom Location Search (Same as PropertyListing)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!locationQuery || locationQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
          locationQuery
        )}.json?key=${TOMTOM_API_KEY}&countrySet=AE&limit=8&typeahead=true&lat=25.2048&lon=55.2708&radius=50000`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results) {
          const formatted = data.results.map((item) => ({
            id: item.id,
            name: item.poi?.name || item.address?.municipalitySubdivision || item.address?.municipality || item.address?.freeformAddress,
            address: item.address?.freeformAddress,
            community: item.address?.municipalitySubdivision || item.address?.municipality || "Dubai",
            type: item.type || (item.poi ? "POI" : "Geography")
          }));
          setSuggestions(formatted);
        }
      } catch (err) {
        console.error("TomTom API error:", err);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [locationQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocation = (item) => {
    const fullAddress = `${item.name}, ${item.community}, Dubai`;
    setValue("address", fullAddress);
    setValue("community", item.community);
    setLocationQuery(item.name);
    setShowSuggestions(false);
  };

  const toggleAmenity = (amenity) => {
    const current = watchAmenities;
    setValue(
      "amenities",
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]
    );
  };

  const clearLocationSearch = () => {
    setLocationQuery("");
    setSuggestions([]);
  };

  const sections = [
    { id: "basic", label: "Basic Info", icon: <Home size={14} /> },
    { id: "compliance", label: "Compliance", icon: <ShieldCheck size={14} /> },
    { id: "specs", label: "Specifications", icon: <Layers size={14} /> },
    { id: "location", label: "Location", icon: <MapPin size={14} /> },
    { id: "media", label: "Media", icon: <Camera size={14} /> },
    { id: "amenities", label: "Amenities", icon: <Sparkles size={14} /> },
    { id: "pricing", label: "Pricing", icon: <DollarSign size={14} /> },
  ];

  const onSubmit = async (data) => {
    if (files.length === 0) return addToast("Media Portfolio Required", "error");
    if (!user?.id) return addToast("User not authenticated", "error");

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key === "nearByLocations" || key === "amenities") {
          formData.append(key, JSON.stringify(data[key]));
        } else if (typeof data[key] === "object") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      formData.append("agentId", user.id);
      files.forEach((file) => formData.append("image", file));
      formData.append("userType", "agent");

      const res = await http.post("/addproperty", formData, { withCredentials: true });
      if (res.data.success) {
        addToast("Property added successfully", "success");
        reset();
        setFiles([]);
        setLocationQuery("");
        setSuggestions([]);
      }
    } catch (e) {
      addToast(e.response?.data?.message || "Sync Failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-1 focus:ring-amber-500 transition-all text-sm font-semibold ${isDark ? "bg-[#1A1F2B] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
    }`;
  const labelClass = "text-[9px] font-bold uppercase text-slate-500 mb-1 block tracking-wider";
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  // Get badge color for suggestion type
  const getBadgeColor = (type) => {
    if (type === "POI") return "bg-amber-500/20 text-amber-500";
    return "bg-blue-500/20 text-blue-500";
  };

  return (
    <div className={`min-h-screen pb-20 ${isDark ? "bg-[#0F1219]" : "bg-[#F8FAFC]"}`}>
      {/* MODERN HEADER */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-md ${isDark ? "bg-[#0F1219]/90 border-white/5" : "bg-white/90 border-slate-200"}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-black" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase italic leading-none">
                Homoget <span className="text-amber-500">Dubai</span>
              </h1>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Agent Portal • Add Property
              </p>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-amber-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-amber-400 transition-all flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
            {isSubmitting ? "Syncing..." : "Launch Asset"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 sticky top-20 z-50 bg-inherit py-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(`section-${section.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection(section.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all ${activeSection === section.id
                  ? "bg-amber-500 text-black"
                  : isDark
                    ? "bg-white/5 text-slate-400 hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        {/* ===== SECTION 1: BASIC INFO ===== */}
        <div id="section-basic" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Home />} title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title (English) {requiredStar}</label>
              <input {...register("propertyTitleEn", { required: true })} className={inputClass} placeholder="e.g., Luxury Penthouse with Burj View" />
              {errors.propertyTitleEn && <p className="text-red-500 text-[9px] mt-1">Required</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Property Title (Arabic)</label>
              <input {...register("propertyTitleAr")} className={`${inputClass} text-right font-arabic`} placeholder="عنوان العقار بالعربية" />
            </div>
            <div>
              <label className={labelClass}>Category {requiredStar}</label>
              <select {...register("category", { required: true })} className={inputClass}>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Off-Plan">Off-Plan</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Type {requiredStar}</label>
              <select {...register("propertytype", { required: true })} className={inputClass}>
                <option value="">Select Type</option>
                {getPropertyTypes().map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Offering Type {requiredStar}</label>
              <select {...register("offeringType", { required: true })} className={inputClass}>
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>
            {watchOffering === "Rent" && (
              <div>
                <label className={labelClass}>Rented Period {requiredStar}</label>
                <select {...register("rentedPeriod", { required: watchOffering === "Rent" })} className={inputClass}>
                  <option value="Per Year">Per Year</option>
                  <option value="Per Month">Per Month</option>
                  <option value="Per Week">Per Week</option>
                  <option value="Per Day">Per Day</option>
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Status</label>
              <select {...register("status")} className={inputClass}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: COMPLIANCE ===== */}
        <div id="section-compliance" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<ShieldCheck />} title="License & Compliance" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Permit Authority {requiredStar}</label>
              <select {...register("permitType", { required: true })} className={inputClass}>
                <option value="RERA">RERA (Dubai)</option>
                <option value="DTC">DTC</option>
                <option value="DIFC">DIFC</option>
                <option value="JAFZA">JAFZA</option>
                <option value="None">None</option>
              </select>
            </div>
            {watchPermit === "RERA" && (
              <>
                <div>
                  <label className={labelClass}>Trakheesi Number</label>
                  <input {...register("trakheesiNumber")} className={inputClass} placeholder="Permit ID" />
                </div>
                
              </>
            )}
            <div>
              <label className={labelClass}>Owner Name</label>
              <input {...register("ownerName")} className={inputClass} placeholder="Full Name" />
            </div>
            {watchCategory === "Off-Plan" && (
              <div className="border border-dashed border-amber-500/20 p-3 rounded-xl bg-amber-500/5">
                <label className={`${labelClass} text-amber-500`}>Developer Partner</label>
                <select {...register("developerId")} className={inputClass}>
                  <option value="">{loadingDevs ? "Fetching..." : "Select Developer..."}</option>
                  {developers.map((dev) => (
                    <option key={dev._id} value={dev._id}>{dev.companyName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ===== SECTION 3: SPECIFICATIONS ===== */}
        <div id="section-specs" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Layers />} title="Physical Specifications" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClass}>Bedrooms</label>
              <select {...register("bedroom")} className={inputClass}>
                {[...Array(21).keys()].map((i) => (
                  <option key={i} value={i}>{i === 0 ? "Studio" : i + " Beds"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Bathrooms</label>
              <select {...register("bathroom")} className={inputClass}>
                {[...Array(11).keys()].map((i) => (
                  <option key={i} value={i}>{i} Baths</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Total Floors</label>
              <input type="number" {...register("totalFloor")} className={inputClass} placeholder="Floors" />
            </div>
            <div>
              <label className={labelClass}>Area (sqft) {requiredStar}</label>
              <input type="number" {...register("squarefoot", { required: true })} className={inputClass} placeholder="Size in sqft" />
            </div>
            <div>
              <label className={labelClass}>Unit/Suite No</label>
              <input {...register("unitNo")} className={inputClass} placeholder="e.g., 1201" />
            </div>
            <div>
              <label className={labelClass}>Parking Slots</label>
              <input type="number" {...register("parkingSlots")} className={inputClass} defaultValue={0} />
            </div>
            <div>
              <label className={labelClass}>Furnishing Type</label>
              <select {...register("furnishingType")} className={inputClass}>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Furnished">Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Age</label>
              <select {...register("propertyAge")} className={inputClass}>
                <option value="Brand New">Brand New</option>
                <option value="1-2 Years">1-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5-10 Years">5-10 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Availability</label>
              <select {...register("availability")} className={inputClass}>
                <option value="Immediately">Immediately</option>
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 4: LOCATION (WITH TOMTOM SEARCH) ===== */}
        <div id="section-location" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<MapPin />} title="Location & Geography" />
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative" ref={containerRef}>
                <label className={labelClass}>Address Search {requiredStar}</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    value={locationQuery}
                    onChange={(e) => { setLocationQuery(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    className={`${inputClass} pl-12`}
                    placeholder="Search by community, tower or area..."
                  />
                  {locationQuery && (
                    <button
                      onClick={clearLocationSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X size={16} className="text-slate-400 hover:text-amber-500" />
                    </button>
                  )}
                </div>

                {/* TomTom Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (locationQuery.length >= 2 || isSearching) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute z-[110] w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500">Popular Locations in Dubai</p>
                      </div>
                      
                      {isSearching ? (
                        <div className="py-8 text-center">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" />
                          <p className="text-xs text-slate-500 mt-2">Searching...</p>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {suggestions.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleSelectLocation(item)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0 group"
                            >
                              <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-amber-500 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                      {item.name}
                                    </p>
                                    {item.type && (
                                      <span className={`text-[8px] px-2 py-0.5 rounded-full ${getBadgeColor(item.type)}`}>
                                        {item.type === "POI" ? "Landmark" : "Area"}
                                      </span>
                                    )}
                                  </div>
                                  {item.address && (
                                    <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                                      {item.address}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : locationQuery.length >= 2 ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-slate-500">No locations found</p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <label className={labelClass}>Community {requiredStar}</label>
                <select {...register("community", { required: true })} className={inputClass}>
                  <option value="">Select Area...</option>
                  {DUBAI_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Full Address {requiredStar}</label>
                <input {...register("address", { required: true })} className={inputClass} placeholder="Complete Address" />
              </div>
            </div>

            <div className="space-y-4">
              <label className={labelClass}>Nearby Locations</label>
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-xl items-end">
                  <div className="md:col-span-2">
                    <input {...register(`nearByLocations.${index}.locationName`, { required: true })} placeholder="Landmark Name" className={inputClass} />
                  </div>
                  <div>
                    <input {...register(`nearByLocations.${index}.distance`, { required: true })} placeholder="Distance (e.g., 5 min)" className={inputClass} />
                  </div>
                  <div>
                    <select {...register(`nearByLocations.${index}.transportType`)} className={inputClass} defaultValue="Drive">
                      <option value="Drive">Drive</option>
                      <option value="Walk">Walk</option>
                      <option value="Metro">Metro</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => remove(index)} className="h-14 px-4 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ locationName: "", distance: "", transportType: "Drive" })} className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 tracking-widest">
                <Plus size={14} /> Add Nearby Location
              </button>
            </div>
          </div>
        </div>

        {/* ===== SECTION 5: DESCRIPTION ===== */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <div className="flex justify-between items-center mb-6">
            <SectionHeader icon={<FileText />} title="Description" />
            <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-xl">
              {["en", "ar"].map((l) => (
                <button key={l} type="button" onClick={() => setLangTab(l)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${langTab === l ? "bg-amber-500 text-black" : "text-slate-500"}`}>
                  {l === "en" ? "English" : "Arabic"}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={langTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
              <div>
                <label className={labelClass}>{langTab === "en" ? "Description" : "الوصف"} {requiredStar}</label>
                <textarea rows={6} {...register(langTab === "en" ? "descriptionEn" : "descriptionAr", { required: true })} className={`${inputClass} ${langTab === "ar" ? "text-right font-arabic" : ""}`} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ===== SECTION 6: PRICING ===== */}
        <div id="section-pricing" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Wallet />} title="Pricing & Valuation" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price {requiredStar}</label>
              <input type="number" {...register("price", { required: true })} className={`${inputClass} text-xl font-black text-amber-500`} placeholder="0.00" />
            </div>
            <div>
              <label className={labelClass}>Currency {requiredStar}</label>
              <select {...register("currency")} className={inputClass}>
                {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            {watchOffering === "Rent" && (
              <div>
                <label className={labelClass}>Number of Cheques</label>
                <select {...register("cheques")} className={inputClass}>
                  <option value="">Select</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((c) => (<option key={c} value={c}>{c} Cheques</option>))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* ===== SECTION 7: MEDIA ===== */}
        <div id="section-media" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Camera />} title="Media Portfolio" />
          <div className="space-y-6">
            <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-8 text-center cursor-pointer hover:bg-amber-500/5 transition-all" onClick={() => document.getElementById("file-up").click()}>
              <Upload className="mx-auto mb-2 text-amber-500" size={24} />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Drop 4K Visuals Here {requiredStar}</p>
              <input id="file-up" type="file" multiple hidden accept="image/*" onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} />
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              {files.map((f, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group border border-white/10">
                  <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <X className="text-white" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Video URL</label>
                <input {...register("videos")} className={inputClass} placeholder="Video URL" />
              </div>
              <div>
                <label className={labelClass}>Virtual Tour 360</label>
                <input {...register("virtualTour360")} className={inputClass} placeholder="Matterport URL" />
              </div>
              <div>
                <label className={labelClass}>Video Tour Link</label>
                <input {...register("videoTourLink")} className={inputClass} placeholder="YouTube/Vimeo URL" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 8: AMENITIES ===== */}
        <div id="section-amenities" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Sparkles />} title="Amenities & Facilities" />
          <div className="mb-5">
            <input type="text" placeholder="Search amenities..." value={searchAmenity} onChange={(e) => setSearchAmenity(e.target.value)} className={`w-full px-4 py-3 rounded-xl outline-none border text-sm font-medium transition-all ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-200 text-black"}`} />
          </div>
          <div className="max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredAmenities.map((amenity) => {
                const isSelected = watchAmenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 min-h-[90px] ${isSelected ? "bg-amber-500 border-amber-500 text-black shadow-md" : "bg-black/5 dark:bg-white/5 border-transparent text-slate-500 hover:border-amber-500/30"}`}>
                    {isSelected ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                    <span className="text-[10px] font-black uppercase text-center leading-tight">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">{React.cloneElement(icon, { size: 18 })}</div>
    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
  </div>
);

export default AddPropertyByAgent;