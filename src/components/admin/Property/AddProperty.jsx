import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Eye, Upload, X, Home, Bed, Ruler, Building2, MapPin, 
  Map, HandCoins, Mail, Phone, Loader2, Plus, User, IndianRupee, 
  Sparkles, ShieldCheck, Info, FileText, CheckCircle2, Bath
} from "lucide-react";
import { useToast } from "../../../model/SuccessToasNotification";
import { motion, AnimatePresence } from "framer-motion";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 3;

// Amenities List matching typical backend expectations
const AMENITY_OPTIONS = ["Pool", "Gym", "Parking", "Security", "Garden", "Elevator", "Wifi", "Power Backup"];

const AddProperty = () => {
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const { agentList } = useGetAllAgent();
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      propertytype: "Apartment",
      listingtype: "Sale",
      status: "Available",
      state: "Dubai",
      city: "Dubai",
    }
  });

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

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const onSubmit = async (data) => {
    if (files.length === 0) {
      addToast("Please upload at least one image", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append all text fields from React Hook Form
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      // Append images
      files.forEach(file => {
        formData.append("image", file);
      });

      // Append state managed fields
      formData.append("agentId", selectedAgentId);
      formData.append("aminities", JSON.stringify(selectedAmenities));
      formData.append("terms", "true"); // Assuming user agrees by submitting

      const response = await http.post("/addproperty", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });

      if (response.data.success) {
        addToast("Property listed successfully!", "success");
        reset();
        setFiles([]);
        setSelectedAgentId("");
        setSelectedAmenities([]);
      }
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to add property", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        {/* Banner */}
        <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 mb-8 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-indigo-600 shadow-xl'}`}>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Publish Property</h1>
            <p className="text-indigo-100 font-medium">List your property on the market with all required legal and physical details.</p>
          </div>
          <Building2 className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Media Upload */}
          <div className={`p-8 rounded-[2rem] border transition-all ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <SectionHeader icon={Sparkles} title="Media Gallery" subtitle="Upload high-quality images (Max 5)" />
            <div 
              onClick={() => inputRef.current.click()}
              className={`group border-2 border-dashed rounded-[2rem] p-10 text-center transition-all cursor-pointer ${
                files.length > 0 ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500'
              }`}
            >
              <Upload className={`mx-auto h-10 w-10 mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <p className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Click to upload property images</p>
              <input type="file" ref={inputRef} multiple hidden accept="image/*" onChange={(e) => handleFiles(e.target.files)} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {files.map((file, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                  <button type="button" onClick={() => setFiles(files.filter((_, i) => i !== idx))} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg shadow-lg">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Essentials */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <SectionHeader icon={Info} title="Property Essentials" subtitle="Basic listing info" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Property Title</label>
                <input {...register("propertyname", { required: true })} className={`w-full px-5 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="Modern Burj Khalifa View Apt" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Price (AED/₹)</label>
                <input type="number" {...register("price", { required: true })} className={`w-full px-5 py-3 rounded-xl border outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Listing Type</label>
                <select {...register("listingtype")} className={`w-full px-5 py-3 rounded-xl border outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}>
                  <option value="Sale">For Sale</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
              {[
                { label: 'Type', name: 'propertytype', type: 'select', options: ['Apartment', 'Villa', 'House', 'Office'] },
                { label: 'Beds', name: 'bedroom', type: 'number' },
                { label: 'Baths', name: 'bathroom', type: 'number' },
                { label: 'Sqft', name: 'squarefoot', type: 'number' },
                { label: 'Floor No', name: 'floor', type: 'number' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{field.label}</label>
                  {field.type === 'select' ? (
                    <select {...register(field.name)} className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}>
                      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="number" {...register(field.name)} className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Location Details */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <SectionHeader icon={MapPin} title="Location Details" subtitle="Full address for map placement" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-3">
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Street Address</label>
                <input {...register("address", { required: true })} className={`w-full px-5 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} placeholder="Unit No, Building, Area" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">City</label>
                <input {...register("city", { required: true })} className={`w-full px-5 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">State</label>
                <input {...register("state", { required: true })} className={`w-full px-5 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Zip Code</label>
                <input {...register("zipcode", { required: true })} className={`w-full px-5 py-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
              </div>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <SectionHeader icon={FileText} title="Features & Description" subtitle="Describe the unique selling points" />
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Detailed Description</label>
                <textarea {...register("description", { required: true })} rows={4} className={`w-full px-5 py-3 rounded-xl border outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-4 block">Select Amenities</label>
                <div className="flex flex-wrap gap-3">
                  {AMENITY_OPTIONS.map(amenity => (
                    <button
                      key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        selectedAmenities.includes(amenity) 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Management */}
          <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <SectionHeader icon={ShieldCheck} title="Listing Management" subtitle="Internal assignments" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Assign Agent</label>
                <select 
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className={`w-full px-5 py-3 rounded-xl border font-bold ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                >
                  <option value="">No Agent (Admin Managed)</option>
                  {agentList?.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Listing Status</label>
                <select {...register("status")} className={`w-full px-5 py-3 rounded-xl border font-bold ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`}>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Under Contract">Under Contract</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submission */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10">
            <div className="flex items-center gap-3 text-slate-500">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <p className="text-sm font-medium">I agree to property verification terms</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button type="button" onClick={() => reset()} className="px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all">Reset</button>
              <button 
                type="submit" disabled={isSubmitting}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-12 py-4 rounded-xl bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <><Plus size={18} /> Publish Property</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;