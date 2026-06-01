import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext'; 
import { http } from '../../axios/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { 
  ArrowRight, Calendar, Clock, Search, X, ShieldCheck, Quote,
  User, Tag, Eye, Heart, ChevronDown, Filter
} from 'lucide-react';
import { notfound } from '../../ExportImages';
import { toast } from 'react-toastify';

const Blog = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // Categories
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'Luxury Living', name: 'Luxury Living' },
    { id: 'Investment Tips', name: 'Investment Tips' },
    { id: 'Market Updates', name: 'Market Updates' },
    { id: 'Buyer Guides', name: 'Buyer Guides' },
    { id: 'Real Estate News', name: 'Real Estate News' },
    { id: 'Developer Spotlight', name: 'Developer Spotlight' },
    { id: 'Off-Plan Projects', name: 'Off-Plan Projects' }
  ];

  useEffect(() => {
    const getblogs = async () => {
      try {
        setIsLoading(true);
        const response = await http.get("/blogs/all", { withCredentials: true });
        if (response.data.success) {
          setBlogData(response.data.data);
          setFilteredBlogs(response.data.data);
        }
      } catch (error) {
        console.log("Error:", error);
        toast.error("Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    }; 
    getblogs();
  }, []);

  useEffect(() => {
    let filtered = [...blogData];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.blogtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogtags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogauthor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.blogcategory === selectedCategory);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.blogpublishdate) - new Date(a.blogpublishdate);
      } else if (sortBy === 'oldest') {
        return new Date(a.blogpublishdate) - new Date(b.blogpublishdate);
      } else if (sortBy === 'mostViewed') {
        return (b.views || 0) - (a.views || 0);
      } else if (sortBy === 'mostLiked') {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });
    
    setFilteredBlogs(filtered);
  }, [searchTerm, blogData, selectedCategory, sortBy]);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    if (!content) return '3 min read';
    const words = content.split(/\s+/g).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const colors = {
    bg: isDark ? "bg-[#0a0a0c]" : "bg-white",
    card: isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200",
    textHeading: isDark ? "text-white" : "text-[#1a1a1e]", 
    textSub: isDark ? "text-slate-400" : "text-slate-500",
    amber: "text-[#e67e22]"
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-500`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000" 
            alt="Dubai Infrastructure" 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${isDark ? 'bg-black/70' : 'bg-gradient-to-r from-white via-white/80 to-transparent'}`}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Market Insights
              </span>
            </motion.div>

            <div className="space-y-0 mt-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className={`text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter ${colors.textHeading} leading-[0.9]`}
              >
                Journal
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-6xl md:text-7xl lg:text-8xl font-serif italic font-light text-orange-500 leading-[1.1]"
              >
                Insights
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="max-w-md text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium mt-6"
            >
              Expert market analysis and insights on Dubai's premium real estate market, 
              investment opportunities, and property trends.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="pt-8 max-w-lg"
            >
              <div className={`flex items-center rounded-full p-2 shadow-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-200'}`}>
                <Search className="ml-4 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full bg-transparent p-3 outline-none text-sm font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <X size={16} />
                  </button>
                )}
                <button className="bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                  Search
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FILTERS & SORTING SECTION --- */}
      <section className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="hidden md:flex items-center gap-2">
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1 rounded-lg text-xs font-medium border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostViewed">Most Viewed</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedCategory === cat.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- BLOG GRID SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-2xl font-bold ${colors.textHeading}`}>
              Latest Articles
            </h2>
            <p className={`text-sm ${colors.textSub} mt-1`}>
              {filteredBlogs.length} articles found
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-[400px] rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleBlogClick(blog._id)}
                className={`group rounded-2xl overflow-hidden border ${colors.card} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={blog.image?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=500"} 
                    alt={blog.blogtitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-orange-500 text-white text-[8px] font-bold rounded-md">
                      {blog.blogcategory || 'General'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {blog.blogauthor || 'Admin'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(blog.blogpublishdate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {getReadingTime(blog.blogcontent)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold mb-2 line-clamp-2 group-hover:text-orange-500 transition ${colors.textHeading}`}>
                    {blog.blogtitle}
                  </h3>

                  {/* Summary */}
                  <p className={`text-sm line-clamp-2 mb-4 ${colors.textSub}`}>
                    {blog.blogsummary || blog.blogcontent?.substring(0, 120) + '...'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye size={12} /> {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Heart size={12} /> {blog.likes || 0}
                      </span>
                    </div>
                    <button className="text-orange-500 group-hover:translate-x-1 transition-transform">
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <img src={notfound} className="w-48 mx-auto opacity-20 grayscale mb-6" alt="notfound" />
            <h3 className={`text-2xl font-serif italic ${colors.textSub}`}>No Articles Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={`text-3xl font-bold mb-3 ${colors.textHeading}`}>
            Subscribe to Our Newsletter
          </h2>
          <p className={`text-gray-500 mb-6`}>
            Get the latest real estate insights and market updates delivered to your inbox.
          </p>
          <div className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;