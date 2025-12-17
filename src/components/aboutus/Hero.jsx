import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "../../context/ThemeContext";

export default function Hero() {
  const { theme } = useTheme();

  // Theme-aware colors
  const colors = {
    light: {
      gradient: [
        'linear-gradient(to bottom right, rgba(37, 99, 235, 1), rgba(79, 70, 229, 1), rgba(124, 58, 237, 0.8))',
        'linear-gradient(to bottom right, rgba(79, 70, 229, 1), rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 1))',
        'linear-gradient(to bottom right, rgba(124, 58, 237, 0.8), rgba(37, 99, 235, 1), rgba(79, 70, 229, 1))'
      ],
      shapeColors: ['rgba(147, 197, 253, 0.5)', 'rgba(196, 181, 253, 0.5)', 'rgba(216, 180, 254, 0.5)'],
      textColor: 'text-white',
      lineColor: 'bg-white',
      patternOpacity: '0.3'
    },
    dark: {
      gradient: [
        'linear-gradient(to bottom right, rgba(30, 58, 138, 1), rgba(55, 48, 163, 1), rgba(91, 33, 182, 0.8))',
        'linear-gradient(to bottom right, rgba(55, 48, 163, 1), rgba(91, 33, 182, 0.8), rgba(30, 58, 138, 1))',
        'linear-gradient(to bottom right, rgba(91, 33, 182, 0.8), rgba(30, 58, 138, 1), rgba(55, 48, 163, 1))'
      ],
      shapeColors: ['rgba(30, 64, 175, 0.5)', 'rgba(67, 56, 202, 0.5)', 'rgba(109, 40, 217, 0.5)'],
      textColor: 'text-gray-100',
      lineColor: 'bg-indigo-300',
      patternOpacity: '0.2'
    }
  };

  const currentColors = colors[theme];

  return (
    <div className="relative">
      <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: currentColors.gradient
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Animated shapes */}
          <div className={`absolute inset-0 opacity-${currentColors.patternOpacity}`}>
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
              style={{ backgroundColor: currentColors.shapeColors[0] }}
              animate={{ 
                x: [0, 30, 0, -30, 0],
                y: [0, -30, 0, 30, 0],
                scale: [1, 1.1, 1, 0.9, 1]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
              style={{ backgroundColor: currentColors.shapeColors[1] }}
              animate={{ 
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 0, -40, 0],
                scale: [1, 0.9, 1, 1.1, 1]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full"
              style={{ backgroundColor: currentColors.shapeColors[2] }}
              animate={{ 
                x: [0, 50, 0, -50, 0],
                y: [0, -50, 0, 50, 0],
                scale: [1, 1.2, 1, 0.8, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          {/* Pattern overlay */}
          <div 
            className={`absolute inset-0 opacity-${currentColors.patternOpacity}`}
            style={{ 
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjMiPjxwYXRoIGQ9Ik01IDEwQzMuODk1IDEwIDMgMTAuODk1IDMgMTJ2MzhjMCAxLjEwNS44OTUgMiAyIDJoMzhWMTBINXptMzgtMkg1QzIuODEgOCAxIDkuODEgMSAxMnYzOGMwIDIuMTkgMS43OSA0IDQgNGg0MWMxLjEwNSAwIDItLjg5NSAyLTJWMTBjMC0xLjEwNS0uODk1LTItMi0yaC0zeiIvPjwvZz48L2c+PC9zdmc+")`,
              backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)'
            }}
          ></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`relative text-center px-4 max-w-4xl mx-auto z-10 ${currentColors.textColor}`}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight">
            Building Your Future,<br />One Home at a Time
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed font-light">
            We're more than just a property platform - we're your partner in finding the perfect place to call home.
          </p>
          
          {/* Decorative line */}
          <motion.div 
            className={`w-24 h-1 mx-auto mt-8 ${currentColors.lineColor}`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className={`w-6 h-10 border-2 ${theme === 'dark' ? 'border-indigo-300' : 'border-white'} rounded-full flex justify-center`}>
            <motion.div
              className={`w-1 h-2 ${theme === 'dark' ? 'bg-indigo-300' : 'bg-white'} rounded-full mt-2`}
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className={`absolute -bottom-1 left-0 right-0 h-16 ${theme === 'dark' ? 'text-gray-900' : 'text-white'}`}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="currentColor"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            fill="currentColor"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}