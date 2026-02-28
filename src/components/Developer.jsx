import React, { useState, useEffect } from "react";
import { 
  Search, Award, X, MapPin, Globe, Phone, Mail, ShieldCheck, Calendar, ArrowUpRight, CheckCircle2 
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

 const BaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/agents";
   


 
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
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0F1219]" : "bg-white"}`}>
      
      {/* --- HOMOGET HERO SECTION --- */}
      <section className="relative h-[90vh] w-full flex items-center overflow-hidden">
        {/* Background Image with Light Overlay (Matches Screenshot) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Dubai Real Estate"
          />
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
        </div>

        {/* Language Switcher Floating (Matches Screenshot) */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
            <button className="w-10 h-10 rounded-full bg-amber-500 text-white text-[10px] font-bold">EN</button>
            <button className="w-10 h-10 rounded-full text-slate-500 text-[10px] font-bold">HI</button>
            <button className="w-10 h-10 rounded-full text-slate-500 text-[10px] font-bold">AR</button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Exclusive Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1 rounded-full mb-6">
              <Award size={14} className="text-amber-500" />
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Exclusive Partners</span>
            </div>
            
            {/* Main Title (Exact Typography from Screenshot) */}
            <h1 className="text-[80px] md:text-[110px] font-black text-[#1A202C] tracking-tighter leading-[0.85] mb-4">
              Luxury <br /> 
              <span className="text-amber-500 italic">Builders.</span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
              Bespoke architectural solutions from Dubai's premier developers. Experience the masterminds shaping the city's future.
            </p>

            <div className="flex items-center gap-2 mb-10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <Calendar size={14} />
                <span>Registry Updated: Feb 2026</span>
            </div>

            {/* Floating Search Bar */}
            <div className="max-w-md relative group shadow-2xl shadow-slate-200">
              <input 
                type="text"
                placeholder="Search by brand or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-6 pr-14 py-6 bg-white rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none border-none transition-all font-bold text-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 p-2.5 rounded-xl text-white">
                <Search size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>





      {/* --- DEVELOPER GRID --- */}
      <div className="max-w-7xl mx-auto py-24 px-10">
        <div className="flex flex-col mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900">Verified Collection</h2>
            <div className="w-16 h-1 bg-amber-500 mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredDevs.map((dev) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={dev._id}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                {/* Visual Identity Area */}
                <div className="relative h-64 flex items-center justify-center bg-[#F8FAFC] p-12">
                  <img 
  src={`${BaseUrl}/agents/${dev.companyLogo}`} 
  className="w-full h-full object-contain"
  alt={dev.companyName}
/>
                  <div className="absolute top-6 left-6 px-4 py-1 rounded-full bg-white shadow-sm border border-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                    {dev.developerType}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 mb-4 uppercase">
                    {dev.companyName}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 mb-6">
                    <div>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Portfolio</p>
                      <p className="text-sm font-black text-slate-800">{dev.totalProjects}+ Units</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Established</p>
                      <p className="text-sm font-black text-slate-800">{dev.establishedYear}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedDeveloper(dev)}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-amber-500 transition-all"
                  >
                    View Registry <ArrowUpRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      <AnimatePresence>
        {selectedDeveloper && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDeveloper(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 30 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] bg-white shadow-2xl"
            >
              <button onClick={() => setSelectedDeveloper(null)} className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-amber-500 hover:text-white rounded-full transition-all z-20"><X size={20} /></button>
              
              <div className="flex flex-col md:flex-row">
                  {/* Brand Side */}
                  <div className="md:w-1/3 bg-slate-50 p-12 flex flex-col items-center justify-center border-r border-slate-100">
                    <img src={`/agents/${selectedDeveloper.companyLogo}`} className="w-full max-w-[150px] object-contain mb-6" alt="logo" />
                    <div className="text-center">
                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Verified Entity</p>
                        <p className="text-xs font-bold text-slate-400">ID: {selectedDeveloper._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="md:w-2/3 p-12">
                    <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 mb-6 uppercase">{selectedDeveloper.companyName}</h2>
                    
                    <div className="grid grid-cols-2 gap-8 mb-10">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Trade License</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                {selectedDeveloper.tradeLicenseNumber}
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">RERA Number</p>
                            <div className="flex items-center gap-2 text-slate-800 font-bold">
                                <CheckCircle2 size={16} className="text-amber-500" />
                                {selectedDeveloper.reraRegistrationNumber}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-start gap-4">
                            <MapPin className="text-amber-500 mt-1" size={18} />
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Global Headquarters</p>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{selectedDeveloper.officeAddress}</p>
                            </div>
                        </div>
                        <div className="flex gap-10">
                            <div className="flex items-center gap-3">
                                <Phone className="text-amber-500" size={18} />
                                <p className="text-sm font-bold text-slate-700">{selectedDeveloper.contactNumber}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-amber-500" size={18} />
                                <p className="text-sm font-bold text-slate-700">{selectedDeveloper.officialEmail}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl">
                        <p className="text-sm text-slate-500 leading-relaxed italic">
                            "{selectedDeveloper.details}"
                        </p>
                    </div>
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