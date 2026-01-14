import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, FileText, Landmark, MapPin, Scale, 
  Briefcase, Calendar, Wallet, Gem, Award, Users2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const LegalLicensePage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');

  const content = {
    en: {
      tag: "Verified & Regulated",
      title: "Legal & License",
      subtitle: "Details",
      description: "Homoget Properties L.L.C. S.O.C. is a fully licensed and registered Limited Liability Company – Single Owner in Dubai, UAE.",
      licenseTitle: "Commercial License",
      licenseNo: "1523268",
      reraTitle: "RERA Registration",
      reraNo: "52933",
      incorpTitle: "Incorporation Date",
      incorpDate: "July 17, 2025",
      capitalTitle: "Registered Capital",
      capitalVal: "AED 300,000",
      complianceTitle: "Regulatory Adherence",
      compliancePara: "We maintain the highest standards of consumer protection, including transparent pricing, VAT-inclusive invoicing, and ethical integrity in every transaction.",
      officeTitle: "Headquarters",
      officeDesc: "R-118, 2nd Floor, Wasl Building, Makani No. 2809195296, Bur Dubai, Dubai, UAE",
      ownerTitle: "Ownership",
      ownerName: "Founded & Solely Owned by Prashant Singh"
    },
    hi: {
      tag: "सत्यापित और विनियमित",
      title: "कानूनी और",
      subtitle: "लाइसेंस",
      description: "होमोगेट प्रॉपर्टीज एल.एल.सी. एस.ओ.सी. दुबई, यूएई में एक पूरी तरह से लाइसेंस प्राप्त और पंजीकृत लिमिटेड लायबिलिटी कंपनी - एकल स्वामी है।",
      licenseTitle: "वाणिज्यिक लाइसेंस",
      licenseNo: "1523268",
      reraTitle: "RERA पंजीकरण",
      reraNo: "52933",
      incorpTitle: "स्थापना तिथि",
      incorpDate: "17 जुलाई, 2025",
      capitalTitle: "पंजीकृत पूंजी",
      capitalVal: "AED 300,000",
      complianceTitle: "नियामक अनुपालन",
      compliancePara: "हम उपभोक्ता संरक्षण के उच्चतम मानकों को बनाए रखते हैं, जिसमें पारदर्शी मूल्य निर्धारण और वैट-समावेशी चालान शामिल हैं।",
      officeTitle: "मुख्यालय",
      officeDesc: "आर-118, दूसरी मंजिल, वास्ल बिल्डिंग, मकानी नंबर 2809195296, बुर दुबई, दुबई, यूएई",
      ownerTitle: "स्वामित्व",
      ownerName: "प्रशांत सिंह द्वारा स्थापित और एकमात्र स्वामित्व"
    },
    ar: {
      tag: "موثق ومنظم",
      title: "التفاصيل",
      subtitle: "القانونية",
      description: "هوموجيت بروبرتيز ش.ذ.م.م - مالك واحد هي شركة ذات مسؤولية محدودة مرخصة ومسجلة بالكامل في دبي، الإمارات العربية المتحدة.",
      licenseTitle: "رخصة تجارية",
      licenseNo: "1523268",
      reraTitle: "تسجيل ريرا",
      reraNo: "52933",
      incorpTitle: "تاريخ التأسيس",
      incorpDate: "17 يوليو 2025",
      capitalTitle: "رأس المال المسجل",
      capitalVal: "300,000 درهم",
      complianceTitle: "الالتزام التنظيمي",
      compliancePara: "نحن نلتزم بأعلى معايير حماية المستهلك، بما في ذلك التسعير الشفاف والفواتير الشاملة لضريبة القيمة المضافة.",
      officeTitle: "المقر الرئيسي",
      officeDesc: "R-118، الطابق الثاني، مبنى وصل، رقم مكاني 2809195296، بر دبي، دبي، الإمارات العربية المتحدة",
      ownerTitle: "الملكية",
      ownerName: "تأسست ومملوكة بالكامل من قبل براشانت سينغ"
    }
  };

  const t = content[lang];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* HERO SECTION - CONSISTENT WITH ABOUT PAGE */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/90 via-slate-950/60 to-slate-950' : 'from-white/90 via-white/60 to-white'}`} />
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          {/* Language Switcher */}
          <div className="flex justify-end mb-12">
            <div className="flex bg-white/10 backdrop-blur-xl p-1 rounded-2xl border border-white/20">
              {['en', 'hi', 'ar'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    lang === l ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-amber-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <motion.div initial="hidden" animate="visible" variants={sectionVariant} className="max-w-4xl space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} /> {t.tag}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              {t.title} <br/>
              <span className="italic font-serif font-light text-amber-600">{t.subtitle}</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
              {t.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID - LOCKED POSITIONS */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-6">
        
        {/* ROW 1: Licenses */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-8 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-8">
               <FileText className="text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.licenseTitle}</span>
             </div>
             <div className="space-y-2">
                <p className="text-5xl md:text-7xl font-black dark:text-white tracking-tighter">{t.licenseNo}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Government of Dubai - DET Licensed</p>
             </div>
          </motion.div>

          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-4 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-between">
            <Award size={40} className="text-amber-500 mb-6" />
            <div className="text-start">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.reraTitle}</h3>
              <p className="text-4xl font-black italic">{t.reraNo}</p>
            </div>
          </motion.div>
        </div>

        {/* ROW 2: Stats & Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-4 p-10 bg-amber-600 rounded-[3rem] text-white">
            <Wallet size={32} className="mb-6 opacity-50" />
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">{t.capitalTitle}</h3>
            <p className="text-3xl font-black uppercase italic">{t.capitalVal}</p>
          </motion.div>

          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-8 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.complianceTitle}</span>
            </div>
            <p className="text-2xl font-bold dark:text-white leading-snug">{t.compliancePara}</p>
          </motion.div>
        </div>

        {/* ROW 3: Office & Owner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-7 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-between">
             <div className="flex items-center gap-3 mb-8">
               <MapPin className="text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.officeTitle}</span>
             </div>
             <p className="text-xl md:text-2xl font-medium leading-relaxed italic uppercase">{t.officeDesc}</p>
          </motion.div>

          <motion.div variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-5 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 flex flex-col justify-between">
             <Briefcase size={32} className="text-amber-500 mb-6" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.ownerTitle}</p>
                <p className="text-2xl font-black dark:text-white italic uppercase leading-tight">{t.ownerName}</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 opacity-40 grayscale transition-all hover:grayscale-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <img src="https://dubailand.gov.ae/media/1014/dld-logo.png" className="h-8 dark:invert" alt="DLD" />
          <div className="text-center text-[10px] font-bold uppercase tracking-widest">
            RERA Registered Brokerage | Powered by HomoGet
          </div>
          <img src="https://trakheesi.gov.ae/static/media/trakheesi-logo.519509f6.png" className="h-8 dark:invert" alt="Trakheesi" />
        </div>
      </footer>
    </main>
  );
};

export default LegalLicensePage;