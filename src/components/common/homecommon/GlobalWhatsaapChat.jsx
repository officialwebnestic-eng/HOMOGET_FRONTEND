import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageCircle, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";

const GlobalWhatsAppChat = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const isDark = theme === 'dark';

  // Updated to Dubai-based Management Number
  const WHATSAPP_NUMBER = "971585919585";
  // Auto-show prompt after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppRedirect = (interest) => {
    // Requirements updated for Dubai Market Standards (DLD/RERA/Title Deeds)
    const message = `Hi Homoget Dubai Support,\n\nI am interested in ${interest}.\n\nI am specifically looking for properties with:\n- DLD / RERA Compliance\n- Verified Title Deed & [Aadhaar Redacted] Documents\n- Freehold Status\n- ROI / Yield Projections\n\nPlease share available listings in Dubai.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end">
      
      {/* --- FLOATING GREETING PROMPT --- */}
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className={`mb-4 px-5 py-3 rounded-2xl shadow-2xl border text-[10px] font-black uppercase tracking-widest ${
              isDark ? 'bg-neutral-900 text-amber-500 border-white/10' : 'bg-white text-amber-600 border-slate-200'
            }`}
          >
            Looking for Luxury Dubai Assets? 👋
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CHAT WINDOW --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`mb-6 w-[320px] md:w-[380px] rounded-[2.5rem] overflow-hidden shadow-2xl border ${
              isDark ? "bg-neutral-950 border-white/10" : "bg-white border-slate-200"
            }`}
          >
            {/* Header with Homoget Branding Palette */}
            <div className="bg-[#f59e0b] p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-[#f59e0b] shadow-lg">
                    <FiMessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tighter">Homoget Dubai</h4>
                    <span className="text-[9px] font-bold text-black/60 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Support Online
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-black/40 hover:text-black transition-colors">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Content Body: Dubai Centric Terms */}
            <div className={`p-6 space-y-4 max-h-[400px] overflow-y-auto ${isDark ? 'bg-black/40' : 'bg-slate-50'}`}>
              <div className={`p-4 rounded-[1.5rem] rounded-tl-none text-[11px] font-bold leading-relaxed ${
                isDark ? "bg-white/5 text-slate-300" : "bg-white text-slate-600 shadow-sm"
              }`}>
                Welcome to <span className="text-[#f59e0b]">Homoget UAE</span>. 
                <br /><br />
                We provide verified Dubai listings featuring:
                <ul className="mt-2 space-y-1">
                  <li className="flex items-center gap-2"><FiCheckCircle className="text-[#f59e0b]" /> DLD / RERA Registered</li>
                  <li className="flex items-center gap-2"><FiCheckCircle className="text-[#f59e0b]" /> Prime Freehold Locations</li>
                  <li className="flex items-center gap-2"><FiCheckCircle className="text-[#f59e0b]" /> Verified Title Deeds</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Select Interest</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Penthouses", val: "Luxury Penthouses" },
                    { label: "Villas", val: "Elite Dubai Villas" },
                    { label: "Off-Plan", val: "Investment Assets" },
                    { label: "Rentals", val: "High-Yield Rentals" }
                  ].map((btn) => (
                    <button 
                      key={btn.label}
                      onClick={() => handleWhatsAppRedirect(btn.val)}
                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        isDark ? 'border-white/10 hover:bg-[#f59e0b] hover:text-black' : 'border-slate-200 bg-white hover:bg-[#f59e0b] hover:text-white'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer WhatsApp Button */}
            <div className={`p-5 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
              <button 
                onClick={() => handleWhatsAppRedirect("General Dubai Property Search")}
                className="w-full py-5 bg-[#f59e0b] text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#fbbf24] shadow-xl shadow-amber-500/20"
              >
                Connect with Dubai Office <FaWhatsapp size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN ICON (TRIGGER) --- */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
        onClick={() => { setIsOpen(!isOpen); setShowPrompt(false); }}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl relative transition-all ${
          isOpen ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : 'bg-[#f59e0b] text-black'
        }`}
      >
        {isOpen ? <FiX size={28} /> : <FaWhatsapp size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white dark:border-black"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default GlobalWhatsAppChat;