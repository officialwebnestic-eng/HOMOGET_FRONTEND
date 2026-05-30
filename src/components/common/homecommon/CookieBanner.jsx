import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, CheckCircle, Shield, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const CookieBanner = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  });

  // Check if user has already accepted cookies
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    const cookiePreferences = localStorage.getItem("cookiePreferences");
    
    if (!cookiesAccepted) {
      // Show banner after 1 second
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
    
    // Trigger event for other components to know cookies are accepted
    window.dispatchEvent(new Event("cookiesAccepted"));
  };

  const rejectAllCookies = () => {
    const preferences = {
      necessary: true, // Always true
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
    if (type === "necessary") return; // Cannot toggle necessary cookies
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
          <div className={`max-w-7xl mx-auto rounded-2xl shadow-2xl border overflow-hidden ${
            isDark ? "bg-[#161B26] border-white/10" : "bg-white border-slate-200"
          }`}>
            
            {!showSettings ? (
              // Main Banner View
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Cookie size={24} className="text-amber-500" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-base font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>
                      🍪 We Value Your Privacy
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      We use cookies to enhance your browsing experience, serve personalized content, 
                      and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                      <button 
                        onClick={openSettings}
                        className="text-amber-500 hover:text-amber-600 font-medium ml-1 inline-flex items-center gap-1"
                      >
                        <Settings size={12} /> Customize Settings
                      </button>
                    </p>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
                    <button
                      onClick={rejectAllCookies}
                      className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/10 text-red-500 border-red-500/20"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={acceptAllCookies}
                      className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-600 transition-all shadow-md"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Settings View
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Shield size={20} className="text-amber-500" />
                    </div>
                    <h3 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
                      Cookie Preferences
                    </h3>
                  </div>
                  <button
                    onClick={closeSettings}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <X size={18} className="text-slate-500" />
                  </button>
                </div>
                
                <p className={`text-xs leading-relaxed mb-6 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Customize your cookie preferences. Necessary cookies are always enabled as they are 
                  essential for the website to function properly.
                </p>
                
                {/* Cookie Options */}
                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies - Always On */}
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                          Necessary Cookies
                        </h4>
                        <p className="text-[9px] text-slate-500">Essential for website functionality and security</p>
                      </div>
                      <div className="px-2 py-1 rounded bg-green-500/10 text-green-500 text-[8px] font-bold uppercase">
                        Always On
                      </div>
                    </div>
                  </div>
                  
                  {/* Functional Cookies */}
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                          Functional Cookies
                        </h4>
                        <p className="text-[9px] text-slate-500">Remember your preferences and settings</p>
                      </div>
                      <button
                        onClick={() => togglePreference("functional")}
                        className={`relative w-10 h-5 rounded-full transition-all ${
                          cookiePreferences.functional ? "bg-amber-500" : "bg-slate-600"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          cookiePreferences.functional ? "right-0.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                          Analytics Cookies
                        </h4>
                        <p className="text-[9px] text-slate-500">Help us improve our website performance</p>
                      </div>
                      <button
                        onClick={() => togglePreference("analytics")}
                        className={`relative w-10 h-5 rounded-full transition-all ${
                          cookiePreferences.analytics ? "bg-amber-500" : "bg-slate-600"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          cookiePreferences.analytics ? "right-0.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Marketing Cookies */}
                  <div className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`text-xs font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
                          Marketing Cookies
                        </h4>
                        <p className="text-[9px] text-slate-500">Deliver personalized advertisements</p>
                      </div>
                      <button
                        onClick={() => togglePreference("marketing")}
                        className={`relative w-10 h-5 rounded-full transition-all ${
                          cookiePreferences.marketing ? "bg-amber-500" : "bg-slate-600"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                          cookiePreferences.marketing ? "right-0.5" : "left-0.5"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={rejectAllCookies}
                    className="flex-1 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all hover:bg-red-500/10 text-red-500 border-red-500/20"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={savePreferences}
                    className="flex-1 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-600 transition-all shadow-md"
                  >
                    Save Preferences
                  </button>
                  <button
                    onClick={acceptAllCookies}
                    className="flex-1 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-amber-500 text-amber-500 hover:bg-amber-500/10 transition-all"
                  >
                    Accept All
                  </button>
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