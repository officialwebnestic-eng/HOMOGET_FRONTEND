import React, { useContext, useEffect, useState } from 'react';
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useGetAllAgent from "../../../hooks/useGetAllAgent"
import { http } from '../../../axios/axios'; // ensure axios instance is correctly configured
import { toast } from 'react-toastify'; // assuming you're using react-toastify for notifications
import { AuthContext } from '../../../context/AuthContext';
import EmptyStateModel from '../../../model/EmptyStateModel';

const ViewSherBooking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAgentList, setShowAgentList] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();
  const { agentList } = useGetAllAgent();
  const { user } = useContext(AuthContext);
  const limit = 10;

  const getSharedBooking = async () => {
    setLoading(true);
    setError(null); // reset error before fetch
    try {
      const response = await http.get('/getsharebooking', {
        withCredentials: true
      });
      console.log(response);
      if (response.data?.success) {
        if (response.data.bookings && response.data.bookings.length > 0) {
          setBookingList(response.data.bookings);
          setPagination(response.data.pagination);
        } else {
          setBookingList([]); // explicitly set empty array
          setError('No bookings found.');
        }
      } else {
        setBookingList([]); // clear list on failure
        setError('Failed to fetch shared bookings.');
      }
    } catch (error) {
      console.error('Error fetching shared bookings:', error);
      setBookingList([]);
      setError('Error fetching bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSharedBooking();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleConfirmPayment = (booking) => {
    navigate('/confirmBooking', { state: booking });
  };

  const handleStatusChange = async (newStatus, bookingId) => {
    try {
      const response = await http.put(
        `/updatebookingstatus/${bookingId}`,
        { status: newStatus },
        {
          withCredentials: true
        }
      );
      if (response.data?.success) {
        toast.success('Booking status updated successfully.');
        getSharedBooking();
      } else {
        toast.error('Failed to update booking status.');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Something went wrong while updating booking status.');
    }
  };

  const handleViewBooking = (id) => {
    navigate(`/bookingupdate/${id}`);
  };

  const handleFollowClick = (booking) => {
    setSelectedBooking(booking);
    setShowAgentList(true);
  };

  const toggleAgentSelection = (agentId) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  const handleShareBooking = async () => {
    if (!selectedBooking || selectedAgents.length === 0) {
      toast.warning('Please select at least one agent.');
      return;
    }

    try {
      const payload = {
        bookingId: selectedBooking._id,
        agentIds: selectedAgents,
      };

      const response = await http.post('/share-booking', payload, {
        withCredentials: true
      });

      if (response.data?.success) {
        toast.success('Booking shared successfully with selected agents!');
        setShowAgentList(false);
        setSelectedAgents([]);
        setSelectedBooking(null);
      } else {
        toast.error('Failed to share booking.');
      }
    } catch (error) {
      console.error('Error sharing booking:', error);
      toast.error('Something went wrong while sharing booking.');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this booking?'
    );
    if (confirmDelete) {
      try {
        const response = await http.delete(`/deletebooking/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (response.data?.success) {
          toast.success('Booking deleted successfully.');
          getSharedBooking();
        } else {
          toast.error('Failed to delete booking.');
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
        toast.error('Something went wrong while deleting booking.');
      }
    }
  };

  // Safeguard filter
  const filteredBookings = Array.isArray(bookingList)
    ? bookingList.filter((booking) => {
        const search = searchTerm.toLowerCase();
        return (
          booking.fullName.toLowerCase().includes(search) ||
          booking.email.toLowerCase().includes(search) ||
          booking.status.toLowerCase().includes(search)
        );
      })
    : [];

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
 
      {/* Search & Header */}
      <div className="flex flex-col bg-gradient-to-r from-blue-600 to-cyan-600 md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800">Booking List</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by Name, Email, Status, etc."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Booking Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-cyan-500">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payment&&tranctionId</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedBookings.length > 0 ? (
              paginatedBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  {/* Client */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {booking.property?.images?.length > 0 && (
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={booking.property.images[0]}
                            alt={booking.fullName}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollowClick(booking);
                            }}
                            className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md hover:bg-blue-50"
                            title="Share with agents"
                          >
                            <UserPlus size={14} className="text-blue-500" />
                          </button>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </div>
                    </div>
                  </td>
                  {/* Contact */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.phone}</td>
                  {/* Property */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.propertyId?.propertyname}</div>
                    <div className="text-sm text-gray-500">{booking.propertyType}</div>
                  </td>
                  {/* Location */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.propertyId?.city}, {booking.propertyId?.state}
                  </td>
                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${booking.propertyId?.price?.toLocaleString()}
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  {/* Payment & Transaction */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="font-medium">{booking.paymentMethod}</div>
                    <div className="text-xs">{booking.transactionId}</div>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(e.target.value, booking._id)}
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        booking.status === 'Complete'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewBooking(booking._id);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmPayment(booking);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Confirm Payment"
                      >
                        <Pencil size={18} />
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
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4">
                  {error && (
                     <EmptyStateModel
                      type="Booking"
                      title="No Booking Match Your Search"
                      message="Try adjusting your Booking Criteria"
                    />
                  ) }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Share Agent Modal */}
      {showAgentList && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Share Booking with Agents</h3>
            <ul className="mb-4 max-h-60 overflow-y-auto divide-y">
              {agentList.map((user) => (
                <li key={user._id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full object-cover mr-3"
                      src={user.image || 'https://via.placeholder.com/40'}
                      alt={user.name}
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAgents.includes(user._id)}
                    onChange={() => toggleAgentSelection(user._id)}
                    className="h-5 w-5 text-blue-600"
                  />
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAgentList(false)}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleShareBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * limit, pagination.totalCount)}</span> of{' '}
            <span className="font-medium">{pagination.totalCount}</span> results
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 border rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            {pagination.totalPages > 5 && (
              <span className="px-4 py-2">...</span>
            )}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`px-4 py-2 border rounded-md ${currentPage === pagination.totalPages ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSherBooking;