import React, { useState } from "react";
import {
  Mail, Send, MapPin, Phone, ChevronRight, 
  Instagram, Linkedin, Facebook, Youtube, 
  ExternalLink, ShieldCheck, BadgeCheck, Building2,
  ArrowUpRight, Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { navbarlogo } from "../../ExportImages"; 
import { useTheme } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Dubai-specific accents (Gold & Deep Navy)
  const colors = {
    brand: "#C5A059", // Dubai Gold
    bg: isDark ? "bg-[#020617]" : "bg-slate-50",
    card: isDark ? "bg-slate-900/50" : "bg-white",
    text: isDark ? "text-slate-400" : "text-slate-600",
    heading: isDark ? "text-white" : "text-slate-900",
  };

  return (
    <footer className={`${colors.bg} border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} pt-20 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- 1. CALL TO ACTION SECTION --- */}
        <div className="relative mb-20 p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Ready to find your dream home?</h2>
              <p className="text-slate-400 text-lg">Connect with Dubai's most trusted real estate advisors.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#C5A059] text-black font-black uppercase tracking-widest text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-amber-900/20"
            >
              Get Started <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* --- 2. MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <img src={navbarlogo} alt="Logo" className="w-14 h-14 grayscale brightness-200" />
              <div>
                <h3 className="text-xl font-black tracking-tighter leading-none text-white">HOMOGET</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C5A059]">Dubai Real Estate</span>
              </div>
            </div>
            <p className={`${colors.text} leading-relaxed max-w-sm`}>
              The ultimate gateway to Dubai's premium real estate market. Regulated by RERA, driven by transparency, and powered by AI.
            </p>
            <div className="flex gap-4">
              {[Instagram, Linkedin, Facebook, Youtube].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ y: -4, color: '#C5A059' }} className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-500">
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className={`text-sm font-black uppercase tracking-widest ${colors.heading} mb-6`}>Discover</h4>
            <ul className="space-y-4">
              {['Buy Properties', 'Sell Property', 'Rent Homes', 'Off-Plan Projects'].map((item) => (
                <li key={item}><a href="#" className={`text-sm ${colors.text} hover:text-white transition-colors`}>{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className={`text-sm font-black uppercase tracking-widest ${colors.heading} mb-6`}>Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Contact', 'Market News', 'Help Center'].map((item) => (
                <li key={item}><a href="#" className={`text-sm ${colors.text} hover:text-white transition-colors`}>{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <div className={`p-6 rounded-3xl ${colors.card} border ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h4 className={`text-sm font-black uppercase tracking-widest ${colors.heading} mb-2`}>Market Insights</h4>
              <p className="text-xs text-slate-500 mb-6">Weekly Dubai market trends & investment alerts.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your Email Address" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-5 text-sm focus:border-[#C5A059] outline-none transition-all"
                />
                <button className="absolute right-2 top-2 w-10 h-10 bg-[#C5A059] text-black rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- 3. REGULATORY COMPLIANCE BAR --- */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-t border-b ${isDark ? 'border-slate-900' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">RERA Licensed</p>
              <p className="text-sm font-bold">Registration: 123456</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">DLD Compliance</p>
              <p className="text-sm font-bold">Trakheesi Permit: 78910</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Headquarters</p>
              <p className="text-sm font-bold">Business Bay, Dubai, UAE</p>
            </div>
          </div>
        </div>

        {/* --- 4. LEGAL & COPYRIGHT --- */}
        <div className="py-12">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-[10px] leading-relaxed text-slate-500 uppercase tracking-tight">
                Disclaimer: Property information is sourced from EJARI and the Dubai Land Department. Homoget Properties LLC (SOC) is not responsible for legal liabilities arising from third-party information. All investments are subject to market risks. Permit valid as of {new Date().toLocaleDateString()}.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#C5A059]">PRIVACY POLICY</a>
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#C5A059]">TERMS OF SERVICE</a>
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-[#C5A059]">RERA COMPLIANCE</a>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-slate-600 text-[10px] font-bold">
            <p>© {new Date().getFullYear()} HOMOGET PROPERTIES L.L.C S.O.C. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               SYSTEM STATUS: OPERATIONAL (DUBAI REGION)
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;