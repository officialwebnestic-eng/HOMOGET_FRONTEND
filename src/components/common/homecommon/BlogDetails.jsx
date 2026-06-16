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
  PlayCircle, Video, Grid3x3, Maximize2, Minimize2,
  Youtube, Instagram, Send, Globe, MapPin, Home,
  TrendingUp, Award, CheckCircle, ExternalLink, Image as ImageIcon
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
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

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

  // Fixed: Removed the stray 's' character at the end
  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareText = blog?.blogtitle || 'Check out this article';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(blog?.image?.[0] || '')}&description=${encodeURIComponent(shareText)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setShowShareMenu(false);
      return;
    }

    if (navigator.share && !platform) {
      try {
        await navigator.share({
          title: shareText,
          text: blog?.blogsummary,
          url: shareUrl,
        });
        setShowShareMenu(false);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      setShowShareMenu(false);
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
      setShowShareMenu(false);
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
    ...(blog?.videos?.map(video => ({ 
      type: 'video', 
      url: video.url,
      title: video.title || 'Video Tour',
      embedId: video.embedId
    })) || [])
  ];

  const openGallery = (index) => {
    setSelectedMediaIndex(index);
    setShowGalleryModal(true);
  };

  // Get social links
  const socialLinks = blog?.socialLinks || {};
  const hasSocialLinks = Object.values(socialLinks).some(link => link);

  // Get video embed URL for YouTube
  const getYouTubeEmbedUrl = (video) => {
    if (video.embedId) {
      return `https://www.youtube.com/embed/${video.embedId}`;
    }
    return video.url || '';
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
      
      {/* Hero Section - Split Layout: Left Slider (2/3) + Right Sidebar (1/3) */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="flex h-full">
          
          {/* Left - Main Slider (2/3) */}
          <div className="w-full md:w-2/3 h-full relative">
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
                      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center relative">
                        {item.embedId ? (
                          <iframe
                            src={getYouTubeEmbedUrl(item)}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={item.title || 'Video Tour'}
                          />
                        ) : (
                          <>
                            <PlayCircle size={64} className="text-amber-500 mb-4" />
                            <span className="text-white text-sm">{item.title || 'Video Tour Available'}</span>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-4 px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-semibold hover:bg-amber-400 transition"
                            >
                              Watch Video
                            </a>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                        <Video size={64} className="text-amber-500 mb-4" />
                        <span className="text-white text-sm">Virtual Tour Available</span>
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
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <div className="max-w-2xl">
                {/* Category Badge */}
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-amber-500 text-black rounded-full text-[9px] font-black uppercase tracking-wider">
                    {blog.blogcategory || 'Uncategorized'}
                  </span>
                  {blog.isFeatured && (
                    <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Award size={10} /> Featured
                    </span>
                  )}
                  {blog.isTrending && (
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp size={10} /> Trending
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight line-clamp-3">
                  {blog.blogtitle}
                </h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                  <div className="flex items-center gap-1.5">
                    <User size={12} />
                    <span>{blog.blogauthor || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{formatDate(blog.blogpublishdate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{getReadingTime(blog.blogcontent)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye size={12} />
                    <span>{blog.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/blog')}
              className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-[10px] font-medium hover:bg-black/70 transition"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

       {/* Right - Sidebar with Thumbnails (1/3) */}
<div className="hidden md:flex md:w-1/3 flex-col h-full">
  <div className="p-4 border-b border-gray-200 dark:border-gray-800">
    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 flex items-center gap-2">
      <Camera size={14} /> All Media ({mediaItems.length})
    </h3>
  </div>
  <div className="flex-1 overflow-y-auto p-3">
    <div className="grid grid-cols-2 gap-2">
      {/* Show first 3 images normally */}
      {mediaItems.slice(0, 3).map((item, idx) => (
        <div
          key={idx}
          className="relative aspect-[4/3] overflow-hidden cursor-pointer group rounded-lg bg-gray-100 dark:bg-gray-800"
          onClick={() => openGallery(idx)}
        >
          {item.type === 'image' && item.url ? (
            <img
              src={item.url}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon size={24} class="text-gray-400" />
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
              {item.type === 'video' ? (
                <>
                  <PlayCircle size={24} className="text-amber-500" />
                  <span className="text-[7px] text-gray-500 dark:text-gray-400 mt-0.5">{item.title || 'Video'}</span>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-gray-400" />
                  <span className="text-[7px] text-gray-500 dark:text-gray-400 mt-0.5">No Image</span>
                </>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
            <span className="text-white text-[7px] font-bold bg-black/50 px-1.5 py-0.5 rounded">
              {idx + 1}
            </span>
          </div>
          {item.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center">
                <PlayCircle size={16} className="text-white" fill="white" />
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* 4th position - either the 4th image or View All button */}
      {mediaItems.length === 4 ? (
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer group rounded-lg bg-gray-100 dark:bg-gray-800"
          onClick={() => openGallery(3)}
        >
          {mediaItems[3]?.type === 'image' && mediaItems[3]?.url ? (
            <img
              src={mediaItems[3].url}
              alt="Thumbnail 4"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = `
                  <div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <ImageIcon size={24} class="text-gray-400" />
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex flex-col items-center justify-center">
              {mediaItems[3]?.type === 'video' ? (
                <>
                  <PlayCircle size={24} className="text-amber-500" />
                  <span className="text-[7px] text-gray-500 dark:text-gray-400 mt-0.5">{mediaItems[3]?.title || 'Video'}</span>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-gray-400" />
                  <span className="text-[7px] text-gray-500 dark:text-gray-400 mt-0.5">No Image</span>
                </>
              )}
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center">
            <span className="text-white text-[7px] font-bold bg-black/50 px-1.5 py-0.5 rounded">
              4
            </span>
          </div>
          {mediaItems[3]?.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center">
                <PlayCircle size={16} className="text-white" fill="white" />
              </div>
            </div>
          )}
        </div>
      ) : mediaItems.length > 4 ? (
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer group rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/20 transition-all flex items-center justify-center"
          onClick={() => openGallery(0)}
        >
          <div className="text-center">
            <Grid3x3 size={28} className="text-amber-500 mx-auto mb-1" />
            <span className="text-gray-700 dark:text-gray-300 text-xs font-bold block">View All</span>
            <span className="text-amber-500 text-[8px] font-medium block mt-0.5">
              +{mediaItems.length - 3} more
            </span>
          </div>
        </div>
      ) : null}
    </div>
  </div>
</div>
        </div>
      </section>

      {/* Gallery Section (Thumbnails below for mobile) */}
      {mediaItems.length > 1 && (
        <section className="py-8 px-4 md:hidden border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 flex items-center gap-2">
              <Camera size={12} /> Gallery ({mediaItems.length})
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {mediaItems.slice(0, 6).map((item, idx) => (
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
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                      <PlayCircle size={20} className="text-amber-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                </div>
              ))}
            </div>
            {mediaItems.length > 6 && (
              <button
                onClick={() => openGallery(0)}
                className="mt-3 text-[10px] text-amber-500 hover:text-amber-600 transition flex items-center gap-1"
              >
                <Grid3x3 size={12} /> View all {mediaItems.length} media
              </button>
            )}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {blog.videos && blog.videos.length > 0 && (
        <section className="py-8 px-4 md:px-8 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-500 mb-4 flex items-center gap-2">
              <Youtube size={14} /> Video Content ({blog.videos.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blog.videos.map((video, idx) => (
                <div key={idx} className={`rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="aspect-video bg-gray-900">
                    {video.embedId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${video.embedId}`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title || `Video ${idx + 1}`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <PlayCircle size={40} className="text-amber-500 mb-2" />
                        <p className="text-white text-xs">{video.title || `Video ${idx + 1}`}</p>
                        <a 
                          href={video.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 px-3 py-1 bg-amber-500 text-black rounded-lg text-[10px] font-semibold hover:bg-amber-400 transition"
                        >
                          Watch Video
                        </a>
                      </div>
                    )}
                  </div>
                  {video.title && (
                    <div className="p-2">
                      <p className="text-xs font-medium line-clamp-1">{video.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Share Bar */}
            <div className="sticky top-24 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-gray-500 mr-2 font-medium">Share:</span>
                
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-white transition"
                  >
                    <Share2 size={14} />
                  </button>
                  
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        className="absolute left-0 top-full mt-1 p-1.5 rounded-xl shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50 min-w-[160px]"
                      >
                        <div className="space-y-0.5">
                          {['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'pinterest'].map((platform) => (
                            <button
                              key={platform}
                              onClick={() => handleShare(platform)}
                              className="w-full flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-xs transition-colors capitalize"
                            >
                              {platform === 'facebook' && <Facebook size={12} className="text-blue-600" />}
                              {platform === 'twitter' && <Twitter size={12} className="text-sky-500" />}
                              {platform === 'linkedin' && <Linkedin size={12} className="text-blue-700" />}
                              {platform === 'whatsapp' && <MessageCircle size={12} className="text-green-500" />}
                              {platform === 'telegram' && <Send size={12} className="text-blue-400" />}
                              {platform === 'pinterest' && <Share2 size={12} className="text-red-500" />}
                              {platform}
                            </button>
                          ))}
                          <div className="border-t border-gray-200 dark:border-gray-700 my-0.5"></div>
                          <button
                            onClick={() => handleShare('copy')}
                            className="w-full flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-xs transition-colors"
                          >
                            <Link2 size={12} className="text-gray-500" />
                            Copy Link
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Blog Content */}
            <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              {blog.blogsummary && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl mb-6 border-l-3 border-amber-500">
                  <Quote size={18} className="text-amber-500 mb-2" />
                  <p className="text-sm italic text-gray-700 dark:text-gray-300">
                    {blog.blogsummary}
                  </p>
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: blog.blogcontent }} className="blog-content" />
            </article>

            {/* Tags */}
            {blog.blogtags && blog.blogtags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(blog.blogtags) ? blog.blogtags : blog.blogtags.split(',')).map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[9px] font-medium">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Like Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <button
                onClick={handleLike}
                disabled={liked}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all text-sm ${
                  liked 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-white'
                }`}
              >
                <Heart size={16} fill={liked ? "white" : "none"} />
                <span className="font-semibold">{likesCount} Likes</span>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Author Card */}
            <div className={`p-4 rounded-xl  bg-white shadow-lg`}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                  {blog.blogauthor?.charAt(0).toUpperCase() || 'A'}
                </div>
                <h3 className="text-base font-bold mb-0.5">{blog.blogauthor || 'Admin'}</h3>
                <p className="text-[10px] text-gray-500 mb-2">Real Estate Expert</p>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  Expert insights on Dubai's luxury real estate market.
                </p>
              </div>
            </div>

            {/* Social Links Section */}
            {hasSocialLinks && (
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="text-xs font-bold mb-3 flex items-center gap-2">
                  <Globe size={14} className="text-amber-500" /> 
                  Connect & Share
                </h3>
                <div className="space-y-1">
                  {socialLinks.facebook && (
                    <a 
                      href={socialLinks.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-xs"
                    >
                      <Facebook size={14} className="text-blue-600" />
                      <span className="flex-1">Facebook</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                  {socialLinks.twitter && (
                    <a 
                      href={socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition text-xs"
                    >
                      <Twitter size={14} className="text-sky-500" />
                      <span className="flex-1">Twitter/X</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a 
                      href={socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-xs"
                    >
                      <Linkedin size={14} className="text-blue-700" />
                      <span className="flex-1">LinkedIn</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                  {socialLinks.instagram && (
                    <a 
                      href={socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition text-xs"
                    >
                      <Instagram size={14} className="text-pink-500" />
                      <span className="flex-1">Instagram</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                  {socialLinks.whatsapp && (
                    <a 
                      href={socialLinks.whatsapp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition text-xs"
                    >
                      <MessageCircle size={14} className="text-green-500" />
                      <span className="flex-1">WhatsApp</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                  {socialLinks.telegram && (
                    <a 
                      href={socialLinks.telegram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-xs"
                    >
                      <Send size={14} className="text-blue-400" />
                      <span className="flex-1">Telegram</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                  {socialLinks.pinterest && (
                    <a 
                      href={socialLinks.pinterest} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition text-xs"
                    >
                      <Share2 size={14} className="text-red-500" />
                      <span className="flex-1">Pinterest</span>
                      <ExternalLink size={12} className="text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Blog Stats */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className="text-xs font-bold mb-3">Article Stats</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">Views</span>
                  <span className="font-semibold">{blog.views || 0}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">Likes</span>
                  <span className="font-semibold">{blog.likes || 0}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">Reading Time</span>
                  <span className="font-semibold">{getReadingTime(blog.blogcontent)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-[10px]">{blog.blogcategory || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-semibold text-[10px] ${
                    blog.blogstatus === 'published' ? 'text-green-500' : 
                    blog.blogstatus === 'draft' ? 'text-yellow-500' : 'text-gray-500'
                  }`}>
                    {blog.blogstatus || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h3 className="text-xs font-bold mb-3">Related Articles</h3>
                <div className="space-y-3">
                  {relatedBlogs.map((related) => (
                    <div
                      key={related._id}
                      onClick={() => navigate(`/blog/${related._id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="flex gap-2.5">
                        <img 
                          src={related.image?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=100'} 
                          alt={related.blogtitle}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs group-hover:text-amber-500 transition line-clamp-2">
                            {related.blogtitle}
                          </h4>
                          <p className="text-[9px] text-gray-500 mt-0.5">{formatDate(related.blogpublishdate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter Signup */}
            <div className={`p-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white`}>
              <h3 className="text-sm font-bold mb-1">Newsletter</h3>
              <p className="text-[10px] opacity-90 mb-3">Get insights delivered to your inbox.</p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-1.5 rounded-lg text-black text-xs mb-2"
              />
              <button className="w-full py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition text-xs font-semibold">
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
                className="absolute -top-10 right-0 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <X size={20} className="text-white" />
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
                        <div className="w-full h-full flex items-center justify-center">
                          {item.embedId ? (
                            <iframe
                              src={getYouTubeEmbedUrl(item)}
                              className="w-full max-w-4xl aspect-video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={item.title || 'Video Tour'}
                            />
                          ) : (
                            <div className="text-center">
                              <PlayCircle size={64} className="text-amber-500 mx-auto mb-3" />
                              <p className="text-white text-sm">{item.title || 'Video content'}</p>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-3 py-1.5 bg-amber-500 text-black rounded-lg text-xs">
                                Watch on external player
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Video size={64} className="text-amber-500 mx-auto mb-3" />
                          <p className="text-white text-sm">Virtual Tour</p>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block px-3 py-1.5 bg-amber-500 text-black rounded-lg text-xs">
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
      <style>{`
        .blog-content {
          font-size: 0.95rem;
          line-height: 1.8;
          color: ${isDark ? '#d1d5db' : '#374151'};
        }
        .blog-content h1, .blog-content h2, .blog-content h3 {
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: ${isDark ? '#ffffff' : '#1f2937'};
        }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.25rem; }
        .blog-content p { margin-bottom: 1rem; }
        .blog-content ul, .blog-content ol { margin: 0.75rem 0 0.75rem 1.5rem; }
        .blog-content li { margin: 0.25rem 0; }
        .blog-content img { border-radius: 0.75rem; margin: 1.5rem 0; max-width: 100%; }
        .blog-content blockquote {
          border-left: 3px solid #f59e0b;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: ${isDark ? '#9ca3af' : '#6b7280'};
          font-size: 0.95rem;
        }
        .blog-content a { color: #f59e0b; text-decoration: underline; }
        .blog-content pre {
          background: ${isDark ? '#1f2937' : '#f3f4f6'};
          padding: 0.75rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-size: 0.8rem;
        }
        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .blog-content th, .blog-content td {
          border: 1px solid ${isDark ? '#374151' : '#d1d5db'};
          padding: 0.5rem;
          text-align: left;
        }
        .blog-content th {
          background: ${isDark ? '#1f2937' : '#f3f4f6'};
        }
        @media (max-width: 640px) {
          .blog-content {
            font-size: 0.875rem;
          }
          .blog-content h2 { font-size: 1.25rem; }
          .blog-content h3 { font-size: 1.1rem; }
        }
      `}</style>
    </div>
  );
};

export default BlogDetails;