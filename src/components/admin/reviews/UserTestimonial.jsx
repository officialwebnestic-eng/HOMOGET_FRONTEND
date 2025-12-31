import { useEffect, useState } from 'react'
import { Star, Plus, X, Loader2, Quote, MessageSquare, Building2, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { http } from '../../../axios/axios'
import { useToast } from '../../../model/SuccessToasNotification'
import { useTheme } from '../../../context/ThemeContext' 
import { AnimatePresence, motion } from 'framer-motion'
import { notfound } from '../../../ExportImages'

export default function UserTestimonial() {
    const [reviews, setReviews] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [reviewsPropertyData, setReviewsPropertyData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { addToast } = useToast()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm()

    const colors = {
        brand: "#C5A059", // Dubai Gold
        bg: isDark ? "bg-slate-950" : "bg-slate-50",
        card: isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200",
        text: isDark ? "text-slate-100" : "text-slate-900",
        sub: isDark ? "text-slate-400" : "text-slate-500",
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const [reviewsRes, propertiesRes] = await Promise.all([
                    http.get('/getreviews'),
                    http.get('/getproperty'),
                ])
                setReviews(reviewsRes.data.data || [])
                setReviewsPropertyData(propertiesRes.data.data || [])
            } catch (error) {
                addToast("Failed to load reviews", "error")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (data) => {
        try {
            const res = await http.post('/createreviews', { ...data, rating: Number(data.rating) }, { withCredentials: true })
            if (res.data.success) {
                addToast("Your review has been published", "success")
                setReviews((prev) => [res.data.review, ...prev])
                setIsFormOpen(false)
                reset()
            }
        } catch (error) {
            addToast("Submission failed", "error")
        }
    }

    return (
        <div className={`min-h-screen ${colors.bg} py-20 px-6 transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-2 text-amber-600 mb-4">
                            <MessageSquare size={18} />
                            <span className="text-xs font-black uppercase tracking-[0.3em]">Client Voices</span>
                        </div>
                        <h1 className={`text-5xl md:text-6xl font-black tracking-tighter ${colors.text}`}>
                            Trusted by <span className="italic font-serif font-light text-amber-600">Thousands.</span>
                        </h1>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center justify-end gap-1 text-amber-500 mb-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <p className={`text-xs font-bold uppercase tracking-widest ${colors.sub}`}>Average 4.9/5 Rating</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsFormOpen(true)}
                            className="px-8 py-4 bg-amber-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-900/20 flex items-center gap-2"
                        >
                            <Plus size={16} /> Write a Review
                        </motion.button>
                    </div>
                </div>

                {/* --- REVIEWS GRID --- */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className={`h-64 rounded-3xl animate-pulse ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`} />)}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20">
                        <img src={notfound} className="w-64 mx-auto opacity-20 grayscale" alt="No reviews" />
                        <h3 className={`mt-8 text-2xl font-bold ${colors.text}`}>No Testimonials Yet</h3>
                        <p className={`${colors.sub} mb-8`}>Be the first to share your Homoget experience.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`break-inside-avoid p-8 rounded-[2rem] border backdrop-blur-md ${colors.card} hover:border-amber-500/50 transition-all group`}
                            >
                                <Quote className="text-amber-500/20 mb-4 group-hover:text-amber-500/40 transition-colors" size={40} />
                                
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < review.rating ? 'text-amber-500' : 'text-slate-700'}
                                            fill={i < review.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>

                                <p className={`text-lg leading-relaxed mb-8 italic font-serif ${colors.text}`}>
                                    "{review.review}"
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-black text-sm">
                                            {review.name[0]}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold flex items-center gap-1 ${colors.text}`}>
                                                {review.name} <CheckCircle2 size={12} className="text-blue-500" />
                                            </h4>
                                            <p className="text-[10px] uppercase tracking-widest text-amber-600 font-black">Verified Client</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/50 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <Building2 size={10} /> {review.property}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* --- MODAL FORM --- */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className={`w-full max-w-xl ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden`}
                            >
                                <div className="p-10 md:p-12">
                                    <div className="flex justify-between items-center mb-10">
                                        <div>
                                            <h2 className={`text-3xl font-black tracking-tight ${colors.text}`}>Share Experience</h2>
                                            <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mt-1">Homoget Quality Assurance</p>
                                        </div>
                                        <button onClick={() => setIsFormOpen(false)} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                                <input {...register('name', { required: true })} className={`p-4 rounded-2xl border outline-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'}`} placeholder="Your Name" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Property</label>
                                                <select {...register('property', { required: true })} className={`p-4 rounded-2xl border outline-none appearance-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-amber-500 text-black'}`}>
                                                    <option value="">Select Portfolio</option>
                                                    {reviewsPropertyData.map(p => <option key={p._id} value={p.propertyname}>{p.propertyname}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-amber-600/5 border border-amber-600/20 text-center">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-amber-600">Your Overall Rating</label>
                                            <div className="flex justify-center gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button type="button" key={star} onClick={() => setValue('rating', star)} className="hover:scale-125 transition-transform">
                                                        <Star size={32} fill={star <= (watch('rating') || 0) ? '#C5A059' : 'none'} className={star <= (watch('rating') || 0) ? 'text-amber-500' : 'text-slate-700'} />
                                                    </button>
                                                ))}
                                            </div>
                                            <input type="hidden" {...register('rating', { required: true })} />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Narrative</label>
                                            <textarea {...register('review', { required: true, minLength: 20 })} rows={4} className={`p-4 rounded-2xl border outline-none resize-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'}`} placeholder="Tell us about the service and the property..." />
                                        </div>

                                        <button disabled={isSubmitting} className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all disabled:opacity-50">
                                            {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Publish Testimonial'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}