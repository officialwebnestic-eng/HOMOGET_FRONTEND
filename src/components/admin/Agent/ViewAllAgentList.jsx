import React, { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Mail,
  UserPlus,
  MapPin,
  Sparkles,
  ShieldCheck,
  Phone,
  Globe,
  Filter,
  X,
  Hash,
  User,
  ChevronDown 
} from "lucide-react";
import useGetAllAgent from "./../../../hooks/useGetAllAgent";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../model/SuccessToasNotification";
import { useTheme } from "../../../context/ThemeContext";
import PermissionProtectedAction from "../../../Authorization/PermissionProtectedActions";
import EmptyStateModel from "../../../model/EmptyStateModel";
import { useLoading } from "../../../model/LoadingModel";
import { motion, AnimatePresence } from "framer-motion";

const ViewAllAgentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    agentName: "",
    agentId: "",
    email: "",
    status: "",
    phone: "",
    role: "",
  });
  
  const { theme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const brandColor = "#f59e0b"; // Amber color
  const limit = 8;

  const { agentList, loading, error, pagination, deleteAgent, UpdateStatus } =
    useGetAllAgent(currentPage, limit, filters);
  const LoadingModel = useLoading({
    type: "table",
    count: 1,
    rows: 5,
    columns: 6,
  });

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      agentName: "",
      agentId: "",
      email: "",
      status: "",
      phone: "",
      role: "",
    });
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this agent?")) return;
    try {
      const result = await deleteAgent(id);
      if (result.success) addToast("Agent removed successfully", "error");
    } catch (err) {
      addToast("Failed to remove agent", "error");
    }
  };

  const handleAgentStatusChange = async (newStatus, agentId) => {
    try {
      const result = await UpdateStatus(newStatus, agentId);
      if (result.success) addToast("Agent status updated", "success");
    } catch (err) {
      console.error(err);
    }
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    if (!agentList) return [];
    return [...new Set(agentList.map(item => item[key]).filter(Boolean))];
  };

  const filterFields = [
    { name: "agentName", label: "Agent Name", icon: <User size={12} />, placeholder: "Search by name..." },
    { name: "agentId", label: "Agent ID", icon: <Hash size={12} />, placeholder: "Search by ID..." },
    { name: "email", label: "Email", icon: <Mail size={12} />, placeholder: "Search by email..." },
    { name: "phone", label: "Phone", icon: <Phone size={12} />, placeholder: "Search by phone..." },
    { name: "status", label: "Status", icon: <ShieldCheck size={12} />, type: "select", options: ["Active", "Pending", "Inactive"] },
    { name: "role", label: "Role", icon: <User size={12} />, type: "select", options: ["admin", "agent", "developer"] },
  ];

  return (
    <div
      className={`p-4 md:p-8 min-h-screen transition-all duration-300 ${isDark ? "bg-[#0a0a0c]" : "bg-slate-50"}`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={18} style={{ color: brandColor }} />
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
                Agent <span style={{ color: brandColor }}>List</span>
              </h2>
            </div>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
              Manage your workforce
            </p>
          </div>

          <Link
            to="/addagent"
            style={{ backgroundColor: brandColor }}
            className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white shadow-md hover:opacity-90 transition-all flex items-center gap-2"
          >
            <UserPlus size={14} /> Add Agent
          </Link>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-between w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11141B]"
          >
            <div className="flex items-center gap-2">
              <Filter size={14} style={{ color: brandColor }} />
              <span className="text-[10px] font-bold uppercase">Filters</span>
              {Object.values(filters).some(v => v) && (
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </div>
            <ChevronDown className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} size={14} />
          </button>

          {/* Filter Grid */}
          <AnimatePresence>
            {(showMobileFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 p-4 rounded-xl bg-white dark:bg-[#11141B] border border-slate-200 dark:border-white/10">
                  {filterFields.map((field) => (
                    <div key={field.name} className="relative">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span style={{ color: brandColor }} className="opacity-70">{field.icon}</span>
                        <label className="text-[8px] font-bold uppercase text-slate-500 tracking-wider">
                          {field.label}
                        </label>
                      </div>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={filters[field.name]}
                          onChange={handleFilterChange}
                          className="w-full p-2.5 rounded-lg text-[10px] font-medium border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0c] outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="">All</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name={field.name}
                          placeholder={field.placeholder}
                          value={filters[field.name]}
                          onChange={handleFilterChange}
                          className="w-full p-2.5 rounded-lg text-[10px] font-medium border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0c] outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-slate-400"
                        />
                      )}
                    </div>
                  ))}
                  
                  <div className="flex items-end gap-2">
                    <button
                      onClick={clearFilters}
                      className="flex-1 p-2.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-[9px] font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setCurrentPage(1)}
                      style={{ backgroundColor: brandColor }}
                      className="flex-1 p-2.5 rounded-lg text-white text-[9px] font-bold uppercase tracking-wider hover:opacity-90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Filters Tags */}
        {Object.values(filters).some(v => v) && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => value && (
              <span key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[8px] font-bold uppercase">
                {key}: {value}
                <button onClick={() => setFilters(prev => ({ ...prev, [key]: "" }))}>
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Table Section */}
        {loading ? (
          <LoadingModel loading={true} />
        ) : agentList.length === 0 ? (
          <EmptyStateModel 
            title="No Agents Found" 
            message="Try adjusting your filters or add a new agent."
            onResetFilters={clearFilters}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border overflow-hidden ${isDark ? "bg-[#11141B] border-white/5" : "bg-white border-slate-100"}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                    <th className="px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-500">Agent ID</th>
                    <th className="px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-500">Agent Name</th>
                    <th className="px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-500">Contact Info</th>
                    <th className="px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-500">Role</th>
                    <th className="px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-[8px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                  <AnimatePresence>
                    {agentList.map((agent) => (
                      <motion.tr
                        key={agent._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-amber-500/5 transition-colors"
                      >
                        {/* Agent ID Column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Hash size={10} style={{ color: brandColor }} className="opacity-60" />
                            <span className="text-[9px] font-mono font-medium text-slate-500">
                              {agent._id?.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Agent Name Column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              className="h-8 w-8 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                              src={agent.profilePhoto || "https://via.placeholder.com/150"}
                              alt={agent.name}
                            />
                            <div>
                              <p className={`text-[11px] font-bold ${isDark ? "text-white" : "text-slate-700"}`}>
                                {agent.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info Column */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] flex items-center gap-1.5">
                              <Mail size={10} style={{ color: brandColor }} /> 
                              <span className="truncate max-w-[120px]">{agent.email}</span>
                            </span>
                            <span className="text-[9px] flex items-center gap-1.5 text-slate-500">
                              <Phone size={10} /> {agent.phone || "N/A"}
                            </span>
                          </div>
                        </td>

                        {/* Role Column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: brandColor }} />
                            <span className={`text-[9px] font-semibold uppercase ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                              {agent.role || "Agent"}
                            </span>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-3">
                          <select
                            value={agent.status}
                            onChange={(e) => handleAgentStatusChange(e.target.value, agent._id)}
                            className={`text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border outline-none ${
                              agent.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : agent.status === "Pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            }`}
                          >
                            <option value="Active">ACTIVE</option>
                            <option value="Pending">PENDING</option>
                            <option value="Inactive">INACTIVE</option>
                          </select>
                        </td>

                        {/* Actions Column - No hover effects */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <PermissionProtectedAction action="view" module="Team Management">
                              <Link
                                to={`/agentdetails/${agent._id}`}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500"
                              >
                                <Eye size={14} />
                              </Link>
                            </PermissionProtectedAction>
                            <PermissionProtectedAction action="update" module="Team Management">
                              <Link
                                to={`/updateagent/${agent._id}`}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500"
                              >
                                <Pencil size={14} />
                              </Link>
                            </PermissionProtectedAction>
                            <PermissionProtectedAction action="delete" module="Team Management">
                              <button
                                onClick={() => handleDelete(agent._id)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </PermissionProtectedAction>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className={`px-4 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? "border-white/5 bg-white/5" : "border-slate-100 bg-slate-50/30"}`}>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, pagination?.totalItems || 0)} of {pagination?.totalItems || 0} agents
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination?.totalPages || 1))].map((_, i) => {
                      let pageNum;
                      if (pagination?.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination?.totalPages - 2) {
                        pageNum = pagination?.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                            currentPage === pageNum
                              ? "bg-amber-500 text-white"
                              : "border border-slate-200 dark:border-white/10 hover:bg-amber-500/10"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, pagination?.totalPages || 1))}
                    disabled={currentPage === pagination?.totalPages}
                    className="px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewAllAgentList;