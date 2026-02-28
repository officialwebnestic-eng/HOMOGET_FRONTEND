import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building2, Save, X, Upload, Calendar, 
  MapPin, Hash, Award, Layers, FileText, Info 
} from "lucide-react";
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

  // --- INITIAL STATE (Includes all previous + new fields) ---
  const [formData, setFormData] = useState({
    companyName: "",
    tradeLicenseNumber: "",
    reraRegistrationNumber: "",
    establishedYear: new Date().getFullYear(),
    officialEmail: "",
    contactNumber: "",
    officeAddress: "",
    developerType: "Private", // New Field
    specialization: "", 
    totalProjects: 0,        // New Field
    details: "",
  });

  // 1. FETCH DATA FOR UPDATE (Maps all fields from DB)
  useEffect(() => {
    if (id) {
      const fetchDeveloper = async () => {
        try {
          const response = await http.get(`/developers/${id}`);
          if (response.data.success) {
            const dev = response.data.data;
            
            setFormData({
              companyName: dev.companyName || "",
              tradeLicenseNumber: dev.tradeLicenseNumber || "",
              reraRegistrationNumber: dev.reraRegistrationNumber || "",
              establishedYear: dev.establishedYear || "",
              officialEmail: dev.officialEmail || "",
              contactNumber: dev.contactNumber || "",
              officeAddress: dev.officeAddress || "",
              developerType: dev.developerType || "Private", // Added
              specialization: Array.isArray(dev.specialization) 
                ? dev.specialization.join(", ") 
                : dev.specialization || "",
              totalProjects: dev.totalProjects || 0,        // Added
              details: dev.details || "",
            });

            if (dev.companyLogo) {
              setLogoPreview(`${BACKEND_URL}/agents/${dev.companyLogo}`);
            }
          }
        } catch (err) {
          addToast("Failed to load developer data", "error");
        }
      };
      fetchDeveloper();
    }
  }, [id, addToast, BACKEND_URL]);

  // 2. HANDLERS
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

  // 3. SUBMIT (MULTIPART/FORM-DATA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    
    // Process specialization string into array safely
    const specializationArray = formData.specialization
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    // Append all text fields
    Object.keys(formData).forEach((key) => {
      if (key === "specialization") {
        data.append(key, JSON.stringify(specializationArray));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (logoFile) {
      data.append("companyLogo", logoFile);
    }

    try {
      const response = id 
        ? await http.put(`/developers/${id}`, data)
        : await http.post(`/developers`, data);

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

  // Styles
  const inputStyle = `w-full px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none border transition-all ${
    isDark ? "bg-[#161B26] border-white/5 text-white focus:border-[#C5A059]" : "bg-white border-slate-200 focus:border-[#C5A059]"
  }`;

  const labelStyle = "text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 block";

  return (
    <div className={`p-6 md:p-10 min-h-screen ${isDark ? "bg-[#0F1219]" : "bg-slate-50"}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className={`text-3xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
              {id ? "Modify" : "Enroll"} <span style={{ color: brandGold }}>Developer.</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Dubai HQ Asset Management</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`rounded-[2.5rem] p-10 shadow-2xl border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100"}`}>
          
          {/* Logo Section */}
          <div className="mb-12 flex flex-col items-center">
            <label className={labelStyle}>Corporate Brandmark</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className={`relative w-44 h-44 rounded-[2.5rem] border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
                isDark ? "border-white/10 bg-white/5 hover:border-[#C5A059]/50" : "border-slate-200 bg-slate-50 hover:border-[#C5A059]"
              }`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-6" />
              ) : (
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-slate-500" />
                  <span className="text-[8px] font-black uppercase text-slate-400">Upload Logo</span>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelStyle}>Company Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="companyName" value={formData.companyName} onChange={handleChange} type="text" className={`${inputStyle} pl-14`} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Trade License</label>
              <div className="relative">
                <Hash size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="tradeLicenseNumber" value={formData.tradeLicenseNumber} onChange={handleChange} type="text" className={`${inputStyle} pl-14`} required />
              </div>
            </div>

            {/* --- ADDED: TOTAL PROJECTS --- */}
            <div className="space-y-2">
              <label className={labelStyle}>Total Projects</label>
              <div className="relative">
                <Layers size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="totalProjects" value={formData.totalProjects} onChange={handleChange} type="number" className={`${inputStyle} pl-14`} required />
              </div>
            </div>

            {/* --- ADDED: DEVELOPER TYPE --- */}
            <div className="space-y-2">
              <label className={labelStyle}>Developer Type</label>
              <select name="developerType" value={formData.developerType} onChange={handleChange} className={inputStyle}>
                <option value="Private">Private</option>
                <option value="Government">Government</option>
                <option value="Semi-Government">Semi-Government</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>RERA Number</label>
              <div className="relative">
                <Award size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="reraRegistrationNumber" value={formData.reraRegistrationNumber} onChange={handleChange} type="text" className={`${inputStyle} pl-14`} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Establishment Year</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="establishedYear" value={formData.establishedYear} onChange={handleChange} type="number" className={`${inputStyle} pl-14`} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Corporate Email</label>
              <input name="officialEmail" value={formData.officialEmail} onChange={handleChange} type="email" className={inputStyle} required />
            </div>

            <div className="space-y-2">
              <label className={labelStyle}>Contact Number</label>
              <input name="contactNumber" value={formData.contactNumber} onChange={handleChange} type="text" className={inputStyle} required />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className={labelStyle}>Official Office Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <input name="officeAddress" value={formData.officeAddress} onChange={handleChange} type="text" className={`${inputStyle} pl-14`} required />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
                <label className={labelStyle}>Specialization (Comma Separated)</label>
                <input name="specialization" value={formData.specialization} onChange={handleChange} type="text" placeholder="Residential, Luxury, Commercial" className={inputStyle} />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className={labelStyle}>Portfolio Details</label>
              <textarea 
                name="details" 
                value={formData.details} 
                onChange={handleChange} 
                rows="4" 
                className={`${inputStyle} h-32 resize-none normal-case`}
              />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              style={{ backgroundColor: brandGold }} 
              className="px-12 py-4 rounded-2xl text-[10px] font-black uppercase text-white tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : <><Save size={16} /> {id ? "Confirm Changes" : "Save Developer"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDeveloperForm;