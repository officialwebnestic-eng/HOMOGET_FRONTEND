import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Camera, Shield, X, Info } from "lucide-react";

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
    emiratesId: yup.string().required("Required").matches(/^784-\d{4}-\d{7}-\d{1}$/, "Format: 784-XXXX-XXXXXXX-X"),
    reraLicenseNumber: yup.string().required("RERA BRN required"),
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
  const { RolesPermessionData } = useGetRole();
  const fileInputRef = useRef(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedLangs, setSelectedLangs] = useState(["English"]); // Default

  const { register, handleSubmit, trigger, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onTouched",
    defaultValues: { languages: ["English"] }
  });

  const brandGold = "#C5A059";

  const toggleLanguage = (lang) => {
    const updated = selectedLangs.includes(lang)
      ? selectedLangs.filter(l => l !== lang)
      : [...selectedLangs, lang];
    setSelectedLangs(updated);
    setValue("languages", updated, { shouldValidate: true });
  };

  const handleNext = async () => {
    const fields = ["name", "email", "password", "phone", "address", "nationality", "emiratesId", "reraLicenseNumber", "profilePhoto"];
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep(1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Handle file
      if (data.profilePhoto) formData.append("file", data.profilePhoto);

      // Append all other fields matching Schema
      Object.keys(data).forEach(key => {
        if (key !== "profilePhoto") {
          if (key === 'languages') {
            // Append as array for Mongoose [String]
            data[key].forEach(lang => formData.append("languages[]", lang));
          } else if (key === 'skills') {
            // Convert comma string to array
            const skillsArr = data[key].split(',').map(s => s.trim());
            skillsArr.forEach(s => formData.append("skills[]", s));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      const res = await http.post("/addagent", formData);
      if (res.data.success) {
        addToast("Custodian Registered Successfully", "success");
        reset(); setPreview(null); setSelectedLangs(["English"]); setCurrentStep(0);
      }
    } catch (err) {
      addToast(err.response?.data?.message || "Registry Error", "error");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className={`min-h-screen p-6 md:p-12 ${isDark ? "bg-[#0F1219]" : "bg-slate-50"}`}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield style={{ color: brandGold }} size={18} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Homoget Registry</p>
            </div>
            <h1 className={`${isDark ? 'text-white' : 'text-slate-900'} text-4xl font-black italic tracking-tighter uppercase`}>
              Register <span style={{ color: brandGold }}>Custodian.</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Step {currentStep + 1} of 2</p>
             <div className="w-32 h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-500" style={{ width: currentStep === 0 ? '50%' : '100%', backgroundColor: brandGold }} />
             </div>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className={`p-10 rounded-[3rem] border shadow-2xl ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentStep === 0 ? (
                  <>
                    <div className="md:col-span-2">
                        <Label label="Full Legal Name" />
                        <input {...register("name")} className={InputClass(isDark)} placeholder="As per Passport" />
                        <ErrorMsg error={errors.name} />
                    </div>
                    <div>
                        <Label label="Work Email" />
                        <input {...register("email")} className={InputClass(isDark)} placeholder="alex@homoget.ae" />
                        <ErrorMsg error={errors.email} />
                    </div>
                    <div>
                        <Label label="Portal Password" />
                        <input type="password" {...register("password")} className={InputClass(isDark)} />
                        <ErrorMsg error={errors.password} />
                    </div>
                    <div>
                        <Label label="UAE Contact" />
                        <input {...register("phone")} className={InputClass(isDark)} placeholder="+971" />
                        <ErrorMsg error={errors.phone} />
                    </div>
                    <div>
                        <Label label="Nationality" />
                        <input {...register("nationality")} className={InputClass(isDark)} />
                        <ErrorMsg error={errors.nationality} />
                    </div>
                    <div>
                        <Label label="Emirates ID" />
                        <input {...register("emiratesId")} className={InputClass(isDark)} placeholder="784-XXXX-XXXXXXX-X" />
                        <ErrorMsg error={errors.emiratesId} />
                    </div>
                    <div>
                        <Label label="RERA BRN" />
                        <input {...register("reraLicenseNumber")} className={InputClass(isDark)} placeholder="BRN-XXXXX" />
                        <ErrorMsg error={errors.reraLicenseNumber} />
                    </div>
                    <div className="md:col-span-2">
                        <Label label="Home Address" />
                        <input {...register("address")} className={InputClass(isDark)} />
                        <ErrorMsg error={errors.address} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:col-span-2">
                      <Label label="Languages Spoken" />
                      <div className="flex flex-wrap gap-2 mb-4 p-4 rounded-2xl bg-black/20 border border-white/5 min-h-[50px]">
                        {selectedLangs.map(lang => (
                          <span key={lang} className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C5A059] text-white">
                            {lang} <X size={12} className="cursor-pointer" onClick={() => toggleLanguage(lang)} />
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {DUBAI_MARKET_LANGUAGES.map(lang => (
                          <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                            className={`py-2 rounded-xl text-[9px] font-bold uppercase transition-all border ${
                              selectedLangs.includes(lang) ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]' : 'border-white/5 bg-white/5 text-slate-500'
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                        <Label label="Designation" />
                        <select {...register("role")} className={InputClass(isDark)}>
                           <option value="">Select Role</option>
                           {RolesPermessionData?.map(r => <option key={r._id} value={r.roleName}>{r.roleName}</option>)}
                        </select>
                        <ErrorMsg error={errors.role} />
                    </div>
                    <div>
                        <Label label="Visa Status" />
                        <select {...register("visaStatus")} className={InputClass(isDark)}>
                            <option value="">Select Status</option>
                            <option value="Employment">Employment Visa</option>
                            <option value="Golden Visa">Golden Visa</option>
                            <option value="Residence">Residence</option>
                        </select>
                        <ErrorMsg error={errors.visaStatus} />
                    </div>
                    <div>
                        <Label label="Monthly Target (AED)" />
                        <input type="number" {...register("currentSalary")} className={InputClass(isDark)} />
                        <ErrorMsg error={errors.currentSalary} />
                    </div>
                    <div>
                        <Label label="Experience (Years)" />
                        <input type="number" {...register("experienceYears")} className={InputClass(isDark)} />
                        <ErrorMsg error={errors.experienceYears} />
                    </div>
                    <div>
                        <Label label="Joining Date" />
                        <input type="date" {...register("joiningDate")} className={InputClass(isDark)} />
                        <ErrorMsg error={errors.joiningDate} />
                    </div>
                    <div className="md:col-span-2">
                        <Label label="Specializations (Comma separated)" />
                        <textarea {...register("skills")} className={InputClass(isDark)} rows={2} placeholder="Palm Jumeirah, Luxury Villas..." />
                        <ErrorMsg error={errors.skills} />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <div className={`p-8 rounded-[3rem] border shadow-xl sticky top-6 ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100'}`}>
              <Label label="Registry Portrait" />
              <div onClick={() => fileInputRef.current.click()}
                className="group relative aspect-square rounded-[2rem] border-2 border-dashed border-slate-700 overflow-hidden cursor-pointer hover:border-[#C5A059] transition-all flex items-center justify-center bg-slate-500/5"
              >
                {preview ? <img src={preview} className="w-full h-full object-cover" alt="Preview" /> : <Camera className="text-slate-600" size={32} />}
                <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                  const file = e.target.files[0];
                  if(file) { setValue("profilePhoto", file, { shouldValidate: true }); setPreview(URL.createObjectURL(file)); }
                }} />
              </div>
              <ErrorMsg error={errors.profilePhoto} />
              
              <div className="mt-8 space-y-4">
                {currentStep === 0 ? (
                  <button type="button" onClick={handleNext} style={{ backgroundColor: brandGold }} className="w-full py-5 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-lg">Next: Professional Profile</button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button type="submit" disabled={isSubmitting} style={{ backgroundColor: brandGold }} className="w-full py-5 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.3em] shadow-lg">
                      {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Finalize Agent"}
                    </button>
                    <button type="button" onClick={() => setCurrentStep(0)} className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-2">Back</button>
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

const Label = ({ label }) => <label className="text-[#C5A059] text-[9px] font-black uppercase tracking-[0.2em] mb-2 block">{label}</label>;
const ErrorMsg = ({ error }) => error ? <p className="text-rose-500 text-[9px] font-bold mt-1 uppercase tracking-tighter">{error.message}</p> : null;
const InputClass = (isDark) => `w-full p-4 rounded-2xl border outline-none transition-all text-xs font-bold ${isDark ? "bg-[#0F1219] border-white/5 text-white focus:border-[#C5A059]/50" : "bg-white border-slate-100 text-slate-900 focus:border-[#C5A059]"}`;

export default AddAgent;