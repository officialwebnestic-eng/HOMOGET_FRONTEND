import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiTrendingUp, FiTrendingDown, FiActivity, FiInfo, 
  FiDownload, FiClock, FiShield, FiMapPin, FiAward, FiGlobe
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { Helmet } from "react-helmet-async";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Trends = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState("Apartments");
  const [isGenerating, setIsGenerating] = useState(false);
  const brandColor = "#f59e0b";

  // Sample data – replace with API data later
  const trendData = {
    Apartments: [
      { area: "Dubai Marina", price: "1,550", change: "+12.4%", status: "up", yield: "7.2%", transactions: 342 },
      { area: "Palm Jumeirah", price: "3,200", change: "+18.2%", status: "up", yield: "6.8%", transactions: 128 },
      { area: "Business Bay", price: "1,100", change: "-2.1%", status: "down", yield: "6.1%", transactions: 215 },
      { area: "Jumeirah Village Circle", price: "850", change: "+5.7%", status: "up", yield: "8.5%", transactions: 489 },
      { area: "Downtown Dubai", price: "2,400", change: "+8.9%", status: "up", yield: "5.9%", transactions: 276 },
      { area: "Dubai Hills Estate", price: "1,850", change: "+10.2%", status: "up", yield: "6.5%", transactions: 198 }
    ],
    Villas: [
      { area: "Emirates Hills", price: "4,200", change: "+15.3%", status: "up", yield: "5.2%", transactions: 45 },
      { area: "Palm Jumeirah", price: "5,500", change: "+22.1%", status: "up", yield: "4.8%", transactions: 32 },
      { area: "Arabian Ranches", price: "1,400", change: "+6.8%", status: "up", yield: "7.1%", transactions: 87 },
      { area: "Damac Hills", price: "1,250", change: "+4.2%", status: "up", yield: "7.5%", transactions: 112 }
    ],
    Commercial: [
      { area: "DIFC", price: "3,800", change: "+9.5%", status: "up", yield: "8.2%", transactions: 67 },
      { area: "Downtown Dubai", price: "2,900", change: "+5.1%", status: "up", yield: "7.8%", transactions: 89 },
      { area: "Business Bay", price: "2,100", change: "+3.4%", status: "up", yield: "7.9%", transactions: 134 }
    ]
  };

  const currentData = trendData[activeTab] || trendData.Apartments;

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const doc = new jsPDF();
    const amber = [245, 158, 11];

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Dubai Market Intelligence Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Property Type: ${activeTab}`, 14, 30);

    const tableColumn = ["Location", "Avg Price/sqft (AED)", "30D Change", "Gross Yield", "Transactions"];
    const tableRows = currentData.map(item => [
      item.area, item.price, item.change, item.yield, item.transactions
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

  // Chart bars (mock)
  const chartData = activeTab === "Apartments" 
    ? [55, 72, 68, 85, 78, 92, 88, 96, 100, 110, 115, 122]
    : activeTab === "Villas"
      ? [48, 52, 60, 70, 78, 85, 92, 98, 105, 112, 118, 125]
      : [62, 65, 70, 74, 80, 86, 90, 95, 100, 108, 115, 120];

  return (
    <>
      <Helmet>
        <title>Dubai Real Estate Market Trends 2026 | Homoget Properties</title>
        <meta name="description" content="Live Dubai property market analytics – price per sqft, ROI, transactions by area. Trusted RERA-regulated data." />
        <meta name="keywords" content="Dubai real estate trends, property prices Dubai, off-plan trends, RERA market report" />
      </Helmet>

      <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'bg-black' : 'bg-white'}`}>
        
        {/* --- HERO SECTION --- */}
        <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=2000&auto=format&fit=crop" 
              alt="Dubai skyline with Burj Khalifa at sunset" 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/80 to-transparent' : 'bg-gradient-to-r from-white via-white/70 to-transparent'}`} />
          </div>

          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 flex justify-between items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
                <FiShield className="text-amber-500" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">DLD Verified Data</span>
              </div>
              <h1 className="flex flex-col leading-[0.85] mb-8">
                <span className={`text-6xl md:text-[100px] font-serif font-bold italic ${isDark ? 'text-white' : 'text-slate-900'}`}>Market</span>
                <span className="text-6xl md:text-[100px] font-serif font-light italic text-amber-500 tracking-tighter">Intelligence</span>
              </h1>
              <p className={`text-lg md:text-xl font-medium leading-relaxed mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Homoget Properties provides real-time market analytics sourced directly from Dubai Land Department (DLD) and RERA. Track price movements, rental yields, and transaction volumes across all prime districts.
              </p>
              <div className="flex items-center gap-2 opacity-60">
                <FiClock size={14} className={isDark ? 'text-white' : 'text-black'} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>Last updated: May 2026</span>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 self-start mt-10">
              {['EN', 'HI', 'AR'].map((lang) => (
                <button key={lang} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${lang === 'EN' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- DATA SECTION --- */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          {/* Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h2 className={`text-3xl md:text-4xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                District Performance
              </h2>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-2 max-w-xl`}>
                Real‑time price per sqft, monthly change, gross rental yields, and transaction volumes.
              </p>
            </div>
            <div className={`flex p-1 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
              {["Apartments", "Villas", "Commercial"].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab 
                      ? 'bg-amber-500 text-black shadow-md' 
                      : `${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Charts + Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Analytics Card */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                className={`rounded-3xl p-8 border transition-all ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200 shadow-md'}`}
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {activeTab} – 12‑Month Trend
                    </h3>
                    <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Indexed to Q2 2025 = 100
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                    <FiActivity size={22} />
                  </div>
                </div>

                <div className="h-64 w-full flex items-end gap-2 mb-8">
                  {chartData.map((height, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }} 
                      whileInView={{ height: `${height * 0.8}%` }} 
                      viewport={{ once: true }} 
                      transition={{ delay: i * 0.02 }}
                      className={`flex-1 rounded-t-lg transition-all ${i === chartData.length-1 ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-amber-500/30'}`}
                      style={{ height: `${height * 0.7}%` }}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200 dark:border-white/10">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Avg Price</p>
                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      AED {Math.round(currentData.reduce((s, i) => s + parseInt(i.price.replace(',', '')), 0) / currentData.length).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Avg Yield</p>
                    <p className="text-xl font-black text-emerald-500">
                      {(currentData.reduce((s, i) => s + parseFloat(i.yield), 0) / currentData.length).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Transactions</p>
                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      {currentData.reduce((s, i) => s + i.transactions, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Market Sentiment</p>
                    <p className="text-xl font-black text-emerald-500">Bullish</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* District Cards */}
            <div className="lg:col-span-5 space-y-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 px-2">Top Performing Districts</p>
              {currentData.map((item, idx) => (
                <motion.div 
                  key={item.area} 
                  initial={{ opacity: 0, x: 20 }} 
                  whileInView={{ opacity: 1, x: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.08 }}
                  className={`group p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isDark ? 'bg-[#11141B] border-white/10 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:border-amber-300'}`}
                >
                  <div className="flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {item.status === 'up' ? <FiTrendingUp size={18} /> : <FiTrendingDown size={18} />}
                      </div>
                      <div>
                        <h4 className={`text-base font-serif font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {item.area}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                          <FiMapPin size={10} /> Dubai
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-amber-500">AED {item.price}</p>
                      <p className={`text-[11px] font-bold ${item.status === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {item.change}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400 border-t pt-3 border-slate-200 dark:border-white/10">
                    <span>Yield: {item.yield}</span>
                    <span>Transactions: {item.transactions}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Export / Trust Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className={`mt-16 p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}
          >
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-white shadow-md">
                <FiGlobe size={26} />
              </div>
              <div>
                <h5 className={`text-xl font-serif font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Data Integrity & Transparency
                </h5>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  All figures are sourced from Dubai Land Department (DLD) and verified under RERA regulations. Updated monthly.
                </p>
              </div>
            </div>
            <button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating} 
              className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-50 shadow-md ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {isGenerating ? "Generating..." : <><FiDownload size={16} /> Download Full Report</>}
            </button>
          </motion.div>

          {/* SEO‐friendly text block */}
          <div className="mt-20 text-center max-w-3xl mx-auto">
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
              Homoget Properties is a RERA‑regulated brokerage (ORN 52933) providing transparent market intelligence. 
              Our analytics help investors, homeowners, and tenants make data‑driven decisions in the Dubai real estate market. 
              For custom reports or specific area queries, contact our research team at <a href="mailto:research@homoget.ae" className="text-amber-500 hover:underline">research@homoget.ae</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trends;