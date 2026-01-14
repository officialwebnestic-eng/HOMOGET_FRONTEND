import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageCircle, FiX, FiMail, 
  FiChevronRight, FiArrowLeft, 
  FiMapPin, FiAward, FiShield, FiZap, FiTarget, FiCheck
} from "react-icons/fi";
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../model/SuccessToasNotification";
import { http } from "../../axios/axios";



const AgentSupport = () => {
  const [chatOpen, setChatOpen] = useState(false);
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

  const glassEffect = isDark 
    ? "bg-neutral-900/50 border-white/5 backdrop-blur-2xl" 
    : "bg-white border-slate-200 shadow-2xl shadow-amber-500/5";

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 pb-20 pt-32 px-4 md:px-8 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.07] ${isDark ? 'bg-amber-500' : 'bg-amber-300'}`} />
        <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.05] ${isDark ? 'bg-amber-600' : 'bg-amber-200'}`} />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* --- HEADER --- */}
        <header className="mb-20 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
               <span className="h-[1px] w-10 bg-amber-500" />
               <span className="text-amber-500 font-black uppercase tracking-[0.5em] text-[10px]">
                {step === 1 ? "Private Concierge" : "Secure Channel"}
              </span>
            </div>
            <h1 className={`text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Your Vision. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 italic font-serif font-light">Our Expertise.</span>
            </h1>
            <p className={`max-w-2xl text-lg font-medium opacity-50 ${isDark ? 'text-slate-300' : 'text-slate-600'} mx-auto lg:mx-0`}>
              Connect with Dubai's elite property consultants for a bespoke real estate experience tailored to your portfolio.
            </p>
          </motion.div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {agentList?.map((agent) => (
                <motion.div
                  key={agent._id}
                  whileHover={{ y: -10 }}
                  className={`group relative rounded-[2rem] p-6 border transition-all duration-500 ${glassEffect} hover:border-amber-500/30`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-0 group-hover:opacity-20 transition-all duration-700" />
                      <img 
                        src={agent.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
                        className="w-24 h-24 rounded-full object-cover relative z-10 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 border-2 border-amber-500/20"
                        alt={agent.name}
                      />
                    </div>
                    
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500 mb-2">{agent.roleName}</span>
                    <h3 className={`text-xl font-black tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{agent.name}</h3>
                    
                    <div className="w-full pt-6 border-t border-white/5 space-y-3 mb-8">
                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold opacity-40">
                            <FiMapPin size={12} className="text-amber-500"/> {agent.address || "Dubai, UAE"}
                        </div>
                    </div>

                    <button
                      onClick={() => { setSelectedAgent(agent); setStep(2); }}
                      className="w-full py-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                    >
                      Connect <FiChevronRight />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
              <div className={`rounded-[3rem] overflow-hidden border ${glassEffect} grid md:grid-cols-12`}>
                
                {/* Info Side */}
                <div className="md:col-span-5 bg-neutral-950 p-12 flex flex-col justify-between border-r border-white/5">
                  <div>
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-16 hover:gap-4 transition-all">
                        <FiArrowLeft /> Back to List
                    </button>
                    <img src={selectedAgent?.profilePhoto} className="w-20 h-20 rounded-2xl object-cover mb-6 ring-1 ring-amber-500/30" alt="" />
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{selectedAgent?.name}</h2>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-widest">{selectedAgent?.roleName}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <FiShield className="text-amber-500" size={20}/>
                        <span className="text-[10px] text-white font-black uppercase tracking-widest">Verified Advisor</span>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className="md:col-span-7 p-12 lg:p-16">
                  {formSubmitted ? (
                    <div className="text-center py-10">
                      <FiCheck size={60} className="text-amber-500 mx-auto mb-6" />
                      <h3 className={`text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Message Sent</h3>
                      <p className="opacity-50 text-sm">We have notified {selectedAgent?.name} of your interest.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 ml-1">Full Name</label>
                        <input 
                          type="text" required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white focus:border-amber-500' : 'border-slate-200 text-slate-900 focus:border-amber-500'} outline-none transition-all font-bold`}
                          value={firstName} onChange={e => setName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 ml-1">Email</label>
                            <input type="email" required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white focus:border-amber-500' : 'border-slate-200 text-slate-900 focus:border-amber-500'} outline-none transition-all font-bold`} value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 ml-1">Phone</label>
                            <input type="text" required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white focus:border-amber-500' : 'border-slate-200 text-slate-900 focus:border-amber-500'} outline-none transition-all font-bold`} value={phone} onChange={e => setPhoneNumber(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-amber-500/60 ml-1">Requirements</label>
                        <textarea rows={3} required className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white focus:border-amber-500' : 'border-slate-200 text-slate-900 focus:border-amber-500'} outline-none transition-all resize-none font-bold`} value={formMessage} onChange={e => setFormMessage(e.target.value)} />
                      </div>
                      <button className="w-full py-6 bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-amber-400 shadow-2xl shadow-amber-500/20 transition-all mt-8">
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

      {/* --- FLOATING AMBER CHAT --- */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-10 right-10 w-20 h-20 bg-amber-500 text-black rounded-full shadow-2xl flex items-center justify-center z-[100] hover:scale-110 active:scale-95 transition-all"
        whileHover={{ rotate: 10 }}
      >
        {chatOpen ? <FiX size={28} /> : <FiMessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default AgentSupport;