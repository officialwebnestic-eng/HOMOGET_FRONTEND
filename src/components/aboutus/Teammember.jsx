import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const TeamMember = ({ name, status, role, profilePhoto,email }) => {
  const { theme } = useTheme();

  // Theme-aware colors
  const colors = {
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      nameColor: 'text-gray-900',
      positionColor: 'text-blue-600',
      bioColor: 'text-gray-600',
      iconColor: 'text-gray-400',
      iconHover: {
        linkedin: 'hover:text-[#0A66C2]',
        twitter: 'hover:text-[#1DA1F2]',
        instagram: 'hover:text-[#E4405F]',
        email: 'hover:text-red-500'
      }
    },
    dark: {
      cardBg: 'bg-gray-800',
      cardBorder: 'border-gray-700',
      nameColor: 'text-white',
      positionColor: 'text-indigo-400',
      bioColor: 'text-gray-300',
      iconColor: 'text-gray-400',
      iconHover: {
        linkedin: 'hover:text-[#0A66C2]',
        twitter: 'hover:text-[#1DA1F2]',
        instagram: 'hover:text-[#E4405F]',
        email: 'hover:text-red-400'
      }
    }
  };

  const currentColors = colors[theme];

  return (
 <motion.div
  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
  whileTap={{ scale: 0.98 }}
  className={`${currentColors.cardBg} transition-all duration-300 border ${currentColors.cardBorder} overflow-hidden w-full max-w-sm mx-auto rounded-xl shadow-md hover:shadow-xl`}
>
<div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-sm">
      
   <div className="w-full flex justify-end mb-2 px-2">
  <p
    className={`text-sm ${currentColors.bioColor} uppercase tracking-wide px-2 py-1 rounded-full ${
      status === "active" ? "bg-green-300" : "bg-red-300"
    }`}
  >
    {status}
  </p>
</div>
  
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: "0  12px rgba(0,0,0,0.2)" }}
        className="mb-4 relative group"
      >
       
       
        <img
          src={profilePhoto}
          alt={name}
          className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </motion.div>

      {/* Member Info */}
      <div className="text-center px-2">
        <h3 className={`text-2xl font-semibold mb-1 ${currentColors.nameColor}`}>
          {name}
        </h3>
        <p className={`text-sm font-medium mb-2 ${currentColors.positionColor}`}>
          {email}
        </p>
        <p className={`text-sm font-medium ${currentColors.bioColor}`}>
          {role}
        </p>
      </div>
    </div>
</motion.div>
  );
};

export default TeamMember;