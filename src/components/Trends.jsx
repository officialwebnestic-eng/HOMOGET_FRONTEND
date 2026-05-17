import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTrendingUp, FiTrendingDown, FiActivity, FiInfo, 
  FiDownload, FiClock, FiShield, FiMapPin 
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Trends = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState("Apartments");
  const [isGenerating, setIsGenerating] = useState(false);

  const trendData = [
    { area: "Dubai Marina", price: "1,550", change: "+12.4%", status: "up" },
    { area: "Palm Jumeirah", price: "3,200", change: "+18.2%", status: "up" },
    { area: "Business Bay", price: "1,100", change: "-2.1%", status: "down" },
    { area: "JVC", price: "850", change: "+5.7%", status: "up" },
    { area: "Downtown Dubai", price: "2,400", change: "+8.9%", status: "up" },
  ];

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const doc = new jsPDF();
    const amber = [245, 158, 11]; 

    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Dubai Market Intelligence Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Category: ${activeTab}`, 14, 30);

    const tableColumn = ["Location", "Avg Price/sqft (AED)", "30D Change", "Market Status"];
    const tableRows = trendData.map(item => [
      item.area, item.price, item.change, item.status === 'up' ? "Bullish" : "Correcting"
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: amber, textColor: [255, 255, 255] },
    });

    doc.save(`Dubai_Market_Trends_${activeTab.toLowerCase()}.pdf`);
    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
      
      {/* --- HERO SECTION (Privacy Policy Style) --- */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=2000&auto=format&fit=crop" 
            alt="Dubai Cityscape" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80 to-transparent' : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <FiShield className="text-amber-600" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Market Intelligence</span>
            </div>

            <h1 className="flex flex-col leading-[0.85] mb-8">
              <span className={`text-7xl md:text-[120px] font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0f172a]'}`}>Market</span>
              <span className="text-7xl md:text-[120px] font-serif italic font-light text-amber-500 tracking-tighter">Trends</span>
            </h1>

            <p className={`text-lg md:text-xl font-bold leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Homoget Properties provides real-time market analytics in accordance with Dubai Land Department (DLD) records and RERA regulations.
            </p>

            <div className="flex items-center gap-2 opacity-40">
              <FiClock size={14} className={isDark ? 'text-white' : 'text-black'} />
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-black'}`}>Last Updated: January 2026</span>
            </div>
          </motion.div>

          <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 self-start mt-10">
            {['EN', 'HI', 'AR'].map((lang) => (
              <button key={lang} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'EN' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>{lang}</button>
            ))}
          </div>
        </div>
      </section>

      {/* --- DATA SECTION --- */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Neighborhood Performance</h3>
            <p className="text-slate-500 text-sm mt-2">Live price movements across Dubai's prime districts.</p>
          </div>

          <div className={`flex p-1.5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
            {["Apartments", "Villas", "Commercial"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Analytics Chart Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`md:col-span-2 xl:col-span-2 rounded-[2.5rem] p-10 border ${isDark ? 'bg-neutral-950 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
            <div className="flex justify-between items-start mb-12">
              <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Quarterly Performance</h3>
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500"><FiActivity size={24} /></div>
            </div>
            
            <div className="h-64 w-full flex items-end gap-3 mb-10">
              {[40, 70, 55, 90, 65, 80, 100, 85, 95, 110].map((h, i) => (
                <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className={`flex-1 rounded-t-xl ${i === 9 ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-amber-500/20'}`} />
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/5">
              {[ { l: "Avg Price", v: "1.2M" }, { l: "ROI", v: "+8.4%", c: "text-green-500" }, { l: "Demand", v: "High" }, { l: "Inventory", v: "3.2k" } ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.l}</p>
                  <p className={`text-xl font-black ${stat.c || (isDark ? 'text-white' : 'text-slate-900')}`}>{stat.v}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* District List Sidebar */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">Top Gainers</p>
            {trendData.map((item, index) => (
              <motion.div key={item.area} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`p-5 rounded-[2rem] border transition-all ${isDark ? 'bg-neutral-900/50 border-white/5 hover:bg-neutral-900' : 'bg-white border-slate-200 hover:shadow-lg'}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{item.status === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}</div>
                    <div>
                      <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.area}</h4>
                      <p className="text-[10px] font-bold text-slate-500">AED {item.price}/sqft</p>
                    </div>
                  </div>
                  <p className={`text-sm font-black ${item.status === 'up' ? 'text-green-500' : 'text-red-500'}`}>{item.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* --- EXPORT BANNER --- */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className={`mt-16 p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-amber-500 flex-shrink-0 flex items-center justify-center text-black"><FiInfo size={28} /></div>
            <div>
              <h5 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Market Transparency</h5>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Official data processed directly from Dubai Land Department (DLD) transactions.</p>
            </div>
          </div>
          <button onClick={handleDownloadPDF} disabled={isGenerating} className={`flex items-center gap-3 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
            {isGenerating ? "Processing..." : <><FiDownload size={18} /> Download Analytics PDF</>}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Trends;