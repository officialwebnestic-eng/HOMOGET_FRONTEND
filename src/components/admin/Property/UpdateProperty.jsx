import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Upload, X, MapPin, Loader2, Sparkles, ShieldCheck, 
  Info, FileText, Landmark, Wallet, Bed, Bath, Ruler, 
  Link as LinkIcon, Image as ImageIcon, Briefcase, Globe, Home, Trash2
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";

import { 
  DUBAI_AREAS, PROPERTY_TYPES, AMENITIES, 
  DUBAI_CATEGORIES 
} from "../../../helpers/AddPropertyHelpers";

const UpdateProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { theme } = useTheme();
  const { agentList = [] } = useGetAllAgent();
  const isDark = theme === 'dark';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  
  // Media States
  const [existingImages, setExistingImages] = useState([]); // Images already on server
  const [newFiles, setNewFiles] = useState([]); // New uploads
  const [devLogo, setDevLogo] = useState(null);
  const [existingLogo, setExistingLogo] = useState("");
  
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const inputRef = useRef(null);
  const logoRef = useRef(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

  const watchListingType = watch("propertyListingType");
  const IMAGE_BASE_URL = "http://localhost:3000/properties/"; // Adjust to your backend URL

  // 1. Fetch Existing Property Data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await http.get(`/getproperty/${id}`);
        if (response.data.success) {
          const data = response.data.data; 
          
          // Populate Form
          reset(data);
          
          // Populate custom states
          setSelectedAgentId(data.agentId?._id || data.agentId || "");
          setSelectedAmenities(Array.isArray(data.aminities) ? data.aminities : []);
          setExistingImages(data.image || []);
          setExistingLogo(data.DeveloperLogo || "");
        }
      } catch (error) {
        addToast("Failed to load property data", "error");
      } finally {
        setLoadingData(false);
      }
    };
    fetchProperty();
  }, [id, reset]);

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
    if (existingImages.length === 0 && newFiles.length === 0) {
      addToast("Property must have at least one image", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append standard fields
      Object.keys(data).forEach(key => {
        if (!['image', 'DeveloperLogo', 'aminities', 'agentId'].includes(key)) {
          formData.append(key, data[key]);
        }
      });

      // Append state managed fields
      formData.append("agentId", selectedAgentId);
      formData.append("aminities", JSON.stringify(selectedAmenities));
      
      // Handle Images: Send existing names + new files
      formData.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach(file => formData.append("image", file));
      
      if (devLogo) {
        formData.append("DeveloperLogo", devLogo);
      }

      const response = await http.put(`/updateproperty/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (response.data.success) {
        addToast("Asset Synchronized Successfully", "success");
        navigate("/propertydetails"); // Or your inventory list
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Update Failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F1219]">
        <Loader2 className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  const inputClass = `w-full px-5 py-4 rounded-2xl border outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold text-sm ${
    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
  }`;
  
  const labelClass = "text-[10px] font-black uppercase text-amber-600 mb-2 block tracking-widest";

  return (
    <div className={`min-h-screen pb-20 px-4 md:px-10 ${isDark ? 'bg-[#0F1219] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        <header className="py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase">Update <span className="text-amber-500">Asset.</span></h1>
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] mt-2">ID: {id}</p>
          </div>
          
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
          
          {/* SECTION 1: MARKET COMPLIANCE */}
          <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<ShieldCheck />} title="Market Placement & Compliance" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClass}>Assign Agent</label>
                <select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)} className={inputClass}>
                  <option value="">Select Agent...</option>
                  {agentList?.map(agent => (
                    <option key={agent._id} value={agent._id}>{agent.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Asset Category</label>
                <select onChange={handleCategorySelection} className={inputClass} defaultValue={watch("listingtype")}>
                  <option value="">Update Category...</option>
                  {DUBAI_CATEGORIES.map(group => (
                    <optgroup key={group.label} label={group.label}>
                      {group.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Property Type</label>
                <select {...register("propertytype", { required: true })} className={inputClass}>
                  {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Trakheesi Permit No.</label>
                <input {...register("trakheesiNumber")} className={inputClass} />
              </div>
            </div>
          </div>

          {/* SECTION 2: CORE SPECS */}
          <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<Info />} title="Asset Metadata" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <label className={labelClass}>Property Name</label>
                <input {...register("propertyname")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Price (AED)</label>
                <input type="number" {...register("price")} className={inputClass} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {watchListingType === "project" ? (
                <motion.div key="project" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div><label className={labelClass}>Developer</label><input {...register("developerName")} className={inputClass}/></div>
                    <div><label className={labelClass}>Handover</label><input {...register("deliveryDate")} className={inputClass}/></div>
                    <div><label className={labelClass}>Project ID</label><input {...register("projectNumber")} className={inputClass}/></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Update Developer Logo</label>
                      <div onClick={() => logoRef.current.click()} className="flex items-center justify-between p-4 border-2 border-dashed border-slate-700/30 rounded-2xl cursor-pointer bg-black/5">
                        <div className="flex items-center gap-3">
                          {devLogo ? <Sparkles className="text-amber-500" /> : <ImageIcon className="text-slate-500"/>}
                          <span className="text-[10px] font-bold uppercase">{devLogo ? devLogo.name : "Choose New Logo"}</span>
                        </div>
                        {existingLogo && !devLogo && <img src={`${IMAGE_BASE_URL}${existingLogo}`} className="h-8 w-auto grayscale opacity-50" alt="current logo" />}
                        <input type="file" ref={logoRef} hidden onChange={(e) => setDevLogo(e.target.files[0])} />
                      </div>
                    </div>
                    <div><label className={labelClass}>Payment Plan</label><input {...register("PaymentPlan")} className={inputClass}/></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div><label className={labelClass}>Bedrooms</label><input {...register("bedroom")} className={inputClass}/></div>
                  <div><label className={labelClass}>Bathrooms</label><input {...register("bathroom")} className={inputClass}/></div>
                  <div><label className={labelClass}>Sq.Ft</label><input {...register("squarefoot")} className={inputClass}/></div>
                  <div><label className={labelClass}>Floor No.</label><input {...register("floor")} className={inputClass}/></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 3: MEDIA SYNC */}
          <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
            <SectionHeader icon={<Upload />} title="Asset Gallery Sync" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              <div className="space-y-4">
                <label className={labelClass}>Existing Visuals</label>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group border border-white/10">
                      <img src={`${IMAGE_BASE_URL}${img}`} className="w-full h-full object-cover" alt="existing" />
                      <button type="button" onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={20} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className={labelClass}>Inject New Media</label>
                <div onClick={() => inputRef.current.click()} className="h-40 border-2 border-dashed border-slate-700/30 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 transition-all bg-black/5">
                  <Upload className="mb-2 text-amber-500" />
                  <p className="text-[10px] font-black uppercase">Add New Files</p>
                  <input type="file" ref={inputRef} multiple hidden accept="image/*" onChange={(e) => setNewFiles([...newFiles, ...Array.from(e.target.files)])} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {newFiles.map((file, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg overflow-hidden relative ring-2 ring-amber-500">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="new" />
                      <button type="button" onClick={() => setNewFiles(newFiles.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 flex items-center justify-center"><X size={10}/></button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 4: LOCATION & NARRATIVE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
              <SectionHeader icon={<MapPin />} title="Geo Details" />
              <div className="space-y-4">
                <div><label className={labelClass}>Area</label><select {...register("state")} className={inputClass}>{DUBAI_AREAS.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                <div><label className={labelClass}>Maps URL</label><input {...register("locationMap")} className={inputClass} /></div>
                <div><label className={labelClass}>Address</label><input {...register("address")} className={inputClass} /></div>
              </div>
            </div>

            <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
              <SectionHeader icon={<FileText />} title="Amenities" />
              <div className="flex flex-wrap gap-2 mb-6">
                {AMENITIES.map(am => (
                  <button key={am} type="button" onClick={() => setSelectedAmenities(prev => prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am])}
                    className={`px-4 py-2 rounded-full text-[9px] font-black border transition-all ${selectedAmenities.includes(am) ? 'bg-amber-500 border-amber-500 text-black' : 'border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                    {am}
                  </button>
                ))}
              </div>
              <textarea {...register("description")} rows={5} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end pt-10 gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-10 py-6 rounded-2xl border border-slate-700 font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-20 py-6 rounded-2xl bg-amber-500 text-black font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={16} />}
              {isSubmitting ? "Syncing Updates..." : "Synchronize Updates"}
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

export default UpdateProperty;