import React, { useState, useEffect } from "react";
import {
  Search, Award, X, MapPin, Globe, Phone, Mail, ShieldCheck,
  Calendar, ArrowUpRight, CheckCircle2, Building2, Layers, Users, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../axios/axios";
import { useTheme } from "../context/ThemeContext";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

const Developer = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const navigate = useNavigate();

  const BaseUrl = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000";
  
  // ✅ Get partner ID from either query params or path params
  const partnerId = searchParams.get('partner') || id;

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        
        // ✅ If partnerId exists and looks like a valid ID, try to fetch it directly
        if (partnerId && partnerId.length === 24) { // MongoDB ObjectId is 24 characters
          try {
            const response = await http.get(`/developers/${partnerId}`);
            if (response.data.success) {
              const developer = response.data.data;
              setDevelopers([developer]);
              setFilteredDevelopers([developer]);
              setSelectedDeveloper(developer);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error fetching single developer:", error);
            // Fall through to fetch all
          }
        }
        
        // ✅ Fetch all developers (fallback or when no partnerId)
        const response = await http.get("/developers");
        if (response.data.success) {
          const allDevelopers = response.data.data;
          setDevelopers(allDevelopers);
          
          // If partnerId exists but single fetch failed, try filtering from all
          if (partnerId) {
            const filtered = allDevelopers.filter(dev => dev._id === partnerId);
            setFilteredDevelopers(filtered);
            if (filtered.length === 1) {
              setSelectedDeveloper(filtered[0]);
            } else {
              setFilteredDevelopers(allDevelopers);
            }
          } else {
            setFilteredDevelopers(allDevelopers);
          }
        }
      } catch (error) {
        console.error("Error fetching developers:", error);
        setFilteredDevelopers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, [partnerId]);

  // ✅ Filter developers based on search term
  useEffect(() => {
    const baseList = partnerId ? developers.filter(dev => dev._id === partnerId) : developers;
    const filtered = baseList.filter((dev) =>
      dev.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.officeAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevelopers(filtered);
  }, [searchTerm, developers, partnerId]);

  // Helper function to get developer image
  const getDeveloperImage = (developer) => {
    const imagePath = developer.profilePhoto || developer.companyLogo || developer.image;
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${BaseUrl}/developers/${imagePath}`;
  };

  // ✅ Handle closing modal and navigating back
  const handleCloseModal = () => {
    setSelectedDeveloper(null);
    // If we came from a partner link, navigate back to all developers
    if (partnerId) {
      navigate('/developer');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? "bg-[#0a0a0c] text-white" : "bg-slate-50 text-slate-900"}`}>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-50"
            alt="Dubai Skyline"
          />
          <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-black/40 via-black/80 to-black" : "bg-gradient-to-b from-white/10 via-white/60 to-slate-50"}`} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 text-left">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <Award size={14} className="text-amber-500" />
              <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em]">
                {partnerId ? "Featured Partner" : "The Master Architects"}
              </span>
            </div>

            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1] mb-6 ${isDark ? "text-white" : "text-slate-900"}`}>
              {partnerId ? "PREMIER" : "ELEVATING"} <br />
              <span className="text-amber-500 italic">{partnerId ? "PARTNER" : "HORIZONS."}</span>
            </h1>

            {/* Show back button if partner is filtered */}
            {partnerId && (
              <button
                onClick={() => navigate('/developer')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-500 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-black transition-all mb-4"
              >
                <ArrowUpRight size={14} className="rotate-180" /> Back to All Developers
              </button>
            )}

            {/* Search Bar */}
            <div className="max-w-xl relative group mt-4">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
              <div className={`relative flex items-center rounded-lg border transition-all ${isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                <Search className="ml-4 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={partnerId ? "Search within this partner..." : "Search by developer name or region..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3.5 bg-transparent rounded-lg focus:outline-none font-medium text-sm"
                />
                <div className="mr-1.5 px-4 py-2 bg-amber-500 rounded-md text-black font-bold text-[9px] uppercase tracking-wider hidden md:block">
                  Search
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    

      {/* --- DEVELOPER GRID --- */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className={`text-3xl md:text-4xl font-serif font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
              {partnerId ? "Featured " : "The "} <span className="text-amber-500">Portfolio</span>
            </h2>
            <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">
              {partnerId ? "Premium Partner Selection" : "Curated Premium Selection"}
            </p>
          </div>
          <div className={`text-xs font-bold px-4 py-1.5 rounded-full border ${isDark ? "border-white/10 text-slate-400" : "border-slate-200 text-slate-500"}`}>
            {filteredDevelopers.length} {filteredDevelopers.length === 1 ? "Partner" : "Partners"}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-[400px] rounded-2xl bg-slate-800/20 animate-pulse" />)}
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <div className="text-center py-20">
            <Building2 size={48} className="mx-auto text-slate-500 opacity-30 mb-4" />
            <p className="text-lg font-bold">No developers found</p>
            <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredDevelopers.map((dev) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  key={dev._id}
                  className={`group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${isDark ? "bg-[#11141B] border-white/5 hover:border-amber-500/40" : "bg-white border-slate-200 hover:shadow-xl"}`}
                  onClick={() => setSelectedDeveloper(dev)}
                >
                  <div className={`relative h-48 flex items-center justify-center p-8 transition-colors ${isDark ? "bg-black/20" : "bg-slate-50"}`}>
                    <img
                      src={getDeveloperImage(dev) || `${BaseUrl}/developers/${dev.companyLogo}`}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      alt={dev.companyName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.companyName)}&background=C5A059&color=fff&bold=true&size=100`;
                      }}
                    />
                    <div className="absolute bottom-3 right-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold tracking-tight mb-1 uppercase group-hover:text-amber-500 transition-colors">
                      {dev.companyName}
                    </h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center gap-1">
                      <MapPin size={10} className="text-amber-500" /> {dev.officeAddress?.split(',')[0] || "Dubai"}
                    </p>

                    <div className="flex justify-between py-4 border-t border-slate-200 dark:border-white/10">
                      <div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">Status</p>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase">Verified</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-1">Projects</p>
                        <p className="text-sm font-bold">{dev.totalProjects || "50+"}+</p>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-3 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all bg-amber-500 text-black hover:bg-amber-600 shadow-md">
                      Explore Portfolio
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Developer Modal */}
      <AnimatePresence>
        {selectedDeveloper && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeveloper(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl ${isDark ? "bg-[#11141B] border-white/10" : "bg-white border-slate-200"}`}
            >
              <button
                onClick={() => setSelectedDeveloper(null)}
                className="absolute top-4 right-4 p-2 bg-amber-500 text-black rounded-full hover:scale-105 transition-all z-20 shadow-md"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col lg:flex-row">
                {/* Left Side - Brand */}
                <div className={`lg:w-2/5 p-8 flex flex-col items-center justify-center border-r ${isDark ? "border-white/10 bg-black/20" : "border-slate-100 bg-slate-50"}`}>
                  <img
                    src={getDeveloperImage(selectedDeveloper) || `${BaseUrl}/developers/${selectedDeveloper.companyLogo}`}
                    className="w-40 h-40 object-contain drop-shadow-md"
                    alt={selectedDeveloper.companyName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDeveloper.companyName)}&background=C5A059&color=fff&bold=true&size=100`;
                    }}
                  />
                  <div className="w-full mt-8 space-y-3">
                    <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-200"}`}>
                      <p className="text-amber-500 text-[9px] font-bold uppercase tracking-wider mb-1">RERA License</p>
                      <p className="text-sm font-bold">{selectedDeveloper.reraRegistrationNumber || "N/A"}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-white border-slate-200"}`}>
                      <p className="text-amber-500 text-[9px] font-bold uppercase tracking-wider mb-1">Total Projects</p>
                      <p className="text-sm font-bold">{selectedDeveloper.totalProjects || "50+"} Completed</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="lg:w-3/5 p-8 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-px bg-amber-500"></span>
                      <span className="text-amber-500 text-[8px] font-bold uppercase tracking-wider">Developer Registry</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">{selectedDeveloper.companyName}</h2>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase border border-emerald-500/20">Active Entity</span>
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[9px] font-bold uppercase border border-blue-500/20">DLD Approved</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><MapPin size={16} /></div>
                      <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Headquarters</p>
                        <p className="text-xs font-medium">{selectedDeveloper.officeAddress || "Dubai, UAE"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><Phone size={16} /></div>
                      <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Contact</p>
                        <p className="text-xs font-medium">{selectedDeveloper.contactNumber || "+971 XX XXX XXXX"}</p>
                        <p className="text-xs text-slate-400">{selectedDeveloper.officialEmail || "info@example.com"}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                    <p className="text-[8px] font-bold text-amber-500 uppercase tracking-wider mb-2">Company Narrative</p>
                    <p className="text-sm italic leading-relaxed">
                      {selectedDeveloper.details || "A leading real estate developer in Dubai, known for excellence and innovation."}
                    </p>
                  </div>

                  <button className="w-full py-4 bg-amber-500 text-black font-bold uppercase text-[10px] tracking-wider rounded-xl shadow-md hover:bg-amber-600 transition-all">
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