import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

export default function MissionVision() {
  const { theme } = useTheme();

  // Theme-aware colors
  const colors = {
    light: {
      background: 'from-white to-gray-50',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      text: 'text-gray-600',
      heading: 'text-gray-900',
      accent: 'text-blue-600',
      divider: 'bg-blue-600',
      shadow: 'shadow-lg hover:shadow-xl'
    },
    dark: {
      background: 'from-gray-900 to-gray-800',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      text: 'text-gray-300',
      heading: 'text-white',
      accent: 'text-indigo-400',
      divider: 'bg-indigo-500',
      shadow: 'shadow-lg hover:shadow-xl'
    }
  };
  const currentColors = colors[theme];
  return (
    <section className={`py-24 bg-gradient-to-b ${currentColors.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${currentColors.heading}`}>Our Purpose</h2>
          <div className={`w-24 h-1 ${currentColors.divider} mx-auto`}></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${currentColors.cardBg} rounded-2xl p-8 ${currentColors.shadow} transition-all duration-300 border ${currentColors.cardBorder}`}
          >
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-blue-100'} mr-4`}>
                <Target className={`w-6 h-6 ${currentColors.accent}`} />
              </div>
              <h2 className={`text-2xl font-bold ${currentColors.heading}`}>Our Mission</h2>
            </div>
            <p className={`${currentColors.text} leading-relaxed`}>
              To provide a transparent and efficient property rental experience for all users.
              We strive to make the process of finding your perfect home as seamless as possible,
              while maintaining the highest standards of service and integrity.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${currentColors.cardBg} rounded-2xl p-8 ${currentColors.shadow} transition-all duration-300 border ${currentColors.cardBorder}`}
          >
            <div className="flex items-center mb-6">
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-blue-100'} mr-4`}>
                <Eye className={`w-6 h-6 ${currentColors.accent}`} />
              </div>
              <h2 className={`text-2xl font-bold ${currentColors.heading}`}>Our Vision</h2>
            </div>
            <p className={`${currentColors.text} leading-relaxed`}>
              Empowering millions of users to find their perfect home with ease and trust.
              We envision a future where property search is not just about finding a place to live,
              but about discovering a community to belong to.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}