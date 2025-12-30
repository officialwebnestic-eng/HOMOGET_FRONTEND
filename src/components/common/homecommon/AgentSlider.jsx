import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Home,
  Mail,
  Phone,
  MapPin,
  Award,
  Send,
  Loader2
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useRef, useCallback } from "react";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../model/SuccessToasNotification";
import EmptyStateModel from "../../../model/EmptyStateModel";

const AgentSlider = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const { agentList = [], loading, error } = useGetAllAgent();
  const sliderRef = useRef(null);
  const { addToast } = useToast();

  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Theme-based Styles
  const ct = {
    card: isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100 shadow-xl shadow-slate-200/50",
    text: isDark ? "text-slate-50" : "text-slate-900",
    subText: isDark ? "text-slate-400" : "text-slate-500",
    input: isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-900",
  };

  const getAvatarFallback = useCallback((name, id) => {
    const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "A";
    return `https://ui-avatars.com/api/?name=${initials}&background=EAB308&color=fff&bold=true`;
  }, []);

  const NextArrow = ({ onClick }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200 shadow-lg'} transition-all`}
    >
      <ChevronRight className={isDark ? "text-white" : "text-slate-900"} />
    </motion.button>
  );

  const PrevArrow = ({ onClick }) => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200 shadow-lg'} transition-all`}
    >
      <ChevronLeft className={isDark ? "text-white" : "text-slate-900"} />
    </motion.button>
  );

  const openModal = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormSuccess(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    document.body.style.overflow = "auto";
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await http.post("/createrequest", { ...formData, agentId: selectedAgent._id });
      if (response.data.success) {
        setFormSuccess(true);
        addToast("Message Sent!", "success");
      }
    } catch (err) {
      addToast("Failed to send message", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const settings = {
    dots: true,
    infinite: agentList.length > 3,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false } }
    ]
  };

  return (
    <div className={`py-24 px-6 ${isDark ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-xs uppercase tracking-widest">
            <Award size={14} /> Certified Partners
          </motion.div>
          <h2 className={`text-4xl md:text-6xl font-black tracking-tight ${ct.text}`}>
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">Experts</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${ct.subText}`}>
            Our elite agents bring decades of experience to help you find the perfect sanctuary.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-[450px] rounded-[2.5rem] animate-pulse ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
            ))}
          </div>
        ) : agentList.length === 0 ? (
          <EmptyStateModel title="No Agents Available" message="Check back later for our new expert partners." />
        ) : (
          <Slider {...settings} className="agent-slider">
            {agentList.map((agent) => (
              <div key={agent._id} className="px-4 py-10">
                <motion.div
                  whileHover={{ y: -10 }}
                  className={`relative p-8 rounded-[2.5rem] border transition-all ${ct.card}`}
                >
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-6">
                      <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500">
                        <img 
                          src={agent.profilePhoto || getAvatarFallback(agent.name)} 
                          className="w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-900"
                          alt={agent.name}
                        />
                      </div>
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-900" />
                    </div>

                    <h3 className={`text-2xl font-bold mb-1 ${ct.text}`}>{agent.name}</h3>
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className={`text-sm font-bold ml-2 ${ct.text}`}>5.0</span>
                    </div>

                    <div className="w-full space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><MapPin size={18} /></div>
                        <span className={`text-sm font-medium ${ct.subText}`}>{agent.city || "Mumbai, India"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500"><Mail size={18} /></div>
                        <span className={`text-sm font-medium truncate ${ct.subText}`}>{agent.email}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal(agent)}
                      className="w-full py-4 rounded-2xl bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-950 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <Phone size={18} /> Contact Expert
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Modern Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-lg rounded-[3rem] overflow-hidden border ${ct.card} p-8 md:p-12`}
            >
              <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-white"><X /></button>

              {formSuccess ? (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Check size={40} />
                  </div>
                  <h2 className={`text-3xl font-bold ${ct.text}`}>Request Received</h2>
                  <p className={ct.subText}>Our expert will get back to you within 24 hours.</p>
                  <button onClick={closeModal} className="px-8 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-bold">Done</button>
                </div>
              ) : (
                <>
                  <h2 className={`text-3xl font-black mb-2 ${ct.text}`}>Get in Touch</h2>
                  <p className={`mb-8 ${ct.subText}`}>Inquire about properties with {selectedAgent?.name}</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input name="firstName" placeholder="First Name" onChange={handleInputChange} required className={`p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${ct.input}`} />
                      <input name="lastName" placeholder="Last Name" onChange={handleInputChange} required className={`p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${ct.input}`} />
                    </div>
                    <input name="email" type="email" placeholder="Email Address" onChange={handleInputChange} required className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${ct.input}`} />
                    <input name="phone" type="tel" placeholder="Phone Number" onChange={handleInputChange} required className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${ct.input}`} />
                    <textarea name="message" rows="4" placeholder="Your Message" onChange={handleInputChange} required className={`w-full p-4 rounded-2xl border outline-none focus:ring-2 focus:ring-yellow-500 transition-all ${ct.input}`} />
                    
                    <motion.button
                      disabled={isSubmitting}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Send Inquiry</>}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentSlider;