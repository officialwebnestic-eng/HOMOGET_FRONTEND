import React, { useState, useEffect } from "react";
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
  ChevronDown,
  MoreVertical,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  RefreshCw,
  Users
} from "lucide-react";
import useGetAllAgent from "./../../../hooks/useGetAllAgent";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../../model/SuccessToasNotification";
import { useTheme } from "../../../context/ThemeContext";
import PermissionProtectedAction from "../../../Authorization/PermissionProtectedActions";
import EmptyStateModel from "../../../model/EmptyStateModel";
import { useLoading } from "../../../model/LoadingModel";
import { motion, AnimatePresence } from "framer-motion";
import { http } from "../../../axios/axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/agents/${filename}`;
};

const ViewAllAgentList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState(null);
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
  const brandColor = "#f59e0b";
  const limit = 8;

  // IMPORTANT: Pass true as 4th parameter for admin mode to see ALL agents
  const { agentList, loading, error, pagination, deleteAgent, UpdateStatus, refetch } =
    useGetAllAgent(currentPage, limit, filters, true); // <-- true = admin mode

  const LoadingModel = useLoading({
    type: "table",
    count: 1,
    rows: 5,
    columns: 6,
  });

  // Filter agents based on active tab - handle missing fields
  const getFilteredAgents = () => {
    if (!agentList) return [];
    
    switch (activeTab) {
      case "active":
        return agentList.filter(agent => agent.status === "Active");
      case "blocked":
        return agentList.filter(agent => agent.isBlocked === true);
      case "pending":
        return agentList.filter(agent => agent.status === "Pending");
      case "public":
        return agentList.filter(agent => agent.isPublic === true);
      case "private":
        return agentList.filter(agent => agent.isPublic === false);
      default:
        return agentList;
    }
  };

  const filteredAgents = getFilteredAgents();
  
  const tabs = [
    { id: "all", label: "All Agents", icon: <Users size={14} />, count: agentList?.length || 0 },
    { id: "active", label: "Active", icon: <UserCheck size={14} />, count: agentList?.filter(a => a.status === "Active").length || 0, color: "text-emerald-500" },
    { id: "blocked", label: "Blocked", icon: <UserX size={14} />, count: agentList?.filter(a => a.isBlocked === true).length || 0, color: "text-red-500" },
    { id: "pending", label: "Pending", icon: <RefreshCw size={14} />, count: agentList?.filter(a => a.status === "Pending").length || 0, color: "text-amber-500" },
    { id: "public", label: "Public", icon: <Unlock size={14} />, count: agentList?.filter(a => a.isPublic === true).length || 0, color: "text-blue-500" },
    { id: "private", label: "Private", icon: <Lock size={14} />, count: agentList?.filter(a => a.isPublic === false).length || 0, color: "text-purple-500" },
  ];

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
      if (result.success) addToast("Agent removed successfully", "success");
    } catch (err) {
      addToast("Failed to remove agent", "error");
    }
  };

  const handleAgentStatusChange = async (newStatus, agentId) => {
    try {
      const result = await UpdateStatus(newStatus, agentId);
      if (result.success) {
        addToast(`Agent status updated to ${newStatus}`, "success");
        setOpenDropdownId(null);
        refetch();
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to update agent status", "error");
    }
  };

  // Block agent API call
  const handleBlockAgent = async (agentId, reason = "Violation of terms") => {
    try {
      const response = await http.put(`/block-agent/${agentId}`, { reason }, { withCredentials: true });
      if (response.data.success) {
        addToast("Agent blocked successfully", "success");
        setOpenDropdownId(null);
        refetch();
      }
    } catch (error) {
      console.error("Block agent error:", error);
      addToast("Failed to block agent", "error");
    }
  };

  // Unblock agent API call
  const handleUnblockAgent = async (agentId) => {
    try {
      const response = await http.put(`/unblock-agent/${agentId}`, {}, { withCredentials: true });
      if (response.data.success) {
        addToast("Agent unblocked successfully", "success");
        setOpenDropdownId(null);
        refetch();
      }
    } catch (error) {
      console.error("Unblock agent error:", error);
      addToast("Failed to unblock agent", "error");
    }
  };

  // Make agent public API call
  const handleMakePublic = async (agentId) => {
    try {
      const response = await http.put(`/make-public/${agentId}`, {}, { withCredentials: true });
      if (response.data.success) {
        addToast("Agent profile is now public", "success");
        setOpenDropdownId(null);
        refetch();
      }
    } catch (error) {
      console.error("Make public error:", error);
      addToast("Failed to update visibility", "error");
    }
  };

  // Make agent private API call
  const handleMakePrivate = async (agentId) => {
    try {
      const response = await http.put(`/make-unpublic/${agentId}`, {}, { withCredentials: true });
      if (response.data.success) {
        addToast("Agent profile is now private", "success");
        setOpenDropdownId(null);
        refetch();
      }
    } catch (error) {
      console.error("Make private error:", error);
      addToast("Failed to update visibility", "error");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filterFields = [
    { name: "agentName", label: "Agent Name", icon: <User size={12} />, placeholder: "Search by name..." },
    { name: "agentId", label: "Agent ID", icon: <Hash size={12} />, placeholder: "Search by ID..." },
    { name: "email", label: "Email", icon: <Mail size={12} />, placeholder: "Search by email..." },
    { name: "phone", label: "Phone", icon: <Phone size={12} />, placeholder: "Search by phone..." },
    { name: "status", label: "Status", icon: <ShieldCheck size={12} />, type: "select", options: ["Active", "Pending", "Inactive", "Blocked"] },
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

        {/* Tab Section */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-amber-500 text-black shadow-md"
                  : isDark
                    ? "text-slate-400 hover:bg-white/5"
                    : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[8px] ${
                activeTab === tab.id
                  ? "bg-black text-amber-500"
                  : isDark
                    ? "bg-white/10 text-slate-400"
                    : "bg-slate-100 text-slate-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Section */}
        <div className="flex flex-col gap-3">
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
        ) : filteredAgents.length === 0 ? (
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
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Image</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Agent ID</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Name</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Email</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Phone</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Role</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500">Visibility</th>
                    <th className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
                  <AnimatePresence>
                    {filteredAgents.map((agent) => (
                      <motion.tr
                        key={agent._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-amber-500/5 transition-colors"
                      >
                        {/* Image Column */}
                        <td className="px-4 py-3">
                          <img
                            className="h-8 w-8 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                            src={getImageUrl(agent.profilePhoto) || `https://ui-avatars.com/api/?name=${agent.name}&background=C5A059&color=fff`}
                            alt={agent.name}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${agent.name}&background=C5A059&color=fff`;
                            }}
                          />
                        </td>

                        {/* Agent ID Column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Hash size={10} style={{ color: brandColor }} className="opacity-60" />
                            <span className="text-[10px] font-mono font-medium text-slate-500">
                              {agent.agentId || agent._id?.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Name Column */}
                        <td className="px-4 py-3">
                          <p className={`text-[11px] font-bold ${isDark ? "text-white" : "text-slate-700"}`}>
                            {agent.name}
                          </p>
                         </td>

                        {/* Email Column */}
                        <td className="px-4 py-3">
                          <span className="text-[10px] flex items-center gap-1.5">
                            <Mail size={10} style={{ color: brandColor }} /> 
                            <span className="truncate max-w-[150px]">{agent.email}</span>
                          </span>
                         </td>

                        {/* Phone Column */}
                        <td className="px-4 py-3">
                          <span className="text-[10px] flex items-center gap-1.5 text-slate-500">
                            <Phone size={10} /> {agent.phone || "N/A"}
                          </span>
                         </td>

                        {/* Role Column */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: brandColor }} />
                            <span className={`text-[10px] font-semibold uppercase ${isDark ? "text-slate-300" : "text-slate-500"}`}>
                              {agent.role || "Agent"}
                            </span>
                          </div>
                         </td>

                        {/* Status Column */}
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            agent.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : agent.status === "Blocked"
                              ? "bg-rose-500/10 text-rose-600"
                              : agent.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-slate-500/10 text-slate-500"
                          }`}>
                            {agent.status || "Pending"}
                          </span>
                         </td>

                        {/* Visibility Column */}
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 w-fit ${
                            agent.isPublic
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-purple-500/10 text-purple-600"
                          }`}>
                            {agent.isPublic ? <Unlock size={10} /> : <Lock size={10} />}
                            {agent.isPublic ? "Public" : "Private"}
                          </span>
                         </td>

                        {/* Actions Column with Three Dots Dropdown */}
                        <td className="px-4 py-3 text-right">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdownId(openDropdownId === agent._id ? null : agent._id);
                              }}
                              className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-amber-500 hover:text-white transition-colors"
                            >
                              <MoreVertical size={14} />
                            </button>
                            
                            {openDropdownId === agent._id && (
                              <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 z-100 overflow-hidden">
                                <div className="py-1">
                                  <Link
                                    to={`/agentdetails/${agent._id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-500/10 transition-colors"
                                  >
                                    <Eye size={12} /> View Details
                                  </Link>
                                  
                                  <Link
                                    to={`/updateagent/${agent._id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-500/10 transition-colors"
                                  >
                                    <Pencil size={12} /> Edit Agent
                                  </Link>
                                  
                                  <div className="border-t border-slate-200 dark:border-white/10 my-1" />
                                  
                                  {/* Visibility Toggle */}
                                  {agent.isPublic ? (
                                    <button
                                      onClick={() => handleMakePrivate(agent._id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-purple-600 hover:bg-purple-500/10 transition-colors"
                                    >
                                      <Lock size={12} /> Make Private
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleMakePublic(agent._id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-blue-600 hover:bg-blue-500/10 transition-colors"
                                    >
                                      <Unlock size={12} /> Make Public
                                    </button>
                                  )}
                                  
                                  <div className="border-t border-slate-200 dark:border-white/10 my-1" />
                                  
                                  {/* Block/Unblock Toggle */}
                                  {agent.isBlocked ? (
                                    <button
                                      onClick={() => handleUnblockAgent(agent._id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                                    >
                                      <UserCheck size={12} /> Unblock Agent
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleBlockAgent(agent._id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-rose-600 hover:bg-rose-500/10 transition-colors"
                                    >
                                      <UserX size={12} /> Block Agent
                                    </button>
                                  )}
                                  
                                  {/* Status Update Options */}
                                  {agent.status !== "Active" && !agent.isBlocked && (
                                    <button
                                      onClick={() => handleAgentStatusChange("Active", agent._id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                                    >
                                      <RefreshCw size={12} /> Approve Agent
                                    </button>
                                  )}
                                  
                                  {agent.status === "Pending" && (
                                    <button
                                      onClick={() => handleAgentStatusChange("Inactive", agent._id)}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-amber-600 hover:bg-amber-500/10 transition-colors"
                                    >
                                      <RefreshCw size={12} /> Reject Agent
                                    </button>
                                  )}
                                  
                                  <div className="border-t border-slate-200 dark:border-white/10 my-1" />
                                  
                                  <button
                                    onClick={() => handleDelete(agent._id)}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium text-rose-600 hover:bg-rose-500/10 transition-colors"
                                  >
                                    <Trash2 size={12} /> Delete Agent
                                  </button>
                                </div>
                              </div>
                            )}
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
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
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