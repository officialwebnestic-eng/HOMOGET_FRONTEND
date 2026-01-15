import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowRight, FiMapPin, FiCalendar, FiTrendingUp, 
  FiPieChart, FiLayout, FiInfo, FiX, FiDownload, FiActivity 
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const OffPlan = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedProject, setSelectedProject] = useState(null);

  const offPlanProjects = [
    {
      id: 1,
      name: "The Continuum",
      developer: "Emaar Properties",
      location: "Dubai Creek Harbour",
      handover: "Q4 2027",
      startingPrice: "1,850,000",
      progress: 15,
      status: "Foundation Stage",
      yield: "8.5%",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
      features: ["Infinity Bridge Access", "Smart Home Tech", "Crystal Lagoon View"]
    },
    {
      id: 2,
      name: "Riviera Rêve",
      developer: "Azizi Developments",
      location: "Meydan",
      handover: "Q2 2026",
      startingPrice: "1,200,000",
      progress: 65,
      status: "Structural Completion",
      yield: "9.2%",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000&auto=format&fit=crop",
      features: ["Private Lift Access", "Beachfront Living", "French Riviera Style"]
    },
    {
      id: 3,
      name: "Ellington House IV",
      developer: "Ellington",
      location: "Dubai Hills Estate",
      handover: "Q1 2025",
      startingPrice: "2,400,000",
      progress: 85,
      status: "Finishing Touches",
      yield: "7.8%",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
      features: ["Golf Course View", "Wellness Center", "Art-led Design"]
    }
  ];

  const colors = {
    bg: isDark ? "bg-[#050505]" : "bg-slate-50",
    card: isDark ? "bg-[#0A0A0A] border-white/5" : "bg-white border-slate-200",
    text: isDark ? "text-white" : "text-slate-900",
    sub: isDark ? "text-slate-400" : "text-slate-500",
  };

  return (
    <div className={`w-full min-h-screen ${colors.bg} transition-colors duration-700`}>
      
      {/* --- HERO SECTION: CINEMATIC FUTURE --- */}
    {/* --- HERO SECTION: CINEMATIC FUTURE --- */}
<section className="relative w-full h-[85vh] flex items-center overflow-hidden bg-slate-900">
  {/* Background Layer */}
  <div className="absolute inset-0 z-0">
    <img 
      src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=2000" 
      alt="Dubai Future Skyline" 
      className="w-full h-full object-cover"
      onError={(e) => {
        // Fallback if image fails
        e.target.src = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000";
      }}
    />
    {/* Multi-layered gradient for depth and text contrast */}
    <div className={`absolute inset-0 ${isDark 
      ? 'bg-gradient-to-b from-black/70 via-black/40 to-black' 
      : 'bg-gradient-to-b from-white/60 via-white/20 to-white'}`} 
    />
    <div className={`absolute inset-0 ${isDark 
      ? 'bg-gradient-to-r from-black via-transparent to-transparent' 
      : 'bg-gradient-to-r from-white via-transparent to-transparent'}`} 
    />
  </div>

  <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10">
    <motion.div 
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 1 }}
      className="max-w-3xl"
    >
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-10 backdrop-blur-md">
        <FiActivity className="text-amber-500 animate-pulse" size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">
          Off-Plan Collections • 2026
        </span>
      </div>

      <h1 className="flex flex-col leading-[0.8] mb-10">
        <span className={`text-7xl md:text-[130px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Future
        </span>
        <span className="text-7xl md:text-[130px] font-serif italic font-light text-amber-500 tracking-tighter">
          Horizon
        </span>
      </h1>

      <p className={`text-xl md:text-2xl font-bold leading-relaxed mb-12 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        Invest in Dubai's next architectural milestones. Secure high-appreciation assets before they break ground.
      </p>

      <div className="flex flex-wrap gap-6">
        <button className="px-12 py-6 bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20">
          Explore Projects
        </button>
      </div>
    </motion.div>
  </div>
</section>

      {/* --- MAIN GRID SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        
        {/* Section Title */}
        <div className="mb-20">
          <h3 className={`text-3xl font-black tracking-tight ${colors.text}`}>Spotlight Developments</h3>
          <p className="text-slate-500 text-sm mt-2">Verified projects from Tier-1 Developers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {offPlanProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group rounded-[3.5rem] overflow-hidden border ${colors.card} transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/5`}
            >
              <div className="relative h-80 overflow-hidden">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                  {project.location}
                </div>
                
                <div className="absolute bottom-8 left-8">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{project.developer}</p>
                  <h3 className="text-3xl font-black text-white tracking-tighter">{project.name}</h3>
                </div>
              </div>

              <div className="p-12">
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${colors.sub} mb-1`}>Start Price</p>
                    <p className={`text-lg font-black ${colors.text}`}>AED {project.startingPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${colors.sub} mb-1`}>Handover</p>
                    <p className={`text-lg font-black ${colors.text}`}>{project.handover}</p>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="space-y-3 mb-12">
                  <div className="flex justify-between items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>{project.status}</span>
                    <span className="text-[10px] font-bold text-amber-500">{project.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.2 }}
                      className="h-full bg-amber-500" 
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 py-5 rounded-2xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                  >
                    Asset Intelligence
                  </button>
                  <button className={`w-16 h-16 rounded-2xl border ${isDark ? 'border-white/10' : 'border-slate-200'} flex items-center justify-center ${colors.text} hover:bg-amber-500 hover:text-black transition-all`}>
                    <FiDownload size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- MODAL --- (Same as before but refined) */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[4rem] ${colors.card} border flex flex-col md:flex-row`}
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 z-50 p-4 bg-white/10 hover:bg-amber-500 rounded-full transition-all text-white"><FiX /></button>
              
              <div className="w-full md:w-1/2 h-[400px] md:auto">
                <img src={selectedProject.image} className="w-full h-full object-cover" alt="" />
              </div>

              <div className="w-full md:w-1/2 p-12 md:p-16 overflow-y-auto">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4 block">{selectedProject.location}</span>
                <h2 className={`text-5xl font-black mb-8 tracking-tighter ${colors.text}`}>{selectedProject.name}</h2>
                
                <div className="grid grid-cols-2 gap-10 mb-12">
                  <div>
                    <FiTrendingUp className="text-amber-500 mb-3" size={24}/>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI Est.</p>
                    <p className={`text-xl font-bold ${colors.text}`}>{selectedProject.yield}</p>
                  </div>
                  <div>
                    <FiPieChart className="text-amber-500 mb-3" size={24}/>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Developer</p>
                    <p className={`text-xl font-bold ${colors.text}`}>{selectedProject.developer.split(' ')[0]}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-12">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Premium Features</p>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedProject.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-amber-500" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-full py-6 rounded-3xl bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-amber-500/20">
                  Request Private Briefing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OffPlan;