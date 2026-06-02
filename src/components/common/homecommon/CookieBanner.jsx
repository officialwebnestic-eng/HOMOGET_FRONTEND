import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cookie, X, Shield, Settings, Check, AlertCircle, Globe, 
  Database, TrendingUp, Target, ShieldCheck, Sparkles, ArrowRight 
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const CookieBanner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });

  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    const cookiePreferences = localStorage.getItem("cookiePreferences");
    
    if (!cookiesAccepted) {
      setTimeout(() => setIsVisible(true), 1000);
    } else if (cookiePreferences) {
      setCookiePreferences(JSON.parse(cookiePreferences));
    }
  }, []);

  const acceptAllCookies = () => {
    const preferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookiePreferences(preferences);
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
    window.dispatchEvent(new Event("cookiesAccepted"));
  };

  const rejectAllCookies = () => {
    const preferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setCookiePreferences(preferences);
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
    window.dispatchEvent(new Event("cookiesAccepted"));
  };

  const savePreferences = () => {
    localStorage.setItem("cookiesAccepted", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(cookiePreferences));
    setIsVisible(false);
    setShowSettings(false);
    window.dispatchEvent(new Event("cookiesAccepted"));
  };

  const togglePreference = (type) => {
    if (type === "necessary") return;
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const cookieOptions = [
    {
      id: "necessary",
      name: "Essential",
      description: "Required for the website to function properly",
      icon: <ShieldCheck size={16} />,
      alwaysOn: true,
      color: "emerald"
    },
    {
      id: "functional",
      name: "Functional",
      description: "Remember your preferences and settings",
      icon: <Globe size={16} />,
      alwaysOn: false,
      color: "blue"
    },
    {
      id: "analytics",
      name: "Analytics",
      description: "Help us understand how visitors interact",
      icon: <TrendingUp size={16} />,
      alwaysOn: false,
      color: "purple"
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Personalized ads and promotions",
      icon: <Target size={16} />,
      alwaysOn: false,
      color: "pink"
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      emerald: isActive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-500/5 text-emerald-500/70 border-emerald-500/10",
      blue: isActive ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-blue-500/5 text-blue-500/70 border-blue-500/10",
      purple: isActive ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-purple-500/5 text-purple-500/70 border-purple-500/10",
      pink: isActive ? "bg-pink-500/20 text-pink-400 border-pink-500/30" : "bg-pink-500/5 text-pink-500/70 border-pink-500/10"
    };
    return colors[color];
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className={`max-w-6xl mx-auto rounded-2xl shadow-2xl backdrop-blur-xl border overflow-hidden transition-all duration-300 ${
            isDark 
              ? "bg-[#0F1219]/95 border-white/10 shadow-black/50" 
              : "bg-white/95 border-slate-200 shadow-xl"
          }`}>
            
            {!showSettings ? (
              // Main Banner View
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-50" />
                
                <div className="relative p-6 md:p-8">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Icon with pulse animation */}
                    <div className="flex-shrink-0 relative">
                      <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-30 animate-pulse" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                        <Cookie size={28} className="text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                        <Sparkles size={16} className="text-amber-500" />
                        We Value Your Privacy
                      </h3>
                      <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        We use cookies to enhance your browsing experience, serve personalized content, 
                        and analyze our traffic. By clicking <span className="font-semibold text-amber-500">"Accept All"</span>, 
                        you consent to our use of cookies.
                      </p>
                      <button 
                        onClick={openSettings}
                        className="mt-3 text-xs text-amber-500 hover:text-amber-400 font-medium inline-flex items-center gap-1.5 transition-all hover:gap-2"
                      >
                        <Settings size={12} />
                        Customize Settings
                        <ArrowRight size={10} />
                      </button>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full lg:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={rejectAllCookies}
                        className="px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/10 text-red-500 border-red-500/30 hover:border-red-500/50"
                      >
                        Reject All
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={acceptAllCookies}
                        className="px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-xl"
                      >
                        Accept All
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Settings View - Modern Design
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/3 via-transparent to-purple-500/3" />
                
                <div className="relative p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                        <Shield size={18} className="text-white" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                          Privacy Preferences
                        </h3>
                        <p className="text-[10px] text-slate-400">Manage your cookie settings</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ rotate: 90 }}
                      onClick={closeSettings}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                    >
                      <X size={18} className="text-slate-500" />
                    </motion.button>
                  </div>
                  
                  <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Customize your cookie preferences. Essential cookies are always enabled as they are 
                    required for the website to function properly.
                  </p>
                  
                  {/* Cookie Options - Modern Cards */}
                  <div className="space-y-3 mb-8">
                    {cookieOptions.map((option) => {
                      const isActive = cookiePreferences[option.id];
                      const colorClasses = getColorClasses(option.color, isActive);
                      const isHovered = hoveredOption === option.id;
                      
                      return (
                        <motion.div
                          key={option.id}
                          whileHover={{ scale: 1.01 }}
                          onHoverStart={() => setHoveredOption(option.id)}
                          onHoverEnd={() => setHoveredOption(null)}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            isActive 
                              ? `${colorClasses} border-opacity-40` 
                              : isDark 
                                ? "bg-white/5 border-white/10 hover:bg-white/10" 
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                          }`}
                          onClick={() => togglePreference(option.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg transition-all ${isActive ? "bg-white/20" : "bg-black/5 dark:bg-white/10"}`}>
                                {option.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                                    {option.name}
                                  </h4>
                                  {option.alwaysOn && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[8px] font-bold uppercase tracking-wider">
                                      Always On
                                    </span>
                                  )}
                                </div>
                                <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                                  {option.description}
                                </p>
                              </div>
                            </div>
                            
                            {/* Toggle Switch - Modern Design */}
                            {!option.alwaysOn && (
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                  isActive ? "bg-gradient-to-r from-amber-500 to-amber-600" : "bg-slate-600"
                                }`}
                              >
                                <motion.div
                                  initial={false}
                                  animate={{ x: isActive ? 24 : 2 }}
                                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
                                />
                              </motion.div>
                            )}
                            
                            {option.alwaysOn && (
                              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check size={12} className="text-emerald-500" />
                              </div>
                            )}
                          </div>
                          
                          {/* Expanded info on hover */}
                          <AnimatePresence>
                            {isHovered && !option.alwaysOn && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pt-3 border-t border-slate-200/20"
                              >
                                <p className="text-[9px] text-slate-400">
                                  {option.id === "functional" && "Saves your language preference, theme settings, and remembers your login status."}
                                  {option.id === "analytics" && "Helps us understand how you use our website to improve performance and user experience."}
                                  {option.id === "marketing" && "Used to deliver relevant advertisements and track campaign effectiveness."}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {/* Action Buttons - Modern Design */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={rejectAllCookies}
                      className="flex-1 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/10 text-red-500 border-red-500/30 hover:border-red-500/50"
                    >
                      Reject All
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={savePreferences}
                      className="flex-1 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
                    >
                      Save Preferences
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={acceptAllCookies}
                      className="flex-1 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 transition-all"
                    >
                      Accept All
                    </motion.button>
                  </div>
                  
                  {/* Privacy Note */}
                  <div className="mt-4 pt-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Shield size={10} className="text-slate-400" />
                      <p className="text-[8px] text-slate-400">
                        Your privacy is important to us. You can change these settings at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;