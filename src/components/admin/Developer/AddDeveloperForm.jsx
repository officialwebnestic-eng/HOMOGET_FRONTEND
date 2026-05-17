import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building2, Save, X, Upload, Calendar, 
  MapPin, Hash, Award, Layers, FileText, Info,
  Mail, Phone, ShieldCheck, Briefcase, Globe, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

const AddDeveloperForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const { addToast } = useToast();
  
  const isDark = theme === "dark";
  const brandGold = "#C5A059";
  const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5000";

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    tradeLicenseNumber: "",
    reraRegistrationNumber: "",
    establishedYear: new Date().getFullYear(),
    officialEmail: "",
    contactNumber: "",
    officeAddress: "",
    developerType: "Private",
    specialization: "", 
    totalProjects: 0,
    details: "",
  });

  useEffect(() => {
    if (id) {
      const fetchDeveloper = async () => {
        try {
          const response = await http.get(`/developers/${id}`);
          if (response.data.success) {
            const dev = response.data.data;
            setFormData({
              ...dev,
              specialization: Array.isArray(dev.specialization) ? dev.specialization.join(", ") : dev.specialization || ""
            });
            if (dev.companyLogo) setLogoPreview(`${BACKEND_URL}/agents/${dev.companyLogo}`);
          }
        } catch (err) {
          addToast("Failed to load developer data", "error");
        }
      };
      fetchDeveloper();
    }
  }, [id, addToast, BACKEND_URL]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = new FormData();
    const specializationArray = formData.specialization.split(",").map(i => i.trim()).filter(i => i !== "");

    Object.keys(formData).forEach((key) => {
      if (key === "specialization") data.append(key, JSON.stringify(specializationArray));
      else data.append(key, formData[key]);
    });
    if (logoFile) data.append("companyLogo", logoFile);

    try {
      const response = id ? await http.put(`/developers/${id}`, data) : await http.post(`/developers`, data);
      if (response.data.success) {
        addToast(id ? "Registry Updated" : "Developer Enrolled", "success");
        navigate("/viewdevelopers");
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Shared Styles
  const cardClass = `p-8 rounded-[2.5rem] border transition-all duration-500 ${isDark ? "bg-[#161B26]/50 border-white/5 backdrop-blur-xl" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50"}`;
  const inputClass = `w-full px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none border transition-all duration-300 ${isDark ? "bg-[#0F1219] border-white/5 text-white focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-[#C5A059] focus:bg-white"}`;
  const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block flex items-center gap-2";

  return (
    <div className={`min-h-screen p-6 md:p-12 ${isDark ? "bg-[#0A0C10] text-white" : "bg-[#F8FAFC] text-slate-900"}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        
        {/* TOP NAVIGATION BAR */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#C5A059] flex items-center justify-center shadow-lg shadow-[#C5A059]/20">
              <Building2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {id ? "Edit" : "New"} <span style={{ color: brandGold }}>Developer</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Institutional Asset Registry</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className={`p-4 rounded-2xl border transition-all ${isDark ? "border-white/5 hover:bg-white/5 text-slate-400" : "border-slate-200 hover:bg-slate-100 text-slate-600"}`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMN 1: IDENTITY & LOGO */}
            <div className="lg:col-span-1 space-y-8">
              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="text-[#C5A059]" size={18} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest">Brand Identity</h3>
                </div>
                
                <div className="flex flex-col items-center">
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className={`group relative w-full aspect-square rounded-[3rem] border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${isDark ? "border-white/10 bg-[#0F1219] hover:border-[#C5A059]/50" : "border-slate-200 bg-slate-50 hover:border-[#C5A059]"}`}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-[#C5A059]/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={24} className="text-[#C5A059]" />
                        </div>
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Click to upload brandmark</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest">Update Logo</span>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
              </div>

              <div className={cardClass}>
                 <label className={labelClass}><Layers size={14} className="text-[#C5A059]"/> Portfolio Size</label>
                 <input name="totalProjects" value={formData.totalProjects} onChange={handleChange} type="number" className={inputClass} placeholder="Total Projects" />
                 <p className="text-[9px] text-slate-500 font-bold mt-4 italic uppercase tracking-tighter">* Total units or individual projects</p>
              </div>
            </div>

            {/* COLUMN 2 & 3: FORM DETAILS */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* BENTO SECTION: CORE DETAILS */}
              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="text-[#C5A059]" size={18} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest">Corporate & Compliance</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className={labelClass}><Building2 size={14} className="text-[#C5A059]"/> Commercial Name</label>
                        <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" className={inputClass} required />
                    </div>
                    
                    <div>
                        <label className={labelClass}><Hash size={14} className="text-[#C5A059]"/> Trade License</label>
                        <input name="tradeLicenseNumber" value={formData.tradeLicenseNumber} onChange={handleChange} type="text" className={inputClass} required />
                    </div>
                    
                    <div>
                        <label className={labelClass}><Award size={14} className="text-[#C5A059]"/> RERA Registration</label>
                        <input name="reraRegistrationNumber" value={formData.reraRegistrationNumber} onChange={handleChange} type="text" className={inputClass} required />
                    </div>

                    <div>
                        <label className={labelClass}><Calendar size={14} className="text-[#C5A059]"/> Founded Year</label>
                        <input name="establishedYear" value={formData.establishedYear} onChange={handleChange} type="number" className={inputClass} required />
                    </div>

                    <div>
                        <label className={labelClass}><Briefcase size={14} className="text-[#C5A059]"/> Developer Type</label>
                        <select name="developerType" value={formData.developerType} onChange={handleChange} className={inputClass}>
                            <option value="Private">Private</option>
                            <option value="Government">Government</option>
                            <option value="Semi-Government">Semi-Government</option>
                        </select>
                    </div>
                </div>
              </div>

              {/* BENTO SECTION: CONTACT & LOCATION */}
              <div className={cardClass}>
                 <div className="flex items-center gap-3 mb-8">
                    <Globe className="text-[#C5A059]" size={18} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest">Contact & Headquarters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}><Mail size={14} className="text-[#C5A059]"/> Corporate Email</label>
                        <input name="officialEmail" value={formData.officialEmail} onChange={handleChange} type="email" className={inputClass} required />
                    </div>
                    <div>
                        <label className={labelClass}><Phone size={14} className="text-[#C5A059]"/> Contact Number</label>
                        <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="text" className={inputClass} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className={labelClass}><MapPin size={14} className="text-[#C5A059]"/> Official HQ Address</label>
                        <input name="officeAddress" value={formData.officeAddress} onChange={handleChange} type="text" className={inputClass} required />
                    </div>
                </div>
              </div>

              {/* BENTO SECTION: NARRATIVE */}
              <div className={cardClass}>
                <div className="flex items-center gap-3 mb-8">
                    <FileText className="text-[#C5A059]" size={18} />
                    <h3 className="text-[11px] font-black uppercase tracking-widest">Market Presence</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className={labelClass}><Info size={14} className="text-[#C5A059]"/> Specialization</label>
                        <input name="specialization" value={formData.specialization} onChange={handleChange} type="text" placeholder="Luxury, Waterfront, Commercial..." className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Company Bio / History</label>
                        <textarea 
                            name="details" 
                            value={formData.details} 
                            onChange={handleChange} 
                            rows="5" 
                            className={`${inputClass} h-40 resize-none normal-case py-5`}
                            placeholder="Describe the developer's journey and notable achievements..."
                        />
                    </div>
                </div>
              </div>

            </div>
          </div>

          {/* FLOATING ACTION BAR */}
          <motion.div 
            initial={{ y: 100 }} 
            animate={{ y: 0 }} 
            className={`sticky bottom-10 p-6 rounded-[2.5rem] border flex justify-between items-center backdrop-blur-2xl ${isDark ? "bg-[#161B26]/80 border-[#C5A059]/20" : "bg-white/80 border-slate-200 shadow-2xl"}`}
          >
            <div className="hidden md:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status: Ready for Sync</p>
                <p className="text-[9px] text-[#C5A059] font-bold">Authenticated Admin Session</p>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto px-16 py-5 rounded-2xl bg-[#C5A059] text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#C5A059]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Save size={18} /> {id ? "Update Registry" : "Enshrine Developer"}</>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDeveloperForm;