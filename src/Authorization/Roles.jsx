import React, { useState } from 'react';
import { Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, ShieldCheck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetRole from '../hooks/useGetRole'; 
import { useForm } from 'react-hook-form';
import { useTheme } from '../context/ThemeContext';
import EmptyStateModel from '../model/EmptyStateModel';
import { useLoading } from '../model/LoadingModel';
 import {motion , AnimatePresence} from "framer-motion";

const Roles = () => {
  const { theme } = useTheme(); 
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ roleName: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState(null);

  const { Roles, loading, error, createRole, deleteRole, updateRole, pagination } = useGetRole(currentPage, 5, filters);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

  // --- HOMOGET BRAND THEME TOKENS ---
  const brandGold = "#C5A059";
  
  const themeStyles = {
    light: {
      background: 'bg-[#F9FAFB]',
      card: 'bg-white',
      border: 'border-slate-200',
      text: {
        primary: 'text-[#1A1A1A]',
        secondary: 'text-slate-600',
        tertiary: 'text-slate-400',
      },
      input: 'bg-white border-slate-200 focus:border-[#C5A059] focus:ring-[#C5A059]',
      button: {
        primary: 'bg-[#C5A059] hover:bg-[#B08E4F] text-white',
        secondary: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white',
      },
      table: {
        header: 'bg-slate-900', // Deep contrast like your site's top bar
        rowHover: 'hover:bg-slate-50',
        divider: 'divide-slate-200',
      }
    },
    dark: {
      background: 'bg-[#0F1219]',
      card: 'bg-[#161B26]',
      border: 'border-white/5',
      text: {
        primary: 'text-white',
        secondary: 'text-slate-400',
        tertiary: 'text-slate-500',
      },
      input: 'bg-[#0F1219] border-white/10 focus:border-[#C5A059] focus:ring-[#C5A059] text-white placeholder-slate-600',
      button: {
        primary: 'bg-[#C5A059] hover:bg-[#B08E4F] text-white',
        secondary: 'bg-[#0F1219] hover:bg-[#1A1F2B] text-slate-300 border-white/10',
        danger: 'bg-rose-700 hover:bg-rose-600 text-white',
      },
      table: {
        header: 'bg-[#1A1F2B]',
        rowHover: 'hover:bg-white/[0.02]',
        divider: 'divide-white/5',
      }
    },
  };

  const currentTheme = themeStyles[theme];

  // Handlers
  const handleOpenModal = () => setShowAddRoleModal(true);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm('Confirm Deletion: This role will be removed from the registry.')) {
      deleteRole(id);
    }
  };

  return (
    <div className={`p-4 md:p-8 w-full mx-auto min-h-screen ${currentTheme.background}`}>
      
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tighter uppercase italic ${currentTheme.text.primary}`}>
            Access <span style={{ color: brandGold }}>Privileges</span>
          </h1>
          <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${currentTheme.text.tertiary} mt-1`}>
            Homoget Property L.L.C • {pagination?.totalItems || 0} Roles Defined
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all hover:scale-[1.02] active:scale-95 ${currentTheme.button.primary} shadow-lg shadow-[#C5A059]/20`}
        >
          <Plus size={16} /> Add New Role
        </button>
      </div>

      {/* Main Table Container */}
      <div className={`rounded-[2rem] border overflow-hidden shadow-2xl ${currentTheme.card} ${currentTheme.border}`}>
        
        {/* Search & Filter Bar */}
        <div className={`p-4 md:p-6 border-b flex flex-wrap gap-4 items-center justify-between ${currentTheme.border}`}>
          <div className="relative flex-1 min-w-[280px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Role Name..."
              value={filters.roleName}
              onChange={handleFilterChange}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl outline-none border transition-all ${currentTheme.input}`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-2xl border flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${currentTheme.button.secondary}`}
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }}
            className={`px-6 py-4 border-b ${currentTheme.border} ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}
          >
            <div className="flex flex-wrap items-end gap-4">
               <div className="flex-1 min-w-[200px]">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-2 block">Role Name</label>
                  <input
                    type="text"
                    name="roleName"
                    value={filters.roleName}
                    onChange={handleFilterChange}
                    className={`w-full px-4 py-2 rounded-xl border outline-none ${currentTheme.input}`}
                  />
               </div>
               <button onClick={() => setFilters({ roleName: '' })} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase ${currentTheme.button.secondary}`}>Clear</button>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="p-12"><LoadingModel loading={true} /></div>
        ) : error ? (
          <div className="p-12 text-center">
            <EmptyStateModel title="Sync Error" message="Unable to fetch roles from the registry." />
          </div>
        ) : Roles.length === 0 ? (
          <div className="p-12"><EmptyStateModel title="No Roles Found" message="Try a different search term." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={currentTheme.table.header}>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">Registry ID</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white">Designation Name</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white">Operations</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${currentTheme.table.divider}`}>
                {Roles.map((role) => (
                  <tr key={role._id} className={`transition-colors ${currentTheme.table.rowHover}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#C5A059]/10">
                          <ShieldCheck size={16} style={{ color: brandGold }} />
                        </div>
                        <span className={`text-xs font-mono tracking-tighter ${currentTheme.text.tertiary}`}>{role._id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        isDark ? 'bg-white/5 text-[#C5A059] border border-white/10' : 'bg-slate-100 text-[#C5A059] border border-slate-200'
                      }`}>
                        {role.roleName}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenUpdateModal(role)}
                          className={`p-2.5 rounded-xl transition-all border ${isDark ? 'border-white/5 hover:bg-emerald-500/10 text-emerald-500' : 'border-slate-100 hover:bg-emerald-50 text-emerald-600'}`}
                          title="Modify"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(role._id)}
                          className={`p-2.5 rounded-xl transition-all border ${isDark ? 'border-white/5 hover:bg-rose-500/10 text-rose-500' : 'border-slate-100 hover:bg-rose-50 text-rose-600'}`}
                          title="Archive"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Block */}
        {pagination && pagination.totalPages > 1 && (
          <div className={`px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'bg-black/20' : 'bg-slate-50/50'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${currentTheme.text.tertiary}`}>
              Registry View <span style={{ color: brandGold }}>{(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, pagination.totalItems)}</span> of {pagination.totalItems}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all ${currentTheme.button.secondary} disabled:opacity-30`}
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-xs font-black transition-all border ${
                    currentPage === pageNum 
                    ? `bg-[#C5A059] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20` 
                    : `${currentTheme.button.secondary}`
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`p-2 rounded-lg border transition-all ${currentTheme.button.secondary} disabled:opacity-30`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals - Simplified Styling */}
      {(showAddRoleModal || showUpdateModal) && (
        <div className="fixed inset-0 bg-[#0F1219]/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onSubmit={handleSubmit(showAddRoleModal ? onSubmit : handleUpdate)}
            className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl ${currentTheme.card} ${currentTheme.border}`}
          >
            <h3 className={`text-2xl font-bold uppercase tracking-tighter italic mb-6 ${currentTheme.text.primary}`}>
              {showAddRoleModal ? 'Create' : 'Modify'} <span style={{ color: brandGold }}>Role</span>
            </h3>
            
            <label className="text-[10px] font-black uppercase tracking-widest text-[#C5A059] mb-2 block">Designation Name</label>
            <input
              type="text"
              autoFocus
              {...register('roleName', { required: 'Name is required' })}
              className={`w-full p-4 rounded-2xl outline-none border transition-all mb-4 ${currentTheme.input}`}
            />
            {errors.roleName && <p className="text-[10px] font-bold text-rose-500 uppercase mt-[-10px] mb-4">{errors.roleName.message}</p>}

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={showAddRoleModal ? handleCloseModal : handleCloseUpdateModal}
                className={`flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest border transition-all ${currentTheme.button.secondary}`}
              >
                Discard
              </button>
              <button
                type="submit"
                className={`flex-1 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${currentTheme.button.primary} shadow-lg shadow-[#C5A059]/20`}
              >
                {showAddRoleModal ? 'Register' : 'Update'}
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
};

export default Roles;