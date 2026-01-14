import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Eye, Database, Share2, Lock, UserCheck, 
  Cookie, Mail, MapPin, Clock, FileText, Scale
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PrivacyPolicy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');

  const content = {
    en: {
      tag: "Data Protection",
      title: "Privacy",
      subtitle: "Policy",
      lastUpdated: "Last Updated: January 2026",
      intro: "Homoget Properties is committed to protecting your personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 (PDPL) and RERA regulations.",
      sections: [
        {
          id: "collection",
          icon: <Database size={24} />,
          title: "1. Information We Collect",
          items: [
            "Personal Info: Full name, Emirates ID, Passport, and contact details.",
            "Property Info: Title deeds, tenancy contracts, and viewing history.",
            "Technical Info: IP address, cookies, and device metadata."
          ]
        },
        {
          id: "usage",
          icon: <Eye size={24} />,
          title: "2. How We Use Data",
          items: [
            "Processing property transactions and RERA/DLD compliance.",
            "Identity verification and Anti-Money Laundering (AML) checks.",
            "Improving digital services and platform security."
          ]
        }
      ],
      rightsTitle: "Your Rights (UAE PDPL)",
      rights: ["Access & Correction", "Data Portability", "Right to Deletion", "Withdraw Consent"],
      contactTitle: "Privacy Contact",
      contactEmail: "privacy@homogetproperties.com",
      office: "R-118, 2nd Floor, Wasl Building, Bur Dubai, Dubai, UAE"
    },
    hi: {
      tag: "डेटा सुरक्षा",
      title: "गोपनीयता",
      subtitle: "नीति",
      lastUpdated: "अंतिम अपडेट: जनवरी 2026",
      intro: "होमोगेट प्रॉपर्टीज यूएई संघीय डिक्री-कानून संख्या 45 (PDPL) और RERA नियमों के अनुसार आपके डेटा की रक्षा के लिए प्रतिबद्ध है।",
      sections: [
        {
          id: "collection",
          icon: <Database size={24} />,
          title: "1. एकत्र की गई जानकारी",
          items: [
            "व्यक्तिगत जानकारी: नाम, अमीरात आईडी, पासपोर्ट और संपर्क विवरण।",
            "संपत्ति जानकारी: शीर्षक विलेख, किराये के अनुबंध और देखने का इतिहास।",
            "तकनीकी जानकारी: आईपी पता, कुकीज़ और डिवाइस मेटाडेटा।"
          ]
        }
      ],
      rightsTitle: "आपके अधिकार (UAE PDPL)",
      rights: ["पहुंच और सुधार", "डेटा पोर्टेबिलिटी", "हटाने का अधिकार", "सहमति वापस लेना"],
      contactTitle: "गोपनीयता संपर्क",
      contactEmail: "privacy@homogetproperties.com",
      office: "आर-118, दूसरी मंजिल, वास्ल बिल्डिंग, दुबई, यूएई"
    },
    ar: {
      tag: "حماية البيانات",
      title: "سياسة",
      subtitle: "الخصوصية",
      lastUpdated: "آخر تحديث: يناير 2026",
      intro: "تلتزم هوموجيت بروبرتيز بحماية بياناتك الشخصية وفقًا للمرسوم بقانون اتحادي رقم 45 لسنة 2021 (PDPL) ولوائح ريرا.",
      sections: [
        {
          id: "collection",
          icon: <Database size={24} />,
          title: "1. المعلومات التي نجمعها",
          items: [
            "معلومات شخصية: الاسم، الهوية الإماراتية، الجواز وتفاصيل الاتصال.",
            "معلومات العقار: صكوك الملكية، عقود الإيجار، وسجل المشاهدة.",
            "معلومات تقنية: عنوان IP، ملفات تعريف الارتباط."
          ]
        }
      ],
      rightsTitle: "حقوقك (قانون الإمارات)",
      rights: ["الوصول والتصحيح", "نقل البيانات", "حق الحذف", "سحب الموافقة"],
      contactTitle: "اتصل بالخصوصية",
      contactEmail: "privacy@homogetproperties.com",
      office: "R-118، الطابق الثاني، مبنى وصل، بر دبي، دبي"
    }
  };

  const t = content[lang];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1920" 
            alt="Dubai Skyline Background" 
            className="w-full h-full object-cover"
          />
          {/* Dynamic Overlay based on theme */}
          <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-slate-950 via-slate-950/80 to-transparent' : 'from-white via-white/80 to-transparent'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col md:flex-row justify-between items-start gap-12">
          
          <motion.div initial="hidden" animate="visible" variants={sectionVariant} className="max-w-3xl text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} /> {t.tag}
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              {t.title} <br/>
              <span className="italic font-serif font-light text-amber-600">{t.subtitle}</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-4 max-w-xl">{t.intro}</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
              <Clock size={12} /> {t.lastUpdated}
            </div>
          </motion.div>

          {/* Language Toggle Container */}
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
          
          {/* Main Sections (Left Side) */}
          <div className="lg:col-span-8 space-y-8">
            {t.sections.map((section) => (
              <motion.div 
                key={section.id}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                className="p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-amber-500">{section.icon}</div>
                  <h2 className="text-xl font-black uppercase italic dark:text-white">{section.title}</h2>
                </div>
                <ul className="space-y-4">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex gap-4 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      <span className="text-amber-500 font-black">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Compliance Box */}
            <motion.div 
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              className="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-200 dark:border-white/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <Scale className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Standard</span>
              </div>
              <p className="text-lg font-bold dark:text-white leading-relaxed">
                We implement comprehensive administrative, technical, and physical security measures including SSL/TLS encryption and regular backups to protect your data.
              </p>
            </motion.div>
          </div>

          {/* Sidebar (Right Side) */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              variants={sectionVariant}
              initial="hidden"
              whileInView="visible"
              className="p-10 bg-slate-900 rounded-[3rem] text-white"
            >
              <UserCheck size={32} className="text-amber-500 mb-8" />
              <h3 className="text-xl font-black uppercase italic mb-6">{t.rightsTitle}</h3>
              <div className="space-y-4">
                {t.rights.map((right, idx) => (
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
              <h3 className="text-xl font-black uppercase italic mb-6">{t.contactTitle}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail size={20} className="opacity-70 mt-1" />
                  <p className="text-xs font-bold break-all">{t.contactEmail}</p>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="opacity-70 mt-1" />
                  <p className="text-xs font-bold leading-relaxed uppercase">{t.office}</p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <img src="https://dubailand.gov.ae/media/1014/dld-logo.png" className="h-8 dark:invert" alt="DLD" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em]">UAE Data Privacy Compliant</div>
          <img src="https://trakheesi.gov.ae/static/media/trakheesi-logo.519509f6.png" className="h-8 dark:invert" alt="Trakheesi" />
        </div>
      </footer>
    </main>
  );
};

export default PrivacyPolicy;