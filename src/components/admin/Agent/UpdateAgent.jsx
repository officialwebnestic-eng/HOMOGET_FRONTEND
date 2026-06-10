import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  User, ShieldCheck, Award, MapPin, Globe, 
  Briefcase, Save, Edit3, Smartphone, CreditCard, Languages,
  Camera, DollarSign, Calendar, Phone, Mail, Home, Trash2, X,
  Eye, Lock, Unlock, UserCheck, UserX, RefreshCw, AlertCircle,
  CheckCircle, Hash, Building2, Star, TrendingUp, Heart, Loader2
} from "lucide-react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../model/SuccessToasNotification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/agents/${filename}`;
};

const getAvatarFallback = (name) => {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "A";
  return `https://ui-avatars.com/api/?name=${initials}&background=C5A059&color=fff&bold=true`;
};

const agentSchema = yup.object({
  name: yup.string().required("Legal name as per passport is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  nationality: yup.string().required("Nationality is required"),
  address: yup.string().required("Address is required"),
  emiratesId: yup.string()
    .matches(/^784-\d{4}-\d{7}-\d{1}$/, "Format: 784-XXXX-XXXXXXX-X")
    .required("Emirates ID is required"),
  reraLicenseNumber: yup.string().required("RERA License is required"),
  visaStatus: yup.string().oneOf(["Employment", "Golden Visa", "Residence", "Partner", "Freelance"]).required("Visa status is required"),
  role: yup.string().required("Designation is required"),
  experienceYears: yup.number()
    .typeError("Must be a number")
    .min(0)
    .required("Experience years are required")
    .transform((value) => (isNaN(value) ? undefined : value)),
  joiningDate: yup.date().typeError("Invalid date").required("Joining date is required"),
  currentSalary: yup.mixed()
    .nullable()
    .notRequired()
    .transform((value) => {
      if (!value || value === "" || value === null) return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    }),
  languages: yup.string().required("Languages are required"), 
  skills: yup.string().required("Skills are required"), 
  gender: yup.string().oneOf(["Male", "Female", "Other"]).required("Gender is required"),
  agentId: yup.string().required("Agent ID is required"),
});

// 1. FIXED: InputField component moved completely OUTSIDE the main component
const InputField = ({ name, label, icon: Icon, type = "text", placeholder, options, register, isEditable, errors, ct }) => (
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
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

const UpdateAgent = () => {
  const { theme } = useTheme();
  const { agent, getOneAgent } = useGetAllAgent();
  
  const { id } = useParams();
  const isDark = theme === "dark";
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const { addToast } = useToast();
  
  const [imageError, setImageError] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(agentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      nationality: "",
      address: "",
      emiratesId: "",
      reraLicenseNumber: "",
      visaStatus: "",
      role: "",
      experienceYears: 0,
      joiningDate: "",
      currentSalary: null,
      languages: "",
      skills: "",
      gender: "",
      agentId: ""
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const ct = {
    card: isDark ? "bg-slate-900/60 border-slate-800/60 backdrop-blur-xl" : "bg-white border-slate-100 shadow-2xl",
    input: isDark ? "bg-slate-800/50 border-slate-700 focus:border-amber-500 text-white" : "bg-slate-50 border-slate-200 focus:border-amber-500 text-slate-900",
    text: isDark ? "text-slate-100" : "text-slate-900",
    label: "text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 block"
  };

  useEffect(() => { 
    if (id) getOneAgent(id); 
  }, [id, getOneAgent]);

  useEffect(() => {
    if (agent) {
      const salaryValue = agent.currentSalary && agent.currentSalary > 0 ? agent.currentSalary : "";
      
      reset({
        name: agent.name || "",
        email: agent.email || "",
        phone: agent.phone || "",
        nationality: agent.nationality || "",
        address: agent.address || "",
        emiratesId: agent.emiratesId || "",
        reraLicenseNumber: agent.reraLicenseNumber || "",
        visaStatus: agent.visaStatus || "",
        role: agent.role || "",
        experienceYears: agent.experienceYears || 0,
        joiningDate: agent.joiningDate ? new Date(agent.joiningDate).toISOString().split('T')[0] : "",
        currentSalary: salaryValue,
        languages: Array.isArray(agent.languages) ? agent.languages.join(", ") : (agent.languages || ""),
        skills: Array.isArray(agent.skills) ? agent.skills.join(", ") : (agent.skills || ""),
        gender: agent.gender || "",
        agentId: agent.agentId || ""
      });
      
      const imageUrl = getImageUrl(agent.profilePhoto);
      setPhotoPreview(imageUrl);
      setImageError(false);
      setRemoveImage(false);
      setSelectedFile(null);
    }
  }, [agent, reset]);

  useEffect(() => {
    if (isEditable) {
      const timer = setTimeout(() => {
        const firstInput = document.querySelector('#agent-update-form input:not([disabled]), #agent-update-form select:not([disabled]), #agent-update-form textarea:not([disabled])');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditable]);

  const handleEditMode = () => {
    setIsEditable(true);
  };

  const handleCancelEdit = () => {
    setIsEditable(false);
    setPhotoPreview(getImageUrl(agent?.profilePhoto));
    setSelectedFile(null);
    setRemoveImage(false);
    reset();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        addToast("Please upload a valid image (JPEG, PNG, WEBP)", "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast("Image size should be less than 5MB", "error");
        return;
      }
      
      setSelectedFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setRemoveImage(true);
    setPhotoPreview(null);
    setSelectedFile(null);
    setShowRemoveConfirm(false);
    addToast("Image will be removed when you save", "info");
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await http.put(`/updatestatus?status=${newStatus}&id=${id}`, {}, {
        withCredentials: true
      });
      if (response.data.success) {
        addToast(`Agent status updated to ${newStatus}`, "success");
        await getOneAgent(id);
      }
    } catch (error) {
      console.error("Status update error:", error);
      addToast("Failed to update status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleBlockToggle = async () => {
    setUpdatingStatus(true);
    try {
      const endpoint = agent?.isBlocked ? `/unblock-agent/${id}` : `/block-agent/${id}`;
      const response = await http.put(endpoint, agent?.isBlocked ? {} : { reason: "Admin action" }, {
        withCredentials: true
      });
      if (response.data.success) {
        addToast(agent?.isBlocked ? "Agent unblocked successfully" : "Agent blocked successfully", "success");
        await getOneAgent(id);
      }
    } catch (error) {
      console.error("Block toggle error:", error);
      addToast("Failed to update block status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVisibilityToggle = async () => {
    setUpdatingVisibility(true);
    try {
      const endpoint = agent?.isPublic ? `/make-unpublic/${id}` : `/make-public/${id}`;
      const response = await http.put(endpoint, {}, { withCredentials: true });
      if (response.data.success) {
        addToast(agent?.isPublic ? "Agent profile is now private" : "Agent profile is now public", "success");
        await getOneAgent(id);
      }
    } catch (error) {
      console.error("Visibility update error:", error);
      addToast("Failed to update visibility", "error");
    } finally {
      setUpdatingVisibility(false);
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
      
      if (removeImage && !selectedFile) {
        formData.append("removeImage", "true");
      }

      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value === undefined || value === null || value === "") return;
        
        if (key === 'skills' || key === 'languages') {
          const arr = typeof value === 'string' 
            ? value.split(",").map(s => s.trim()).filter(Boolean)
            : value;
          if (arr.length > 0) {
            formData.append(key, JSON.stringify(arr));
          }
        } 
        else if (key === 'currentSalary') {
          const salary = Number(value);
          if (!isNaN(salary) && salary > 0) {
            formData.append(key, salary);
          }
        }
        else if (key === 'experienceYears') {
          const years = Number(value);
          if (!isNaN(years) && years >= 0) {
            formData.append(key, years);
          }
        }
        else {
          formData.append(key, value);
        }
      });

      const response = await http.put(`/updateagent/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setIsEditable(false);
        setSelectedFile(null);
        setRemoveImage(false);
        await getOneAgent(id);
        addToast("Agent Updated Successfully", "success");
      } else {
        addToast(response.data.message || "Update failed", "error");
      }
    } catch (error) {
      console.error("Update Error:", error);
      addToast(error.response?.data?.message || "Check your network or file size", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onClick={handleEditMode}
                className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleCancelEdit}
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

        {/* Status and Visibility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Status Card */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-white/10' : 'bg-white shadow-md'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${agent?.status === 'Active' ? 'bg-green-500 animate-pulse' : agent?.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{agent?.status || 'Pending'}</span>
                </div>
              </div>
              <select
                value={agent?.status || 'Pending'}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                disabled={updatingStatus}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border outline-none ${isDark ? 'bg-slate-700 border-white/10 text-white' : 'bg-slate-100 border-slate-200'}`}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Block/Unblock Card */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-white/10' : 'bg-white shadow-md'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Access Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {agent?.isBlocked ? <UserX size={14} className="text-red-500" /> : <UserCheck size={14} className="text-green-500" />}
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{agent?.isBlocked ? 'Blocked' : 'Active'}</span>
                </div>
              </div>
              <button
                onClick={handleBlockToggle}
                disabled={updatingStatus}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  agent?.isBlocked 
                    ? 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-600 hover:bg-rose-500/30'
                }`}
              >
                {updatingStatus ? <Loader2 className="animate-spin" size={14} /> : (agent?.isBlocked ? 'Unblock' : 'Block')}
              </button>
            </div>
          </div>

          {/* Public/Private Card */}
          <div className={`p-4 rounded-2xl ${isDark ? 'bg-slate-800/50 border border-white/10' : 'bg-white shadow-md'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Profile Visibility</p>
                <div className="flex items-center gap-2 mt-1">
                  {agent?.isPublic ? <Unlock size={14} className="text-blue-500" /> : <Lock size={14} className="text-purple-500" />}
                  <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{agent?.isPublic ? 'Public' : 'Private'}</span>
                </div>
              </div>
              <button
                onClick={handleVisibilityToggle}
                disabled={updatingVisibility}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  agent?.isPublic 
                    ? 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30' 
                    : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
                }`}
              >
                {updatingVisibility ? <Loader2 className="animate-spin" size={14} /> : (agent?.isPublic ? 'Make Private' : 'Make Public')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Form container */}
        <form id="agent-update-form" onSubmit={handleSubmit(onSubmit)}>
          <div className={`rounded-[3rem] border overflow-hidden ${ct.card} grid grid-cols-1 lg:grid-cols-12`}>
            
            {/* Left Sidebar */}
            <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-white relative">
              <div className="relative z-10 flex flex-col items-center lg:items-start">
                
                {/* Photo Upload Section */}
                <div className="relative group mb-8">
                  <div className={`w-32 h-32 rounded-2xl overflow-hidden transition-all ${isEditable ? 'ring-2 ring-amber-500 shadow-lg shadow-amber-500/20' : 'ring-1 ring-white/10'}`}>
                    <img 
                      src={photoPreview || getAvatarFallback(agent?.name)} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                      onError={(e) => { 
                        e.target.src = getAvatarFallback(agent?.name);
                        setImageError(true);
                      }}
                    />
                    {isEditable && (
                      <>
                        <div 
                          onClick={() => fileInputRef.current.click()}
                          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Camera size={24} className="text-amber-500 mb-1" />
                          <span className="text-[8px] font-black uppercase">Change Photo</span>
                        </div>
                        
                        {photoPreview && (
                          <button
                            type="button"
                            onClick={() => setShowRemoveConfirm(true)}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg,image/jpg,image/png,image/webp" 
                    onChange={handlePhotoChange}
                  />
                </div>

                {/* Remove Image Confirmation Modal */}
                {showRemoveConfirm && (
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70">
                    <div className={`p-6 rounded-2xl max-w-sm w-full mx-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                      <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Remove Image?</h3>
                      <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Are you sure you want to remove your profile image? This action will delete the image.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowRemoveConfirm(false)}
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:bg-slate-700 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRemoveImage}
                          className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-8 w-full text-center lg:text-left">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Agent Identity</p>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent?.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="font-bold text-lg tracking-tight">{agent?.name || "Agent"}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">ID: {agent?.agentId || 'N/A'}</p>
                </div>

                <nav className="space-y-3 w-full">
                  {[
                    { step: 0, label: 'Personal Info', icon: <User size={14} /> },
                    { step: 1, label: 'Regulatory', icon: <ShieldCheck size={14} /> },
                    { step: 2, label: 'Professional', icon: <Briefcase size={14} /> }
                  ].map((item) => (
                    <button 
                      key={item.label} 
                      type="button" 
                      onClick={() => setCurrentStep(item.step)} 
                      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${currentStep === item.step ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {item.icon}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Form Fields Content */}
            <div className="lg:col-span-8 p-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Step 0: Personal Info */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField name="agentId" label="Agent ID" icon={Hash} placeholder="HGT/2024/HOMOGET/NAME/001" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="name" label="Legal Name" icon={User} placeholder="Enter name as per passport" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="gender" label="Gender" icon={User} type="select" options={["Male", "Female", "Other"]} register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="nationality" label="Nationality" icon={Globe} placeholder="e.g. British" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="phone" label="Contact Number" icon={Smartphone} placeholder="+971..." register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="email" label="Email Address" icon={Mail} type="email" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <div className="md:col-span-2">
                        <InputField name="address" label="Residential Address" icon={MapPin} placeholder="Full address" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      </div>
                    </div>
                  )}

                  {/* Step 1: Regulatory */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField name="emiratesId" label="Emirates ID" icon={CreditCard} placeholder="784-1234-1234567-1" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="reraLicenseNumber" label="RERA License / BRN" icon={ShieldCheck} register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField 
                        name="visaStatus" 
                        label="Visa Category" 
                        icon={ShieldCheck} 
                        type="select" 
                        options={["Employment", "Golden Visa", "Residence", "Partner", "Freelance"]} 
                        register={register} 
                        isEditable={isEditable} 
                        errors={errors} 
                        ct={ct}
                      />
                      <InputField name="role" label="Company Designation" icon={Briefcase} register={register} isEditable={isEditable} errors={errors} ct={ct} />
                    </div>
                  )}

                  {/* Step 2: Professional */}
                  {currentStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField name="experienceYears" label="Total Years Exp" icon={Award} type="number" placeholder="0" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="joiningDate" label="Hiring Date" icon={Calendar} type="date" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="currentSalary" label="Current Salary (AED)" icon={DollarSign} type="number" placeholder="Leave empty if not applicable" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <InputField name="languages" label="Languages" icon={Languages} placeholder="English, Arabic, French" register={register} isEditable={isEditable} errors={errors} ct={ct} />
                      <div className="md:col-span-2">
                        <label className={ct.label}>Professional Skills</label>
                        <textarea 
                          {...register("skills")} 
                          disabled={!isEditable} 
                          className={`w-full p-4 rounded-xl border outline-none font-medium text-sm h-28 transition-all ${ct.input} ${!isEditable && 'opacity-60 cursor-not-allowed'}`} 
                          placeholder="Negotiation, Market Analysis, Bulk Deals..." 
                        />
                        {errors.skills && <span className="text-[9px] text-red-500 font-bold mt-1 block">{errors.skills.message}</span>}
                      </div>
                    </div>
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