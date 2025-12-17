import React, { useState } from 'react';
import { Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetRole from '../hooks/useGetRole'; // your custom hook
import { useForm } from 'react-hook-form';
import { useTheme } from '../context/ThemeContext';
import EmptyStateModel from '../model/EmptyStateModel';
import { useLoading } from '../model/LoadingModel';

const Roles = () => {
  const { theme } = useTheme(); // 'light' or 'dark'
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ roleName: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState(null);
 console.log(roleToUpdate,"thisis a roleto update")
  const { Roles, loading, error, createRole, deleteRole, updateRole, pagination } = useGetRole(currentPage, 5, filters);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const LoadingModel = useLoading({ type: "list", count: 3, showIcon: true });

  const themeStyles = {
    light: {
      background: 'bg-gray-50',
      card: 'bg-white',
      border: 'border-gray-200',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        tertiary: 'text-gray-500',
      },
      input: 'bg-white border-gray-300 focus:border-cyan-500 focus:ring-cyan-500',
      button: {
        primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
        secondary: 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
      },
      table: {
        header: 'from-cyan-600 to-teal-500',
        rowHover: 'hover:bg-gray-50',
        divider: 'divide-gray-200',
      },
      pagination: {
        active: 'bg-cyan-600 text-white',
        inactive: 'bg-white text-gray-700 hover:bg-gray-100',
      },
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      border: 'border-gray-700',
      text: {
        primary: 'text-gray-100',
        secondary: 'text-gray-300',
        tertiary: 'text-gray-400',
      },
      input: 'bg-gray-700 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400 text-white placeholder-gray-400',
      button: {
        primary: 'bg-cyan-700 hover:bg-cyan-600 text-white',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600',
        danger: 'bg-red-700 hover:bg-red-600 text-white',
      },
      table: {
        header: 'from-gray-700 to-gray-600',
        rowHover: 'hover:bg-gray-700/50',
        divider: 'divide-gray-700',
      },
      pagination: {
        active: 'bg-cyan-600 text-white',
        inactive: 'bg-gray-700 text-gray-200 hover:bg-gray-600',
      },
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
    if (window.confirm('Are you sure you want to delete this Role?')) {
      deleteRole(id);
    }
  };

  return (
    <div className={`p-4 md:p-6 w-full mx-auto ${currentTheme.background}`}>
      {/* Header Section */}
      <div className={`rounded-xl shadow-sm border ${currentTheme.card} ${currentTheme.border} overflow-hidden`}>
        {/* Header with Actions */}
        <div className={`p-4 md:p-6 border-b ${currentTheme.border}`}>
          {/* Header Title & Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-cyan-600 to-teal-500 p-4 rounded-lg">
            <div>
              <h2 className={`text-xl md:text-2xl font-semibold ${currentTheme.text.primary}`}>Role Management</h2>
              <p className={`text-sm ${currentTheme.text.tertiary} mt-1`}>{Roles.length} roles in total</p>
            </div>
            {/* Action Buttons & Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
              <button
                onClick={handleOpenModal}
                className={`px-4 py-2 ${currentTheme.button.primary} rounded-lg shadow w-full sm:w-auto`}
              >
                Add Role
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${currentTheme.button.secondary}`}
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>
              {/* Search Input */}
              <div className="relative flex-1 min-w-[150px] w-full">
                <Search
                  size={16}
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={filters.roleName}
                  onChange={handleFilterChange}
                  className={`w-full pl-10 pr-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 ${currentTheme.input}`}
                />
              </div>
            </div>
          </div>
          {/* Show Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 px-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${currentTheme.text.tertiary}`}>Role Name</label>
                <input
                  type="text"
                  name="roleName"
                  placeholder="Role Name"
                  value={filters.roleName}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 ${currentTheme.input}`}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({ roleName: '' })}
                  className={`w-full py-2 text-sm rounded-lg transition ${currentTheme.button.secondary}`}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Loading or Error or Empty or Data Table */}
        {loading ? (
          <LoadingModel loading={true} />
        ) : error ? (
          <div className="p-8 text-center">
            <EmptyStateModel
              title="Error Loading Roles"
              message="It seems like there are no roles available in your search criteria. Please try adjusting your filters or using a different search term."
            />
          </div>
        ) : Roles.length === 0 ? (
          <EmptyStateModel
            title="No Roles Found"
            message="It seems like there are no Roles available in your search criteria. Please try adjusting your filters or using a different search term."
          />
        ) : (
          <div className="overflow-x-auto px-4 sm:px-6">
            <table className="min-w-full rounded-lg">
              <thead className={`bg-gradient-to-r ${currentTheme.table.header}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Role Id</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider xl:table-cell">Role Name</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${currentTheme.table.divider} ${currentTheme.card}`}>
                {Roles.map((role) => (
                  <tr key={role._id} className={currentTheme.table.rowHover}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <div className="min-w-0">
                          <div className={`text-sm font-medium truncate ${currentTheme.text.primary}`}>{role._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap xl:table-cell">
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-800'}`}
                        >
                          {role.roleName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        {/* Update Button */}
                        <button
                          onClick={() => handleOpenUpdateModal(role)}
                          className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-green-400 hover:bg-gray-700/50' : 'text-green-600 hover:bg-green-50'}`}
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(role._id)}
                          className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700/50' : 'text-red-600 hover:bg-red-50'}`}
                          title="Delete"
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

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className={`px-4 md:px-6 py-3 border-t ${currentTheme.border} flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className={`text-sm ${currentTheme.text.tertiary}`}>
              Showing <span className="font-medium">{(currentPage - 1) * 5 + 1}</span> to <span className="font-medium">{Math.min(currentPage * 5, pagination.totalItems)}</span> of <span className="font-medium">{pagination.totalItems}</span> results
            </div>
            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5 || currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center text-sm rounded-md transition ${currentPage === pageNum ? currentTheme.pagination.active : currentTheme.pagination.inactive}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`px-3 py-1.5 flex items-center gap-1 text-sm rounded-md transition ${currentTheme.button.secondary} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${currentTheme.background}`}
          >
            <h3 className="text-xl mb-4 font-semibold text-gray-900 dark:text-gray-100">Add New Role</h3>
            <input
              type="text"
              placeholder="Role Name"
              {...register('roleName', { required: 'Role name is required' })}
              className={`w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 ${currentTheme.input} ${errors.roleName ? 'border-red-500 ring-red-300' : ''}`}
            />
            {errors.roleName && <p className="text-sm text-red-600 mb-2">{errors.roleName.message}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className={`px-4 py-2 ${currentTheme.button.secondary} rounded`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${currentTheme.button.primary} rounded`}
              >
                Add Role
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Update Role Modal */}
      {showUpdateModal && roleToUpdate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${currentTheme.background}`}
          >
            <h3 className="text-xl mb-4 font-semibold text-gray-900 dark:text-gray-100">Update Role</h3>
            <input
              type="text"
              placeholder="Role Name"
              {...register('roleName', { required: 'Role name is required' })}
              className={`w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 ${currentTheme.input} ${errors.roleName ? 'border-red-500 ring-red-300' : ''}`}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCloseUpdateModal}
                className={`px-4 py-2 ${currentTheme.button.secondary} rounded`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${currentTheme.button.primary} rounded`}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Roles;