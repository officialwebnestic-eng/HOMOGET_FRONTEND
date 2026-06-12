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
        brand: "#C5A059",
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
                console.log("Properties API response:", propertiesRes.data)
                setReviews(reviewsRes.data.data || [])
                setReviewsPropertyData(propertiesRes.data.data || [])
            } catch (error) {
                console.error("Fetch error:", error)
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
        <div className={`min-h-screen ${colors.bg} py-12 px-4 sm:py-16 sm:px-6 lg:py-20 lg:px-8 transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-2 text-amber-600 mb-3">
                            <MessageSquare size={14} />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Client Voices</span>
                        </div>
                        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter ${colors.text}`}>
                            Trusted by <span className="italic font-serif font-light text-amber-600">Thousands.</span>
                        </h1>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="flex items-center justify-end gap-1 text-amber-500 mb-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                            <p className={`text-[8px] font-bold uppercase tracking-widest ${colors.sub}`}>4.9/5 Average Rating</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsFormOpen(true)}
                            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg flex items-center gap-2"
                        >
                            <Plus size={14} /> Write Review
                        </motion.button>
                    </div>
                </div>

                {/* --- REVIEWS GRID --- */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3].map(i => <div key={i} className={`h-56 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />)}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-16">
                        <img src={notfound} className="w-40 mx-auto opacity-20 grayscale" alt="No reviews" />
                        <h3 className={`mt-6 text-xl font-bold ${colors.text}`}>No Testimonials Yet</h3>
                        <p className={`text-xs ${colors.sub} mt-2 mb-6`}>Be the first to share your Homoget experience.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className={`p-5 rounded-2xl border ${colors.card} hover:border-amber-500/50 transition-all group flex flex-col h-full`}
                            >
                                <Quote className="text-amber-500/20 mb-3 group-hover:text-amber-500/40 transition-colors" size={28} />
                                
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            className={i < review.rating ? 'text-amber-500' : 'text-slate-600'}
                                            fill={i < review.rating ? 'currentColor' : 'none'}
                                        />
                                    ))}
                                </div>

                                <p className={`text-sm leading-relaxed mb-4 italic font-serif ${colors.text} line-clamp-4`}>
                                    "{review.review}"
                                </p>

                                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-800/50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold text-xs">
                                            {review.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-bold flex items-center gap-1 ${colors.text}`}>
                                                {review.name || 'Anonymous'} 
                                                {review.isVerified && <CheckCircle2 size={10} className="text-blue-500" />}
                                            </h4>
                                            <p className="text-[8px] uppercase tracking-widest text-amber-600 font-black">Verified Client</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {review.property && (
                                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/30 border border-slate-700 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <Building2 size={8} /> {review.property}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* --- MODAL FORM - Improved with smaller size --- */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                            onClick={() => setIsFormOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                                className={`w-full max-w-lg ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl border border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className={`text-xl font-bold tracking-tight ${colors.text}`}>Share Experience</h2>
                                            <p className="text-[8px] text-amber-600 font-bold uppercase tracking-widest mt-1">Homoget Quality Assurance</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsFormOpen(false)} 
                                            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                                <input 
                                                    {...register('name', { required: true })} 
                                                    className={`p-3 rounded-xl border outline-none text-sm transition-all ${isDark ? 'bg-slate-950 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-amber-500 text-black'}`} 
                                                    placeholder="Your Name" 
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 ml-1">Property</label>
                                                <select 
                                                    {...register('property', { required: true })} 
                                                    className={`p-3 rounded-xl border outline-none text-sm appearance-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 focus:border-amber-500 text-white' : 'bg-slate-50 border-slate-200 focus:border-amber-500 text-black'}`}
                                                >
                                                    <option value="">Select Property</option>
                                                    {reviewsPropertyData && reviewsPropertyData.length > 0 ? (
                                                        reviewsPropertyData.map(p => (
                                                            <option key={p._id} value={p.propertyname || p.propertyTitleEn}>
                                                                {p.propertyname || p.propertyTitleEn}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option disabled>No properties available</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 p-4 rounded-xl bg-amber-600/5 border border-amber-600/20 text-center">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-amber-600">Your Rating</label>
                                            <div className="flex justify-center gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button 
                                                        type="button" 
                                                        key={star} 
                                                        onClick={() => setValue('rating', star)} 
                                                        className="hover:scale-110 transition-transform"
                                                    >
                                                        <Star 
                                                            size={24} 
                                                            fill={star <= (watch('rating') || 0) ? '#C5A059' : 'none'} 
                                                            className={star <= (watch('rating') || 0) ? 'text-amber-500' : 'text-slate-600'} 
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <input type="hidden" {...register('rating', { required: true })} />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-slate-500 ml-1">Your Review</label>
                                            <textarea 
                                                {...register('review', { required: true, minLength: 20 })} 
                                                rows={3} 
                                                className={`p-3 rounded-xl border outline-none text-sm resize-none transition-all ${isDark ? 'bg-slate-950 border-slate-800 focus:border-amber-500' : 'bg-slate-50 border-slate-200 focus:border-amber-500'}`} 
                                                placeholder="Tell us about your experience..." 
                                            />
                                            {errors.review?.type === 'minLength' && (
                                                <p className="text-[8px] text-red-500">Minimum 20 characters required</p>
                                            )}
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={isSubmitting} 
                                            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Publish Testimonial'}
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