import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageCircle, FiX, FiMail, 
  FiChevronRight, FiArrowLeft, 
  FiMapPin, FiShield, FiCheck,
  FiPhone, FiSend, FiExternalLink
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../model/SuccessToasNotification";
import { http } from "../../axios/axios";

const AgentSupport = () => {
  const [firstName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [step, setStep] = useState(1);
  
  const { agentList, loading } = useGetAllAgent();
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { firstName, email, phone, message: formMessage, agentId: selectedAgent?._id };
      const response = await http.post("/createrequest", payload);
      if (response.status === 200) {
        setFormSubmitted(true);
        addToast("Inquiry sent successfully!", "success");
        setTimeout(() => {
          setFormSubmitted(false);
          setStep(1);
          setSelectedAgent(null);
          setName(""); setEmail(""); setPhoneNumber(""); setFormMessage("");
        }, 3000);
      }
    } catch (error) {
      addToast("Failed to send message.", "error");
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 pb-20 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION (MATCHING PROPERTY ASSETS) --- */}
      <section className="relative w-full h-[70vh] flex items-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-60"
            alt="Advisors Hero"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-white/40'} backdrop-blur-sm`} />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-10 pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">Premium Consultancy</span>
            </div>
            <h1 className={`text-7xl md:text-[110px] leading-[0.85] font-black uppercase tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Elite <br />
              <span className="text-amber-500 font-serif italic font-light">Advisors.</span>
            </h1>
            <p className={`max-w-xl text-lg opacity-60 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Connect with strategic partners dedicated to your wealth-building journey in the Dubai real estate market.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {agentList?.map((agent) => {
                const cleanPhone = agent.phone?.replace(/\s+/g, '') || "";
                
                return (
                  <motion.div
                    key={agent._id}
                    className={`relative rounded-[2.5rem] p-8 transition-all duration-500 ${isDark ? 'bg-neutral-900 shadow-2xl shadow-black' : 'bg-white shadow-xl shadow-slate-200'}`}
                  >
                    {/* --- AGENT IMAGE & FLOATING CONTACTS (MATCHING SLIDER) --- */}
                    <div className="relative flex justify-between items-start mb-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                        <img 
                          src={agent.profilePhoto} 
                          className="w-24 h-24 rounded-[2rem] object-cover relative z-10 border-2 border-amber-500/20"
                          alt={agent.name}
                        />
                      </div>
                      
                      {/* Floating Contact Icons */}
                      <div className="flex flex-col gap-3">
                        <a href={`tel:${cleanPhone}`} className="w-10 h-10 rounded-full bg-white dark:bg-black shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors border border-slate-100 dark:border-white/5">
                          <FiPhone size={16} />
                        </a>
                        <a href={`mailto:${agent.email}`} className="w-10 h-10 rounded-full bg-white dark:bg-black shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors border border-slate-100 dark:border-white/5">
                          <FiMail size={16} />
                        </a>
                        <a href={`https://wa.me/${cleanPhone}`} className="w-10 h-10 rounded-full bg-white dark:bg-black shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-green-500 transition-colors border border-slate-100 dark:border-white/5">
                          <FaWhatsapp size={16} />
                        </a>
                      </div>
                    </div>

                    {/* Agent Info */}
                    <div className="space-y-1 mb-8">
                      <h3 className={`text-3xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{agent.name}</h3>
                      <div className="flex items-center gap-2">
                         <FiShield className="text-amber-500" size={12}/>
                         <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{agent.roleName || "Agent"}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">English • Arabic • Russian</p>
                    </div>

                    {/* Meta Info Slots */}
                    <div className="grid grid-cols-2 gap-3 mb-10">
                      <div className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <FiMapPin className="text-amber-500" size={14}/>
                        <span className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Dubai, UAE</span>
                      </div>
                      <div className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <FiCheck className="text-amber-500" size={14}/>
                        <span className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Rera Certified</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedAgent(agent); setStep(2); }}
                      className="w-full py-5 bg-neutral-950 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white transition-all"
                    >
                      Secure Consultation <FiExternalLink />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
             <motion.div key="step2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
               <div className={`rounded-[3rem] overflow-hidden border ${isDark ? 'bg-neutral-900 border-white/5' : 'bg-white border-slate-200'} grid md:grid-cols-12 shadow-2xl`}>
                {/* Info Side */}
                <div className="md:col-span-5 bg-black p-12 flex flex-col justify-between">
                  <div>
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-16 hover:gap-4 transition-all">
                        <FiArrowLeft /> Back to Advisors
                    </button>
                    <img src={selectedAgent?.profilePhoto} className="w-24 h-24 rounded-3xl object-cover mb-6 ring-2 ring-amber-500/20" alt="" />
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">{selectedAgent?.name}</h2>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-widest">{selectedAgent?.roleName}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Direct Contact</p>
                      <p className="text-white font-black">{selectedAgent?.phone}</p>
                  </div>
                </div>

                {/* Form Side */}
                <div className="md:col-span-7 p-12 lg:p-16">
                  {formSubmitted ? (
                    <div className="text-center py-10">
                      <FiCheck size={60} className="text-amber-500 mx-auto mb-6" />
                      <h3 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Message Sent</h3>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Full Name</label>
                        <input type="text" required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all font-bold`} value={firstName} onChange={e => setName(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Email Address</label>
                            <input type="email" required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all font-bold`} value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Contact Number</label>
                            <input type="text" required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all font-bold`} value={phone} onChange={e => setPhoneNumber(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Inquiry Details</label>
                        <textarea rows={3} required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all resize-none font-bold`} value={formMessage} onChange={e => setFormMessage(e.target.value)} />
                      </div>
                      <button className="w-full py-6 bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all mt-8">
                        Dispatch Inquiry
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AgentSupport;