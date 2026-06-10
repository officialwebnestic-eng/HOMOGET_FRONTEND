import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Mail,
  MapPin,
  Award,
  Loader2,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  Globe,
  Search,
  Crown,
  TrendingUp
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useCallback, useMemo, useEffect } from "react";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../model/SuccessToasNotification";
import EmptyStateModel from "../../../model/EmptyStateModel";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

const AgentSlider = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { addToast } = useToast();
  const navigate = useNavigate();

  // All useState hooks at the top - NO CONDITIONAL HOOKS
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // All hooks that depend on state
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const filters = useMemo(() => {
    return { search: debouncedSearchQuery };
  }, [debouncedSearchQuery]);
  
  const { agentList = [], loading } = useGetAllAgent(1, 100, filters);

  // Filter agents effect
  useEffect(() => {
    if (!agentList) {
      setFilteredAgents([]);
      return;
    }
    
    if (!searchQuery) {
      setFilteredAgents(agentList);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = agentList.filter((agent) => {
      return (
        agent.name?.toLowerCase().includes(query) ||
        agent.email?.toLowerCase().includes(query) ||
        agent.reraLicenseNumber?.toLowerCase().includes(query) ||
        agent.phone?.includes(query) ||
        agent.role?.toLowerCase().includes(query)
      );
    });
    setFilteredAgents(filtered);
  }, [agentList, searchQuery]);

  // All useCallback hooks
  const getAvatarFallback = useCallback((name) => {
    const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "A";
    return `https://ui-avatars.com/api/?name=${initials}&background=C5A059&color=fff&bold=true`;
  }, []);

  const handleAgentClick = useCallback((agent) => {
    navigate(`/user-agent-details/${agent._id}`);
  }, [navigate]);

  const handleConsultationClick = useCallback((e, agent) => {
    e.stopPropagation();
    setSelectedAgent(agent);
    setIsModalOpen(true);
    setFormSuccess(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await http.post("/contact-agent", {
        ...formData,
        agentId: selectedAgent._id,
      });
      if (res.data.success) {
        setFormSuccess(true);
        addToast("Message Sent Successfully", "success");
        setTimeout(() => {
          closeModal();
        }, 2000);
      }
    } catch (err) {
      addToast("Failed to send inquiry", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedAgent, addToast, closeModal]);

  // Arrow component defined as a regular function inside component
  const Arrow = useCallback(({ onClick, direction }) => (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: isDark ? "#C5A059" : "#111" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute ${direction === "next" ? "-right-4" : "-left-4"} top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center border shadow-xl transition-all hidden xl:flex ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
    >
      {direction === "next" ? (
        <ChevronRight size={20} />
      ) : (
        <ChevronLeft size={20} />
      )}
    </motion.button>
  ), [isDark]);

  // Slider settings - useMemo to prevent recreation
  const settings = useMemo(() => ({
    dots: true,
    infinite: filteredAgents.length > 2,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false, dots: true } },
    ],
  }), [filteredAgents.length, Arrow]);

  // Theme styles - defined once
  const ct = {
    card: isDark
      ? "bg-slate-900/40 border-slate-800/60 backdrop-blur-md"
      : "bg-white border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]",
    text: isDark ? "text-slate-50" : "text-slate-950",
    subText: isDark ? "text-slate-400" : "text-slate-500",
    input: isDark
      ? "bg-slate-800/40 border-slate-700/50 focus:border-amber-500"
      : "bg-slate-50 border-slate-200 focus:border-amber-500",
    accent: "text-amber-500",
  };

  return (
    <section className={`px-6 py-16 overflow-hidden transition-colors duration-700 ${isDark ? "bg-slate-950" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">
        {/* Luxury Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="h-[1px] w-8 bg-amber-500" />
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">
                The Elite Network
              </span>
            </motion.div>
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Meet <span className="text-amber-500">Our</span> Advisors
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="w-full md:w-80">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or BRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
            {searchQuery && (
              <p className="text-xs text-slate-500 mt-2">
                Found {filteredAgents.length} advisor{filteredAgents.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-[450px] rounded-[3rem] animate-pulse ${isDark ? "bg-slate-900" : "bg-slate-100"}`} />
            ))}
          </div>
        ) : filteredAgents.length === 0 ? (
          <EmptyStateModel 
            title="No Advisors Available" 
            message={searchQuery ? `No advisors found matching "${searchQuery}"` : "Please check back later"}
          />
        ) : (
          <Slider {...settings} className="agent-slider-refined">
            {filteredAgents.map((agent) => (
              <div key={agent._id} className="px-3 py-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => handleAgentClick(agent)}
                  className={`group relative overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500 cursor-pointer ${ct.card}`}
                >
                  {/* Floating Contact Bar */}
                  <div className="absolute top-8 right-8 flex flex-col gap-3 z-30">
                    <a href={`tel:${agent.phone}`} onClick={(e) => e.stopPropagation()} className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5">
                      <PhoneCall size={18} />
                    </a>
                    <a href={`mailto:${agent.email}`} onClick={(e) => e.stopPropagation()} className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5">
                      <Mail size={18} />
                    </a>
                    <a href={`https://wa.me/${agent.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5">
                      <FaWhatsapp size={22} />
                    </a>
                  </div>

                  {/* Design Decor */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-500 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                        <img src={agent.profilePhotoUrl || agent.profilePhoto || getAvatarFallback(agent.name)} className="relative w-24 h-24 object-cover rounded-2xl border-2 border-white dark:border-slate-900 shadow-xl" alt={agent.name} />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className={`text-2xl font-black tracking-tight mb-2 ${ct.text}`}>{agent.name}</h3>
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">{agent.role || "Property Consultant"}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                          {Array.isArray(agent.languages) ? agent.languages.join(" • ") : "English"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <ShieldCheck size={10} className="text-amber-500" />
                        <span className="text-[8px] font-mono text-slate-500">BRN: {agent.reraLicenseNumber || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-10">
                      <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                        <MapPin size={14} className="text-amber-500 mb-2" />
                        <p className={`text-[9px] uppercase font-black tracking-tighter ${ct.subText}`}>{agent.city || "Dubai, UAE"}</p>
                      </div>
                      <div className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                        <TrendingUp size={14} className="text-amber-500 mb-2" />
                        <p className={`text-[9px] uppercase font-black tracking-tighter ${ct.subText}`}>{agent.experienceYears || 5}+ Years Exp</p>
                      </div>
                    </div>

                    <button onClick={(e) => handleConsultationClick(e, agent)} className="w-full py-5 rounded-2xl bg-slate-950 dark:bg-amber-500 text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:gap-5">
                      Secure Consultation <ExternalLink size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Luxury Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative w-full max-w-2xl rounded-[3rem] overflow-hidden border shadow-2xl ${ct.card} flex flex-col md:flex-row`}
            >
              <div className="w-full md:w-2/5 bg-slate-950 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <img src={selectedAgent?.profilePhotoUrl || selectedAgent?.profilePhoto || getAvatarFallback(selectedAgent?.name)} className="w-20 h-20 rounded-2xl mb-6 border border-white/20" alt="" />
                  <h3 className="text-2xl font-black tracking-tight">{selectedAgent?.name}</h3>
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-2">Personal Advisor</p>
                  <p className="text-slate-400 text-[8px] mt-1">BRN: {selectedAgent?.reraLicenseNumber || 'N/A'}</p>
                </div>
                <div className="relative z-10 flex gap-3 mt-6">
                  <a href={`tel:${selectedAgent?.phone}`} className="p-3 bg-white/10 rounded-xl hover:bg-amber-500 transition-colors"><PhoneCall size={18} /></a>
                  <a href={`https://wa.me/${selectedAgent?.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="p-3 bg-white/10 rounded-xl hover:bg-green-600 transition-colors"><MessageCircle size={18} /></a>
                  <a href={`mailto:${selectedAgent?.email}`} className="p-3 bg-white/10 rounded-xl hover:bg-blue-600 transition-colors"><Mail size={18} /></a>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-10 relative">
                <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-amber-500 transition-colors"><X size={24} /></button>
                {formSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center"><Check size={40} /></div>
                    <h2 className={`text-3xl font-black italic tracking-tighter ${ct.text}`}>Request Sent</h2>
                    <p className="text-sm text-slate-400">We'll connect you with {selectedAgent?.name} shortly.</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className={`text-2xl font-black tracking-tighter uppercase mb-1 ${ct.text}`}>Inquiry</h2>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Confidential Submission</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder="First Name" onChange={(e) => setFormData({...formData, firstName: e.target.value})} required className={`p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`} />
                        <input placeholder="Last Name" onChange={(e) => setFormData({...formData, lastName: e.target.value})} required className={`p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`} />
                      </div>
                      <input type="email" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} required className={`w-full p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`} />
                      <input type="tel" placeholder="Phone Number" onChange={(e) => setFormData({...formData, phone: e.target.value})} required className={`w-full p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`} />
                      <textarea rows="3" placeholder="Investment requirements..." onChange={(e) => setFormData({...formData, message: e.target.value})} required className={`w-full p-4 rounded-2xl border outline-none text-xs font-bold ${ct.input}`} />
                      <button disabled={isSubmitting} className="w-full py-5 bg-slate-950 dark:bg-amber-500 text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-xl flex items-center justify-center gap-3">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Private Message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AgentSlider;