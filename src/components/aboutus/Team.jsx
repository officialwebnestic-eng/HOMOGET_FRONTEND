import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import TeamMember from "./Teammember";
import useGetAllAgent from "../../hooks/useGetAllAgent";



export default function Team() {
  const { theme } = useTheme();


   const  {agentList,loading,error } = useGetAllAgent()

  // Theme-aware colors
  const colors = {
    light: {
      background: "from-white to-gray-50",
      text: "text-gray-600",
      heading: "text-gray-900",
      divider: "bg-blue-600",
      cardBg: "bg-white",
      cardBorder: "border-gray-200",
      cardShadow: "shadow-lg hover:shadow-xl"
    },
    dark: {
      background: "from-gray-900 to-gray-800",
      text: "text-gray-300",
      heading: "text-white",
      divider: "bg-indigo-500",
      cardBg: "bg-gray-800",
      cardBorder: "border-gray-700",
      cardShadow: "shadow-lg hover:shadow-xl"
    }
  };

  const currentColors = colors[theme];

  return (
<section className={`py-24 ${currentColors.background}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Heading Section */}
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${currentColors.heading}`}>
        Meet Our Team
      </h2>
      <div className={`w-24 h-1 ${currentColors.divider} mx-auto mb-6 rounded-full`}></div>
      <p className={`${currentColors.text} text-lg max-w-2xl mx-auto`}>
        The passionate individuals behind BuildEstate's success
      </p>
    </motion.div>

    {/* Team Members Grid */}
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {agentList.map((member, index) => (
        <motion.div
          key={index}
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
              ? "0 20px 30px rgba(0, 0, 0, 0.3)"
              : "0 20px 30px rgba(0, 0, 0, 0.15)"
          }}
          className={`transform transition-transform duration-300 rounded-xl ${currentColors.cardBg} border ${currentColors.cardBorder} ${currentColors.cardShadow} hover:shadow-xl hover:scale-105`}
        >
          <TeamMember 
            {...member} 
            theme={theme}
            cardStyle={{
              backgroundColor: currentColors.cardBg,
              borderColor: currentColors.cardBorder
            }}
          />
        </motion.div>
      ))}
    </div>

    {/* Call-to-action Button */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="mt-16 text-center"
    >
     
    </motion.div>
  </div>
</section>
  );
}