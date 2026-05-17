




import React from 'react';
import { motion } from 'framer-motion';
import { Home, Target, Users, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import CountUp from './Contup';

const milestones = [
  {
    icon: Home,
    title: 'Properties Listed',
    value: 5000,
    description: 'And growing daily',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: Target,
    title: 'Happy Clients',
    value: 10000,
    description: 'Satisfied customers',
    gradient: 'from-green-500 to-green-600'
  },
  {
    icon: Users,
    title: 'Agents Network',
    value: 500,
    description: 'Professional partners',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: Award,
    title: 'Awards Won',
    value: 25,
    description: 'Industry recognition',
    gradient: 'from-amber-500 to-amber-600'
  }
];

export default function Milestones() {
  const { theme } = useTheme();

  // Theme-aware colors
  const colors = {
    light: {
      background: 'from-gray-50 to-white',
      heading: 'text-gray-900',
      divider: 'bg-blue-600',
      subtext: 'text-gray-600',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      title: 'text-gray-800',
      description: 'text-gray-600'
    },
    dark: {
      background: 'from-gray-900 to-gray-800',
      heading: 'text-white',
      divider: 'bg-indigo-500',
      subtext: 'text-gray-300',
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      title: 'text-gray-100',
      description: 'text-gray-400'
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
            Our Journey So Far
          </h2>
          <div className={`w-24 h-1 ${currentColors.divider} mx-auto mb-6`}></div>
          <p className={`${currentColors.subtext} text-lg max-w-2xl mx-auto`}>
            Milestones that mark our growth and success
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <motion.div
                key={milestone.title}
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
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-r ${milestone.gradient} shadow-md`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </div>
                 <h3 className="text-5xl font-bold text-blue-600 mb-4">
                   <CountUp from={0} to={milestone.value} duration={2} separator="," />
            </h3>
                <p className={`text-xl font-semibold mb-3 text-center ${currentColors.title}`}>
                  {milestone.title}
                </p>
                <p className={`text-lg text-center ${currentColors.description}`}>
                  {milestone.description}
                </p>
              </motion.div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
}






