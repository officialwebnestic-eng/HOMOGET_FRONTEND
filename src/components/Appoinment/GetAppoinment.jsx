import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Check, X, IndianRupee, Search, Calendar, MapPin, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import usegetAppoinment from './../../hooks/usegetAppoinment';
import formatToLocalDateTime from '../../utils/DateConverter';
import { http } from "../../axios/axios";
import { useTheme } from '../../context/ThemeContext';
import PermissionProtectedAction from '../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../model/EmptyStateModel';

const GetAppoinment = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMeetingLinkId, setEditingMeetingLinkId] = useState(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState('');
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [statusInput, setStatusInput] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const limit = 10;
  const { Appointment, loading, error, pagination, refetch, handleDeleteAppointment } = usegetAppoinment(currentPage, limit, searchTerm);

  // --- HOMOGET BRAND TOKENS ---
  const brandGold = "#C5A059";
  const bgColor = isDark ? "bg-[#0F1219]" : "bg-[#F9FAFB]";
  const cardBg = isDark ? "bg-[#1A1F2B]" : "bg-white";
  const textColor = isDark ? "text-white" : "text-[#1A1A1A]";
  const subTextColor = isDark ? "text-slate-400" : "text-slate-500";
  const borderColor = isDark ? "border-white/5" : "border-slate-200";

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEditMeetingLink = (id, currentLink) => {
    setEditingMeetingLinkId(id);
    setMeetingLinkInput(currentLink || '');
  };

  const saveMeetingLink = async (id) => {
    try {
      await http.put(`/appoinmentupdate/${id}`, { meetingLink: meetingLinkInput });
      setEditingMeetingLinkId(null);
      refetch();
    } catch (err) {
      alert('Failed to update meeting link');
    }
  };

  const saveStatus = async (id) => {
    try {
      await http.put(`/statusupdate/${id}`, { status: statusInput });
      setEditingStatusId(null);
      refetch();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Synchronizing Schedule...</p>
      </div>
    );

  if (error)
    return (
      <div className={`p-8 rounded-[2rem] border ${cardBg} ${borderColor}`}>
        <EmptyStateModel title="Connection Error" message="Unable to fetch appointment data from the server." />
      </div>
    );

  return (
    <div className={`min-h-screen transition-all duration-500 ${bgColor}`}>
      
      {/* Header & Luxury Search Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className={`${textColor} text-3xl md:text-5xl font-bold tracking-tighter uppercase italic`}>
            Property <span style={{ color: brandGold }}>Viewings</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-[2px] w-8" style={{ backgroundColor: brandGold }} />
            <p className={`${subTextColor} text-[10px] font-bold uppercase tracking-[0.3em]`}>Schedule & Link Management</p>
          </div>
        </div>

        <div className="relative w-full lg:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C5A059] transition-colors" />
          <input
            type="text"
            placeholder="Search Registry..."
            className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none border transition-all ${isDark ? 'bg-[#1A1F2B] border-white/10 text-white focus:border-[#C5A059]' : 'bg-white border-slate-200 text-slate-900 focus:shadow-xl'}`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl ${cardBg} ${borderColor}`}>
        <div className="w-full overflow-x-auto">
          {Appointment.length === 0 ? (
            <div className="p-20 text-center">
              <EmptyStateModel type="Appointments" title="No Results Found" message="Refine your search parameters to find specific viewings." />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDark ? "bg-white/5" : "bg-slate-900"}>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70">Ref ID</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70">Property Details</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70">Investor</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70">Schedule</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70">Virtual Access</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70 text-center">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-white/70 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
                {Appointment.map((appointment) => (
                  <tr key={appointment._id} className={`${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'} transition-colors`}>
                    {/* ID */}
                    <td className={`px-6 py-6 text-xs font-mono tracking-tighter ${subTextColor}`}>
                      #{appointment.appointmentId}
                    </td>

                    {/* Property Card Style */}
                    <td className="px-6 py-6 min-w-[240px]">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border-2 border-[#C5A059]/20 shadow-lg">
                          {appointment.property?.images?.[0] ? (
                            <img src={appointment.property.images[0]} alt="Prop" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[#C5A059]"><MapPin size={18} /></div>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-black uppercase tracking-tight ${textColor}`}>{appointment.property.propertytype}</p>
                          <p style={{ color: brandGold }} className="text-xs font-bold flex items-center">
                            <IndianRupee size={12} className="mr-0.5" />
                            {appointment.property?.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-6">
                      <p className={`text-sm font-bold ${textColor}`}>{appointment.user.firstname}</p>
                      <p className={`text-[10px] uppercase font-bold opacity-40 ${textColor}`}>{appointment.user.email}</p>
                    </td>

                    {/* Schedule */}
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-2 text-xs font-bold ${textColor}`}>
                          <Calendar size={14} style={{ color: brandGold }} />
                          {formatToLocalDateTime(appointment.date)}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>
                          via {appointment.meetingPlatform}
                        </span>
                      </div>
                    </td>

                    {/* Meeting Link - Luxury Edit Flow */}
                    <td className="px-6 py-6">
                      {editingMeetingLinkId === appointment._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={meetingLinkInput}
                            onChange={(e) => setMeetingLinkInput(e.target.value)}
                            className={`px-3 py-2 rounded-xl text-xs outline-none border-2 border-[#C5A059] ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}
                          />
                          <button onClick={() => saveMeetingLink(appointment._id)} className="p-2 text-emerald-500 hover:scale-110"><Check size={18} /></button>
                          <button onClick={() => setEditingMeetingLinkId(null)} className="p-2 text-rose-500 hover:scale-110"><X size={18} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {appointment.meetingLink ? (
                            <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" 
                               className="p-2.5 rounded-xl bg-[#C5A059]/10 text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-all shadow-sm">
                              <LinkIcon size={16} />
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold uppercase text-slate-600">No Access Set</span>
                          )}
                          <PermissionProtectedAction action="view" module="Appoinment Management">
                            <button onClick={() => handleEditMeetingLink(appointment._id, appointment.meetingLink)}
                                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'} ${subTextColor}`}>
                              <Pencil size={14} />
                            </button>
                          </PermissionProtectedAction>
                        </div>
                      )}
                    </td>

                    {/* Status Select */}
                    <td className="px-6 py-6 text-center">
                      {editingStatusId === appointment._id ? (
                        <select
                          value={statusInput}
                          onChange={(e) => setStatusInput(e.target.value)}
                          onBlur={() => setEditingStatusId(null)}
                          autoFocus
                          className="bg-black text-[#C5A059] border border-[#C5A059] rounded-lg px-2 py-1 text-[10px] font-bold uppercase"
                        >
                          {['pending', 'Confirmed', 'cancelled', 'complete'].map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex flex-col items-center gap-1 group">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            appointment.status === 'Confirmed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                            appointment.status === 'pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                            'border-rose-500/30 text-rose-500 bg-rose-500/5'
                          }`}>
                            {appointment.status}
                          </span>
                          <PermissionProtectedAction action="update" module="Appoinment Management">
                            <button onClick={() => { setEditingStatusId(appointment._id); setStatusInput(appointment.status); }}
                                    className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-[#C5A059] transition-opacity">Change</button>
                          </PermissionProtectedAction>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-2">
                         <PermissionProtectedAction action="delete" module="Appoinment Management">
                          <button onClick={() => handleDeleteAppointment(appointment._id)}
                                  className="p-3 rounded-2xl hover:bg-rose-500/10 text-rose-500 transition-all">
                            <Trash2 size={20} />
                          </button>
                        </PermissionProtectedAction>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Luxury Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between mt-10 px-4 md:px-10">
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>
            Page <span style={{ color: brandGold }}>{currentPage}</span> of {pagination.totalPages} • Registry Count {pagination.totalCount}
          </p>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-3 rounded-xl border transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} disabled:opacity-20`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-2">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-xl text-xs font-black transition-all border ${
                      currentPage === pageNum 
                      ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-lg shadow-[#C5A059]/20' 
                      : isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className={`p-3 rounded-xl border transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-100'} disabled:opacity-20`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAppoinment;