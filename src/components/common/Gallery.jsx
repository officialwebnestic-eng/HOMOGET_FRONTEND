import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, Download, Share2, Star, Trophy, Gift, Sparkles, Camera } from "lucide-react";
 import { useTheme } from "../../context/ThemeContext";
// Gallery images data
const galleryImages = [
  {
    id: 1,
    title: "Luxury Villa Sunset",
    category: "Villas",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    views: 2450
  },
  {
    id: 2,
    title: "Downtown Skyline View",
    category: "Apartments",
    image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: false,
    views: 1820
  },
  {
    id: 3,
    title: "Modern Family Home",
    category: "Houses",
    image: "https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    views: 3200
  },
  {
    id: 4,
    title: "Beachfront Paradise",
    category: "Condos",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    views: 4100
  },
  {
    id: 5,
    title: "Mountain Retreat View",
    category: "Cabins",
    image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: false,
    views: 1650
  },
  {
    id: 6,
    title: "Industrial Loft Space",
    category: "Lofts",
    image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: false,
    views: 2800
  },
  {
    id: 7,
    title: "Garden Estate",
    category: "Estates",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    views: 3600
  },
  {
    id: 8,
    title: "City Penthouse",
    category: "Penthouses",
    image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: true,
    views: 5200
  },
  {
    id: 9,
    title: "Cozy Cottage",
    category: "Cottages",
    image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800",
    featured: false,
    views: 1900
  }
];

const categories = ["All", "Villas", "Apartments", "Houses", "Condos", "Cabins", "Lofts", "Estates", "Penthouses", "Cottages"];

