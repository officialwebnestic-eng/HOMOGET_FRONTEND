import React, { useState, useEffect } from "react";
import { Award, ShieldCheck, Building2, ImageOff } from "lucide-react";
import { http } from "../../../axios/axios";
import { useTheme } from "../../../context/ThemeContext";

const PartnersSlider = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Unified Backend URL
  const BACKEND_URL =
    import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/agents";

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
    <section className={`py-24 overflow-hidden ${isDark ? "bg-[#0a0a0c]" : "bg-white"}`}>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partner-slider-track {
          display: flex;
          width: max-content;
          animation: scroll 35s linear infinite;
        }
        .partner-slider-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 text-left">
            {/* Elite Network Tag */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1.5px] bg-amber-500"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">
                The Elite Network
              </span>
            </div>

            <h2 className={`text-2xl md:text-4xl font-serif tracking-tighter uppercase leading-[1.1] ${isDark ? "text-white" : "text-slate-900"}`}>
              Our Trusted{" "}

              <span className="italic font-serif text-amber-500 capitalize tracking-normal">
                Partners.
              </span>
            </h2>
          </div>

          {/* Dynamic Counter */}
          <div className={`hidden md:flex items-center gap-8 ${isDark ? "border-white/10" : "border-slate-200"} border-l pl-8 pb-2`}>
            <div className="flex flex-col">
              <span className={`text-3xl font-black leading-none ${isDark ? "text-white" : "text-slate-900"}`}>
                {developers.length}+
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Global Developers
              </span>
            </div>
          </div>
        </div>


      
        <div className="relative group">
          {/* Edge Fading Effect */}
          <div className={`absolute inset-y-0 left-0 w-32 bg-gradient-to-r ${isDark ? "from-[#0a0a0c] to-transparent" : "from-white to-transparent"} z-10`}></div>
          <div className={`absolute inset-y-0 right-0 w-32 bg-gradient-to-l ${isDark ? "from-[#0a0a0c] to-transparent" : "from-white to-transparent"} z-10`}></div>

          <div className="flex overflow-hidden">
            <div className="partner-slider-track py-12">
              {doubledPartners.map((dev, index) => (
                <div
                  key={`${dev._id}-${index}`}
                  className="flex-shrink-0 w-[280px] px-10 flex items-center justify-center group/logo"
                >
                  <img
                    src={`${BACKEND_URL}agents/${dev.companyLogo}`}
                    alt={dev.companyName}
                    className={`h-10 md:h-14 w-auto object-contain  ${isDark ? "brightness-0 invert" : ""}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150x80?text=Logo";
                    }}
                  />
                  {/* Optional: Show company name on hover */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover/logo:opacity-100 transition-all duration-300 pointer-events-none">
                    <span className="text-[8px] font-black uppercase bg-black/80 text-white px-2 py-1 rounded whitespace-nowrap">
                      {dev.companyName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- TRUST BADGES --- */}
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <Badge
            icon={<ShieldCheck />}
            title="DLD REGULATED"
            subtitle="Government"
            color="orange"
            isDark={isDark}
          />
          <Badge
            icon={<Building2 />}
            title="DIRECT ACCESS"
            subtitle="Developer"
            color="blue"
            isDark={isDark}
          />
          <Badge
            icon={<Award />}
            title="CERTIFIED PORTFOLIOS"
            subtitle="Compliance"
            color="purple"
            isDark={isDark}
          />
        </div>
      </div>
    </section>
  );
};

/* Badge Sub-component with consistent fonts */
const Badge = ({ icon, title, subtitle, color, isDark }) => {
  const getColorStyles = () => {
    switch (color) {
      case "orange":
        return {
          bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
          text: "text-amber-500",
          hover: isDark ? "hover:bg-amber-500/20" : "hover:bg-amber-50",
        };
      case "blue":
        return {
          bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
          text: "text-blue-500",
          hover: isDark ? "hover:bg-blue-500/20" : "hover:bg-blue-50",
        };
      case "purple":
        return {
          bg: isDark ? "bg-purple-500/10" : "bg-purple-50",
          text: "text-purple-500",
          hover: isDark ? "hover:bg-purple-500/20" : "hover:bg-purple-50",
        };
      default:
        return {
          bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
          text: "text-amber-500",
          hover: isDark ? "hover:bg-amber-500/20" : "hover:bg-amber-50",
        };
    }
  };

  const colorStyles = getColorStyles();

  return (
    <div className={`flex items-center gap-5 p-4 rounded-3xl transition-all duration-300 ${colorStyles.hover} cursor-default group/badge`}>
      <div
        className={`w-14  rounded-2xl flex items-center justify-center transition-all duration-300 group-hover/badge:scale-110 ${colorStyles.bg} ${colorStyles.text}`}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
          {subtitle}
        </p>
        <p className={`text-sm font-black tracking-tight font-serif ${isDark ? "text-white" : "text-slate-900"}`}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default PartnersSlider;