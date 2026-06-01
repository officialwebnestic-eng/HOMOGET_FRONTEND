import React, { useState, useEffect, useCallback } from 'react'
import { Pencil, Trash2, Layers, Globe, Barcode, Search, Calendar, User, Eye, ThumbsUp, Filter, X, ArrowUpDown, ChevronLeft, ChevronRight, Table, Grid3x3 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import useGetAllBlogs from '../../../hooks/useGetAllBlogs'
import { motion, AnimatePresence } from 'framer-motion'
import { http } from '../../../axios/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const ViewBlogList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({
    blogauthorid: "",
    blogauthor: "",
    blogtitle: "",
    blogcategory: "",
    blogstatus: "published",
    startDate: "",
    endDate: ""
  })
  
  const navigate = useNavigate()
  const limit = 10
  const { blogs, loading, error, pagination, getAllBlogs, refetch } = useGetAllBlogs(currentPage, limit, filters)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
    setCurrentPage(1)
  }

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      blogauthorid: "",
      blogauthor: "",
      blogtitle: "",
      blogcategory: "",
      blogstatus: "published",
      startDate: "",
      endDate: ""
    })
    setCurrentPage(1)
  }

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await http.delete(`/deleteblog/${id}`)
        if (response.data.success === true) {
          toast.success(response.data.message)
          refetch()
        }
      } catch (error) {
        console.error("Error deleting blog:", error)
        toast.error("Failed to delete blog")
      }
    }
  }

  const handleUpdate = (id) => {
    navigate(`/updateblog/${id}`)
  }

  const handleViewDetails = (id) => {
    navigate(`/blog/${id}`)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const categories = [
    "Luxury Living", "Investment Tips", "Market Updates", "Buyer Guides",
    "Real Estate News", "Developer Spotlight", "Off-Plan Projects", "Property Management"
  ]

  const statuses = [
    { value: "published", label: "Published", color: "green" },
    { value: "draft", label: "Draft", color: "yellow" },
    { value: "archived", label: "Archived", color: "red" }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'draft': return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
      case 'archived': return 'bg-red-500/20 text-red-600 dark:text-red-400'
      default: return 'bg-gray-500/20 text-gray-600'
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Blog Management
            </h1>
            <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage and organize your blog posts
            </p>
          </div>
          <div className="flex gap-2">
            {/* View Toggle Buttons */}
            <div className="flex rounded-lg overflow-hidden border border-amber-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-white'
                    : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Table size={14} className="inline mr-1" /> Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-amber-500 text-white'
                    : isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 size={14} className="inline mr-1" /> Grid
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 text-xs ${
                showFilters 
                  ? 'bg-amber-500 text-white' 
                  : isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Filter size={14} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={() => navigate('/createblog')}
              className="px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600"
            >
              + Create Blog
            </button>
          </div>
        </div>

        {/* Sort Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Sort by:</span>
            <div className="flex gap-1">
              {['newest', 'oldest', 'mostViews', 'mostLikes'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => handleSortChange(sort)}
                  className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all ${
                    sortBy === sort
                      ? 'bg-amber-500 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {sort === 'newest' ? 'Newest' : 
                   sort === 'oldest' ? 'Oldest' : 
                   sort === 'mostViews' ? 'Most Viewed' : 'Most Liked'}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Total Blogs: {pagination?.total || 0}
          </div>
        </div>

        {/* Filter Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-4 rounded-lg shadow-sm overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    <Search size={14} /> Advanced Filters
                  </h3>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X size={12} /> Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    name="blogtitle"
                    placeholder="Search by title..."
                    value={filters.blogtitle}
                    onChange={handleFilterChange}
                    className={`pl-3 w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border border-gray-200 placeholder-gray-500'
                    }`}
                  />
                  <input
                    type="text"
                    name="blogauthor"
                    placeholder="Author name..."
                    value={filters.blogauthor}
                    onChange={handleFilterChange}
                    className={`pl-3 w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'border border-gray-200 placeholder-gray-500'
                    }`}
                  />
                  <select
                    name="blogcategory"
                    value={filters.blogcategory}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border border-gray-200'
                    }`}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    name="blogstatus"
                    value={filters.blogstatus}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border border-gray-200'
                    }`}
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border border-gray-200'
                    }`}
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className={`w-full px-3 py-1.5 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-xs ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className={`rounded-lg overflow-hidden shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="p-4">
                  <Skeleton count={1} className="h-8 mb-2" />
                  <Skeleton count={2} className="h-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`p-8 rounded-lg text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-base font-medium ${isDark ? 'text-red-400' : 'text-red-500'}`}>
              Failed to load blogs
            </div>
            <button
              onClick={refetch}
              className={`mt-3 px-4 py-1.5 rounded-md text-xs ${isDark ? 'bg-gray-700 text-amber-400' : 'bg-amber-100 text-amber-600'}`}
            >
              Retry
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className={`p-12 rounded-lg text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-base font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              No blogs found
            </div>
            <p className="text-xs text-gray-500">Try adjusting your search filters or create a new blog</p>
            <button
              onClick={() => navigate('/createblog')}
              className="mt-3 px-4 py-1.5 bg-amber-500 text-white rounded-lg text-xs hover:bg-amber-600 transition"
            >
              Create New Blog
            </button>
          </div>
        ) : viewMode === 'table' ? (
          // Table View
          <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-left font-semibold">Author</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Views/Likes</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, idx) => (
                    <tr 
                      key={blog._id}
                      onClick={() => handleViewDetails(blog._id)}
                      className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'} cursor-pointer transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <img 
                          src={blog.image?.[0] || "https://placehold.co/40x40"}
                          alt={blog.blogtitle}
                          className="w-10 h-10 rounded object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                        {blog.blogtitle}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-medium">
                          {blog.blogcategory || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <User size={10} className="text-gray-400" />
                          <span>{blog.blogauthor || 'Admin'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(blog.blogpublishdate)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${getStatusColor(blog.blogstatus)}`}>
                          {blog.blogstatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={10} className="text-gray-400" /> {blog.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={10} className="text-gray-400" /> {blog.likes || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdate(blog._id); }}
                            className="p-1.5 rounded hover:bg-amber-500/10 text-amber-500 transition"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog._id); }}
                            className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                className={`group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => handleViewDetails(blog._id)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={blog.image?.[0] || "https://placehold.co/400x200"}
                    alt={blog.blogtitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${getStatusColor(blog.blogstatus)}`}>
                      {blog.blogstatus}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                    {blog.blogcategory || 'Uncategorized'}
                  </span>
                  <h3 className="text-sm font-semibold mt-2 mb-1 line-clamp-2 group-hover:text-amber-500 transition">
                    {blog.blogtitle}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1"><User size={10} /> {blog.blogauthor}</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(blog.blogpublishdate)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px]"><Eye size={10} /> {blog.views || 0}</span>
                      <span className="flex items-center gap-1 text-[10px]"><ThumbsUp size={10} /> {blog.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); handleUpdate(blog._id); }} className="p-1 rounded hover:bg-amber-500/10">
                        <Pencil size={12} className="text-amber-500" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog._id); }} className="p-1 rounded hover:bg-red-500/10">
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-1 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded transition-all disabled:opacity-50 text-xs ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex gap-1">
              {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i
                else pageNum = currentPage - 2 + i
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-amber-500 text-white'
                        : isDark
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`p-1.5 rounded transition-all disabled:opacity-50 text-xs ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewBlogList