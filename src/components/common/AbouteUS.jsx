import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, ShieldCheck, Gem, MapPin, Compass, Briefcase, 
  ArrowUpRight, Target, Users2, FileText, Scale, Landmark, 
  ChevronDown, HelpCircle, Info
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');
  const [openFaq, setOpenFaq] = useState(null);

  const content = {
    en: {
      heroTag: "The Gold Standard of Brokerage",
      heroTitle: "Redefining the",
      heroSkyline: "Skyline",
      heroOfTrust: "of Trust.",
      heroPara: "Homoget Properties is more than a brokerage; we are the architects of your future in the world's most dynamic real estate market.",
      yearsLabel: "Years of Excellence",
      assetsLabel: "Assets Managed",
      narrativeTitle: "Our Narrative",
      narrativePara: "Founded in the heart of Dubai, Homoget was born from a singular vision: to bridge the gap between global investors and the UAE's most exclusive opportunities.",
      narrativeBtn: "Discover Our Mission",
      strategyTitle: "Precision Brokerage",
      strategyPara: "We leverage proprietary market analytics to predict cycles, ensuring our clients enter the market at the peak of opportunity.",
      meaningTitle: "What is HomoGet?",
      meaningPara: "HomoGet is a human-centric mode of acquisition in which the original source of every resource is, directly or indirectly, human.",
      visionTitle: "Our Vision",
      visionPara: "To build an all-in-one, inclusive digital platform that empowers individuals, small businesses, and entrepreneurs across diverse sectors.",
      legalTitle: "Legal & License Details",
      legalName: "Homoget Properties L.L.C. S.O.C.",
      legalDesc: "Fully licensed and registered Limited Liability Company – Single Owner in Dubai, UAE. Issued by DET and regulated by RERA.",
      licenseNo: "License: 1523268",
      reraNo: "RERA: 52933",
      office: "R-118, 2nd Floor, Wasl Building, Makani No. 2809195296, Bur Dubai, Dubai, UAE",
      ownerLabel: "Ownership",
      ownerName: "Founded & Solely Owned by Prashant Singh",
      faqTitle: "Knowledge Base",
      faqSub: "Frequently Asked Questions",
      faqs: [
        { q: "What types of properties does HOMOGET handle?", a: "HOMOGET deals with residential (apartments, villas, townhouses), commercial properties, and off-plan/investment projects across Dubai." },
        { q: "Is HOMOGET licensed and regulated in Dubai?", a: "Yes — HOMOGET is fully licensed under the Dubai Land Department (DLD), and our agents hold the required Real Estate Regulatory Agency (RERA) certifications." },
        { q: "How can I verify HOMOGET’s credentials?", a: "You can check our licence number (1523268) and our agents’ RERA IDs via the Dubai REST app or the official DLD website." },
        { q: "Can non-UAE residents buy property in Dubai?", a: "Yes. Foreign nationals can purchase freehold property in designated areas of Dubai." },
        { q: "What costs are involved when buying a property?", a: "Costs typically include DLD registration fee (4%), Admin fees, Agent commission (2%), and service charges." },
        { q: "What is an off-plan property purchase?", a: "Off-plan means buying a property before it is built. Payments are made in stages based on construction progress." },
        { q: "What is an escrow account?", a: "It’s a secure account that holds the buyer’s payments until the developer meets construction milestones, protecting your investment." },
        { q: "What is Ejari?", a: "Ejari is Dubai’s official tenancy registration system, required for all rental agreements." },
        { q: "Can I rent without visiting Dubai?", a: "Yes — we offer virtual tours and verified digital contracts to ensure a safe rental process from anywhere." },
        { q: "What is the difference between freehold and leasehold?", a: "Freehold gives full ownership (forever), while leasehold provides rights for a fixed term (e.g., 99 years)." }
      ]
    },
    hi: {
        heroTag: "ब्रोकरेज का स्वर्ण मानक",
        heroTitle: "विश्वास की",
        heroSkyline: "ऊंचाइयों",
        heroOfTrust: "को नया रूप देना।",
        heroPara: "होमोगेट प्रॉपर्टीज सिर्फ एक ब्रोकरेज नहीं है; हम दुनिया के सबसे गतिशील रियल एस्टेट बाजार में आपके भविष्य के वास्तुकार हैं।",
        yearsLabel: "उत्कृष्टता के वर्ष",
        assetsLabel: "संपत्ति प्रबंधन",
        narrativeTitle: "हमारी कहानी",
        narrativePara: "दुबई के केंद्र में स्थापित, होमोगेट का जन्म एक दृष्टिकोण के साथ हुआ था: वैश्विक निवेशकों और यूएई के सबसे विशेष अवसरों के बीच की दूरी को पाटना।",
        narrativeBtn: "हमारे मिशन को जानें",
        strategyTitle: "सटीक ब्रोकरेज",
        strategyPara: "हम चक्रों की भविष्यवाणी करने के लिए मालिकाना बाजार विश्लेषण का लाभ उठाते हैं, यह सुनिश्चित करते हुए कि हमारे ग्राहक अवसर के शिखर पर बाजार में प्रवेश करें।",
        meaningTitle: "होमोगेट क्या है?",
        meaningPara: "होमोगेट अधिग्रहण का एक मानव-केंद्रित तरीका है जिसमें प्रत्येक संसाधन का मूल स्रोत प्रत्यक्ष या अप्रत्यक्ष रूप से मानव होता है।",
        visionTitle: "हमारा दृष्टिकोण",
        visionPara: "एक समावेशी डिजिटल प्लेटफॉर्म बनाना जो विभिन्न क्षेत्रों में व्यक्तियों और छोटे व्यवसायों को सशक्त बनाए।",
        legalTitle: "कानूनी और लाइसेंस विवरण",
        legalName: "होमोगेट प्रॉपर्टीज एल.एल.सी. एस.ओ.सी.",
        legalDesc: "दुबई, यूएई में पूरी तरह से लाइसेंस प्राप्त और पंजीकृत लिमिटेड लायबिलिटी कंपनी। DET द्वारा जारी और RERA द्वारा विनियमित।",
        licenseNo: "लाइसेंस: 1523268",
        reraNo: "RERA: 52933",
        office: "आर-118, दूसरी मंजिल, वास्ल बिल्डिंग, मकानी नंबर 2809195296, बुर दुबई, दुबई, यूएई",
        ownerLabel: "स्वामित्व",
        ownerName: "प्रशांत सिंह द्वारा स्थापित और एकमात्र स्वामित्व",
        faqTitle: "सामान्य प्रश्न",
        faqSub: "अक्सर पूछे जाने वाले सवाल",
        faqs: [
            { q: "होमोगेट किस प्रकार की संपत्तियों का प्रबंधन करता है?", a: "होमोगेट पूरे दुबई में आवासीय (अपार्टमेंट, विला, टाउनहाउस), वाणिज्यिक संपत्तियों और ऑफ-प्लान परियोजनाओं का प्रबंधन करता है।" },
            { q: "क्या होमोगेट दुबई में लाइसेंस प्राप्त है?", a: "हाँ - होमोगेट दुबई भूमि विभाग (DLD) के तहत पूरी तरह से लाइसेंस प्राप्त है।" }
        ]
    },
    ar: {
        heroTag: "المعيار الذهبي للوساطة",
        heroTitle: "إعادة تعريف",
        heroSkyline: "أفق",
        heroOfTrust: "الثقة.",
        heroPara: "هوموجيت بروبرتيز هي أكثر من مجرد شركة وساطة؛ نحن مهندسو مستقبلك في سوق العقارات الأكثر ديناميكية في العالم.",
        yearsLabel: "سنوات من التميز",
        assetsLabel: "أصول تحت الإدارة",
        narrativeTitle: "سردنا",
        narrativePara: "تأسست هوموجيت في قلب دبي، ولدت من رؤية فريدة: سد الفجوة بين المستثمرين العالميين وأكثر الفرص حصرياً في الإمارات.",
        narrativeBtn: "اكتشف مهمتنا",
        strategyTitle: "وساطة دقيقة",
        strategyPara: "نحن نستخدم تحليلات السوق للتنبؤ بالدورات العقارية، مما يضمن دخول عملائنا السوق في ذروة الفرص.",
        meaningTitle: "ما هو هوموجيت؟",
        meaningPara: "هوموجيت هو نمط اقتناء يركز على الإنسان، حيث يكون المصدر الأصلي لكل مورد هو الإنسان بشكل مباشر أو غير مباشر.",
        visionTitle: "رؤيتنا",
        visionPara: "بناء منصة رقمية شاملة تمكن الأفراد والشركات الصغيرة ورواد الأعمال في مختلف القطاعات.",
        legalTitle: "تفاصيل الترخيص القانوني",
        legalName: "هوموجيت بروبرتيز ش.ذ.م.م - مالك واحد",
        legalDesc: "شركة ذات مسؤولية محدودة مرخصة ومسجلة بالكامل في دبي، الإمارات العربية المتحدة. صادرة عن DET ومنظمة من قبل ريرا.",
        licenseNo: "رخصة: 1523268",
        reraNo: "ريرا: 52933",
        office: "R-118، الطابق الثاني، مبنى وصل، رقم مكاني 2809195296، بر دبي، دبي",
        ownerLabel: "الملكية",
        ownerName: "تأسست ومملوكة بالكامل من قبل براشانت سينغ",
        faqTitle: "الأسئلة الشائعة",
        faqSub: "قاعدة المعرفة",
        faqs: [
            { q: "ما هي أنواع العقارات التي تتعامل معها هوموجيت؟", a: "تتعامل هوموجيت مع العقارات السكنية والتجارية والمشاريع قيد الإنشاء في جميع أنحاء دبي." }
        ]
    }
  };

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
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    lang === l ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-amber-500'
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
              {t.heroTitle} <br/>
              <span className="italic font-serif font-light text-amber-600">{t.heroSkyline}</span> <br/>
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

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <img src="https://dubailand.gov.ae/media/1014/dld-logo.png" className="h-8 dark:invert" alt="DLD" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-center">
            RERA Registered Brokerage | Powered by HomoGet
          </div>
          <img src="https://trakheesi.gov.ae/static/media/trakheesi-logo.519509f6.png" className="h-8 dark:invert" alt="Trakheesi" />
        </div>
      </footer>
    </main>
  );
};

export default AboutUs;