import { useEffect, useState } from 'react'
import { Star, Plus, X, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { http } from '../../../axios/axios'
import { useToast } from '../../../model/SuccessToasNotification'
import { useTheme } from '../../../context/ThemeContext' 
import { AnimatePresence,motion } from 'framer-motion'
import { notfound } from '../../../ExportImages'

export default function UserTestimonial() {
    const [reviews, setReviews] = useState([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [reviewsPropertyData, setReviewsPropertyData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { addToast } = useToast()
    const { theme } = useTheme()


    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm()

   
    const themeClasses = {
        dark: {
            bg: "bg-gray-900",
            card: "bg-gray-800 border-gray-700",
            text: "text-gray-100",
            textSecondary: "text-gray-400",
            input: "bg-gray-700 border-gray-600 text-white placeholder-gray-400",
            button: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
            modal: "bg-gray-800 border-gray-700",
            divider: "border-gray-700"
        },
        light: {
            bg: "bg-gradient-to-br from-gray-50 to-blue-50",
            card: "bg-white border-gray-200",
            text: "text-gray-900",
            textSecondary: "text-gray-600",
            input: "bg-white border-gray-200 text-gray-800 placeholder-gray-500",
            button: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600",
            modal: "bg-white border-gray-200",
            divider: "border-gray-200"
        }
    }

    const currentTheme = themeClasses[theme] || themeClasses.light

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
                console.error('Error fetching data:', error)
                addToast("Failed to load reviews", "error")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const onSubmit = async (data) => {
        try {
            const res = await http.post(
                '/createreviews',
                {
                    ...data,
                    rating: Number(data.rating)
                },
                { withCredentials: true }
            )

            if (res.data.success) {
                addToast("Review submitted successfully!", "success")
                setReviews((prev) => [res.data.review, ...prev])
                setIsFormOpen(false)
                reset()
            }
        } catch (error) {
            console.error('Error submitting review:', error)
            addToast("Failed to submit review", "error")
        }
    }

    const getInitials = (name) =>
        name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()

    return (
        <div className={`min-h-screen ${currentTheme.bg} py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row  mt-10  items-start md:items-center justify-between mb-12 gap-4">
                    <div className=''>
                        <h1 className={`text-3xl sm:text-4xl font-bold mt-7 ${currentTheme.text} mb-2`}>Customer Testimonials</h1>
                        <p className={`text-lg ${currentTheme.textSecondary}`}>What our customers say about us</p>
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className={`flex items-center px-6 py-3 ${currentTheme.button} text-white rounded-lg transition-all shadow-lg hover:shadow-xl min-w-fit`}
                    >
                        <Plus className="mr-2" size={20} /> Add Your Review
                    </button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && reviews.length === 0 && (
                    <div className={`text-center py-12 rounded-xl ${currentTheme.card} border ${currentTheme.divider}`}>
                        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                            <img  src={notfound} className="text-gray-400 w-80 dark:text-gray-500" />
                        </div>
                        <h3 className={`text-xl font-medium ${currentTheme.text} mb-2`}>No reviews yet</h3>
                        <p className={`${currentTheme.textSecondary} mb-6`}>Be the first to share your experience!</p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className={`px-6 py-3 ${currentTheme.button} text-white rounded-lg transition-all shadow-lg hover:shadow-xl`}
                        >
                            <Plus className="inline mr-2" size={20} /> Add Your Review
                        </button>
                    </div>
                )}

                {/* Reviews Grid */}
                {!isLoading && reviews.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div 
                                key={review._id} 
                                className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border ${currentTheme.card} ${currentTheme.divider}`}
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full font-semibold text-lg">
                                        {getInitials(review.name)}
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-semibold ${currentTheme.text}`}>{review.name}</h3>
                                        <p className="text-indigo-500 dark:text-indigo-400 text-sm font-medium">Property: {review.property}</p>
                                    </div>
                                </div>
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
                                            fill={i < review.rating ? 'currentColor' : 'none'}
                                            strokeWidth={i < review.rating ? 0 : 1.5}
                                        />
                                    ))}
                                    <span className={`ml-2 ${currentTheme.textSecondary} text-sm`}>{review.rating}/5</span>
                                </div>
                                <p className={`${currentTheme.textSecondary} leading-relaxed`}>{review.review}</p>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                        Posted on {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Review Form Modal */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className={`rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden border ${currentTheme.modal} ${currentTheme.divider}`}
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                            >
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Share Your Experience</h2>
                                        <button
                                            onClick={() => {
                                                setIsFormOpen(false)
                                                reset()
                                            }}
                                            className={`${currentTheme.textSecondary} hover:text-gray-600 dark:hover:text-gray-300 transition`}
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${currentTheme.textSecondary}`}>Your Name</label>
                                            <input
                                                {...register('name', { required: 'Name is required' })}
                                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${currentTheme.input}`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${currentTheme.textSecondary}`}>Property</label>
                                            <select
                                                {...register('property', { required: 'Property is required' })}
                                                className={`w-full border rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${currentTheme.input}`}
                                            >
                                                <option value="">Select a property</option>
                                                {reviewsPropertyData.map((property) => (
                                                    
                                                    <option key={property._id} value={property.propertyname} className='text-black'>
                                                        {property.propertyname}
                                                        
                                                    </option>
                                                ))}
                                                
                                            </select>
                                            {errors.property && <p className="text-red-500 text-sm mt-1">{errors.property.message}</p>}
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${currentTheme.textSecondary}`}>Your Rating</label>
                                            <div className="flex space-x-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        type="button"
                                                        key={star}
                                                        onClick={() => setValue('rating', star)}
                                                        className="focus:outline-none transform hover:scale-110 transition"
                                                    >
                                                        <Star
                                                            size={28}
                                                            fill={star <= (watch('rating') || 0) ? 'currentColor' : 'none'}
                                                            strokeWidth={star <= (watch('rating') || 0) ? 0 : 1.5}
                                                            className={`${star <= (watch('rating') || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} transition`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <input type="hidden" {...register('rating', { required: 'Rating is required' })} />
                                            {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>}
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${currentTheme.textSecondary}`}>Your Review</label>
                                            <textarea
                                                {...register('review', { 
                                                    required: 'Review cannot be empty',
                                                    minLength: {
                                                        value: 20,
                                                        message: 'Review should be at least 20 characters'
                                                    }
                                                })}
                                                rows={4}
                                                className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${currentTheme.input}`}
                                                placeholder="Share your experience with this property..."
                                            />
                                            {errors.review && <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>}
                                        </div>

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsFormOpen(false)
                                                    reset()
                                                }}
                                                className={`px-5 py-2.5 border rounded-lg ${currentTheme.text} ${currentTheme.divider} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`px-5 py-2.5 ${currentTheme.button} text-white rounded-lg transition shadow-md flex items-center justify-center min-w-[120px]`}
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="animate-spin h-5 w-5" />
                                                ) : (
                                                    'Submit Review'
                                                )}
                                            </button>
                                        </div>
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