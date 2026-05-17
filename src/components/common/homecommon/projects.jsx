import React from "react";
import { motion } from "framer-motion";
import HeroSlider from "./HeroSlider";

const projects = [
  {
    title: "Luxury Villa",
    address: "123 Sunset Blvd, LA",
    sqft: "3,200 sq ft",
    price: "$2,100,000",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Smart Apartment",
    address: "89 Tech Park Ave, NY",
    sqft: "1,200 sq ft",
    price: "$950,000",
    image: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Beach House",
    address: "45 Ocean Drive, FL",
    sqft: "2,500 sq ft",
    price: "$1,700,000",
    image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const Projects = () => {
  return (
    <>
    <HeroSlider></HeroSlider>
    <section className="w-full px-6 py-12 bg-white dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        Featured Listings
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl"
            whileHover={{
              rotateY: 10,
              rotateX: -5,
              scale: 1.03,
            }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <div
              className="h-56 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.image})` }}
            ></div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {project.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">
               Location: {project.address}
              </p>
              <p className="text-sm text-gray-400">{project.sqft}</p>
              <p className="text-red-600 font-bold">{project.price}</p>
              <button className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Schedule Visit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    </>
  );
};

export default Projects;
