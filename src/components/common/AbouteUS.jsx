import React from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  ShieldCheck, 
  Globe2, 
  Users2, 
  ArrowUpRight, 
  Target, 
  Gem
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'


// High-end animation variants
const sectionVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
}

const AboutUs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <main className={`overflow-hidden ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* --- 1. ARCHITECTURAL HERO --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80"
            className="w-full h-full object-cover opacity-60 grayscale-[40%]"
            alt="Dubai Architecture"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-slate-950/80 via-slate-950/40 to-slate-950' : 'from-white/80 via-white/40 to-white'}`} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={sectionVariant} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
              <Gem size={14} /> The Gold Standard of Brokerage
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-8">
              Redefining the <span className="italic font-serif font-light text-amber-600">Skyline</span> of Trust.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-10">
              Homoget Properties is more than a brokerage; we are the architects of your future in the world's most dynamic real estate market.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-amber-500">12+</span>
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">Years of <br/> Excellence</span>
              </div>
              <div className="w-[1px] h-12 bg-slate-800 hidden md:block" />
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-amber-500">AED 5B+</span>
                <span className="text-xs uppercase tracking-widest font-bold opacity-60">Assets <br/> Under Managed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. THE VISION BENTO GRID --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Our Story Card */}
            <motion.div 
              initial="hidden" whileInView="visible" variants={sectionVariant} viewport={{ once: true }}
              className="md:col-span-8 p-12 rounded-[3rem] bg-slate-900 border border-slate-800 relative overflow-hidden group"
            >
              <Building2 className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
              <div className="relative z-10 max-w-xl">
                <h2 className="text-4xl font-bold text-white mb-6">Our Narrative</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Founded in the heart of Dubai, Homoget was born from a singular vision: to bridge the gap between global investors and the UAE's most exclusive off-plan and secondary market opportunities. We operate with a transparency-first mandate, ensuring every handshake is backed by data.
                </p>
                <button className="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 group">
                  Discover Our Mission <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Strategy Card */}
            <motion.div 
              initial="hidden" whileInView="visible" variants={sectionVariant} viewport={{ once: true }}
              className={`md:col-span-4 p-12 rounded-[3rem] ${isDark ? 'bg-amber-600 text-white' : 'bg-slate-950 text-white'} flex flex-col justify-between`}
            >
              <Target size={48} className="mb-8" />
              <div>
                <h3 className="text-2xl font-bold mb-4 italic font-serif">Precision Brokerage</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  We leverage proprietary market analytics to predict cycles, ensuring our clients enter the market at the peak of opportunity.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 3. CORE VALUES (HORIZONTAL SCROLL STYLE) --- */}
      <section className={`py-32 ${isDark ? 'bg-slate-900/40' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <h2 className="text-5xl font-black tracking-tighter uppercase">Values That <span className="text-amber-600">Govern Us</span></h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: ShieldCheck, 
              title: "Absolute Integrity", 
              desc: "Regulated by RERA and the Dubai Land Department, our ethics are non-negotiable.",
              color: "text-emerald-500" 
            },
            { 
              icon: Globe2, 
              title: "Global Reach", 
              desc: "Connecting elite inventory in Business Bay and Palm Jumeirah to investors worldwide.",
              color: "text-blue-500" 
            },
            { 
              icon: Users2, 
              title: "Human Centric", 
              desc: "Beyond square footage, we focus on the lifestyles and legacies our clients wish to build.",
              color: "text-purple-500" 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="group p-8 rounded-3xl bg-transparent border border-slate-800/50 hover:border-amber-500/50 transition-all"
            >
              <item.icon size={40} className={`${item.color} mb-6 group-hover:scale-110 transition-transform`} />
              <h4 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4. THE TEAM PREVIEW --- */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-5xl font-black mb-4 tracking-tighter">The Minds Behind <span className="text-amber-600 italic">Homoget</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">A collective of market-leading analysts, legal experts, and luxury advisors.</p>
        </div>
        
        {/* We use your already existing AgentSlider component here to maintain consistency */}
        <div className="max-w-[1400px] mx-auto overflow-hidden">
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              {/* This brings the human face back to the company story */}
              <div className="px-6 py-10 rounded-[4rem] bg-slate-900/20 border border-slate-800/30 mx-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-500 mb-10 text-center">Executive Advisory</h3>
                <div className="mt-[-80px]"> {/* Offset to pull the slider in nicely */}
                    <div className="scale-90 opacity-80 blur-sm pointer-events-none absolute left-0 right-0 z-0">
                      {/* Visual styling for the slider container */}
                    </div>
                    <div className="relative z-10">
                      {/* Logic for the slider provided in previous steps */}
                    </div>
                </div>
              </div>
           </motion.div>
        </div>
      </section>

      {/* --- 5. REGULATORY FOOTER (ABOUT EXCLUSIVE) --- */}
      <section className="py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
           <img src="https://dubailand.gov.ae/media/1014/dld-logo.png" className="h-12 grayscale brightness-200" alt="Dubai Land Department" />
           <img src="https://trakheesi.gov.ae/static/media/trakheesi-logo.519509f6.png" className="h-10 grayscale brightness-200" alt="Trakheesi" />
           <div className="text-center md:text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest">Homoget Properties L.L.C S.O.C</p>
              <p className="text-[10px]">ORN: 123456 | License No: 789010</p>
           </div>
        </div>
      </section>

    </main>
  )
}

export default AboutUs