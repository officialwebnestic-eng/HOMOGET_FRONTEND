import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext'; 
import { http } from '../../axios/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { 
  ArrowRight, Calendar, User, Clock, 
  Search, BookOpen, Share2, Bookmark, 
  X, ChevronRight, Hash, Quote 
} from 'lucide-react';
import { notfound } from '../../ExportImages';

const Blog = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [blogData, setBlogData] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    const getblogs = async () => {
      try {
        setIsLoading(true);
        const response = await http.get("/getdatablogs", { withCredentials: true });
        if (response.data.success) {
          setBlogData(response.data.data);
          setFilteredBlogs(response.data.data);
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }; 
    getblogs();
  }, []);

  useEffect(() => {
    const filtered = blogData.filter(blog =>
      blog.blogtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blogtags.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogData]);

  const colors = {
    brand: "#C5A059",
    bg: isDark ? "bg-slate-950" : "bg-slate-50",
    card: isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200",
    text: isDark ? "text-slate-100" : "text-slate-900",
    sub: isDark ? "text-slate-400" : "text-slate-500"
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-500`}>
      
      {/* --- MAGAZINE HERO --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <span className="text-amber-600 font-black uppercase tracking-[0.4em] text-xs">
              The Homoget Journal
            </span>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter ${colors.text}`}>
              Market <span className="italic font-serif font-light text-amber-600">Intelligence.</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-lg ${colors.sub}`}>
              Expert perspectives on Dubai's luxury real estate, market trends, and investment strategies.
            </p>

            {/* Premium Search Box */}
            <div className="max-w-xl mx-auto mt-12 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className={`relative flex items-center ${colors.card} border rounded-2xl p-2 backdrop-blur-xl`}>
                <Search className="ml-4 text-slate-500" size={20} />
                <input 
                  type="text"
                  placeholder="Search market insights..."
                  className="w-full bg-transparent p-4 outline-none text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- BLOG GRID --- */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className={`h-[500px] rounded-[2.5rem] animate-pulse ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`group flex flex-col ${colors.card} border rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500`}
              >
                {/* Image Wrap */}
                <div className="h-64 relative overflow-hidden">
                  <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 3000 + (idx * 500) }}
                    className="h-full"
                  >
                    {blog.image?.map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="blog" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute top-6 left-6 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-black text-[10px] font-black uppercase tracking-widest">
                      {blog.blogcategory}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(blog.blogpublishdate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> 5 Min Read</span>
                  </div>
                  
                  <h3 className={`text-xl font-bold leading-snug mb-4 group-hover:text-amber-600 transition-colors ${colors.text}`}>
                    {blog.blogtitle}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed line-clamp-3 mb-8 ${colors.sub}`}>
                    {blog.blogcontent}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                        {blog.blogauthor[0]}
                      </div>
                      <span className={`text-xs font-bold ${colors.text}`}>{blog.blogauthor}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedBlog(blog)}
                      className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:border-amber-600 transition-all"
                    >
                      <ArrowRight size={16} className="group-hover:text-white" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <img src={notfound} className="w-64 mx-auto opacity-20 grayscale" alt="notfound" />
            <h3 className={`mt-8 text-2xl font-bold ${colors.text}`}>No Insights Found</h3>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-amber-600 font-bold uppercase tracking-widest text-xs underline">Clear Filters</button>
          </div>
        )}
      </section>

      {/* --- ARTICLE MODAL --- */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setSelectedBlog(null)} />
            
            <motion.div 
              initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
              className={`relative w-full max-w-5xl h-full ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-[3rem] overflow-hidden shadow-2xl border ${colors.border}`}
            >
              {/* Close */}
              <button onClick={() => setSelectedBlog(null)} className="absolute top-8 right-8 z-30 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-amber-600 transition-colors">
                <X />
              </button>

              <div className="h-full overflow-y-auto custom-scrollbar">
                {/* Modal Cover */}
                <div className="h-[50vh] relative">
                  <img src={selectedBlog.image[0]} className="w-full h-full object-cover" alt="cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute bottom-12 left-12 right-12">
                    <span className="px-4 py-1.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                      {selectedBlog.blogcategory}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter max-w-3xl">
                      {selectedBlog.blogtitle}
                    </h2>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-12 md:p-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8">
                      <div className="flex items-center gap-6 mb-12 py-6 border-y border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-600" />
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase">Author</p>
                            <p className={`font-bold ${colors.text}`}>{selectedBlog.blogauthor}</p>
                          </div>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-800" />
                        <div>
                          <p className="text-[10px] font-black text-slate-500 uppercase">Published</p>
                          <p className={`font-bold ${colors.text}`}>{new Date(selectedBlog.blogpublishdate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className={`prose prose-invert max-w-none ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        <Quote className="text-amber-600 mb-6" size={40} />
                        <p className="text-xl leading-relaxed font-medium italic mb-10 text-amber-500/80">
                          {selectedBlog.blogsummary}
                        </p>
                        <p className="text-lg leading-relaxed whitespace-pre-line">
                          {selectedBlog.blogcontent}
                        </p>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                      <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} border ${colors.border}`}>
                        <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${colors.text}`}>Share Insight</h4>
                        <div className="flex gap-4">
                          {[Share2, Bookmark].map((Icon, i) => (
                            <button key={i} className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-amber-600 transition-all">
                              <Icon size={20} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-sm font-black uppercase tracking-widest mb-6 ${colors.text}`}>Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBlog.blogtags.split(',').map((tag, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-400 border border-slate-700 uppercase">
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;