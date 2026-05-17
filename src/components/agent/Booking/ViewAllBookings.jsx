import React, { useContext, useState, useEffect } from 'react';
import { 
  Eye, Pencil, Trash2, UserPlus, Search, Plus, Sparkles, 
  Calendar, MapPin, DollarSign, CheckCircle, XCircle, 
  Clock, AlertCircle, Filter, ChevronLeft, ChevronRight,
  Download, Mail, Phone, User, Home, Building, TrendingUp,
  Award, Shield, Wallet, CreditCard, Users, Star
} from 'lucide-react';
import useGetAlllBookings from './../../../hooks/useGetAlllBookings';
import { Link, useNavigate } from 'react-router-dom';
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { toast } from 'react-toastify';
import { http } from '../../../axios/axios';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import PermissionProtectedAction from '../../../Authorization/PermissionProtectedActions';
import EmptyStateModel from '../../../model/EmptyStateModel';
import { useLoading } from '../../../model/LoadingModel';
import { motion, AnimatePresence } from 'framer-motion';

const ViewAllBookings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAgentList, setShowAgentList] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { agentList } = useGetAllAgent();
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const brandColor = "#f59e0b";
  const limit = 8;

  const { BookingList, loading, error, agentBookingData, handleUpdateStatus, deleteBooking } = useGetAlllBookings(currentPage, limit, searchTerm);
  const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 5 });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleConfirmPayment = (booking) => navigate("/confirmBooking", { state: booking });

  const handleStatusChange = async (newStatus, bookingId) => {
    const result = await handleUpdateStatus(newStatus, bookingId);
    if (result.success) toast.success("Booking status updated successfully");
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const result = deleteBooking(bookingId);
      if (result.success) toast.success("Booking record deleted");
    }
  };

  const handleFollowClick = (booking) => {
    setSelectedBooking(booking);
    setShowAgentList(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { icon: <CheckCircle size={12} />, text: 'CONFIRMED', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
      case 'pending':
        return { icon: <Clock size={12} />, text: 'PENDING', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
      case 'cancelled':
        return { icon: <XCircle size={12} />, text: 'CANCELLED', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
      default:
        return { icon: <AlertCircle size={12} />, text: status.toUpperCase(), color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' };
    }
  };

  const filteredBookings = (user.role === "admin" ? BookingList : agentBookingData).filter(booking => {
    if (statusFilter === 'all') return true;
    return booking.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredBookings.length / limit);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * limit, currentPage * limit);

  if (loading) return <LoadingModel loading={true} />;

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${isDark ? 'bg-[#0a0a0c]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <Sparkles size={20} style={{ color: brandColor }} />
                </div>
                <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Booking <span style={{ color: brandColor }}>Ledger</span>
                </h2>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Manage all property bookings and transactions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className={`pl-9 pr-4 py-2.5 rounded-xl text-[10px] font-medium outline-none border transition-all w-full md:w-64 ${
                    isDark ? 'bg-[#11141B] border-white/10 text-white focus:border-amber-500' : 'bg-white border-slate-200 focus:border-amber-500'
                  }`}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  showFilters 
                    ? 'bg-amber-500 text-white' 
                    : `${isDark ? 'bg-[#11141B] text-white border-white/10' : 'bg-white text-slate-700 border-slate-200'} border`
                }`}
              >
                <Filter size={12} /> Filter
              </button>

              <PermissionProtectedAction action="create" module="Booking Management">
                <Link 
                  to="/propertylisting" 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white shadow-md transition-all hover:opacity-90"
                  style={{ backgroundColor: brandColor }}
                >
                  <Plus size={14} /> New Booking
                </Link>
              </PermissionProtectedAction>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#11141B] border-white/10' : 'bg-white border-slate-200'}`}>
                  <div className="flex flex-wrap gap-3">
                    {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                        className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${
                          statusFilter === status
                            ? 'bg-amber-500 text-white'
                            : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status === 'all' ? 'All' : status}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Bookings" 
            value={(user.role === "admin" ? BookingList : agentBookingData).length} 
            icon={<Calendar size={18} />} 
            color="amber" 
            isDark={isDark} 
          />
          <StatCard 
            title="Confirmed" 
            value={(user.role === "admin" ? BookingList : agentBookingData).filter(b => b.status === 'confirmed').length} 
            icon={<CheckCircle size={18} />} 
            color="emerald" 
            isDark={isDark} 
          />
          <StatCard 
            title="Pending" 
            value={(user.role === "admin" ? BookingList : agentBookingData).filter(b => b.status === 'pending').length} 
            icon={<Clock size={18} />} 
            color="amber" 
            isDark={isDark} 
          />
          <StatCard 
            title="Total Value" 
            value={`AED ${(user.role === "admin" ? BookingList : agentBookingData).reduce((sum, b) => sum + (b.propertyId?.price || 0), 0).toLocaleString()}`} 
            icon={<Wallet size={18} />} 
            color="blue" 
            isDark={isDark} 
          />
        </div>

        {/* Bookings Table */}
        {paginatedBookings.length === 0 ? (
          <EmptyStateModel 
            type="bookings"
            title="No Bookings Found"
            message="There are no bookings in the registry at the moment."
            onResetFilters={() => { setSearchTerm(''); setStatusFilter('all'); }}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-[#11141B] border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`${isDark ? 'bg-white/5' : 'bg-slate-50'} border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <th className="px-5 py-4 text-left text-[8px] font-bold uppercase tracking-wider text-slate-500">Client Info</th>
                    <th className="px-5 py-4 text-left text-[8px] font-bold uppercase tracking-wider text-slate-500">Property Details</th>
                    <th className="px-5 py-4 text-left text-[8px] font-bold uppercase tracking-wider text-slate-500">Booking Info</th>
                    <th className="px-5 py-4 text-left text-[8px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-5 py-4 text-right text-[8px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/10' : 'divide-slate-100'}`}>
                  {paginatedBookings.map((booking, idx) => {
                    const statusBadge = getStatusBadge(booking.status);
                    return (
                      <motion.tr 
                        key={booking._id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-amber-500/5 transition-colors duration-300"
                      >
                        {/* Client Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                                {booking.fullName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <button 
                                onClick={() => handleFollowClick(booking)} 
                                className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white shadow-md hover:bg-amber-500 transition-colors"
                              >
                                <UserPlus size={10} className="text-amber-500 hover:text-white" />
                              </button>
                            </div>
                            <div>
                              <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {booking.fullName || 'Guest User'}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Mail size={10} className="text-slate-400" />
                                <p className="text-[9px] text-slate-500">{booking.email || 'No email'}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone size={10} className="text-slate-400" />
                                <p className="text-[9px] text-slate-500">{booking.phone || 'No phone'}</p>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Property Details */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Home size={12} className="text-amber-500" />
                              <p className={`text-[11px] font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                {booking.propertyId?.propertyname || 'Property Name'}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={10} className="text-slate-400" />
                              <p className="text-[9px] text-slate-500">{booking.propertyId?.city || 'Dubai'}, UAE</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Building size={10} className="text-slate-400" />
                              <p className="text-[9px] text-slate-500">{booking.propertyId?.propertytype || 'Property Type'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Booking Info */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <DollarSign size={12} className="text-amber-500" />
                              <p className="text-xs font-bold text-amber-500">
                                AED {booking.propertyId?.price?.toLocaleString() || 0}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={10} className="text-slate-400" />
                              <p className="text-[9px] text-slate-500">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <CreditCard size={10} className="text-slate-400" />
                              <p className="text-[9px] text-slate-500">Ref: {booking._id?.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(e.target.value, booking._id)}
                            className={`text-[8px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border outline-none transition-all cursor-pointer ${statusBadge.color}`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleConfirmPayment(booking)} 
                              className={`p-2 rounded-lg transition-all ${
                                isDark ? 'bg-white/5 text-slate-400 hover:bg-amber-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-amber-500 hover:text-white'
                              }`}
                              title="Edit Booking"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteBooking(booking._id)} 
                              className={`p-2 rounded-lg transition-all ${
                                isDark ? 'bg-white/5 text-slate-400 hover:bg-rose-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-rose-500 hover:text-white'
                              }`}
                              title="Delete Booking"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-5 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/30'}`}>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">
                  Showing {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, filteredBookings.length)} of {filteredBookings.length} bookings
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
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
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                            currentPage === pageNum
                              ? 'bg-amber-500 text-white'
                              : isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-30 ${
                      isDark ? 'border-white/10 hover:bg-white/10' : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Agent Assignment Modal */}
      <AnimatePresence>
        {showAgentList && selectedBooking && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAgentList(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative max-w-md w-full rounded-2xl overflow-hidden ${isDark ? 'bg-[#11141B]' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-lg font-bold">Assign Agent</h3>
                <p className="text-[10px] text-slate-500 mt-1">Select an agent to handle this booking</p>
              </div>
              <div className="p-5 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {agentList?.map((agent) => (
                    <div key={agent._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-500/5 cursor-pointer transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                        {agent.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-[9px] text-slate-500">{agent.email}</p>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[9px] font-bold uppercase">
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
                <button onClick={() => setShowAgentList(false)} className="px-5 py-2 rounded-lg text-slate-500 hover:text-slate-700 text-[10px] font-bold">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, isDark }) => {
  const colorClasses = {
    amber: 'bg-amber-500/10 text-amber-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    blue: 'bg-blue-500/10 text-blue-500',
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl border ${isDark ? 'bg-[#11141B] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-[8px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>
    </motion.div>
  );
};

export default ViewAllBookings; 