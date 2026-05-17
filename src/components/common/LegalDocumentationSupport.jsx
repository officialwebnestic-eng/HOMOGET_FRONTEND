import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DocumentTextIcon, ShieldCheckIcon, LockClosedIcon, 
  EnvelopeIcon, PhoneIcon, 
  ArrowUpRightIcon 
} from "@heroicons/react/24/outline";

const LegalDocumentationHub = () => {
  const { theme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const isDark = theme === "dark";

  const legalCards = [
    {
      title: "Terms of Service",
      desc: "Standardized protocols for digital asset management and user liability.",
      icon: <DocumentTextIcon className="w-6 h-6" />,
      color: "blue",
      stats: "Ver. 4.2.0"
    },
    {
      title: "Privacy Protocol",
      desc: "End-to-end AES-256 encryption standards for all transaction metadata.",
      icon: <LockClosedIcon className="w-6 h-6" />,
      color: "teal",
      stats: "Secure"
    },
    {
      title: "Regulatory Compliance",
      desc: "Local and international real estate law alignment for 2025.",
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      color: "indigo",
      stats: "Compliant"
    }
  ];

  return (
    <div className={`min-h-screen p-8 transition-colors duration-500 ${isDark ? "bg-[#050505] text-white" : "bg-[#f8fafc] text-slate-900"}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- TOP NAVIGATION / HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-60">Legal Operations Center</span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter">
              Governance <span className="opacity-30">&</span> Security
            </h1>
          </div>
          <div className={`px-6 py-3 rounded-full border text-xs font-bold ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
            System Status: <span className="text-emerald-500">Active</span>
          </div>
        </div>

        {/* --- MAIN BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* HERO CARD (Main Focus) */}
          <motion.div 
            className={`md:col-span-8 p-10 rounded-[2.5rem] border relative overflow-hidden group
              ${isDark ? "bg-gradient-to-br from-white/10 to-transparent border-white/10" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}
          >
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex p-4 rounded-2xl bg-blue-600 text-white mb-8">
                  <ShieldCheckIcon className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-bold mb-4 leading-tight max-w-md">
                  Protection of sensitive transaction data is our <span className="text-blue-600">Primary Directive.</span>
                </h2>
                <p className="opacity-60 max-w-sm text-sm">
                  Our legal framework is built on a foundation of transparency, providing clear guidelines for every stakeholder in the real estate ecosystem.
                </p>
              </div>
              
              <div className="mt-12 flex gap-4">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2">
                  View Full Terms <ArrowUpRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
              <ShieldCheckIcon className="w-64 h-64" />
            </div>
          </motion.div>

          {/* SIDEBAR CARDS */}
          <div className="md:col-span-4 grid gap-6">
            {legalCards.map((card, idx) => (
              <motion.div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer
                  ${isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border-slate-200 hover:border-blue-200 shadow-sm"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                    {card.icon}
                  </div>
                  <span className="text-[9px] font-black py-1 px-2 rounded bg-blue-500/10 text-blue-500 uppercase tracking-widest">
                    {card.stats}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{card.title}</h3>
                <p className="text-xs opacity-50 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* LOWER GRID: SUPPORT & CONTACT */}
          <div className={`md:col-span-4 p-8 rounded-[2rem] border flex flex-col justify-center
            ${isDark ? "bg-blue-600 text-white border-transparent" : "bg-slate-900 text-white border-transparent shadow-2xl"}`}>
            <h4 className="text-xl font-bold mb-2">Legal Help Desk</h4>
            <p className="text-sm opacity-70 mb-6">Need expert clarification on documentation? Our legal team is available 24/7.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <EnvelopeIcon className="w-5 h-5 opacity-60" /> legal@ops.hub
              </div>
              <div className="flex items-center gap-3 text-sm">
                <PhoneIcon className="w-5 h-5 opacity-60" /> +1-800-LAW-PRO
              </div>
            </div>
          </div>

          <div className={`md:col-span-8 p-8 rounded-[2rem] border overflow-hidden relative
            ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
            <div className="flex flex-col md:flex-row justify-between items-center h-full">
              <div className="mb-4 md:mb-0">
                <h4 className="text-xl font-bold">Global Infrastructure</h4>
                <p className="text-sm opacity-50">Legal data is mirrored across 12 secure nodes.</p>
              </div>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-12 w-12 rounded-full border-4 flex items-center justify-center text-[10px] font-bold
                    ${isDark ? "bg-slate-800 border-[#050505]" : "bg-slate-100 border-white"}`}>
                    NODE {i}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center opacity-40 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2025 Protocol Legal Systems Inc.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span>Security Audited</span>
            <span>GDPR Ready</span>
            <span>ISO 27001</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LegalDocumentationHub;