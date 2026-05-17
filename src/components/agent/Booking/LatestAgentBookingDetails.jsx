import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from '../../../axios/axios';
import { Home, ReceiptIndianRupee, Users, ArrowLeft, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const LatestAgentBookingDetails = () => {
    const [transaction, setTransaction] = useState(null);
    const { id } = useParams();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const brandGold = "#C5A059";

    useEffect(() => {
        const fetch = async () => {
            const res = await http.get(`/getBookingDetails/${id}`, { withCredentials: true });
            if (res.data?.success) setTransaction(res.data.data);
        };
        if (id) fetch();
    }, [id]);

    if (!transaction) return null;

    return (
        <div className={`min-h-screen p-10 transition-colors duration-700 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto">
                <button onClick={() => window.history.back()} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10"><ArrowLeft size={16}/> Back to Dashboard</button>
                
                <div className={`rounded-[3rem] border overflow-hidden ${isDark ? 'bg-[#161B26] border-white/5' : 'bg-white border-slate-100 shadow-xl'}`}>
                    <div className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles size={20} style={{ color: brandGold }} />
                                <h1 className={`text-3xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Asset <span style={{ color: brandGold }}>Brief.</span></h1>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">REF: {transaction._id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Settlement Status</p>
                            <span className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full bg-[#C5A059]/10" style={{ color: brandGold }}>{transaction.status}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x border-white/5">
                        {/* Section 1: Asset */}
                        <div className="p-10 space-y-6">
                            <div className="flex items-center gap-3"><Home size={18} style={{ color: brandGold }} /><h3 className="text-[10px] font-black uppercase tracking-widest">Property Information</h3></div>
                            <div className="space-y-4">
                                <Detail label="Name" value={transaction.propertyId?.propertyname} isDark={isDark} />
                                <div className="pt-4 border-t border-dashed border-white/10">
                                    <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Asset Value</p>
                                    <p className="text-2xl font-black italic tracking-tighter" style={{ color: brandGold }}>AED {transaction.propertyId?.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Financials */}
                        <div className="p-10 space-y-6">
                            <div className="flex items-center gap-3"><ReceiptIndianRupee size={18} style={{ color: brandGold }} /><h3 className="text-[10px] font-black uppercase tracking-widest">Financial Records</h3></div>
                            <div className="space-y-4">
                                <Detail label="Settlement Date" value={new Date(transaction.createdAt).toLocaleDateString()} isDark={isDark} />
                                <Detail label="Method" value={transaction.paymentMethod} isDark={isDark} />
                                <Detail label="Reference" value={transaction.transactionId || 'Pending'} isDark={isDark} />
                            </div>
                        </div>

                        {/* Section 3: Custodian */}
                        <div className="p-10 space-y-6">
                            <div className="flex items-center gap-3"><Users size={18} style={{ color: brandGold }} /><h3 className="text-[10px] font-black uppercase tracking-widest">Assigned Custodian</h3></div>
                            <div className="flex items-center gap-4">
                                <img src={transaction.agentId?.profilePhoto} className="w-12 h-12 rounded-2xl border border-white/10" alt="" />
                                <div>
                                    <p className="text-xs font-black uppercase tracking-tight">{transaction.agentId?.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500">{transaction.agentId?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Detail = ({ label, value, isDark }) => (
    <div><p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">{label}</p><p className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{value || '—'}</p></div>
);

export default LatestAgentBookingDetails;