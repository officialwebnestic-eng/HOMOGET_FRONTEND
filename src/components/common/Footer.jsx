import React, { useState } from "react";
import { Send, ArrowUpRight, Sparkles, ShieldCheck, Building2, Award } from "lucide-react";
import { motion } from "framer-motion";
import { navbarlogo } from "../../ExportImages"; 
import { useTheme } from "../../context/ThemeContext";
import { socialLinks, companyLinks, resourcesLinks, discoverLinksNew, complianceItems } from "../../helpers/Footerhelpers";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const brandColor = "#f59e0b"; // Amber-500

  const colors = {
    brand: brandColor,
    bg: isDark ? "bg-[#0a0a0c]" : "bg-slate-50",
    card: isDark ? "bg-[#11141B]" : "bg-white",
    text: isDark ? "text-slate-400" : "text-slate-500",
    textLight: isDark ? "text-slate-500" : "text-slate-400",
    heading: isDark ? "text-white" : "text-slate-800",
    border: isDark ? "border-white/10" : "border-slate-200",
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      console.log("Newsletter subscription:", email);
      setEmail("");
      alert("Thank you for subscribing to our newsletter!");
    }
  };

  return (
    <footer className={`${colors.bg} border-t ${colors.border} pt-16 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- 1. CALL TO ACTION SECTION --- */}
        <div className="relative mb-16 p-8 md:p-10 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 blur-[100px] rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to find your dream home?</h2>
              <p className="text-slate-300 text-sm">Connect with Dubai's most trusted real estate advisors.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-amber-500 text-black font-bold uppercase tracking-wider text-xs rounded-xl flex items-center gap-2 shadow-lg hover:bg-amber-600 transition-all"
            >
              Get Started <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* --- 2. MAIN GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img src={navbarlogo} alt="Logo" className="w-12 h-12 object-contain" />
              <div>
                <h3 className="text-xl font-bold tracking-tight leading-none text-white uppercase">HOMOGET</h3>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-amber-500">Dubai Real Estate</span>
              </div>
            </div>
            <p className={`text-sm leading-relaxed max-w-sm ${colors.text}`}>
              The ultimate gateway to Dubai's premium real estate market. Regulated by RERA, driven by transparency, and powered by AI.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.name} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }} 
                  className="w-9 h-9 rounded-full border border-slate-700 flex items-center justify-center text-slate-500 hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Discover Links */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${colors.heading} mb-4`}>Discover</h4>
            <ul className="space-y-2">
              {discoverLinksNew?.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={`text-xs ${colors.text} hover:text-amber-500 transition-colors`}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${colors.heading} mb-4`}>Company</h4>
            <ul className="space-y-2">
              {companyLinks?.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={`text-xs ${colors.text} hover:text-amber-500 transition-colors`}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${colors.heading} mb-4`}>Resources</h4>
            <ul className="space-y-2">
              {resourcesLinks?.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={`text-xs ${colors.text} hover:text-amber-500 transition-colors`}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-2">
            <div className={`p-5 rounded-xl border ${colors.card} ${colors.border}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${colors.heading} mb-1`}>Market Insights</h4>
              <p className="text-[10px] text-slate-500 mb-4">Weekly Dubai market trends & investment alerts.</p>
              <form onSubmit={handleNewsletterSubmit} className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 px-3 text-xs focus:border-amber-500 outline-none transition-all text-white placeholder:text-slate-500"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-amber-500 text-black rounded-md flex items-center justify-center hover:bg-amber-600 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- 3. REGULATORY COMPLIANCE BAR --- */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-5 py-8 border-t border-b ${colors.border}`}>
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-amber-500" />
            <div>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Regulatory Authority</p>
              <p className="text-xs font-bold">RERA ORN: 52933</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 size={18} className="text-amber-500" />
            <div>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Commercial License</p>
              <p className="text-xs font-bold">1523268 | DET Approved</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award size={18} className="text-amber-500" />
            <div>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">DLD Registered</p>
              <p className="text-xs font-bold">Dubai Land Department</p>
            </div>
          </div>
        </div>

        {/* --- 4. LEGAL & COPYRIGHT --- */}
        <div className="py-10">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-[9px] leading-relaxed text-slate-500 uppercase tracking-tight italic">
                Disclaimer: Property information is sourced from EJARI and the Dubai Land Department. Homoget Properties LLC (SOC) is not responsible for legal liabilities arising from third-party information. All investments are subject to market risks. Permit valid as of {new Date().getFullYear()}.
              </p>
            </div>
            <div className="flex flex-wrap gap-5 items-center">
              <a href="/privacy-policy" className="text-[9px] font-bold text-slate-400 hover:text-amber-500 transition-colors">PRIVACY POLICY</a>
              <a href="/terms-of-service" className="text-[9px] font-bold text-slate-400 hover:text-amber-500 transition-colors">TERMS OF SERVICE</a>
              <a href="/rera-compliance" className="text-[9px] font-bold text-slate-400 hover:text-amber-500 transition-colors">RERA COMPLIANCE</a>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between text-slate-500 text-[9px] font-medium">
            <p>© {new Date().getFullYear()} HOMOGET PROPERTIES L.L.C S.O.C. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SYSTEM STATUS: OPERATIONAL (DUBAI REGION)</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;