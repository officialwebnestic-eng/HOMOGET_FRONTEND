import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Home, Star, ArrowRight, 
  ShieldCheck, Clock, Globe, Zap, Award, 
  Palmtree, Landmark, Building2, Wallet,
  BadgePercent, TrendingUp, LandmarkIcon
} from 'lucide-react';
import { motion } from 'framer-motion'; // Ensure framer-motion is installed
import { useTheme } from '../../../context/ThemeContext';
import { Link } from 'react-router-dom';

const dubaiBanks = [
  {
    name: 'Emirates NBD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Emirates_NBD_logo.svg/1200px-Emirates_NBD_logo.svg.png',
    rate: '3.89%',
    offer: 'Resident Exclusive',
    type: 'Conventional',
    benefits: ['Zero Processing Fee', 'Life Insurance Covered']
  },
  {
    name: 'FAB',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/First_Abu_Dhabi_Bank_Logo.svg/1200px-First_Abu_Dhabi_Bank_Logo.svg.png',
    rate: '4.15%',
    offer: 'Expats Special',
    type: 'Premium',
    benefits: ['Up to 80% LTV', 'Multi-property funding']
  },
  {
    name: 'ADIB',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/ADIB_Logo.svg/1200px-ADIB_Logo.svg.png',
    rate: '3.75%',
    offer: 'Sharia Compliant',
    type: 'Islamic',
    benefits: ['No Early Settlement Fee', 'Takaful Insurance']
  },
  {
    name: 'HSBC UAE',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/HSBC_logo_%282018%29.svg/2560px-HSBC_logo_%282018%29.svg.png',
    rate: '4.20%',
    offer: 'International Link',
    type: 'Global',
    benefits: ['Green Mortgage Discount', 'Premier Status']
  },
  {
    name: 'Dubai Islamic Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Dubai_Islamic_Bank_Logo.svg/1200px-Dubai_Islamic_Bank_Logo.svg.png',
    rate: '3.85%',
    offer: 'Fixed for 3 Years',
    type: 'Islamic',
    benefits: ['Fast-track Approval', 'Minimum Paperwork']
  }
];

const HomeLoans = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 0.5) % (dubaiBanks.length * 380));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#0f172a]' : 'bg-[#f4f7fe]'}`}>
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-orange-100 mb-8 shadow-sm">
            <Palmtree className="text-[#ff8a00]" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Dubai Real Estate Finance</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[#1a1a1e] tracking-tighter uppercase mb-6 leading-[0.9]">
            Finance Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8a00] to-orange-400">Dubai Dream</span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-500 font-medium text-lg mb-12">
            Competitive mortgage rates from the UAE's top-tier banks. Tailored solutions for Residents, Expats, and Global Investors.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-5 bg-[#ff8a00] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-200">
              Calculate Loan
            </button>
            <button className="px-10 py-5 bg-white text-[#1a1a1e] border border-slate-100 rounded-2xl font-black uppercase text-xs tracking-widest hover:shadow-md transition-all">
              Eligibility Check
            </button>
          </div>
        </div>
      </div>

      {/* --- BANK SCROLL SECTION --- */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-8 h-[2px] bg-[#ff8a00]"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-[#ff8a00]">Live Market Rates</span>
            </div>
            <h2 className="text-3xl font-black text-[#1a1a1e] uppercase tracking-tighter">Partner Banks</h2>
          </div>
          <div className="hidden md:flex gap-3">
             <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#ff8a00] hover:text-white transition-all"><ChevronLeft size={20}/></button>
             <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-[#ff8a00] hover:text-white transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="relative overflow-hidden group">
          <div 
            className="flex gap-8 px-6 transition-transform duration-75 ease-linear"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {[...dubaiBanks, ...dubaiBanks, ...dubaiBanks].map((bank, i) => (
              <div key={i} className="flex-shrink-0 w-[380px]">
                <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-sm hover:shadow-xl transition-all duration-500 group/card relative overflow-hidden">
                  
                  {/* Decorative Gradient Background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover/card:bg-orange-100/50 transition-colors"></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <div className="h-12 w-32">
                        <img src={bank.logo} alt={bank.name} className="h-full w-full object-contain filter grayscale group-hover/card:grayscale-0 transition-all" />
                      </div>
                      <span className="px-4 py-1.5 rounded-xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {bank.type}
                      </span>
                    </div>

                    <div className="mb-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Interest Rate</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-5xl font-black text-[#1a1a1e] tracking-tighter italic">{bank.rate}</h3>
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Fixed 2Y</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-10">
                       <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100">
                          <Zap size={16} className="text-[#ff8a00] fill-[#ff8a00]" />
                          <span className="text-xs font-black text-[#ff8a00] uppercase tracking-wide">{bank.offer}</span>
                       </div>
                    </div>

                    <Link to="/homeloanrequestform" className="flex items-center justify-between p-2 pl-6 bg-[#1a1a1e] rounded-[2rem] group/btn hover:bg-[#ff8a00] transition-all">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Apply Now</span>
                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white group-hover/btn:bg-white group-hover/btn:text-[#ff8a00] transition-all">
                          <ArrowRight size={18} />
                       </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100">
        <div className="grid md:grid-cols-3 gap-16">
          <Feature icon={<Building2 />} title="Expat Mortgages" desc="High LTV ratios up to 80% for residents and 60% for non-resident global investors." />
          <Feature icon={<ShieldCheck />} title="Sharia Options" desc="Fully compliant Murabaha and Ijara financing models from the region's best Islamic banks." />
          <Feature icon={<TrendingUp />} title="Buy-to-Let" desc="Optimized products for investors looking for high-yield rental properties in Dubai Marina and Downtown." />
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="space-y-6 group">
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm border border-slate-50 group-hover:text-[#ff8a00] group-hover:border-orange-100 transition-all">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="space-y-2">
      <h4 className="text-xl font-black text-[#1a1a1e] uppercase tracking-tight">{title}</h4>
      <p className="text-slate-400 font-medium text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default HomeLoans;