import React, { useState } from 'react';
import { Crown, MapPin, Maximize, BedDouble, Droplets, Search, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const luxuryData = [
  {
    id: 1,
    title: "The Royal Atlantis Penthouse",
    location: "Palm Jumeirah, Dubai",
    price: "180,000,000",
    beds: 5,
    baths: 7,
    sqft: "16,500",
    status: "Exclusive",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "Signature Desert Mansion",
    location: "Emirates Hills, Dubai",
    price: "95,000,000",
    beds: 7,
    baths: 9,
    sqft: "22,000",
    status: "VVIP",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
  }
];

const Luxury = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLuxury = luxuryData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950    c pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Title Left, Search Right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Luxury <span className="text-amber-500">Collection</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg">
              The most prestigious residences in the Dubai real estate market.
            </p>
          </div>

          {/* INPUT FIELD IN JUSTIFY END (Your Pattern) */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search luxury..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm dark:text-white shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Luxury Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          <AnimatePresence>
            {filteredLuxury.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={item.id}
                whileHover={{ y: -10 }}
                className="group bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-80">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-amber-500 text-black px-4 py-1.5 rounded-full shadow-lg">
                    <Crown size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.status}</span>
                  </div>

                  <div className="absolute bottom-6 left-8">
                    <p className="text-amber-500 font-bold text-sm mb-1 uppercase tracking-widest">Price on Request</p>
                    <h3 className="text-3xl font-bold text-white uppercase tracking-tighter italic">AED {item.price}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elite Verified</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors mb-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-slate-500 mb-8 font-medium">
                    <MapPin size={16} />
                    {item.location}
                  </div>

                  {/* High End Specs (Using your 2-column pattern) */}
                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 dark:border-white/5 mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Bedrooms</span>
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <BedDouble size={18} className="text-amber-500" />
                        <span className="font-bold">{item.beds}</span>
                      </div>
                    </div>
                    <div className="flex flex-col border-x border-slate-100 dark:border-white/5 px-4">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Area</span>
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <Maximize size={18} className="text-amber-500" />
                        <span className="font-bold">{item.sqft}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Features</span>
                      <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <Droplets size={18} className="text-amber-500" />
                        <span className="font-bold text-xs">Pool</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 group/btn hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all">
                    Request Private Tour
                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Luxury;