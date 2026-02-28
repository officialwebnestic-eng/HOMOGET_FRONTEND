import React, { useContext, useState } from 'react';
import { Eye, Pencil, Trash2, UserPlus, Search, Plus, Sparkles } from 'lucide-react';
import useGetAlllBookings from './../../../hooks/useGetAlllBookings';
import { Link, useNavigate } from 'react-router-dom';
import useGetAllAgent from "../../../hooks/useGetAllAgent"
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
    const navigate = useNavigate();
    const { agentList } = useGetAllAgent();
    const { user } = useContext(AuthContext);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const brandGold = "#C5A059";
    const limit = 10;

    const { BookingList, loading, error, agentBookingData, handleUpdateStatus, deleteBooking } = useGetAlllBookings(currentPage, limit, searchTerm);
    const LoadingModel = useLoading({ type: "table", count: 1, rows: 5, columns: 4 });

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleConfirmPayment = (booking) => navigate("/confirmBooking", { state: booking });

    const handleStatusChange = async (newStatus, bookingId) => {
        const result = await handleUpdateStatus(newStatus, bookingId);
        if (result.success) toast.success("Registry Updated.");
    };

    const handleDeleteBooking = (bookingId) => {
        if (window.confirm("Authorize permanent deletion?")) {
            const result = deleteBooking(bookingId);
            if (result.success) toast.success("Record Expunged.");
        }
    };

    const handleFollowClick = (booking) => {
        setSelectedBooking(booking);
        setShowAgentList(true);
    };

    if (loading) return <LoadingModel loading={true} />;

    return (
        <div className={`min-h-screen p-6 transition-all duration-700 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto mb-10">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles size={20} style={{ color: brandGold }} />
                            <h2 className={`text-3xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Booking <span style={{ color: brandGold }}>Ledger.</span>
                            </h2>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Dubai Premium Asset Management</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#C5A059] transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="SEARCH REGISTRY..."
                                className={`pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border transition-all w-full md:w-80 ${isDark ? 'bg-[#161B26] border-white/5 text-white focus:border-[#C5A059]/50' : 'bg-white border-slate-200 focus:border-[#C5A059]'}`}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <PermissionProtectedAction action="create" module="Booking Management">
                            <Link to="/propertylisting" className="px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105" style={{ backgroundColor: brandGold }}>
                                + Add Asset
                            </Link>
                        </PermissionProtectedAction>
                    </div>
                </div>
            </div>

            <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#161B26] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className={`${isDark ? 'bg-white/5' : 'bg-slate-50'} border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Principal</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Asset</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Valuation</th>
                                <th className="px-8 py-6 text-left text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Status</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {(user.role === "admin" ? BookingList : agentBookingData).map((booking) => (
                                <tr key={booking._id} className="group hover:bg-[#C5A059]/5 transition-colors duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md grayscale group-hover:grayscale-0 transition-all" src={booking.property?.images?.[0] || 'https://via.placeholder.com/40'} alt="" />
                                                <button onClick={() => handleFollowClick(booking)} className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-lg text-[#C5A059] border border-slate-100"><UserPlus size={10} /></button>
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.fullName}</p>
                                                <p className="text-[10px] font-bold text-slate-500 lowercase">{booking.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{booking.propertyId?.propertyname}</p>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{booking.propertyId?.city}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-[8px] font-black text-slate-400">AED</span>
                                            <p className="text-sm font-black italic tracking-tighter" style={{ color: brandGold }}>
                                                {booking.propertyId?.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select
                                            value={booking.status}
                                            onChange={(e) => handleStatusChange(e.target.value, booking._id)}
                                            className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border outline-none ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="confirmed">CONFIRMED</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleConfirmPayment(booking)} className="p-2.5 rounded-xl bg-slate-500/10 text-slate-500 hover:text-[#C5A059]"><Pencil size={16} /></button>
                                            <button onClick={() => handleDeleteBooking(booking._id)} className="p-2.5 rounded-xl bg-slate-500/10 text-slate-500 hover:text-rose-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default ViewAllBookings;