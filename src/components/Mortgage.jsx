import React, { useState, useMemo } from 'react';
import { 
  Calculator, Search, X, Landmark, Percent, 
  Calendar, ArrowUpRight, ShieldCheck, Zap, 
  Globe, BarChart3, Phone, MessageCircle, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Mortgage = () => {
  const [residency, setResidency] = useState("UAE resident"); //
  const [price, setPrice] = useState(1200000); //
  const [downPayment, setDownPayment] = useState(240000); //
  const [rate, setRate] = useState(3.75); //
  const [years, setYears] = useState(25); //

  const { monthlyPayment, loanAmount, totalInterest, downPaymentPercent } = useMemo(() => {
    const P = Number(price) - Number(downPayment);
    const r = (Number(rate) / 100) / 12;
    const n = Number(years) * 12;

    const monthly = r === 0 ? (P / n) : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = monthly * n;
    
    return {
      monthlyPayment: monthly > 0 ? monthly.toFixed(0) : 0,
      loanAmount: P > 0 ? P : 0,
      totalInterest: (totalPayable - P) > 0 ? (totalPayable - P).toFixed(0) : 0,
      downPaymentPercent: ((downPayment / price) * 100).toFixed(0)
    };
  }, [price, downPayment, rate, years]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500">
      <section className="relative min-h-[80vh] flex items-center pt-10 overflow-hidden">
 
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000" 
            alt="Dubai Skyline" 
            className="w-full h-full object-cover opacity-30 dark:opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white dark:from-neutral-950/90 dark:via-neutral-950/40 dark:to-neutral-950" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <ShieldCheck size={14} /> Home Loan & Commercial Finance
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] mb-6"
            >
              Mortgage <br />
              <span className="text-amber-500 italic drop-shadow-sm">Solutions</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed mb-10"
            >
              Our expert advisors simplify the process, securing the best mortgage or refinancing options tailored to your needs.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                Connect with an advisor <ArrowUpRight size={20} />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5">
                <Award className="text-amber-500" />
                <div>
                  <p className="text-xs font-black dark:text-white uppercase tracking-tighter">1200+ 5-Star Reviews</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Trusted Globally</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS GRID (From Screenshot 6) --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Years of Experience", val: "20+", desc: "Helping thousands of homeowners" },
            { label: "Google Reviews", val: "1200+", desc: "#1 highest rated mortgage provider" },
            { label: "Applications Processed", val: "100k+", desc: "Expertise that delivers" },
            { label: "Bank Partners", val: "20+", desc: "Exclusive access to top UAE banks" }
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left">
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">{stat.val}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">{stat.label}</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CALCULATOR SECTION (From Screenshot 7) --- */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 italic underline decoration-amber-500 decoration-4 underline-offset-8">
                Estimate Payments
              </h2>
              <p className="text-slate-500 font-medium">Configure your loan details to view upfront costs and eligibility.</p>
            </div>
            
            {/* Residency Toggle */}
            <div className="flex p-1.5 bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-white/5">
              {["UAE national", "UAE resident", "Non resident"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setResidency(tab)}
                  className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                    residency === tab ? "bg-amber-500 text-black shadow-lg scale-105" : "text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Input Controls */}
            <div className="lg:col-span-2 space-y-12">
              {/* Purchase Price */}
              <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Landmark size={14} className="text-amber-500" /> Purchase Price (AED)
                  </label>
                  <span className="text-xl font-black dark:text-white">{price.toLocaleString()}</span>
                </div>
                <input 
                  type="range" min="300000" max="200000000" step="100000"
                  value={price} onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Down Payment */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Down Payment</label>
                    <span className="text-xs font-black text-amber-500">{downPaymentPercent}%</span>
                  </div>
                  <input 
                    type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none font-bold text-xl dark:text-white mb-4"
                  />
                  <input 
                    type="range" min={price * 0.2} max={price * 0.8} step="10000"
                    value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Interest Rate */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-4">Interest Rate (%)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.01" value={rate} onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border-none font-bold text-xl dark:text-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Results Sidebar */}
            <div className="lg:sticky lg:top-32 h-fit bg-slate-900 dark:bg-amber-500 p-10 rounded-[3rem] text-white dark:text-black shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60 text-center">Estimated Monthly Payment</p>
              <div className="flex flex-col items-center mb-10">
                <h2 className="text-6xl font-black italic tracking-tighter mb-1">
                  {Number(monthlyPayment).toLocaleString()}
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest">AED / Month</span>
              </div>

              <div className="space-y-6 py-8 border-y border-white/10 dark:border-black/10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="opacity-60">Loan amount (80%)</span>
                  <span>AED {loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="opacity-60">Total Interest</span>
                  <span>AED {Number(totalInterest).toLocaleString()}</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="w-full mt-10 py-5 bg-amber-500 dark:bg-black text-black dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                Check Your Eligibility <ArrowUpRight size={18} />
              </motion.button>
              
              <p className="text-center mt-6 text-[9px] font-bold uppercase opacity-40 tracking-widest italic">
                Based on current market rate of {rate}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- ADVANTAGE GRID (From Screenshot 2) --- */}
      <section className="py-24 px-4 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 italic">The Advantage</h2>
            <div className="h-1.5 w-24 bg-amber-500 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              { 
                title: "Unbiased and transparent advice", 
                desc: "Our advisors are salaried, not commission-based, ensuring our guidance is free from bank bias." 
              },
              { 
                title: "End-to-end service", 
                desc: "We manage your mortgage journey from start to finish, including handling all documentation." 
              }
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-neutral-900 border border-slate-100 dark:border-white/5 hover:border-amber-500/50 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-amber-500 mb-8 flex items-center justify-center text-black font-black text-xl italic group-hover:scale-110 transition-transform">
                  0{i+1}
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Mortgage;