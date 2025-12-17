import React, { useState } from 'react'
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react'
import useGetAllAgent from './../../../hooks/useGetAllAgent'
import { useTheme } from '../../../context/ThemeContext'
import useGetAlllBookings from "../../../hooks/useGetAlllBookings"
import useDebounce from '../../../hooks/useDebounce'

const ViewBookingDetails = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setsearchTerm] = useState({
    propertyname: '',
    state: '',
    status: '',
    city: '',
  })
  const { theme } = useTheme()
  const limit = 6
  const debouncedFilters = useDebounce(searchTerm, 1000)


  const { loading, error, pagination, agentBookingData, deleteBooking } = useGetAlllBookings(currentPage, limit, debouncedFilters, searchTerm);


  const handleFilterChange = (e) => {
    setsearchTerm({
      ...searchTerm,
      [e.target.name]: e.target.value,
    })
    setCurrentPage(1)
  }


  const handleDeleteBooking = (bookingId) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      const result = deleteBooking(bookingId)
      if (result.success) {
        toast.success(result.data.message)
      }
    } catch (error) {
      console.log(Error)
    }
  };

  // Theme configuration
  const themeClasses = {
    light: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200',
      input: 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500',
      button: 'bg-cyan-700 hover:bg-cyan-800',
      pagination: 'bg-cyan-700 hover:bg-cyan-800',
      status: {
        Active: 'text-green-700 bg-green-100',
        Inactive: 'text-yellow-700 bg-yellow-100',
        Pending: 'text-red-700 bg-red-100',
        default: 'text-gray-700 bg-gray-100'
      },
      actionButton: {
        view: 'bg-blue-500 hover:bg-blue-600',
        edit: 'bg-green-500 hover:bg-green-600',
        delete: 'bg-red-500 hover:bg-red-600'
      }
    },
    dark: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-gray-100',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700',
      input: 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500',
      button: 'bg-cyan-600 hover:bg-cyan-700',
      pagination: 'bg-cyan-600 hover:bg-cyan-700',
      status: {
        Active: 'text-green-300 bg-green-900',
        Inactive: 'text-yellow-300 bg-yellow-900',
        Pending: 'text-red-300 bg-red-900',
        default: 'text-gray-300 bg-gray-700'
      },
      actionButton: {
        view: 'bg-blue-600 hover:bg-blue-700',
        edit: 'bg-green-600 hover:bg-green-700',
        delete: 'bg-red-600 hover:bg-red-700'
      }
    }
  }

  const currentTheme = themeClasses[theme]

  return (
    <div className={`p-5 min-h-screen ${currentTheme.bg}`}>
      <div className={`p-5 mt-8 shadow rounded-xl ${currentTheme.card}`}>
        <h2 className={`text-xl font-semibold mb-4 ${currentTheme.text}`}>Booking Details</h2>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="propertyname"
            placeholder="Search by propertyname"
            value={searchTerm.propertyname}
            onChange={handleFilterChange}
            className={`px-3 py-2 rounded w-full ${currentTheme.input} ${currentTheme.text}`}
          />
          <input
            type="text"
            name="state"
            placeholder="Search by State"
            value={searchTerm.state}
            onChange={handleFilterChange}
            className={`px-3 py-2 rounded w-full ${currentTheme.input} ${currentTheme.text}`}
          />
          <input
            type="text"
            name="city"
            placeholder="Search by city"
            value={searchTerm.city}
            onChange={handleFilterChange}
            className={`px-3 py-2 rounded w-full ${currentTheme.input} ${currentTheme.text}`}
          />
          <select
            name="status"
            value={searchTerm.status}
            onChange={handleFilterChange}
            className={`px-3 py-2 rounded w-full ${currentTheme.input} ${currentTheme.text}`}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : error ? (




          <p className="text-red-500 text-center">Agent Not Found</p>
        ) : (
          <>
            {/* Agent Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentBookingData.map((booking, index) => (
                <div
                  key={index}
                  className={`rounded-xl shadow hover:shadow-lg transition p-4 space-y-3 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}
                >
                  {booking.property?.images?.length > 0 && (
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={booking.property.images[0]}
                        alt={booking.fullName}
                      />

                    </div>
                  )}

                  <div className={`text-sm space-y-1 ${currentTheme.textSecondary}`}>
                    <p><strong className={currentTheme.text}>propertyname:</strong>{booking.propertyId?.propertyname}</p>
                    <p><strong className={currentTheme.text}>City:</strong> {booking.propertyId.city}</p>
                    <p><strong className={currentTheme.text}>State:</strong> {booking.propertyId.state}</p>
                    <p><strong className={currentTheme.text}>Address:</strong> {booking.propertyId.address}</p>
                    <p>
                      <strong className={currentTheme.text}>Status:</strong>{' '}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${currentTheme.status[booking.propertyId.status] || currentTheme.status.default
                        }`}>
                        {booking.propertyId.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      title="View"
                      className={`p-2 rounded-full text-white ${currentTheme.actionButton.view}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      title="Edit"
                      className={`p-2 rounded-full text-white ${currentTheme.actionButton.edit}`}
                    >
                      <Pencil size={16} />
                    </button>
                    
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBooking(booking._id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded text-white ${currentTheme.pagination} disabled:opacity-50`}
              >
                Prev
              </button>
              <span className={`px-4 py-2 text-white rounded ${currentTheme.pagination}`}>
                Page {pagination?.page} of {pagination?.totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    pagination?.totalPages ? Math.min(prev + 1, pagination.totalPages) : prev
                  )
                }
                disabled={currentPage === pagination?.totalPages}
                className={`px-4 py-2 rounded text-white ${currentTheme.pagination} disabled:opacity-50`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ViewBookingDetails