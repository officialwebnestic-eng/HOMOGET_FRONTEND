import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";

const GlobalWhatsAppChat = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); // null = main menu
  const isDark = theme === "dark";

  const WHATSAPP_NUMBER = "971585919585"; // Dubai management number

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
  const rentBuyTypes = [...resTypes, ...commTypes]; // combined for Rent/Buy

  // Auto‑show prompt after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

const handlePropertyTypeSelect = (category, propertyType) => {
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
  setIsOpen(false);
  setActiveCategory(null);
};

  const handleBackToMain = () => {
    setActiveCategory(null);
  };

  // Main menu options
  const mainOptions = [
    { label: "Off-Plan", value: "Off-Plan" },
    { label: "Residential", value: "Residential" },
    { label: "Commercial", value: "Commercial" },
    { label: "Rent / Buy", value: "Rent/Buy" },
  ];

  // Sub‑menu options based on active category
  const getSubOptions = () => {
    switch (activeCategory) {
      case "Off-Plan": return offPlanTypes;
      case "Residential": return resTypes;
      case "Commercial": return commTypes;
      case "Rent/Buy": return rentBuyTypes;
      default: return [];
    }
  };

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

      {/* Chat Window – Height managed with vh */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[300px] md:w-[380px] rounded-2xl overflow-hidden shadow-2xl border"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* Header */}
            <div className="bg-amber-500 p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-amber-500 shadow-md">
                    <FiMessageCircle size={20} />
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
              {/* Compliance Highlights (only on main menu) */}
              {!activeCategory && (
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

              {/* Back button when in submenu */}
              {activeCategory && (
                <button
                  onClick={handleBackToMain}
                  className="flex items-center gap-2 text-amber-500 hover:text-amber-600 text-[9px] font-bold uppercase tracking-wider transition-colors mb-1"
                >
                  <FiArrowLeft size={14} /> Back to main menu
                </button>
              )}

              {/* Main Options or Sub‑options */}
              <div className="space-y-2">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider ml-1">
                  {activeCategory ? `Select ${activeCategory} type` : "I am looking for"}
                </p>
                <div className={`grid gap-2 ${!activeCategory ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                  {!activeCategory ? (
                    mainOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleCategorySelect(opt.value)}
                        className="py-2.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border transition-all hover:bg-amber-500 hover:text-black"
                      >
                        {opt.label}
                      </button>
                    ))
                  ) : (
                    getSubOptions().map((type) => (
                      <button
                        key={type}
                        onClick={() => handlePropertyTypeSelect(activeCategory, type)}
                        className="py-2 rounded-lg text-[8px] font-medium uppercase tracking-wide border transition-all hover:bg-amber-500 hover:text-black"
                      >
                        {type}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer WhatsApp Button (direct connection) */}
            <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
              <button
                onClick={() => handlePropertyTypeSelect("General", "all Dubai properties")}
                className="w-full py-3 bg-amber-500 text-black rounded-xl font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-amber-600 transition-all shadow-md"
              >
                <FaWhatsapp size={14} /> Speak to an Expert
              </button>
            </div>
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