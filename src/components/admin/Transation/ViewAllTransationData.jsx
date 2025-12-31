import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { http } from '../../../axios/axios'
import { 
  DollarSign, Eye, Home, ReceiptIndianRupee, Users, 
  ArrowLeft, MapPin, Calendar, CreditCard, ShieldCheck 
} from 'lucide-react'
import { AuthContext } from '../../../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

const ViewAllTransationData = () => {
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    const getData = async () => {
        try {
            setLoading(true)
            const response = await http.get(`/gettransation/${id}`, { withCredentials: true })
            if (response.data?.success) {
                setTransaction(response.data?.data)
            }
        } catch (error) {
            setError(error.message || "Failed to fetch transaction data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { if (id) getData() }, [id])

    // Helper for Status Badge Colors
    const getStatusStyles = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'confirmed') return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (s === 'pending') return "bg-amber-100 text-amber-700 border-amber-200";
        return "bg-rose-100 text-rose-700 border-rose-200";
    }

    if (loading) return <LoadingState />;
    if (error) return <ErrorState error={error} retry={getData} />;
    if (!transaction) return <EmptyState />;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Navigation */}
                <motion.button
                    whileHover={{ x: -4 }}
                    className="flex items-center text-slate-500 hover:text-indigo-600 font-semibold mb-8 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2" size={18} /> Back to History
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden border border-white"
                >
                    {/* Hero Header */}
                    <div className="bg-slate-900 p-8 md:p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-4 py-1 rounded-full text-xs font-black uppercase border ${getStatusStyles(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                    <span className="text-slate-400 text-sm font-medium">#{transaction._id?.slice(-8)}</span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">Invoice Details</h1>
                                <p className="text-slate-400 mt-2 flex items-center gap-2">
                                    <Calendar size={14} /> Issued on {new Date(transaction.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                                </p>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-4xl md:text-5xl font-black text-indigo-400">₹{transaction.price?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Property Card */}
                            <InfoCard 
                                icon={<Home className="text-indigo-500" />} 
                                title="Property Asset"
                                color="indigo"
                            >
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-slate-800">{transaction.propertyId?.propertyname || 'N/A'}</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Category</span>
                                            <span className="text-slate-800 font-bold uppercase">{transaction.propertyId?.propertytype || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Location</span>
                                            <span className="text-slate-800 font-bold">{transaction.propertyId?.city}, {transaction.propertyId?.state}</span>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Payment Info */}
                            <InfoCard 
                                icon={<CreditCard className="text-emerald-500" />} 
                                title="Payment Method"
                                color="emerald"
                            >
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Method Used</p>
                                        <p className="text-lg font-black text-slate-800 capitalize">{transaction.paymentMethod?.replace('_', ' ')}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                                        <ShieldCheck size={16} /> Secure Bank Transfer
                                    </div>
                                </div>
                            </InfoCard>

                            {/* Agent Card */}
                            <InfoCard 
                                icon={<Users className="text-blue-500" />} 
                                title="Handling Agent"
                                color="blue"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img 
                                        src={transaction.agentId?.avatar || 'https://via.placeholder.com/150'} 
                                        className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50" 
                                        alt="Agent" 
                                    />
                                    <div>
                                        <p className="font-black text-slate-800">{transaction.agentId?.name || 'Staff'}</p>
                                        <p className="text-xs text-slate-500 font-medium">{transaction.agentId?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg w-fit text-[10px] font-black uppercase">
                                    <MapPin size={10} /> {transaction.agentId?.city || 'HQ'}
                                </div>
                            </InfoCard>
                        </div>

                        {/* Commission Breakdown Section */}
                        <div className="mt-12">
                            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <DollarSign className="p-1 bg-indigo-100 text-indigo-600 rounded-lg" />
                                Commission Distribution
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <CommissionTile label="Corporate Admin" amount={transaction.commissions?.admin?.amount} percent={transaction.commissions?.admin?.percentage} color="indigo" />
                                <CommissionTile label="Lead Agent" amount={transaction.commissions?.agent?.amount} percent={transaction.commissions?.agent?.percentage} color="blue" />
                                <CommissionTile label="Field Employee" amount={transaction.commissions?.salesEmployee?.amount} percent={transaction.commissions?.salesEmployee?.percentage} color="emerald" />
                            </div>

                            <div className="mt-6 p-6 bg-slate-900 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Net Service Fee Collected</span>
                                <span className="text-3xl font-black text-white">₹{transaction.totalCommission?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Gallery Section */}
                        {transaction.propertyId?.image?.length > 0 && (
                            <div className="mt-16">
                                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                    <Eye className="p-1 bg-amber-100 text-amber-600 rounded-lg" />
                                    Property Snapshot
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {transaction.propertyId.image.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            className="h-48 rounded-3xl overflow-hidden shadow-lg shadow-slate-200 border-4 border-white"
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="Property" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

// --- Sub Components ---

const InfoCard = ({ icon, title, children, color }) => (
    <motion.div whileHover={{ y: -5 }} className={`p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40`}>
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2.5 rounded-xl bg-${color}-50`}>{icon}</div>
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const CommissionTile = ({ label, amount, percent, color }) => (
    <div className={`p-6 rounded-3xl bg-white border border-slate-100 flex flex-col justify-between h-full shadow-sm`}>
        <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <span className={`px-2 py-1 rounded-md bg-${color}-50 text-${color}-600 text-[10px] font-black`}>{percent}%</span>
        </div>
        <p className={`text-2xl font-black text-slate-800`}>₹{amount?.toLocaleString()}</p>
    </div>
);

const LoadingState = () => (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 gap-4">
        <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-12 w-12 rounded-2xl border-4 border-indigo-500 border-t-transparent shadow-xl shadow-indigo-200"
        />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Processing Ledger...</p>
    </div>
);

const ErrorState = ({ error, retry }) => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center max-w-sm border border-rose-100">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-rose-500" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Sync Error</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{error}</p>
            <button onClick={retry} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors">
                Try Re-Sync
            </button>
        </div>
    </div>
);

const EmptyState = () => (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center opacity-40">
            <ReceiptIndianRupee size={80} className="mx-auto mb-4" />
            <p className="font-black tracking-widest uppercase">No Records Found</p>
        </div>
    </div>
);

export default ViewAllTransationData;