import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  User, ShieldCheck, Award, MapPin, Globe, 
  Briefcase, Save, Edit3, Smartphone, CreditCard, Languages,
  Camera
} from "lucide-react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- HELPERS ---
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/agents";

const getImageUrl = (filename) => {
  if (!filename) return null;
  // If the filename is already a full URL (starts with http), return it
  if (filename.startsWith('http')) return filename;
  return `${IMAGE_BASE_URL}/${filename}`;
};

const getAvatarFallback = (name) => {
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A";
  return `https://ui-avatars.com/api/?name=${initials}&background=C5A059&color=fff&bold=true`;
};

// --- VALIDATION SCHEMA ---
const agentSchema = yup.object({
  name: yup.string().required("Legal name as per passport is required"),
  email: yup.string().email().required(),
  phone: yup.string().required("Phone number is required"),
  nationality: yup.string().required(),
  address: yup.string().required(),
  emiratesId: yup.string()
    .matches(/^784-\d{4}-\d{7}-\d{1}$/, "Format: 784-XXXX-XXXXXXX-X")
    .required(),
  reraLicenseNumber: yup.string().required("RERA License is required"),
  visaStatus: yup.string().oneOf(["Employment", "Golden Visa", "Residence", "Partner", "Freelance"]).required(),
  role: yup.string().required(),
  experienceYears: yup.number().typeError("Must be a number").min(0).required(),
  joiningDate: yup.date().typeError("Invalid date").required(),
  currentSalary: yup.number().typeError("Must be a number").nullable().notRequired(),
  languages: yup.string().required("Languages are required"), 
  skills: yup.string().required("Skills are required"), 
});

