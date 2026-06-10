import { useState, useEffect } from "react";
import { http } from "../../axios/axios";
import { useTheme } from "../../context/ThemeContext";
import EmptyStateModel from "../../model/EmptyStateModel";
import { useLoading } from "../../model/LoadingModel";
import { IndianRupee, Eye, CheckCircle, XCircle, Clock, Search, Filter, Calendar, MapPin, Home, User, Building2, Bed, Bath, Square } from "lucide-react";

const GetShellPropertyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { theme } = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const itemsPerPage = 10;

  const [statusTab, setStatusTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });
  
  // Fetch requests from API
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await http.get(
        `/getpendingrequest?page=${currentPage}&limit=${itemsPerPage}&status=${statusTab}&search=${searchTerm}`,
        { withCredentials: true }
      );
      setRequests(response.data.data);
      setTotalRequests(response.data.count);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusTab, searchTerm]);

  const handleStatusChange = async (newStatus, requestId) => {
    try {
      await http.post(
        `/approvedpropertyrequest/${requestId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      fetchRequests();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Theme-based classes
  const bgClass = theme === "dark" ? "bg-[#0F1219]" : "bg-[#F8FAFC]";
  const cardClass = theme === "dark" ? "bg-[#161B26]" : "bg-white";
  const textClass = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const textMutedClass = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputClass = theme === "dark"
    ? "bg-[#1A1F2B] text-white border-gray-700 focus:ring-amber-500 focus:border-amber-500"
    : "bg-white text-gray-900 border-gray-200 focus:ring-amber-500 focus:border-amber-500";

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return { color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: <CheckCircle size={10} />, label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: <XCircle size={10} />, label: 'Rejected' };
      default:
        return { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: <Clock size={10} />, label: 'Pending' };
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} p-4 sm:p-6 transition-colors`}>
      <div className={`rounded-xl shadow-lg ${cardClass} border ${borderClass} overflow-hidden`}>
        
        {/* Header Section */}
        <div className={`p-5 border-b ${borderClass}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Building2 size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className={`text-base font-bold uppercase tracking-wider ${textClass}`}>
                  Callback Requests
                </h2>
                <p className={`text-[10px] font-medium ${textMutedClass}`}>
                  Manage property inquiry requests
                </p>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {["pending", "approved", "rejected"].map((status) => {
                const counts = {
                  pending: totalRequests,
                  approved: requests.filter(r => r.status === 'approved').length,
                  rejected: requests.filter(r => r.status === 'rejected').length
                };
                return (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusTab(status);
                      setCurrentPage(1);
                    }}
                    className={`relative px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      statusTab === status
                        ? "bg-amber-500 text-black shadow-md"
                        : `${textMutedClass} hover:bg-amber-500/10`
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                    {statusTab === status && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
              <input
                type="text"
                placeholder="Search by name or email..."
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${inputClass}`}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8">
            <LoadingModel loading={true} />
          </div>
        ) : error ? (
          <EmptyStateModel
            title="Failed to fetch requests"
            message={error}
            icon="error"
          />
        ) : requests.length === 0 ? (
          <EmptyStateModel
            title={`No ${statusTab} requests found`}
            message={`There are no ${statusTab} property inquiry requests at the moment.`}
            icon="empty"
          />
        ) : (
          <>
            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`bg-amber-500/5 ${borderClass}`}>
                  <tr>
                    {[
                      "Property", "User", "Type", "Price", "Beds/Baths", 
                      "Location", "Status", "Date"
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-wider text-amber-500"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderClass}`}>
                  {requests.map((request) => {
                    const hasImage = Array.isArray(request.image) && request.image.length > 0;
                    const statusBadge = getStatusBadge(request.status);
                    
                    return (
                      <tr
                        key={request._id}
                        className={`transition-colors ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                      >
                        {/* Property */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              {hasImage ? (
                                <img
                                  className="w-full h-full object-cover"
                                  src={request.image[0]}
                                  alt={request.propertyname}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Home size={16} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className={`text-xs font-semibold ${textClass}`}>
                                {request.propertyname?.substring(0, 30)}
                                {request.propertyname?.length > 30 && "..."}
                              </div>
                              <div className={`text-[9px] ${textMutedClass} flex items-center gap-1 mt-0.5`}>
                                <MapPin size={8} />
                                {request.address?.substring(0, 25)}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* User */}
                        <td className="px-4 py-3">
                          <div className={`text-xs font-medium ${textClass}`}>
                            {request.userId?.firstname} {request.userId?.lastname}
                          </div>
                          <div className={`text-[9px] ${textMutedClass} flex items-center gap-1 mt-0.5`}>
                            <User size={8} />
                            {request.userId?.email}
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span className={`text-xs ${textClass}`}>
                            {request.propertytype || "N/A"}
                          </span>
                          <div className={`text-[9px] ${textMutedClass} mt-0.5`}>
                            {request.listingtype || "Sale"}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-0.5">
                            <IndianRupee size={10} className="text-amber-500" />
                            <span className={`text-xs font-bold text-amber-500`}>
                              {request.price?.toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* Beds/Baths */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              <Bed size={10} className={textMutedClass} />
                              <span className={`text-[10px] ${textClass}`}>{request.bedroom ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Bath size={10} className={textMutedClass} />
                              <span className={`text-[10px] ${textClass}`}>{request.bathroom ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Square size={10} className={textMutedClass} />
                              <span className={`text-[9px] ${textMutedClass}`}>{request.squarefoot} sqft</span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3">
                          <div className={`text-[10px] font-medium ${textClass}`}>
                            {request.city || "Dubai"}, {request.state || "UAE"}
                          </div>
                          <div className={`text-[8px] ${textMutedClass} mt-0.5`}>
                            {request.zipcode}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {statusTab === "pending" ? (
                            <select
                              value={request.status}
                              onChange={(e) => handleStatusChange(e.target.value, request._id)}
                              className={`text-[9px] font-medium px-2 py-1 rounded-lg border ${inputClass} cursor-pointer`}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="approved">✅ Approve</option>
                              <option value="rejected">❌ Reject</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${statusBadge.color}`}>
                              {statusBadge.icon}
                              {statusBadge.label}
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={8} className={textMutedClass} />
                            <span className={`text-[9px] ${textMutedClass}`}>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4 border-t ${borderClass}`}>
                <p className={`text-[9px] font-medium ${textMutedClass}`}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalRequests)} of{" "}
                  <span className="text-amber-500">{totalRequests}</span> results
                </p>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                        className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${
                          pageNum === currentPage
                            ? "bg-amber-500 text-black shadow-md"
                            : theme === "dark"
                              ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                      theme === "dark"
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );s
};

export default GetShellPropertyRequest;