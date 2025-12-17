import React, { useEffect, useState } from 'react'
import { Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import useDebounce from '../../../hooks/useDebounce'
import { http } from '../../../axios/axios'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTheme } from '../../../context/ThemeContext'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const TourList = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tourDataList, setTourDataList] = useState([])
  const { id } = useParams()
  const { theme } = useTheme()

  const [filters, setFilters] = useState({
    fullname: '',
    email: '',
    propertyname: '',
    propertylocation: '',
    phoneno: '',
    date: ''
  })

  const limit = 10
  const debouncedFilters = useDebounce(filters, 400)

  const fetchTourBookings = async () => {
    setLoading(true)
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => v !== '')
      )

      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...cleanedFilters
      })

      const response = await http.get(`/getalltourbooking?${query}`)
      setTourDataList(response.data.data || [])
      setPagination(response.data.pagination || {})
      setError(null)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('No bookings found matching your criteria')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTourBookings()
  }, [currentPage, limit, debouncedFilters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
    setCurrentPage(1)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return

    try {
      const response = await http.delete(`/deletetourbooking/${id}`)
      if (response.data.success) {
        toast.success('Booking deleted successfully', {
          position: 'top-right',
          autoClose: 3000,
          theme: theme === 'dark' ? 'dark' : 'light'
        })

        const updatedList = tourDataList.filter((item) => item._id !== id)
        setTourDataList(updatedList)

        if (updatedList.length === 0 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1)
        } else {
          fetchTourBookings()
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete booking', {
        position: 'top-right',
        autoClose: 3000,
        theme: theme === 'dark' ? 'dark' : 'light'
      })
    }
  }

  return (
    <div className={`p-4 md:p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`rounded-xl shadow-sm overflow-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between mb-4 items-start md:items-center gap-4 p-4 rounded-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-800 to-cyan-800' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
          <div>
            <h2 className={`text-xl md:text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
              Tour Management
            </h2>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-100'}`}>
              {tourDataList.length || '0'} Tour in total
            </p>
          </div>
          <div className="relative mt-3 md:mt-0 w-full md:w-64">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              name="fullname"
              placeholder="Search bookings..."
              value={filters.fullname}
              onChange={handleFilterChange}
              className={`pl-10 pr-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 placeholder-gray-500'}`}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {['email', 'phoneno', 'propertyname', 'propertylocation'].map((name) => (
            <div key={name} className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                name={name}
                placeholder={`Filter by ${name.replace(/([a-z])([A-Z])/g, '$1 $2')}`}
                value={filters[name]}
                onChange={handleFilterChange}
                className={`pl-10 pr-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border border-gray-300 placeholder-gray-500'}`}
              />
            </div>
          ))}
          <div className="relative">
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className={`px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300'}`}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-4">
            <Skeleton height={50} count={5} className="mb-2" />
          </div>
        ) : error ? (
          <div className={`p-4 border-l-4 ${theme === 'dark' ? 'bg-gray-700 border-red-500' : 'bg-red-50 border-red-500'}`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-red-700'}`}>{error}</p>
              </div>
            </div>
          </div>
        ) : tourDataList.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className={`mx-auto h-12 w-12 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className={`mt-2 text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>No bookings found</h3>
            <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    {['Client', 'Email', 'Phone', 'Property', 'Location', 'Date', 'Time', 'Message', 'Actions'].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  {tourDataList.map((user) => (
                    <tr key={user._id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        {user.fullname}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.email}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.phoneno}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.propertyname}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.propertylocation}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(user.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {user.time}
                      </td>
                      <td className={`px-6 py-4 text-sm max-w-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.message || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(user._id)}
                          className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className={`flex items-center justify-between p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * limit, pagination?.totalCount || 0)}
                </span>{' '}
                of <span className="font-medium">{pagination?.totalCount || 0}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md flex items-center ${currentPage === 1 
                    ? theme === 'dark' 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, pagination?.totalPages || 1) }).map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 :
                    currentPage >= (pagination?.totalPages || 1) - 2 ?
                      (pagination?.totalPages || 1) - 4 + i :
                      currentPage - 2 + i
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-md ${currentPage === pageNum 
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      pagination?.totalPages ? Math.min(prev + 1, pagination.totalPages) : prev
                    )
                  }
                  disabled={currentPage === pagination?.totalPages}
                  className={`px-3 py-1 rounded-md flex items-center ${currentPage === pagination?.totalPages 
                    ? theme === 'dark' 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TourList