import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Building,
  Shield,
  Lock,
  CreditCard,
  FileText,
  Headphones,
  MessageCircle,
  ChevronRight,
  ExternalLink,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Globe,
  Clock,
  Award,
  CheckCircle,
  Sparkles,
  Home,
  Briefcase,
  Users,
  TrendingUp,
  Heart,
  Star,
  ArrowRight,
  Zap,
  Compass,
  Crown,
  Diamond,
  Gift,
  Target
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";

// Social Links Data
const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/homogetsearch?igsh=MWowMWp5eTRza3Q01" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/homogetfinder" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/share/1BeJoJSnyG/" },
  { name: "TikTok", icon: ExternalLink, href: "https://www.tiktok.com/@homogetsearch?_r=1&_t=ZS-96cyPsMun4h" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@homogetsearch?si=5e-5qZUM3wQPmboU" }
];

// WhatsApp Numbers
const WHATSAPP_NUMBER = "971585919585";
const HR_WHATSAPP = "971585919585";
const SUPPORT_WHATSAPP = "971585919585";

const HelpCenter = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleWhatsApp = (number, message) => {
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${number}?text=${encodedMsg}`, "_blank");
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const supportSections = [
    {
      icon: <Crown size={22} />,
      title: "Property & Real Estate Support",
      items: [
        "Smart Property Search",
        "Property Listing Assistance",
        "Verified Property Protection",
        "Dubai Real Estate Compliance",
        "Luxury & Investment Advisory"
      ]
    },
    {
      icon: <Diamond size={22} />,
      title: "Transactions, Escrow & Billing",
      items: [
        "Escrow & Payment Security",
        "VAT Invoices & Receipts",
        "Transparent Transaction Policies",
        "Refunds & Payment Resolution"
      ]
    },
    {
      icon: <Target size={22} />,
      title: "Account Security & Digital Services",
      items: [
        "Account & Profile Management",
        "Data Security & Cyber Protection",
        "Broker & Agency Support",
        "Business Growth Solutions"
      ]
    }
  ];

  const selfServiceTools = [
    "Submit Official Support Tickets",
    "Track Request & Complaint Status",
    "Monitor Property Approval Progress",
    "Request Listing Updates",
    "Schedule Online or In-Person Consultations",
    "Connect with Executive Advisors",
    "Access Technical & Operational Support"
  ];

  const luxuryBadges = [
    { icon: <Shield size={22} />, text: "Fully Licensed", color: "from-blue-500/20 to-blue-600/20" },
    { icon: <Award size={22} />, text: "RERA Regulated", color: "from-emerald-500/20 to-emerald-600/20" },
    { icon: <Lock size={22} />, text: "Secure Escrow", color: "from-purple-500/20 to-purple-600/20" },
    { icon: <TrendingUp size={22} />, text: "Digital Infrastructure", color: "from-cyan-500/20 to-cyan-600/20" },
    { icon: <Heart size={22} />, text: "Human-Centric", color: "from-rose-500/20 to-rose-600/20" }
  ];

  return (
    <div className={`min-h-screen font-serif ${isDark ? "bg-[#050505]" : "bg-gray-50"}`}>
      
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Dubai Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/65 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
        </div>
        
        {/* Animated Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-400/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 w-full">
          <div className="text-center">
            {/* Luxury Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/30 mb-8"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-[11px] font-serif tracking-[0.3em] text-amber-500 uppercase">Est. 2024 | 24/7 Concierge</span>
            </motion.div>
            
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-2xl md:text-5xl  font-bold mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                HOMOGET
              </span>
              <br />
              <span className="text-white/90">HELP CENTRE</span>
            </motion.h1>
            
            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500" />
              <Crown size={20} className="text-amber-500" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500" />
            </motion.div>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg max-w-2xl mx-auto mb-4 text-amber-400/90 font-serif italic"
            >
              "Where Luxury Meets Trust"
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-xs md:text-sm max-w-xl mx-auto mb-10 text-gray-400 tracking-wider uppercase"
            >
              Smart Technology • Trusted Real Estate • Human-Centric Service
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-5 mb-16"
            >
              <button
                onClick={() => handleWhatsApp(WHATSAPP_NUMBER, "Hello! I need assistance with Homoget services.")}
                className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full font-serif font-bold hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  <FaWhatsapp size={22} /> WhatsApp Concierge
                </span>
              </button>
              <button
                onClick={() => handleCall(WHATSAPP_NUMBER)}
                className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-full font-serif font-bold hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                  <Phone size={22} /> Speak to Advisor
                </span>
              </button>
            </motion.div>
            
            {/* Welcome Message - Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-4xl mx-auto p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Compass size={22} className="text-amber-500" />
                <span className="text-xs font-serif font-bold tracking-[0.2em] text-amber-500 uppercase">Welcome to Excellence</span>
                <Compass size={22} className="text-amber-500" />
              </div>
              <p className="text-base leading-relaxed text-gray-200 font-serif">
                Welcome to the official Homoget Help Centre — your premium destination for fast, secure, and professional real estate support. 
                Designed for buyers, sellers, tenants, investors, brokers, and corporate partners, we combine intelligent technology with 
                transparent service to make property transactions seamless and trustworthy.
              </p>
              <p className="text-base leading-relaxed mt-4 text-gray-300 font-serif">
                At Homoget, we are redefining real estate through innovation, integrity, and world-class customer support. 
                Whether you're searching for your dream property, listing assets, managing investments, or closing transactions, 
                our expert team is here to assist you with excellence and transparency.
              </p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] text-white/30 tracking-[0.2em] uppercase font-serif">Discover More</span>
                <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center">
                  <div className="w-0.5 h-2 bg-amber-500 rounded-full mt-2 animate-bounce" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Sections */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
              How Can We <span className="text-amber-500">Assist You?</span>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 to-purple-500 mx-auto rounded-full" />
            <p className={`text-base mt-5 font-serif italic ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Comprehensive support tailored to your real estate journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportSections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className={`p-8 rounded-3xl ${isDark ? "bg-white/5 border border-white/10 hover:border-amber-500/30" : "bg-white shadow-xl hover:shadow-2xl"} transition-all duration-300`}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center text-amber-500 mb-5">
                  {section.icon}
                </div>
                <h3 className={`font-serif text-xl font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className={`text-sm font-serif ${isDark ? "text-gray-400" : "text-gray-600"}`}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Service Tools */}
      <section className={`py-24 px-6 ${isDark ? "bg-black/40" : "bg-gray-100"} relative overflow-hidden`}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-5">
              <Zap size={14} className="text-amber-500" />
              <span className="text-[10px] font-serif font-bold tracking-wider text-amber-500 uppercase">Instant Access</span>
            </div>
            <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
              Self-Service <span className="text-amber-500">Tools</span>
            </h2>
            <div className="w-20 h-0.5 bg-amber-500 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {selfServiceTools.map((tool, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 p-5 rounded-xl ${isDark ? "bg-white/5 border border-white/10" : "bg-white shadow-md"} hover:shadow-xl transition-all cursor-pointer group`}
              >
                <CheckCircle size={18} className="text-amber-500 flex-shrink-0" />
                <span className={`text-sm font-serif ${isDark ? "text-gray-300" : "text-gray-700"} flex-1`}>{tool}</span>
                <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-5 ${isDark ? "text-white" : "text-gray-900"}`}>
              Connect With <span className="text-amber-500">Our Team</span>
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-amber-500 to-purple-500 mx-auto rounded-full" />
            <p className={`text-base mt-5 font-serif italic ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Our dedicated executive team is ready to assist you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { title: "General Inquiries", email: "info@homoget.ae", icon: <Mail size={22} />, gradient: "from-blue-500/20 to-cyan-500/20" },
              { title: "Customer Support", email: "support@homoget.ae", icon: <Headphones size={22} />, gradient: "from-green-500/20 to-emerald-500/20" },
              { title: "Legal & Escrow", email: "legal@homoget.ae", icon: <Shield size={22} />, gradient: "from-purple-500/20 to-pink-500/20" },
              { title: "Executive Office", email: "founder@homoget.ae", icon: <Star size={22} />, gradient: "from-amber-500/20 to-orange-500/20" }
            ].map((contact, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-3xl text-center ${isDark ? "bg-white/5 border border-white/10" : "bg-white shadow-xl"} transition-all duration-300`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-amber-500 mx-auto mb-5`}>
                  {contact.icon}
                </div>
                <h3 className={`font-serif text-lg font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>{contact.title}</h3>
                <a href={`mailto:${contact.email}`} className="text-sm font-serif text-amber-500 hover:underline break-all">
                  {contact.email}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Headquarters & Social */}
      <section className={`py-24 px-6 ${isDark ? "bg-black/40" : "bg-gray-100"} relative`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Corporate Headquarters */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
                  <Building size={24} className="text-amber-500" />
                </div>
                <h2 className={`font-serif text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Corporate Headquarters
                </h2>
              </div>
              <div className={`p-8 rounded-3xl ${isDark ? "bg-white/5 border border-white/10" : "bg-white shadow-xl"} hover:shadow-2xl transition-shadow`}>
                <p className={`text-base font-serif mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Homoget Properties LLC
                </p>
                <p className={`text-base font-serif mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Office R-118, 2nd Floor
                </p>
                <p className={`text-base font-serif mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Wasl Building, Bur Dubai
                </p>
                <p className={`text-base font-serif mb-6 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Dubai, United Arab Emirates
                </p>
                <div className="flex items-center gap-3 text-sm text-amber-500 hover:text-amber-600 transition-colors cursor-pointer">
                  <MapPin size={18} />
                  <span className="font-serif">View on Map →</span>
                </div>
              </div>
            </div>

            {/* Social Media & Quick Actions */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 flex items-center justify-center">
                  <Globe size={24} className="text-amber-500" />
                </div>
                <h2 className={`font-serif text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Connect With Us
                </h2>
              </div>
              <div className={`p-8 rounded-3xl ${isDark ? "bg-white/5 border border-white/10" : "bg-white shadow-xl"} hover:shadow-2xl transition-shadow`}>
                <div className="flex flex-wrap gap-4 mb-8">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-amber-500/20 transition-all group"
                    >
                      <social.icon size={18} className="text-amber-500" />
                      <span className="text-sm font-serif font-medium">{social.name}</span>
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => handleWhatsApp(SUPPORT_WHATSAPP, "Hello! I need support with Homoget services.")}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-serif font-bold hover:shadow-xl transition-all"
                  >
                    <FaWhatsapp size={20} /> WhatsApp Support
                  </button>
                  <button
                    onClick={() => handleWhatsApp(HR_WHATSAPP, "Hello! I have a business inquiry.")}
                    className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-xl font-serif font-bold hover:shadow-xl transition-all"
                  >
                    <MessageCircle size={20} /> Business Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Badges */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-16 pt-10 border-t border-gray-200 dark:border-white/10">
            {luxuryBadges.map((badge, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center gap-3 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform duration-300`}>
                  {badge.icon}
                </div>
                <span className={`text-[11px] font-serif font-bold uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-600"} text-center`}>
                  {badge.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-10 text-center border-t ${isDark ? "border-white/5 text-gray-500" : "border-gray-200 text-gray-400"} font-serif`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown size={14} className="text-amber-500" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Homoget Properties</span>
            <Crown size={14} className="text-amber-500" />
          </div>
          <p className="text-xs">
            © 2026 Homoget Properties. All Rights Reserved.
          </p>
          <p className="text-[10px] mt-2 opacity-60">
            RERA Regulated • Fully Licensed • Secure Escrow
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenter;