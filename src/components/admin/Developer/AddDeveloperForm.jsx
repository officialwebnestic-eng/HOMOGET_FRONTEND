import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building2, Save, X, Upload, Calendar, 
  MapPin, Hash, Award, Layers, FileText, Info,
  Mail, Phone, ShieldCheck, Briefcase, Globe, Sparkles,
  ChevronLeft, TrendingUp, Users, Home
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
  const brandColor = "#f59e0b";
  const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5000";

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("identity");

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
        addToast(id ? "Developer Updated Successfully" : "Developer Registered Successfully", "success");
        navigate("/viewdevelopers");
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Section Navigation
  const sections = [
    { id: "identity", label: "Identity", icon: <Building2 size={14} /> },
    { id: "compliance", label: "Compliance", icon: <ShieldCheck size={14} /> },
    { id: "contact", label: "Contact", icon: <Globe size={14} /> },
    { id: "narrative", label: "Narrative", icon: <FileText size={14} /> },
  ];

  // Shared Styles
  const cardClass = `p-6 md:p-8 rounded-2xl border transition-all duration-300 ${isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200 shadow-sm"}`;
  const inputClass = `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all duration-300 ${isDark ? "bg-[#0a0a0c] border-white/10 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500" : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white"}`;
  const labelClass = "text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center gap-2";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className={`p-2 rounded-xl transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`}
            >
              <ChevronLeft size={20} className={isDark ? "text-slate-400" : "text-slate-600"} />
            </button>
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                {id ? "Edit" : "Add"} <span className="text-amber-500">Developer</span>
              </h1>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {id ? "Update developer information" : "Register new development partner"}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-100"}`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500">RERA Certified</p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto scrollbar-thin">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                const el = document.getElementById(`section-${section.id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                setActiveSection(section.id);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? "bg-amber-500 text-black shadow-md"
                  : isDark
                    ? "bg-white/5 text-slate-400 hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {section.icon} {section.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: IDENTITY */}
          <div id="section-identity" className={`scroll-mt-24 ${cardClass}`}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Building2 size={18} className="text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Brand Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div className="md:col-span-1">
                <label className={labelClass}>Company Logo</label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                    isDark ? "border-white/10 bg-[#0a0a0c] hover:border-amber-500/50" : "border-slate-200 bg-slate-50 hover:border-amber-500"
                  }`}
                >
                  {logoPreview ? (
                    <>
                      <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Upload size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                        <Upload size={20} className="text-amber-500" />
                      </div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">Click to upload logo</p>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                  <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" className={inputClass} placeholder="e.g., Emaar Properties" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Developer Type</label>
                    <select name="developerType" value={formData.developerType} onChange={handleChange} className={inputClass}>
                      <option value="Private">Private Developer</option>
                      <option value="Government">Government Entity</option>
                      <option value="Semi-Government">Semi-Government</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Established Year</label>
                    <input name="establishedYear" value={formData.establishedYear} onChange={handleChange} type="number" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: COMPLIANCE */}
          <div id="section-compliance" className={`scroll-mt-24 ${cardClass}`}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <ShieldCheck size={18} className="text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Compliance & Licensing</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Trade License Number</label>
                <input name="tradeLicenseNumber" value={formData.tradeLicenseNumber} onChange={handleChange} type="text" className={inputClass} placeholder="e.g., 1523268" />
              </div>
              <div>
                <label className={labelClass}>RERA Registration Number</label>
                <input name="reraRegistrationNumber" value={formData.reraRegistrationNumber} onChange={handleChange} type="text" className={inputClass} placeholder="e.g., ORN: 52933" />
              </div>
              <div>
                <label className={labelClass}>Total Projects</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="totalProjects" value={formData.totalProjects} onChange={handleChange} type="number" className={`${inputClass} pl-10`} placeholder="0" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Specialization</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} type="text" className={inputClass} placeholder="Luxury, Waterfront, Commercial..." />
              </div>
            </div>
          </div>

          {/* SECTION 3: CONTACT */}
          <div id="section-contact" className={`scroll-mt-24 ${cardClass}`}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Globe size={18} className="text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Contact & Location</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Official Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="officialEmail" value={formData.officialEmail} onChange={handleChange} type="email" className={`${inputClass} pl-10`} placeholder="contact@developer.com" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Contact Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="tel" className={`${inputClass} pl-10`} placeholder="+971 XX XXX XXXX" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Office Address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-4 text-slate-400" />
                  <textarea name="officeAddress" value={formData.officeAddress} onChange={handleChange} rows={2} className={`${inputClass} pl-10 resize-none`} placeholder="Full corporate address" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: NARRATIVE */}
          <div id="section-narrative" className={`scroll-mt-24 ${cardClass}`}>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <FileText size={18} className="text-amber-500" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider">Company Narrative</h3>
            </div>
            
            <div>
              <label className={labelClass}>Company Bio / History</label>
              <textarea 
                name="details" 
                value={formData.details} 
                onChange={handleChange} 
                rows={6} 
                className={`${inputClass} resize-none`}
                placeholder="Describe the developer's journey, achievements, and market presence..."
              />
              <p className="text-[9px] text-slate-500 mt-2 italic">Maximum 1000 characters</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${isDark ? "bg-white/5 text-slate-300 hover:bg-white/10" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isLoading ? "Saving..." : (id ? "Update Developer" : "Register Developer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeveloperForm;