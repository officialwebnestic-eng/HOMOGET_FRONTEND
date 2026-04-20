import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FaqItem = ({ question, answer, isOpen, onClick, isDark }) => {
  return (
    <div className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'} last:border-0`}>
      <button 
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between gap-4 text-start group"
      >
        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} group-hover:text-amber-500 transition-colors`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-amber-500 shrink-0"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-500 leading-relaxed text-sm md:text-base">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [openFaq, setOpenFaq] = useState(null);

  // Internal Translations Data
  const faqs = [
    { 
      q: "What types of properties does HOMOGET handle?", 
      a: "HOMOGET deals with residential (apartments, villas, townhouses), commercial properties, and off-plan/investment projects across Dubai." 
    },
    { 
      q: "Is HOMOGET licensed and regulated in Dubai?", 
      a: "Yes — HOMOGET is fully licensed under the Dubai Land Department (DLD) with License No. 1523268, and our agents hold RERA certifications (RERA: 52933)." 
    },
    { 
      q: "Can non-UAE residents buy property in Dubai?", 
      a: "Yes. Foreign nationals can purchase freehold property in designated areas of Dubai. HOMOGET assists international investors with the entire legal process." 
    },
    { 
      q: "What is an escrow account?", 
      a: "It’s a secure account that holds the buyer’s payments until the developer meets construction milestones. This protects your investment by law in Dubai." 
    },
    { 
      q: "How can I verify HOMOGET’s credentials?", 
      a: "You can check our licence number and our agents’ RERA IDs via the Dubai REST app or the official DLD website." 
    },
    { 
        q: "What is Ejari?", 
        a: "Ejari is Dubai’s official tenancy registration system. It is mandatory for all rental agreements to protect both landlord and tenant rights." 
    }
  ];

  return (
    <section className={`px-6 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full">
              <HelpCircle size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Knowledge Base</span>
            </div>
            <h2 className={`text-2xl md:text-4xl font-serif  tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Frequently Asked <span className="text-amber-500 italic font-serif font-light">Questions</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-sm">
            Providing transparency and expert guidance for the Dubai Real Estate market.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-4">
            <div className={`p-10 rounded-[2.5rem] ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'} border sticky top-24`}>
              <Info className="text-amber-500 mb-6" size={40} />
              <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Still have questions?</h3>
              <p className="text-slate-500 leading-relaxed mb-8">
                Our elite consultants are ready to assist you with personalized investment strategies.
              </p>
              <button className="w-full py-5 bg-amber-500 text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-amber-600 transition-all hover:shadow-lg hover:shadow-amber-500/20">
                Contact Concierge
              </button>
            </div>
          </div>

          {/* Accordion List */}
          <div className="lg:col-span-8">
            <div className={`rounded-[2.5rem] ${isDark ? 'bg-white/5' : 'bg-white border border-slate-100'} px-8 md:px-12 py-4`}>
              {faqs.map((faq, index) => (
                <FaqItem 
                  key={index}
                  question={faq.q}
                  answer={faq.a}
                  isOpen={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;