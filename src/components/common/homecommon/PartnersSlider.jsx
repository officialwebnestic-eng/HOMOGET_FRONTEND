import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Building2, ImageOff } from 'lucide-react';
import { http } from "../../../axios/axios";

const PartnersSlider = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Unified Backend URL
  const BACKEND_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:3000/agents";
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await http.get('/developers');
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

  // Create an infinite loop effect
  const doubledPartners = [...developers, ...developers];

  if (loading || developers.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden">
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
        
        {/* --- DYNAMIC HEADING (Matching Hero & Advisors) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4 text-left">
            {/* Elite Network Tag */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1.5px] bg-[#ff8a00]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ff8a00]">
                The Elite Network
              </span>
            </div>

            {/* Typography: Bold Navy + Italic Gold */}
            <h2 className="text-5xl md:text-7xl font-black text-[#161b26] tracking-tighter uppercase leading-[0.85]">
              Our Trusted <br />
              <span className="italic font-serif text-[#ff8a00] capitalize tracking-normal ml-1">
                Partners.
              </span>
            </h2>
          </div>
          
          {/* Dynamic Counter */}
          <div className="hidden md:flex items-center gap-8 border-l border-slate-200 pl-8 pb-2">
             <div className="flex flex-col">
                <span className="text-3xl font-black text-[#161b26] leading-none">
                    {developers.length}+
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Global Developers
                </span>
             </div>
          </div>
        </div>


        {/* --- INFINITE LOGO SLIDER --- */}
        <div className="relative group">
          {/* Edge Fading Effect */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

          <div className="flex overflow-hidden">
            <div className="partner-slider-track py-12">
              {doubledPartners.map((dev, index) => (
                <div key={`${dev._id}-${index}`} className="flex-shrink-0 w-[280px] px-10 flex items-center justify-center">
                  <img
                    src={`${BACKEND_URL}/agents/${dev.companyLogo}`}
                    alt={dev.companyName}
                    className="h-16 md:h-20 w-auto object-contain transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 opacity-60 hover:opacity-100"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="hidden text-slate-300 font-black tracking-widest text-lg uppercase italic text-center">
                    {dev.companyName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- TRUST BADGES --- */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
           <Badge icon={<ShieldCheck />} title="DLD REGULATED" subtitle="Government" color="orange" />
           <Badge icon={<Building2 />} title="DIRECT ACCESS" subtitle="Developer" color="blue" />
           <Badge icon={<Award />} title="CERTIFIED PORTFOLIOS" subtitle="Compliance" color="purple" />
        </div>
      </div>
    </section>
  );
};

/* Badge Sub-component */
const Badge = ({ icon, title, subtitle, color }) => (
  <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-colors duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center 
      ${color === 'orange' ? 'bg-orange-50 text-[#ff8a00]' : 
        color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{subtitle}</p>
      <p className="text-sm font-black text-[#161b26] tracking-tight">{title}</p>
    </div>
  </div>
);

export default PartnersSlider;