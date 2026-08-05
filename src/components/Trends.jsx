// src/components/Trends.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FiTrendingUp, FiTrendingDown, FiActivity, 
  FiDownload, FiClock, FiShield, FiMapPin, FiGlobe
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { Helmet } from "react-helmet-async";
import jsPDF from "jspdf";
import "jspdf-autotable";
import getLiveDubaiTrends from "../helpers/GetLiveDubaiTrends";

const Trends = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [activeTab, setActiveTab] = useState("Apartments");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trendData, setTrendData] = useState({ Apartments: [], Villas: [], Commercial: [] });

  // Calling the real cloud network API hook on layout mount
  useEffect(() => {
    const fetchLiveTrends = async () => {
      try {
        setIsLoading(true);
        const liveData = await getLiveDubaiTrends();
        if (liveData) {
          setTrendData(liveData);
        }
      } catch (error) {
        console.error("Dashboard component failed to render API callback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveTrends();
  }, []);

  // Safe fallback to empty array prevents 'undefined' length property crashes
  const currentData = trendData[activeTab] || [];

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    const doc = new jsPDF();
    const amber = [245, 158, 11];

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Dubai Market Intelligence Report", 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | Property Type: ${activeTab}`, 14, 30);

    const tableColumn = ["Location", "Avg Price/sqft (AED)", "Change", "Gross Yield", "Transactions"];
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

  const chartData = activeTab === "Apartments" 
    ? [55, 72, 68, 85, 78, 92, 88, 96, 100, 110, 115, 122]
    : activeTab === "Villas"
      ? [48, 52, 60, 70, 78, 85, 92, 98, 105, 112, 118, 125]
      : [62, 65, 70, 74, 80, 86, 90, 95, 100, 108, 115, 120];

  return (
    <>
      <Helmet>
        <title>Dubai Real Estate Market Trends 2026 | Homoget Properties</title>
        <meta name="description" content="Live Dubai property market analytics." />
      </Helmet>

      <div className={`w-full min-h-screen transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}>
        
        {/* HERO SECTION */}
        <section className="relative w-full h-[60vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=2000&auto=format&fit=crop" 
              alt="Dubai skyline" 
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-black via-black/85 to-transparent' : 'bg-gradient-to-r from-white via-white/80 to-transparent'}`} />
          </div>

          <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <FiShield className="text-amber-500" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Live External Cloud API Hooked</span>
            </div>
            <h1 className="flex flex-col leading-[0.9] mb-6">
              <span className="text-5xl md:text-8xl font-serif font-bold italic">Market</span>
              <span className="text-5xl md:text-8xl font-serif font-light italic text-amber-500">Intelligence</span>
            </h1>
            <p className="max-w-xl text-sm md:text-base opacity-80 mb-4">
              Homoget Properties aggregates cloud API queries matching actual transaction indices across primary Dubai districts.
            </p>
            <div className="flex items-center gap-2 opacity-60 text-xs">
              <FiClock size={14} />
              <span>Network Sync Status: Online</span>
            </div>
          </div>
        </section>

        {/* DATA WORKSPACE */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold">District Performance</h2>
            </div>
            {/* Tab Toggles */}
            <div className={`flex p-1 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
              {["Apartments", "Villas", "Commercial"].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab ? 'bg-amber-500 text-black shadow-sm' : 'opacity-60'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Network Activity Loader */}
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <p className="text-xs opacity-50 tracking-wider uppercase">Querying External Cloud Datastore...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Analytics Graph Block */}
              <div className="lg:col-span-7">
                <div className={`rounded-2xl p-6 border ${isDark ? 'bg-[#0e1118] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold font-serif">{activeTab} – Historical Index</h3>
                    <FiActivity className="text-amber-500" size={20} />
                  </div>
                  <div className="h-48 w-full flex items-end gap-2 mb-6">
                    {chartData.map((val, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ height: 0 }} 
                        animate={{ height: `${val * 0.7}%` }} 
                        className={`flex-1 rounded-t ${idx === chartData.length - 1 ? 'bg-amber-500' : 'bg-amber-500/20'}`}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-white/10 text-center sm:text-left">
                    <div>
                      <p className="text-[10px] uppercase opacity-50 font-bold">Avg Price/sqft</p>
                      <p className="text-lg font-black text-amber-500">
                        {currentData.length ? Math.round(currentData.reduce((acc, obj) => acc + parseInt(String(obj.price).replace(/,/g, '')), 0) / currentData.length) : 0} AED
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase opacity-50 font-bold">Avg Gross Yield</p>
                      <p className="text-lg font-black text-emerald-500">
                        {currentData.length ? (currentData.reduce((acc, obj) => acc + parseFloat(String(obj.yield)), 0) / currentData.length).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase opacity-50 font-bold">Total Volume</p>
                      <p className="text-lg font-black">
                        {currentData.reduce((acc, obj) => acc + Number(obj.transactions), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Cards Block */}
              <div className="lg:col-span-5 space-y-4">
                {currentData.map((item) => (
                  <div 
                    key={item.area} 
                    className={`p-4 rounded-xl border flex justify-between items-center ${isDark ? 'bg-[#0e1118] border-white/5' : 'bg-white border-slate-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                        <FiTrendingUp size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm font-serif">{item.area}</h4>
                        <p className="text-[10px] opacity-40 flex items-center gap-0.5"><FiMapPin size={8}/> Dubai</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-amber-500">AED {item.price}/sqft</p>
                      <p className="text-[10px] font-bold text-emerald-500">{item.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Export Action Block */}
          <div className={`mt-12 p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-3 text-center sm:text-left">
              <FiGlobe className="text-amber-500" size={24} />
              <p className="text-xs opacity-80">Download verified index data tables compiled directly onto PDF format via remote cloud data fetch.</p>
            </div>
            <button 
              onClick={handleDownloadPDF} 
              disabled={isGenerating || isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider text-xs rounded-xl disabled:opacity-40"
            >
              {isGenerating ? "Exporting..." : "Download PDF Data"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Trends;