import { useState, useEffect } from "react";
import { http } from "../../axios/axios";
import { useTheme } from "../../context/ThemeContext";

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
  const bgClass = theme === "dark" ? "bg-gray-900" : "bg-gray-50";
  const cardClass = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textClass = theme === "dark" ? "text-gray-200" : "text-gray-800";
  const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputClass =
    theme === "dark"
      ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className={`min-h-screen ${bgClass} p-4 sm:p-6 transition-colors`}>
      <div className={`rounded-lg shadow-md ${cardClass} p-4 sm:p-6`}>
        {/* Header with tabs and search */}
        <div
          className={`flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 p-4 rounded-lg 
            ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-800 to-cyan-800"
                : "bg-gradient-to-r from-blue-600 to-cyan-600"
            }`}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Callback Requests
          </h2>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {["pending", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusTab(status);
                  setCurrentPage(1);
                }}
                className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  statusTab === status
                    ? theme === "dark"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search by name or email..."
              className={`w-full sm:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${inputClass}`}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
              <LoadingModel loading={true} />
        ) : error ? (
          <div
            className={`text-center py-4 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </div>
        ) : (
          <>
            {/* Data Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead
                  className={`${
                    theme === "dark"
                      ? "bg-gradient-to-r from-blue-800 to-cyan-800"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
                  }`}
                >
                  <tr>
                    {[
                      "Property",
                      "User",
                      "Type",
                      "Price",
                      "Beds/Baths",
                      "Location",
                      "Status",
                      "Date",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {requests.length > 0 ? (
                    requests.map((request) => {
                      const hasImage =
                        Array.isArray(request.image) &&
                        request.image.length > 0;
                      return (
                        <tr
                          key={request._id}
                          className={`${
                            theme === "dark"
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          } transition-colors`}
                        >
                          {/* Property */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {hasImage ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={request.image[0]}
                                    alt={request.propertyname}
                                  />
                                ) : (
                                  <div className="h-10 w-10 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded-full">
                                    No Img
                                  </div>
                                )}
                              </div>
                              <div className="ml-3 sm:ml-4">
                                <div
                                  className={`text-sm font-medium ${textClass}`}
                                >
                                  {request.propertyname}
                                </div>
                                <div
                                  className={`text-xs sm:text-sm ${
                                    theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {request.address}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* User */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <div className={textClass}>
                              {request.userId?.firstname}{" "}
                              {request.userId?.lastname}
                            </div>
                            <div
                              className={`text-xs sm:text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {request.userId?.email}
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <div className={textClass}>
                              {request.propertytype}
                            </div>
                            <div
                              className={`text-xs sm:text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {request.listingtype}
                            </div>
                          </td>

                          {/* Price */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                theme === "dark"
                                  ? "bg-green-900 text-green-200"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              ${request.price?.toLocaleString() || "N/A"}
                            </span>
                          </td>

                          {/* Beds/Baths */}
                          <td
                            className={`px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm ${
                              theme === "dark"
                                ? "text-gray-300"
                                : "text-gray-500"
                            }`}
                          >
                            {request.bedroom ?? "N/A"} Beds /{" "}
                            {request.bathroom ?? "N/A"} Baths
                          </td>

                          {/* Location */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                            <div className={textClass}>
                              {request.city}, {request.state}
                            </div>
                            <div
                              className={`text-xs sm:text-sm ${
                                theme === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {request.zipcode}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {statusTab === "pending" ? (
                              <select
                                value={request.status}
                                onChange={(e) =>
                                  handleStatusChange(e.target.value, request._id)
                                }
                                className={`block w-full px-2 py-1 text-sm rounded-md ${inputClass}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="approved">Approve</option>
                                <option value="rejected">Reject</option>
                              </select>
                            ) : (
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  request.status === "approved"
                                    ? theme === "dark"
                                      ? "bg-green-900 text-green-200"
                                      : "bg-green-100 text-green-800"
                                    : request.status === "rejected"
                                    ? theme === "dark"
                                      ? "bg-red-900 text-red-200"
                                      : "bg-red-100 text-red-800"
                                    : theme === "dark"
                                    ? "bg-yellow-900 text-yellow-200"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {request.status.charAt(0).toUpperCase() +
                                  request.status.slice(1)}
                              </span>
                            )}
                          </td>

                          {/* Date */}
                          <td
                            className={`px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(request.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className={`px-6 py-4 text-center text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        No {statusTab} requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className={`px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 border-t ${borderClass} mt-4`}
              >
                <p
                  className={`text-xs sm:text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-700"
                  }`}
                >
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalRequests)}
                  </span>{" "}
                  of <span className="font-medium">{totalRequests}</span> results
                </p>

                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm ${
                          page === currentPage
                            ? theme === "dark"
                              ? "bg-blue-700 text-white"
                              : "bg-blue-500 text-white"
                            : theme === "dark"
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
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
  );
};

export default GetShellPropertyRequest;
