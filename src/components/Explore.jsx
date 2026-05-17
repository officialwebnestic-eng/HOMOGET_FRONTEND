import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiMap, FiShield, FiClock, FiSearch } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Explore = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const destinations = [
    {
      name: "Palm Jumeirah",
      tag: "Island Living",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1000&auto=format&fit=crop",
      properties: "1.2k+ Properties"
    },
    {
      name: "Downtown Dubai",
      tag: "Urban Luxury",
      image: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=1000&auto=format&fit=crop",
      properties: "850+ Properties"
    },
    {
      name: "Dubai Marina",
      tag: "Waterfront",
      image: "https://images.unsplash.com/photo-1546412414-8035e1776c9a?q=80&w=1000&auto=format&fit=crop",
      properties: "2.1k+ Properties"
    },
    {
      name: "Emirates Hills",
      tag: "Exclusive",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
      properties: "320+ Properties"
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION (Privacy Style) --- */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop" 
            alt="Dubai Architecture" 
            className="w-full h-full object-cover"
          />
          {/* Specific mask to match your Privacy page screenshot */}
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80 to-transparent' : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }} 
            className="max-w-2xl"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <FiShield className="text-amber-600" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Neighborhood Guide</span>
            </div>

            {/* Typography */}
            <h1 className="flex flex-col leading-[0.85] mb-8">
              <span className={`text-7xl md:text-[120px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>
                Explore
              </span>
              <span className="text-7xl md:text-[120px] font-serif italic font-light text-amber-500 tracking-tighter">
                Dubai
              </span>
            </h1>

            <p className={`text-lg md:text-xl font-bold leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Homoget Properties offers a deep dive into the most prestigious residential 
              destinations across the Emirates, highlighting luxury and lifestyle.
            </p>

            {/* Timestamp */}
            <div className="flex items-center gap-2 opacity-40">
              <FiClock size={14} className={isDark ? 'text-white' : 'text-black'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>
                Last Updated: January 2026
              </span>
            </div>
          </motion.div>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 self-start mt-10">
            {['EN', 'HI', 'AR'].map((lang) => (
              <button 
                key={lang} 
                className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'EN' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- EXPLORE GRID SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        
        {/* Sub-header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Curated Districts</h3>
            <p className="text-slate-500 text-sm mt-2">Discover the unique character of Dubai's prime locations.</p>
          </div>
          <button className={`flex items-center gap-4 group text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>
            View Interactive Map 
            <span className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
              <FiMap size={18} />
            </span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((loc, index) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative h-[500px] group overflow-hidden rounded-[2.5rem] cursor-pointer shadow-xl shadow-black/5"
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90" />
              </div>

              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <div className="mb-4 translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest mb-3 inline-block">
                    {loc.tag}
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{loc.name}</h3>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-widest">{loc.properties}</p>
                </div>
                <div className="h-[1px] w-0 group-hover:w-full bg-amber-500/50 transition-all duration-700 mb-6" />
                <button className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500">
                  Explore District <FiArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={`mt-20 p-12 rounded-[3rem] border flex flex-wrap justify-center md:justify-between gap-12 ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-100 shadow-2xl shadow-amber-500/5'}`}
        >
          {[
            { label: "Active Listings", val: "25,000+" },
            { label: "Total Transactions", val: "AED 400B+" },
            { label: "Verified Agents", val: "1,200+" },
            { label: "Avg Rental Yield", val: "7.8%" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-amber-500 text-3xl font-black mb-1">{stat.val}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Explore;