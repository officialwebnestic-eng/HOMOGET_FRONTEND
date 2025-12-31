import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Mail,
  MapPin,
  Award,
  Send,
  Loader2,
  Phone,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useRef, useCallback } from "react";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../model/SuccessToasNotification";
import EmptyStateModel from "../../../model/EmptyStateModel";

const AgentSlider = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const { agentList = [], loading } = useGetAllAgent();
  const { addToast } = useToast();

  const isDark = theme === "dark";

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Smooth UI Theme Config
  const ct = {
    card: isDark ? "bg-slate-900/40 border-slate-800/60" : "bg-white border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
    text: isDark ? "text-slate-50" : "text-slate-900",
    subText: isDark ? "text-slate-400" : "text-slate-500",
    input: isDark ? "bg-slate-800/50 border-slate-700/50 focus:border-yellow-500" : "bg-slate-50 border-slate-200 focus:border-yellow-500",
  };

  const getAvatarFallback = useCallback((name) => {
    const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "A";
    return `https://ui-avatars.com/api/?name=${initials}&background=f59e0b&color=fff&bold=true`;
  }, []);

  // Custom Navigation Arrows
  const Arrow = ({ onClick, direction }) => (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: isDark ? "#1e293b" : "#ffffff" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute ${direction === 'next' ? '-right-6' : '-left-6'} top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-2xl transition-all ${isDark ? 'bg-slate-900/80' : 'bg-white/90'}`}
    >
      {direction === 'next' ? <ChevronRight size={24} className={ct.text} /> : <ChevronLeft size={24} className={ct.text} />}
    </motion.button>
  );

  const openModal = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
    setFormSuccess(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await http.post("/createrequest", { ...formData, agentId: selectedAgent._id });
      if (res.data.success) {
        setFormSuccess(true);
        addToast("Message Sent Successfully", "success");
      }
    } catch (err) {
      addToast("Failed to send", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const settings = {
    dots: true,
    infinite: agentList.length > 2,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false } }
    ]
  };

  return (
    <section className={`py-28 px-6 transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <ShieldCheck size={12} /> Elite Partners
            </motion.div>
            <h2 className={`text-5xl md:text-7xl font-serif italic ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Trust the <span className="font-sans not-italic font-black block md:inline uppercase tracking-tighter">Experts.</span>
            </h2>
          </div>
          <p className={`max-w-sm text-lg font-medium leading-relaxed ${ct.subText}`}>
            Connected with the industry's most successful property advisors across the country.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-[500px] rounded-[3rem] animate-pulse ${isDark ? 'bg-slate-900/50' : 'bg-white'}`} />
            ))}
          </div>
        ) : agentList.length === 0 ? (
          <EmptyStateModel title="No Agents Found" />
        ) : (
          <Slider {...settings} className="agent-slider pb-12">
            {agentList.map((agent) => (
              <div key={agent._id} className="px-5 py-12">
                <motion.div
                  whileHover={{ y: -15 }}
                  className={`group relative pt-16 pb-10 px-8 rounded-[3.5rem] border transition-all duration-500 ${ct.card}`}
                >
                  {/* Floating Avatar */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                    <div className="relative p-1.5 rounded-[2.5rem] bg-gradient-to-b from-yellow-400 to-orange-600 shadow-2xl">
                      <img 
                        src={agent.profilePhoto || getAvatarFallback(agent.name)} 
                        className="w-24 h-24 object-cover rounded-[2.2rem] border-4 border-slate-900 group-hover:scale-105 transition-transform duration-500"
                        alt={agent.name}
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className={`text-2xl font-bold tracking-tight mb-1 ${ct.text}`}>{agent.name}</h3>
                    <div className="flex items-center justify-center gap-1 mb-8">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />)}
                      </div>
                      <span className={`text-xs font-black ml-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>5.0 / 5.0</span>
                    </div>

                    <div className="space-y-3 mb-10 text-left">
                      <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                        <MapPin size={16} className="text-yellow-500" />
                        <span className={`text-xs font-bold uppercase tracking-widest ${ct.subText}`}>{agent.city || "Strategic Locations"}</span>
                      </div>
                      <div className={`flex items-center gap-3 p-3 rounded-2xl ${isDark ? 'bg-slate-800/30' : 'bg-slate-50'}`}>
                        <Mail size={16} className="text-yellow-500" />
                        <span className={`text-xs font-bold truncate ${ct.subText}`}>{agent.email}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openModal(agent)}
                      className="w-full py-5 rounded-[2rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:shadow-yellow-500/20 transition-all"
                    >
                      <MessageCircle size={18} /> Inquire Now
                    </motion.button>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className={`relative w-full max-w-xl rounded-[4rem] overflow-hidden border ${ct.card} p-10 md:p-16`}
            >
              <button onClick={closeModal} className={`absolute top-10 right-10 ${isDark ? 'text-slate-600 hover:text-white' : 'text-slate-300 hover:text-black'} transition-colors`}><X size={32} /></button>

              {formSuccess ? (
                <div className="text-center py-10 space-y-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40">
                    <Check size={48} />
                  </motion.div>
                  <h2 className={`text-4xl font-black italic tracking-tighter ${ct.text}`}>Sent Successfully</h2>
                  <p className={`text-lg ${ct.subText}`}>We've notified {selectedAgent?.name}. Expect a call shortly.</p>
                  <button onClick={closeModal} className="px-12 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-full font-black uppercase tracking-widest text-xs">Close</button>
                </div>
              ) : (
                <>
                  <div className="mb-12">
                    <h2 className={`text-4xl font-black tracking-tighter uppercase mb-2 ${ct.text}`}>Private Inquiry</h2>
                    <p className={`text-sm font-medium ${ct.subText}`}>Consult with <span className="text-yellow-500 font-bold">{selectedAgent?.name}</span></p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="firstName" placeholder="First Name" onChange={(e) => setFormData({...formData, firstName: e.target.value})} required className={`p-5 rounded-3xl border-2 outline-none transition-all text-sm font-bold ${ct.input}`} />
                      <input name="lastName" placeholder="Last Name" onChange={(e) => setFormData({...formData, lastName: e.target.value})} required className={`p-5 rounded-3xl border-2 outline-none transition-all text-sm font-bold ${ct.input}`} />
                    </div>
                    <input name="email" type="email" placeholder="Professional Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required className={`w-full p-5 rounded-3xl border-2 outline-none transition-all text-sm font-bold ${ct.input}`} />
                    <textarea name="message" rows="3" placeholder="How can we help?" onChange={(e) => setFormData({...formData, message: e.target.value})} required className={`w-full p-6 rounded-[2.5rem] border-2 outline-none transition-all text-sm font-bold ${ct.input}`} />
                    
                    <motion.button
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="w-full py-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-full flex items-center justify-center gap-3 shadow-2xl shadow-orange-500/30"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Connect Privately</>}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AgentSlider;