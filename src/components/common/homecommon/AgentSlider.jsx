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
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useCallback } from "react";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../model/SuccessToasNotification";
import EmptyStateModel from "../../../model/EmptyStateModel";
import { FaWhatsapp } from "react-icons/fa";

const AgentSlider = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const { agentList = [], loading } = useGetAllAgent();
  const { addToast } = useToast();

  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getAvatarFallback = useCallback((name) => {
    const initials =
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "A";
    return `https://ui-avatars.com/api/?name=${initials}&background=C5A059&color=fff&bold=true`;
  }, []);

  const Arrow = ({ onClick, direction }) => (
    <motion.button
      whileHover={{ scale: 1.1, backgroundColor: isDark ? "#C5A059" : "#111" }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute ${direction === "next" ? "-right-4" : "-left-4"} top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center border shadow-xl transition-all hidden xl:flex ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
    >
      {direction === "next" ? (
        <ChevronRight
          size={20}
          className={direction === "next" && "group-hover:text-white"}
        />
      ) : (
        <ChevronLeft size={20} />
      )}
    </motion.button>
  );

  const openModal = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
    setFormSuccess(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await http.post("/createrequest", {
        ...formData,
        agentId: selectedAgent._id,
      });
      if (res.data.success) {
        setFormSuccess(true);
        addToast("Message Sent Successfully", "success");
      }
    } catch (err) {
      addToast("Failed to send inquiry", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const settings = {
    dots: true,
    infinite: agentList.length > 2,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, arrows: false, dots: true },
      },
    ],
  };

  return (
    <section
      className={` px-6 mt-5 overflow-hidden transition-colors duration-700 ${isDark ? "bg-slate-950" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Luxury Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
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
            <h2
              className={`text-5xl md:text-7xl font-black tracking-tighter leading-none ${ct.text}`}
            >
              MEET OUR <br />
              <span className="font-serif italic font-light text-amber-600">
                Advisors.
              </span>
            </h2>
          </div>
          <p
            className={`max-w-xs text-sm font-medium leading-relaxed opacity-70 ${ct.subText}`}
          >
            Our agents are more than brokers; they are strategic partners in
            your wealth-building journey.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-[450px] rounded-[3rem] animate-pulse ${isDark ? "bg-slate-900" : "bg-slate-100"}`}
              />
            ))}
          </div>
        ) : agentList.length === 0 ? (
          <EmptyStateModel title="No Advisors Available" />
        ) : (
          <Slider {...settings} className="agent-slider-refined">
            {agentList.map((agent) => (
              <div key={agent._id} className="px-3 py-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  className={`group relative overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500 ${ct.card}`}
                >
                  {/* Floating Contact Bar */}
                  <div className="absolute top-8 right-8 flex flex-col gap-3 z-30">
                    {/* --- PHONE CALL --- */}
                    <a
                      href={`tel:${agent.phone}`}
                      className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5"
                    >
                      <PhoneCall size={18} />
                    </a>

                    {/* --- EMAIL INQUIRY --- */}
                    <a
                      href={`mailto:${agent.email}`}
                      className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5"
                    >
                      <Mail size={18} />
                    </a>

                    {/* --- WHATSAPP (Direct API) --- */}
                    <a
                      href={`https://wa.me/${agent.phone?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 shadow-xl flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 border border-slate-100 dark:border-white/5"
                    >
                      <FaWhatsapp size={22} />
                    </a>
                  </div>

                  {/* Design Decor */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-500 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                        <img
                          src={
                            agent.profilePhoto || getAvatarFallback(agent.name)
                          }
                          className="relative w-24 h-24 object-cover rounded-2xl border-2 border-white dark:border-slate-900 shadow-xl"
                          alt={agent.name}
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3
                        className={`text-2xl font-black tracking-tight mb-2 ${ct.text}`}
                      >
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-amber-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
                          {agent.role || "Property Consultant"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Globe size={12} className="text-slate-400" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                          {Array.isArray(agent.languages)
                            ? agent.languages.join(" • ")
                            : "English"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-10">
                      <div
                        className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}
                      >
                        <MapPin size={14} className="text-amber-500 mb-2" />
                        <p
                          className={`text-[9px] uppercase font-black tracking-tighter ${ct.subText}`}
                        >
                          {agent.city || "Dubai, UAE"}
                        </p>
                      </div>
                      <div
                        className={`p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}
                      >
                        <ShieldCheck
                          size={14}
                          className="text-amber-500 mb-2"
                        />
                        <p
                          className={`text-[9px] uppercase font-black tracking-tighter ${ct.subText}`}
                        >
                          RERA Certified
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => openModal(agent)}
                      className="w-full py-5 rounded-2xl bg-slate-950 dark:bg-amber-500 text-white dark:text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:gap-5"
                    >
                      Secure Consultation <ExternalLink size={14} />
                    </button>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Luxury Contact Modal remains same as your original design */}
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
                  <img
                    src={
                      selectedAgent?.profilePhoto ||
                      getAvatarFallback(selectedAgent?.name)
                    }
                    className="w-20 h-20 rounded-2xl mb-6 border border-white/20"
                    alt=""
                  />
                  <h3 className="text-2xl font-black tracking-tight">
                    {selectedAgent?.name}
                  </h3>
                  <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Personal Advisor
                  </p>
                </div>
                <div className="relative z-10 flex gap-3">
                  <a
                    href={`tel:${selectedAgent?.phone}`}
                    className="p-3 bg-white/10 rounded-xl hover:bg-amber-500 transition-colors"
                  >
                    <PhoneCall size={18} />
                  </a>
                  <a
                    href={`https://wa.me/${selectedAgent?.phone?.replace(/\D/g, "")}`}
                    className="p-3 bg-white/10 rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-10 relative">
                <button
                  onClick={closeModal}
                  className="absolute top-6 right-6 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <X size={24} />
                </button>
                {formSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                      <Check size={40} />
                    </div>
                    <h2
                      className={`text-3xl font-black italic tracking-tighter ${ct.text}`}
                    >
                      Request Sent
                    </h2>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2
                        className={`text-2xl font-black tracking-tighter uppercase mb-1 ${ct.text}`}
                      >
                        Inquiry
                      </h2>
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                        Confidential Submission
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          placeholder="First"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          }
                          required
                          className={`p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`}
                        />
                        <input
                          placeholder="Last"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value,
                            })
                          }
                          required
                          className={`p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`}
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className={`w-full p-4 rounded-xl border outline-none text-xs font-bold ${ct.input}`}
                      />
                      <textarea
                        rows="3"
                        placeholder="Investment requirements..."
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        className={`w-full p-4 rounded-2xl border outline-none text-xs font-bold ${ct.input}`}
                      />
                      <button
                        disabled={isSubmitting}
                        className="w-full py-5 bg-slate-950 dark:bg-amber-500 text-white dark:text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-xl flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          "Send Private Message"
                        )}
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
