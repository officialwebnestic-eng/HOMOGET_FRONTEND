import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation as SwiperNav } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { 
  ArrowLeft, Calendar, Clock, User, Tag, Eye, ThumbsUp, 
  Share2, Bookmark, ChevronRight, Facebook, Twitter, 
  Linkedin, Link2, MessageCircle, Heart, ShieldCheck,
  Quote, ArrowRight, Loader2, AlertCircle, Camera, X,
  PlayCircle, Video, Grid3x3, Maximize2, Minimize2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useTheme } from '../../../context/ThemeContext';
import { http } from '../../../axios/axios';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await http.get(`/blog/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
        setLikesCount(response.data.data.likes || 0);
        fetchRelatedBlogs(response.data.data.blogcategory);
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError(err.response?.data?.message || "Failed to load blog");
      toast.error("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category) => {
    try {
      const response = await http.get(`/blogs/category/${category}?limit=3`);
      if (response.data.success) {
        const related = response.data.data.filter(blog => blog._id !== id);
        setRelatedBlogs(related);
      }
    } catch (err) {
      console.error("Error fetching related blogs:", err);
    }
  };

  const handleLike = async () => {
    if (liked) return;
    try {
      const response = await http.put(`/blog/${id}/like`);
      if (response.data.success) {
        setLiked(true);
        setLikesCount(prev => prev + 1);
        toast.success("Thanks for liking!");
      }
    } catch (err) {
      console.error("Error liking blog:", err);
      toast.error("Failed to like blog");
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.blogtitle,
          text: blog?.blogsummary,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMMM dd, yyyy');
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const words = content.split(/\s+/g).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Prepare media items for gallery
  const mediaItems = [
    ...(blog?.image || []).map(img => ({ type: 'image', url: img })),
    ...(blog?.videos ? [{ type: 'video', url: blog.videos }] : []),
    ...(blog?.virtualTour360 ? [{ type: '360', url: blog.virtualTour360 }] : [])
  ];

  const openGallery = (index) => {
    setSelectedMediaIndex(index);
    setShowGalleryModal(true);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Article Not Found
          </h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      
      {/* Hero Section with Swiper Gallery */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {mediaItems.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, SwiperNav]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 4000 }}
            className="h-full w-full"
          >
            {mediaItems.map((item, idx) => (
              <SwiperSlide key={idx}>
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    className="w-full h-full object-cover" 
                    alt={`${blog.blogtitle} - ${idx + 1}`} 
                  />
                ) : item.type === 'video' ? (
                  <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                    <PlayCircle size={64} className="text-amber-500 mb-4" />
                    <span className="text-white text-sm">Video Tour Available</span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                    <Video size={64} className="text-amber-500 mb-4" />
                    <span className="text-white text-sm">360° Virtual Tour Available</span>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000"
            alt={blog.blogtitle}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/blog')}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-black/70 transition"
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>

        {/* View Gallery Button */}
        {mediaItems.length > 1 && (
          <button
            onClick={() => openGallery(0)}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-medium hover:bg-amber-500 hover:text-black transition"
          >
            <Camera size={16} /> View Gallery ({mediaItems.length})
          </button>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-5xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-amber-500 text-black rounded-full text-xs font-bold uppercase tracking-wider">
                {blog.blogcategory || 'Uncategorized'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {blog.blogtitle}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{blog.blogauthor || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formatDate(blog.blogpublishdate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{getReadingTime(blog.blogcontent)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye size={14} />
                <span>{blog.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section (Thumbnails below) */}
      {mediaItems.length > 1 && (
        <section className="py-12 px-6 md:px-12 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500 mb-6 md:mb-10 flex items-center gap-2">
              <div className="w-1 h-8 bg-amber-500"></div>
              Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaItems.slice(0, 8).map((item, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer group rounded-lg"
                  onClick={() => openGallery(idx)}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : item.type === 'video' ? (
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center group-hover:bg-gray-700 transition">
                      <PlayCircle size={32} className="text-amber-500 mb-1" />
                      <span className="text-xs text-white">Video Tour</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center group-hover:bg-gray-700 transition">
                      <Video size={32} className="text-amber-500 mb-1" />
                      <span className="text-xs text-white">360 Tour</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
              ))}
            </div>
            {mediaItems.length > 8 && (
              <button
                onClick={() => openGallery(0)}
                className="mt-4 text-sm text-amber-500 hover:text-amber-600 transition flex items-center gap-1"
              >
                <Grid3x3 size={14} /> View all {mediaItems.length} media
              </button>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Share Bar */}
            <div className="sticky top-24 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Share this article:</span>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-white transition"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.blogtitle)}&url=${encodeURIComponent(window.location.href)}`)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-400 hover:text-white transition"
                >
                  <Twitter size={16} />
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-600 hover:text-white transition"
                >
                  <Facebook size={16} />
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-700 hover:text-white transition"
                >
                  <Linkedin size={16} />
                </button>
              </div>
            </div>

            {/* Blog Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none">
              {blog.blogsummary && (
                <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl mb-8 border-l-4 border-amber-500">
                  <Quote size={24} className="text-amber-500 mb-3" />
                  <p className="text-lg italic text-gray-700 dark:text-gray-300">
                    {blog.blogsummary}
                  </p>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: blog.blogcontent }} className="blog-content" />
            </article>

            {/* Tags */}
            {blog.blogtags && blog.blogtags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(blog.blogtags) ? blog.blogtags : blog.blogtags.split(',')).map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Like Button */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-3 px-8 py-4 rounded-full transition-all ${
                  liked 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-white'
                }`}
              >
                <Heart size={20} fill={liked ? "white" : "none"} />
                <span className="font-semibold">{likesCount} Likes</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Card */}
            <div className={`p-6 rounded-2xl mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {blog.blogauthor?.charAt(0).toUpperCase() || 'A'}
                </div>
                <h3 className="text-xl font-bold mb-1">{blog.blogauthor || 'Admin'}</h3>
                <p className="text-sm text-gray-500 mb-4">Real Estate Expert</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expert insights on Dubai's luxury real estate market and investment opportunities.
                </p>
              </div>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((related) => (
                    <div
                      key={related._id}
                      onClick={() => navigate(`/blog/${related._id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="flex gap-3">
                        <img 
                          src={related.image?.[0]} 
                          alt={related.blogtitle}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm group-hover:text-amber-500 transition line-clamp-2">
                            {related.blogtitle}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(related.blogpublishdate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className={`p-6 rounded-2xl mt-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white`}>
              <h3 className="text-lg font-bold mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm opacity-90 mb-4">Get the latest real estate insights delivered to your inbox.</p>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg text-black mb-3"
              />
              <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      <AnimatePresence>
        {showGalleryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowGalleryModal(false)}
          >
            <div className="relative w-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <X size={24} className="text-white" />
              </button>
              
              <Swiper
                modules={[Pagination, SwiperNav]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                initialSlide={selectedMediaIndex}
                className="h-[80vh]"
              >
                {mediaItems.map((item, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="flex items-center justify-center h-full">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={`Gallery ${idx + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : item.type === 'video' ? (
                        <div className="text-center">
                          <PlayCircle size={80} className="text-amber-500 mx-auto mb-4" />
                          <p className="text-white">Video content will play here</p>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-amber-500 text-black rounded-lg text-sm">
                            Watch on external player
                          </a>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video size={80} className="text-amber-500 mx-auto mb-4" />
                          <p className="text-white">360° Virtual Tour</p>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-amber-500 text-black rounded-lg text-sm">
                            Launch Virtual Tour
                          </a>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styles for blog content */}
      <style jsx>{`
        .blog-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: ${isDark ? '#d1d5db' : '#374151'};
        }
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: ${isDark ? '#ffffff' : '#1f2937'};
        }
        .blog-content h2 { font-size: 1.875rem; }
        .blog-content h3 { font-size: 1.5rem; }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content ul, .blog-content ol { margin: 1rem 0 1rem 2rem; }
        .blog-content li { margin: 0.5rem 0; }
        .blog-content img { border-radius: 1rem; margin: 2rem 0; }
        .blog-content blockquote {
          border-left: 4px solid #f59e0b;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: ${isDark ? '#9ca3af' : '#6b7280'};
        }
        .blog-content a { color: #f59e0b; text-decoration: underline; }
        .blog-content pre {
          background: ${isDark ? '#1f2937' : '#f3f4f6'};
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;