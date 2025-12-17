import React, { useState } from 'react';
import {
  Home,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Mail,
  Send,
  MapPin,
  Phone,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useTheme } from "../../context/ThemeContext";

// Enhanced Theme-aware color palette with modern gradients
const getColors = (theme) => ({
  primary: theme === 'dark' ? '#8b5cf6' : '#6366f1',       // Purple-500/Indigo-500
  primaryLight: theme === 'dark' ? '#a78bfa' : '#818cf8',  // Purple-400/Indigo-400
  primaryDark: theme === 'dark' ? '#7c3aed' : '#4f46e5',   // Purple-600/Indigo-600
  secondary: theme === 'dark' ? '#06b6d4' : '#0891b2',     // Cyan-500/Cyan-600
  accent: theme === 'dark' ? '#f59e0b' : '#d97706',        // Amber-500/Amber-600
  light: theme === 'dark' ? '#0f172a' : '#f8fafc',         // Slate-900/Slate-50
  dark: theme === 'dark' ? '#020617' : '#1e293b',          // Slate-950/Slate-800
  text: theme === 'dark' ? '#f1f5f9' : '#334155',          // Slate-100/Slate-700
  textLight: theme === 'dark' ? '#94a3b8' : '#64748b',     // Slate-400/Slate-500
  cardBg: theme === 'dark' ? '#1e293b' : '#ffffff',        // Slate-800/White
  cardBorder: theme === 'dark' ? '#334155' : '#e2e8f0',    // Slate-700/Slate-200
  gradient: theme === 'dark'
    ? 'linear-gradient(135deg, #8b5cf6, #06b6d4, #f59e0b)'
    : 'linear-gradient(135deg, #6366f1, #0891b2, #d97706)',
});

