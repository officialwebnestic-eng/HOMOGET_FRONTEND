import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Camera, Shield, X, Info, User, Mail, Phone, MapPin, Flag, IdCard, Briefcase, Calendar, DollarSign, Globe, UserCheck, Users } from "lucide-react";

import { http } from "../../../axios/axios";
import useGetRole from "../../../hooks/useGetRole";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

import { DUBAI_MARKET_LANGUAGES } from "../../../helpers/LanguageHelpers";

const stepSchemas = [
  yup.object({
    name: yup.string().required("Legal Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Required").min(8, "Min 8 characters"),
    phone: yup.string().required("UAE contact required"),
    address: yup.string().required("Physical address required"),
    nationality: yup.string().required("Nationality required"),
    gender: yup.string().required("Gender is required"),
    emiratesId: yup.string().required("Required").matches(/^784-\d{4}-\d{7}-\d{1}$/, "Format: 784-XXXX-XXXXXXX-X"),
    reraLicenseNumber: yup.string(),
    profilePhoto: yup.mixed().required("Portrait required"),
  }),
  yup.object({
    role: yup.string().required("Designation required"),
    visaStatus: yup.string().required("Status required"),
    experienceYears: yup.number().typeError("Number required").required().min(0),
    currentSalary: yup.number().typeError("Number required").required().min(0),
    joiningDate: yup.date().typeError("Invalid date").required(),
    skills: yup.string().required("Define expertise"),
    languages: yup.array().min(1, "Select at least one language").required(),
  }),
];

