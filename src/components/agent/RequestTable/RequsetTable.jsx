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
    const itemsPerPage = 10;
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Determine if the logged-in user is an admin
    const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

    // Theme variables
    const themeClasses = {
        light: {
            bg: 'bg-white',
            card: 'bg-white',
            text: 'text-gray-800',
            tableHeader: 'bg-gradient-to-r from-amber-500 to-orange-500',
            tableRowHover: 'hover:bg-gray-50',
            divider: 'divide-gray-200',
            paginationDisabled: 'bg-gray-100',
            paginationActive: 'bg-amber-500 text-white',
            paginationHover: 'hover:bg-gray-50',
            input: 'bg-white/90',
            alert: 'bg-red-100 border-red-500 text-red-700'
        },
        dark: {
            bg: 'bg-gray-900',
            card: 'bg-gray-800',
            text: 'text-gray-100',
            tableHeader: 'bg-gradient-to-r from-amber-600 to-orange-600',
            tableRowHover: 'hover:bg-gray-700',
            divider: 'divide-gray-600',
            paginationDisabled: 'bg-gray-700 cursor-not-allowed',
            paginationActive: 'bg-amber-600 text-white',
            paginationHover: 'hover:bg-gray-600',
            input: 'bg-gray-700/90',
            alert: 'bg-red-900 border-red-700 text-red-100'
        }
    };

    const currentTheme = themeClasses[theme];

    const fetchRequests = async () => {
        try {
            setLoading(true);
            
            // Determine which endpoint to use based on user role
            let url = '';
            let params = new URLSearchParams();
            
            params.append('page', currentPage);
            params.append('limit', itemsPerPage);
            
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            
            if (isAdmin) {
                // Admin uses the "all requests" endpoint
                url = `/getallcallrequestdata?${params.toString()}`;
                console.log("Admin fetching all requests");
            } else {
                // Regular agent uses the "my requests" endpoint
                url = `/getdata?${params.toString()}`;
                console.log("Agent fetching their own requests");
            }

            const response = await http.get(url, {
                withCredentials: true
            });
            
            if (response.data.success) {
                setRequests(response.data.data || []);
                setTotalRequests(response.data.count || 0);
                setTotalPages(Math.ceil((response.data.count || 0) / itemsPerPage));
                setError(null);
            } else {
                setError(response.data.message || 'Failed to fetch requests');
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.message || 'Failed to fetch requests');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch when dependencies change
    useEffect(() => {
        fetchRequests();
    }, [currentPage, statusFilter, searchTerm]);

    const handleStatusChange = async (newStatus, requestId) => {
        try {
            const response = await http.put(
                `/updaterequeststatus?id=${requestId}&status=${newStatus}`,
                {},
                { withCredentials: true }
            );
            
            if (response.data.success) {
                // Refresh the list after successful update
                fetchRequests();
            }
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleSearch = (e) => {
        setCurrentPage(1);
        setSearchTerm(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    if (loading) return (
        <div className={`flex justify-center items-center h-64 ${currentTheme.bg}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    );

    if (error) return (
        <div className={`p-6 rounded-lg ${currentTheme.card}`}>
            <EmptyStateModel
                type="User Callback Request"
                title="Error Loading Requests"
                message={error}
                showResetButton={true}
                onResetFilters={clearFilters}
            />
        </div>
    );

    return (
        <div className={`rounded-lg shadow-md p-6 ${currentTheme.card} ${currentTheme.text}`}>
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 p-4 rounded-lg ${theme === 'light' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-amber-700 to-orange-700'}`}>
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">Callback Requests</h2>
                    {isAdmin && (
                        <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Admin Access (All Agents)
                        </span>
                    )}
                    {!isAdmin && (
                        <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            My Requests Only
                        </span>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${currentTheme.input}`}
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <select
                        className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${currentTheme.input}`}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    {(searchTerm || statusFilter !== 'all') && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={currentTheme.tableHeader}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Agent</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Client Name</th>
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={request.agentId?.profilePhoto || '/default-avatar.png'}
                                                alt={request.agentId?.name || 'Agent'}
                                                onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                            />
                                            <div>
                                                <div className={`text-sm font-medium ${currentTheme.text}`}>
                                                    {request.agentId?.name || 'N/A'}
                                                </div>
                                                <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                    {request.agentId?.email || ''}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            {request.firstName} {request.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {request.phone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {request.email}
                                    </td>
                                    
                                    <PermissionProtectedAction action="update" module="AgentSupport Management">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={request.status}
                                                onChange={(e) => handleStatusChange(e.target.value, request._id)}
                                                className={`text-xs px-3 py-1.5 pr-8 rounded-full font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                    request.status === 'completed'
                                                        ? 'bg-green-100 text-green-800 focus:ring-green-200'
                                                        : request.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-800 focus:ring-red-200'
                                                        : 'bg-yellow-100 text-yellow-800 focus:ring-yellow-200'
                                                } ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </PermissionProtectedAction>

                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-10 text-center">
                                    <EmptyStateModel
                                        type="Request"
                                        title="No Requests Found"
                                        message={searchTerm || statusFilter !== 'all' 
                                            ? "No requests match your filters. Try adjusting your search criteria." 
                                            : isAdmin 
                                                ? "No call requests found in the system." 
                                                : "No call requests found for you yet."}
                                        showResetButton={true}
                                        onResetFilters={clearFilters}
                                    />
                                </td>
                            </tr>
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
                            className={`px-4 py-2 border rounded-md transition ${
                                currentPage === 1 
                                    ? currentTheme.paginationDisabled 
                                    : `${currentTheme.paginationHover} cursor-pointer`
                            }`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-4 py-2 border rounded-md transition ${
                                        pageNum === currentPage 
                                            ? currentTheme.paginationActive 
                                            : currentTheme.paginationHover
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 border rounded-md transition ${
                                currentPage === totalPages 
                                    ? currentTheme.paginationDisabled 
                                    : `${currentTheme.paginationHover} cursor-pointer`
                            }`}
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