// Modern 3D Card Component with glassmorphism
const Card3D = ({ children, className = '' }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <motion.div
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={`relative rounded-2xl overflow-hidden backdrop-blur-sm ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        background: theme === 'dark'
          ? 'rgba(30, 41, 59, 0.8)'
          : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.2)' : 'rgba(226, 232, 240, 0.8)'}`,
        boxShadow: theme === 'dark'
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(226, 232, 240, 0.5)',
      }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl opacity-20"
        style={{
          background: colors.gradient,
          filter: 'blur(1px)',
        }}
      />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

// Mobile Collapsible Footer Section with modern animations
const MobileFooterSection = ({ title, children }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border-b border-opacity-20 py-4 lg:border-none lg:py-0`}
      style={{ borderColor: colors.cardBorder }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left lg:hidden group"
      >
        <h3 className="text-sm font-bold tracking-wider uppercase flex items-center gap-2"
          style={{ color: colors.primary }}>
          <Sparkles className="w-4 h-4" />
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <ChevronDown className="w-5 h-5 group-hover:scale-110 transition-transform"
            style={{ color: colors.primary }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="overflow-hidden mt-4 lg:mt-0 lg:h-auto lg:opacity-100"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Footer Column Component
const FooterColumn = ({ title, children, className = '', delay = 0 }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay
      }}
      className={className}
    >
      {title && (
        <h3 className="hidden lg:flex items-center gap-2 text-sm font-bold tracking-wider uppercase mb-6"
          style={{ color: colors.primary }}>
          <div className="w-2 h-2 rounded-full" style={{ background: colors.gradient }} />
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
};

// Modern Footer Link Component with micro-interactions
const FooterLink = ({ href, children }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <motion.a
      href={href}
      className="flex items-center text-base transition-all duration-300 py-2 group relative overflow-hidden"
      style={{ color: colors.text }}
      whileHover={{
        x: 8,
        color: colors.primary
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
        className="mr-2"
      >
        <ChevronRight className="w-4 h-4" style={{ color: colors.primary }} />
      </motion.div>
      <span className="relative">
        {children}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ backgroundColor: colors.primary }}
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </span>
    </motion.a>
  );
};

// Ultra-modern Social Links with 3D cards
const socialLinks = [
  {
    icon: Twitter,
    href: '#',
    label: 'Twitter',
    gradient: 'linear-gradient(135deg, #1DA1F2, #0d7ec4)',
    shadowColor: '#1DA1F2'
  },
  {
    icon: Facebook,
    href: '#',
    label: 'Facebook',
    gradient: 'linear-gradient(135deg, #1877F2, #0a5ed4)',
    shadowColor: '#1877F2'
  },
  {
    icon: Instagram,
    href: '#',
    label: 'Instagram',
    gradient: 'linear-gradient(135deg, #fd5949, #d6249f, #285AEB)',
    shadowColor: '#d6249f'
  },
  {
    icon: Github,
    href: 'https://github.com/AAYUSH412/Real-Estate-Website',
    label: 'GitHub',
    gradient: 'linear-gradient(135deg, #333, #555)',
    shadowColor: '#333'
  },
];

const SocialLinks = () => {
  const { theme } = useTheme();

  return (
    <div className="flex gap-4 mt-6">
      {socialLinks.map(({ icon: Icon, href, label, gradient, shadowColor }, index) => (
        <motion.a
          key={label}
          whileHover={{
            y: -8,
            rotateY: 15,
            scale: 1.1
          }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: index * 0.1
          }}
          href={href}
          title={label}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: gradient,
              boxShadow: `0 8px 32px -8px ${shadowColor}40`,
            }}
          >
            <Icon className="w-6 h-6 text-white relative z-10" />

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              animate={{ x: [-100, 100] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              style={{
                width: '200%',
                height: '100%',
                opacity: 0.2,
                transform: 'skewX(-15deg)'
              }}
            />
          </div>
        </motion.a>
      ))}
    </div>
  );
};

// Futuristic Newsletter Component
const Newsletter = () => {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${'http://localhost:4000'}/news/newsdata`, { email });
      if (response.status === 200) {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card3D className="p-8">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: colors.gradient }}>
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: colors.primary }}>
            Stay Ahead
          </h3>
        </div>

        <p className="mb-6 text-sm leading-relaxed" style={{ color: colors.textLight }}>
          Get exclusive property insights, market trends, and early access to premium listings.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-xl opacity-50"
              animate={{
                background: focused ? colors.gradient : 'transparent'
              }}
              transition={{ duration: 0.3 }}
              style={{
                filter: 'blur(8px)',
                zIndex: -1
              }}
            />
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-5 w-5 z-10"
                style={{ color: focused ? colors.primary : colors.textLight }} />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="pl-12 pr-4 py-4 w-full placeholder-opacity-60 rounded-xl focus:outline-none transition-all duration-300 relative z-10"
                style={{
                  color: colors.text,
                  backgroundColor: theme === 'dark'
                    ? 'rgba(30, 41, 59, 0.8)'
                    : 'rgba(255, 255, 255, 0.9)',
                  border: `2px solid ${focused ? colors.primary : colors.cardBorder}`,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              rotateX: 5,
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl flex items-center justify-center font-semibold transition-all duration-300 relative overflow-hidden"
            style={{
              background: colors.gradient,
              color: 'white',
              boxShadow: `0 8px 32px -8px ${colors.primary}40`,
            }}
          >
            {loading ? (
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                <Send className="w-5 h-5 mr-3" />
                <span>Subscribe Now</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  whileHover={{ opacity: 0.1, x: ['-100%', '100%'] }}
                  transition={{ duration: 0.6 }}
                />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-4 text-xs opacity-80" style={{ color: colors.textLight }}>
          Join 10,000+ property enthusiasts. Unsubscribe anytime.
        </p>
      </div>
    </Card3D>
  );
};

// Enhanced Theme Toggle
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{
        scale: 1.1,
        rotateY: 180
      }}
      whileTap={{ scale: 0.9 }}
      className="p-3 rounded-xl relative overflow-hidden"
      style={{
        background: theme === 'dark'
          ? 'rgba(139, 92, 246, 0.2)'
          : 'rgba(99, 102, 241, 0.2)',
        border: `1px solid ${colors.primary}40`,
        backdropFilter: 'blur(10px)',
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sun className="h-5 w-5" style={{ color: colors.accent }} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Moon className="h-5 w-5" style={{ color: colors.primary }} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Main Footer Component with modern enhancements
const companyLinks = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  // { name: 'AI Property Hub', href: '/ai-agent' },
];

const helpLinks = [
  { name: 'Customer Support', href: '/helpcenter' },
  { name: 'FAQs', href: '/' },
  { name: 'Privacy Policy', href: '/helpcenter' },
];

const contactInfo = [
  {
    icon: MapPin,
    text: 'TVS SOLUTIONS Mohan Rd, near KAKORI TIRAHA, Lucknow, Salempur, Uttar Pradesh 226017',
    href: 'https://maps.app.goo.gl/gDcbtSpHuLwWMcjb9'
  },
  {
    icon: Phone,
    text: '+918899117706',
    href: 'tel:+918899117706'
  },
  {
    icon: Mail,
    text: 'info@tvssolutions.in',
    href: 'mailto:info@tvssolutions.in'
  },
];

const Footer = () => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: colors.light }}>
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 80%, ${colors.primary} 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, ${colors.secondary} 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, ${colors.accent} 0%, transparent 50%)`
          }} />
      </div>

      {/* Main Footer */}
      <div className="relative pt-16 lg:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12 flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <motion.div
              className="flex items-center justify-center lg:justify-start group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="p-3 rounded-2xl relative overflow-hidden"
                style={{
                  background: colors.gradient,
                  boxShadow: `0 8px 32px -8px ${colors.primary}40`,
                }}
                whileHover={{ scale: 1.1, rotateY: 15 }}
              >
                <Home className="h-8 w-8 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <div className="ml-4">
                <span className="text-3xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: colors.gradient }}>
                  BuildEstate
                </span>
                <p className="text-sm opacity-70" style={{ color: colors.textLight }}>
                  Premium Real Estate Solutions
                </p>
              </div>
            </motion.div>

            <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end items-center gap-6">
              <SocialLinks />
              <ThemeToggle />
            </div>
          </div>

          {/* Desktop layout with enhanced spacing */}
          <div className="hidden lg:grid grid-cols-12 gap-12">
            <FooterColumn title="Quick Links" className="col-span-2" delay={0.2}>
              <ul className="space-y-4">
                {companyLinks.map(link => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Support" className="col-span-2" delay={0.3}>
              <ul className="space-y-4">
                {helpLinks.map(link => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Contact Us" className="col-span-3" delay={0.4}>
              <ul className="space-y-5">
                {contactInfo.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <a
                      href={item.href}
                      className="flex items-start transition-all duration-300 group"
                      style={{ color: colors.text }}
                      target={item.icon === MapPin ? "_blank" : undefined}
                      rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                    >
                      <div className="p-2 rounded-lg mr-4 flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${colors.primary}20` }}>
                        <item.icon className="w-4 h-4" style={{ color: colors.primary }} />
                      </div>
                      <span className="text-sm hover:underline group-hover:text-current"
                        style={{ '--tw-text-opacity': 1 }}>
                        {item.text}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </FooterColumn>

            <div className="col-span-5">
              <Newsletter />
            </div>
          </div>

          {/* Mobile Accordions with enhanced styling */}
          <div className="lg:hidden space-y-6">
            <MobileFooterSection title="Quick Links">
              <ul className="space-y-3 py-3">
                {companyLinks.map(link => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <MobileFooterSection title="Support">
              <ul className="space-y-3 py-3">
                {helpLinks.map(link => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>{link.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <MobileFooterSection title="Contact Us">
              <ul className="space-y-4 py-3">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="flex items-start transition-all duration-300 group"
                      style={{ color: colors.text }}
                      target={item.icon === MapPin ? "_blank" : undefined}
                      rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                    >
                      <div className="p-2 rounded-lg mr-4 flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}20` }}>
                        <item.icon className="w-4 h-4" style={{ color: colors.primary }} />
                      </div>
                      <span className="text-sm hover:underline">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </MobileFooterSection>

            <div className="pt-8">
              <Newsletter />
            </div>

          </div>
        </div>
        <div className="py-4 text-center text-sm font-semibold uppercase tracking-wide" style={{ color: colors.textLight }}>
          <a
            href="https://tvssolution.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent font-bold transition-transform transform hover:scale-105 hover:translate-y-[-2px] hover:bg-gradient-to-r hover:from-purple-400 hover:via-indigo-400 hover:to-purple-500 "
          >
            Developed by TVS Solutions
          </a>
        </div>
      </div>



      <div className="relative py-8" style={{ backgroundColor: colors.dark }}>
        <div className="absolute inset-0 opacity-10"
          style={{ background: colors.gradient }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0 text-center md:text-left opacity-80"
            style={{ color: colors.textLight }}>
            © {new Date().getFullYear()} BuildEstate. Crafted with ❤️ for better real estate experiences.
          </p>

          <motion.a
            href="/properties"
            whileHover={{
              scale: 1.05,
              boxShadow: `0 4px 20px -4px ${colors.accent}40`
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-sm font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            style={{
              color: colors.accent,
              backgroundColor: `${colors.accent}20`,
              border: `1px solid ${colors.accent}40`,
            }}
          >
            Explore Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.a>
        </div>
      </div>



      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        toastStyle={{
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          color: theme === 'dark' ? '#f1f5f9' : '#334155',
        }}
      />




    </footer>
  );
};

export default Footer;