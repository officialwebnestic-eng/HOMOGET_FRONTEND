import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Upload, X, MapPin, Loader2, Sparkles, ShieldCheck, 
  Info, FileText, Landmark, Wallet, Bed, Bath, Ruler, 
  Link as LinkIcon, Image as ImageIcon, Briefcase, Globe, Home
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";

import { 
  DUBAI_AREAS, PROPERTY_TYPES, AMENITIES, 
  DUBAI_CATEGORIES 
} from "../../../helpers/AddPropertyHelpers";

const AddProperty = () => {
  const [files, setFiles] = useState([]);
  const [devLogo, setDevLogo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // State for Agent Selection
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const inputRef = useRef(null);
  const logoRef = useRef(null);
  const { agentList = [] } = useGetAllAgent();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      propertyListingType: "property",
      usageType: "Residential",
      segment: "Standard",
      listingtype: "Buy",
      currency: "AED",
      propertystatus: "Available",
    }
  });

  const watchListingType = watch("propertyListingType");

  const handleCategorySelection = (e) => {
    const val = e.target.value;
    let meta = null;
    DUBAI_CATEGORIES.forEach(group => {
      const found = group.options.find(opt => opt.value === val);
      if (found) meta = found.meta;
    });

    if (meta) {
      setValue("usageType", meta.usage);
      setValue("listingtype", meta.listing);
      setValue("segment", meta.segment);
      setValue("propertyListingType", meta.type || "property");
    }
  };

  const onSubmit = async (data) => {
    if (files.length === 0) {
      addToast("Please upload at least one image", "error");
      return;
    }
    if (!selectedAgentId) {
      addToast("Please assign an agent to this asset", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all text fields from React Hook Form
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined) formData.append(key, data[key]);
      });

      // Append images
      files.forEach(file => {
        formData.append("image", file);
      });
      
      if (devLogo) {
        formData.append("DeveloperLogo", devLogo);
      }

      // Append state managed fields
      formData.append("agentId", selectedAgentId);
      formData.append("aminities", JSON.stringify(selectedAmenities));
      formData.set("userType", "Admin"); 
      formData.append("terms", "true"); 

      const response = await http.post("/addproperty", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (response.data.success) {
        addToast("Asset Broadcasted Successfully", "success");
        reset();
        setFiles([]);
        setDevLogo(null);
        setSelectedAgentId("");
        setSelectedAmenities([]);
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Sync Failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full px-5 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold text-sm ${
    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
  } ${errors.propertytype || errors.propertyname || errors.price || errors.trakheesiNumber ? 'border-red-500/50' : ''}`;
  
  const labelClass = "text-[10px] font-black uppercase text-amber-600 mb-2 block tracking-widest";

  return (
    <div className={`min-h-screen pb-20 px-4 md:px-10 ${isDark ? 'bg-[#0F1219] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        <header className="py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-4xl font-black italic uppercase">Property <span className="text-amber-500">Forge.</span></h1>
          
          <div className="flex p-1.5 bg-black/10 dark:bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
            <button type="button" onClick={() => setValue("propertyListingType", "property")}
              className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${watchListingType === "property" ? "bg-amber-500 text-black shadow-lg" : "text-slate-500"}`}>
              <Home size={14} /> Ready
            </button>
            <button type="button" onClick={() => setValue("propertyListingType", "project")}
              className={`flex items-center gap-2 px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${watchListingType === "project" ? "bg-amber-500 text-black shadow-lg" : "text-slate-500"}`}>
              <Landmark size={14} /> Off-Plan
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* SECTION 1: MARKET COMPLIANCE & LEGAL */}
          <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<ShieldCheck />} title="Market Placement & Compliance" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              
              {/* AGENT ASSIGNMENT FIELD */}
              <div>
                <label className={labelClass}>Assign Agent</label>
                <select 
                  value={selectedAgentId} 
                  onChange={(e) => setSelectedAgentId(e.target.value)} 
                  className={inputClass}
                >
                  <option value="">Select Agent...</option>
                  {agentList?.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Asset Category</label>
                <select onChange={handleCategorySelection} className={inputClass}>
                  <option value="">Select Category...</option>
                  {DUBAI_CATEGORIES.map(group => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Property Type (Style)</label>
                <select {...register("propertytype", { required: true })} className={inputClass}>
                  <option value="">Select Type...</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.propertytype && <span className="text-red-500 text-[9px] mt-1 font-bold italic">Required</span>}
              </div>

              <div>
                <label className={labelClass}>Trakheesi Permit No.</label>
                <input {...register("trakheesiNumber", { required: true })} className={inputClass} placeholder="71-XXXX" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>RERA ORN (Office)</label>
                <input {...register("reraORN")} className={inputClass} placeholder="ORN Number" />
              </div>
              <div>
                <label className={labelClass}>BRN Number (Broker)</label>
                <input {...register("brnNumber")} className={inputClass} placeholder="BRN Number" />
              </div>
            </div>
          </div>

          {/* SECTION 2: CORE SPECIFICATIONS */}
          <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<Info />} title="Core Specifications" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Asset Title / Property Name</label>
                <input {...register("propertyname", { required: true })} className={inputClass} placeholder="e.g. Palm Flower Penthouse" />
              </div>
              <div>
                <label className={labelClass}>Price (AED)</label>
                <div className="relative">
                  <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500/40" size={16} />
                  <input type="number" {...register("price", { required: true })} className={`${inputClass} pl-12`} />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {watchListingType === "project" ? (
                <motion.div key="project-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Developer Name</label>
                      <input {...register("developerName")} className={inputClass} placeholder="e.g. Emaar" />
                    </div>
                    <div>
                      <label className={labelClass}>Project Number (RERA)</label>
                      <input {...register("projectNumber")} className={inputClass} placeholder="Project ID" />
                    </div>
                    <div>
                      <label className={labelClass}>Handover Date</label>
                      <input {...register("deliveryDate")} className={inputClass} placeholder="Q4 2027" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Developer Logo</label>
                      <div onClick={() => logoRef.current.click()} className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-700/30 rounded-2xl cursor-pointer hover:border-amber-500 transition-all bg-black/5">
                        <ImageIcon className="text-amber-500" size={20} />
                        <span className="text-[10px] font-bold uppercase">{devLogo ? devLogo.name : "Select Logo File"}</span>
                        <input type="file" ref={logoRef} hidden onChange={(e) => setDevLogo(e.target.files[0])} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Payment Plan</label>
                      <input {...register("PaymentPlan")} className={inputClass} placeholder="e.g. 60/40" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="property-fields" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div><label className={labelClass}>Bedrooms</label><input {...register("bedroom")} className={inputClass} placeholder="Studio/1/2" /></div>
                  <div><label className={labelClass}>Bathrooms</label><input {...register("bathroom")} className={inputClass} /></div>
                  <div><label className={labelClass}>Sq.Ft</label><input {...register("squarefoot")} className={inputClass} /></div>
                  <div><label className={labelClass}>Floor No.</label><input {...register("floor")} className={inputClass} /></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 3: LOCATION & MAPS */}
          <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<MapPin />} title="Location Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Community / State</label>
                <select {...register("state", { required: true })} className={inputClass}>
                  {DUBAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Google Maps URL</label>
                <div className="relative">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500/40" size={16} />
                  <input {...register("locationMap")} className={`${inputClass} pl-12`} placeholder="Paste map link..." />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Street Address / Landmark Proximity</label>
                <input {...register("address", { required: true })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* SECTION 4: MEDIA & FEATURES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
              <SectionHeader icon={<Upload />} title="Asset Portfolio" />
              <div onClick={() => inputRef.current.click()} className="border-2 border-dashed border-slate-700/30 rounded-3xl p-10 text-center cursor-pointer hover:border-amber-500 bg-black/5">
                <Upload className="mx-auto mb-2 text-amber-500" />
                <p className="text-[10px] font-black uppercase">Click to Select Images</p>
                <input type="file" ref={inputRef} multiple hidden accept="image/*" onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])} />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                {files.map((file, i) => (
                  <div key={i} className="w-16 h-16 rounded-xl overflow-hidden relative shadow-lg">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><X size={14}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
              <SectionHeader icon={<FileText />} title="Amenities & Narrative" />
              <div className="flex flex-wrap gap-2 mb-6">
                {AMENITIES.map(am => (
                  <button key={am} type="button" onClick={() => setSelectedAmenities(prev => prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am])}
                    className={`px-4 py-2 rounded-full text-[9px] font-black border transition-all ${selectedAmenities.includes(am) ? 'bg-amber-500 border-amber-500 text-black' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                    {am}
                  </button>
                ))}
              </div>
              <textarea {...register("description")} rows={4} className={inputClass} placeholder="Describe the lifestyle..."></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-10">
            <button type="submit" disabled={isSubmitting} className="px-20 py-6 rounded-2xl bg-amber-500 text-black font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
              {isSubmitting ? "Synchronizing..." : "Synchronize Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">{React.cloneElement(icon, { size: 18 })}</div>
    <h2 className="text-sm font-black uppercase tracking-tighter italic">{title}</h2>
  </div>
);

export default AddProperty;