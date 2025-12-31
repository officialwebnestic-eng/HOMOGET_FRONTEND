import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageCircle, FiSend, FiX, FiUser, FiMail, 
  FiChevronRight, FiPhone, FiStar, FiCheck, FiArrowLeft, 
  FiMapPin, FiAward, FiShield 
} from "react-icons/fi";
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../model/SuccessToasNotification";
import { http } from "../../axios/axios";
import EmptyStateModel from "../../model/EmptyStateModel";

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

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 overflow-hidden ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      
      {/* --- BACKGROUND ORBS --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* --- HEADER --- */}
        <header className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">
              Concierge Services
            </span>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Guidance.</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {step === 1 
                ? "Select a dedicated professional to assist you with your real estate journey." 
                : "Provide your details below to schedule a private consultation."}
            </p>
          </motion.div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {agentList?.map((agent, index) => (
                <motion.div
                  key={agent._id}
                  whileHover={{ y: -10 }}
                  className={`group relative rounded-[2.5rem] p-1 border transition-all duration-500 ${
                    isDark ? 'bg-white/5 border-white/10 hover:border-blue-500/50' : 'bg-white border-slate-200 hover:border-blue-500 shadow-xl shadow-slate-200/50'
                  }`}
                >
                  <div className="p-8">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-8">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-blue-50'}`}>
                            <FiShield className="text-blue-500" size={24} />
                        </div>
                        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            agent?.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${agent?.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                            {agent?.status}
                        </span>
                    </div>

                    {/* Agent Identity */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <img 
                                src={agent.profilePhoto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
                                className="w-24 h-24 rounded-3xl object-cover relative z-10 border-4 border-white shadow-2xl"
                                alt={agent.name}
                            />
                        </div>
                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{agent.name}</h3>
                        <p className="text-blue-500 text-xs font-black uppercase tracking-widest mt-1">{agent.roleName}</p>
                    </div>

                    {/* Meta Info */}
                    <div className={`space-y-3 p-4 rounded-2xl mb-8 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-3 text-xs">
                            <FiMail className="text-slate-400" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{agent.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <FiMapPin className="text-slate-400" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{agent.address}</span>
                        </div>
                    </div>

                    <button
                      onClick={() => { setSelectedAgent(agent); setStep(2); }}
                      className="w-full py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      Initialize Contact <FiChevronRight />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`rounded-[3rem] overflow-hidden border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} shadow-2xl`}>
                <div className="grid md:grid-cols-5">
                  
                  {/* Sidebar - Selected Agent info */}
                  <div className="md:col-span-2 bg-blue-600 p-10 text-white flex flex-col justify-between">
                    <div>
                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-12 hover:opacity-70">
                            <FiArrowLeft /> Change Agent
                        </button>
                        <img src={selectedAgent?.profilePhoto} className="w-20 h-20 rounded-2xl border-2 border-white/20 mb-6 object-cover" />
                        <h2 className="text-3xl font-black tracking-tight leading-none mb-2">{selectedAgent?.name}</h2>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em]">{selectedAgent?.roleName}</p>
                    </div>
                    
                    <div className="space-y-4 pt-10 border-t border-white/10">
                        <div className="flex items-center gap-3 text-xs">
                            <FiAward className="text-blue-300" /> 
                            <span>Verified Industry Professional</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <FiCheck className="text-blue-300" /> 
                            <span>Instant Callback Guaranteed</span>
                        </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="md:col-span-3 p-10 md:p-14">
                    {formSubmitted ? (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                                <FiCheck size={40} strokeWidth={3} />
                            </div>
                            <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Inquiry Received</h3>
                            <p className="text-slate-500 text-sm italic">You will hear from {selectedAgent?.name} shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity</label>
                                    <input 
                                        type="text" required placeholder="Johnathan Doe"
                                        className={`w-full px-6 py-4 rounded-2xl border-0 text-sm font-bold outline-none ring-1 transition-all
                                            ${isDark ? 'bg-white/5 text-white ring-white/10 focus:ring-blue-500' : 'bg-slate-50 text-slate-900 ring-slate-200 focus:ring-blue-500'}`}
                                        value={firstName} onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email</label>
                                        <input 
                                            type="email" required placeholder="john@example.com"
                                            className={`w-full px-6 py-4 rounded-2xl border-0 text-sm font-bold outline-none ring-1 transition-all
                                                ${isDark ? 'bg-white/5 text-white ring-white/10 focus:ring-blue-500' : 'bg-slate-50 text-slate-900 ring-slate-200 focus:ring-blue-500'}`}
                                            value={email} onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone</label>
                                        <input 
                                            type="text" required placeholder="+91 ..."
                                            className={`w-full px-6 py-4 rounded-2xl border-0 text-sm font-bold outline-none ring-1 transition-all
                                                ${isDark ? 'bg-white/5 text-white ring-white/10 focus:ring-blue-500' : 'bg-slate-50 text-slate-900 ring-slate-200 focus:ring-blue-500'}`}
                                            value={phone} onChange={e => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Message Content</label>
                                    <textarea 
                                        rows={4} required placeholder="Tell us about your requirements..."
                                        className={`w-full px-6 py-4 rounded-2xl border-0 text-sm font-bold outline-none ring-1 transition-all resize-none
                                            ${isDark ? 'bg-white/5 text-white ring-white/10 focus:ring-blue-500' : 'bg-slate-50 text-slate-900 ring-slate-200 focus:ring-blue-500'}`}
                                        value={formMessage} onChange={e => setFormMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="w-full py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all">
                                Dispatch Message
                            </button>
                        </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- FLOATING CHAT --- */}
      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-3xl shadow-2xl flex items-center justify-center z-[100] hover:scale-110 active:scale-95 transition-all"
        whileHover={{ rotate: 10 }}
      >
        {chatOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default AgentSupport;