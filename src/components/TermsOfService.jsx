import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, FileCheck, AlertCircle, BadgeDollarSign, 
  Gavel, UserPlus, Ban, ShieldAlert, Clock, 
  Mail, MapPin, Globe, Landmark, ShieldCheck, Briefcase,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
 import { enContent, hiContent, arContent } from "../helpers/LegalHelpers";
 

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};



const TermsOfService = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');

  const content = lang === 'en' ? enContent : (lang === 'hi' ? hiContent : arContent);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* HERO SECTION (unchanged) */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover grayscale-[20%]"
            alt="Dubai Skyline"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/95 via-slate-950/80 to-slate-950' : 'from-white/95 via-white/80 to-white'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-6 relative z-10 w-full">
          <div className="flex justify-end mb-12">
            <div className="flex bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20 shadow-2xl">
              {['en', 'hi', 'ar'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black  transition-all ${
                    lang === l ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-amber-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <motion.div key={lang} initial="hidden" animate="visible" variants={sectionVariant} className="max-w-4xl space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold  tracking-widest">
              <Scale size={14} /> {content.tag}
            </div>
            <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-[0.9]">
              {content.title} <br/>
              <span className="italic font-serif font-light text-amber-600">{content.subtitle}</span>
            </h1>
            <p className="text-base font-serif md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">{content.description}</p>
            <div className="flex items-center gap-2 text-[10px] font-black  text-slate-400 pt-4">
              <Clock size={12} /> {content.lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID – same design, but each card now contains the full legal text */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-6">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-elig`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-7 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <UserPlus className="text-amber-500" />
               <span className="text-[10px] font-black  tracking-widest text-amber-500">{content.eligibility.title}</span>
             </div>
             <p className="text-base md:text-xl font-serif dark:text-white leading-snug whitespace-pre-line">{content.eligibility.text}</p>
          </motion.div>

          <motion.div key={`${lang}-acc`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-5 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
            <ShieldCheck size={40} className="text-amber-500 mb-6" />
            <div>
              <h3 className="text-xl font-black  italic mb-2">{content.account.title}</h3>
              <p className="text-xs font-serif opacity-80  leading-relaxed whitespace-pre-line">{content.account.text}</p>
            </div>
          </motion.div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-list`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-5 p-10 bg-amber-600 rounded-[3rem] text-white">
            <Briefcase size={40} className="mb-6 opacity-50" />
            <h3 className="text-[10px] font-black  tracking-widest mb-2 opacity-80">{content.listings.title}</h3>
            <p className="text-xs font-serif   leading-tight whitespace-pre-line">{content.listings.text}</p>
          </motion.div>

          <motion.div key={`${lang}-fees`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-7 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BadgeDollarSign className="text-amber-500" />
              <span className="text-[10px] f  ont-black  tracking-widest text-amber-500">{content.fees.title}</span>
            </div>
            <p className="text-base text-xl  font-serif dark:text-white leading-snug mb-4 whitespace-pre-line">{content.fees.text}</p>
          </motion.div>
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-comp`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-8 p-10 bg-slate-900 rounded-[3rem] text-white shadow-xl">
             <div className="flex items-center gap-3 mb-8">
               <Landmark className="text-amber-500" />
               <span className="text-[10px] font-black  tracking-widest text-slate-500">{content.compliance.title}</span>
             </div>
             <p className="text-base md:text-xl font-serif leading-relaxed italic  whitespace-pre-line">{content.compliance.text}</p>
          </motion.div>

          <motion.div key={`${lang}-pro`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-4 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5">
             <Ban size={32} className="text-amber-500 mb-6" />
             <p className="text-[10px] font-black  tracking-widest text-slate-400 mb-1">{content.prohibited.title}</p>
             <p className="text-base md:text-xl font-serif dark:text-white italic  leading-tight whitespace-pre-line">{content.prohibited.text}</p>
          </motion.div>
        </div>

        {/* ROW 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-liab`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-6 p-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem]">
             <AlertCircle className="text-amber-500 mb-6" />
             <h3 className="text-[10px] font-black  tracking-widest text-slate-400 mb-2">{content.liability.title}</h3>
             <p className="text-base md:text-xl font-serif  opacity-70 leading-relaxed whitespace-pre-line">{content.liability.text}</p>
          </motion.div>

          <motion.div key={`${lang}-contact`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-6 p-10 bg-slate-900 rounded-[3rem] text-white border-2 border-amber-500/20">
             <Gavel size={32} className="text-amber-500 mb-6" />
             <div className="grid gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-black  tracking-widest text-slate-500 mb-2">{content.contact.title}</p>
                  <p className="text-base md:text-xl font-serif text-amber-500 ">{content.contact.email}</p>
                  <p className="text-base md:text-xl font-serif text-slate-400  mt-1">{content.contact.office}</p>
                  <p className="text-base md:text-xl font-serif text-slate-400  mt-1">{content.contact.phone}</p>
                  <p className="text-base md:text-xl font-serif text-slate-400  mt-1">{content.contact.license}</p>
                </div>
              
             </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
};

export default TermsOfService;