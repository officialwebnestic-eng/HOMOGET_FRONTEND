import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Layers, Globe, Barcode, Search, Calendar, User } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import useGetAllBlogs from '../../../hooks/useGetAllBlogs'
import { motion } from 'framer-motion'
import { http } from '../../../axios/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ViewBlogList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    blogauthorid: "",
    blogauthor: "",
    blogtitle: "",
    blogpublishdate: "",
  })
  const navigate = useNavigate()
  const limit = 6
  const { blogs, loading, error, pagination, getAllBlogs } = useGetAllBlogs(currentPage, limit, filters)
  const { theme } = useTheme()

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
    setCurrentPage(1)
  }

  const handleDeleteBlog = async (id) => {
    try {
      const response = await http.delete(`/deleteblog/${id}`)
      if (response.data.success === true) {
        toast.success(response.data.message)
        getAllBlogs()
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Failed to delete blog")
    }
  }

  const handleUpdate = (id) => {
    navigate(`/updateblog/${id}`)
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        getAllBlogs()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className={`text-3xl font-bold transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Blog Management
            </h2>
            <p className={`mt-1 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and organize your blog posts
            </p>
          </div>
          <button
            onClick={() => navigate('/createblog')}
            className={`mt-4 md:mt-0 px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-700 to-purple-700 text-white hover:from-indigo-600 hover:to-purple-600'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'}`}
          >
            + Create New Blog
          </button>
        </div>


        {/* Filter Section */}
        <div className={`p-6 rounded-xl shadow-sm mb-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <Search size={18} /> Search Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "blogauthorid", placeholder: "Author ID", icon: <Barcode size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} /> },
              { name: "blogauthor", placeholder: "Author Name", icon: <User size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} /> },
              { name: "blogtitle", placeholder: "Blog Title", icon: <Search size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} /> },
              { name: "blogpublishdate", placeholder: "Publish Date", icon: <Calendar size={16} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} /> },
            ].map(({ name, placeholder, icon }) => (
              <div key={name} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {icon}
                </div>
                <input
                  type="text"
                  name={name}
                  placeholder={placeholder}
                  value={filters[name]}
                  onChange={handleFilterChange}
                  className={`pl-10 w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300 ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'border border-gray-200 placeholder-gray-500'}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Blog List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className={`rounded-xl shadow-sm overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5">
                    <Skeleton height={256} className="w-full" />
                  </div>
                  <div className="md:w-3/5 p-6">
                    <Skeleton count={3} />
                    <div className="flex mt-4">
                      <Skeleton width={100} height={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`p-8 rounded-xl shadow-sm text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-lg font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
              Failed to load blogs
            </div>
            <p className={`mt-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Please try again later
            </p>
            <button
              onClick={getAllBlogs}
              className={`mt-4 px-4 py-2 rounded-md transition-colors duration-300 ${theme === 'dark'
                ? 'bg-gray-700 text-indigo-400 hover:bg-gray-600'
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}
            >
              Retry
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className={`p-8 rounded-xl shadow-sm text-center transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              No blogs found
            </div>
            <p className={`mt-2 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  className={`rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      <Swiper
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop={true}
                        modules={[Autoplay, Pagination]}
                        className="h-64 md:h-full"
                      >
                        {blog.image?.length ? (
                          blog.image.map((img, idx) => (
                            <SwiperSlide key={idx}>
                              <img
                                src={img}
                                alt={`Image ${idx}`}
                                className="w-full md:h-80 h-50 object-cover"
                              />
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <div className={`flex items-center justify-center h-full transition-colors duration-300 ${theme === 'dark'
                              ? 'bg-gradient-to-br from-gray-800 to-gray-700 text-gray-500'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400'}`}>
                              No Image Available
                            </div>
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </div>

                    <div className="md:w-3/5 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {blog.blogtitle}
                          </h3>
                          <div className={`flex items-center text-sm mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center mr-4">
                              <User size={14} className="mr-1" /> {blog.blogauthor}
                            </span>
                            <span className="flex items-center">
                              <Calendar size={14} className="mr-1" /> {blog.blogpublishdate || "N/A"}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.status === 'published'
                          ? theme === 'dark'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-green-100 text-green-800'
                          : theme === 'dark'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {blog.status}
                        </span>
                      </div>

                      <p className={`mb-4 line-clamp-3 transition-colors duration-300 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {blog.blogcontent || "No content available."}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${theme === 'dark'
                          ? 'bg-indigo-900 text-indigo-300'
                          : 'bg-indigo-50 text-indigo-600'}`}>
                          {blog.blogcategory || "Uncategorized"}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${theme === 'dark'
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-100 text-gray-600'}`}>
                          ID: {blog.blogauthorid}
                        </span>
                      </div>

                      <div className={`flex justify-end space-x-3 pt-2 border-t transition-colors duration-300 ${theme === 'dark'
                        ? 'border-gray-700'
                        : 'border-gray-100'}`}>
                        <button
                          onClick={() => handleUpdate(blog._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-indigo-400 hover:bg-gray-600'
                            : 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50'}`}
                          title="Edit"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-300 ${theme === 'dark'
                            ? 'bg-red-700 text-white hover:bg-red-600'
                            : 'bg-red-600 text-white hover:bg-red-700'}`}
                          title="Delete"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 rounded-l-md text-sm font-medium transition-colors duration-300 ${currentPage === 1
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-gray-100 text-gray-400'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-300 ${currentPage === i + 1
                        ? theme === 'dark'
                          ? 'z-10 bg-indigo-700 text-white'
                          : 'z-10 bg-indigo-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                    disabled={currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-4 py-2 rounded-r-md text-sm font-medium transition-colors duration-300 ${currentPage === pagination.totalPages
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-gray-100 text-gray-400'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ViewBlogList