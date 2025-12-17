import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Home, Star, ArrowRight, Shield, Clock, Users, Zap, Award, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Link } from 'react-router-dom';

const banks = [
  {
    name: 'Kotak Bank',
    logo: 'https://static.wixstatic.com/media/d59bbb_6867bf9e14e34751b05514e9ddd1ff49~mv2.png',
    rate: '8.45%',
    offer: 'Zero Processing Fee',
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'Canara Bank',
    logo: 'https://static.wixstatic.com/media/d59bbb_b123728d5e9640c8ba0469c22b7e10a1~mv2.png',
    rate: '8.30%',
    offer: 'Quick Approval',
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'J&K Bank',
    logo: 'https://static.wixstatic.com/media/d59bbb_d7a09e0e274b44b99abd4fe6d9feb980~mv2.png',
    rate: '8.55%',
    offer: 'Flexible Tenure',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'HDFC Bank',
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRdWDcslzMS55OX246nNUrcvhqf5mOCCuidg&s",
    rate: '8.20%',
    offer: 'Digital Process',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'SBI Bank',
    logo: 'data:image/jpeg;base64,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',
    rate: '8.40%',
    offer: 'Lowest EMI',
    color: 'from-green-500 to-green-600'
  },
 
];

const features = [
  { icon: Shield, text: 'Secure Process', color: 'text-blue-500' },
  { icon: Clock, text: 'Quick Approval', color: 'text-green-500' },
  { icon: Users, text: 'Expert Guidance', color: 'text-purple-500' },
  { icon: Zap, text: 'Instant Quotes', color: 'text-yellow-500' },
  { icon: Award, text: 'Best Rates', color: 'text-red-500' },
  { icon: TrendingUp, text: 'Market Leader', color: 'text-indigo-500' }
];

const stats = [
  { number: '50K+', label: 'Happy Customers' },
  { number: '₹500Cr+', label: 'Loans Disbursed' },
  { number: '24hrs', label: 'Quick Processing' },
  { number: '15+', label: 'Partner Banks' }
];

const HomeLoans = () => {
  const [hoveredBank, setHoveredBank] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { theme } = useTheme(); // assuming toggleTheme exists

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % (banks.length * 300));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Determine classes based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-900';
  const sectionBgClass = theme === 'dark' ? 'bg-gray-800' : 'bg-white/50';
  const cardBgClass = theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white/80 border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Theme Toggle Button */}


      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>

        {/* Main Content Container */}
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-24 lg:py-32">
          {/* Header Section */}
          <div className="text-center mb-16 px-4">

            {/* Badge / Badge-like Element */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 animate-pulse">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">India's #1 Home Loan Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 mb-6 animate-fade-in leading-tight">
              Your Dream Home<br />
              <span className="text-3xl sm:text-4xl">Awaits You</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              Unlock the best home loan rates from India's most trusted financial institutions with our AI-powered comparison platform.
            </p>


          </div>

          {/* Stats / Features Cards Grid */}
          {/* Features Grid */}
          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-10 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 px-4 py-3 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-full hover:shadow-lg transition-transform transform hover:scale-105 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon
                  className={`h-6 w-6 sm:h-7 sm:w-7 ${feature.color} group-hover:scale-110 transition-transform duration-200`}
                />
                <span className="font-medium text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-200 group-hover:text-indigo-500">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-10 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-2xl border ${theme === "dark"
                    ? "border-gray-600 text-white bg-gray-800/40"
                    : "border-gray-200 text-gray-900 bg-white/50"
                  } hover:shadow-xl transition-transform transform hover:scale-105 duration-300`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Continuous Bank Scroll */}
      <div className={`py-16 ${sectionBgClass} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">Compare Rates from Top Banks</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Real-time rates updated every hour</p>
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white/50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/50 to-transparent z-10"></div>

          <div
            className="flex gap-6 animate-scroll"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              width: `${banks.length * 600}px`
            }}
          >
            {[...banks, ...banks, ...banks].map((bank, index) => (
              <div
                key={`${bank.name}-${index}`}
                className="flex-shrink-0 w-80 group"
                onMouseEnter={() => setHoveredBank(index)}
                onMouseLeave={() => setHoveredBank(null)}
              >
                <div className={`relative ${cardBgClass} rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:scale-105 transform`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${bank.color} rounded-3xl transition-opacity duration-500`}></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="h-12 w-24 object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50"><rect width="100" height="50" fill="%23f3f4f6"/><text x="50" y="30" text-anchor="middle" fill="%236b7280" font-size="12">${bank.name}</text></svg>`;
                        }}
                      />
                      <div className={`px-3 py-1 bg-gradient-to-r ${bank.color} text-white text-xs font-bold rounded-full`}>
                        FEATURED
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{bank.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold">{bank.rate}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">onwards</span>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">{bank.offer}</span>
                    </div>

                    <Link
                      to="/homeloanrequestform"
                      className={`w-full py-3 ${sectionBgClass} ${bank.color} font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                    >
                      <span>Get Quote</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>

                  {hoveredBank === index && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Styles for scrolling and fade-in animations */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HomeLoans;