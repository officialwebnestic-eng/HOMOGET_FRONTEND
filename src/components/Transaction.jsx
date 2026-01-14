import React, { useState } from 'react';
import { Search, X, ArrowUpRight, Filter, TrendingUp, Calendar, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const transactionsData = [
  {
    id: "TRX-9902",
    property: "Burj Khalifa",
    area: "Downtown Dubai",
    type: "Apartment",
    price: "4,250,000",
    size: "1,650",
    date: "12 Jan 2026",
    status: "Completed"
  },
  {
    id: "TRX-8841",
    property: "Porto Playa",
    area: "Hayat Island",
    type: "Villa",
    price: "8,900,000",
    size: "4,200",
    date: "10 Jan 2026",
    status: "Off-Plan"
  },
  {
    id: "TRX-7723",
    property: "Marina Gate",
    area: "Dubai Marina",
    type: "Penthouse",
    price: "12,150,000",
    size: "5,800",
    date: "08 Jan 2026",
    status: "Completed"
  },
  {
    id: "TRX-6610",
    property: "Address Harbor Point",
    area: "Dubai Creek Harbour",
    type: "Apartment",
    price: "2,400,000",
    size: "1,100",
    date: "05 Jan 2026",
    status: "Completed"
  }
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactionsData.filter(item =>
    item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-500 rounded-lg">
                    <TrendingUp size={16} className="text-black" />
                </div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Live DLD Data</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase italic tracking-tighter">
              Market <span className="text-amber-500">Transactions</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg font-medium">
              Real-time sales registry for all Dubai property transfers.
            </p>
          </div>

          {/* JUSTIFY END SEARCH INPUT */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input 
              type="text"
              placeholder="Search by building or area..."
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

        {/* Transactions Table Container */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Property & Area</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Asset Type</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Price (AED)</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Size (Sq.Ft)</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Date</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <AnimatePresence>
                  {filteredTransactions.map((trx) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={trx.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">{trx.property}</p>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <MapPin size={10} /> {trx.area}
                                </p>
                            </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-white/5 dark:text-slate-300 rounded-full">
                            {trx.type}
                        </span>
                      </td>
                      <td className="p-6">
                        <p className="font-black text-slate-900 dark:text-white">AED {trx.price}</p>
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">Verified Transfer</p>
                      </td>
                      <td className="p-6 text-sm font-bold text-slate-500 dark:text-slate-400">{trx.size}</td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <Calendar size={14} /> {trx.date}
                        </div>
                      </td>
                      <td className="p-6">
                        <button className="p-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all shadow-lg">
                            <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-bold uppercase tracking-widest">No matching records found</p>
            </div>
          )}
        </div>
        
        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
                { label: "Total Volume (24h)", val: "AED 1.2B", grow: "+12%" },
                { label: "Transactions (24h)", val: "482", grow: "+5%" },
                { label: "Avg. Price / Sqft", val: "AED 1,850", grow: "-2%" }
            ].map((stat, i) => (
                <div key={i} className="p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-white/5 flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black dark:text-white uppercase italic">{stat.val}</p>
                    </div>
                    <span className={`text-xs font-black ${stat.grow.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.grow}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;