import React, { useRef, useEffect, useState } from "react";
import { Search, MapPin, ArrowRight, Home, Star, TrendingUp, Shield, Award } from "lucide-react";

const popularLocations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Gurgaon", "Noida"];

const AnimatedContainer = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  const transform = inView 
    ? "translateX(0) translateY(0)" 
    : direction === "vertical" 
      ? `translateY(${reverse ? `-${distance}px` : `${distance}px`})` 
      : `translateX(${reverse ? `-${distance}px` : `${distance}px`})`;

  return (
    <div 
      ref={ref} 
      style={{
        transform,
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        opacity: inView ? 1 : 0
      }}
    >
      {children}
    </div>
  );
};

const FloatingCard = ({ children, delay = 0 }) => {
  return (
    <div
      style={{
        animation: `float 6s ease-in-out infinite ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

const AgentHero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleFilterChange = (value) => {
    setSearchQuery(value);
  };

  const handleSubmit = (location = searchQuery) => {
    if (location.trim() === "") {
      alert("Please enter a location");
      return;
    }
    console.log(`Searching for properties in: ${location}`);
    // Add your navigation logic here
    // navigate(`/properties?location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes slideIn {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .search-container {
          transform: translateZ(50px);
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="floating-elements">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-pink-400 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-400 rounded-full mix-blend-multiply opacity-20 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <AnimatedContainer distance={80} direction="vertical">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/80 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>Premium Real Estate Platform</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Find Your
                  <span className="block gradient-text">Dream Home</span>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl text-white/80">
                    In 3D Reality
                  </span>
                </h1>
                
                <p className="text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Experience properties like never before with our immersive 3D tours and cutting-edge visualization technology.
                </p>
              </div>
            </AnimatedContainer>

            {/* Search Section */}
            <AnimatedContainer distance={80} direction="vertical" delay={0.2}>
              <div className="relative max-w-2xl mx-auto lg:mx-0 search-container">
                <div className="glass-card p-6 rounded-3xl shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Enter your dream location..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      onClick={() => handleSubmit()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Search className="w-5 h-5" />
                      <span>Explore</span>
                    </button>
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 animate-slide-in">
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-white/70 mb-3">Popular Locations</h3>
                        <div className="space-y-1">
                          {popularLocations.map((location, index) => (
                            <button
                              key={location}
                              onClick={() => {
                                setSearchQuery(location);
                                handleSubmit(location);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-white/10 rounded-xl flex items-center justify-between text-white transition-all group"
                              style={{animationDelay: `${index * 0.05}s`}}
                            >
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-3 text-blue-400" />
                                <span className="font-medium">{location}</span>
                              </div>
                              <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedContainer>

            {/* Stats */}
            <AnimatedContainer distance={80} direction="vertical" delay={0.4}>
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto lg:mx-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-white/60 text-sm">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">25K+</div>
                  <div className="text-white/60 text-sm">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100+</div>
                  <div className="text-white/60 text-sm">Cities</div>
                </div>
              </div>
            </AnimatedContainer>
          </div>

          {/* Right Side - 3D Visualization Area */}
          <div className="relative hero-3d">
            <AnimatedContainer distance={100} direction="horizontal" reverse>
              <div className="relative">
                {/* Main 3D Display Area */}
                <div className="aspect-square max-w-lg mx-auto glass-card rounded-3xl p-8 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for your 3D images */}
                    <div className="text-center text-white/70">
                      <Home className="w-20 h-20 mx-auto mb-4 text-blue-400" />
                      <p className="text-lg font-medium">Your 3D Property Images</p>
                      <p className="text-sm text-white/50 mt-2">Will be displayed here</p>
                    </div>
                    
                    {/* Animated rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-2 border-blue-400/30 rounded-full animate-ping"></div>
                      <div className="absolute w-24 h-24 border-2 border-purple-400/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                    </div>
                  </div>
                </div>

                {/* Floating Feature Cards */}
                <FloatingCard delay={0}>
                  <div className="absolute -top-6 -right-6 glass-card rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">98.5%</div>
                        <div className="text-white/60 text-sm">Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={2}>
                  <div className="absolute -bottom-8 -left-8 glass-card rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">Verified</div>
                        <div className="text-white/60 text-sm">Properties</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>

                <FloatingCard delay={4}>
                  <div className="absolute top-1/2 -left-12 glass-card rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">Award</div>
                        <div className="text-white/60 text-sm">Winning</div>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              </div>
            </AnimatedContainer>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  );
};

export default AgentHero;