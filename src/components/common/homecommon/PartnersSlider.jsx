import React, { useState, useEffect } from "react";
import { Award, ShieldCheck, Building2, Sparkles, Globe, Users } from "lucide-react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";

const PartnersSlider = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/agents";

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await http.get("/developers");
        if (response.data.success) {
          setDevelopers(response.data.data);
        }
      } catch (err) {
        console.error("Slider Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  const doubledPartners = [...developers, ...developers];

  if (loading || developers.length === 0) return null;

  return (
    <section className={`py-20 overflow-hidden ${isDark ? "bg-[#0a0a0c]" : "bg-white"}`}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .partner-slider-track {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .partner-slider-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            {/* Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-gradient-to-r from-amber-500 to-amber-600"></div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">
                Trusted Partners
              </span>
            </div>

            {/* Title */}
            <h2 className={`text-3xl md:text-4xl font-serif font-bold tracking-tight leading-[1.2] ${isDark ? "text-white" : "text-slate-800"}`}>
              Our Global{" "}
              <span className="text-amber-500 italic font-serif">Network</span>
            </h2>
            <p className={`text-sm max-w-md ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Partnering with the world's most prestigious developers to bring you exceptional properties.
            </p>
          </div>

          {/* Stats */}
          <div className={`flex items-center gap-4 ${isDark ? "bg-white/5" : "bg-slate-100"} px-6 py-3 rounded-full`}>
            <Globe size={18} className="text-amber-500" />
            <div className="text-right">
              <p className="text-xl font-bold">{developers.length}+</p>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Premium Developers</p>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative group mt-8">
          {/* Gradient Fades */}
          <div className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r ${isDark ? "from-[#0a0a0c]" : "from-white"} to-transparent z-10`} />
          <div className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${isDark ? "from-[#0a0a0c]" : "from-white"} to-transparent z-10`} />

          {/* Slider Track */}
          <div className="overflow-hidden">
            <div className="partner-slider-track py-8">
              {doubledPartners.map((dev, index) => (
                <div
                  key={`${dev._id}-${index}`}
                  className="flex-shrink-0 w-[200px] md:w-[240px] px-6 flex items-center justify-center group/logo"
                >
                  <div className="relative">
                    <img
                      src={`${BACKEND_URL}agents/${dev.companyLogo}`}
                      alt={dev.companyName}
                      className={`h-10 md:h-12 w-auto object-contain transition-all duration-500 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 ${isDark ? "brightness-0 invert" : ""}`}
                      onError={(e) => {
                        e.target.onerror = null;
                      }}
                    />
                    {/* Hover Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                      <span className="text-[8px] font-bold uppercase bg-amber-500 text-black px-2 py-1 rounded shadow-lg">
                        {dev.companyName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges - Enhanced Design */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Badge
              icon={<ShieldCheck />}
              title="DLD Regulated"
              subtitle="Government Approved"
              color="amber"
              isDark={isDark}
            />
            <Badge
              icon={<Building2 />}
              title="Direct Access"
              subtitle="Premium Developers"
              color="blue"
              isDark={isDark}
            />
            <Badge
              icon={<Award />}
              title="Certified Portfolios"
              subtitle="100% Verified"
              color="purple"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Badge Component
const Badge = ({ icon, title, subtitle, color, isDark }) => {
  const colorStyles = {
    amber: {
      bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
      border: "border-amber-200 dark:border-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500/20",
    },
    blue: {
      bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
      border: "border-blue-200 dark:border-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    purple: {
      bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
      border: "border-purple-200 dark:border-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500/20",
    },
  };

  const styles = colorStyles[color] || colorStyles.amber;

  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl border transition-all duration-300 hover:shadow-md ${styles.bg} ${styles.border}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg} ${styles.text}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div>
        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
          {subtitle}
        </p>
        <p className={`text-sm font-bold tracking-tight ${styles.text}`}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default PartnersSlider;
