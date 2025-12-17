import React from 'react';
import WalkThroughPage from './WalkThroughPage';
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { HomeModernIcon, ViewfinderCircleIcon, CalendarIcon } from "@heroicons/react/24/outline";

const VirtualTourAndWalkthrough = () => {
  const { theme } = useTheme();

  // Theme configuration
  const themeClasses = {
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-100",
      textSecondary: "text-gray-400",
      card: "bg-gray-800 border-gray-700",
      heading: "text-gray-50",
      subCard: "bg-gray-700",
      button: "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700",
      imageOverlay: "bg-gray-800/50"
    },
    light: {
      bg: "bg-gray-50",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      card: "bg-white border-gray-200",
      heading: "text-gray-900",
      subCard: "bg-gray-100",
      button: "bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600",
      imageOverlay: "bg-white/50"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const rooms = [
    {
      name: "Living Room",
      description: "Click on the hotspot in the living room to zoom in on the elegant fireplace and modern design.",
      image: "https://images.pexels.com/photos/2425012/pexels-photo-2425012.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Bedroom",
      description: "Use the interactive points to move around the bedroom and discover its spaciousness.",
      image: "https://images.pexels.com/photos/1777023/pexels-photo-1777023.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Kitchen",
      description: "Explore the modern appliances and spacious countertops in our fully equipped kitchen.",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      name: "Bathroom",
      description: "Check out the premium finishes and luxurious amenities in each bathroom.",
      image: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-6"
          >
            <HomeModernIcon className={`h-12 w-12 mx-auto ${theme === "dark" ? "text-teal-400" : "text-blue-600"}`} />
          </motion.div>
          <h1 className={`text-4xl md:text-5xl font-bold ${currentTheme.heading} mb-4`}>
            Explore Our Virtual Tour and 3D Walkthrough
          </h1>
          <p className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto`}>
            Immerse yourself in our properties with interactive 360° views and detailed walkthroughs
          </p>
        </motion.div>

        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`rounded-xl shadow-xl p-6 mb-12 border ${currentTheme.card} ${currentTheme.border}`}
        >
          <div className="flex items-center mb-6">
            <ViewfinderCircleIcon className={`h-8 w-8 mr-3 ${theme === "dark" ? "text-teal-400" : "text-blue-600"}`} />
            <h2 className={`text-3xl font-semibold ${currentTheme.heading}`}>
              3D Property Walkthrough
            </h2>
          </div>
          
          <WalkThroughPage />
          
          <p className={`mt-6 ${currentTheme.text}`}>
            Take a step inside and explore the property like never before with our immersive 3D walkthrough. 
            Navigate through different rooms, zoom in on details, and experience the layout as if you're 
            walking through the space.
          </p>
        </motion.section>

        {/* Interactive Tour Section */}
        <section className="mb-12">
          <h2 className={`text-3xl font-semibold ${currentTheme.heading} mb-8 text-center`}>
            Interactive Virtual Tour
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-lg ${currentTheme.subCard}`}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 ${currentTheme.imageOverlay}`}></div>
                </div>
                <div className="p-4">
                  <h3 className={`text-xl font-semibold mb-2 ${currentTheme.heading}`}>
                    {room.name}
                  </h3>
                  <p className={currentTheme.textSecondary}>
                    {room.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

       
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="flex justify-center mb-6">
            <CalendarIcon className={`h-10 w-10 ${theme === "dark" ? "text-teal-400" : "text-blue-600"}`} />
          </div>
          <h2 className={`text-3xl font-semibold ${currentTheme.heading} mb-4`}>
            Schedule a Live Virtual Tour
          </h2>
          <p className={`text-lg ${currentTheme.textSecondary} mb-8 max-w-2xl mx-auto`}>
            Experience a personalized walkthrough with one of our agents at a time that works for you.
          </p>
          <NavLink
            to="/virtualtoure"
            className={`px-8 py-3 ${currentTheme.button} text-white font-semibold rounded-lg shadow-lg transition duration-300 inline-flex items-center`}
          >
            Book Your Tour
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
};

export default VirtualTourAndWalkthrough;