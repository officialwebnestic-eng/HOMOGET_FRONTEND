import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ShieldCheck, Gem, MapPin, Compass, Briefcase,
  ArrowUpRight, Target, Users2, FileText, Scale, Landmark,
  ChevronDown, HelpCircle, Info,Award ,Globe, Star
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { content } from '../../helpers/AboutHelpers';


const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FaqItem = ({ question, answer, isOpen, onClick, isDark }) => {
  return (
    <div className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'} last:border-0`}>
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between gap-4 text-start group"
      >
        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-amber-500 transition-colors`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-amber-500 shrink-0"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-500 leading-relaxed text-sm md:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const FounderCard = ({ name, role, image, description, achievements, isDark }) => {
  return (
    <motion.div
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      className={`group p-6 rounded-[2rem] transition-all duration-500 h-full ${
        isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white'
      } border shadow-sm hover:shadow-xl`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Founder Image */}
        <div className="relative flex-shrink-0 mb-6">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-white">{name.charAt(0)}</span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
            <Award size={16} className="text-white" />
          </div>
        </div>

        {/* Founder Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">{name}</h3>
            <p className="text-amber-500 font-black uppercase text-[9px] tracking-widest mt-1">{role}</p>
          </div>
          
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {description}
          </p>

          {/* Achievements */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-medium">{achievement}</span>
              </div>
            ))}
          </div>

          {/* Social/Location Badge */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Globe size={12} className="text-amber-500" />
            <span className="text-[10px] opacity-60">Based in Dubai, UAE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';  
  const [lang, setLang] = useState('en');
  const [openFaq, setOpenFaq] = useState(null);

 

  const t = content[lang];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
            className="w-full h-full object-cover grayscale-[30%]"
            alt="Dubai Skyline"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/90 via-slate-950/60 to-slate-950' : 'from-white/90 via-white/60 to-white'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex justify-end mb-16">
            <div className="flex bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20">
              {['en', 'hi', 'ar'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-amber-500'
                    }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial="hidden" animate="visible" variants={sectionVariant} className="max-w-4xl space-y-8 text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              <Gem size={14} /> {t.heroTag}
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              {t.heroTitle} <br />
              <span className="italic font-serif font-light text-amber-600">{t.heroSkyline}</span> <br />
              {t.heroOfTrust}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl">{t.heroPara}</p>

            <div className="flex flex-wrap gap-12 pt-8">
              <div className="text-start">
                <p className="text-5xl font-black text-amber-500">12+</p>
                <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">{t.yearsLabel}</p>
              </div>
              <div className="text-start">
                <p className="text-5xl font-black text-amber-500">AED 5B+</p>
                <p className="text-[10px] uppercase font-bold opacity-60 tracking-widest">{t.assetsLabel}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
     {/* 3. FOUNDERS SECTION - HORIZONTAL LAYOUT */}
<motion.div
  variants={sectionVariant}
  initial="hidden"
  whileInView="visible"
  className="py-12"
>
  <div className="text-center mb-12">
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full mb-4">
      <Users2 size={14} className="text-amber-500" />
      <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Leadership</span>
    </div>
    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{t.foundersTitle || "The Visionaries Behind HomoGet"}</h2>
    <p className="text-slate-500 mt-2 max-w-2xl mx-auto">{t.foundersSub || "Meet the leaders shaping Dubai's real estate future"}</p>
  </div>

  {/* Horizontal Grid Layout - Side by Side */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {/* Founder Card - Prashant Singh */}
    <FounderCard
      name={t.founderName || "Prashant Singh"}
      role={t.founderRole || "Founder & CEO"}
      image={t.founderimage}
      description={t.founderDesc || "A visionary entrepreneur with over 12+ years of experience in Dubai's luxury real estate market. Prashant Singh founded HomoGet with a mission to democratize property acquisition and bring transparency to the UAE real estate sector. Under his leadership, HomoGet has grown into a trusted brokerage firm managing over AED 5B+ in assets."}
      achievements={t.founderAchievements || ["12+ Years Experience", "AED 5B+ Assets Managed", "RERA Certified", "Industry Pioneer"]}
      isDark={isDark}
    />

    {/* Co-Founder Card - Anjali Singh */}
    <FounderCard
      name={t.coFounderName || "Anjali Singh"}
      role={t.coFounderRole || "Co-Founder & Managing Director"}
      image={t.coFounderimage}
      description={t.coFounderDesc || "Anjali Singh brings a unique blend of operational excellence and customer-centric innovation to HomoGet. With a background in international business and client relations, she has been instrumental in building HomoGet's reputation for white-glove service. Anjali oversees the company's strategic partnerships, compliance framework, and client experience initiatives."}
      achievements={t.coFounderAchievements || ["Operations Expert", "Client Relations Specialist", "Global Partnership Leader", "Compliance Champion"]}
      isDark={isDark}
    />
  </div>
</motion.div>

      {/* 2. BENTO CONTENT GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-8 text-start">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-8 p-10 rounded-[3rem] bg-slate-900 text-white border border-slate-800 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl font-bold">{t.narrativeTitle}</h2>
              <p className="text-slate-400 text-lg leading-relaxed">{t.narrativePara}</p>
              <button className="flex items-center gap-2 text-amber-500 font-bold uppercase text-xs tracking-widest group">
                {t.narrativeBtn} <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-4 p-10 rounded-[3rem] bg-amber-600 text-white flex flex-col justify-between">
            <Target size={40} className="opacity-50" />
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase italic">{t.strategyTitle}</h3>
              <p className="text-xs font-bold leading-relaxed uppercase">{t.strategyPara}</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-7 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Users2 className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.meaningTitle}</span>
            </div>
            <p className="text-2xl font-bold dark:text-white leading-snug">{t.meaningPara}</p>
          </motion.div>

          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-5 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-between shadow-xl">
            <Compass size={32} className="text-amber-500 mb-6" />
            <div>
              <h3 className="text-xl font-black uppercase italic mb-2">{t.visionTitle}</h3>
              <p className="text-sm opacity-80">{t.visionPara}</p>
            </div>
          </motion.div>
        </div>

        {/* 3. LEGAL & LICENSE SECTION */}
        <motion.div
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          className="p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full">
              <Scale size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.legalTitle}</span>
            </div>
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-tight">{t.legalName}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <FileText size={18} className="text-amber-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Dubai License</p>
                <p className="text-sm font-bold dark:text-white">{t.licenseNo}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                <ShieldCheck size={18} className="text-amber-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">RERA Registered</p>
                <p className="text-sm font-bold dark:text-white">{t.reraNo}</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex items-start gap-4">
              <MapPin size={24} className="text-amber-500 shrink-0" />
              <p className="text-xs font-bold uppercase leading-relaxed text-slate-500">{t.office}</p>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[2.5rem] flex flex-col justify-between text-white relative overflow-hidden group">
            <Landmark className="absolute -right-8 -top-8 w-40 h-40 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10 flex justify-between items-start">
              <Briefcase size={32} className="text-amber-500" />
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Capital</p>
                <p className="text-xl font-black italic">AED 300,000</p>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase text-amber-500 mb-1">{t.ownerLabel}</p>
              <p className="text-2xl font-black italic uppercase leading-none tracking-tighter">{t.ownerName}</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[8px] uppercase font-bold opacity-40">Incorporated: July 17, 2025</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. FAQ SECTION (INTEGRATED) */}
        <motion.div
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          className="py-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full mb-4">
                <HelpCircle size={14} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.faqTitle}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">{t.faqSub}</h2>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">Everything you need to know about the Dubai real estate landscape and HomoGet's premium services.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className={`p-8 rounded-[2rem] ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} border sticky top-24`}>
                <Info className="text-amber-500 mb-6" size={32} />
                <h3 className="text-xl font-bold mb-4">Need personalized assistance?</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">Our dedicated consultants are available 24/7 to guide you through your investment journey in Dubai.</p>
                <button className="w-full py-4 bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-amber-600 transition-colors">
                  Contact Expert
                </button>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className={`rounded-[2rem] ${isDark ? 'bg-white/5' : 'bg-white'} overflow-hidden`}>
                {t.faqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.q}
                    answer={faq.a}
                    isOpen={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

  
    </main>
  );
};

export default AboutUs;