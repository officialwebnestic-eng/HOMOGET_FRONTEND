import React, { useState, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Upload, X, MapPin, Loader2, Sparkles, ShieldCheck, 
  FileText, Wallet, Building2, Plus, Trash2, Search,
  Home
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";


import { DUBAI_AREAS,AMENITIES } from "../../../helpers/AddPropertyHelpers";

const PROPERTY_ENUM = [
  "PLOTS", "FLATS", "HOUSE", "FARM LAND", "PROJECTS", 
  "PENTHOUSE", "TOWNHOUSE", "VILLA", "OFFICE", "RETAIL"
];

const PRICE_UNITS = [
  "Total Price", "Per Sq.ft", "Per Year", "Per Month"
];

const AddProperty = () => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Developer State ---
  const [developers, setDevelopers] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(false);
  const BaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

  // Location API States
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { agentList = [] } = useGetAllAgent();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      propertyListingType: "property",
      propertytype: "",
      currency: "AED",
      priceUnit: "Total Price",
      developerId: "", // Schema: ObjectId ref
      isOffPlan: false,
      nearByLocations: [{ locationName: "", distance: "", duration: "", transportType: "Drive" }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "nearByLocations" });

  const watchListingType = watch("propertyListingType");
  const watchPropertyType = watch("propertytype");
  const isPlot = ["PLOTS", "FARM LAND"].includes(watchPropertyType);
  const isResidential = ["FLATS", "HOUSE", "PENTHOUSE", "TOWNHOUSE", "VILLA"].includes(watchPropertyType);
  const isOffPlan = watchListingType === "project";

  // Fetch Developers for Dropdown
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoadingDevs(true);
        const response = await http.get("/developers");
        if (response.data.success) {
          setDevelopers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setLoadingDevs(false);
      }
    };
    fetchDevelopers();
  }, []);

  useEffect(() => {
    setValue("isOffPlan", watchListingType === "project");
  }, [watchListingType, setValue]);

  // Geoapify Logic
  useEffect(() => {
    const fetchLocations = async () => {
      if (locationQuery.length < 3) return;
      try {
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(locationQuery)}&filter=countrycode:ae&limit=5&apiKey=199288dedc924de189f73fcb8b3b3c61`);
        const data = await res.json();
        if (data.features) setSuggestions(data.features);
      } catch (err) { console.error(err); }
    };
    const debounce = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounce);
  }, [locationQuery]);

  const handleSelectLocation = (feature) => {
    const fullAddress = feature.properties.formatted;
    setValue("address", fullAddress);
    setLocationQuery(fullAddress);
    setShowSuggestions(false);
  };




  const watchAmenities = watch("amenities") || [];

const toggleAmenity = (amenity) => {
  const current = watchAmenities;
  const exists = current.includes(amenity);
  
  if (exists) {
    setValue("amenities", current.filter(a => a !== amenity));
  } else {
    setValue("amenities", [...current, amenity]);
  }
};

  const onSubmit = async (data) => {
    if (files.length === 0) return addToast("Media required", "error");
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append standard fields
      Object.keys(data).forEach(key => {
        if (key === 'nearByLocations') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });

      // Append Files
      files.forEach(file => formData.append("image", file));
      formData.append("userType", "admin");

      const res = await http.post("/addproperty", formData);
      if (res.data.success) {
        addToast("Asset Live", "success");
        reset();
        setFiles([]);
        setLocationQuery("");
      }
    } catch (e) { 
      addToast(e.response?.data?.message || "Sync Failed", "error"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium ${isDark ? 'bg-[#1A1F2B] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`;
  const labelClass = "text-[9px] font-bold uppercase text-slate-500 mb-1 block tracking-wider";

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-[#0F1219]' : 'bg-[#F8FAFC]'}`}>
      
      <header className={`sticky top-0 z-[60] border-b backdrop-blur-xl ${isDark ? 'bg-[#0F1219]/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20"><Building2 className="text-black" size={20} /></div>
            <div>
              <h1 className="text-lg font-black uppercase italic leading-none">Forge <span className="text-amber-500">Dubai</span></h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Property Sync Portal</p>
            </div>
          </div>
          <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-white/5">
            {["property", "project"].map((t) => (
              <button key={t} type="button" onClick={() => setValue("propertyListingType", t)}
                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${watchListingType === t ? "bg-amber-500 text-black shadow-md" : "text-slate-500"}`}>
                {t === "property" ? "Secondary" : "Off-Plan"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* 1. REGULATORY & IDENTITY */}
          <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<ShieldCheck />} title="Compliance & Brokerage" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Agent Field */}
              <div>
                <label className={labelClass}>Assign Agent</label>
                <select {...register("agentId", { required: "Required" })} className={inputClass}>
                  <option value="">Select Broker...</option>
                  {agentList?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>




              {/* DEVELOPER DROPDOWN */}
              <div>
                <label className={labelClass}>Developer Partner</label>
                <div className="relative">
                  <select 
                    {...register("developerId", { required: "Required" })} 
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">{loadingDevs ? "Fetching Registry..." : "Choose Developer..."}</option>
                    {developers.map(dev => (
                      <option key={dev._id} value={dev._id}>
                        {dev.companyName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <Building2 size={14}/>
                  </div>
                </div>
                {/* Visual UI Tip for Admin */}
                <p className="text-[8px] text-amber-500 font-bold uppercase mt-1">Authenticated Developer List</p>
              </div>
              <div>
    <label className={labelClass}>Listing Purpose</label>
    <div className="relative">
      <select 
        {...register("listingtype", { required: "Listing type is required" })} 
        className={`${inputClass} appearance-none cursor-pointer`}
      >
        <option value="">Select Purpose...</option>
        <option value="For Sale">For Sale</option>
        <option value="For Rent">For Rent</option>
        <option value="Short Term">Short Term / Holiday Home</option>
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <Home size={14} />
      </div>
    </div>
    {errors.listingtype && (
      <span className="text-[8px] text-red-500 font-bold uppercase mt-1">
        {errors.listingtype.message}
      </span>
    )}
  </div>

              <div>
      <label className={labelClass}>Trakheesi Number</label>
      <div className="relative">
        <input 
          {...register("trakheesiNumber", { required: true })} 
          className={inputClass} 
          placeholder="71XXXXXXX" 
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30">
          <ShieldCheck size={14} />
        </div>
      </div>
    </div>

              <div>
                <label className={labelClass}>Asset Type</label>
                <select {...register("propertytype", { required: true })} className={inputClass}>
                  <option value="">Type...</option>
                  {PROPERTY_ENUM.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 2. PRICING & SPECS */}
          <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<Wallet />} title="Financials & Specs" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-2"><label className={labelClass}>Asset Name</label><input {...register("propertyname", { required: true })} className={inputClass} /></div>
              
              {/* Price Field */}
              <div>
                <label className={labelClass}>Value (AED)</label>
                <input type="number" {...register("price", { required: true })} className={inputClass} placeholder="0.00" />
              </div>

              {/* PRICE UNIT DROPDOWN */}
              <div>
                <label className={labelClass}>Pricing Structure</label>
                <select {...register("priceUnit")} className={inputClass}>
                  {PRICE_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <AnimatePresence mode="wait">
                {isPlot && (
                  <motion.div key="plot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div><label className={labelClass}>Plot Size (Sq.Ft)</label><input {...register("squarefoot")} className={inputClass} /></div>
                    <div><label className={labelClass}>Usage</label><select {...register("propertyAssetType")} className={inputClass}><option>Residential</option><option>Commercial</option><option>Industrial</option></select></div>
                    <div><label className={labelClass}>Ownership</label><select {...register("ownerShipType")} className={inputClass}><option>Freehold</option><option>Leasehold</option></select></div>
                    <div><label className={labelClass}>DLD Fee (%)</label><input type="number" {...register("dldFee")} className={inputClass} /></div>
                  </motion.div>
                )}
                {isResidential && (
                  <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div><label className={labelClass}>Bedrooms</label><select {...register("bedroom")} className={inputClass}><option>Studio</option><option>1</option><option>2</option><option>3</option><option>4+</option></select></div>
                    <div><label className={labelClass}>Bathrooms</label><input {...register("bathroom")} className={inputClass} /></div>
                    <div><label className={labelClass}>Area (Sq.Ft)</label><input {...register("squarefoot")} className={inputClass} /></div>
                    <div><label className={labelClass}>Furnishing</label><select {...register("isFurnished")} className={inputClass}><option>Unfurnished</option><option>Furnished</option><option>Partly Furnished</option></select></div>
                  </motion.div>
                )}
                {isOffPlan && (
                  <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div className="md:col-span-2"><label className={labelClass}>Project Status</label><input {...register("projectStatus")} placeholder="Under Construction" className={inputClass} /></div>
                    <div><label className={labelClass}>Handover Date</label><input {...register("deliveryDate")} placeholder="Q4 2027" className={inputClass} /></div>
                    <div><label className={labelClass}>Escrow Account</label><input {...register("escrowAccountNumber")} className={inputClass} /></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>



          {/* 4. AMENITIES SELECTION */}
<div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
  <SectionHeader icon={<Sparkles />} title="LifeStyle & Facilities" />
  
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
    {AMENITIES.map((amenity) => {
      const isSelected = watchAmenities.includes(amenity);
      return (
        <button
          key={amenity}
          type="button"
          onClick={() => toggleAmenity(amenity)}
          className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 gap-2 group ${
            isSelected 
              ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20" 
              : isDark 
                ? "bg-[#1A1F2B] border-white/5 text-slate-400 hover:border-amber-500/50" 
                : "bg-slate-50 border-slate-200 text-slate-600 hover:border-amber-500"
          }`}
        >
          {/* You can map specific icons to specific amenities here if desired */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isSelected ? "bg-black/10" : "bg-black/5"}`}>
             <Plus size={14} className={`transition-transform ${isSelected ? "rotate-45" : "rotate-0"}`} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">
            {amenity}
          </span>
        </button>
      );
    })}
  </div>
  
  {/* HIDDEN INPUT FOR REACT-HOOK-FORM VALIDATION */}
  <input type="hidden" {...register("amenities")} />
</div>

          {/* 3. LOCATION & NEARBY */}
          <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<MapPin />} title="Geography & Proximity" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="md:col-span-2 relative">
                <label className={labelClass}>Street Address Search (Geoapify)</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input value={locationQuery} onChange={(e) => { setLocationQuery(e.target.value); setShowSuggestions(true); }} className={`${inputClass} pl-12`} placeholder="Search building or street..." />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className={`absolute z-50 w-full mt-2 rounded-xl border shadow-2xl ${isDark ? 'bg-[#1A1F2B] border-white/10' : 'bg-white border-slate-200'}`}>
                    {suggestions.map((s, i) => (
                      <div key={i} onClick={() => handleSelectLocation(s)} className="px-4 py-3 text-xs cursor-pointer hover:bg-amber-500/10 border-b last:border-0 border-white/5">
                        {s.properties.formatted}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div><label className={labelClass}>Community</label>
                <select {...register("community", { required: true })} className={inputClass}>
                  <option value="">Area...</option>
                  {DUBAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            {/* NEARBY LOCATIONS ARRAY */}
            <div className="space-y-4">
              <label className={labelClass}>Nearby Landmarks</label>
              {fields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-2xl items-end">
                  <div className="md:col-span-2"><input {...register(`nearByLocations.${index}.locationName`)} placeholder="Place (e.g. Dubai Mall)" className={inputClass} /></div>
                  <div><input {...register(`nearByLocations.${index}.distance`)} placeholder="Dist (e.g. 2km)" className={inputClass} /></div>
                  <div><select {...register(`nearByLocations.${index}.transportType`)} className={inputClass}><option>Drive</option><option>Walk</option><option>Metro</option></select></div>
                  <button type="button" onClick={() => remove(index)} className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18}/></button>
                </div>
              ))}
              <button type="button" onClick={() => append({ locationName: "", distance: "", duration: "", transportType: "Drive" })}
                className="flex items-center gap-2 text-[10px] font-bold uppercase text-amber-500 hover:text-amber-400 transition-all"><Plus size={14}/> Add Proximity Hub</button>
            </div>
          </div>

          {/* 4. MEDIA & NARRATIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
              <SectionHeader icon={<Upload />} title="Asset Portfolio" />
              <div className="border border-dashed border-slate-700/50 rounded-2xl p-10 text-center cursor-pointer hover:bg-amber-500/5 transition-all" onClick={() => document.getElementById('file-up').click()}>
                <Upload className="mx-auto mb-2 text-amber-500" size={24} />
                <p className="text-[10px] font-bold text-slate-500 uppercase">Drop High-Res Media</p>
                <input id="file-up" type="file" multiple hidden accept="image/*" onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {files.map((f, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden group">
                    <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><X size={14}/></button>
                  </div>
                ))}
              </div>
            </div>
            <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
              <SectionHeader icon={<FileText />} title="Asset Narrative" />
              <textarea {...register("description")} rows={6} className={inputClass} placeholder="Describe the lifestyle and ROI potential..."></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-10">
            <button type="submit" disabled={isSubmitting} className="px-16 py-6 rounded-2xl bg-amber-500 text-black font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
              {isSubmitting ? "Synchronizing..." : "Launch Asset"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">{React.cloneElement(icon, { size: 18 })}</div>
    <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</h2>
  </div>
);

export default AddProperty;