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
  const [filters, setFilters] = useState({
    agentName: "",
    email: "",
    status: "",
  });
  const { theme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const brandGold = "#C5A059";
  const deepNavy = "#0F1219";
  const limit = 5;

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

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Authorize permanent removal of this agent from the registry?",
      )
    )
      return;
    try {
      const result = await deleteAgent(id);
      if (result.success) addToast("Registry entry removed", "error");
    } catch (err) {
      addToast("Authorization failed", "error");
    }
  };

  const handleAgentStatusChange = async (newStatus, agentId) => {
    try {
      const result = await UpdateStatus(newStatus, agentId);
      if (result.success) addToast("Agent credentials updated", "success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`p-6 md:p-10 min-h-screen transition-all duration-700 ${isDark ? "bg-[#0F1219]" : "bg-slate-50"}`}
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header & Luxury Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles size={20} style={{ color: brandGold }} />
              <h2
                className={`text-3xl font-black italic tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Agent <span style={{ color: brandGold }}>Registry.</span>
              </h2>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Dubai HQ Workforce Management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                name="agentName"
                placeholder="SEARCH BY NAME..."
                value={filters.agentName}
                onChange={handleFilterChange}
                className={`w-full md:w-64 pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all ${
                  isDark
                    ? "bg-[#161B26] border-white/5 text-white focus:border-[#C5A059]/50"
                    : "bg-white border-slate-200 focus:border-[#C5A059]"
                }`}
              />
            </div>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest cursor-pointer outline-none transition-all ${
                isDark
                  ? "bg-[#161B26] border-white/5 text-slate-300"
                  : "bg-white border-slate-200 text-slate-600"
              }`}
            >
              <option value="">ALL STATUS</option>
              <option value="Active">ACTIVE</option>
              <option value="Pending">PENDING</option>
            </select>

            <Link
              to="/addagent"
              style={{ backgroundColor: brandGold }}
              className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105 flex items-center gap-3"
            >
              <UserPlus size={16} /> Register Agent
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingModel loading={true} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-500 ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-100"}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={isDark ? "bg-white/5" : "bg-slate-50"}>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Custodian Identity
                    </th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Connectivity
                    </th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Designation
                    </th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${isDark ? "divide-white/5" : "divide-slate-50"}`}
                >
                    
                  <AnimatePresence>
                    {agentList.map((agent) => (
                      <motion.tr
                        key={agent._id}
                        className="group hover:bg-[#C5A059]/5 transition-colors duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <img
                                className="h-14 w-14 rounded-2xl object-cover  grayscale-0 transition-all border-2 border-transparent group-hover:border-[#C5A059]"
                                src={
                                  agent.profilePhoto ||
                                  "https://via.placeholder.com/150"
                                }
                                alt=""
                              />
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 ${isDark ? "border-[#161B26]" : "border-white"} ${agent.status === "Active" ? "bg-emerald-500" : "bg-rose-500"}`}
                              />
                            </div>
                            <div>
                              <p
                                className={`text-xs font-black uppercase tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
                              >
                                {agent.name}
                              </p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase">
                                ID: {agent._id?.slice(-8).toUpperCase()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold flex items-center gap-2 tracking-wide">
                              <Mail size={12} style={{ color: brandGold }} />{" "}
                              {agent.email}
                            </span>
                            <span className="text-[10px] font-bold flex items-center gap-2 text-slate-500 tracking-wide">
                              <Phone size={12} />{" "}
                              {agent.phone || "+971 -- --- ----"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: brandGold }}
                            />
                            <span
                              className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-slate-300" : "text-slate-600"}`}
                            >
                              {agent.role || "ASSET MANAGER"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={agent.status}
                            onChange={(e) =>
                              handleAgentStatusChange(e.target.value, agent._id)
                            }
                            className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border outline-none transition-all ${
                              agent.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}
                          >
                            <option value="Active">ACTIVE</option>
                            <option value="Pending">PENDING</option>
                            <option value="Inactive">INACTIVE</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                            <PermissionProtectedAction
                              action="view"
                              module="Team Management"
                            >
                              <Link
                                to={`/agentdetails/${agent._id}`}
                                className="p-2.5 rounded-xl bg-slate-500/10 text-slate-500 hover:text-blue-500 transition-colors"
                              >
                                <Eye size={16} />
                              </Link>
                            </PermissionProtectedAction>
                            <PermissionProtectedAction
                              action="update"
                              module="Team Management"
                            >
                              <Link
                                to={`/updateagent/${agent._id}`}
                                className="p-2.5 rounded-xl bg-slate-500/10 text-slate-500 hover:text-[#C5A059] transition-colors"
                              >
                                <Pencil size={16} />
                              </Link>
                            </PermissionProtectedAction>
                            <PermissionProtectedAction
                              action="delete"
                              module="Team Management"
                            >
                              <button
                                onClick={() => handleDelete(agent._id)}
                                className="p-2.5 rounded-xl bg-slate-500/10 text-slate-500 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 size={16} />
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

            {/* Professional Pagination */}
            <div
              className={`px-10 py-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6 ${isDark ? "border-white/5 bg-white/5" : "border-slate-50 bg-slate-50/30"}`}
            >
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
                DISPLAYING{" "}
                {Math.min(currentPage * limit, pagination?.totalItems || 0)} OF{" "}
                {pagination?.totalItems || 0} CERTIFIED AGENTS
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-20 ${
                    isDark
                      ? "bg-white/5 text-white hover:bg-white/10"
                      : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(p + 1, pagination?.totalPages || 1),
                    )
                  }
                  disabled={currentPage === pagination?.totalPages}
                  className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-20 ${
                    isDark
                      ? "bg-white/5 text-white hover:bg-white/10"
                      : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewAllAgentList;
