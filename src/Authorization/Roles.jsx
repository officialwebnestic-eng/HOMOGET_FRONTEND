import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, 
  ShieldCheck, Plus, X, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetRole from '../hooks/useGetRole';
import { useForm } from 'react-hook-form';
import { useTheme } from '../context/ThemeContext';
import EmptyStateModel from '../model/EmptyStateModel';
import { useLoading } from '../model/LoadingModel';

const Roles = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ roleName: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Custom hook
  const limit = 5;
  const { Roles, loading, error, createRole, deleteRole, updateRole, pagination } = 
    useGetRole(currentPage, limit, filters);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });
  const brandColor = "#f59e0b"; // amber-500

  // Debounced search – updates filters only after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ roleName: searchInput });
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Modal handlers
  const handleOpenModal = () => {
    reset();
    setShowAddRoleModal(true);
  };
  const handleCloseModal = () => {
    setShowAddRoleModal(false);
    reset();
  };

  const handleOpenUpdateModal = (role) => {
    setRoleToUpdate(role);
    setValue('roleName', role.roleName);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setRoleToUpdate(null);
    reset();
  };

  const onSubmit = (data) => {
    createRole(data);
    handleCloseModal();
  };

  const handleUpdate = (data) => {
    if (roleToUpdate) {
      updateRole(roleToUpdate._id, data);
      handleCloseUpdateModal();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this role permanently? All associated permissions will be removed.')) {
      deleteRole(id);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({ roleName: '' });
    setCurrentPage(1);
  };

  const themeStyles = {
    light: {
      bg: 'bg-slate-50',
      card: 'bg-white',
      border: 'border-slate-200',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
      textTertiary: 'text-slate-400',
      input: 'bg-white border-slate-200 focus:ring-amber-500',
      buttonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      buttonSecondary: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
      buttonDanger: 'bg-rose-600 hover:bg-rose-700 text-white',
      tableHeader: 'bg-slate-100',
      rowHover: 'hover:bg-slate-50',
      divider: 'border-slate-100',
    },
    dark: {
      bg: 'bg-[#0a0a0c]',
      card: 'bg-[#11141B]',
      border: 'border-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-slate-400',
      textTertiary: 'text-slate-500',
      input: 'bg-[#0a0a0c] border-white/10 focus:ring-amber-500 text-white placeholder:text-slate-600',
      buttonPrimary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20',
      buttonSecondary: 'bg-[#11141B] hover:bg-white/5 text-slate-300 border-white/10',
      buttonDanger: 'bg-rose-700 hover:bg-rose-600 text-white',
      tableHeader: 'bg-white/5',
      rowHover: 'hover:bg-white/5',
      divider: 'border-white/5',
    },
  };

  const currentTheme = themeStyles[theme];
  const textColor = currentTheme.textPrimary;

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors ${currentTheme.bg}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${textColor}`}>
              Access <span style={{ color: brandColor }}>Privileges</span>
            </h1>
            <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${currentTheme.textSecondary}`}>
              {pagination?.totalItems || 0} Roles Defined • Homoget Registry
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md ${currentTheme.buttonPrimary}`}
          >
            <Plus size={14} /> Add Role
          </button>
        </div>

        {/* Card */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${currentTheme.card} ${currentTheme.border}`}>
          {/* Search Bar */}
          <div className={`p-4 border-b flex flex-wrap gap-3 items-center justify-between ${currentTheme.border}`}>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search by role name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${currentTheme.buttonSecondary}`}
            >
              <Filter size={14} /> {showFilters ? 'Hide' : 'Filters'}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`overflow-hidden border-b ${currentTheme.border}`}
              >
                <div className="p-4 flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[180px]">
                    <label className={`text-[9px] font-bold uppercase tracking-wider mb-1 block ${currentTheme.textSecondary}`}>
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={filters.roleName}
                      onChange={(e) => setFilters({ roleName: e.target.value })}
                      className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${currentTheme.input}`}
                    />
                  </div>
                  <button
                    onClick={clearFilters}
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${currentTheme.buttonSecondary}`}
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table */}
          {loading ? (
            <div className="p-12"><LoadingModel loading={true} /></div>
          ) : error ? (
            <div className="p-12 text-center">
              <EmptyStateModel title="Error" message="Could not load roles. Please try again later." />
            </div>
          ) : Roles.length === 0 ? (
            <div className="p-12">
              <EmptyStateModel title="No roles found" message="Try a different search term or create a new role." />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`text-[9px] font-bold uppercase tracking-wider border-b ${currentTheme.tableHeader} ${currentTheme.textSecondary}`}>
                    <th className="px-6 py-4">Role ID</th>
                    <th className="px-6 py-4">Role Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${currentTheme.divider}`}>
                  {Roles.map((role) => (
                    <tr key={role._id} className={`transition-colors ${currentTheme.rowHover}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-amber-500/10">
                            <ShieldCheck size={14} className="text-amber-500" />
                          </div>
                          <span className={`text-[11px] font-mono ${currentTheme.textTertiary}`}>
                            {role._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${isDark ? 'bg-white/5 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                          {role.roleName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenUpdateModal(role)}
                            className={`p-2 rounded-lg transition-all ${currentTheme.buttonSecondary}`}
                            title="Edit Role"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(role._id)}
                            className={`p-2 rounded-lg transition-all ${currentTheme.buttonDanger}`}
                            title="Delete Role"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className={`px-6 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${currentTheme.border} ${currentTheme.textSecondary}`}>
              <span className="text-[9px] font-medium">
                Showing {((currentPage - 1) * limit) + 1} – {Math.min(currentPage * limit, pagination.totalItems)} of {pagination.totalItems} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${currentTheme.buttonSecondary}`}
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                          currentPage === pageNum
                            ? 'bg-amber-500 text-white shadow-sm'
                            : currentTheme.buttonSecondary
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                  className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${currentTheme.buttonSecondary}`}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(showAddRoleModal || showUpdateModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-md rounded-2xl border shadow-2xl ${currentTheme.card} ${currentTheme.border}`}
            >
              <form onSubmit={handleSubmit(showAddRoleModal ? onSubmit : handleUpdate)}>
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className={`text-lg font-bold tracking-tight ${currentTheme.textPrimary}`}>
                    {showAddRoleModal ? 'Create New Role' : 'Edit Role'}
                  </h3>
                  <button
                    type="button"
                    onClick={showAddRoleModal ? handleCloseModal : handleCloseUpdateModal}
                    className="p-1 rounded-lg hover:bg-white/10"
                  >
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className={`text-[9px] font-bold uppercase tracking-wider block mb-1.5 ${currentTheme.textSecondary}`}>
                      Role Name
                    </label>
                    <input
                      {...register('roleName', { required: 'Role name is required' })}
                      className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-1 focus:ring-amber-500 transition-all ${currentTheme.input}`}
                      placeholder="e.g., Property Manager"
                    />
                    {errors.roleName && (
                      <p className="text-rose-500 text-[9px] font-medium mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.roleName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t flex gap-3">
                  <button
                    type="button"
                    onClick={showAddRoleModal ? handleCloseModal : handleCloseUpdateModal}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${currentTheme.buttonSecondary}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-md ${currentTheme.buttonPrimary}`}
                  >
                    {showAddRoleModal ? 'Create Role' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Roles;