const AddAgent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { addToast } = useToast();
  const { allRoles, loading: rolesLoading, fetchAllRoles } = useGetRole(); // ✅ Use allRoles instead of RolesPermessionData
  const fileInputRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedLangs, setSelectedLangs] = useState(["English"]);

  // Fetch roles on component mount
  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  const { register, handleSubmit, trigger, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onTouched",
    defaultValues: { languages: ["English"], gender: "" }
  });

  const brandColor = "#f59e0b";
  const brandDark = "#d97706";

  const toggleLanguage = (lang) => {
    const updated = selectedLangs.includes(lang)
      ? selectedLangs.filter(l => l !== lang)
      : [...selectedLangs, lang];
    setSelectedLangs(updated);
    setValue("languages", updated, { shouldValidate: true });
  };

  const handleNext = async () => {
    const fields = ["name", "email", "password", "phone", "address", "nationality", "gender", "emiratesId", "reraLicenseNumber", "profilePhoto"];
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep(1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      if (data.profilePhoto) formData.append("file", data.profilePhoto);

      Object.keys(data).forEach(key => {
        if (key !== "profilePhoto") {
          if (key === 'languages') {
            data[key].forEach(lang => formData.append("languages[]", lang));
          } else if (key === 'skills') {
            const skillsArr = data[key].split(',').map(s => s.trim());
            skillsArr.forEach(s => formData.append("skills[]", s));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const res = await http.post("/addagent", formData);
      if (res.data.success) {
        addToast("Agent Registered Successfully", "success");
        reset(); 
        setPreview(null); 
        setSelectedLangs(["English"]); 
        setCurrentStep(0);
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Registration Error", "error");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  // Section headers for current step
  const stepInfo = [
    {
      title: "Personal Information",
      subtitle: "Basic identity and contact details",
      icon: <User size={18} />,
      fields: ["Legal Name", "Email", "Password", "Phone", "Address", "Nationality", "Gender", "Emirates ID", "RERA BRN"]
    },
    {
      title: "Professional Profile",
      subtitle: "Work details and expertise",
      icon: <Briefcase size={18} />,
      fields: ["Languages", "Designation", "Visa Status", "Monthly Target", "Experience", "Joining Date", "Skills"]
    }
  ];

  return (
    <div className={`min-h-screen p-6 md:p-10 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section with Current Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield style={{ color: brandColor }} size={16} />
            <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-500">Homoget Registry</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                Register <span style={{ color: brandColor }}>Agent</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${currentStep === 0 ? 'bg-amber-500/20 text-amber-500' : 'bg-green-500/20 text-green-500'}`}>
                    Step 1
                  </span>
                  <ChevronRight size={10} className="text-slate-500" />
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${currentStep === 1 ? 'bg-amber-500/20 text-amber-500' : 'text-slate-500'}`}>
                    Step 2
                  </span>
                </div>
              </div>
            </div>
            
            {/* Step Progress Bar */}
            <div className="w-full md:w-64">
              <div className="flex justify-between text-[8px] font-bold uppercase text-slate-500 mb-1">
                <span>Personal</span>
                <span>Professional</span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500 rounded-full" 
                     style={{ width: currentStep === 0 ? '50%' : '100%', backgroundColor: brandColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* Current Section Header Card */}
        <div className={`mb-6 p-5 rounded-2xl border-l-4 transition-all ${isDark ? 'bg-[#11141B] border-white/10' : 'bg-white border-slate-100'}`} style={{ borderLeftColor: brandColor }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${brandColor}15` }}>
              {stepInfo[currentStep].icon}
            </div>
            <div>
              <h2 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                {stepInfo[currentStep].title}
              </h2>
              <p className="text-[9px] text-slate-500 mt-0.5">{stepInfo[currentStep].subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-200 dark:border-white/5">
            {stepInfo[currentStep].fields.map((field, idx) => (
              <span key={idx} className="text-[7px] font-medium text-slate-400 uppercase tracking-wider px-1.5">
                {field}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-8">
            <motion.div 
              key={currentStep} 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`p-6 md:p-8 rounded-2xl border shadow-lg ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-100'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentStep === 0 ? (
                  <>
                    <div className="md:col-span-2">
                      <Label label="Full Legal Name" icon={<User size={12} />} brandColor={brandColor} />
                      <input {...register("name")} className={InputClass(isDark, brandColor)} placeholder="As per Passport" />
                      <ErrorMsg error={errors.name} />
                    </div>
                    
                    <div>
                      <Label label="Work Email" icon={<Mail size={12} />} brandColor={brandColor} />
                      <input {...register("email")} className={InputClass(isDark, brandColor)} placeholder="agent@homoget.ae" />
                      <ErrorMsg error={errors.email} />
                    </div>
                    
                    <div>
                      <Label label="Portal Password" icon={<Shield size={12} />} brandColor={brandColor} />
                      <input type="password" {...register("password")} className={InputClass(isDark, brandColor)} />
                      <ErrorMsg error={errors.password} />
                    </div>
                    
                    <div>
                      <Label label="UAE Contact" icon={<Phone size={12} />} brandColor={brandColor} />
                      <input {...register("phone")} className={InputClass(isDark, brandColor)} placeholder="+971 XX XXX XXXX" />
                      <ErrorMsg error={errors.phone} />
                    </div>
                    
                    <div>
                      <Label label="Nationality" icon={<Flag size={12} />} brandColor={brandColor} />
                      <input {...register("nationality")} className={InputClass(isDark, brandColor)} placeholder="e.g., Indian, Pakistani, Filipino" />
                      <ErrorMsg error={errors.nationality} />
                    </div>
                    
                    {/* Gender Dropdown */}
                    <div>
                      <Label label="Gender" icon={<Users size={12} />} brandColor={brandColor} />
                      <select {...register("gender")} className={InputClass(isDark, brandColor)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <ErrorMsg error={errors.gender} />
                    </div>
                    
                    <div>
                      <Label label="Emirates ID" icon={<IdCard size={12} />} brandColor={brandColor} />
                      <input {...register("emiratesId")} className={InputClass(isDark, brandColor)} placeholder="784-XXXX-XXXXXXX-X" />
                      <ErrorMsg error={errors.emiratesId} />
                    </div>
                    
                    <div>
                      <Label label="RERA BRN" icon={<Shield size={12} />} brandColor={brandColor} />
                      <input {...register("reraLicenseNumber")} className={InputClass(isDark, brandColor)} placeholder="BRN-XXXXX" />
                      <ErrorMsg error={errors.reraLicenseNumber} />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label label="Home Address" icon={<MapPin size={12} />} brandColor={brandColor} />
                      <input {...register("address")} className={InputClass(isDark, brandColor)} placeholder="Building, Street, City" />
                      <ErrorMsg error={errors.address} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <Label label="Languages Spoken" icon={<Globe size={12} />} brandColor={brandColor} />
                      <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-slate-100 dark:bg-white/5 min-h-[45px]">
                        {selectedLangs.length === 0 ? (
                          <span className="text-[9px] text-slate-400">No languages selected</span>
                        ) : (
                          selectedLangs.map(lang => (
                            <span key={lang} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: brandColor }}>
                              {lang} <X size={10} className="cursor-pointer hover:opacity-80" onClick={() => toggleLanguage(lang)} />
                            </span>
                          ))
                        )}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {DUBAI_MARKET_LANGUAGES.map(lang => (
                          <button 
                            key={lang} 
                            type="button" 
                            onClick={() => toggleLanguage(lang)}
                            className={`py-2 rounded-lg text-[8px] font-bold uppercase transition-all border ${
                              selectedLangs.includes(lang) 
                                ? 'border-amber-500 bg-amber-500/10 text-amber-500' 
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                      <ErrorMsg error={errors.languages} />
                    </div>
                    
                    <div>
                      <Label label="Designation" icon={<Briefcase size={12} />} brandColor={brandColor} />
                      <select {...register("role")} className={InputClass(isDark, brandColor)}>
                        <option value="">Select Role</option>
                        {/* ✅ Use allRoles instead of RolesPermessionData */}
                        {rolesLoading ? (
                          <option disabled>Loading roles...</option>
                        ) : (
                          allRoles?.map(role => (
                            <option key={role._id} value={role.roleName}>
                              {role.roleName}
                            </option>
                          ))
                        )}
                      </select>
                      <ErrorMsg error={errors.role} />
                    </div>
                    
                    <div>
                      <Label label="Visa Status" icon={<IdCard size={12} />} brandColor={brandColor} />
                      <select {...register("visaStatus")} className={InputClass(isDark, brandColor)}>
                        <option value="">Select Status</option>
                        <option value="Employment">Employment Visa</option>
                        <option value="Golden Visa">Golden Visa</option>
                        <option value="Residence">Residence Visa</option>
                        <option value="Visit">Visit Visa</option>
                      </select>
                      <ErrorMsg error={errors.visaStatus} />
                    </div>
                    
                    <div>
                      <Label label="Monthly Target (AED)" icon={<DollarSign size={12} />} brandColor={brandColor} />
                      <input type="number" {...register("currentSalary")} className={InputClass(isDark, brandColor)} placeholder="e.g., 50000" />
                      <ErrorMsg error={errors.currentSalary} />
                    </div>
                    
                    <div>
                      <Label label="Experience (Years)" icon={<Calendar size={12} />} brandColor={brandColor} />
                      <input type="number" {...register("experienceYears")} className={InputClass(isDark, brandColor)} placeholder="e.g., 5" />
                      <ErrorMsg error={errors.experienceYears} />
                    </div>
                    
                    <div>
                      <Label label="Joining Date" icon={<Calendar size={12} />} brandColor={brandColor} />
                      <input type="date" {...register("joiningDate")} className={InputClass(isDark, brandColor)} />
                      <ErrorMsg error={errors.joiningDate} />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label label="Specializations (Comma separated)" icon={<UserCheck size={12} />} brandColor={brandColor} />
                      <textarea {...register("skills")} className={InputClass(isDark, brandColor)} rows={3} placeholder="Palm Jumeirah, Luxury Villas, Off-plan Properties..." />
                      <ErrorMsg error={errors.skills} />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar - Image Upload & Actions */}
          <div className="lg:col-span-4">
            <div className={`p-6 rounded-2xl border shadow-lg sticky top-6 ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-100'}`}>
              <Label label="Agent Portrait" icon={<Camera size={12} />} brandColor={brandColor} />
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className="group relative aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden cursor-pointer transition-all flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:border-amber-500"
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-[8px] text-slate-400">Upload Photo</p>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                const file = e.target.files[0];
                if(file) { 
                  setValue("profilePhoto", file, { shouldValidate: true }); 
                  setPreview(URL.createObjectURL(file)); 
                }
              }} />
              <ErrorMsg error={errors.profilePhoto} />
              
              <div className="mt-6 space-y-3">
                {currentStep === 0 ? (
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    className="w-full py-3.5 rounded-xl text-white font-bold uppercase text-[10px] tracking-wider shadow-md transition-all hover:opacity-90"
                    style={{ backgroundColor: brandColor }}
                  >
                    Continue to Professional Details
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full py-3.5 rounded-xl text-white font-bold uppercase text-[10px] tracking-wider shadow-md transition-all hover:opacity-90"
                      style={{ backgroundColor: brandColor }}
                    >
                      {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Register Agent"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(0)} 
                      className="text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-amber-500 transition-colors py-2"
                    >
                      ← Back to Personal Info
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper Components
const Label = ({ label, icon, brandColor }) => (
  <label className="flex items-center gap-1.5 text-amber-600 text-[8px] font-bold uppercase tracking-wider mb-2">
    {icon && <span style={{ color: brandColor }}>{icon}</span>}
    {label}
  </label>
);

const ErrorMsg = ({ error }) => 
  error ? <p className="text-rose-500 text-[8px] font-bold mt-1 uppercase tracking-tighter">{error.message}</p> : null;

const InputClass = (isDark, brandColor) => 
  `w-full p-3 rounded-xl border outline-none transition-all text-xs font-medium ${isDark ? "bg-[#0a0a0c] border-white/10 text-white focus:border-amber-500" : "bg-white border-slate-200 text-slate-700 focus:border-amber-500"} focus:ring-1 focus:ring-amber-500`;

export default AddAgent;