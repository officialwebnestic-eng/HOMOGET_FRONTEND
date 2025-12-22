import React, { useState } from "react";
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
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { navbarlogo } from "../../ExportImages"; 

import { useTheme } from "../../context/ThemeContext";

/* ================= COLORS ================= */
const getColors = (theme) => ({
  primary: theme === "dark" ? "#8b5cf6" : "#6366f1",
  secondary: theme === "dark" ? "#06b6d4" : "#0891b2",
  accent: theme === "dark" ? "#f59e0b" : "#d97706",
  light: theme === "dark" ? "#0f172a" : "#f8fafc",
  dark: theme === "dark" ? "#020617" : "#1e293b",
  text: theme === "dark" ? "#f1f5f9" : "#334155",
  textLight: theme === "dark" ? "#94a3b8" : "#64748b",
  cardBorder: theme === "dark" ? "#334155" : "#e2e8f0",
  gradient:
    theme === "dark"
      ? "linear-gradient(135deg, #8b5cf6, #06b6d4, #f59e0b)"
      : "linear-gradient(135deg, #6366f1, #0891b2, #d97706)",
});

/* ================= REUSABLE COMPONENTS ================= */

const Card3D = ({ children, className = "" }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 250 }}
      className={`relative rounded-2xl p-6 backdrop-blur-sm ${className}`}
      style={{
        background:
          theme === "dark"
            ? "rgba(30,41,59,0.8)"
            : "rgba(255,255,255,0.9)",
        border: `1px solid ${colors.cardBorder}`,
      }}
    >
      {children}
    </motion.div>
  );
};

const FooterLink = ({ href, children }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <motion.a
      href={href}
      whileHover={{ x: 6, color: colors.primary }}
      className="flex items-center text-sm py-2 transition-all"
      style={{ color: colors.text }}
    >
      <ChevronRight className="w-4 h-4 mr-2" />
      {children}
    </motion.a>
  );
};

const MobileSection = ({ title, children }) => {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b py-4" style={{ borderColor: colors.cardBorder }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full"
      >
        <span className="font-semibold" style={{ color: colors.primary }}>
          {title}
        </span>
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================= DATA ================= */

const companyLinks = [
  { name: "Home", href: "/" },
  { name: "Buy Properties", href: "/properties" },
  { name: "Sell Property", href: "/sell" },
  { name: "About Homoget", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

const supportLinks = [
  { name: "Help Center", href: "/helpcenter" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "RERA Compliance", href: "/rera" },
];

const contactInfo = [
  {
    icon: MapPin,
    text: "HOMOGET PROPERTIES L.L.C S.O.C, Dubai, United Arab Emirates",
    href: "https://homoget.ae",
  },
  { icon: Phone, text: "+971 XXXXXXXX", href: "tel:+971XXXXXXXX" },
  { icon: Mail, text: "info@homoget.com", href: "mailto:info@homoget.com" },
];

/* ================= FOOTER ================= */

const Footer = () => {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <footer style={{ backgroundColor: colors.light }}>
      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* BRAND */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          <div className="flex items-center">
            <div
              className="p-3 rounded-xl"
            
            >
          <img src={navbarlogo} alt="Homoget Logo" className="w-16 h-16" />
            </div>
            <div className="ml-4">
            
       
     
              <p className="text-sm" style={{ color: colors.textLight }}>
                Trusted Real Estate Brokerage Platform
              </p>
            </div>
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:grid grid-cols-4 gap-10">
          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.primary }}>
              Company
            </h3>
            {companyLinks.map((l) => (
              <FooterLink key={l.name} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.primary }}>
              Support
            </h3>
            {supportLinks.map((l) => (
              <FooterLink key={l.name} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-4" style={{ color: colors.primary }}>
              Contact
            </h3>
            {contactInfo.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="flex items-start mb-3 text-sm"
                style={{ color: colors.text }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <c.icon className="w-4 h-4 mr-3 mt-1" />
                {c.text}
              </a>
            ))}
          </div>

          <Card3D>
            <h3 className="font-semibold mb-4" style={{ color: colors.primary }}>
              Registration Details
            </h3>
            <ul className="text-sm space-y-2" style={{ color: colors.textLight }}>
              <li>Trade Name: HOMOGET PROPERTIES L.L.C S.O.C</li>
              <li>License No: XXXXXXXX</li>
              <li>Registration Date: DD/MM/YYYY</li>
              <li>Expiry Date: DD/MM/YYYY</li>
              <li>Activity:</li>
              <li className="ml-4">• Leasing Property Brokerage Agents</li>
              <li className="ml-4">
                • Real Estate Buying & Selling Brokerage
              </li>
              <li>Registered Authority: Dubai Land Department (RERA)</li>
            </ul>
          </Card3D>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden space-y-4">
          <MobileSection title="Company">
            {companyLinks.map((l) => (
              <FooterLink key={l.name} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
          </MobileSection>

          <MobileSection title="Support">
            {supportLinks.map((l) => (
              <FooterLink key={l.name} href={l.href}>
                {l.name}
              </FooterLink>
            ))}
          </MobileSection>

          <MobileSection title="Contact">
            {contactInfo.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="flex items-start text-sm py-2"
                style={{ color: colors.text }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <c.icon className="w-4 h-4 mr-3 mt-1" />
                {c.text}
              </a>
            ))}
          </MobileSection>
        </div>

        {/* LEGAL */}
        <p
          className="text-xs leading-relaxed mt-12"
          style={{ color: colors.textLight }}
        >
          This certificate has been issued based on information provided by EJARI
          users. The Real Estate Regulatory Agency (RERA) does not take
          responsibility toward third parties. Users are solely responsible for
          legal liabilities arising from incorrect information. The certificate
          becomes invalid upon contract expiry, cancellation, or modification.
          Please visit the Dubai Land Department website to verify certificate
          details.
        </p>
      </div>

      {/* BOTTOM BAR */}
      <div className="py-6 text-center" style={{ backgroundColor: colors.dark }}>
        <p className="text-sm" style={{ color: colors.textLight }}>
          © {new Date().getFullYear()} HOMOGET PROPERTIES L.L.C S.O.C.  
          All rights reserved. Regulated by Dubai Land Department (RERA).
        </p>
      </div>

      <ToastContainer theme={theme} position="bottom-right" />
    </footer>
  );
};

export default Footer;
