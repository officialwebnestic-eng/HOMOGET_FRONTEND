import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { User, Briefcase, Image, Check, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { http } from "../../../axios/axios";
import useGetRole from "../../../hooks/useGetRole";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";
import { motion, AnimatePresence } from "framer-motion";

// Validation schemas remain as you defined them
const stepSchemas = [
  yup.object({
    name: yup.string().required("Full Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required").min(6, "Min 6 characters"),
    phone: yup.string().required("Required").matches(/^[0-9]{10}$/, "Must be 10 digits"),
    address: yup.string().required("Address required"),
    state: yup.string().required("State required"),
    city: yup.string().required("City required"),
    dateOfBirth: yup.date().required("DOB required").max(new Date(), "Invalid date"),
    profilePhoto: yup.mixed().required("Photo required"),
    aadharNumber: yup.string().required("Aadhar required").matches(/^\d{12}$/, "12 digits"),
    panNumber: yup.string().required("PAN required").matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid format"),
  }),
  yup.object({
    previousCompany: yup.string().required("Required"),
    role: yup.string().required("Required"),
    experienceYears: yup.number().typeError("Number required").required().min(0),
    previousSalary: yup.number().typeError("Number required").required().min(0),
    currentSalary: yup.number().typeError("Number required").required().min(0),
    joiningDate: yup.date().required("Required"),
    skills: yup.string().required("Required"),
  }),
];

const AddAgent = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentStep, setCurrentStep] = useState(0);
  const [filePreviews, setFilePreviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { RolesPermessionData } = useGetRole();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(stepSchemas[currentStep]),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    if (currentStep < stepSchemas.length - 1) {
      const isStepValid = await trigger();
      if (isStepValid) setCurrentStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] instanceof File) {
          formData.append(key, data[key]);
        } else if (data[key] instanceof Date) {
          formData.append(key, data[key].toISOString());
        } else {
          formData.append(key, data[key]);
        }
      });

      await http.post("/addagent", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      addToast("Agent onboarded successfully!", "success");
      reset();
      setCurrentStep(0);
      setFilePreviews({});
    } catch (error) {
      addToast(error.response?.data?.message || "Submission failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable Input Component
  const FormField = ({ name, label, type = "text", placeholder, options }) => (
    <div className="flex flex-col gap-1.5">
      <label className={`text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        {label}
      </label>
      {type === "select" ? (
        <select
          {...register(name)}
          className={`px-4 py-3 rounded-xl border transition-all ${
            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
          } focus:ring-2 focus:ring-indigo-500 outline-none`}
        >
          <option value="">Choose {label}</option>
          {options?.map((opt, i) => (
            <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={`px-4 py-3 rounded-xl border transition-all ${
            isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200"
          } focus:ring-2 focus:ring-indigo-500 outline-none`}
        />
      )}
      {errors[name] && <span className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">{errors[name].message}</span>}
    </div>
  );

  return (
    <div className={`min-h-screen p-6 md:p-12 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Stepper Header */}
        <div className="mb-12 flex justify-between items-center max-w-2xl mx-auto">
          {[
            { label: "Personal", icon: <User size={18} /> },
            { label: "Professional", icon: <Briefcase size={18} /> }
          ].map((step, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  currentStep >= i 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                  : isDark ? "bg-slate-800 text-slate-500" : "bg-white text-slate-300"
                }`}>
                  {currentStep > i ? <Check size={20} /> : step.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= i ? "text-indigo-500" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < 1 && <div className={`flex-1 h-[2px] mx-4 rounded-full ${currentStep > i ? "bg-indigo-600" : isDark ? "bg-slate-800" : "bg-slate-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`p-8 md:p-10 rounded-[2.5rem] border shadow-2xl ${
                isDark ? "bg-slate-900 border-slate-800 shadow-black/40" : "bg-white border-white shadow-slate-200/50"
              }`}
            >
              {currentStep === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3 mb-4">
                    <h2 className="text-2xl font-black">Identity Details</h2>
                    <p className="text-slate-500 text-sm">Please provide the agent's legal information as per government IDs.</p>
                  </div>
                  <FormField name="name" label="Full Name" placeholder="John Doe" />
                  <FormField name="email" label="Work Email" type="email" />
                  <FormField name="password" label="Portal Password" type="password" />
                  <FormField name="phone" label="Phone Number" />
                  <FormField name="dateOfBirth" label="Date of Birth" type="date" />
                  <FormField name="aadharNumber" label="Aadhar (12 Digits)" />
                  <FormField name="panNumber" label="PAN Number" />
                  <FormField name="state" label="State" type="select" options={["Maharashtra", "Delhi", "Karnataka", "Gujarat"]} />
                  <FormField name="city" label="City" type="select" options={["Mumbai", "Pune", "Bangalore", "Ahmedabad"]} />
                  
                  {/* Styled File Input */}
                  <div className="lg:col-span-3 mt-4">
                    <label className={`text-sm font-bold mb-2 block ${isDark ? "text-slate-400" : "text-slate-600"}`}>Profile Photo</label>
                    <div className={`relative group h-40 rounded-3xl border-2 border-dashed flex items-center justify-center transition-all ${
                      isDark ? "bg-slate-800/50 border-slate-700 hover:border-indigo-500" : "bg-slate-50 border-slate-200 hover:border-indigo-500"
                    }`}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setValue("profilePhoto", file, { shouldValidate: true });
                            setFilePreviews({ profilePhoto: URL.createObjectURL(file) });
                          }
                        }}
                      />
                      {filePreviews.profilePhoto ? (
                        <img src={filePreviews.profilePhoto} className="h-full w-full object-cover rounded-[1.4rem]" alt="Preview" />
                      ) : (
                        <div className="text-center">
                          <Image className="mx-auto mb-2 text-slate-400" />
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Click to upload photo</p>
                        </div>
                      )}
                    </div>
                    {errors.profilePhoto && <span className="text-rose-500 text-[10px] font-bold">{errors.profilePhoto.message}</span>}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3 mb-4">
                    <h2 className="text-2xl font-black">Professional Profile</h2>
                    <p className="text-slate-500 text-sm">Experience, salary expectations, and core competencies.</p>
                  </div>
                  <FormField name="previousCompany" label="Last Organization" />
                  <FormField 
                    name="role" 
                    label="Designation" 
                    type="select" 
                    options={RolesPermessionData?.map(r => r.roleName)} 
                  />
                  <FormField name="experienceYears" label="Years of Experience" type="number" />
                  <FormField name="previousSalary" label="Last Salary (LPA)" type="number" />
                  <FormField name="currentSalary" label="Expected Salary (LPA)" type="number" />
                  <FormField name="joiningDate" label="Proposed Joining" type="date" />
                  <div className="lg:col-span-3">
                    <FormField name="skills" label="Core Skills" placeholder="React, Node.js, Sales, Negotiation..." />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                currentStep === 0 ? "opacity-0 pointer-events-none" : isDark ? "bg-slate-800 text-white" : "bg-white text-slate-600 shadow-md"
              }`}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/40 disabled:opacity-70"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  {currentStep === 1 ? "Complete Onboarding" : "Next Step"} <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;