const celebrations = [
  { icon: Camera, text: "10,000+ Photos Captured", color: "text-blue-400" },
  { icon: Trophy, text: "Award Winning Gallery", color: "text-yellow-400" },
  { icon: Gift, text: "Premium Collection", color: "text-pink-400" },
  { icon: Sparkles, text: "Stunning Visual Stories", color: "text-purple-400" }
];

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [celebrationIndex, setCelebrationIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null); 
   const {theme}=useTheme()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCelebrationIndex((prev) => (prev + 1) % celebrations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredImages = galleryImages.filter(image => {
    if (filter === 'All') return true;
    return image.category === filter;
  });

  const toggleFavorite = (imageId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/5 to-violet-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 pt-20 pb-12 px-6">
        {/* Celebration Banner */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={celebrationIndex}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-white"
            >
              {React.createElement(celebrations[celebrationIndex].icon, {
                className: `w-5 h-5 ${celebrations[celebrationIndex].color}`
              })}
              <span className="font-medium">{celebrations[celebrationIndex].text}</span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-1 bg-yellow-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Main Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            Visual Gallery
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore breathtaking architectural photography and stunning property visuals that inspire and captivate.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === category
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <div className="relative z-10 px-6 pb-20">
        <motion.div 
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto"
          layout
        >
          <AnimatePresence>
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -50, rotateX: -15 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                className="group relative"
              >
                <motion.div
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
                  whileHover={{
                    y: -8,
                    rotateX: 3,
                    rotateY: 3,
                    scale: 1.02,
                    boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.3)"
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Featured Badge */}
                    {image.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          FEATURED
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        onClick={() => toggleFavorite(image.id)}
                        className="p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart 
                          className={`w-4 h-4 transition-colors duration-300 ${
                            favorites.has(image.id) 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-white'
                          }`}
                        />
                      </motion.button>
                      <motion.button
                        className="p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 hover:bg-black/60 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold text-sm mb-1">{image.title}</h3>
                          <span className="text-purple-300 text-xs font-medium">{image.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-300">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs">{image.views.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => setSelectedImage(image)}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.button>
                        <motion.button
                          className="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Happy Clients & Birthday Celebration Section */}
      <motion.div 
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🎉 Happy Clients & Celebrations 🎂
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied clients celebrating their dream homes and milestone moments!
            </p>
          </motion.div>

          {/* Happy Clients Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Client Testimonial Cards */}
            {[
              {
                name: "Sarah & Mike Johnson",
                location: "Beverly Hills, CA",
                message: "Found our dream home through this amazing gallery! The visual experience made our decision so much easier.",
                rating: 5,
                celebration: "🏡 New Home",
                image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
              },
              {
                name: "Emma Rodriguez",
                location: "Miami Beach, FL",
                message: "Celebrating 2 years in our beachfront condo! Still in love with every sunset view.",
                rating: 5,
                celebration: "🎂 2nd Anniversary",
                image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200"
              },
              {
                name: "David & Lisa Chen",
                location: "Manhattan, NY",
                message: "Our apartment warming party was incredible! Thank you for helping us find this perfect space.",
                rating: 5,
                celebration: "🎊 Housewarming",
                image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200"
              },
              {
                name: "Jennifer Martinez",
                location: "Austin, TX",
                message: "Three years in our suburban home and we're still throwing amazing backyard parties! Best investment ever.",
                rating: 5,
                celebration: "🎉 3rd Anniversary",
                image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200"
              },
              {
                name: "Robert & Amanda Wilson",
                location: "Seattle, WA",
                message: "Our downtown loft has been perfect for entertaining. Just celebrated our 1st year here with friends!",
                rating: 5,
                celebration: "🥂 1st Year",
                image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200"
              },
              {
                name: "Michael Thompson",
                location: "Denver, CO",
                message: "Mountain view cabin is everything I dreamed of! Celebrated my birthday here with the most amazing sunset.",
                rating: 5,
                celebration: "🎂 Birthday Party",
                image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200"
              }
            ].map((client, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-purple-400 to-pink-400 p-1">
                    <img 
                      src={client.image} 
                      alt={client.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{client.name}</h3>
                    <p className="text-gray-300 text-sm">{client.location}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(client.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block bg-gradient-to-r from-yellow-400/20 to-pink-400/20 border border-yellow-400/30 rounded-full px-4 py-2 text-yellow-300 text-sm font-medium">
                    {client.celebration}
                  </span>
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">
                  "{client.message}"
                </p>
              </motion.div>
            ))}
          </div>

          {/* Birthday Celebration Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              "https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/2072167/pexels-photo-2072167.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/3171815/pexels-photo-3171815.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/5638531/pexels-photo-5638531.jpeg?auto=compress&cs=tinysrgb&w=300",
              "https://images.pexels.com/photos/1729932/pexels-photo-1729932.jpeg?auto=compress&cs=tinysrgb&w=300"
            ].map((image, index) => (
              <motion.div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateZ: 2 }}
              >
                <img 
                  src={image} 
                  alt={`Celebration moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <span className="text-white text-sm font-medium">🎉 Celebration Memory</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Birthday Celebration Section */}
          <motion.div
            className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎂🎉🎊
              </motion.div>
              
              <h3 className="text-4xl font-bold text-white mb-4">
                Celebrating 5 Years of Excellence!
              </h3>
              
              <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
                Join us in celebrating our 5th anniversary! Thank you to all our amazing clients who made this journey possible.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { number: "15,000+", label: "Happy Clients", icon: "😊" },
                  { number: "8,500+", label: "Homes Sold", icon: "🏠" },
                  { number: "25,000+", label: "Gallery Views", icon: "👀" },
                  { number: "98%", label: "Satisfaction Rate", icon: "⭐" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-gray-300 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-8 py-4 rounded-full text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(236, 72, 153, 0.3)",
                    "0 0 40px rgba(236, 72, 153, 0.5)",
                    "0 0 20px rgba(236, 72, 153, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎁 Join Our Celebration! 🎁
              </motion.button>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md border border-white/20 rounded-full px-8 py-4 mb-6"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 40px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(139, 92, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Camera className="w-6 h-6 text-pink-400" />
              <span className="text-white font-semibold text-lg">
                🎨 Celebrating visual excellence in real estate photography! 📸
              </span>
            </motion.div>
            
            <motion.button
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-12 py-4 rounded-full text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore More Stunning Visuals! 🌟
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Modal (Simple placeholder) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;