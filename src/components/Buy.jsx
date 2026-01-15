import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, FiClock, FiShield, FiTag, FiX,
  FiMaximize, FiLayers, FiCompass, FiArrowRight, FiActivity, FiMapPin 
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Buy = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState("Off-Plan");
  
  // NEW: State for tracking the selected asset for the modal
  const [selectedAsset, setSelectedAsset] = useState(null);

  const salesListings = [
    {
      id: 1,
      title: "The Royal Atlantis",
      location: "Palm Jumeirah",
      price: "12,500,000",
      status: "High Demand",
      beds: 4,
      sqft: "3,850",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop",
      description: "A pinnacle of architectural brilliance on the Palm Jumeirah, offering private beach access and world-class amenities."
    },
    {
      id: 2,
      title: "Burj Vista Penthouse",
      location: "Downtown Dubai",
      price: "8,900,000",
      status: "Limited",
      beds: 3,
      sqft: "2,900",
      image: "https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=1000&auto=format&fit=crop",
      description: "Experience the heart of the city with front-row views of the Burj Khalifa and direct access to Dubai Mall."
    },
    {
      id: 3,
      title: "Vela Bay Residence",
      location: "Business Bay",
      price: "4,200,000",
      status: "New Launch",
      beds: 2,
      sqft: "1,650",
      image: "https://images.unsplash.com/photo-1600607687940-c52af04657b3?q=80&w=1000&auto=format&fit=crop",
      description: "Modern waterfront living designed for high-yield returns in Dubai's fastest-growing business district."
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop" 
            alt="Corporate Dubai Architecture" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80 to-transparent' : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <FiTag className="text-amber-600" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Premium Acquisition</span>
            </div>
            <h1 className="flex flex-col leading-[0.85] mb-8">
              <span className={`text-7xl md:text-[120px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Property</span>
              <span className="text-7xl md:text-[120px] font-serif italic font-light text-amber-500 tracking-tighter">Assets</span>
            </h1>
            <p className={`text-lg md:text-xl font-bold leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Secure your future with Dubai's most lucrative real estate opportunities. We curate high-yield residential and commercial investments.
            </p>
            <div className="flex items-center gap-2 opacity-40">
              <FiClock size={14} className={isDark ? 'text-white' : 'text-black'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>Market Session: Jan 2026</span>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 self-start mt-10">
            {['EN', 'HI', 'AR'].map((lang) => (
              <button key={lang} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'EN' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{lang}</button>
            ))}
          </div>
        </div>
      </section>

      {/* --- ASSET GRID SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Investment Portfolio</h3>
            <p className="text-slate-500 text-sm mt-2">Filter assets by construction stage and yield potential.</p>
          </div>
          <div className={`flex p-1.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            {["Off-Plan", "Ready", "Commercial"].map((tab) => (
              <button key={tab} onClick={() => setActiveCategory(tab)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === tab ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500'}`}>{tab}</button>
            ))}
          </div>
        </div>

        {/* --- THE CARD (Design Preserved Exactly) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {salesListings.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-[3rem] overflow-hidden border transition-all duration-500 ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200 hover:shadow-2xl hover:shadow-amber-500/10'}`}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={asset.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={asset.title} />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <div className="px-4 py-2 bg-amber-500 rounded-full text-black text-[10px] font-black uppercase tracking-widest">{asset.status}</div>
                  <div className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">{asset.location}</div>
                </div>
              </div>

              <div className="p-10">
                <div className="flex flex-col mb-8">
                  <h4 className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{asset.title}</h4>
                  <p className="text-amber-500 text-2xl font-black">AED {asset.price}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 mb-8">
                  <div className="flex items-center gap-3">
                    <FiLayers className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{asset.beds} BEDROOMS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMaximize className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{asset.sqft} SQFT</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* BUTTON TRIGGERS MODAL */}
                  <button 
                    onClick={() => setSelectedAsset(asset)}
                    className="flex-1 py-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all"
                  >
                    Asset Details
                  </button>
                  <button className="w-16 h-16 rounded-2xl border border-amber-500/30 flex items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-black transition-all">
                    <FiActivity size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- NEW: MODAL OVERLAY --- */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className={`relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[3rem] shadow-2xl flex flex-col md:flex-row ${isDark ? 'bg-neutral-900 border border-white/10' : 'bg-white'}`}
            >
              <button onClick={() => setSelectedAsset(null)} className="absolute top-6 right-6 z-50 p-3 bg-black/20 hover:bg-amber-500 rounded-full text-white transition-all"><FiX /></button>
              
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img src={selectedAsset.image} className="w-full h-full object-cover" alt="" />
              </div>
              
              <div className="w-full md:w-1/2 p-10 overflow-y-auto">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2 block">{selectedAsset.location}</span>
                <h2 className={`text-4xl font-black tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedAsset.title}</h2>
                <p className="text-amber-500 text-2xl font-black mb-6">AED {selectedAsset.price}</p>
                <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedAsset.description}</p>
                
                <div className="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 mb-8">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Configuration</p>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-black'}`}>{selectedAsset.beds} Beds</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Size</p>
                    <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-black'}`}>{selectedAsset.sqft} Sqft</p>
                  </div>
                </div>

                <button className="w-full py-5 rounded-2xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/10 transition-all hover:scale-[1.02]">
                  Book Private Viewing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Buy;