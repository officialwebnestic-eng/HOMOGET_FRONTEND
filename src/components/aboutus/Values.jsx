import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

const values = [
  {
    icon: Shield,
    title: 'Trust',
    description: 'We verify all property owners and renters to ensure a safe and reliable experience for everyone.',
  },
  {
    icon: CheckCircle,
    title: 'Transparency',
    description: 'Clear and honest property listings with accurate information and no hidden fees.',
  },
  {
    icon: Clock,
    title: 'Efficiency',
    description: 'Streamlined property search and listing process to save you time and effort.',
  },
];

export default function Values() {
   const { theme } = useTheme();

  return (
    <section className={`bg-gradient-to-b ${theme === 'dark' ? 'from-gray-800 to-gray-900' : 'from-gray-50 to-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Our Values
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className={`max-w-2xl mx-auto text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            These core values guide everything we do at BuildEstate
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 hover:shadow-gray-800' 
                    : 'bg-white border-gray-100'
                }`}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:rotate-6 ${
                  theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100'
                }`}>
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {value.title}
                </h3>
                <p className={`leading-relaxed text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}