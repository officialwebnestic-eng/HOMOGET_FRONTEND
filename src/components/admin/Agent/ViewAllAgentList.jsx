import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Search, Mail, Filter, UserPlus, MapPin, ShieldCheck } from 'lucide-react';
import useGetAllAgent from './../../../hooks/useGetAllAgent';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../model/SuccessToasNotification';
import { useTheme } from '../../../context/ThemeContext';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';
import { motion, AnimatePresence } from 'framer-motion';

const ViewAllAgentList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ agentName: '', email: '', status: '' });
    const { theme } = useTheme();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const isDark = theme === 'dark';
    const limit = 5;

    const { agentList, loading, error, pagination, deleteAgent, UpdateStatus } = useGetAllAgent(currentPage, limit, filters);
    const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 6 });

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this agent?")) return;
        try {
            const result = await deleteAgent(id);
            if (result.success) {
                addToast("Agent records removed successfully", "error");
            }
        } catch (err) {
            addToast("Failed to delete agent", "error");
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

    return (
        <div className={`p-6 md:p-10 min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header & Controls Section */}
                <div className={`p-6 rounded-[2rem] border shadow-xl backdrop-blur-md ${isDark ? 'bg-slate-900/50 border-slate-800 shadow-black/20' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Agent Directory</h2>
                            <p className={`text-sm mt-1 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Manage your global workforce and permissions</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="agentName"
                                    placeholder="Agent Name..."
                                    value={filters.agentName}
                                    onChange={handleFilterChange}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-4 transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:ring-indigo-500/20' : 'bg-slate-50 border-slate-100 focus:ring-indigo-500/10'}`}
                                />
                            </div>
                            <div className="relative flex-1 min-w-[200px]">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email Address..."
                                    value={filters.email}
                                    onChange={handleFilterChange}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-4 transition-all ${isDark ? 'bg-slate-800 border-slate-700 focus:ring-indigo-500/20' : 'bg-slate-50 border-slate-100 focus:ring-indigo-500/10'}`}
                                />
                            </div>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className={`px-4 py-2.5 rounded-xl border font-bold text-sm cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                            >
                                <option value="">Status: All</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <Link to="/addagent" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25">
                                <UserPlus size={18} /> <span className="hidden sm:inline">Add Agent</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                {loading ? (
                    <LoadingModel loading={true} />
                ) : error || agentList.length === 0 ? (
                    <EmptyStateModel
                        type="custom"
                        title="No Agents Found"
                        message="Adjust your filters or register a new agent to get started."
                        showActionButton={true}
                        actionButtonText="Register Agent"
                        onActionClick={() => navigate('/addagent')}
                    />
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className={`rounded-[2rem] border overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className={isDark ? 'bg-slate-800/50' : 'bg-slate-50'}>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact & HQ</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Designation</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Verification</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/10 dark:divide-slate-800/50">
                                    <AnimatePresence>
                                        {agentList.map((agent) => (
                                            <motion.tr 
                                                key={agent._id} 
                                                layout
                                                className={`group transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <img
                                                                className="h-12 w-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm"
                                                                src={agent.profilePhoto || 'https://via.placeholder.com/150'}
                                                                alt={agent.name}
                                                            />
                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${agent.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm">{agent.name}</p>
                                                            <p className="text-xs text-slate-500 font-medium">UID: {agent._id?.slice(-6).toUpperCase()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold flex items-center gap-1.5"><Mail size={12} className="text-indigo-500" /> {agent.email}</span>
                                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><MapPin size={12} /> {agent.city || 'Remote'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {agent.role || 'Member'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={agent.status}
                                                        onChange={(e) => handleAgentStatusChange(e.target.value, agent._id)}
                                                        className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border-0 cursor-pointer focus:ring-0 ${
                                                            agent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 
                                                            agent.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                                        }`}
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Inactive">Inactive</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <PermissionProtectedAction action="view" module="Team Management">
                                                            <Link to={`/agentdetails/${agent._id}`} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-blue-400 hover:bg-blue-400 hover:text-white' : 'bg-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
                                                                <Eye size={16} />
                                                            </Link>
                                                        </PermissionProtectedAction>
                                                        <PermissionProtectedAction action="update" module="Team Management">
                                                            <Link to={`/updateagent/${agent._id}`} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-emerald-400 hover:bg-emerald-400 hover:text-white' : 'bg-slate-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}>
                                                                <Pencil size={16} />
                                                            </Link>
                                                        </PermissionProtectedAction>
                                                        <PermissionProtectedAction action="delete" module="Team Management">
                                                            <button onClick={() => handleDelete(agent._id)} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-rose-400 hover:bg-rose-400 hover:text-white' : 'bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white'}`}>
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
                        <div className={`px-6 py-5 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-50 bg-slate-50/30'}`}>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Showing {(currentPage - 1) * limit + 1} — {Math.min(currentPage * limit, pagination?.totalItems || 0)} of {pagination?.totalItems || 0}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, pagination?.totalPages || 1))}
                                    disabled={currentPage === pagination?.totalPages}
                                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-30 ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
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