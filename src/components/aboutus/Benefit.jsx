import React from 'react';
import { motion } from 'framer-motion';
import { Home, Globe, Headphones, List } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const benefits = [
  {
    icon: Home,
    title: 'Verified Properties',
    description: 'Every property is thoroughly verified for quality and security.',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Globe,
    title: 'User-Friendly Platform',
    description: 'Intuitive navigation and seamless property management.',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Round-the-clock assistance for all your queries.',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: List,
    title: 'Comprehensive Listings',
    description: 'Wide range of properties to match every need and budget.',
    gradient: 'from-pink-500 to-pink-600'
  },
];

export default function Benefits() {
  const { theme } = useTheme();

  // Theme-aware colors
  const colors = {
    light: {
      background: 'from-white to-gray-50',
      heading: 'text-gray-900',
      divider: 'bg-blue-600',
      subtext: 'text-gray-600',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      text: 'text-gray-700',
      iconBg: 'bg-opacity-10'
    },
    dark: {
      background: 'from-gray-900 to-gray-800',
      heading: 'text-white',
      divider: 'bg-indigo-500',
      subtext: 'text-gray-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      text: 'text-gray-300',
      iconBg: 'bg-opacity-20'
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
          <h2 className={`text-4xl font-bold mb-4 ${currentColors.heading}`}>
            Why Choose BuildEstate?
          </h2>
          <div className={`w-24 h-1 ${currentColors.divider} mx-auto mb-6`}></div>
          <p className={`${currentColors.subtext} text-lg max-w-2xl mx-auto`}>
            Experience the difference with our comprehensive property solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  boxShadow: theme === 'dark' 
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                className={`${currentColors.cardBg} rounded-2xl p-8 border ${currentColors.cardBorder} shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${benefit.gradient} ${currentColors.iconBg} backdrop-blur-sm transform transition-transform duration-300 hover:rotate-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${currentColors.heading}`}>
                  {benefit.title}
                </h3>
                <p className={`${currentColors.text} text-lg`}>
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>

 
      </div>
    </section>
  );
}