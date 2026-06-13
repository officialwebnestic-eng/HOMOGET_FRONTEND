import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Check, X, IndianRupee, Search, Calendar, MapPin, Link as LinkIcon, ChevronLeft, ChevronRight, Phone, Mail, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import usegetAppoinment from './../../hooks/usegetAppoinment';
import { http } from "../../axios/axios";
import { useTheme } from '../../context/ThemeContext';
import PermissionProtectedAction from '../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../model/EmptyStateModel';

const GetAppoinment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [statusInput, setStatusInput] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const limit = 10;
  const { Appointment, loading, error, pagination, refetch, handleDeleteAppointment } = usegetAppoinment(currentPage, limit, searchTerm);

  // Theme classes
  const bgClass = isDark ? "bg-[#0a0a0c]" : "bg-slate-50";
  const cardClass = isDark ? "bg-[#11141B]" : "bg-white";
  const textClass = isDark ? "text-gray-200" : "text-gray-800";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";
  const borderClass = isDark ? "border-gray-800" : "border-gray-200";
  const inputClass = isDark
    ? "bg-[#1A1F2B] text-white border-gray-700 focus:ring-amber-500 focus:border-amber-500"
    : "bg-white text-gray-900 border-gray-200 focus:ring-amber-500 focus:border-amber-500";

  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'confirmed':
        return { 
          color: 'bg-green-500/10 text-green-500 border-green-500/20', 
          icon: <CheckCircle size={10} />,
          label: 'Confirmed'
        };
      case 'complete':
        return { 
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', 
          icon: <CheckCircle size={10} />,
          label: 'Completed'
        };
      case 'cancelled':
        return { 
          color: 'bg-red-500/10 text-red-500 border-red-500/20', 
          icon: <XCircle size={10} />,
          label: 'Cancelled'
        };
      default:
        return { 
          color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', 
          icon: <AlertCircle size={10} />,
          label: 'Pending'
        };
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Update status API call
  const updateAppointmentStatus = async (id, status) => {
    try {
      setUpdatingStatus(true);
      const response = await http.put(`/update-appointment-status/${id}`, { status }, { withCredentials: true });
      
      if (response.data.success) {
        await refetch();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
      return false;
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!newStatus) return;
    await updateAppointmentStatus(id, newStatus);
    setEditingStatusId(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent"></div>
        <p className={`text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-8 rounded-xl border ${cardClass} ${borderClass}`}>
        <EmptyStateModel title="Connection Error" message="Unable to fetch appointment data." />
      </div>
    );
  }

  // Calculate stats
  const totalPending = Appointment.filter(a => a.status?.toLowerCase() === 'pending').length;
  const totalConfirmed = Appointment.filter(a => a.status?.toLowerCase() === 'confirmed').length;
  const totalCompleted = Appointment.filter(a => a.status?.toLowerCase() === 'complete').length;
  const totalCancelled = Appointment.filter(a => a.status?.toLowerCase() === 'cancelled').length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgClass} p-6`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${textClass}`}>
              Appointment <span className="text-amber-500">Management</span>
            </h1>
            <p className={`text-[10px] font-medium ${textMuted} mt-1`}>
              Manage property viewing schedules
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
            <input
              type="text"
              placeholder="Search by name, email, or appointment ID..."
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${inputClass}`}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className={`p-3 rounded-lg border ${cardClass} ${borderClass}`}>
            <p className={`text-[8px] font-bold uppercase tracking-wider ${textMuted}`}>Total</p>
            <p className={`text-xl font-bold ${textClass}`}>{pagination?.totalCount || Appointment.length || 0}</p>
          </div>
          <div className={`p-3 rounded-lg border ${cardClass} ${borderClass}`}>
            <p className={`text-[8px] font-bold uppercase tracking-wider text-amber-500`}>Pending</p>
            <p className={`text-xl font-bold text-amber-500`}>{totalPending}</p>
          </div>
          <div className={`p-3 rounded-lg border ${cardClass} ${borderClass}`}>
            <p className={`text-[8px] font-bold uppercase tracking-wider text-green-500`}>Confirmed</p>
            <p className={`text-xl font-bold text-green-500`}>{totalConfirmed}</p>
          </div>
          <div className={`p-3 rounded-lg border ${cardClass} ${borderClass}`}>
            <p className={`text-[8px] font-bold uppercase tracking-wider text-blue-500`}>Completed</p>
            <p className={`text-xl font-bold text-blue-500`}>{totalCompleted}</p>
          </div>
          <div className={`p-3 rounded-lg border ${cardClass} ${borderClass}`}>
            <p className={`text-[8px] font-bold uppercase tracking-wider text-red-500`}>Cancelled</p>
            <p className={`text-xl font-bold text-red-500`}>{totalCancelled}</p>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-xl border overflow-hidden ${cardClass} ${borderClass}`}>
          <div className="overflow-x-auto">
            {Appointment.length === 0 ? (
              <div className="p-12 text-center">
                <EmptyStateModel title="No Appointments" message="No appointment requests found." />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className={`bg-amber-500/5 ${borderClass}`}>
                  <tr>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Appt ID</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Client</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Contact</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Property Type</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Inquiry</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Date</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Time</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500">Status</th>
                    <th className="px-4 py-3 text-[9px] font-black uppercase tracking-wider text-amber-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderClass}`}>
                  {Appointment.map((appointment) => {
                    const statusConfig = getStatusConfig(appointment.status);
                    return (
                      <tr key={appointment._id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        {/* ID */}
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono ${textMuted}`}>
                            {appointment.appointmentId?.slice(-8) || 'N/A'}
                          </span>
                        </td>

                        {/* Client */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
                              <User size={12} className="text-amber-500" />
                            </div>
                            <div>
                              <p className={`text-xs font-medium ${textClass}`}>
                                {appointment.name || appointment.user?.firstname || 'N/A'}
                              </p>
                              <p className={`text-[9px] ${textMuted}`}>
                                {appointment.inqueryType?.replace(/_/g, ' ') || 'Consultation'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <Mail size={9} className={textMuted} />
                              <span className={`text-[9px] ${textMuted}`}>{appointment.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={9} className={textMuted} />
                              <span className={`text-[9px] ${textMuted}`}>{appointment.phone || 'N/A'}</span>
                            </div>
                          </div>
                        </td>

                        {/* Property Type */}
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-medium ${textClass}`}>
                            {appointment.propertyType || 'Not specified'}
                          </span>
                          {appointment.location && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin size={8} className={textMuted} />
                              <span className={`text-[8px] ${textMuted}`}>{appointment.location}</span>
                            </div>
                          )}
                        </td>

                        {/* Inquiry Type */}
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500`}>
                            {appointment.inqueryType?.replace(/_/g, ' ') || 'Consultation'}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={9} className="text-amber-500" />
                            <span className={`text-[9px] ${textClass}`}>
                              {appointment.date || 'TBD'}
                            </span>
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Clock size={9} className="text-amber-500" />
                            <span className={`text-[9px] ${textMuted}`}>
                              {appointment.time || 'TBD'}
                            </span>
                          </div>
                        </td>

                        {/* Status - Dropdown */}
                        <td className="px-4 py-3">
                          <select
                            value={appointment.status || 'pending'}
                            onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                            disabled={updatingStatus}
                            className={`px-2 py-1 rounded text-[9px] font-medium border cursor-pointer ${inputClass} ${statusConfig.color}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="complete">Complete</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                         </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <PermissionProtectedAction action="delete" module="Appoinment Management">
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this appointment?')) {
                                  handleDeleteAppointment(appointment._id);
                                }
                              }} 
                              className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </PermissionProtectedAction>
                         </td>
                       </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination?.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className={`text-[9px] font-medium ${textMuted}`}>
              Showing {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, pagination.totalCount)} of {pagination.totalCount} appointments
            </p>
            
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <ChevronLeft size={14} />
              </button>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
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
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-amber-500 text-black shadow-sm'
                        : isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                className={`p-1.5 rounded-lg transition-all disabled:opacity-30 ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>  
        )}
      </div>
    </div>
  );
};

export default GetAppoinment;