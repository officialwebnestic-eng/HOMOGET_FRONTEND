import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, Database, Share2, Lock, UserCheck, 
  Cookie, Mail, MapPin, Clock, FileText, Scale, Globe, AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
 import { privacyenContent, privacyhiContent, privacyarContent } from "../helpers/LegalHelpers";

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');

 

  const content = lang === 'en' ? privacyenContent : (lang === 'hi' ? privacyhiContent : privacyarContent);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* HERO SECTION (unchanged design) */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1920" 
            alt="Dubai Skyline Background" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-slate-950 via-slate-950/80 to-transparent' : 'from-white via-white/80 to-transparent'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col md:flex-row justify-between items-start gap-12">
          
          <motion.div initial="hidden" animate="visible" variants={sectionVariant} className="max-w-3xl text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} /> {content.tag}
            </div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-none mb-6">
              {content.title} <br/>
              <span className="italic font-serif font-light text-amber-600">{content.subtitle}</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-4 max-w-xl">{content.intro}</p>
            <div className="flex items-center gap-2 text-[10px] font-serif  text-slate-400">
              <Clock size={12} /> {content.lastUpdated}
            </div>
          </motion.div>

          <div className="flex bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20 shadow-2xl self-end md:self-start">
            {['en', 'hi', 'ar'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                  lang === l ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-amber-500'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO GRID CONTENT */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
          
          {/* LEFT COLUMN: All policy sections (one large card) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              className="p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm"
            >
              <div className="space-y-10">
                {content.sections.map((section, idx) => (
                  <div key={idx} className={idx !== 0 ? "pt-6 border-t border-slate-200 dark:border-white/10" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      {idx === 0 && <Database size={20} className="text-amber-500" />}
                      {idx === 1 && <Eye size={20} className="text-amber-500" />}
                      {idx === 2 && <Scale size={20} className="text-amber-500" />}
                      {idx === 3 && <Share2 size={20} className="text-amber-500" />}
                      {idx === 4 && <Globe size={20} className="text-amber-500" />}
                      {idx === 5 && <Lock size={20} className="text-amber-500" />}
                      {idx === 6 && <Clock size={20} className="text-amber-500" />}
                      {idx === 7 && <UserCheck size={20} className="text-amber-500" />}
                      {idx === 8 && <Cookie size={20} className="text-amber-500" />}
                      {idx === 9 && <AlertCircle size={20} className="text-amber-500" />}
                      <h2 className="text-lg font-black uppercase italic dark:text-white">{section.title}</h2>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="text-amber-500 font-bold">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Rights & Contact Cards (unchanged design) */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              className="p-10 bg-slate-900 rounded-[3rem] text-white"
            >
              <UserCheck size={32} className="text-amber-500 mb-8" />
              <h3 className="text-xl font-black uppercase italic mb-6">{content.rightsTitle}</h3>
              <div className="space-y-4">
                {content.rights.map((right, idx) => (
                  <div key={idx} className="flex items-center gap-3 pb-3 border-b border-white/5 text-[10px] font-black uppercase text-slate-400">
                    <div className="w-1 h-1 bg-amber-500 rounded-full" />
                    {right}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              className="p-10 bg-amber-600 rounded-[3rem] text-white"
            >
              <h3 className="text-xl font-black uppercase italic mb-6">{content.contactTitle}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="opacity-70 mt-0.5" />
                  <p className="text-xs font-bold break-all">{content.contactEmail}</p>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="opacity-70 mt-0.5" />
                  <p className="text-xs font-bold leading-relaxed">{content.office}</p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="opacity-70 mt-0.5" />
                  <p className="text-xs font-bold">{content.phone}</p>
                </div>
                <div className="flex items-start gap-3">
                  <FileText size={18} className="opacity-70 mt-0.5" />
                  <p className="text-xs font-bold">{content.license}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Scale size={18} className="opacity-70 mt-0.5" />
                  <p className="text-xs font-bold">{content.rera}</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

     
    </main>
  );
};

export default PrivacyPolicy;