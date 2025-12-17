import { useState, useEffect, useContext } from 'react';
import { http } from '../../../axios/axios';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import EmptyStateModel from '../../../model/EmptyStateModel';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';

const RequestTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const { theme } = useTheme();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);
    const itemsPerPage = 2;
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

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
            input: 'bg-white/90',
            alert: 'bg-red-100 border-red-500 text-red-700'
        },
        dark: {
            bg: 'bg-gray-900',
            card: 'bg-gray-800',
            text: 'text-gray-100',
            tableHeader: 'bg-gradient-to-r from-gray-700 to-gray-600',
            tableRowHover: 'hover:bg-gray-700',
            divider: 'divide-gray-600',
            paginationDisabled: 'bg-gray-700 cursor-not-allowed',
            paginationActive: 'bg-blue-600 text-white',
            paginationHover: 'hover:bg-gray-600',
            input: 'bg-gray-700/90',
            alert: 'bg-red-900 border-red-700 text-red-100'
        }
    };

    const currentTheme = themeClasses[theme];

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await http.get(
                `/getdata?page=${currentPage}&limit=${itemsPerPage}&status=${statusFilter}&search=${searchTerm}`,
                {
                    withCredentials: true
                }
            );
            setRequests(response.data.data);
            setTotalRequests(response.data.count);
            setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [currentPage, statusFilter, searchTerm]);

    const handleStatusChange = async (newStatus, requestId) => {
        const clientId = requestId.trim();


        try {
            await http.put(
                `/updaterequeststatus?status=${newStatus}&id=${clientId}`,
                {},
                {
                    withCredentials: true
                }
            );
            fetchRequests();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleSearch = (e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
    };

    if (loading) return (
        <div className={`flex justify-center items-center h-64 ${currentTheme.bg}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <EmptyStateModel
            type="User Callback Request"
            title="No User CallBack Request Found"
            message={error}
            showResetButton={true}
        />
    );

    return (
        <div className={`rounded-lg shadow-md p-6 ${currentTheme.card} ${currentTheme.text}`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 rounded-lg ${theme === 'light' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-gray-700 to-gray-600'}`}>
                <h2 className="text-2xl font-bold text-white">Callback Requests</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-white' : 'focus:ring-gray-300'} ${currentTheme.input}`}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:ring-white' : 'focus:ring-gray-300'} ${currentTheme.input}`}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className={currentTheme.tableHeader}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Agent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
                            <PermissionProtectedAction action="update" module="AgentSupport Management">
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                            </PermissionProtectedAction>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Date</th>
                        </tr>
                    </thead>

                    <tbody className={`${currentTheme.bg} divide-y ${currentTheme.divider}`}>
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <tr key={request._id} className={`${currentTheme.tableRowHover} transition`}>
                                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={request.agentId?.profilePhoto || '/default-avatar.png'}
                                            alt={request.firstName || 'User'}
                                        />
                                        <div>
                                            <div className={`text-sm font-medium ${currentTheme.text}`}>{request.agentId?.name || 'N/A'}</div>
                                            <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{request.agentId?.email || ''}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {request.firstName} {request.lastName}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{request.phone}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>{request.email}</td>
                                    <PermissionProtectedAction action="update" module="AgentSupport Management">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="relative">
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => handleStatusChange(e.target.value, request._id)}
                                                    className={`text-xs px-3 py-1.5 rounded-full font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${request.status === 'Complete'
                                                        ? 'bg-green-100 text-green-800 focus:ring-green-200'
                                                        : 'bg-yellow-100 text-yellow-800 focus:ring-yellow-200'
                                                        } ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
                                                    aria-label={`Change status for ${request.firstName}'s request`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Complete">Complete</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>



                                    </PermissionProtectedAction>


                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <EmptyStateModel
                                type="Request"
                                title="No User Request Match Found"
                                message="Try adjusting your location or price range to see more results."
                                showResetButton={true}
                            />
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalRequests)}</span> of{' '}
                        <span className="font-medium">{totalRequests}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 border rounded-md ${currentPage === 1 ? currentTheme.paginationDisabled : currentTheme.paginationHover}`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                            .map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 border rounded-md ${page === currentPage ? currentTheme.paginationActive : currentTheme.paginationHover}`}
                                >
                                    {page}
                                </button>
                            ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? currentTheme.paginationDisabled : currentTheme.paginationHover}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestTable;