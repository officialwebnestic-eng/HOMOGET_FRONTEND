import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  MoveDiagonal, 
  Briefcase, 
  Car, 
  Search, 
  SlidersHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for Dubai Commercial Properties
const commercialData = [
  {
    id: 1,
    title: "Grade A Office Space",
    location: "Business Bay, Dubai",
    price: "450,000",
    type: "Office",
    sqft: "2,500",
    parking: 4,
    fitout: "Fully Fitted",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000",
    label: "Premium"
  },
  {
    id: 2,
    title: "Luxury Retail Showroom",
    location: "City Walk, Dubai",
    price: "1,200,000",
    type: "Retail",
    sqft: "5,800",
    parking: 8,
    fitout: "Shell & Core",
    image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&q=80&w=1000",
    label: "High ROI"
  },
  {
    id: 3,
    title: "Modern Logistics Warehouse",
    location: "Jebel Ali Freezone (JAFZA)",
    price: "890,000",
    type: "Industrial",
    sqft: "15,000",
    parking: 12,
    fitout: "Standard",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000",
    label: "Strategic"
  }
];


const Commercial = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = commercialData.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">
              Commercial <span className="text-blue-600">Assets</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Investment grade offices, retail hubs, and industrial spaces across Dubai's business districts.
            </p>
          </div>

          {/* Justify-End Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search by area or asset type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-neutral-900 border-2 border-slate-200 dark:border-white/5 rounded-2xl focus:outline-none focus:border-blue-600 transition-all dark:text-white shadow-xl shadow-blue-500/5"
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              <SlidersHorizontal size={18} className="text-slate-400 cursor-pointer hover:text-blue-600" />
            </div>
          </div>
        </div>

        {/* Commercial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProperties.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.id}
                className="group bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {item.type}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                      {item.label}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold">
                    AED {item.price}<span className="text-[10px] opacity-60">/yr</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    {item.location}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Commercial Specs */}
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex flex-col items-center text-center">
                      <MoveDiagonal size={18} className="text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Size</span>
                      <span className="text-xs font-bold dark:text-white">{item.sqft} sq.ft</span>
                    </div>
                    <div className="flex flex-col items-center text-center border-x border-slate-100 dark:border-white/5">
                      <Car size={18} className="text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Parking</span>
                      <span className="text-xs font-bold dark:text-white">{item.parking} Slots</span>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <Briefcase size={18} className="text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Fit-out</span>
                      <span className="text-xs font-bold dark:text-white truncate w-full">{item.fitout}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all group/btn">
                    Enquire Now
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

export default Commercial;