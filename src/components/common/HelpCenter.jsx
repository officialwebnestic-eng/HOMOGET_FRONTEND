import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy, Mail, MessageSquare, Phone, ChevronDown, 
  ChevronRight, Zap, BookOpen, Video, Search, 
  ArrowRight, Star, HelpCircle, ShieldCheck, Sparkles
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';
import EnquiryEmailModal from '../../model/EnquiryEmailModel';
import CallNowModal from '../../model/CallNowModel';

const HelpCenter = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmailModelOpen, setisEmailModelOpen] = useState(false);
  const [isCallNowModel, setIsCallNowModel] = useState(false);

  // Dynamic Styles
  const colors = {
    bg: isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200',
    text: isDark ? 'text-white' : 'text-slate-900',
    sub: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: 'from-blue-600 to-indigo-500'
  };

  const categories = [
    { id: 'getting-started', title: 'Getting Started', icon: <Zap size={20} />, color: 'text-amber-500', bg: 'bg-amber-500/10', articles: [{ title: 'Account Setup', views: '1.2k' }, { title: 'First Steps Guide', views: '892' }] },
    { id: 'account', title: 'Account & Billing', icon: <BookOpen size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10', articles: [{ title: 'Subscription Plans', views: '943' }] },
    { id: 'features', title: 'Features Guide', icon: <Video size={20} />, color: 'text-purple-500', bg: 'bg-purple-500/10', articles: [{ title: 'Customization Options', views: '532' }] },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: <LifeBuoy size={20} />, color: 'text-rose-500', bg: 'bg-rose-500/10', articles: [{ title: 'Common Issues', views: '2.1k' }] },
  ];

  const popularArticles = [
    { title: 'Reset your password', category: 'Security', rating: '4.9' },
    { title: 'Dashboard guide', category: 'Basics', rating: '4.8' },
    { title: 'Payment issues', category: 'Billing', rating: '5.0' },
    { title: 'API Integration', category: 'Advanced', rating: '4.7' },
  ];

  return (
    <div className={`min-h-screen ${colors.bg} pb-20 transition-colors duration-500`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-20 right-[10%] w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles size={12} /> Support Hub 2.0
            </span>
            <h1 className={`text-5xl md:text-6xl font-black tracking-tighter ${colors.text}`}>
              How can we <span className="italic font-serif font-light text-blue-600">help you?</span>
            </h1>
            
            <div className="relative group max-w-2xl mx-auto mt-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className={`relative flex items-center ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl p-2 border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <Search className="ml-4 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Search for articles, guides, or keywords..."
                  className="w-full bg-transparent px-4 py-3 outline-none text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="hidden md:block px-6 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all">
                  Search
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest w-full mb-1">Trending Topics:</p>
              {['Password Reset', 'API Docs', 'Billing', 'Teams'].map(tag => (
                <button key={tag} onClick={() => setSearchQuery(tag)} className={`px-3 py-1 rounded-full border ${isDark ? 'border-white/5 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-600'} text-[10px] font-bold hover:border-blue-500/50 hover:text-blue-500 transition-all`}>
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT: CATEGORIES & POPULAR --- */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Popular Bento Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl font-black tracking-tight ${colors.text}`}>Popular Solutions</h2>
              <button className="text-xs font-bold text-blue-500 hover:underline">View All Articles</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularArticles.map((article, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-3xl border ${colors.card} group cursor-pointer transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{article.rating}</span>
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold mb-4 ${colors.text} group-hover:text-blue-500 transition-colors`}>{article.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Read Article <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Categories Accordion */}
          <section>
            <h2 className={`text-2xl font-black tracking-tight mb-8 ${colors.text}`}>Browse by Topic</h2>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className={`rounded-[2rem] border overflow-hidden transition-all ${colors.card} ${activeCategory === cat.id ? 'ring-2 ring-blue-500/20' : ''}`}>
                  <button 
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className="w-full p-8 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        {cat.icon}
                      </div>
                      <div className="text-left">
                        <h3 className={`text-xl font-bold ${colors.text}`}>{cat.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">Includes {cat.articles.length} detailed guides</p>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-slate-500/5 flex items-center justify-center transition-all ${activeCategory === cat.id ? 'rotate-180 bg-blue-500 text-white' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {activeCategory === cat.id && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-8 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                          {cat.articles.map((art, i) => (
                            <div key={i} className={`p-4 rounded-2xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} cursor-pointer flex items-center justify-between group`}>
                              <div className="flex items-center gap-3">
                                <HelpCircle size={16} className="text-slate-500" />
                                <span className={`text-sm font-bold ${colors.text}`}>{art.title}</span>
                              </div>
                              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* --- RIGHT: SUPPORT SIDEBAR --- */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className={`p-8 rounded-[2.5rem] border ${colors.card} bg-gradient-to-br from-blue-600/5 to-transparent`}>
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
                <MessageSquare size={24} />
              </div>
              <h3 className={`text-2xl font-black tracking-tighter mb-2 ${colors.text}`}>Direct Support</h3>
              <p className={`text-sm mb-8 leading-relaxed ${colors.sub}`}>Can't find what you're looking for? Our concierge team is ready to assist you personally.</p>
              
              <div className="space-y-3">
                <button onClick={() => setisEmailModelOpen(true)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-blue-500" />
                    <span className="text-xs font-black uppercase tracking-widest">Email Ticket</span>
                  </div>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button onClick={() => setIsCallNowModel(true)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-emerald-500" />
                    <span className="text-xs font-black uppercase tracking-widest">Call Concierge</span>
                  </div>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Live Chat Available</span>
                </div>
              </div>
            </div>

            {/* Quick Link Card */}
            <div className={`p-6 rounded-[2rem] border ${colors.card} flex items-center gap-4`}>
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Star size={18} />
                </div>
                <div>
                    <p className={`text-xs font-black uppercase tracking-tighter ${colors.text}`}>Pro Tip</p>
                    <p className="text-[10px] text-slate-500">Use <kbd className="px-1 bg-slate-800 rounded">CMD+K</kbd> to search anywhere.</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      <EnquiryEmailModal isOpen={isEmailModelOpen} onClose={() => setisEmailModelOpen(false)} />
      <CallNowModal isOpen={isCallNowModel} onClose={() => setIsCallNowModel(false)} />
    </div>
  );
};

export default HelpCenter;