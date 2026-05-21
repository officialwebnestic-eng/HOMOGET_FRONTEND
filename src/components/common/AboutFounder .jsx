import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Award, Globe, Linkedin, Instagram, Twitter, 
  Facebook, Youtube, Music, Heart, Quote, Briefcase, Target, 
  Mail, MapPin, Phone, BookOpen, Sparkles, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { homogetFounderImage } from '../../ExportImages';
import { founderData } from '../../helpers/AboutHelpers';

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Map social icon names to Lucide components
const socialIconMap = {
  Linkedin: Linkedin,
  Instagram: Instagram,
  Twitter: Twitter,
  Facebook: Facebook,
  Youtube: Youtube,
  Music: Music
};

const AboutFounder = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const founder = founderData;
  const { homoget, webnestic } = founderData;

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=80"
            className="w-full h-full object-cover grayscale-[20%]"
            alt="Dubai Skyline"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-slate-950/90' : 'bg-white/90'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="mb-8">
            <Link to="/about" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-600 transition-colors text-sm font-bold">
              <ArrowLeft size={16} /> Back to About Us
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Award size={14} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Founder's Profile</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight">
                {founder.name}
              </h1>
              <p className="text-amber-500 font-black uppercase text-sm tracking-wider">{founder.role}</p>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {founder.shortBio}
              </p>
              <div className="flex flex-wrap gap-3">
                {founder.achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full">
                    <Sparkles size={12} className="text-amber-500" />
                    <span className="text-[9px] font-bold">{ach}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-amber-500 shadow-2xl">
                <img src={founder.image || homogetFounderImage} alt={founder.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                  <Heart size={16} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        
        {/* Full Story & Journey */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Full Story & Journey</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p className="text-lg font-semibold text-amber-600">From Humble Roots to High Aspirations</p>
            <p>Mr. Singh was born on April 19, 1994, in the village of Harail, Mohiuddin Nagar, Samastipur District, Bihar, India. Raised in a middle-class family, he imbibed the values of discipline, integrity, and hard work from his father, Shri Shyam Nandan Singh (a respected village mathematics teacher), and his mother, Mrs. Asha Devi (a dedicated homemaker), along with his younger brother, Mr. Nishant Singh.</p>
            
            <p className="text-lg font-semibold text-amber-600">The Spiritual Foundation</p>
            <p>A defining influence in Mr. Singh's life was his late grandmother, Smt. Baliraj Devi, a deeply spiritual woman. From an early age, she introduced him to meditation and spiritual practices, nurturing a strong spiritual foundation that continues to shape his personal philosophy: <em>"Life is not a destination, but a continuous journey of discovery."</em></p>
            
            <p className="text-lg font-semibold text-amber-600">The Hustle and Resilience</p>
            <p>Driven by a strong independent spirit, Mr. Singh left home at the age of 16 in 2011 to pursue his future in Delhi. While working to support himself, he successfully completed his Bachelor of Arts (BA) from Darbhanga University in 2014. When financial circumstances redirected him from his original goal of preparing for the UPSC Civil Services, Delhi became his real-world business school. He gained hands-on experience across multiple sectors, including Media & Corporate Management, Hospitality & Event Management, and Security Operations & Administration.</p>
            <p>This diverse exposure sharpened his creativity and entrepreneurial instincts. After successfully running an event management company in Delhi, the COVID-19 pandemic prompted a strategic shift. On April 19, 2022, Mr. Singh married Mrs. Sapna Singh in a spiritual ceremony at the ISKCON Temple in Vrindavan.</p>
            
            <p className="text-lg font-semibold text-amber-600">Hobbies & Personal Interests</p>
            <p>Mr. Singh is a passionate poet, author, and songwriter. He finds deep joy in writing poems and songs, studying inspirational books, and practicing high-level spiritual meditation with yoga. He maintains a disciplined lifestyle through fitness and holistic health practices. Additionally, he has a strong affinity for adventure, discovery, and renovation projects, which reflect his creative and exploratory nature.</p>
          </div>
        </motion.section>

      {/* Professional Background */}
<motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
  <div className="flex items-center gap-3">
    <Briefcase size={24} className="text-amber-500" />
    <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Professional Background & Expertise</h2>
  </div>
  <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
    <p className="mb-4">In February 2023, Mr. Singh relocated to Dubai and immersed himself in the dynamic real estate sector. After gaining extensive experience with leading brokerage firms, he founded his own ventures:</p>
    <ul className="list-disc pl-6 space-y-2">
      <li><strong>Homoget Properties L.L.C. S.O.C.</strong> (Founded July 2025): A fully licensed, DLD-registered, and RERA-regulated real estate firm (ORN: 52933) specializing in off-plan and secondary market properties across Dubai.</li>
      <li><strong>Webnestic Technology</strong> (Founder): An innovative IT company with headquarters in India and a strategic operational presence in Dubai (<a href="https://www.webnestic.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">www.webnestic.com</a>), focused on high-end software development, digital solutions, and robust technological infrastructure.</li>
    </ul>
  </div>
</motion.section>

        {/* Vision & Philosophy */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Vision & Philosophy: The "HomoGet" Concept</h2>
          </div>
          <div className={`p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5`}>
            <p className="italic text-lg">"HomoGet (Homo = Human + Get = Acquire) — the belief that every product, service, or technological solution should simplify human life while remaining grounded in authentic human effort and connection."</p>
            <p className="mt-4">He and his global team are currently developing the HomoGet Search Engine — a unified digital platform designed to integrate property search, secure payments, e-commerce, ride booking, and essential services into one seamless, accessible ecosystem with minimal operational fees.</p>
            <p className="mt-4">Looking ahead, Mr. Singh is deeply committed to contributing meaningfully to society. In the coming years, he aims to work dedicatedly in the fields of Spiritual Science, Social Reform, Education, and Health. Through these domains, he aspires to play an active role in Nav Nirman — the construction of a better and more enlightened world.</p>
          </div>
        </motion.section>

        {/* Shayari Section */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Quote size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">{founder.shayari.title}</h2>
          </div>
          <div className={`max-w-2xl mx-auto p-8 rounded-3xl ${isDark ? 'bg-slate-800/30' : 'bg-amber-50'} border border-amber-500/20`}>
            <p className="text-xl md:text-2xl font-serif leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-200">
              {founder.shayari.verse}
            </p>
            <p className="mt-4 text-sm italic text-slate-500">{founder.shayari.translation}</p>
          </div>
        </motion.section>

        {/* Milestones */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <Award size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Milestones & Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {founder.milestones.map((m, idx) => (
              <div key={idx} className={`flex items-center gap-4 p-4 rounded-xl border ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xl">{m.year}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Connect Section */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <Mail size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Connect & Schedule an Appointment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Homoget Properties (Dubai) */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-amber-50/30 border-amber-100'}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-amber-500" />
                {homoget.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    {homoget.emails.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className="hover:text-amber-500 transition">{email}</a>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-500" />
                  <div className="flex flex-col">
                    {homoget.phones.map((phone, i) => (
                      <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-amber-500 transition">{phone}</a>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-amber-500" />
                  <span className="text-xs">{homoget.address}</span>
                </div>
              </div>
            </div>

            {/* Webnestic Technology (India) */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe size={18} className="text-amber-500" />
                {webnestic.name}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    {webnestic.emails.map((email, i) => (
                      <a key={i} href={`mailto:${email}`} className="hover:text-amber-500 transition">{email}</a>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-500" />
                  {webnestic.phones.map((phone, i) => (
                    <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-amber-500 transition">{phone}</a>
                  ))}
                </div>  
                  <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-amber-500" />
                  <span className="text-xs">{webnestic.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-amber-500" />
                  <a href={`https://${webnestic.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition">{webnestic.website}</a>
                </div>
                
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-6">
            <p className="text-sm font-bold mb-3">Follow on Social Media:</p>
            <div className="flex flex-wrap gap-4">
              {founder.socials.map((social, idx) => {
                const IconComponent = socialIconMap[social.icon];
                return IconComponent ? (
                  <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-amber-500 hover:text-white transition-all">
                    <IconComponent size={18} />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="text-center pt-10 border-t border-slate-200 dark:border-white/10">
          <p className="text-[10px] uppercase tracking-widest text-slate-400">© 2026 Homoget Properties | Webnestic Technology. All rights reserved.</p>
          <p className="text-[9px] text-slate-500 mt-2">Follow @truemrsingh on all platforms</p>
        </div>
      </div>
    </main>
  );
};

export default AboutFounder;