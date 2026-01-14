import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, FileCheck, AlertCircle, BadgeDollarSign, 
  Gavel, UserPlus, Ban, ShieldAlert, Clock, 
  Mail, MapPin, Globe, Landmark, ShieldCheck, Briefcase
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const TermsOfService = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lang, setLang] = useState('en');

  const content = {
    en: {
      tag: "Legal Framework",
      title: "Terms &",
      subtitle: "Conditions",
      description: "These Terms govern your access to the Homoget Properties platform. By using our services, you agree to be bound by UAE Federal Law and RERA regulations.",
      lastUpdated: "Last Updated: January 14, 2026",
      eligibilityTitle: "1. Eligibility",
      eligibilityPara: "To use our Services, you must be at least 21 years old and have full legal capacity under UAE law. Valid identification is required.",
      accountTitle: "2. Account Registration",
      accountPara: "You must provide accurate information and keep credentials confidential. Notify us immediately of unauthorized access.",
      listingsTitle: "3. Property Listings",
      listingsPara: "Sellers must be lawful owners. Listings must comply with RERA Form A and DLD advertising laws.",
      feesTitle: "4. Fees & Payments",
      feesPara: "Sales: Up to 2%. Rentals: 5% or AED 5,000. Cash payments above AED 40,000 are prohibited per AML laws.",
      complianceTitle: "5. Legal Compliance",
      compliancePara: "We strictly adhere to RERA, DLD, UAE AML/CFT laws, and the UAE Cybercrime Law.",
      prohibitedTitle: "6. Prohibited Activities",
      prohibitedPara: "Fraudulent listings and money laundering are strictly prohibited and will be reported to Dubai Police.",
      liabilityTitle: "9. Limitation of Liability",
      liabilityPara: "Homoget Properties provides services 'as is'. We are not responsible for property defects or third-party disputes.",
      contactTitle: "15. Contact Information",
      contactEmail: "legal@homogetproperties.com",
      office: "R-118, Wasl Building, Bur Dubai, UAE",
      rera: "RERA ORN: 52933"
    },
    hi: {
      tag: "कानूनी ढांचा",
      title: "नियम और",
      subtitle: "शर्तें",
      description: "ये शर्तें होमोगेट प्रॉपर्टीज प्लेटफॉर्म तक आपकी पहुंच को नियंत्रित करती हैं। हमारी सेवाओं का उपयोग करके, आप यूएई कानून और रेरा नियमों से बंधे हैं।",
      lastUpdated: "अंतिम अपडेट: 14 जनवरी, 2026",
      eligibilityTitle: "1. पात्रता",
      eligibilityPara: "हमारी सेवाओं का उपयोग करने के लिए, आपकी आयु कम से कम 21 वर्ष होनी चाहिए। वैध पहचान पत्र अनिवार्य है।",
      accountTitle: "2. खाता पंजीकरण",
      accountPara: "आपको सटीक जानकारी देनी होगी। अनधिकृत पहुंच के मामले में तुरंत हमें सूचित करें।",
      listingsTitle: "3. संपत्ति लिस्टिंग",
      listingsPara: "विक्रेता कानूनी मालिक होने चाहिए। लिस्टिंग को रेरा फॉर्म ए और डीएलडी नियमों का पालन करना चाहिए।",
      feesTitle: "4. शुल्क और भुगतान",
      feesPara: "बिक्री: 2% तक। किराया: 5% या 5,000 एईडी। एएमएल कानूनों के अनुसार नकद भुगतान सीमित है।",
      complianceTitle: "5. कानूनी अनुपालन",
      compliancePara: "हम रेरा, डीएलडी और यूएई साइबर अपराध कानूनों का सख्ती से पालन करते हैं।",
      prohibitedTitle: "6. निषिद्ध गतिविधियां",
      prohibitedPara: "धोखाधड़ी वाली लिस्टिंग और मनी लॉन्ड्रिंग सख्त वर्जित है और इसकी रिपोर्ट पुलिस को दी जाएगी।",
      liabilityTitle: "9. दायित्व की सीमा",
      liabilityPara: "होमोगेट प्रॉपर्टीज सेवाएं 'जैसी हैं' प्रदान करती हैं। हम संपत्ति के दोषों के लिए जिम्मेदार नहीं हैं।",
      contactTitle: "15. संपर्क जानकारी",
      contactEmail: "legal@homogetproperties.com",
      office: "आर-118, वास्ल बिल्डिंग, दुबई, यूएई",
      rera: "रेरा ओआरएन: 52933"
    },
    ar: {
      tag: "الإطار القانوني",
      title: "الشروط",
      subtitle: "والأحكام",
      description: "تحكم هذه الشروط وصولك إلى منصة هوموجيت بروبرتيز. باستخدام خدماتنا، فإنك توافق على الالتزام بالقانون الاتحادي لدولة الإمارات ولوائح ريرا.",
      lastUpdated: "آخر تحديث: 14 يناير 2026",
      eligibilityTitle: "1. الأهلية",
      eligibilityPara: "يجب أن لا يقل عمرك عن 21 عاماً وأن تتمتع بالأهلية القانونية الكاملة. الهوية الإماراتية أو جواز السفر مطلوب.",
      accountTitle: "2. تسجيل الحساب",
      accountPara: "يجب تقديم معلومات دقيقة والحفاظ على سرية الحساب. يرجى إبلاغنا فوراً في حال الدخول غير المصرح به.",
      listingsTitle: "3. قوائم العقارات",
      listingsPara: "يجب أن يكون البائعون هم الملاك القانونيين. يجب أن تتوافق القوائم مع نموذج ريرا (أ) وقوانين دائرة الأراضي والأملاك.",
      feesTitle: "4. الرسوم والمدفوعات",
      feesPara: "البيع: حتى 2٪. الإيجار: 5٪ أو 5000 درهم. تُحظر المدفوعات النقدية التي تتجاوز 40,000 درهم.",
      complianceTitle: "5. الامتثال القانوني",
      compliancePara: "نحن نلتزم بصرامة بلوائح ريرا ودائرة الأراضي والأملاك وقوانين مكافحة غسل الأموال وجرائم تقنية المعلومات.",
      prohibitedTitle: "6. الأنشطة المحظورة",
      prohibitedPara: "يُحظر تماماً الإدراج الاحتيالي وغسل الأموال، وسيتم إبلاغ شرطة دبي عن أي مخالفات.",
      liabilityTitle: "9. تحديد المسؤولية",
      liabilityPara: "تقدم هوموجيت الخدمات 'كما هي'. نحن لسنا مسؤولين عن عيوب العقارات أو النزاعات بين الأطراف الثالثة.",
      contactTitle: "15. معلومات الاتصال",
      contactEmail: "legal@homogetproperties.com",
      office: "R-118، مبنى وصل، بر دبي، دبي",
      rera: "رقم التسجيل: 52933"
    }
  };

  const t = content[lang];

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* HERO SECTION */}
      <section className="relative h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1920" 
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
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                    lang === l ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-amber-500'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <motion.div key={lang} initial="hidden" animate="visible" variants={sectionVariant} className="max-w-4xl space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
              <Scale size={14} /> {t.tag}
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              {t.title} <br/>
              <span className="italic font-serif font-light text-amber-600">{t.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">{t.description}</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 pt-4">
              <Clock size={12} /> {t.lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENTO GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto space-y-6">
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-elig`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-7 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <UserPlus className="text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.eligibilityTitle}</span>
             </div>
             <p className="text-2xl font-bold dark:text-white leading-snug">{t.eligibilityPara}</p>
          </motion.div>

          <motion.div key={`${lang}-acc`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-5 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col justify-between shadow-2xl">
            <ShieldCheck size={40} className="text-amber-500 mb-6" />
            <div>
              <h3 className="text-xl font-black uppercase italic mb-2">{t.accountTitle}</h3>
              <p className="text-xs font-bold opacity-80 uppercase leading-relaxed">{t.accountPara}</p>
            </div>
          </motion.div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-list`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-5 p-10 bg-amber-600 rounded-[3rem] text-white">
            <Briefcase size={40} className="mb-6 opacity-50" />
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">{t.listingsTitle}</h3>
            <p className="text-xl font-black uppercase italic leading-tight">{t.listingsPara}</p>
          </motion.div>

          <motion.div key={`${lang}-fees`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-7 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BadgeDollarSign className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{t.feesTitle}</span>
            </div>
            <p className="text-2xl font-bold dark:text-white leading-snug mb-4">{t.feesPara}</p>
          </motion.div>
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-comp`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-8 p-10 bg-slate-900 rounded-[3rem] text-white shadow-xl">
             <div className="flex items-center gap-3 mb-8">
               <Landmark className="text-amber-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.complianceTitle}</span>
             </div>
             <p className="text-xl md:text-2xl font-medium leading-relaxed italic uppercase">{t.compliancePara}</p>
          </motion.div>

          <motion.div key={`${lang}-pro`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-4 p-10 bg-white dark:bg-neutral-900 rounded-[3rem] border border-slate-200 dark:border-white/5">
             <Ban size={32} className="text-amber-500 mb-6" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{t.prohibitedTitle}</p>
             <p className="text-lg font-black dark:text-white italic uppercase leading-tight">{t.prohibitedPara}</p>
          </motion.div>
        </div>

        {/* ROW 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-start">
          <motion.div key={`${lang}-liab`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-6 p-10 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem]">
             <AlertCircle className="text-amber-500 mb-6" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t.liabilityTitle}</h3>
             <p className="text-lg font-bold uppercase opacity-70 leading-relaxed">{t.liabilityPara}</p>
          </motion.div>

          <motion.div key={`${lang}-contact`} variants={sectionVariant} initial="hidden" whileInView="visible" className="md:col-span-6 p-10 bg-slate-900 rounded-[3rem] text-white border-2 border-amber-500/20">
             <Gavel size={32} className="text-amber-500 mb-6" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{t.contactTitle}</p>
                  <p className="text-xs font-bold text-amber-500 uppercase">{t.contactEmail}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase mt-1">{t.office}</p>
                </div>
                <div className="flex flex-col justify-end text-end">
                  <p className="text-[10px] font-black text-white/40 uppercase">{t.rera}</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <img src="https://dubailand.gov.ae/media/1014/dld-logo.png" className="h-8 dark:invert" alt="DLD" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em]">RERA Regulated Brokerage</div>
          <img src="https://trakheesi.gov.ae/static/media/trakheesi-logo.519509f6.png" className="h-8 dark:invert" alt="Trakheesi" />
        </div>
      </footer>
    </main>
  );
};

export default TermsOfService;