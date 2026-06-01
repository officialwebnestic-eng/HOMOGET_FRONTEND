import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiMessageCircle, FiCheckCircle, FiArrowLeft,
  FiUpload, FiFileText, FiUser, FiMail, FiPhone, FiBriefcase,
  FiAlertCircle, FiStar, FiThumbsUp, FiThumbsDown
} from "react-icons/fi";
import { FaWhatsapp, FaLinkedin, FaRegBuilding } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";

const GlobalWhatsAppChat = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeSection, setActiveSection] = useState(null); // 'inquiry', 'careers', 'complaints'
  const [activeCategory, setActiveCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    experience: "",
    message: "",
    referenceId: "",
    complaintType: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const isDark = theme === "dark";

  const WHATSAPP_NUMBER = "971585919585";
  const HR_WHATSAPP = "971585919585";
  const SUPPORT_WHATSAPP = "971585919585";

  // Auto-show prompt after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Property type enums
  const resTypes = [
    "Apartments", "Bulk Units", "Bungalow", "Compound", "Duplex",
    "Hotel Apartment", "Penthouse", "Townhouse", "Villa", "Whole Building"
  ];
  const commTypes = [
    "Business Center", "Coworking Space", "Factory", "Farm", "Full Floor",
    "Half Floor", "Labor Camp", "Land", "Office Space", "Retail", "Shop",
    "Showroom", "Staff Accommodation", "Warehouse", "Whole Building"
  ];
  const offPlanTypes = ["Apartments", "Villas", "Townhouses", "Penthouses", "Land"];
  const rentBuyTypes = [...resTypes, ...commTypes];

  // Career types
  const careerTypes = [
    "Property Consultant / Agent",
    "Telecaller / Lead Generator",
    "Digital Marketer / SEO",
    "Admin & Operations",
    "Other"
  ];

  // Complaint types
  const complaintTypes = [
    "Listing Issue",
    "Agent Behavior",
    "Transaction / Payment Issue",
    "Tech & Website Bug",
    "General Feedback",
    "Other"
  ];

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    setActiveCategory(null);
    setShowForm(false);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // Only show form layout directly for careers and complaints
    if (activeSection === "careers" || activeSection === "complaints") {
      setShowForm(true);
    } else {
      setShowForm(false); // Inquiries display property sub-types first
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCareerSubmit = () => {
    const message = `📋 *NEW JOB APPLICATION - Homoget Dubai*\n\n` +
      `*Position:* ${activeCategory}\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Dubai Experience:* ${formData.experience || "Not specified"}\n` +
      `*Additional Message:* ${formData.message || "None"}\n\n` +
      `📎 CV attached (sent separately)\n\n` +
      `_Application submitted via Homoget Website_`;

    window.open(`https://wa.me/${HR_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
    resetForm();
  };

  const handleComplaintSubmit = () => {
    const message = `⚠️ *COMPLAINT / FEEDBACK - Homoget Dubai*\n\n` +
      `*Type:* ${activeCategory}\n` +
      `*Reference ID / Property:* ${formData.referenceId || "Not provided"}\n` +
      `*Description:* ${formData.message || "No description provided"}\n\n` +
      `${selectedFile ? `📎 Attachment: ${selectedFile.name}\n` : ""}` +
      `_Submitted via Homoget Website_`;

    window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
    resetForm();
  };

  const handleInquirySubmit = (category, propertyType) => {
    let message = "";
    const greeting = "✨ Hello Homoget Concierge,\n\n";
    const closing = "\n\n📌 Could you please share the latest portfolio and schedule a quick call? I'm ready to invest.\n\nThank you!";

    if (category === "Off-Plan") {
      message = `${greeting}I am excited to explore *Off‑Plan* opportunities in Dubai, especially *${propertyType}* projects.\n\n` +
        `🔍 I’m looking for:\n` +
        `✅ DLD / RERA approved developments\n` +
        `✅ Verified title deeds & secure escrow\n` +
        `✅ Flexible payment plans & attractive post‑handover options\n` +
        `✅ High ROI projections & capital appreciation trends\n\n` +
        `Could you share the latest off‑plan launches matching this criteria?${closing}`;
    }
    else if (category === "Residential") {
      message = `${greeting}I am interested in purchasing a *Residential* property in Dubai – specifically a *${propertyType}*.\n\n` +
        `🏡 My priorities are:\n` +
        `✅ DLD / RERA compliant transaction\n` +
        `✅ Freehold ownership in prime communities\n` +
        `✅ Verified title deed & legal transparency\n` +
        `✅ Family‑friendly amenities and investment potential\n\n` +
        `Please share the best available options.${closing}`;
    }
    else if (category === "Commercial") {
      message = `${greeting}I am looking for a *Commercial* asset in Dubai – specifically *${propertyType}*.\n\n` +
        `🏢 My requirements:\n` +
        `✅ Fully compliant with DLD / RERA regulations\n` +
        `✅ Prime location (DIFC, Downtown, Business Bay, etc.)\n` +
        `✅ Verified title deed & clear ownership\n` +
        `✅ Strong ROI projections & tenant demand\n\n` +
        `Kindly send me the latest commercial listings.${closing}`;
    }
    else {
      message = `${greeting}I am interested in *${propertyType}* (either Rent or Buy).\n\n` +
        `💎 I seek:\n` +
        `✅ DLD / RERA compliant process\n` +
        `✅ Verified title deed & transparent documentation\n` +
        `✅ Freehold or long‑term leasehold options\n` +
        `✅ Competitive pricing & clear fee structure\n\n` +
        `Please share available units and arrange a viewing if possible.${closing}`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    resetForm();
  };

  const resetForm = () => {
    setActiveSection(null);
    setActiveCategory(null);
    setShowForm(false);
    setIsOpen(false);
    setFormData({
      name: "", phone: "", email: "", experience: "",
      message: "", referenceId: "", complaintType: ""
    });
    setSelectedFile(null);
  };

  const handleBackToMain = () => {
    setActiveSection(null);
    setActiveCategory(null);
    setShowForm(false);
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setShowForm(false);
  };

  // Main menu options
  const mainOptions = [
    { label: "🏠 Property Inquiry", value: "inquiry", icon: <FiMessageCircle size={14} /> },
    { label: "💼 Careers", value: "careers", icon: <FiBriefcase size={14} /> },
    { label: "⚠️ Complaints & Feedback", value: "complaints", icon: <FiAlertCircle size={14} /> },
  ];

  const getSubOptions = () => {
    if (activeSection === "inquiry") {
      return [
        { label: "Off-Plan", value: "Off-Plan" },
        { label: "Residential", value: "Residential" },
        { label: "Commercial", value: "Commercial" },
        { label: "Rent / Buy", value: "Rent/Buy" },
      ];
    } else if (activeSection === "careers") {
      return careerTypes;
    } else if (activeSection === "complaints") {
      return complaintTypes;
    }
    return [];
  };

  const getFormFields = () => {
    if (activeSection === "careers") {
      return (
        <>
          <div className="space-y-3">
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Contact Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder="+971 XX XXX XXXX"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="john@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Dubai Experience (Years)</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleFormChange}
                placeholder="e.g., 3+ years in Real Estate"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Upload CV / Resume</label>
              <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-amber-500/5 transition-all">
                <input type="file" id="cv-upload" hidden accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center">
                  <FiUpload size={16} className="text-amber-500" />
                  <span className="text-[8px] text-slate-400 mt-1">
                    {selectedFile ? selectedFile.name : "Click to upload CV"}
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Additional Message / About Yourself</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows="3"
                placeholder="Tell us about your experience, skills, preferred job role..."
                className="w-full px-3 py-2 rounded-lg text-[11px] border focus:ring-2 focus:ring-amber-500 outline-none resize-none bg-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCareerSubmit}
              className="flex-1 py-2 bg-amber-500 text-black rounded-lg font-bold text-[9px] uppercase tracking-wider hover:bg-amber-600 transition-all"
            >
              Submit Application
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${HR_WHATSAPP}?text=Hello%20HR%20Team,%20I'm%20interested%20in%20the%20${encodeURIComponent(activeCategory)}%20position`)}
              className="flex-1 py-2 border border-amber-500 text-amber-500 rounded-lg font-bold text-[9px] uppercase tracking-wider hover:bg-amber-500/10 transition-all"
            >
              Speak to HR
            </button>
          </div>
        </>
      );
    } else if (activeSection === "complaints") {
      return (
        <>
          <div className="space-y-3">
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Reference ID / Property Title (Optional)</label>
              <input
                type="text"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleFormChange}
                placeholder="e.g., HMG-2025-00123"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Upload Screenshot / Document (Optional)</label>
              <div className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-amber-500/5 transition-all">
                <input type="file" id="complaint-file" hidden accept="image/*,.pdf" onChange={handleFileChange} />
                <label htmlFor="complaint-file" className="cursor-pointer flex flex-col items-center">
                  <FiUpload size={16} className="text-amber-500" />
                  <span className="text-[8px] text-slate-400 mt-1">
                    {selectedFile ? selectedFile.name : "Click to upload evidence"}
                  </span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-[8px] font-bold uppercase text-slate-500 block mb-1">Describe Your Issue *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows="4"
                placeholder="Please explain your issue in detail..."
                className="w-full px-3 py-2 rounded-lg text-[11px] border focus:ring-2 focus:ring-amber-500 outline-none resize-none bg-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleComplaintSubmit}
              className="flex-1 py-2 bg-amber-500 text-black rounded-lg font-bold text-[9px] uppercase tracking-wider hover:bg-amber-600 transition-all"
            >
              Submit Complaint
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${SUPPORT_WHATSAPP}?text=Hello%20Support%20Team,%20I%20need%20assistance%20with%20${encodeURIComponent(activeCategory)}`)}
              className="flex-1 py-2 border border-amber-500 text-amber-500 rounded-lg font-bold text-[9px] uppercase tracking-wider hover:bg-amber-500/10 transition-all"
            >
              Contact Support
            </button>
          </div>
        </>
      );
    }
    return null;
  };

  const getPropertyTypeOptions = () => {
    if (activeCategory === "Off-Plan") return offPlanTypes;
    if (activeCategory === "Residential") return resTypes;
    if (activeCategory === "Commercial") return commTypes;
    if (activeCategory === "Rent/Buy") return rentBuyTypes;
    return [];
  };

  const inputClass = `w-full px-3 py-2 rounded-lg text-[11px] border focus:ring-2 focus:ring-amber-500 outline-none ${
    isDark ? "bg-[#1A1F2B] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
  }`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">

      {/* Floating Greeting Prompt */}
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`mb-3 px-4 py-2 rounded-xl shadow-lg border text-[9px] font-bold uppercase tracking-wider ${
              isDark ? "bg-neutral-900 text-amber-500 border-white/10" : "bg-white text-amber-600 border-slate-200"
            }`}
          >
            Need help? Ask our team 👋
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`mb-4 w-[350px] md:w-[420px] rounded-2xl overflow-hidden shadow-2xl border ${
              isDark ? "bg-neutral-950 border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="bg-amber-500 p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-amber-500 shadow-md">
                    <FaRegBuilding size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight">Homoget Dubai</h4>
                    <span className="text-[8px] font-bold text-black/70 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Online
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-black/50 hover:text-black transition-colors">
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className={`p-4 space-y-3 overflow-y-auto ${isDark ? "bg-black/40" : "bg-slate-50"}`} style={{ maxHeight: "calc(100vh - 200px)" }}>

              {/* Fixed Back button routing logic */}
              {(activeSection || activeCategory) && (
                <button
                  onClick={activeSection === "inquiry" && activeCategory ? handleBackToCategories : handleBackToMain}
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-600 text-[9px] font-bold uppercase tracking-wider transition-colors mb-1"
                >
                  <FiArrowLeft size={14} /> Back to {activeSection === "inquiry" && activeCategory ? "categories" : "main menu"}
                </button>
              )}

              {/* Compliance Highlights */}
              {!activeSection && (
                <div className={`p-3 rounded-xl rounded-tl-none text-[10px] font-medium leading-relaxed ${
                  isDark ? "bg-white/5 text-slate-300" : "bg-white text-slate-600 shadow-sm"
                }`}>
                  We provide verified Dubai listings with:
                  <ul className="mt-1 space-y-0.5">
                    <li className="flex items-center gap-1.5 text-[9px]"><FiCheckCircle className="text-amber-500" size={12} /> DLD / RERA Registered</li>
                    <li className="flex items-center gap-1.5 text-[9px]"><FiCheckCircle className="text-amber-500" size={12} /> Prime Freehold Locations</li>
                    <li className="flex items-center gap-1.5 text-[9px]"><FiCheckCircle className="text-amber-500" size={12} /> Verified Title Deeds</li>
                  </ul>
                </div>
              )}

              {/* Main Menu */}
              {!activeSection && (
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider ml-1">How can we help you?</p>
                  <div className="grid gap-2">
                    {mainOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSectionSelect(opt.value)}
                        className={`flex items-center justify-between py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-amber-500 hover:text-black group ${
                          isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {opt.icon}
                          {opt.label}
                        </span>
                        <FiArrowLeft size={12} className="opacity-0 group-hover:opacity-100 transition-all rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Selection */}
              {activeSection && !activeCategory && (
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider ml-1">
                    {activeSection === "inquiry" ? "I am looking for" :
                      activeSection === "careers" ? "Select career type" : "Select complaint type"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {getSubOptions().map((opt) => (
                      <button
                        key={typeof opt === 'object' ? opt.value : opt}
                        onClick={() => handleCategorySelect(typeof opt === 'object' ? opt.value : opt)}
                        className={`py-2.5 px-3 rounded-lg text-[8px] font-bold uppercase tracking-wider border transition-all hover:bg-amber-500 hover:text-black text-center ${
                          isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-700"
                        }`}
                      >
                        ={typeof opt === 'object' ? opt.label : opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Type Sub-Options Menu List */}
              {activeSection === "inquiry" && activeCategory && !showForm && (
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider ml-1">
                    Select {activeCategory} type
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {getPropertyTypeOptions().map((type) => (
                      <button
                        key={type}
                        onClick={() => handleInquirySubmit(activeCategory, type)}
                        className={`py-2 px-3 rounded-lg text-[8px] font-medium uppercase tracking-wide border transition-all hover:bg-amber-500 hover:text-black text-center ${
                          isDark ? "border-white/10 text-white" : "border-slate-200 text-slate-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Forms Layout Container */}
              {showForm && getFormFields()}

            </div>

            {/* Footer WhatsApp Button */}
            {!activeSection && (
              <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                <button
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Homoget%20Team,%20I%20need%20assistance%20with%20my%20property%20inquiry`)}
                  className="w-full py-3 bg-amber-500 text-black rounded-xl font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-md"
                >
                  <FaWhatsapp size={14} /> Speak to an Expert
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Icon Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); setShowPrompt(false); }}
        className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-2xl relative transition-all ${
          isOpen ? (isDark ? "bg-white text-black" : "bg-black text-white") : "bg-amber-500 text-black"
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FaWhatsapp size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border border-white dark:border-black"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default GlobalWhatsAppChat;