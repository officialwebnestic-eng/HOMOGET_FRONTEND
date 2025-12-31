import React, { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { http } from "../../../axios/axios";
import { AuthContext } from "../../../context/AuthContext";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Eye, Upload, X, Home, Bed, Ruler, Building2, MapPin, 
  Map, HandCoins, Mail, Phone, Loader2, Plus, User, IndianRupee, 
  Sparkles, ShieldCheck, Info 
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";
import { motion, AnimatePresence } from "framer-motion";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 3;

const AddProperty = () => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { agentList } = useGetAllAgent();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const propertyType = watch("propertytype");

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      const isSizeValid = file.size / (1024 * 1024) <= MAX_FILE_SIZE_MB;
      const isTypeValid = file.type.startsWith("image/");
      return isSizeValid && isTypeValid;
    });

    if (validFiles.length + files.length > MAX_FILES) {
      addToast(`Only ${MAX_FILES} images allowed`, "error");
      return;
    }
    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleAddProperty = async (data) => {
    if (files.length === 0) {
      addToast("Please upload at least one image", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      files.forEach(file => formData.append(`image`, file));
      if (selectedAgent?._id) formData.append("agentId", selectedAgent._id);
      formData.append("aminities", JSON.stringify(selectedAmenities));

      const response = await http.post("/addproperty", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (response.data.success) {
        addToast("Property listed successfully!", "success");
        reset();
        setFiles([]);
        setSelectedAgent(null);
        setSelectedAmenities([]);
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to add property", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for consistent field rendering
  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 rounded-2xl ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Banner */}
        <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 mb-8 ${isDark ? 'bg-indigo-900 shadow-2xl shadow-indigo-500/20' : 'bg-indigo-600 shadow-xl shadow-indigo-500/30'}`}>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Create New Listing</h1>
            <p className="text-indigo-100 font-medium">Capture property details and reach potential buyers instantly.</p>
          </div>
          <Building2 className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12" />
        </div>

        <form onSubmit={handleSubmit(handleAddProperty)} className="space-y-8">
          
          {/* 1. Media Upload */}
          <div className={`p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <SectionHeader icon={Sparkles} title="Media & Gallery" subtitle="Upload high-quality images of the property (Max 5)" />
            
            <div 
              onClick={() => inputRef.current.click()}
              className={`group relative border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer ${
                files.length > 0 ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500'
              }`}
            >
              <Upload className={`mx-auto h-12 w-12 mb-4 transition-transform group-hover:-translate-y-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`text-lg font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Drop images here or click to browse</p>
              <input type="file" ref={inputRef} multiple hidden accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              <AnimatePresence>
                {files.map((file, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    key={idx} className="relative aspect-square rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800"
                  >
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button 
                      type="button" onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* 2. Key Information Grid */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <SectionHeader icon={Info} title="Property Essentials" subtitle="Standard details required for the listing" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Listing Title</label>
                <input {...register("propertyname", { required: true })} className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="e.g. Modern Villa with Pool" />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Price (₹)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" {...register("price", { required: true })} className={`w-full pl-12 pr-5 py-3.5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Property Type</label>
                <select {...register("propertytype")} className={`w-full px-5 py-3.5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}>
                  <option value="Apartment">Apartment</option>
                  <option value="House">Individual House</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Commercial">Commercial Space</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mt-8">
              {[
                { label: 'Beds', name: 'bedroom', icon: Bed },
                { label: 'Baths', name: 'bathroom', icon: BathIcon }, // Fixed name
                { label: 'Area (Sqft)', name: 'squarefoot', icon: Ruler },
                { label: 'Year', name: 'yearBuilt', icon: Building2 },
                { label: 'Floor', name: 'floor', icon: Building2 },
                { label: 'Total Floors', name: 'totalFloors', icon: Building2 },
              ].map((item, i) => (
                <div key={i}>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">{item.label}</label>
                  <input type="number" {...register(item.name)} className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Assign Agent */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <SectionHeader icon={ShieldCheck} title="Ownership & Management" subtitle="Assign a specialized agent to this listing" />
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3">
                <select 
                  onChange={(e) => setSelectedAgent(agentList.find(a => a._id === e.target.value))}
                  className={`w-full px-5 py-4 rounded-2xl border font-bold ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                >
                  <option value="">Select Primary Agent</option>
                  {agentList?.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                </select>
              </div>
              
              <AnimatePresence>
                {selectedAgent && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`flex-1 p-5 rounded-3xl border flex items-center gap-5 ${isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                    <img src={selectedAgent.profilePhoto || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-800 shadow-xl" alt="agent" />
                    <div>
                      <h4 className="font-black text-lg">{selectedAgent.name}</h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs font-bold text-indigo-500 flex items-center gap-1"><Mail size={12} /> {selectedAgent.email}</span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Phone size={12} /> {selectedAgent.phone}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10">
            <p className="text-slate-500 text-sm font-medium italic">By clicking "Publish Listing", you agree to our Property Verification terms.</p>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                type="button" onClick={() => reset()}
                className={`flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 shadow-sm'}`}
              >
                Clear Form
              </button>
              <button 
                type="submit" disabled={isSubmitting}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/40 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} /> Publish Listing</>}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

// Simple Bath icon helper if not imported
const BathIcon = ({ size, className }) => <Bed size={size} className={className} />;

export default AddProperty;