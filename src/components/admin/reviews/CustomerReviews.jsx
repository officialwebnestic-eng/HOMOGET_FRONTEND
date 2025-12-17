import React, { useState, useEffect } from 'react'
import { Star, Trash2, X, Search, Filter } from 'lucide-react'
import { http } from '../../../axios/axios'
import { notfound } from '../../../ExportImages'
import { useTheme } from '../../../context/ThemeContext'

const CustomerReviews = () => {
  const { theme } = useTheme()
  const [nameFilter, setNameFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [reviews, setReviews] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Theme classes
  const themeClasses = {
    light: {
      bg: 'bg-gradient-to-br from-gray-50 to-blue-50',
      text: 'text-gray-800',
      secondaryText: 'text-gray-600',
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-200',
      modalBg: 'bg-white',
      modalText: 'text-gray-800',
      placeholder: 'placeholder-gray-400',
      hover: 'hover:bg-gray-50',
      deleteButton: 'text-gray-400 hover:text-red-500',
      notFoundBg: 'bg-gray-100',
      notFoundText: 'text-gray-700',
      divider: 'border-gray-100',
      accent: 'text-blue-600',
      ratingEmpty: 'text-gray-300',
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-300',
      cardBg: 'bg-gray-700',
      cardBorder: 'border-gray-600',
      inputBg: 'bg-gray-600',
      inputBorder: 'border-gray-500',
      modalBg: 'bg-gray-700',
      modalText: 'text-gray-100',
      placeholder: 'placeholder-gray-400',
      hover: 'hover:bg-gray-600',
      deleteButton: 'text-gray-400 hover:text-red-400',
      notFoundBg: 'bg-gray-600',
      notFoundText: 'text-gray-200',
      divider: 'border-gray-600',
      accent: 'text-blue-400',
      ratingEmpty: 'text-gray-500',
    }
  }

  const currentTheme = themeClasses[theme] || themeClasses.light

  const filteredReviews = reviews.filter((review) => {
    const nameMatch = nameFilter === '' || 
      review.name.toLowerCase().includes(nameFilter.toLowerCase())
    const ratingMatch = ratingFilter === '' || 
      review.rating === Number(ratingFilter)
    return nameMatch && ratingMatch
  })

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId)
    setIsModalOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await http.delete(`/deletereview/${reviewToDelete}`, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setReviews(reviews.filter(review => review._id !== reviewToDelete))
        toast.success('Review deleted successfully')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast.error('Failed to delete review')
    } finally {
      setIsModalOpen(false)
      setReviewToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsModalOpen(false)
    setReviewToDelete(null)
  }

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await http.get("/getreviews", {
        withCredentials: true
      })
      
      if (response.data.success === true) {
        setReviews(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${currentTheme.bg}`}>
      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl ${currentTheme.modalBg} ${currentTheme.cardBorder} border`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${currentTheme.modalText}`}>Delete Review</h3>
              <button 
                onClick={cancelDelete}
                className={`${currentTheme.secondaryText} hover:text-gray-400 transition`}
              >
                <X size={20} />
              </button>
            </div>
            <p className={`${currentTheme.secondaryText} mb-6`}>Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className={`px-4 py-2 border rounded-lg transition-colors ${currentTheme.inputBorder} border ${currentTheme.secondaryText} ${currentTheme.hover}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center`}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <h2 className={`text-4xl font-bold text-center mb-12 ${currentTheme.text}`}>
          Customer <span className={currentTheme.accent}>Reviews</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div className="relative w-full md:w-72">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.secondaryText}`} size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              className={`border rounded-xl pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${currentTheme.inputBg} ${currentTheme.inputBorder} border ${currentTheme.text} ${currentTheme.placeholder}`}
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${currentTheme.secondaryText}`} size={18} />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className={`border rounded-xl pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm appearance-none ${currentTheme.inputBg} ${currentTheme.inputBorder} border ${currentTheme.text}`}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className={`text-center py-12 rounded-xl shadow-sm border ${currentTheme.cardBg} ${currentTheme.cardBorder} border`}>
            <div className={`mx-auto w-50 h-50 rounded-full flex items-center justify-center mb-6 ${currentTheme.notFoundBg}`}>
              <img src={notfound} alt="No reviews found" className="p-4" />
            </div>
            <h3 className={`text-xl font-medium mb-2 ${currentTheme.notFoundText}`}>No reviews found</h3>
            <p className={`max-w-md mx-auto ${currentTheme.secondaryText}`}>
              {nameFilter || ratingFilter 
                ? "No reviews match your filter criteria. Try adjusting your search."
                : "There are no reviews available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review._id}
                className={`rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${currentTheme.cardBg} ${currentTheme.cardBorder} border`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full font-semibold text-lg mr-4">
                      {getInitials(review.name)}
                    </div>
                    <div>
                      <h4 className={`text-lg font-semibold ${currentTheme.text}`}>{review.name}</h4>
                      {review.property && (
                        <p className={`text-indigo-500 text-sm font-medium mb-1`}>
                          {review.property}
                        </p>
                      )}
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            fill={i < review.rating ? "currentColor" : "none"}
                            strokeWidth={i < review.rating ? 0 : 1.5}
                            className={`${i < review.rating ? 'text-yellow-500' : currentTheme.ratingEmpty} mr-0.5`}
                          />
                        ))}
                        <span className={`ml-2 text-sm ${currentTheme.secondaryText}`}>{review.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(review._id)}
                    className={`p-1 transition-colors ${currentTheme.deleteButton}`}
                    aria-label="Delete review"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className={`leading-relaxed mb-4 ${currentTheme.secondaryText}`}>{review.review}</p>
                <div className={`text-xs border-t pt-3 ${currentTheme.divider} ${currentTheme.secondaryText}`}>
                  Posted on {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerReviews