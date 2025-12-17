import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useScroll } from "framer-motion";
import { DocumentTextIcon, ShieldCheckIcon, LockClosedIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

import { FloatingWhatsApp } from "react-floating-whatsapp";

const LegalDocumentationSupport = () => {
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();

  // Theme configuration
  const themeClasses = {
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      textSecondary: "text-gray-400",
      card: "bg-gray-800 border-gray-700",
      heading: "text-gray-50",
      list: "text-gray-300",
      divider: "border-gray-700",
      icon: "text-teal-400",
      highlight: "#5eead4"
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      card: "bg-white border-gray-200",
      heading: "text-gray-900",
      list: "text-gray-700",
      divider: "border-gray-200",
      icon: "text-blue-600",
      highlight: "#2563eb"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const legalSections = [
    {
      title: "Property Terms of Service",
      icon: <DocumentTextIcon className="h-8 w-8" />,
      content: [
        "By accessing our real estate services, you agree to comply with our Terms of Service governing property transactions, listings, and consultations.",
        "These terms protect both buyers and sellers in all real estate dealings through our platform."
      ],
      bullets: [
        "Must be 18+ to list or purchase properties",
        "All property listings must be accurate and current",
        "We reserve the right to remove fraudulent listings"
      ]
    },
    {
      title: "Privacy Policy for Real Estate",
      icon: <LockClosedIcon className="h-8 w-8" />,
      content: [
        "We protect your personal and financial information during property transactions with bank-level security measures.",
        "Your data is only used to facilitate real estate services and never shared without consent."
      ],
      bullets: [
        "Encrypted storage of property documents",
        "Secure payment processing for transactions",
        "Controlled access to sensitive property information"
      ]
    },
    {
      title: "Property Cookie Policy",
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      content: [
        "We use cookies to enhance your property search experience and remember your preferences for listings.",
        "Manage cookies to customize your real estate browsing experience."
      ],
      bullets: [
        "Saves preferred property types and locations",
        "Remembers recently viewed listings",
        "Enables personalized property recommendations"
      ]
    },
    {
      title: "Property Disclaimer",
      icon: <DocumentTextIcon className="h-8 w-8" />,
      content: [
        "All property information is provided in good faith but should be verified independently.",
        "We recommend professional inspections before any real estate purchase."
      ],
      bullets: [
        "Listings may change without notice",
        "Always verify property details in person",
        "Consult legal professionals for contracts"
      ]
    },
    {
      title: "Real Estate Support",
      icon: <EnvelopeIcon className="h-8 w-8" />,
      content: [
        "Our property specialists are available to assist with any legal documentation questions:"
      ],
      bullets: [
        "Email: properties@example.com",
        "Phone: +1 (555) 987-6543",
        "Address: 456 Real Estate Plaza, Suite 200"
      ]
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" }
    }
  };

  return (
    <ParallaxProvider>
      <div className={`w-full min-h-screen transition-colors duration-300 ${currentTheme.bg}`}>

        <Parallax speed={-15}>
          <div className="absolute inset-0  overflow-hidden  pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ duration: 1 }}
              className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px]"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute bottom-1/3 -right-20 w-96 h-96  mt-12 bg-teal-500 rounded-full mix-blend-multiply filter blur-[100px]"
            />
          </div>
        </Parallax>

        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
          style={{ scaleX: scrollYProgress }}
        />

        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <motion.div
              variants={scaleIn}
              className="inline-block mb-6"
            >
              <div className={`relative p-6 rounded-xl ${currentTheme.card} shadow-lg inline-block`}>
                <DocumentTextIcon className={`h-12 w-12 ${currentTheme.icon}`} />
                <motion.div
                  className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >

                  LEGAL

                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className={`text-4xl md:text-5xl font-bold ${currentTheme.heading} mb-4`}
            >

              Property Legal Hub

            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}
            >
              Secure documentation for all your real estate transactions
            </motion.p>
          </motion.div>


          <div className="space-y-8">
            {legalSections.map((section, index) => (
              <motion.section
                key={index}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl shadow-lg p-6 border ${currentTheme.card} ${currentTheme.divider} transition-all duration-300 hover:shadow-xl relative overflow-hidden`}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className={`absolute -right-4 -top-4 opacity-10 ${currentTheme.icon}`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                >
                  {section.icon}
                </motion.div>

                <motion.div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg mr-4 ${currentTheme.icon}`}>
                    {section.icon}
                  </div>
                  <h2 className={`text-2xl font-semibold ${currentTheme.heading}`}>

                    {section.title}

                  </h2>
                </motion.div>

                <div className="relative z-10">
                  {section.content.map((paragraph, pIndex) => (
                    <motion.p
                      key={pIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + pIndex * 0.05 }}
                      className={`mb-4 ${currentTheme.text}`}
                    >
                      {paragraph}
                    </motion.p>
                  ))}


                </div>
              </motion.section>
            ))}
          </div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`mt-16 pt-8 border-t ${currentTheme.divider}`}
          >
            <h3 className={`text-2xl font-bold text-center mb-8 ${currentTheme.heading}`}>
              Property Legal Support
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ y: -5 }}
                className={`p-4 rounded-lg ${currentTheme.card} text-center`}
              >
                <div className={`flex justify-center ${currentTheme.icon}`}>
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <p className={`mt-2 ${currentTheme.text}`}>properties@example.com</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className={`p-4 rounded-lg ${currentTheme.card} text-center`}
              >
                <div className={`flex justify-center ${currentTheme.icon}`}>
                  <PhoneIcon className="h-6 w-6" />
                </div>
                <p className={`mt-2 ${currentTheme.text}`}>+1 (555) 987-6543</p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className={`p-4 rounded-lg ${currentTheme.card} text-center`}
              >
                <div className={`flex justify-center ${currentTheme.icon}`}>
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <p className={`mt-2 ${currentTheme.text}`}>456 Real Estate Plaza</p>
              </motion.div>
            </div>

            <motion.p
              className={`mt-8 text-center ${currentTheme.textSecondary}`}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              © {new Date().getFullYear()} PropertyLegal Inc. All rights reserved.
            </motion.p>
          </motion.div>
        </div>


        <FloatingWhatsApp
          phoneNumber="6393413281"
          accountName="Property Legal Support"
          avatar="data:image/jpeg;base64,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"
          statusMessage="Typically replies within 1 hour"
          chatMessage="Hello! How can we help with your property legal questions?"
          placeholder="Type your message..."
          allowClickAway
          notification
          notificationSound
          darkMode={theme === "dark"}
        />
      </div>
    </ParallaxProvider>
  );
};

export default LegalDocumentationSupport;