const UpdateAgent = () => {
  const { theme } = useTheme();
  const { agent, getOneAgent } = useGetAllAgent();
  const { id } = useParams();
  const isDark = theme === "dark";
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(agentSchema),
    mode: "onTouched",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  
  // Photo States
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const ct = {
    card: isDark ? "bg-slate-900/60 border-slate-800/60 backdrop-blur-xl" : "bg-white border-slate-100 shadow-2xl",
    input: isDark ? "bg-slate-800/50 border-slate-700 focus:border-amber-500 text-white" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-slate-900",
    text: isDark ? "text-slate-100" : "text-slate-900",
    label: "text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 block"
  };

  useEffect(() => { if (id) getOneAgent(id); }, [id, getOneAgent]);

  useEffect(() => {
    if (agent) {
      reset({
        ...agent,
        skills: Array.isArray(agent.skills) ? agent.skills.join(", ") : agent.skills,
        languages: Array.isArray(agent.languages) ? agent.languages.join(", ") : agent.languages,
        joiningDate: agent.joiningDate ? new Date(agent.joiningDate).toISOString().split('T')[0] : ""
      });
      // Initial preview from server
      setPhotoPreview(getImageUrl(agent.profilePhoto));
    }
  }, [agent, reset]);

  // Handle Photo Selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result); // This creates a local blob preview
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("id", id);

      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'skills' || key === 'languages') {
            const arr = typeof data[key] === 'string' 
              ? data[key].split(",").map(s => s.trim()) 
              : data[key];
            formData.append(key, JSON.stringify(arr));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const response = await http.put(`/updateagent/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setIsEditable(false);
        setSelectedFile(null);
        getOneAgent(id); 
        alert("Advisor Sync Successful");
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Check your network or file size");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ name, label, icon: Icon, type = "text", placeholder, options }) => (
    <div className="relative group">
      <label className={ct.label}>{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/50 group-focus-within:text-amber-500 transition-colors z-10">
          {Icon && <Icon size={16} />}
        </div>
        {type === "select" ? (
          <select
            {...register(name)}
            disabled={!isEditable}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all appearance-none font-bold text-sm ${ct.input} ${!isEditable && 'opacity-60 cursor-not-allowed'}`}
          >
            <option value="">Select Option</option>
            {options?.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
          </select>
        ) : (
          <input
            type={type}
            {...register(name)}
            disabled={!isEditable}
            placeholder={placeholder}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all font-bold text-sm ${ct.input} ${!isEditable && 'opacity-60 cursor-not-allowed'}`}
          />
        )}
      </div>
      {errors[name] && <span className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase block tracking-tighter">{errors[name].message}</span>}
    </div>
  );

  return (
    <div className={`min-h-screen pb-20 px-6 transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-10 mb-6 gap-6">
          <h1 className={`text-4xl font-black tracking-tighter ${ct.text}`}>
            ADVISOR <span className="font-serif italic font-light text-amber-600">Sync.</span>
          </h1>

          <div className="flex gap-4">
            {!isEditable ? (
              <button 
                type="button"
                onClick={() => setIsEditable(true)} 
                className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditable(false);
                    setPhotoPreview(getImageUrl(agent?.profilePhoto));
                    setSelectedFile(null);
                    reset();
                  }}
                  className="px-6 py-4 border border-slate-700 text-slate-500 font-black text-[10px] uppercase rounded-2xl hover:bg-red-500/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  form="agent-update-form"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-4 bg-green-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-green-500 transition-all disabled:opacity-50 shadow-xl shadow-green-900/20"
                >
                  {isSubmitting ? "Syncing..." : <><Save size={16} /> Push Updates</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Form container */}
        <form id="agent-update-form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`rounded-[3rem] border overflow-hidden ${ct.card} grid grid-cols-1 lg:grid-cols-12`}>
            
            {/* Left Sidebar */}
            <div className="lg:col-span-4 bg-slate-950 p-12 text-white relative">
              <div className="relative z-10 flex flex-col items-center lg:items-start">
                
                {/* Photo Upload & Preview Section */}
                <div className="relative group mb-8">
                  <div className={`w-32 h-32 rounded-[2rem] border-2 overflow-hidden transition-all ${isEditable ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-white/10'}`}>
                    <img 
                      src={photoPreview || getAvatarFallback(agent?.name)} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                      onError={(e) => { e.target.src = getAvatarFallback(agent?.name) }}
                    />
                    {isEditable && (
                        <div 
                          onClick={() => fileInputRef.current.click()}
                          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <Camera size={24} className="text-amber-500 mb-1" />
                            <span className="text-[8px] font-black uppercase">Change Photo</span>
                        </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoChange}
                  />
                </div>

                <div className="mb-8 w-full text-center lg:text-left">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Agent Identity</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent?.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-bold text-lg tracking-tight">{agent?.name || "Custodian"}</span>
                  </div>
                </div>

                <nav className="space-y-4 w-full">
                  {['Identity', 'Regulatory', 'Internal'].map((label, idx) => (
                    <button 
                      key={label} 
                      type="button" 
                      onClick={() => setCurrentStep(idx)} 
                      className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all ${currentStep === idx ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Form Fields Content */}
            <div className="lg:col-span-8 p-12">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {currentStep === 0 && (
                    <>
                      <InputField name="name" label="Legal Name" icon={User} placeholder="Enter name as per passport" />
                      <InputField name="nationality" label="Nationality" icon={Globe} placeholder="e.g. British" />
                      <InputField name="phone" label="Contact Number" icon={Smartphone} placeholder="+971..." />
                      <InputField name="email" label="Email Address" icon={Globe} type="email" />
                      <div className="md:col-span-2"><InputField name="address" label="Residential Address" icon={MapPin} /></div>
                    </>
                  )}

                  {currentStep === 1 && (
                    <>
                      <InputField name="emiratesId" label="Emirates ID" icon={CreditCard} placeholder="784-1234-1234567-1" />
                      <InputField name="reraLicenseNumber" label="RERA License / BRN" icon={ShieldCheck} />
                      <InputField 
                        name="visaStatus" 
                        label="Visa Category" 
                        icon={ShieldCheck} 
                        type="select" 
                        options={["Employment", "Golden Visa", "Residence", "Partner", "Freelance"]} 
                      />
                      <InputField name="role" label="Company Designation" icon={Briefcase} />
                    </>
                  )}

                  {currentStep === 2 && (
                    <>
                      <InputField name="currentSalary" label="Base Salary (AED)" icon={CreditCard} type="number" />
                      <InputField name="experienceYears" label="Total Years Exp" icon={Award} type="number" />
                      <InputField name="joiningDate" label="Hiring Date" icon={Briefcase} type="date" />
                      <InputField name="languages" label="Languages" icon={Languages} placeholder="English, Arabic, French" />
                      <div className="md:col-span-2">
                          <label className={ct.label}>Professional Skills</label>
                          <textarea 
                            {...register("skills")} 
                            disabled={!isEditable} 
                            className={`w-full p-5 rounded-2xl border outline-none font-bold text-sm h-32 transition-all ${ct.input} ${!isEditable && 'opacity-60 cursor-not-allowed'}`} 
                            placeholder="Negotiation, Market Analysis, Bulk Deals..." 
                          />
                          {errors.skills && <span className="text-[9px] text-red-500 font-bold mt-1 uppercase block">{errors.skills.message}</span>}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgent;