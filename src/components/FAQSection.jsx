import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Info, Plus, Minus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
 import { faqs } from "../helpers/FaqsHelpers";

const FaqItem = ({ question, answer, isOpen, onClick, isDark }) => {
  return (
    <div className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'} last:border-0 transition-all`}>
      <button
        onClick={onClick}
        className="w-full py-5 md:py-6 flex items-center justify-between gap-4 text-start group"
      >
        <span className={`text-base md:text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'} group-hover:text-amber-500 transition-colors pr-4`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-amber-500 shrink-0"
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 md:pb-6 text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
              {answer}
            </div>
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



  return (
    <section className={`py-20 px-6 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full">
              <HelpCircle size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                Knowledge Base
              </span>
            </div>
            <h2 className={`text-2xl md:text-4xl font-serif tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Frequently Asked <br />
              <span className="text-amber-500 italic font-serif font-light">Questions</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-md text-sm">
            Providing transparency and expert guidance for the Dubai Real Estate market.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className={`sticky top-24 p-8 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                <Info size={24} className="text-amber-500" />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Still have questions?
              </h3>
              <p className="text-slate-500 leading-relaxed mb-6 text-sm">
                Our elite consultants are ready to assist you with personalized investment strategies.
              </p>
              <button className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20">
                Contact Concierge
              </button>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-8">
            <div className={`rounded-3xl ${isDark ? 'bg-white/5' : 'bg-white border border-slate-100'} p-6 md:p-8`}>
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