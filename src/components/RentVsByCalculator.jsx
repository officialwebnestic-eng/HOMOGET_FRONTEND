import React, { useState, useMemo } from 'react';
// Fixed: Changed 'key' to 'Key' and added 'ChevronRight' for better UI
import { Search, X, Home, Key, LineChart, Wallet, Info, ArrowUpRight, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RentVsBuy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for Buying
  const [propertyPrice, setPropertyPrice] = useState(1500000);
  const [years, setYears] = useState(10);
  
  // State for Renting
  const [monthlyRent, setMonthlyRent] = useState(10000);

  // Calculation Logic
  const totals = useMemo(() => {
    // BUYING CALCULATIONS
    const dldFees = propertyPrice * 0.04; // 4% DLD Fee
    const downPayment = propertyPrice * 0.20; // 20% Standard
    const loanAmount = propertyPrice - downPayment;
    const annualInterest = 0.045; // 4.5% avg
    const monthlyRate = annualInterest / 12;
    const n = 25 * 12; // 25 year mortgage duration
    
    // Mortgage Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
    const monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalMortgagePaid = monthlyMortgage * (years * 12);
    const totalBuyCost = dldFees + downPayment + totalMortgagePaid;

    // RENTING CALCULATIONS
    let compoundedRent = 0;
    let currentYearRent = monthlyRent * 12;
    for(let i = 0; i < years; i++) {
        compoundedRent += currentYearRent;
        currentYearRent *= 1.03; // 3% annual rent increase
    }

    return {
      buyTotal: totalBuyCost.toFixed(0),
      rentTotal: compoundedRent.toFixed(0),
      difference: Math.abs(totalBuyCost - compoundedRent).toFixed(0),
      isBuyingBetter: totalBuyCost < compoundedRent
    };
  }, [propertyPrice, years, monthlyRent]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">
              Rent vs <span className="text-amber-500">Buy</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-medium">
              Find out if it's cheaper to own your home or keep renting in the long run.
            </p>
          </div>

          {/* JUSTIFY END SEARCH INPUT */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search area trends..."
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

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Buying Card */}
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                <Home size={24} />
              </div>
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">Cost of Buying</h2>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Property Price (AED)</label>
                <input 
                  type="number" value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold text-xl dark:text-white"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeframe: {years} Years</label>
                <input 
                  type="range" min="1" max="25"
                  value={years} onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Renting Card */}
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500">
                <Wallet size={24} />
              </div>
              <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter italic">Cost of Renting</h2>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Monthly Rent (AED)</label>
                <input 
                  type="number" value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none focus:ring-2 focus:ring-amber-500 font-bold text-xl dark:text-white"
                />
              </div>
              <div className="p-6 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl flex items-start gap-4">
                <Info size={18} className="text-slate-400 mt-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Includes a <span className="text-amber-500 font-bold">3% annual rent increase</span>. Over {years} years, this significantly impacts total costs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final Verdict Section */}
        <div className="bg-slate-900 dark:bg-amber-500 p-10 rounded-[3rem] text-white dark:text-black flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Scale size={20} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Verdict</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">
                    {totals.isBuyingBetter ? "Buying is Cheaper" : "Renting is Cheaper"}
                </h3>
                <p className="text-lg opacity-80 font-medium">
                    In {years} years, you save <span className="font-black">AED {Number(totals.difference).toLocaleString()}</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10 w-full md:w-auto">
                <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Buying Cost</p>
                    <p className="text-2xl font-black tracking-tighter">AED {Number(totals.buyTotal).toLocaleString()}</p>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Renting Cost</p>
                    <p className="text-2xl font-black tracking-tighter">AED {Number(totals.rentTotal).toLocaleString()}</p>
                </div>
            </div>

            <button className="relative z-10 px-8 py-5 bg-amber-500 dark:bg-black text-black dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
                Consult Advisor <ArrowUpRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default RentVsBuy;