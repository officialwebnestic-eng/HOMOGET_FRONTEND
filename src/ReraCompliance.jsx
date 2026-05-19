import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, Database, Share2, Lock, UserCheck, 
  Cookie, Mail, MapPin, Clock, FileText, Scale, Globe, AlertCircle,
  Home, Briefcase, Award, Target, Lightbulb
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ReraCompliance = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');

  // Full English content (based on user's provided text)
  const enContent = {
    tag: "RERA Regulated",
    title: "Company",
    subtitle: "Compliance",
    intro: "Homoget Properties L.L.C. S.O.C. is a fully licensed, RERA‑regulated real estate brokerage in Dubai, UAE.",
    lastUpdated: "Commercial License: 1523268 | RERA ORN: 52933",
    sections: [
      {
        title: "Legal & License Details",
        items: [
          "Homoget Properties L.L.C. S.O.C. – Fully licensed Limited Liability Company – Single Owner (LLC – S.O.C.) in Dubai, UAE.",
          "Commercial License Number: 1523268 (Issued by Department of Economy and Tourism, Government of Dubai).",
          "Incorporation Date: July 17, 2025 | Registered Capital: AED 300,000.",
          "Permitted Activities: Leasing Property Brokerage Agents & Real Estate Buying/Selling Brokerage.",
          "RERA Registration Number: 52933 – Fully regulated by the Real Estate Regulatory Agency (RERA) under the Dubai Land Department.",
          "Office Location: R-118, 2nd Floor, Wasl Building, Makani No. 2809195296, Bur Dubai, Dubai, United Arab Emirates."
        ]
      },
      {
        title: "Understanding 'HomoGet'",
        items: [
          "HomoGet is a human-centric concept representing the acquisition of any object, service, information, or assistance – either directly from one human to another or through technology, platforms, services, or resources created by humans.",
          "Word Breakdown: Homo = Human | Get = To obtain / acquire.",
          "Core Meaning: Acquisition by humans, or obtaining from humans.",
          "Professional Definition: HomoGet refers to the process through which an individual acquires any object, service, knowledge, or support – directly from another person or indirectly via tools, platforms, or systems developed by humans.",
          "Fundamental Principle: Every acquisition ultimately originates from human effort – whether through direct human interaction or human-created innovations and technologies.",
          "One‑Line Definition: 'HomoGet is a human‑centric mode of acquisition in which the original source of every resource is, directly or indirectly, human.'"
        ]
      },
      {
        title: "About Homoget Properties",
        items: [
          "Homoget Properties L.L.C. S.O.C. is a leading real estate brokerage firm based in Dubai, dedicated to transforming the property market through human‑centered innovation and seamless digital integration.",
          "Founded and solely owned by Prashant Singh, we specialize in premium residential, commercial, and investment properties across the UAE.",
          "We provide AI‑enhanced search capabilities, rigorously verified listings, expert brokerage services, and personalized consultations.",
          "With advanced analytics, we deliver precise property matches and comprehensive end‑to‑end solutions – from discovery to successful closure.",
          "Whether you are a first‑time buyer or an experienced investor, Homoget Properties turns aspirations into enduring legacies of growth and prosperity."
        ]
      }
    ],
    rightsTitle: "Vision & Mission",
    rights: [
      "Build an all-in-one inclusive digital platform",
      "Empower small businesses & entrepreneurs",
      "Charge the lowest possible fees",
      "Bridge human aspirations with opportunities",
      "Technology-enabled services with integrity",
      "Affordable, innovative, human‑centric ecosystem"
    ],
    contactTitle: "Contact & Compliance",
    contactEmail: "Support@homoget.ae",
    office: "R-118, 2nd Floor, Wasl Building, Bur Dubai, Dubai, UAE",
    phone: "+971 585919585",
    license: "License: 1523268 | RERA: 52933",
    rera: "100% Transparent | Human‑Centric"
  };

  // Simplified Hindi (placeholder – you can expand later)
  const hiContent = {
    ...enContent,
    tag: "रेरा विनियमित",
    title: "कंपनी",
    subtitle: "अनुपालन",
    intro: "होमोगेट प्रॉपर्टीज एल.एल.सी. एस.ओ.सी. दुबई, यूएई में पूर्ण रूप से लाइसेंस प्राप्त, रेरा-विनियमित रियल एस्टेट ब्रोकरेज है।",
    lastUpdated: "वाणिज्यिक लाइसेंस: 1523268 | रेरा ओआरएन: 52933",
    sections: enContent.sections.map(s => ({ ...s, items: s.items.map(i => i.substring(0, 150) + "…") })),
    rightsTitle: "दृष्टि और मिशन",
    rights: enContent.rights,
    contactTitle: "संपर्क और अनुपालन",
    contactEmail: "Support@homoget.ae",
    office: "आर-118, दूसरी मंजिल, वास्ल बिल्डिंग, दुबई, यूएई",
    phone: "+971 585919585",
    license: "लाइसेंस: 1523268 | रेरा: 52933",
    rera: "100% पारदर्शी | मानव-केंद्रित"
  };

  const arContent = {
    ...enContent,
    tag: "منظم من ريرا",
    title: "الشركة",
    subtitle: "الامتثال",
    intro: "هوموجيت بروبرتيز ش.ذ.م.م - مالك واحد هي وساطة عقارية مرخصة بالكامل ومنظمة من ريرا في دبي، الإمارات العربية المتحدة.",
    lastUpdated: "رخصة تجارية: 1523268 | رقم التسجيل: 52933",
    sections: enContent.sections.map(s => ({ ...s, items: s.items.map(i => i.substring(0, 150) + "…") })),
    rightsTitle: "الرؤية والرسالة",
    rights: enContent.rights,
    contactTitle: "الاتصال والامتثال",
    contactEmail: "Support@homoget.ae",
    office: "R-118، الطابق الثاني، مبنى وصل، بر دبي، دبي",
    phone: "+971 585919585",
    license: "رخصة: 1523268 | ريرا: 52933",
    rera: "شفاف 100% | محوره الإنسان"
  };

  const content = lang === 'en' ? enContent : (lang === 'hi' ? hiContent : arContent);

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
            <div className="flex items-center gap-2 text-[10px] font-serif text-slate-400">
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
          
          {/* LEFT COLUMN: Company details sections */}
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
                      {idx === 1 && <Lightbulb size={20} className="text-amber-500" />}
                      {idx === 2 && <Briefcase size={20} className="text-amber-500" />}
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

          {/* RIGHT COLUMN: Vision/Mission & Contact Cards */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              className="p-10 bg-slate-900 rounded-[3rem] text-white"
            >
              <Target size={32} className="text-amber-500 mb-8" />
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

      {/* Footer is not present in original – you can add if needed */}
    </main>
  );
};

export default ReraCompliance;