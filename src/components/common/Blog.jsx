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
  ArrowRight, Calendar, Clock, Search, X, ShieldCheck, Quote 
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
    bg: isDark ? "bg-[#0a0a0c]" : "bg-white",
    card: isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200",
    textHeading: "text-[#1a1a1e]", 
    textSub: "text-slate-500",
    amber: "text-[#e67e22]" // Matching the orange/amber in your screenshot
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-500`}>
      
      {/* --- HERO SECTION: PRIVACY POLICY BRANDING --- */}
      <section className="relative w-full h-[80vh] flex items-center overflow-hidden">
        {/* Background Overlay to match the soft city view */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000" 
            alt="Dubai Infrastructure" 
            className="w-full h-full object-cover grayscale-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 items-center pt-20">
          <div className="space-y-6">
            {/* Top Badge */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-[#e67e22] text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} className="text-[#e67e22]" /> Market Insights
              </span>
            </motion.div>

            {/* Stacked Heading Style */}
            <div className="space-y-0">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                className={`text-7xl md:text-8xl font-black tracking-tighter ${colors.textHeading} leading-[0.85]`}
              >
                Journal
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-7xl md:text-8xl font-serif italic font-light text-[#e67e22] leading-[1.1]"
              >
                Insights
              </motion.h1>
            </div>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="max-w-md text-lg leading-relaxed text-slate-600 font-medium"
            >
              Homoget Properties is committed to providing expert market analysis in accordance with UAE real estate standards and RERA regulations.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
            >
              <Clock size={12} /> LAST UPDATED: JANUARY 2026
            </motion.div>

            {/* Premium Search Integration */}
            <div className="pt-8 max-w-lg">
                <div className="flex items-center bg-white border border-slate-200 rounded-full p-2 shadow-xl shadow-black/5">
                    <Search className="ml-4 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        className="w-full bg-transparent p-3 outline-none text-sm font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="bg-[#1a1a1e] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                        Search
                    </button>
                </div>
            </div>
          </div>

          {/* Language Switcher mimicking your screenshot */}
          <div className="hidden lg:flex justify-end items-start h-full pt-10">
            <div className="flex items-center bg-white/40 backdrop-blur-md rounded-xl p-1 border border-white/60">
                {['EN', 'HI', 'AR'].map((lang) => (
                    <button 
                        key={lang}
                        className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all ${lang === 'EN' ? 'bg-[#e67e22] text-white shadow-lg' : 'text-slate-400 hover:text-black'}`}
                    >
                        {lang}
                    </button>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- DETAILED BLOG GRID --- */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-[500px] rounded-[2.5rem] animate-pulse bg-slate-100`} />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredBlogs.map((blog, idx) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`group relative h-[520px] rounded-[2.5rem] overflow-hidden border ${colors.card} shadow-xl transition-all duration-500 hover:-translate-y-2`}
              >
                <div className="absolute inset-0">
                    <img src={blog.image[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="blog" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded bg-[#e67e22] text-white text-[9px] font-black uppercase tracking-widest">
                        {blog.blogcategory}
                      </span>
                      <span className="flex items-center gap-1 text-white/70 text-[9px] font-bold uppercase tracking-tighter">
                        <Clock size={10} /> 5 MIN READ
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-serif text-white leading-tight group-hover:text-orange-400 transition-colors">
                      {blog.blogtitle}
                    </h3>

                    {/* Blog snippet details */}
                    <p className="text-sm text-slate-300 line-clamp-2 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {blog.blogcontent.substring(0, 150)}...
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">
                            {blog.blogauthor}
                          </span>
                          <span className="text-[8px] font-bold text-orange-400 uppercase mt-1">
                            {new Date(blog.blogpublishdate).toLocaleDateString()}
                          </span>
                        </div>

                        <button 
                            onClick={() => setSelectedBlog(blog)} 
                            className="bg-white/10 hover:bg-[#e67e22] p-3 rounded-full border border-white/20 transition-all group/btn"
                        >
                            <ArrowRight size={18} className="text-white group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
             <img src={notfound} className="w-64 mx-auto opacity-20 grayscale mb-8" alt="notfound" />
             <h3 className="text-2xl font-serif italic text-slate-400">No Insights Found</h3>
          </div>
        )}
      </section>

      {/* --- ARTICLE MODAL (DETAILED MODEL) --- */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedBlog(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[3rem] overflow-hidden">
              <button onClick={() => setSelectedBlog(null)} className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-black/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all text-black"><X size={20} /></button>
              
              <div className="h-full overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
                  <div className="relative h-[40vh] lg:h-auto bg-slate-100">
                    <img src={selectedBlog.image[0]} className="w-full h-full object-cover" alt="cover" />
                  </div>
                  <div className="p-12 lg:p-20 flex flex-col justify-center">
                    <div className="mb-6 flex gap-4 items-center">
                        <span className="px-3 py-1 rounded bg-orange-100 text-[#e67e22] text-[10px] font-black uppercase tracking-widest">
                            {selectedBlog.blogcategory}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{new Date(selectedBlog.blogpublishdate).toDateString()}</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter text-[#1a1a1e] mb-8 leading-tight uppercase">{selectedBlog.blogtitle}</h2>
                    <div className="text-lg leading-relaxed font-light text-slate-600">
                       <Quote className="text-orange-500 mb-6 opacity-20" size={50} />
                       <p className="whitespace-pre-line">{selectedBlog.blogcontent}</p>
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