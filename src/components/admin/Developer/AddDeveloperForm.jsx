import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building2, Save, X, Upload, Calendar, 
  MapPin, Hash, Award, Layers, FileText, Info,
  Mail, Phone, ShieldCheck, Briefcase, Globe, Sparkles,
  ChevronLeft, TrendingUp, Users, Home, File, Trash2, FileCheck,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

// Dubai Developer Types
const DEVELOPER_TYPES = [
  { value: "Government", label: "Government Entity", description: "Dubai Government entities" },
  { value: "Semi-Government", label: "Semi-Government", description: "e.g., Dubai Holding, Meraas" },
  { value: "Private", label: "Private Developer", description: "e.g., Emaar, Damac" },
  { value: "Public Listed", label: "Public Listed Company", description: "Listed on stock exchanges" },
  { value: "Family Owned", label: "Family Owned Business", description: "Family-run development businesses" },
  { value: "International", label: "International Developer", description: "Foreign developers in Dubai" },
  { value: "Joint Venture", label: "Joint Venture", description: "Partnership between developers" },
  { value: "REIT", label: "Real Estate Investment Trust", description: "REITs investing in Dubai" },
  { value: "Master Developer", label: "Master Developer", description: "e.g., Dubai South, DIFC" },
  { value: "Sub-Developer", label: "Sub-Developer", description: "Working under master developers" },
];

// Form Sections Configuration
const FORM_SECTIONS = [
  { id: "identity", label: "Identity", icon: Building2 },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
  { id: "contact", label: "Contact", icon: Globe },
  { id: "narrative", label: "Narrative", icon: FileText },
  { id: "documents", label: "Documents", icon: File },
];

const AddDeveloperForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToast } = useToast();
  
  // Refs
  const fileInputRef = useRef(null);
  const contractFileInputRef = useRef(null);
  const otherDocFileInputRef = useRef(null);
  
  // Constants
  const isDark = theme === "dark";
  const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:5000";
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_FILE_TYPES = ["application/pdf"];
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("identity");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [contractFile, setContractFile] = useState(null);
  const [contractFileName, setContractFileName] = useState("");
  const [otherDocFile, setOtherDocFile] = useState(null);
  const [otherDocFileName, setOtherDocFileName] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    companyName: "",
    tradeLicenseNumber: "",
  
    establishedYear: new Date().getFullYear(),
    officialEmail: "",
    contactNumber: "",
    officeAddress: "",
    developerType: "Private",
    specialization: "", 
    totalProjects: 0,
    details: "",
    contractDocument: "",
    otherDocument: "",
  });

  // Fetch developer data for edit
  useEffect(() => {
    if (id) {
      fetchDeveloperData();
    }
  }, [id]);

  const fetchDeveloperData = async () => {
    try {
      const response = await http.get(`/developers/${id}`);
      if (response.data.success) {
        const dev = response.data.data;
        setFormData({
          ...dev,
          specialization: Array.isArray(dev.specialization) 
            ? dev.specialization.join(", ") 
            : dev.specialization || "",
          contractDocument: dev.contractDocument || "",
          otherDocument: dev.otherDocument || ""
        });
        
        if (dev.companyLogo) {
          setLogoPreview(`${BACKEND_URL}/agents/${dev.companyLogo}`);
        }
        if (dev.contractDocument) {
          setContractFileName(dev.contractDocument.split('/').pop());
        }
        if (dev.otherDocument) {
          setOtherDocFileName(dev.otherDocument.split('/').pop());
        }
      }
    } catch (err) {
      addToast("Failed to load developer data", "error");
    }
  };

  // File validation helper
  const validateFile = (file, type) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      addToast(`Only PDF files are allowed for ${type}`, "error");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      addToast(`File size should be less than 10MB for ${type}`, "error");
      return false;
    }
    return true;
  };

  // File handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleContractFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "contract documents")) {
      setContractFile(file);
      setContractFileName(file.name);
    } else {
      e.target.value = "";
    }
  };

  const handleOtherDocFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file, "other documents")) {
      setOtherDocFile(file);
      setOtherDocFileName(file.name);
    } else {
      e.target.value = "";
    }
  };

  // Remove file handlers
  const handleRemoveContractFile = () => {
    setContractFile(null);
    setContractFileName("");
    if (contractFileInputRef.current) {
      contractFileInputRef.current.value = "";
    }
    if (formData.contractDocument) {
      setFormData(prev => ({ ...prev, contractDocument: "" }));
    }
  };

  const handleRemoveOtherDocFile = () => {
    setOtherDocFile(null);
    setOtherDocFileName("");
    if (otherDocFileInputRef.current) {
      otherDocFileInputRef.current.value = "";
    }
    if (formData.otherDocument) {
      setFormData(prev => ({ ...prev, otherDocument: "" }));
    }
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }
    if (!formData.tradeLicenseNumber.trim()) {
      errors.tradeLicenseNumber = "Trade license number is required";
    }
   
    if (!formData.officialEmail.trim()) {
      errors.officialEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.officialEmail)) {
      errors.officialEmail = "Invalid email format";
    }
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    }
    if (!formData.officeAddress.trim()) {
      errors.officeAddress = "Office address is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    
    setIsLoading(true);
    const data = new FormData();
    
    // Prepare specialization array
    const specializationArray = formData.specialization
      .split(",")
      .map(i => i.trim())
      .filter(i => i !== "");

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "specialization") {
        data.append(key, JSON.stringify(specializationArray));
      } else if (key === "contractDocument" || key === "otherDocument") {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    // Append files
    if (logoFile) data.append("companyLogo", logoFile);
    if (contractFile) data.append("contractDocument", contractFile);
    if (otherDocFile) data.append("otherDocument", otherDocFile);

    try {
      const response = id 
        ? await http.put(`/developers/${id}`, data) 
        : await http.post(`/developers`, data);
      
      if (response.data.success) {
        addToast(
          id ? "Developer Updated Successfully" : "Developer Registered Successfully", 
          "success"
        );
        navigate("/viewdevelopers");
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSection(sectionId);
  };

  // Shared Styles
  const cardClass = `p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
    isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200 shadow-sm"
  }`;
  
  const inputClass = `w-full px-4 py-3 rounded-xl text-sm font-medium outline-none border transition-all duration-300 ${
    isDark 
      ? "bg-[#0a0a0c] border-white/10 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500" 
      : "bg-slate-50 border-slate-200 text-slate-900 focus:border-amber-500 focus:bg-white"
  }`;
  
  const inputErrorClass = `border-red-500 focus:border-red-500 focus:ring-red-500`;
  
  const labelClass = "text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center gap-2";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className={`p-2 rounded-xl transition-all ${
                isDark ? "hover:bg-white/10" : "hover:bg-slate-100"
              }`}
            >
              <ChevronLeft size={20} className={isDark ? "text-slate-400" : "text-slate-600"} />
            </button>
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-800"
              }`}>
                {id ? "Edit" : "Add"} <span className="text-amber-500">Developer</span>
              </h1>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}>
                {id ? "Update developer information" : "Register new development partner"}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-100"
          }`}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-amber-500">
              RERA Certified
            </p>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 pb-2 overflow-x-auto scrollbar-thin">
          {FORM_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? "bg-amber-500 text-black shadow-md"
                    : isDark
                      ? "bg-white/5 text-slate-400 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon size={14} /> {section.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: IDENTITY */}
          <Section
            id="identity"
            title="Brand Identity"
            icon={Building2}
            cardClass={cardClass}
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div className="md:col-span-1">
                <label className={labelClass}>Company Logo <span className="text-red-500">*</span></label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                    logoPreview
                      ? isDark ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-500/30 bg-emerald-50"
                      : isDark ? "border-white/10 bg-[#0a0a0c] hover:border-amber-500/50" : "border-slate-200 bg-slate-50 hover:border-amber-500"
                  }`}
                >
                  {logoPreview ? (
                    <>
                      <img 
                        src={logoPreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
                      />
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
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <FormField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g., Emaar Properties"
                  required
                  error={formErrors.companyName}
                  inputClass={inputClass}
                  inputErrorClass={inputErrorClass}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>
                      Developer Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="developerType" 
                      value={formData.developerType} 
                      onChange={handleChange} 
                      className={inputClass}
                    >
                      {DEVELOPER_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[8px] text-slate-400 mt-1">
                      {DEVELOPER_TYPES.find(t => t.value === formData.developerType)?.description}
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Established Year</label>
                    <input 
                      name="establishedYear" 
                      value={formData.establishedYear} 
                      onChange={handleChange} 
                      type="number" 
                      className={inputClass} 
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 2: COMPLIANCE */}
          <Section
            id="compliance"
            title="Compliance & Licensing"
            icon={ShieldCheck}
            cardClass={cardClass}
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Trade License Number"
                name="tradeLicenseNumber"
                value={formData.tradeLicenseNumber}
                onChange={handleChange}
                placeholder="e.g., 1523268"
                required
                error={formErrors.tradeLicenseNumber}
                inputClass={inputClass}
                inputErrorClass={inputErrorClass}
              />
             
              <div>
                <label className={labelClass}>Total Projects</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="totalProjects" 
                    value={formData.totalProjects} 
                    onChange={handleChange} 
                    type="number" 
                    className={`${inputClass} pl-10`} 
                    placeholder="0" 
                    min="0"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Specialization</label>
                <input 
                  name="specialization" 
                  value={formData.specialization} 
                  onChange={handleChange} 
                  type="text" 
                  className={inputClass} 
                  placeholder="Luxury, Waterfront, Commercial..." 
                />
                <p className="text-[8px] text-slate-400 mt-1">Comma-separated values</p>
              </div>
            </div>
          </Section>

          {/* SECTION 3: CONTACT */}
          <Section
            id="contact"
            title="Contact & Location"
            icon={Globe}
            cardClass={cardClass}
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Official Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="officialEmail" 
                    value={formData.officialEmail} 
                    onChange={handleChange} 
                    type="email" 
                    className={`${inputClass} ${formErrors.officialEmail ? inputErrorClass : ""} pl-10`} 
                    placeholder="contact@developer.com" 
                  />
                  {formErrors.officialEmail && (
                    <p className="text-[9px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.officialEmail}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className={labelClass}>Contact Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    name="contactNumber" 
                    value={formData.contactNumber} 
                    onChange={handleChange} 
                    type="tel" 
                    className={`${inputClass} ${formErrors.contactNumber ? inputErrorClass : ""} pl-10`} 
                    placeholder="+971 XX XXX XXXX" 
                  />
                  {formErrors.contactNumber && (
                    <p className="text-[9px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.contactNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Office Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-4 text-slate-400" />
                  <textarea 
                    name="officeAddress" 
                    value={formData.officeAddress} 
                    onChange={handleChange} 
                    rows={2} 
                    className={`${inputClass} ${formErrors.officeAddress ? inputErrorClass : ""} pl-10 resize-none`} 
                    placeholder="Full corporate address" 
                  />
                  {formErrors.officeAddress && (
                    <p className="text-[9px] text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {formErrors.officeAddress}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Section>

          {/* SECTION 4: NARRATIVE */}
          <Section
            id="narrative"
            title="Company Narrative"
            icon={FileText}
            cardClass={cardClass}
            isDark={isDark}
          >
            <div>
              <label className={labelClass}>Company Bio / History</label>
              <textarea 
                name="details" 
                value={formData.details} 
                onChange={handleChange} 
                rows={6} 
                className={`${inputClass} resize-none`}
                placeholder="Describe the developer's journey, achievements, and market presence..."
                maxLength="2000"
              />
              <div className="flex justify-between mt-2">
                <p className="text-[9px] text-slate-400 italic">Maximum 2000 characters</p>
                <p className="text-[9px] text-slate-400">{formData.details.length}/2000</p>
              </div>
            </div>
          </Section>

          {/* SECTION 5: DOCUMENTS */}
          <Section
            id="documents"
            title="Legal Documents"
            icon={File}
            cardClass={cardClass}
            isDark={isDark}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contract Document Upload */}
              <DocumentUpload
                label="Contract Document"
                fileName={contractFileName || formData.contractDocument?.split('/').pop()}
                isUploaded={!!(contractFileName || formData.contractDocument)}
                onUploadClick={() => contractFileInputRef.current.click()}
                onRemove={handleRemoveContractFile}
                isDark={isDark}
                inputRef={contractFileInputRef}
                onChange={handleContractFileChange}
                accept=".pdf,application/pdf"
              />

              {/* Other Document Upload */}
              <DocumentUpload
                label="Other Document"
                fileName={otherDocFileName || formData.otherDocument?.split('/').pop()}
                isUploaded={!!(otherDocFileName || formData.otherDocument)}
                onUploadClick={() => otherDocFileInputRef.current.click()}
                onRemove={handleRemoveOtherDocFile}
                isDark={isDark}
                inputRef={otherDocFileInputRef}
                onChange={handleOtherDocFileChange}
                accept=".pdf,application/pdf"
              />
            </div>
          </Section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
                isDark 
                  ? "bg-white/5 text-slate-300 hover:bg-white/10" 
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

// Reusable Section Component
const Section = ({ id, title, icon: Icon, children, cardClass, isDark }) => (
  <div id={`section-${id}`} className={`scroll-mt-24 ${cardClass}`}>
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-200 dark:border-white/10">
      <div className="p-2 rounded-lg bg-amber-500/10">
        <Icon size={18} className="text-amber-500" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </div>
);

// Reusable Form Field Component
const FormField = ({ 
  label, name, value, onChange, placeholder, 
  required, error, inputClass, inputErrorClass, type = "text" 
}) => (
  <div>
    <label className={`text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center gap-2`}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      type={type}
      className={`${inputClass} ${error ? inputErrorClass : ""}`}
      placeholder={placeholder}
    />
    {error && (
      <p className="text-[9px] text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

// Reusable Document Upload Component
const DocumentUpload = ({ 
  label, fileName, isUploaded, onUploadClick, onRemove, 
  isDark, inputRef, onChange, accept 
}) => (
  <div>
    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block flex items-center gap-2">
      {label} <span className="text-amber-500 text-[8px]">(PDF only, max 10MB)</span>
    </label>
    <div className="space-y-3">
      <div 
        onClick={onUploadClick}
        className={`p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all text-center group ${
          isUploaded
            ? isDark ? "border-emerald-500/30 bg-emerald-500/5" : "border-emerald-500/30 bg-emerald-50"
            : isDark ? "border-white/10 bg-[#0a0a0c] hover:border-amber-500/50" : "border-slate-200 bg-slate-50 hover:border-amber-500"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className={`p-3 rounded-full ${isUploaded ? "bg-emerald-500/20" : "bg-amber-500/10"}`}>
            {isUploaded ? (
              <FileCheck size={24} className="text-emerald-500" />
            ) : (
              <Upload size={24} className="text-amber-500" />
            )}
          </div>
          {isUploaded ? (
            <div>
              <p className="text-sm font-medium text-emerald-500">{fileName || "Document uploaded"}</p>
              <p className="text-[9px] text-slate-400">Click to change file</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium">Upload {label}</p>
              <p className="text-[9px] text-slate-400">Click to browse PDF files</p>
            </div>
          )}
        </div>
      </div>
      <input 
        type="file" 
        ref={inputRef} 
        onChange={onChange} 
        className="hidden" 
        accept={accept} 
      />
      {isUploaded && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors"
        >
          <Trash2 size={12} /> Remove {label}
        </button>
      )}
    </div>
  </div>
);

export default AddDeveloperForm;