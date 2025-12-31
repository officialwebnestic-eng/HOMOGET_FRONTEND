import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Home, Star, ArrowRight, 
  ShieldCheck, Clock, Globe, Zap, Award, 
  Palmtree, Landmark, Building2, Wallet 
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Link } from 'react-router-dom';

const dubaiBanks = [
  {
    name: 'Emirates NBD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Emirates_NBD_logo.svg/1200px-Emirates_NBD_logo.svg.png',
    rate: '3.99%',
    offer: 'Exclusive for Residents',
    color: 'from-amber-400 to-amber-600',
    type: 'Conventional'
  },
  {
    name: 'First Abu Dhabi Bank (FAB)',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1a/First_Abu_Dhabi_Bank_Logo.svg/1200px-First_Abu_Dhabi_Bank_Logo.svg.png',
    rate: '4.24%',
    offer: 'High LTV Ratio',
    color: 'from-blue-700 to-slate-900',
    type: 'Premium'
  },
  {
    name: 'ADIB',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/ADIB_Logo.svg/1200px-ADIB_Logo.svg.png',
    rate: '3.75%',
    offer: 'Sharia Compliant',
    color: 'from-emerald-500 to-teal-700',
    type: 'Islamic'
  },
  {
    name: 'Mashreq Neo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Mashreq_Bank_Logo.svg/1280px-Mashreq_Bank_Logo.svg.png',
    rate: '4.10%',
    offer: 'Digital-First Approval',
    color: 'from-orange-500 to-red-600',
    type: 'Digital'
  },
  {
    name: 'Dubai Islamic Bank',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Dubai_Islamic_Bank_Logo.svg/1200px-Dubai_Islamic_Bank_Logo.svg.png',
    rate: '3.85%',
    offer: 'Zero Early Settlement',
    color: 'from-green-600 to-emerald-800',
    type: 'Islamic'
  }
];

const dubaiStats = [
  { number: 'AED 2B+', label: 'Funding Secured' },
  { number: '45+', label: 'Luxury Communities' },
  { number: 'Digital', label: 'E-Mortgage Process' },
  { number: 'Gold', label: 'Premier Support' }
];

const HomeLoans = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 0.8) % (dubaiBanks.length * 340));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Hero Header */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Dubai Aesthetic Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion-div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-widest uppercase mb-8">
              <Palmtree className="w-3 h-3 mr-2" /> Premier Mortgage Solutions UAE
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Own Your Piece of <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-600 to-yellow-500">
                Dubai Skyline
              </span>
            </h1>

            <p className={`max-w-2xl mx-auto text-lg md:text-xl mb-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Partner with the UAE's leading financial institutions. Custom mortgage plans for residents, expats, and international investors.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-20">
              <button className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-amber-600/20 flex items-center gap-2">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </button>
              <button className={`px-8 py-4 rounded-2xl font-bold border ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white'} hover:border-amber-500 transition-all`}>
                Mortgage Calculator
              </button>
            </div>
          </motion-div>

          {/* Luxury Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {dubaiStats.map((stat, i) => (
              <div key={i} className="group p-6 text-center">
                <div className="text-3xl font-black text-amber-500 mb-1">{stat.number}</div>
                <div className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dubai Bank Scroll - The "Gold Standard" Section */}
      <div className={`py-24 relative ${isDark ? 'bg-slate-900/50' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Landmark className="text-amber-500" /> Market Leading Rates
            </h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              We negotiate directly with the UAE's top tier banks to secure rates you won't find anywhere else.
            </p>
          </div>
          <div className="hidden md:block">
             <div className="flex gap-2">
               <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-all"><ChevronLeft className="w-5 h-5" /></div>
               <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-all"><ChevronRight className="w-5 h-5" /></div>
             </div>
          </div>
        </div>

        <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
          {/* Edge Fades */}
          <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-slate-950 to-transparent z-10 hidden dark:block"></div>
          <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-slate-950 to-transparent z-10 hidden dark:block"></div>

          <div 
            className="flex gap-8 transition-transform duration-75 ease-linear"
            style={{ transform: `translateX(-${scrollPosition}px)` }}
          >
            {[...dubaiBanks, ...dubaiBanks, ...dubaiBanks].map((bank, index) => (
              <div key={index} className="flex-shrink-0 w-[340px]">
                <div className={`relative overflow-hidden group rounded-[2.5rem] p-8 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} hover:border-amber-500/50 transition-all duration-500`}>
                  
                  {/* Glass Background Decor */}
                  <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${bank.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}></div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className="h-14 w-32 flex items-center">
                        <img 
                          src={bank.logo} 
                          alt={bank.name} 
                          className={`max-h-full max-w-full object-contain ${isDark ? 'brightness-0 invert' : ''}`}
                        />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {bank.type}
                      </span>
                    </div>

                    <div className="mb-8">
                      <div className="text-sm font-bold text-amber-600 mb-1">Annual Percentage Rate</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black tracking-tighter italic">
                          {bank.rate}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Fixed for 2Y</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl mb-8 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} border border-transparent group-hover:border-amber-500/20 transition-all`}>
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold">{bank.offer}</span>
                      </div>
                    </div>

                    <Link to="/homeloanrequestform" className="flex items-center justify-between w-full group/btn">
                      <span className="font-black text-sm uppercase tracking-widest">Secure Rate</span>
                      <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:rotate-[-45deg] transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dubai Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Building2 /></div>
             <h4 className="text-xl font-bold">Expat Friendly</h4>
             <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Specialized products for non-residents and expats with high LTV ratios up to 80%.</p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck /></div>
             <h4 className="text-xl font-bold">Islamic Finance</h4>
             <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Fully Sharia-compliant home financing (Murabaha/Ijara) options from the UAE's best.</p>
          </div>
          <div className="space-y-4">
             <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Wallet /></div>
             <h4 className="text-xl font-bold">Buy-to-Let</h4>
             <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Investing? We find mortgage products optimized for rental yield and tax efficiency.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeLoans;