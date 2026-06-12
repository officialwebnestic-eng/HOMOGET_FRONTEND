import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageCircle, FiX, FiMail, 
  FiChevronRight, FiArrowLeft, 
  FiMapPin, FiShield, FiCheck,
  FiPhone, FiSend, FiExternalLink, FiSearch
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Search, X, Crown, MapPin, Loader2 } from "lucide-react";
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../model/SuccessToasNotification";
import { http } from "../../axios/axios";
import useDebounce from "../../hooks/useDebounce";

const AgentSupport = () => {
  const [firstName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [step, setStep] = useState(1);
  
  // Single search input
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  
  // Debounce the search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Create filters object only when debounced search changes
  const filters = useMemo(() => {
    return { search: debouncedSearchQuery };
  }, [debouncedSearchQuery]);
  
  const { agentList, loading } = useGetAllAgent(1, 100, filters);
  const { theme } = useTheme();
  const { addToast } = useToast();
  const isDark = theme === 'dark';

  // Handle input focus
  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setShowSuggestions(false);
  };

  // Handle search
  const handleSearch = () => {
    setShowSuggestions(false);
  };

  // Memoize filtered agents to prevent re-filtering on every render
  const filteredAgents = useMemo(() => {
    if (!agentList) return [];
    if (!searchQuery) return agentList;
    
    const query = searchQuery.toLowerCase();
    return agentList.filter((agent) => {
      return (
        agent.name?.toLowerCase().includes(query) ||
        agent.email?.toLowerCase().includes(query) ||
        agent.reraLicenseNumber?.toLowerCase().includes(query) ||
        agent.phone?.includes(query)
      );
    });
  }, [agentList, searchQuery]);

  
  // Add this helper function at the top of your component (after imports)
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  
  // Get base URL from environment or window location
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Remove trailing slash if exists
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = imagePath.replace(/^\//, '');
  
  return `${cleanBaseUrl}/${cleanPath}`;
};

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsInputFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsInputFocused(false);
    }
  };

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

  // Memoize agent card render to prevent unnecessary re-renders
  const renderAgentCard = useCallback((agent) => {
    const cleanPhone = agent.phone?.replace(/\s+/g, '') || "";
    
    return (
      <motion.div
        key={agent._id}
        className={`relative rounded-[2.5rem] p-8 transition-all duration-500 ${isDark ? 'bg-neutral-900 shadow-2xl shadow-black' : 'bg-white shadow-xl shadow-slate-200'}`}
      >
        {/* AGENT IMAGE & FLOATING CONTACTS */}
        <div className="relative flex justify-between items-start mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
         <img 
  src={getImageUrl(agent.profilePhotoUrl || agent.profilePhoto)} 
  className="w-24 h-24 rounded-[2rem] object-cover relative z-10 border-2 border-amber-500/20"
  alt={agent.name}
  onError={(e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=C5A059&color=fff`;
  }}
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
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
              BRN: {agent.reraLicenseNumber || 'N/A'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
            {agent.email}
          </p>
        </div>

        {/* Meta Info Slots */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
            <FiMapPin className="text-amber-500" size={14}/>
            <span className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Dubai, UAE</span>
          </div>
          <div className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
            <FiCheck className="text-amber-500" size={14}/>
            <span className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>RERA Certified</span>
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
  }, [isDark]);

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 pb-20 ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      
      {/* --- HERO SECTION WITH SEARCH BAR --- */}
      <section className="relative w-full h-[60vh] md:h-[65vh] flex items-center overflow-visible">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Luxury Property" 
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/60' : 'bg-black/50'}`} />
        </div>
        
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500 text-black mb-6 shadow-xl">
              <Crown size={14} />
              <span className="text-[10px] font-serif tracking-widest uppercase">Premium Collection</span>
            </div>
            
            <h1 className={`text-2xl md:text-4xl leading-[1.1] font-serif font-bold mb-4 text-white`}>
              Find Your <br />
              <span className="text-amber-500">Dream Advisor</span>
            </h1>
          
            <p className={`max-w-2xl text-base md:text-lg font-light leading-relaxed mb-8 text-white/80`}>
              Connect with strategic partners dedicated to your wealth-building journey in the Dubai real estate market.
            </p>
          
            {/* SEARCH BAR INPUT FIELD */}
            <div className="relative w-full max-w-2xl" ref={containerRef}>
              <div className={`
                flex items-center bg-white/95 backdrop-blur-xl rounded-full border transition-all duration-300 p-1 shadow-2xl
                ${isInputFocused ? 'ring-2 ring-amber-500/50 border-amber-500/30' : 'border-white/20'}
              `}>
                <Search className="text-amber-500 ml-4" size={20} />
                <div className="relative flex-1">
                  <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Search by name, email, or RERA license..." 
                    className="w-full bg-transparent border-none outline-none px-3 py-3 text-sm text-slate-800 placeholder-slate-400"
                    value={searchQuery}
                    onFocus={handleInputFocus}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <X size={16} className="text-slate-400 hover:text-amber-500 transition-colors" />
                    </button>
                  )}
                
                </div>
                
                {/* Search button */}
                <motion.button 
                  onClick={handleSearch}
                  className="ml-1 px-5 py-2 rounded-full bg-black text-white font-semibold text-xs hover:bg-amber-500 hover:text-black transition-all"
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agents Grid Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 mt-16">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
                </div>
              ) : filteredAgents?.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No advisors found matching "{searchQuery}"
                  </p>
                </div>
              ) : (
                filteredAgents.map(renderAgentCard)
              )}
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
                    <img 
                      src={selectedAgent?.profilePhotoUrl || selectedAgent?.profilePhoto || `https://ui-avatars.com/api/?name=${selectedAgent?.name}&background=C5A059&color=fff`} 
                      className="w-24 h-24 rounded-3xl object-cover mb-6 ring-2 ring-amber-500/20" 
                      alt="" 
                    />
                    <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">{selectedAgent?.name}</h2>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-widest">
                      BRN: {selectedAgent?.reraLicenseNumber || 'N/A'}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">{selectedAgent?.email}</p>
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
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>We'll connect you with {selectedAgent?.name} shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all font-bold`} 
                          value={firstName} 
                          onChange={e => setName(e.target.value)} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Email Address</label>
                          <input 
                            type="email" 
                            required 
                            className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all font-bold`} 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Contact Number</label>
                          <input 
                            type="tel" 
                            required 
                            className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all font-bold`} 
                            value={phone} 
                            onChange={e => setPhoneNumber(e.target.value)} 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-amber-500/60 ml-1">Inquiry Details</label>
                        <textarea 
                          rows={4} 
                          required 
                          className={`w-full px-0 py-4 bg-transparent border-b ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'} outline-none focus:border-amber-500 transition-all resize-none font-bold`} 
                          value={formMessage} 
                          onChange={e => setFormMessage(e.target.value)} 
                          placeholder="Tell us about your property requirements..."
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-6 bg-amber-500 text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-amber-400 shadow-xl shadow-amber-500/20 transition-all mt-8"
                      >
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