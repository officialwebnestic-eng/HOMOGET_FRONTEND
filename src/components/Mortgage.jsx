import React, { useState, useMemo } from 'react';
import { Calculator, Search, X, Landmark, Percent, Calendar, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Mortgage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [price, setPrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(240000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);

  // Memoized calculation to prevent errors and optimize performance
  const { monthlyPayment, loanAmount, totalInterest } = useMemo(() => {
    const P = Number(price) - Number(downPayment);
    const r = (Number(rate) / 100) / 12;
    const n = Number(years) * 12;

    if (r === 0) return { 
        monthlyPayment: (P / n).toFixed(0), 
        loanAmount: P, 
        totalInterest: 0 
    };

    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = monthly * n;
    
    return {
      monthlyPayment: monthly > 0 ? monthly.toFixed(0) : 0,
      loanAmount: P > 0 ? P : 0,
      totalInterest: (totalPayable - P) > 0 ? (totalPayable - P).toFixed(0) : 0
    };
  }, [price, downPayment, rate, years]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Mortgage <span className="text-amber-500">Calculator</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-medium">
              Calculate your monthly installments for Dubai property financing.
            </p>
          </div>

          {/* Search Input - Justify End */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search bank rates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm dark:text-white shadow-sm"
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-red-500"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Controls */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Property Price */}
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Landmark size={14} className="text-amber-500" /> Sale Price (AED)
                    </label>
                    <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Required</span>
                </div>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold text-xl dark:text-white transition-all"
                />
                <input 
                  type="range" min="500000" max="20000000" step="50000"
                  value={price} onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Down Payment */}
              <div className="space-y-5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Percent size={14} className="text-amber-500" /> Down Payment (20% Min)
                </label>
                <input 
                  type="number" 
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold text-xl dark:text-white transition-all"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Min: 20%</span>
                    <span>Current: {((downPayment/price)*100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Calculator size={14} className="text-amber-500" /> Interest Rate (%)
                </label>
                <div className="relative">
                    <input 
                    type="number" step="0.01"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold text-xl dark:text-white transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Calendar size={14} className="text-amber-500" /> Duration (Years)
                </label>
                <select 
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold text-xl dark:text-white appearance-none cursor-pointer"
                >
                  {[5, 10, 15, 20, 25].map(y => <option key={y} value={y}>{y} Years</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Results Display Panel */}
          <div className="bg-slate-900 dark:bg-amber-500 p-10 rounded-[2.5rem] flex flex-col justify-between items-start text-white dark:text-black shadow-2xl relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full blur-3xl" />
            
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Estimated Monthly</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm font-bold uppercase">AED</span>
                <h2 className="text-6xl font-black italic tracking-tighter">
                  {Number(monthlyPayment).toLocaleString()}
                </h2>
              </div>
              <div className="h-1.5 w-16 bg-amber-500 dark:bg-black mb-10" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-white/10 dark:border-black/10">
                  <span className="text-xs font-bold uppercase opacity-60">Loan Amount</span>
                  <span className="font-black">AED {loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10 dark:border-black/10">
                  <span className="text-xs font-bold uppercase opacity-60">Total Interest</span>
                  <span className="font-black">AED {Number(totalInterest).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs font-bold uppercase opacity-60">Total Payable</span>
                  <span className="font-black underline decoration-2 underline-offset-4">
                    AED {(Number(loanAmount) + Number(totalInterest)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative z-10 w-full mt-12 py-5 bg-amber-500 dark:bg-black text-black dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:shadow-2xl transition-all"
            >
              Get Expert Advice <ArrowUpRight size={18} />
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Mortgage;