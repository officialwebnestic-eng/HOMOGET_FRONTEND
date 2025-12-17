import React, { useContext, useState } from 'react';
import { Eye, Pencil, Trash2, Share2, UserPlus, IndianRupee } from 'lucide-react';
import useGetAlllBookings from './../../../hooks/useGetAlllBookings';
import { Link, useNavigate } from 'react-router-dom';
import useGetAllAgent from "../../../hooks/useGetAllAgent"
import { toast } from 'react-toastify';
import { http } from '../../../axios/axios';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';

import { useLoading } from '../../../model/LoadingModel';

const ViewAllBookings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showAgentList, setShowAgentList] = useState(false);
    const [selectedAgents, setSelectedAgents] = useState([]);
    const navigate = useNavigate()
    const { agentList } = useGetAllAgent()
    const { user } = useContext(AuthContext)
    const { theme } = useTheme();
    const limit = 10;

    const { BookingList, loading, error, pagination, agentBookingData, handleUpdateStatus, deleteBooking } = useGetAlllBookings(currentPage, limit, searchTerm);

    const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });


    // Theme variables
    const themeClasses = {
        light: {
            bg: 'bg-white',
            card: 'bg-white',
            text: 'text-gray-800',
            tableHeader: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            tableRowHover: 'hover:bg-gray-50',
            divider: 'divide-gray-200',
            paginationDisabled: 'bg-gray-100',
            paginationActive: 'bg-blue-500 text-white',
            paginationHover: 'hover:bg-gray-50',
            input: 'bg-white',
            alert: 'bg-red-100 border-red-500 text-red-700',
            modal: 'bg-white'
        },
        dark: {
            bg: 'bg-gray-900',
            card: 'bg-gray-800',
            text: 'text-gray-100',
            tableHeader: 'bg-gradient-to-r from-gray-700 to-gray-600',
            tableRowHover: 'hover:bg-gray-700',
            divider: 'divide-gray-700',
            paginationDisabled: 'bg-gray-700 cursor-not-allowed',
            paginationActive: 'bg-blue-600 text-white',
            paginationHover: 'hover:bg-gray-600',
            input: 'bg-gray-700',
            alert: 'bg-red-900 border-red-700 text-red-100',
            modal: 'bg-gray-800'
        }
    };

    const currentTheme = themeClasses[theme];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleConfirmPayment = booking => {
        console.log("navigating with booking:", booking);
        navigate("/confirmBooking", { state: booking });
    };

    const handleStatusChange = async (newStatus, bookingId) => {
        try {
            const result = handleUpdateStatus(newStatus, bookingId)
            if (result.success) {
                toast.success(result.data.message)
            }
        } catch (error) {
            console.log(Error)
        }
    };

    const handleViewBooking = (id) => {
        navigate(`/bookingupdate/${id}`)
    };

    const handleFollowClick = (booking) => {
        setSelectedBooking(booking);
        setShowAgentList(true);
    };

    const toggleAgentSelection = (agentId) => {
        setSelectedAgents(prev =>
            prev.includes(agentId)
                ? prev.filter(id => id !== agentId)
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
            }
            const response = await http.post('/shar-booking', payload)
            const result = await response.json();
            console.log(result)
            if (!response.ok) throw new Error(result.message || 'Failed to share booking');
            toast.success('Booking shared successfully with selected agents!');
            setShowAgentList(false);
            setSelectedAgents([]);
            setSelectedBooking(null);
        } catch (error) {
            toast.error(`Error sharing booking: ${error.message}`);
        }
    };

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


    if (loading) return (
        <LoadingModel loading={true} />
    );

    if (error) return (
        <EmptyStateModel

            title="Failed to load bookings"
            message="An error occurred while fetching bookings. Please try again later."
            size='large'

        ></EmptyStateModel>
    );

    return (
        <div className={`rounded-lg shadow-md p-6 ${currentTheme.card}`}>
            <div className={`flex flex-col mb-6 md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500`}>
                <h2 className="text-2xl font-bold text-white">Booking List</h2>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by Name, Email, Status, etc."
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-blue-500' : 'focus:ring-gray-500'} ${currentTheme.input} ${currentTheme.text}`}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="flex gap-2">

                    <Link
                        to="/viewsherebooking"
                        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        View Shared Booking
                    </Link>


                    <PermissionProtectedAction action="create" module="Booking Management">
                        <Link
                            to="/propertylisting"
                            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Add Booking
                        </Link>
                    </PermissionProtectedAction>


                </div>
            </div>

            {user.role === "admin" ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={currentTheme.tableHeader}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payment&&tranctionId</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Agentname&&Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`${currentTheme.bg} divide-y ${currentTheme.divider}`}>
                            {BookingList.length > 0 ? (
                                BookingList.map((booking) => (
                                    <tr key={booking._id} className={`${currentTheme.tableRowHover} transition-colors`}>
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
                                                            className={`absolute -bottom-1 -right-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-1 rounded-full shadow-md hover:bg-blue-50`}
                                                            title="Share with agents"
                                                        >
                                                            <UserPlus size={14} className="text-blue-500" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className={`text-sm font-medium ${currentTheme.text}`}>{booking.fullName}</div>
                                                    <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{booking.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {booking.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${currentTheme.text}`}>{booking.propertyId?.propertyname}</div>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{booking.propertyType}</div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {booking.propertyId?.city}, {booking.propertyId?.state}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                          <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          <IndianRupee size={12} className="inline-block mr-1 text-cyan-800" />
                          {booking.propertyId?.price}
                        </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {new Date(booking.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            <div className="font-medium">{booking.paymentMethod || "No Payment"}</div>
                                            <div className="text-xs">{booking.transactionId}</div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            <div className="font-medium">{booking.agentId.name || "No Name"}</div>
                                            <div className="text-xs">{booking.agentId.email || "No Name"}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusChange(e.target.value, booking._id)}
                                                className={`text-xs px-2 py-1 rounded-full font-semibold ${booking.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : booking.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-600'
                                                    }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {/* <button
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewBooking(booking._id);
                                                    }}
                                                >
                                                    <Eye size={18} />
                                                </button> */}
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
                                    <EmptyStateModel
                                        type="No Booking "
                                        title="No Booking Match Your Search"
                                        message="Try adjusting your Booking ."
                                        showResetButton={true}
                                        onResetFilters={handleResetFilters}
                                    />

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={currentTheme.tableHeader}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Payment&&tranctionId</th>
                                <PermissionProtectedAction action="update" module="Booking Management">

                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                </PermissionProtectedAction>

                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`${currentTheme.bg} divide-y ${currentTheme.divider}`}>
                            {agentBookingData.length > 0 ? (
                                agentBookingData.map((booking) => (
                                    <tr key={booking._id} className={`${currentTheme.tableRowHover} transition-colors`}>
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
                                                            className={`absolute -bottom-1 -right-1 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-1 rounded-full shadow-md hover:bg-blue-50`}
                                                            title="Share with agents"
                                                        >
                                                            <UserPlus size={14} className="text-blue-500" />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="ml-4">
                                                    <div className={`text-sm font-medium ${currentTheme.text}`}>{booking.fullName}</div>
                                                    <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{booking.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {booking.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`text-sm font-medium ${currentTheme.text}`}>{booking.propertyId?.propertyname}</div>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{booking.propertyType}</div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {booking.propertyId?.city}, {booking.propertyId?.state}
                                        </td>
                                       <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                          <div className={`text-sm font-semibold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                          <IndianRupee size={12} className="inline-block mr-1 text-cyan-800" />
                          {booking.propertyId?.price}
                        </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            {new Date(booking.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                            <div className="font-medium">{booking.paymentMethod}</div>
                                            <div className="text-xs">{booking.transactionId}</div>
                                        </td>



                                        {/* <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>



                                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${booking.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : booking.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-600'
                                                }`}>



                                                {booking.status}
                                            </span>
                                        </td> */}


                                        <PermissionProtectedAction action="update" module="Booking Management" >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(e.target.value, booking._id)}
                                                    className={`text-xs px-2 py-1 rounded-full font-semibold ${booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>

                                        </PermissionProtectedAction>



                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <PermissionProtectedAction action="view" module="Booking Management">
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
                                                </PermissionProtectedAction>
                                                <PermissionProtectedAction action="delete" module="Booking Management">
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
                                                </PermissionProtectedAction>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <EmptyStateModel
                                    type="custom"
                                    title="No Booking Found"
                                    message="Start by adding your Booking to see analytics here."

                                    showActionButton={true}
                                    actionButtonText="Add Booking"
                                    onActionClick={() => navigate('/createbookingByAgent')}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showAgentList && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`rounded-lg p-6 w-full max-w-md shadow-lg ${currentTheme.modal}`}>
                        <h3 className={`text-lg font-semibold mb-4 ${currentTheme.text}`}>Share Booking with Agents</h3>
                        <ul className="mb-4 max-h-60 overflow-y-auto divide-y">
                            {agentList.map((user) => (
                                <li key={user._id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center">
                                        <img
                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                            src={user.profilePhoto || 'https://via.placeholder.com/40'}
                                            alt={user.name}
                                        />
                                        <div>
                                            <p className={`font-medium ${currentTheme.text}`}>{user.name}</p>
                                            <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{user.email}</p>
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
                                className={`px-4 py-2 border rounded hover:bg-gray-100 ${theme === 'dark' ? 'text-white border-gray-600 hover:bg-gray-700' : 'text-gray-700'}`}
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
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * limit, pagination.totalCount)}</span> of{' '}
                        <span className="font-medium">{pagination.totalCount}</span> results
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? currentTheme.paginationDisabled : currentTheme.paginationHover}`}
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
                                    className={`px-4 py-2 border rounded-md ${currentPage === pageNum ? currentTheme.paginationActive : currentTheme.paginationHover}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        {pagination.totalPages > 5 && (
                            <span className={`px-4 py-2 ${currentTheme.text}`}>...</span>
                        )}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={currentPage === pagination.totalPages}
                            className={`px-4 py-2 border rounded-md ${currentPage === pagination.totalPages ? currentTheme.paginationDisabled : currentTheme.paginationHover}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewAllBookings;