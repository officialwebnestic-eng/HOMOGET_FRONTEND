import React, { useState, useEffect, useContext } from "react";
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
  Bed,
  Bath,
  Layers,
  Home,
  Camera,
  CheckCircle2,
  Hash,
  DollarSign,
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";
import { AMENITIES } from "../../../helpers/AddPropertyHelpers";
import LocationSearch from "./LocationSearch";

const AddPropertyByAgent = () => {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);
  const isDark = theme === "dark";

  // --- States ---
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [langTab, setLangTab] = useState("en");
  const [developers, setDevelopers] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  const [selectedLocationData, setSelectedLocationData] = useState(null);
  const [searchAmenity, setSearchAmenity] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

  const filteredAmenities = AMENITIES.filter((item) =>
    item.toLowerCase().includes(searchAmenity.toLowerCase())
  );

  const CURRENCIES = ["AED", "USD", "EUR", "GBP", "INR", "SAR", "QAR", "OMR", "KWD", "BHD"];

  // Generate Reference Number
  const generateReferenceNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `HMG-${year}-${random}`;
  };

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
      publishingStatus: "Published",
      trakheesiNumber: "",
      refrenceNo: generateReferenceNumber(),
      locationName: "",
      locationAddress: "",
      locationPlaceId: "",
      locationLat: "",
      locationLng: "",
      locationType: "",
      displayAddress: "",
      address: "",
      coordinates: {},
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

  // Handle location selection from LocationSearch component
  const handleLocationSelect = (location) => {
    if (location) {
      setSelectedLocationData(location);
      
      // Set ALL location fields
      setValue("locationId", location.id || location.location_id);
      setValue("locationPath", location.path || `${location.id}`);
      setValue("locationName", location.name);
      setValue("locationAddress", location.title);
      setValue("locationPlaceId", location.location_id);
      setValue("locationLat", location.coordinates?.lat);
      setValue("locationLng", location.coordinates?.lon);
      setValue("locationType", location.type);
      
      // Display fields
      const displayAddr = location.title || location.subtitle || `${location.name}, Dubai`;
      setValue("displayAddress", displayAddr);
      setValue("address", displayAddr);
      
      if (location.coordinates) {
        setValue("coordinates", location.coordinates);
      }
      
      console.log("Location selected:", {
        name: location.name,
        address: location.title,
        placeId: location.location_id,
        lat: location.coordinates?.lat,
        lng: location.coordinates?.lon,
        type: location.type
      });
      
      addToast(`Location selected: ${location.name || location.title}`, "success");
    } else {
      setSelectedLocationData(null);
      setValue("locationId", "");
      setValue("locationPath", "");
      setValue("locationName", "");
      setValue("locationAddress", "");
      setValue("locationPlaceId", "");
      setValue("locationLat", "");
      setValue("locationLng", "");
      setValue("locationType", "");
      setValue("displayAddress", "");
      setValue("address", "");
      setValue("coordinates", "");
    }
  };

  const toggleAmenity = (amenity) => {
    const current = watchAmenities;
    setValue(
      "amenities",
      current.includes(amenity) ? current.filter((a) => a !== amenity) : [...current, amenity]
    );
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
    if (files.length === 0) {
      addToast("Media Portfolio Required", "error");
      return;
    }
    
    // Check for location data using the new field
    if (!data.locationName && !data.displayAddress) {
      addToast("Please select a valid location from the search", "error");
      return;
    }
    
    if (!user?.id) {
      addToast("User not authenticated", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      const payload = {
        // Basic Info
        propertyTitleEn: data.propertyTitleEn,
        propertyTitleAr: data.propertyTitleAr || "",
        price: Number(data.price),
        currency: data.currency,
        category: data.category,
        propertytype: data.propertytype,
        offeringType: data.offeringType,
        rentedPeriod: data.rentedPeriod || "",
        cheques: data.cheques ? Number(data.cheques) : undefined,
        
        // Compliance
        developerId: data.developerId || null,
        agentId: user.id,
        permitType: data.permitType,
        trakheesiNumber: data.trakheesiNumber || "",
        reraORN: data.reraORN || "",
        brnNumber: data.brnNumber || "",
        ownerName: data.ownerName || "",
        
        // Specifications
        bedroom: Number(data.bedroom) || 0,
        bathroom: Number(data.bathroom) || 0,
        totalFloor: data.totalFloor ? Number(data.totalFloor) : undefined,
        squarefoot: Number(data.squarefoot),
        unitNo: data.unitNo || "",
        parkingSlots: Number(data.parkingSlots) || 0,
        furnishingType: data.furnishingType || "Unfurnished",
        propertyAge: data.propertyAge || "Brand New",
        availability: data.availability || "Immediately",
        
        // Description
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr || "",
        
        // LOCATION FIELDS (Google Places data)
        locationName: data.locationName || "",
        locationAddress: data.locationAddress || data.displayAddress || "",
        locationPlaceId: data.locationPlaceId || "",
        locationLat: data.locationLat ? Number(data.locationLat) : null,
        locationLng: data.locationLng ? Number(data.locationLng) : null,
        locationType: data.locationType || "",
        displayAddress: data.displayAddress || "",
        address: data.address || data.displayAddress || "",
        coordinates: data.coordinates || {},
        
        // Other fields
        amenities: data.amenities || [],
        nearByLocations: data.nearByLocations || [],
        videos: data.videos || "",
        virtualTour360: data.virtualTour360 || "",
        videoTourLink: data.videoTourLink || "",
        status: data.status || "Active",
        publishingStatus: data.publishingStatus || "Published",
        refrenceNo: data.refrenceNo,
        userType: "agent"
      };
      
      // Append all payload fields to FormData
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== "") {
          if (typeof payload[key] === "object" && !(payload[key] instanceof File)) {
            formData.append(key, JSON.stringify(payload[key]));
          } else {
            formData.append(key, payload[key]);
          }
        }
      });
      
      // Append images
      files.forEach((file) => formData.append("image", file));
      
      const res = await http.post("/addproperty", formData, { withCredentials: true });
      
      if (res.data.success) {
        addToast("Property Added Successfully", "success");
        reset();
        setFiles([]);
        setSelectedLocationData(null);
        setValue("refrenceNo", generateReferenceNumber());
      }
    } catch (e) {
      console.error("Submission error:", e);
      addToast(e.response?.data?.message || "Failed to add property", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all text-sm font-medium ${
    isDark ? "bg-[#1A1F2B] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
  }`;
  const labelClass = "text-[10px] font-bold uppercase text-slate-500 mb-1.5 block tracking-wider";
  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <div className={`min-h-screen pb-20 ${isDark ? "bg-gradient-to-br from-[#0F1219] via-[#0F1219] to-[#1a1f2e]" : "bg-gradient-to-br from-[#F8FAFC] via-[#F8FAFC] to-[#f1f5f9]"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-[100] border-b backdrop-blur-xl transition-all duration-300 ${isDark ? "bg-[#0F1219]/95 border-white/5 shadow-lg shadow-black/10" : "bg-white/95 border-slate-200 shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 lg:py-0 lg:h-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-0">
          
          {/* BRANDING & REFERENCE SUB-GRID */}
          <div className="flex items-center justify-between lg:justify-start gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Building2 className="text-white" size={20} />
              </div>
              <div>
                <h1 className={`text-base sm:text-lg font-black uppercase italic leading-none ${isDark ? "text-white" : "text-slate-900"}`}>
                  Homoget <span className="text-amber-500">Dubai</span>
                </h1>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 whitespace-nowrap">
                  Agent Portal • Add Property
                </p>
              </div>
            </div>
            
            {/* Reference Number Badge */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ml-2 shrink-0 ${
              isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"
            }`}>
              <Hash size={13} className="text-amber-500" />
              <div>
                <p className="text-[8px] uppercase font-bold text-slate-500 leading-none mb-0.5">Reference No</p>
                <p className="text-xs font-mono font-bold text-amber-500 max-w-[120px] truncate">{watch("refrenceNo") || "PENDING"}</p>
              </div>
            </div>

            {/* Mobile Publishing Status */}
            <div className="sm:hidden shrink-0">
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                watch("publishingStatus") === "Published" 
                  ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                  : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
              }`}>
                {watch("publishingStatus") === "Published" ? "Live" : "Draft"}
              </span>
            </div>
          </div>

          {/* ACTION CLUSTER */}
          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto pt-2 lg:pt-0 border-t border-slate-200/40 dark:border-white/5 lg:border-none">
            
            {/* Mobile Reference Indicator */}
            <div className="sm:hidden flex items-center gap-1.5">
              <Hash size={12} className="text-amber-500" />
              <span className="text-[10px] font-mono font-bold text-amber-500 truncate max-w-[140px]">
                {watch("refrenceNo") || "REF-PENDING"}
              </span>
            </div>

            {/* Desktop Publishing Status */}
            <div className={`hidden sm:block px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 ${
              watch("publishingStatus") === "Published" 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
            }`}>
              {watch("publishingStatus")}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-5 sm:px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md shadow-amber-500/10 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={13} /> : <Sparkles size={13} />}
              <span className="whitespace-nowrap">{isSubmitting ? "Syncing..." : "Launch Asset"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10 space-y-8">
        {/* Section Navigation */}
        <div className={`sticky top-20 z-50 w-full backdrop-blur-md transition-all duration-300 py-3 border-b ${
          isDark ? "bg-[#0f111a]/80 border-white/5 shadow-xl shadow-black/10" : "bg-slate-50/80 border-slate-200/60 shadow-sm shadow-slate-100/50"
        }`}>
          <div className="w-full flex flex-row items-center gap-[1vw] overflow-x-auto scrollbar-none snap-x snap-mandatory px-4 max-w-7xl mx-auto">
            {sections.map((section, idx) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    const el = document.getElementById(`section-${section.id}`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveSection(section.id);
                  }}
                  className={`flex items-center gap-[0.75vw] shrink-0 snap-align-start px-[4.5vw] md:px-5 py-3 md:py-2.5 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive
                      ? "bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20 scale-[1.02]"
                      : isDark
                        ? "bg-[#161b26] border-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-sm"
                  }`}
                >
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-tighter ${
                    isActive ? "bg-black text-amber-500" : isDark ? "bg-white/10 text-slate-400" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    AED
                  </span>
                  <span className="flex items-center gap-1.5">
                    {section.icon && React.cloneElement(section.icon, { size: 14, className: "shrink-0" })}
                    <span className="whitespace-nowrap">{section.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 1: BASIC INFO */}
        <div id="section-basic" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Home />} title="Basic Information" />
          
          {/* Reference Number Field */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Hash size={20} className="text-amber-500" />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Reference Number {requiredStar}</label>
                <input {...register("refrenceNo", { required: true })} className={`${inputClass} font-mono`} placeholder="Auto-generated reference number" />
                <p className="text-[8px] text-slate-400 mt-1">Unique property identifier (auto-generated, editable)</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setValue("refrenceNo", generateReferenceNumber())} className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all">
                  <span className="text-[10px] font-bold">⟳</span>
                </button>
                <select {...register("publishingStatus")} className={`${inputClass} w-32`}>
                  <option value="Published">✅ Published</option>
                  <option value="unpublished">📄 Unpublished</option>
                </select>
              </div>
            </div>
          </div>
          
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
                <option value="Residential">🏠 Residential</option>
                <option value="Commercial">🏢 Commercial</option>
                <option value="Off-Plan">📐 Off-Plan</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Type {requiredStar}</label>
              <select {...register("propertytype", { required: true })} className={inputClass}>
                <option value="">Select Type</option>
                {getPropertyTypes().map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>
              {errors.propertytype && <p className="text-red-500 text-[9px] mt-1">Required</p>}
            </div>
            <div>
              <label className={labelClass}>Offering Type {requiredStar}</label>
              <select {...register("offeringType", { required: true })} className={inputClass}>
                <option value="Sale">💰 For Sale</option>
                <option value="Rent">📋 For Rent</option>
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
                <option value="Active">✅ Active</option>
                <option value="Inactive">⭕ Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPLIANCE */}
        <div id="section-compliance" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<ShieldCheck />} title="License & Compliance" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className={labelClass}>Permit Authority {requiredStar}</label>
              <select {...register("permitType", { required: true })} className={inputClass}>
                <option value="RERA">🏛️ RERA (Dubai)</option>
                <option value="DTC">📜 DTC</option>
                <option value="DIFC">💼 DIFC</option>
                <option value="JAFZA">⚓ JAFZA</option>
                <option value="None">❌ None</option>
              </select>
            </div>
            {watchPermit === "RERA" && (
              <div>
                <label className={labelClass}>Trakheesi Number</label>
                <input {...register("trakheesiNumber")} className={inputClass} placeholder="Permit ID" />
              </div>
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
                  {developers.map((dev) => (<option key={dev._id} value={dev._id}>{dev.companyName}</option>))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: SPECIFICATIONS */}
        <div id="section-specs" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Layers />} title="Physical Specifications" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClass}><Bed size={12} className="inline mr-1" /> Bedrooms</label>
              <select {...register("bedroom")} className={inputClass}>
                {[...Array(21).keys()].map((i) => (<option key={i} value={i}>{i === 0 ? "Studio" : i}</option>))}
              </select>
            </div>
            <div>
              <label className={labelClass}><Bath size={12} className="inline mr-1" /> Bathrooms</label>
              <select {...register("bathroom")} className={inputClass}>
                {[...Array(11).keys()].map((i) => (<option key={i} value={i}>{i}</option>))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Total Floors</label>
              <input type="number" {...register("totalFloor")} className={inputClass} placeholder="Floors" />
            </div>
            <div>
              <label className={labelClass}>Area (sqft) {requiredStar}</label>
              <input type="number" {...register("squarefoot", { required: true })} className={inputClass} placeholder="Size in sqft" />
              {errors.squarefoot && <p className="text-red-500 text-[9px] mt-1">Required</p>}
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

        {/* SECTION 4: LOCATION */}
        <div id="section-location" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<MapPin />} title="Location" />
          
          {/* Hidden fields for location data */}
          <input type="hidden" {...register("locationId")} />
          <input type="hidden" {...register("locationPath")} />
          <input type="hidden" {...register("locationName")} />
          <input type="hidden" {...register("locationAddress")} />
          <input type="hidden" {...register("locationPlaceId")} />
          <input type="hidden" {...register("locationLat")} />
          <input type="hidden" {...register("locationLng")} />
          <input type="hidden" {...register("locationType")} />
          <input type="hidden" {...register("coordinates")} />
          
          <LocationSearch 
            onLocationSelect={handleLocationSelect}
            initialValue=""
            isDark={isDark}
            error={errors.locationName?.message}
            required={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Display Address {requiredStar}</label>
              <input {...register("displayAddress", { required: true })} className={inputClass} placeholder="Complete Address" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Full Address {requiredStar}</label>
              <input {...register("address", { required: true })} className={inputClass} placeholder="Complete Address" />
            </div>
          </div>

          {/* Nearby Locations */}
          <div className="space-y-4 mt-6">
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
                    <option value="Drive">🚗 Drive</option>
                    <option value="Walk">🚶 Walk</option>
                    <option value="Metro">🚇 Metro</option>
                  </select>
                </div>
                <button type="button" onClick={() => remove(index)} className="h-14 px-4 flex items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => append({ locationName: "", distance: "", transportType: "Drive" })} className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-500 hover:gap-3 transition-all">
              <Plus size={14} /> Add Nearby Location
            </button>
          </div>
        </div>

        {/* SECTION 5: DESCRIPTION */}
        <div className={`p-8 rounded-[2rem] border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <div className="flex justify-between items-center mb-6">
            <SectionHeader icon={<FileText />} title="Description" />
            <div className="flex bg-black/10 dark:bg-white/10 p-1 rounded-xl">
              {["en", "ar"].map((l) => (
                <button key={l} type="button" onClick={() => setLangTab(l)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${langTab === l ? "bg-amber-500 text-black" : "text-slate-500"}`}>
                  {l === "en" ? "English" : "العربية"}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={langTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <textarea rows={6} {...register(langTab === "en" ? "descriptionEn" : "descriptionAr", { required: true })} className={inputClass} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SECTION 6: PRICING */}
        <div id="section-pricing" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Wallet />} title="Pricing" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Price {requiredStar}</label>
              <input type="number" {...register("price", { required: true })} className={`${inputClass} text-xl font-black text-amber-500`} placeholder="0.00" />
              {errors.price && <p className="text-red-500 text-[9px] mt-1">Required</p>}
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

        {/* SECTION 7: MEDIA */}
        <div id="section-media" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Camera />} title="Media" />
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-amber-500/5 transition-all" onClick={() => document.getElementById("file-up")?.click()}>
              <Upload className="mx-auto mb-2 text-amber-500" size={32} />
              <p className="text-[10px] font-black text-slate-500 uppercase">Drop Images Here {requiredStar}</p>
              <p className="text-[8px] text-slate-400 mt-1">Upload high-quality images of the property</p>
              <input id="file-up" type="file" multiple hidden accept="image/*" onChange={(e) => setFiles([...files, ...Array.from(e.target.files || [])])} />
            </div>
            {files.length > 0 && (
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
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Video URL</label>
                <input {...register("videos")} className={inputClass} placeholder="https://youtube.com/..." />
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

        {/* SECTION 8: AMENITIES */}
        <div id="section-amenities" className={`p-8 rounded-[2rem] border scroll-mt-24 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100 shadow-xl"}`}>
          <SectionHeader icon={<Sparkles />} title="Amenities" />
          <div className="mb-5">
            <input type="text" placeholder="Search amenities..." value={searchAmenity} onChange={(e) => setSearchAmenity(e.target.value)} className={inputClass} />
          </div>
          <div className="max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredAmenities.map((amenity) => {
                const isSelected = watchAmenities.includes(amenity);
                return (
                  <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2 min-h-[90px] group ${
                    isSelected 
                      ? "bg-amber-500 border-amber-500 text-black shadow-md" 
                      : isDark 
                        ? "bg-white/5 border-white/5 text-slate-500 hover:border-amber-500/30 hover:bg-white/10" 
                        : "bg-slate-50 border-slate-100 text-slate-500 hover:border-amber-500/30 hover:bg-slate-100"
                  }`}>
                    {isSelected ? <CheckCircle2 size={16} className="text-black" /> : <Plus size={16} className="group-hover:text-amber-500" />}
                    <span className="text-[10px] font-black uppercase text-center leading-tight">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
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

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2.5 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-xl text-amber-500">
      {React.cloneElement(icon, { size: 18 })}
    </div>
    <div>
      <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      <div className="w-12 h-0.5 bg-amber-500 mt-1"></div>
    </div>
  </div>
);

export default AddPropertyByAgent;