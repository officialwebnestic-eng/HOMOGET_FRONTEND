import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiKey, FiClock, FiShield, FiFilter, FiX, FiSend,
  FiMaximize, FiDroplet, FiWind, FiArrowRight, FiUser, FiPhone, FiMail
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Rent = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState("Short Term");
  
  // State for the Request Viewing Drawer
  const [selectedProperty, setSelectedProperty] = useState(null);

  const rentalListings = [
    {
      id: 1,
      title: "Skyline Penthouse",
      location: "Downtown Dubai",
      price: "45,000",
      period: "Month",
      beds: 3,
      sqft: "2,400",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Royal Palm Villa",
      location: "Palm Jumeirah",
      price: "120,000",
      period: "Month",
      beds: 5,
      sqft: "6,500",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Marina Vista Suite",
      location: "Dubai Marina",
      price: "18,500",
      period: "Week",
      beds: 1,
      sqft: "950",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION (Privacy Style) --- */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Interior" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80 to-transparent' : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <FiKey className="text-amber-600" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Exclusive Rentals</span>
            </div>

            <h1 className="flex flex-col leading-[0.85] mb-8">
              <span className={`text-7xl md:text-[120px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Luxury</span>
              <span className="text-7xl md:text-[120px] font-serif italic font-light text-amber-500 tracking-tighter">Leasing</span>
            </h1>

            <p className={`text-lg md:text-xl font-bold leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Bespoke rental solutions for discerning clients. From waterfront villas to serviced penthouses, experience Dubai's finest living.
            </p>

            <div className="flex items-center gap-2 opacity-40">
              <FiClock size={14} className={isDark ? 'text-white' : 'text-black'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>Availability Updated: Jan 2026</span>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 self-start mt-10">
            {['EN', 'HI', 'AR'].map((lang) => (
              <button key={lang} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'EN' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{lang}</button>
            ))}
          </div>
        </div>
      </section>

      {/* --- LISTINGS SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Current Collections</h3>
            <p className="text-slate-500 text-sm mt-2">Browse the most sought-after rental portfolios in the city.</p>
          </div>

          <div className={`flex p-1.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            {["Short Term", "Annual", "Furnished"].map((tab) => (
              <button key={tab} onClick={() => setActiveFilter(tab)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === tab ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rentalListings.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-[3rem] overflow-hidden border transition-all duration-500 ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200 hover:shadow-2xl hover:shadow-amber-500/10'}`}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={property.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={property.title} />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">{property.location}</div>
              </div>

              <div className="p-10">
                <div className="flex justify-between items-start mb-4">
                  <h4 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{property.title}</h4>
                  <div className="text-amber-500 text-right">
                    <p className="text-xl font-black leading-none">AED {property.price}</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest opacity-50">/ {property.period}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 py-6 border-y border-white/5 mb-8">
                  <div className="flex items-center gap-2">
                    <FiDroplet className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500">{property.beds} BEDS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMaximize className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500">{property.sqft} SQFT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiWind className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-500">AC INCL.</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProperty(property)}
                  className="w-full py-5 rounded-2xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
                >
                  Request Viewing <FiArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- LUXURY BANNER --- */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={`mt-20 p-12 rounded-[3.5rem] border flex flex-col md:flex-row items-center justify-between gap-10 ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}
        >
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-black shadow-xl">
              <FiShield size={32} />
            </div>
            <div>
              <h5 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Verified Tenancy</h5>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>All contracts are EJARI regulated for maximum legal protection.</p>
            </div>
          </div>
          <button className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            Contact Specialist
          </button>
        </motion.div>
      </div>

      {/* --- REQUEST VIEWING DRAWER --- */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-xl h-full shadow-2xl p-12 flex flex-col ${isDark ? 'bg-neutral-900 border-l border-white/10' : 'bg-white'}`}
            >
              <button onClick={() => setSelectedProperty(null)} className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-amber-500 hover:text-black transition-all">
                <FiX size={20} />
              </button>

              <div className="mb-12">
                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4 block">Concierge Service</span>
                <h2 className={`text-4xl font-black tracking-tighter mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Request a Viewing</h2>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>For: <span className="text-amber-500 font-bold">{selectedProperty.title}</span></p>
              </div>

              <form className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input type="text" placeholder="John Doe" className={`w-full py-4 pl-12 pr-4 rounded-xl border outline-none focus:border-amber-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input type="tel" placeholder="+971 00 000 0000" className={`w-full py-4 pl-12 pr-4 rounded-xl border outline-none focus:border-amber-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input type="email" placeholder="john@example.com" className={`w-full py-4 pl-12 pr-4 rounded-xl border outline-none focus:border-amber-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Preferred Date</label>
                  <input type="date" className={`w-full py-4 px-4 rounded-xl border outline-none focus:border-amber-500 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200'}`} />
                </div>
              </form>

              <button className="w-full py-6 mt-8 rounded-2xl bg-amber-500 text-black text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                Confirm Request <FiSend />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rent;