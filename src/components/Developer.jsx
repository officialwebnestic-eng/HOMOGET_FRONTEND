import React, { useState, useEffect } from "react";
import { 
  Search, Award, X, MapPin, Globe, Phone, Mail, ShieldCheck, 
  Calendar, ArrowUpRight, CheckCircle2, Building2, Layers, Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../axios/axios";
import { useTheme } from "../context/ThemeContext";

const Developer = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const BaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        const response = await http.get("/developers");
        if (response.data.success) {
          setDevelopers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching developers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  const filteredDevs = developers.filter((dev) =>
    dev.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dev.officeAddress && dev.officeAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDark ? "bg-[#0A0C10] text-white" : "bg-[#FDFDFD] text-slate-900"}`}>
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60"
            alt="Dubai Skyline"
          />
          <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#0A0C10]/20 via-[#0A0C10]/80 to-[#0A0C10]" : "bg-gradient-to-b from-white/10 via-white/70 to-[#FDFDFD]"}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-6 py-2 rounded-full mb-8 backdrop-blur-md">
              <Award size={16} className="text-amber-500 animate-pulse" />
              <span className="text-amber-500 text-[11px] font-black uppercase tracking-[0.3em]">The Master Architects</span>
            </div>
            
            <h1 className={`text-6xl md:text-[120px] font-black tracking-tighter leading-[0.9] mb-8 ${isDark ? "text-white" : "text-slate-900"}`}>
              ELEVATING <br /> 
              <span className="text-amber-500 italic font-serif">HORIZONS.</span>
            </h1>

            {/* Premium Search Bar */}
            <div className="max-w-2xl mx-auto relative group mt-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className={`relative flex items-center rounded-2xl border transition-all ${isDark ? "bg-[#161B26] border-white/10 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}>
                <Search className="ml-6 text-slate-400" size={20} />
                <input 
                  type="text"
                  placeholder="Search elite developers by name or region..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-7 bg-transparent rounded-2xl focus:outline-none font-bold text-sm"
                />
                <div className="mr-4 px-6 py-3 bg-amber-500 rounded-xl text-black font-black text-[10px] uppercase tracking-widest hidden md:block">
                  Discovery
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS RIBBON --- */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-[2.5rem] border backdrop-blur-xl ${isDark ? "bg-[#161B26]/80 border-white/5 shadow-2xl" : "bg-white/80 border-slate-100 shadow-xl"}`}>
          {[
            { label: "Partnered Developers", val: "45+", icon: Building2 },
            { label: "Active Projects", val: "1.2k", icon: Layers },
            { label: "Verified Registry", val: "100%", icon: ShieldCheck },
            { label: "Global Investors", val: "25k+", icon: Users },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center border-r last:border-r-0 border-white/10 px-4 text-center">
              <stat.icon className="text-amber-500 mb-2" size={20} />
              <p className="text-2xl font-black">{stat.val}</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- DEVELOPER GRID --- */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
                <h2 className={`text-5xl font-black tracking-tighter uppercase italic ${isDark ? "text-white" : "text-slate-900"}`}>The Portfolio</h2>
                <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Curated Premium Selection</p>
            </div>
            <div className={`text-sm font-bold px-6 py-2 rounded-full border ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                Total: {filteredDevs.length} Partners
            </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1,2,3].map(i => <div key={i} className="h-[400px] rounded-[3rem] bg-slate-800 animate-pulse" />)}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredDevs.map((dev) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  key={dev._id}
                  className={`group rounded-[3rem] overflow-hidden border transition-all duration-500 ${isDark ? "bg-[#161B26] border-white/5 hover:border-amber-500/50 shadow-2xl" : "bg-white border-slate-100 hover:border-amber-500 shadow-xl"}`}
                >
                  <div className={`relative h-60 flex items-center justify-center p-12 transition-colors ${isDark ? "bg-[#0F1219]" : "bg-slate-50"}`}>
                    <img 
                      src={`${BaseUrl}/agents/${dev.companyLogo}`} 
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700"
                      alt={dev.companyName}
                    />
                    <div className="absolute bottom-4 right-6 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>

                  <div className="p-10">
                    <h3 className="text-2xl font-black tracking-tighter mb-2 uppercase group-hover:text-amber-500 transition-colors">
                      {dev.companyName}
                    </h3>
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <MapPin size={12} className="text-amber-500" /> {dev.officeAddress?.split(',')[0]}
                    </p>
                    
                    <div className={`flex justify-between py-6 border-t ${isDark ? "border-white/5" : "border-slate-100"}`}>
                      <div>
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Status</p>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">Verified</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Since</p>
                        <p className="text-sm font-black italic">{dev.establishedYear}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedDeveloper(dev)}
                      className={`w-full mt-4 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-amber-500/10 ${isDark ? "bg-white text-black hover:bg-amber-500" : "bg-slate-900 text-white hover:bg-amber-500"}`}
                    >
                      Explore Portfolio
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* --- BENTO MODAL DESIGN --- */}
      <AnimatePresence>
        {selectedDeveloper && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDeveloper(null)} className="absolute inset-0 bg-[#0A0C10]/95 backdrop-blur-sm" />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 50 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                className={`relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[4rem] border shadow-2xl ${isDark ? "bg-[#161B26] border-white/10" : "bg-white border-slate-200"}`}
            >
              <button onClick={() => setSelectedDeveloper(null)} className="absolute top-10 right-10 p-4 bg-amber-500 text-black rounded-full hover:scale-110 transition-all z-20 shadow-xl"><X size={24} /></button>
              
              <div className="flex flex-col lg:flex-row">
                  {/* Left: Brand Showcase */}
                  <div className={`lg:w-2/5 p-16 flex flex-col justify-between items-center ${isDark ? "bg-[#0F1219]" : "bg-slate-50"}`}>
                    <img src={`${BaseUrl}/agents/${selectedDeveloper.companyLogo}`} className="w-full max-w-[220px] object-contain drop-shadow-2xl" alt="logo" />
                    
                    <div className="w-full space-y-4 mt-20">
                        <div className={`p-6 rounded-3xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                            <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">RERA License</p>
                            <p className="text-lg font-black">{selectedDeveloper.reraRegistrationNumber}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}>
                            <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Units</p>
                            <p className="text-lg font-black">{selectedDeveloper.totalProjects}+ Completed</p>
                        </div>
                    </div>
                  </div>

                  {/* Right: Data Bento */}
                  <div className="lg:w-3/5 p-16">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-12 h-[2px] bg-amber-500"></span>
                            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Official Developer Registry</span>
                        </div>
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">{selectedDeveloper.companyName}</h2>
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20">Active Entity</span>
                            <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase border border-blue-500/20">Dubai Freehold Approved</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500"><MapPin size={24}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Corporate HQ</p>
                                <p className="text-sm font-bold leading-relaxed">{selectedDeveloper.officeAddress}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500"><Phone size={24}/></div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Inquiries</p>
                                <p className="text-sm font-bold">{selectedDeveloper.contactNumber}</p>
                                <p className="text-sm font-bold text-slate-400 mt-1">{selectedDeveloper.officialEmail}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-10 rounded-[2.5rem] relative overflow-hidden ${isDark ? "bg-white/5 border border-white/5" : "bg-slate-50 border border-slate-100"}`}>
                        <Award className="absolute -bottom-6 -right-6 text-amber-500/10" size={150} />
                        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">The Narrative</h4>
                        <p className={`text-lg font-serif italic leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            "{selectedDeveloper.details}"
                        </p>
                    </div>

                    <button className="w-full mt-12 py-6 bg-amber-500 text-black font-black uppercase text-xs tracking-[0.3em] rounded-3xl shadow-2xl hover:bg-white transition-all transform hover:-translate-y-1">
                        Request Project Catalog
                    </button>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Developer;