import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext'; 
import AgentSlider from './homecommon/AgentSlider';
import { http } from '../../axios/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaTags, 
  FaGlobe, 
  FaFileAlt, 
  FaAlignLeft,
  FaEye,
  FaShare,
  FaBookmark,
  FaArrowRight,
  FaClock,
  FaQuoteLeft
} from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { notfound } from '../../ExportImages';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.15, duration: 0.6, ease: 'easeOut' }
  })
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const Blog = () => {
  const { theme } = useTheme();
  const [blogData, setBlogData] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    const getblogs = async () => {
      try {
        setIsLoading(true);
        const response = await http.get("/getdatablogs", {
          withCredentials: true
        });
        if (response.data.success === true) {
          setBlogData(response.data.data);
          setFilteredBlogs(response.data.data);
        }
      } catch (error) {
        console.log("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }; 

    getblogs();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = blogData.filter(blog =>
        blog.blogtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogcontent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogtags.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs(blogData);
    }
  }, [searchTerm, blogData]);

  const themeClasses = {
    dark: {
      bg: 'bg-gray-900',
      cardBg: 'bg-gray-800/50 backdrop-blur-sm border-gray-700/50',
      text: 'text-gray-100',
      subText: 'text-gray-300',
      mutedText: 'text-gray-400',
      accent: 'from-blue-500 to-purple-600',
      hover: 'hover:bg-gray-700/50',
      border: 'border-gray-700',
      shadow: 'shadow-2xl shadow-gray-900/50',
      modalBg: 'bg-gray-800/95 backdrop-blur-xl',
      gradient: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    },
    light: {
      bg: 'bg-gradient-to-br from-slate-50 via-white to-blue-50',
      cardBg: 'bg-white/80 backdrop-blur-sm border-gray-200/50',
      text: 'text-gray-900',
      subText: 'text-gray-700',
      mutedText: 'text-gray-500',
      accent: 'from-blue-600 to-purple-600',
      hover: 'hover:bg-gray-50/80',
      border: 'border-gray-200',
      shadow: 'shadow-xl shadow-gray-200/50',
      modalBg: 'bg-white/95 backdrop-blur-xl',
      gradient: 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${currentTheme.gradient}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <FaFileAlt className="text-blue-500 mr-2" />
              <span className={`text-sm font-medium ${currentTheme.subText}`}>Real Estate Insights</span>
            </motion.div>
            
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${currentTheme.text}`}>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                Leatest News Feeds
              </span>
            </h1>
            
            <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed ${currentTheme.subText}`}>
              Discover the latest trends, expert insights, and valuable tips from our real estate professionals
            </p>

            {/* Search Bar */}
            <motion.div 
              className="max-w-md mx-auto relative"
              variants={slideIn}
              initial="hidden"
              animate="visible"
            >
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl border ${currentTheme.border} ${currentTheme.cardBg} ${currentTheme.text} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <FaEye className="text-gray-400" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container  mt-5 mx-auto px-4 pb-16">
        {isLoading ? (
          // Enhanced Loading State
          <div className="grid gap-8 lg:gap-12">
            {[...Array(3)].map((_, index) => (
              <motion.div 
                key={index}
                className={`rounded-3xl border ${currentTheme.border} ${currentTheme.cardBg} ${currentTheme.shadow} overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-1/2 h-80 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
                  <div className="w-full lg:w-1/2 p-8 space-y-4">
                    <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6" />
                    </div>
                    <div className="flex gap-4">
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    </div>
                    <div className="h-12 w-32 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 rounded-xl animate-pulse mt-6" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="space-y-8 lg:space-y-12">
            {filteredBlogs.map((blog, index) => (
              <motion.article
                key={blog._id || index}
                className={`group rounded-3xl border ${currentTheme.border} ${currentTheme.cardBg} ${currentTheme.shadow} overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                custom={index % 3 + 1}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="w-full lg:w-1/2 relative overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full">
                        {blog.blogcategory}
                      </span>
                    </div>
                    
                    <Swiper
                      spaceBetween={0}
                      pagination={{ 
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet !bg-white/70',
                        bulletActiveClass: 'swiper-pagination-bullet-active !bg-white'
                      }}
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      loop={true}
                      effect="fade"
                      modules={[Pagination, Autoplay, EffectFade]}
                      className="h-80 lg:h-full group-hover:scale-110 transition-transform duration-700"
                    >
                      {blog.image && blog.image.length > 0 ? (
                        blog.image.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <div className="relative h-full">
                              <img 
                                src={img} 
                                alt={`${blog.blogtitle} - Image ${idx + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <div className={`flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700`}>
                            <div className="text-center">
                              <FaFileAlt className={`text-4xl mb-2 ${currentTheme.mutedText}`} />
                              <span className={currentTheme.mutedText}>No Image Available</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  </div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className={`flex items-center ${currentTheme.mutedText}`}>
                          <FaUser className="mr-2 text-blue-500" />
                          <span className="text-sm font-medium">{blog.blogauthor}</span>
                        </div>
                        <div className={`flex items-center ${currentTheme.mutedText}`}>
                          <FaCalendarAlt className="mr-2 text-orange-500" />
                          <span className="text-sm">{formatDate(blog.blogpublishdate)}</span>
                        </div>
                        <div className={`flex items-center ${currentTheme.mutedText}`}>
                          <FaClock className="mr-2 text-green-500" />
                          <span className="text-sm">{readingTime(blog.blogcontent)} min read</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className={`text-2xl lg:text-3xl font-bold mb-4 leading-tight ${currentTheme.text} group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                        {blog.blogtitle}
                      </h2>

                      {/* Excerpt */}
                      <div className="relative">
                        <FaQuoteLeft className="absolute -top-2 -left-2 text-blue-500/20 text-2xl" />
                        <p className={`text-base lg:text-lg leading-relaxed mb-6 pl-6 ${currentTheme.subText}`}>
                          {blog.blogcontent.slice(0, 180)}...
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {blog.blogtags.split(',').slice(0, 3).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className={`px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800`}
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <motion.button
                        onClick={() => setSelectedBlog(blog)}
                        className={`group flex items-center px-6 py-3 bg-gradient-to-r ${currentTheme.accent} text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Read Full Article</span>
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </motion.button>

                      <div className="flex items-center gap-2">
                        <motion.button 
                          className={`p-3 rounded-full ${currentTheme.hover} transition-colors`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaBookmark className={currentTheme.mutedText} />
                        </motion.button>
                        <motion.button 
                          className={`p-3 rounded-full ${currentTheme.hover} transition-colors`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaShare className={currentTheme.mutedText} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          // Enhanced Empty State
          <motion.div 
            className={`text-center py-16 rounded-3xl ${currentTheme.cardBg} ${currentTheme.shadow} max-w-2xl mx-auto`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center p-8">
              <motion.img 
                src={notfound} 
                className="w-72 h-72 object-contain mb-8 opacity-60"
                alt="No Blog Available"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <div className="space-y-4">
                <h3 className={`text-2xl font-bold ${currentTheme.text}`}>
                  {searchTerm ? 'No articles found' : 'No Blog Posts Available'}
                </h3>
                <p className={`text-lg ${currentTheme.subText} max-w-md`}>
                  {searchTerm 
                    ? `No articles match "${searchTerm}". Try searching for something else.`
                    : 'Check back later for new real estate insights and expert articles'
                  }
                </p>
                {searchTerm && (
                  <motion.button
                    onClick={() => setSearchTerm('')}
                    className={`mt-4 px-6 py-3 bg-gradient-to-r ${currentTheme.accent} text-white font-semibold rounded-xl hover:shadow-lg transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Search
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedBlog && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            >
              <motion.div 
                className={`relative max-w-5xl w-full rounded-3xl overflow-hidden ${currentTheme.shadow} ${currentTheme.modalBg} border ${currentTheme.border}`}
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                {/* Close Button */}
                <motion.button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-6 right-6 z-20 p-3 rounded-full bg-red-500/10 backdrop-blur-sm text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes className="text-lg" />
                </motion.button>

                <div className="max-h-[90vh] overflow-y-auto">
                  {/* Header Image */}
                  <div className="relative h-80">
                    <Swiper
                      spaceBetween={0}
                      pagination={{ clickable: true }}
                      autoplay={{ delay: 4000, disableOnInteraction: false }}
                      loop={true}
                      effect="fade"
                      modules={[Pagination, Autoplay, EffectFade]}
                      className="h-full"
                    >
                      {selectedBlog.image.map((img, idx) => (
                        <SwiperSlide key={idx}>
                          <img 
                            src={img} 
                            alt={`${selectedBlog.blogtitle} - Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-8 lg:p-12">
                    {/* Article Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                          {selectedBlog.blogcategory}
                        </span>
                        <div className={`flex items-center ${currentTheme.mutedText}`}>
                          <FaClock className="mr-2" />
                          <span className="text-sm">{readingTime(selectedBlog.blogcontent)} min read</span>
                        </div>
                      </div>
                      
                      <h1 className={`text-3xl lg:text-4xl font-bold mb-6 leading-tight ${currentTheme.text}`}>
                        {selectedBlog.blogtitle}
                      </h1>

                      <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className={`flex items-center ${currentTheme.subText}`}>
                          <FaUser className="mr-3 text-blue-500" />
                          <span className="font-medium">{selectedBlog.blogauthor}</span>
                        </div>
                        <div className={`flex items-center ${currentTheme.subText}`}>
                          <FaCalendarAlt className="mr-3 text-orange-500" />
                          <span>{formatDate(selectedBlog.blogpublishdate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className={`prose prose-lg max-w-none mb-8 ${currentTheme.text}`}>
                      <div className="relative">
                        <FaQuoteLeft className="absolute -top-4 -left-6 text-blue-500/20 text-4xl" />
                        <p className="text-lg leading-relaxed pl-8">
                          {selectedBlog.blogcontent}
                        </p>
                      </div>
                    </div>

                    {/* Article Meta */}
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-2xl border ${currentTheme.border} `}>
                      <div className="space-y-4">
                        <div className={`flex items-center ${currentTheme.subText}`}>
                          <FaTags className="mr-3 text-green-500" />
                          <span><strong>Tags:</strong> {selectedBlog.blogtags}</span>
                        </div>
                        <div className={`flex items-center ${currentTheme.subText}`}>
                          <FaGlobe className="mr-3 text-blue-500" />
                          <span><strong>Category:</strong> {selectedBlog.blogcategory}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className={`flex items-center ${currentTheme.subText}`}>
                          <FaFileAlt className="mr-3 text-purple-500" />
                          <span><strong>Summary:</strong> {selectedBlog.blogsummary}</span>
                        </div>
                        <div className={`flex items-center ${currentTheme.subText}`}>
                          <FaUser className="mr-3 text-pink-500" />
                          <span><strong>Author:</strong> {selectedBlog.blogauthor}</span>
                        </div>
                      </div>
                    </div>

                    {/* SEO Meta Information */}
                    {(selectedBlog.seometatitle || selectedBlog.seometadiscription) && (
                      <div className={`mt-8 p-6 rounded-2xl border ${currentTheme.border}`}>
                        <h3 className={`text-xl font-semibold mb-4 ${currentTheme.text}`}>SEO Information</h3>
                        
                        {selectedBlog.seometatitle && (
                          <div className="mb-4">
                            <h4 className={`font-medium mb-2 ${currentTheme.subText}`}>Meta Title</h4>
                            <p className={`text-sm ${currentTheme.mutedText}`}>{selectedBlog.seometatitle}</p>
                          </div>
                        )}
                        
                        {selectedBlog.seometadiscription && (
                          <div>
                            <h4 className={`font-medium mb-2 ${currentTheme.subText}`}>Meta Description</h4>
                            <p className={`text-sm ${currentTheme.mutedText}`}>{selectedBlog.seometadiscription}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blog;