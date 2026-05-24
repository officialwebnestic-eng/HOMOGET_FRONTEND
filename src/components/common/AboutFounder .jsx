import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Award, Globe, Linkedin, Instagram, Twitter, 
  Facebook, Youtube, Music, Heart, Quote, Briefcase, Target, 
  Mail, MapPin, Phone, BookOpen, Sparkles, Building2,
  Calendar, Users, Shield, Compass, Coffee, PenTool, Zap
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
              <p className="text-amber-500 font-black uppercase text-sm tracking-wider">Founder & Chief Executive Officer</p>
              <p className="text-amber-500/80 text-sm tracking-wider">Founder, Webnestic Technology</p>
              <div className="flex items-center gap-2 text-sm italic text-slate-500">
                <Quote size={16} className="text-amber-500" />
                <span>"A visionary entrepreneur bridging premium Dubai real estate with global IT solutions through a deeply rooted, human-centric digital ecosystem."</span>
              </div>
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
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-6">
            <div>
              <p className="text-lg font-semibold text-amber-600">🌳 From Humble Roots to High Aspirations</p>
              <p>Mr. Singh was born on <strong>April 19, 1994</strong>, in the village of Harail, Mohiuddin Nagar, Samastipur District, Bihar, India. Raised in a values-driven, middle-class family, he imbibed the core principles of discipline, integrity, and relentless hard work from his parents.</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Father:</strong> Shri Shyam Nandan Singh (a highly respected village mathematics teacher)</li>
                <li><strong>Mother:</strong> Mrs. Asha Devi (a dedicated homemaker)</li>
                <li><strong>Family Structure:</strong> Raised in a nurturing household alongside his sibling (two brothers in total).</li>
              </ul>
            </div>

            <div>
              <p className="text-lg font-semibold text-amber-600">🧘 The Spiritual Foundation</p>
              <p>A defining, foundational influence in Mr. Singh's life was his late grandmother, <strong>Smt. Baliraj Devi</strong>, a deeply spiritual woman. From an early age, she introduced him to ancient meditation and mindfulness practices, nurturing a resilient inner core that continues to shape his entire personal and business philosophy:</p>
              <p className="italic text-amber-500 mt-2">"Life is not a destination, but a continuous journey of discovery."</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-amber-600">⚡ The Hustle and Resilience</p>
              <p>Driven by an independent, pioneering spirit, Mr. Singh left his hometown at the young age of 16 in 2011 to forge his future in Delhi. Balancing full-time work to support his living and education, he successfully graduated with a <strong>Bachelor of Arts (BA)</strong> from Darbhanga University in 2014.</p>
              <p>When financial constraints redirected him from his original ambition of preparing for the prestigious UPSC Civil Services, Delhi effectively became his real-world business school. Over the next decade, he gained deep, hands-on operational leadership experience across multiple fast-paced sectors:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>🎙️ Media & Corporate Management</li>
                <li>🏨 Hospitality & Event Management</li>
                <li>🛡️ Security Operations & Corporate Administration</li>
              </ul>
              <p className="mt-2">This diverse exposure sharpened his commercial instincts, creativity, and strategic problem-solving. After successfully launching and running an event management company in Delhi, the global pandemic prompted a strategic pivot toward international markets.</p>
              <p className="mt-2">On <strong>April 19, 2022</strong>, Mr. Singh married <strong>Mrs. Sapna Singh</strong> in a deeply spiritual ceremony at the sacred <strong>ISKCON Temple in Vrindavan</strong>, marking the beginning of a shared journey rooted in mutual values, spiritual alignment, and purpose.</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-amber-600">🎯 Hobbies & Personal Interests</p>
              <p>Mr. Singh believes in a holistic, balanced lifestyle that feeds both the intellect and the soul:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>✍️ Creative Arts:</strong> A passionate poet, author, and songwriter who finds profound joy in expressing complex human emotions through verses and melodies.</li>
                <li><strong>🧘 Spiritual Practice:</strong> Dedicated to high-level spiritual meditation combined with advanced yoga practices to maintain mental clarity and peak performance.</li>
                <li><strong>📚 Continuous Learning:</strong> Avid reader of inspirational literature, business biographies, and philosophical texts.</li>
                <li><strong>🧗 Adventure & Discovery:</strong> A strong affinity for exploration, travel, and structural/digital renovation projects, showcasing his innate desire to rebuild and optimize.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Professional Background */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <Briefcase size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Professional Background & Expertise</h2>
          </div>
          <div className={`p-8 rounded-3xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <p className="mb-4">In <strong>February 2023</strong>, Mr. Singh relocated to the ultra-competitive business hub of <strong>Dubai, UAE</strong>, immersing himself entirely in the dynamic real estate sector. After establishing a stellar track record with leading brokerage firms, he transitioned into an independent corporate leader by founding his twin powerhouse ventures:</p>
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>🏢 Homoget Properties L.L.C. S.O.C.</strong> (Founded July 2025)<br />
                A premium, fully licensed, and corporate-structured real estate firm headquartered in Dubai.
                <ul className="list-circle pl-6 mt-1 space-y-1">
                  <li><strong>Regulatory Compliance:</strong> Fully registered with the Dubai Land Department (DLD) and regulated by the Real Estate Regulatory Agency (RERA ORN: 52933).</li>
                  <li><strong>Core Specialization:</strong> High-end off-plan developments, luxury secondary market portfolios, and bespoke property investment advisory services for global HNIs.</li>
                </ul>
              </li>
              <li>
                <strong>💻 Webnestic Technology</strong> (Founder)<br />
                An innovative, cutting-edge Information Technology firm based in India (<a href="https://www.webnestic.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">www.webnestic.com</a>).
                <ul className="list-circle pl-6 mt-1 space-y-1">
                  <li><strong>Core Operations:</strong> Custom high-end software engineering, secure digital solutions, web architecture, and robust technological infrastructure designed to power enterprise-level applications.</li>
                </ul>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* Vision & Philosophy: The "HomoGet" Concept */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <Compass size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Vision & Philosophy: The "HomoGet" Concept</h2>
          </div>
          <div className={`p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5`}>
            <p className="italic text-lg mb-4">"HomoGet (Homo = Human + Get = Acquire) — the belief that every product, service, or technological solution should simplify human life while remaining grounded in authentic human effort and connection."</p>
            <p className="mt-4"><strong>🌐 The HomoGet Search Engine Project</strong></p>
            <p>Currently, Mr. Singh and his global engineering team are developing a revolutionary digital search engine. This unified ecosystem aims to seamlessly integrate:</p>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 list-disc pl-6">
              <li>🔍 Advanced Property & Asset Search</li>
              <li>💳 Secure Multi-Currency Payment Gateways</li>
              <li>🛒 Next-Generation E-Commerce Marketplaces</li>
              <li>🚗 Smart Mobility & Ride-Booking Solutions</li>
              <li>🛠️ On-Demand Essential Daily Services</li>
            </ul>
            <p className="mt-4">By eliminating middle-tier corporate inflation, this mega-platform is engineered to run on <strong>minimal operational fees</strong>, returning maximum value back to regular users.</p>
            <p className="mt-4"><strong>🏛️ Social Impact & Nav Nirman</strong></p>
            <p>Looking toward the future, Mr. Singh is fiercely committed to philanthropic nation-building. In the coming years, he intends to channel significant capital and personal dedication into:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>🔬 <strong>Spiritual Science</strong> — Bridging ancient consciousness practices with modern psychological well-being.</li>
              <li>⚖️ <strong>Social Reform</strong> — Empowering marginalized communities through entrepreneurial training.</li>
              <li>🎓 <strong>Education</strong> — Modernizing access to knowledge and skill-building frameworks.</li>
              <li>🏥 <strong>Health</strong> — Promoting preventative, holistic, and accessible healthcare solutions.</li>
            </ul>
            <p className="mt-4">Through these combined pillars, he envisions playing an active catalyst role in <strong>Nav Nirman</strong> — the systematic construction of a better, more enlightened, and technologically empowered world.</p>
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

        {/* Milestones & Achievements */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" className="space-y-6">
          <div className="flex items-center gap-3">
            <Award size={24} className="text-amber-500" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Milestones & Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { year: "2011", event: "🚀 Initiated independent entrepreneurial journey at the age of 16 in Delhi." },
              { year: "2014", event: "🎓 Successfully attained a Bachelor of Arts (BA) degree while self-financing all expenses." },
              { year: "2022", event: "💍 United in holy matrimony with Mrs. Sapna Singh at ISKCON Temple, Vrindavan." },
              { year: "2023", event: "🇦🇪 Successfully entered and scaled operations within the competitive Dubai Real Estate market." },
              { year: "2025", event: "🏢 Incorporated Homoget Properties L.L.C. S.O.C. (RERA ORN: 52933)." },
              { year: "2025", event: "🌐 Founded Webnestic Technology to drive enterprise-grade IT solutions." }
            ].map((m, idx) => (
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
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">Connect & Schedule a Strategic Consultation</h2>
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
                    <a href="mailto:founder@homoget.ae" className="hover:text-amber-500 transition">founder@homoget.ae</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-500" />
                  <div className="flex flex-col">
                    <a href="tel:+971585919585" className="hover:text-amber-500 transition">+971 58 591 9585</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-amber-500" />
                  <span className="text-xs">R-118, 2nd Floor, Wasl Building, Bur Dubai, Dubai, UAE</span>
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
                    <a href="mailto:info@webnestic.com" className="hover:text-amber-500 transition">info@webnestic.com</a>
                    <a href="mailto:hr@webnestic.com" className="hover:text-amber-500 transition text-xs">hr@webnestic.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-amber-500" />
                  <a href="tel:+91639343281" className="hover:text-amber-500 transition">+91 63934 3281</a>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-amber-500" />
                  <a href="https://www.webnestic.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition">www.webnestic.com</a>
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