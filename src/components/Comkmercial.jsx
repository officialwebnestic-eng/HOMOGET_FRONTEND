import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Download, Search, ChevronDown, ArrowRight, MoveDiagonal, Briefcase } from 'lucide-react';

// Mock data following your Off-plan card logic
const commercialData = [
  {
    id: 1,
    developer: "EMAAR BUSINESS",
    title: "The Executive Hub",
    location: "Business Bay, Dubai",
    price: "1,850,000",
    handover: "Q4 2027",
    statusLabel: "Foundation Stage",
    progress: 15,
    type: "Office",
    sqft: "2,500",
    fitout: "Fully Fitted",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 2,
    developer: "AZIZI COMMERCIAL",
    title: "Retail Pulse Plaza",
    location: "Meydan, Dubai",
    price: "1,200,000",
    handover: "Q2 2026",
    statusLabel: "Structural Completion",
    progress: 65,
    type: "Retail",
    sqft: "5,800",
    fitout: "Shell & Core",
    image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 3,
    developer: "SOBHA REALTY",
    title: "Global Logistics Hub",
    location: "JAFZA, Dubai",
    price: "2,400,000",
    handover: "Q1 2025",
    statusLabel: "Finishing Touches",
    progress: 85,
    type: "Industrial",
    sqft: "12,000",
    fitout: "Standard",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
  }
];

const Commercial = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = commercialData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION WITH FULL BG IMAGE --- */}
      <section className="relative h-screen w-full flex items-center overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Dubai Commercial Skyline"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-md mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                Commercial Collections • 2026
              </span>
            </div>

            <h1 className="text-[5.5rem] md:text-[10rem] font-black leading-[0.75] tracking-tighter text-[#0f172a] mb-8 uppercase">
              Prime <br />
              <span className="font-serif italic font-light text-amber-500 capitalize">Commerce.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl mb-12 leading-tight">
              Invest in Dubai's next business milestones. Secure high-appreciation 
              commercial assets before they break ground.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-12 py-6 bg-amber-500 text-black rounded-2xl font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all shadow-2xl shadow-amber-500/30">
                Explore Projects
              </button>
              <button className="px-12 py-6 bg-[#0f172a] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-amber-600 transition-all flex items-center gap-3">
                Asset Intelligence <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-slate-400"
        >
          <ChevronDown size={32} strokeWidth={1} />
        </motion.div>
      </section>

      {/* --- SEARCH TRANSITION BAR --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-y border-slate-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Market Filters</span>
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-[11px] font-medium text-slate-400">Districts & Asset Types</span>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <input 
              type="text"
              placeholder="Search by District or Title..."
              className="w-full pl-6 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-3 text-slate-400" size={18} />
          </div>
        </div>
      </div>

      {/* --- PROPERTY CARDS GRID (Off-plan Style) --- */}
      <section className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredProperties.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id}
                  className="group bg-white rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200/60 flex flex-col border-none"
                >
                  {/* Image Section */}
                  <div className="relative h-72 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-black/40 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/10">
                        {item.type}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-8">
                      <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest mb-1">
                        {item.developer}
                      </p>
                      <h3 className="text-3xl font-bold text-white tracking-tighter uppercase leading-none">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Data Section */}
                  <div className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center lg:text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Start Price</p>
                        <p className="text-xl font-black text-slate-900 leading-none">
                          <span className="text-xs text-slate-400 mr-1 font-bold">AED</span>
                          {item.price}
                        </p>
                      </div>
                      <div className="border-l border-slate-100 pl-6 text-center lg:text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Handover</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{item.handover}</p>
                      </div>
                    </div>

                    {/* Progress Bar Component */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                          {item.statusLabel}
                        </span>
                        <span className="text-[10px] font-black text-amber-500">
                          {item.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Technical Icons (Optional Row) */}
                    <div className="flex items-center gap-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <MoveDiagonal size={14} className="text-amber-500/50" />
                            <span className="text-[10px] font-bold uppercase">{item.sqft} sqft</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase size={14} className="text-amber-500/50" />
                            <span className="text-[10px] font-bold uppercase">{item.fitout}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                      <button className="flex-1 py-5 bg-amber-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                        Asset Intelligence
                      </button>
                      <button className="p-5 bg-white text-slate-400 rounded-2xl hover:bg-amber-500 hover:text-black transition-all border border-slate-100 shadow-sm active:scale-95">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Commercial;