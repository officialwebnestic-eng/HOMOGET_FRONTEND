import React, { useState } from 'react';
import { Search, X, Ruler, Maximize, Layers, Info, ArrowRightLeft, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Measurement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sqft, setSqft] = useState(1000);
  
  // Conversion Logic
  const sqm = (sqft * 0.092903).toFixed(2);
  const sqyard = (sqft * 0.111111).toFixed(2);
  const acres = (sqft * 0.0000229568).toFixed(6);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Area <span className="text-amber-500">Converter</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-medium">
              Convert between Square Feet, Square Meters, and international units.
            </p>
          </div>

          {/* JUSTIFY END INPUT (Consistent with your pattern) */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm dark:text-white shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-red-500">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Converter Tool Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Input Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-amber-500/10 rounded-2xl">
                    <Ruler className="text-amber-500" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">Input Area Size</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Base Unit: Square Feet (SQ.FT)</p>
                </div>
            </div>

            <div className="relative group mb-12">
                <input 
                    type="number" 
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full text-6xl md:text-8xl font-black bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-200 italic tracking-tighter transition-all"
                />
                <span className="absolute right-0 bottom-4 text-amber-500 font-black text-2xl uppercase italic">Sq.Ft</span>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mt-4">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="h-full bg-amber-500"
                    />
                </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[500, 1000, 2500, 5000].map((val) => (
                    <button 
                        key={val}
                        onClick={() => setSqft(val)}
                        className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
                            sqft === val 
                            ? 'bg-amber-500 text-black border-amber-500' 
                            : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 hover:border-amber-500'
                        }`}
                    >
                        {val} Sq.Ft
                    </button>
                ))}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 dark:bg-amber-500 p-8 rounded-[2.5rem] text-white dark:text-black shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Conversions</span>
                    <Maximize size={18} className="opacity-60" />
                </div>

                <div className="space-y-8">
                    <div className="group">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Square Meters (SQ.M)</p>
                        <p className="text-3xl font-black italic tracking-tighter">{sqm}</p>
                    </div>
                    <div className="group">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Square Yards</p>
                        <p className="text-3xl font-black italic tracking-tighter">{sqyard}</p>
                    </div>
                    <div className="group">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Acres</p>
                        <p className="text-3xl font-black italic tracking-tighter">{acres}</p>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 dark:border-black/10">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                        <Info size={12} /> DLD Calculation Standard
                    </div>
                </div>
            </div>

            {/* Hint Box */}
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-200 dark:border-white/5">
                <div className="flex gap-4 items-start">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <ArrowRightLeft size={16} className="text-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        In Dubai, <span className="text-slate-900 dark:text-white font-bold">1 Square Meter</span> is approximately equal to <span className="text-slate-900 dark:text-white font-bold">10.76 Square Feet</span>.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Measurement;