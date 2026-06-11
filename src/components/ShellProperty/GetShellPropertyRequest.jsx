import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../../axios/axios";
import { useTheme } from "../../context/ThemeContext";
import EmptyStateModel from "../../model/EmptyStateModel";
import { useLoading } from "../../model/LoadingModel";
import { 
  IndianRupee, Eye, CheckCircle, XCircle, Clock, Search, 
  Calendar, MapPin, Home, User, Building2, Bed, Bath, Square,
  UserCheck, UserX, Shield, Building, RefreshCw, Check, X, Hash,
  AlertTriangle, Send, Trash2
} from "lucide-react";
import useGetAllAgent from "../../hooks/useGetAllAgent";

const GetFreelancerProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const { agentList = [] } = useGetAllAgent();
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });
  
  // Fetch pending properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await http.get(
        `/pending-approval?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
        { withCredentials: true }
      );
      setProperties(response.data.data);
      setTotalProperties(response.data.pagination.total);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  // Fetch verified agents for assignment
  const fetchVerifiedAgents = async () => {
    try {
      const response = await http.get("/verified-agents", {
        withCredentials: true
      });
      setAgents(response.data.data);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchVerifiedAgents();
  }, [currentPage, searchTerm]);

  // View property details
  const handleViewProperty = (propertyId) => {
    navigate(`/propertydetails/${propertyId}`);
  };

  // Approve property
  const handleApprove = async () => {
    if (!selectedProperty) return;
    
    setActionLoading(true);
    try {
      await http.post(
        `/approve-freelancer-property/${selectedProperty._id}`,
        { status: "approved", assignedAgentId: selectedAgentId || null },
        { withCredentials: true }
      );
      await fetchProperties();
      setShowApproveModal(false);
      setSelectedProperty(null);
      setSelectedAgentId("");
    } catch (err) {
      console.error("Failed to approve:", err);
      alert(err.response?.data?.message || "Failed to approve property");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject property
  const handleReject = async () => {
    if (!selectedProperty) return;
    
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }
    
    setActionLoading(true);
    try {
      await http.post(
        `/approve-freelancer-property/${selectedProperty._id}`,
        { status: "rejected", rejectionReason: rejectionReason },
        { withCredentials: true }
      );
      await fetchProperties();
      setShowRejectModal(false);
      setSelectedProperty(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Failed to reject:", err);
      alert(err.response?.data?.message || "Failed to reject property");
    } finally {
      setActionLoading(false);
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

  return (
    <div className={`min-h-screen ${bgClass} p-4 sm:p-6 transition-colors`}>
      <div className={`rounded-xl shadow-lg ${cardClass} border ${borderClass} overflow-hidden`}>
        
        {/* Header Section */}
        <div className={`p-5 border-b ${borderClass}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Shield size={20} className="text-amber-500" />
              </div>
              <div>
                <h2 className={`text-base font-bold uppercase tracking-wider ${textClass}`}>
                  Freelancer Properties - Pending Approval
                </h2>
                <p className={`text-[10px] font-medium ${textMutedClass}`}>
                  Review and approve properties submitted by freelancers
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMutedClass}`} />
              <input
                type="text"
                placeholder="Search by title or reference..."
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
            title="Failed to fetch properties"
            message={error}
            icon="error"
          />
        ) : properties.length === 0 ? (
          <EmptyStateModel
            title="No pending properties"
            message="All freelancer properties have been reviewed. No pending approvals at the moment."
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
                      "Property", "Freelancer Agent", "Type", "Price", 
                      "Beds/Baths", "Location", "Submitted", "Actions"
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
                  {properties.map((property) => {
                    const hasImage = Array.isArray(property.image) && property.image.length > 0;
                    const freelancer = property.agentId;
                    
                    return (
                      <tr
                        key={property._id}
                        className={`transition-colors ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                      >
                        {/* Property */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              {hasImage ? (
                                <img
                                  className="w-full h-full object-cover"
                                  src={property.image[0]}
                                  alt={property.propertyTitleEn}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Home size={16} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className={`text-xs font-semibold ${textClass}`}>
                                {property.propertyTitleEn?.substring(0, 30)}
                                {property.propertyTitleEn?.length > 30 && "..."}
                              </div>
                              <div className={`text-[9px] ${textMutedClass} flex items-center gap-1 mt-0.5`}>
                                <Hash size={8} />
                                {property.refrenceNo}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Freelancer Agent */}
                        <td className="px-4 py-3">
                          <div className={`text-xs font-medium ${textClass}`}>
                            {freelancer?.name || "Unknown"}
                          </div>
                          <div className={`text-[9px] ${textMutedClass} flex items-center gap-1 mt-0.5`}>
                            <User size={8} />
                            {freelancer?.email || "No email"}
                          </div>
                          <div className="mt-1">
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                              Freelancer
                            </span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span className={`text-xs ${textClass}`}>
                            {property.propertytype || "N/A"}
                          </span>
                          <div className={`text-[9px] ${textMutedClass} mt-0.5`}>
                            {property.category} • {property.offeringType}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-0.5">
                            <IndianRupee size={10} className="text-amber-500" />
                            <span className={`text-xs font-bold text-amber-500`}>
                              {property.price?.toLocaleString()}
                            </span>
                          </div>
                         </td>

                        {/* Beds/Baths */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              <Bed size={10} className={textMutedClass} />
                              <span className={`text-[10px] ${textClass}`}>{property.bedroom ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Bath size={10} className={textMutedClass} />
                              <span className={`text-[10px] ${textClass}`}>{property.bathroom ?? 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Square size={10} className={textMutedClass} />
                              <span className={`text-[9px] ${textMutedClass}`}>{property.squarefoot} sqft</span>
                            </div>
                          </div>
                         </td>

                        {/* Location */}
                        <td className="px-4 py-3">
                          <div className={`text-[10px] font-medium ${textClass}`}>
                            {property.zoneName || property.locationName || "N/A"}
                          </div>
                          <div className={`text-[8px] ${textMutedClass} mt-0.5 flex items-center gap-1`}>
                            <MapPin size={8} />
                            {property.displayAddress?.substring(0, 30)}
                          </div>
                         </td>

                        {/* Submitted Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={8} className={textMutedClass} />
                            <span className={`text-[9px] ${textMutedClass}`}>
                              {new Date(property.submittedForApprovalAt || property.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                         </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {/* 👁️ View Button */}
                            <button
                              onClick={() => handleViewProperty(property._id)}
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors"
                              title="View Property Details"
                            >
                              <Eye size={14} />
                            </button>
                            {/* Approve Button */}
                            <button
                              onClick={() => {
                                setSelectedProperty(property);
                                setShowApproveModal(true);
                              }}
                              disabled={actionLoading}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                              title="Approve Property"
                            >
                              <CheckCircle size={14} />
                            </button>
                            {/* Reject Button */}
                            <button
                              onClick={() => {
                                setSelectedProperty(property);
                                setShowRejectModal(true);
                              }}
                              disabled={actionLoading}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                              title="Reject Property"
                            >
                              <XCircle size={14} />
                            </button>
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
                  {Math.min(currentPage * itemsPerPage, totalProperties)} of{" "}
                  <span className="text-amber-500">{totalProperties}</span> properties
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

      {/* Approve Modal */}
      {showApproveModal && selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-xl ${cardClass} border ${borderClass} overflow-hidden`}>
            <div className={`p-5 border-b ${borderClass} bg-green-500/10`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${textClass}`}>
                    Approve Property
                  </h3>
                  <p className={`text-[10px] ${textMutedClass} mt-1`}>
                    Review and approve this property
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className={`text-xs font-medium ${textClass}`}>
                  {selectedProperty.propertyTitleEn}
                </p>
                <p className={`text-[9px] ${textMutedClass} mt-1`}>
                  Reference: {selectedProperty.refrenceNo}
                </p>
              </div>
              
              <div>
                <label className={`text-[10px] font-bold uppercase ${textMutedClass} block mb-2`}>
                  Assign to Verified Agent (Optional)
                </label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${inputClass}`}
                >
                  <option value="">-- Keep Original Agent --</option>
                  {agents.map(agent => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name} - {agent.brnNumber || agent.reraLicenseNumber || "Verified"}
                    </option>
                  ))}
                </select>
                <p className="text-[8px] text-slate-400 mt-1">
                  Leave empty to keep the original freelancer as the agent
                </p>
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={14} /> Approve Property
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedProperty(null);
                    setSelectedAgentId("");
                  }}
                  className="flex-1 py-2 rounded-lg bg-gray-500 text-white text-xs font-bold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-xl ${cardClass} border ${borderClass} overflow-hidden`}>
            <div className={`p-5 border-b ${borderClass} bg-red-500/10`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${textClass}`}>
                    Reject Property
                  </h3>
                  <p className={`text-[10px] ${textMutedClass} mt-1`}>
                    Provide a reason for rejection
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <p className={`text-xs font-medium ${textClass}`}>
                  {selectedProperty.propertyTitleEn}
                </p>
                <p className={`text-[9px] ${textMutedClass} mt-1`}>
                  Reference: {selectedProperty.refrenceNo}
                </p>
              </div>
              
              <div>
                <label className={`text-[10px] font-bold uppercase ${textMutedClass} block mb-2`}>
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg text-sm ${inputClass}`}
                  placeholder="Enter the reason for rejecting this property..."
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <XCircle size={14} /> Reject Property
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedProperty(null);
                    setRejectionReason("");
                  }}
                  className="flex-1 py-2 rounded-lg bg-gray-500 text-white text-xs font-bold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetFreelancerProperties;