import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ArrowLeft, Smartphone, MapPin, Sparkles, ArrowUpRight, Landmark } from 'lucide-react';
import { toast } from 'react-toastify';
import { http } from '../../../axios/axios';
import { AuthContext } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentConfirmationForm = () => {
  const navigate = useNavigate();
  const { state: booking } = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const brandGold = "#C5A059";

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const paymentMethod = watch("paymentMethod");

  useEffect(() => setSelectedMethod(paymentMethod), [paymentMethod]);

  const handlePayment = async (bookingId, data) => {
    try {
      setIsSubmitting(true);
      const res = await http.post(`/confirmsale/${bookingId}?price=${booking.propertyId.price}&agentId=${booking.agentId._id}&propertyId=${booking.propertyId._id}`, data, { withCredentials: true });
      if (res.data.success) {
        toast.success("Settlement Confirmed.");
        setTimeout(() => navigate("/viewallbookings"), 2000);
      }
    } catch (error) { toast.error("Transaction Declined."); } finally { setIsSubmitting(false); }
  };

  const methods = [
    { id: 'UPI', name: 'Digital Wallet', icon: <Smartphone size={20} /> },
    { id: 'Credit Card', name: 'Premium Card', icon: <CreditCard size={20} /> },
    { id: 'Net Banking', name: 'Direct Bank Transfer', icon: <Landmark size={20} /> }
  ];

  if (!booking) return null;

  return (
    <div className={`min-h-screen pt-32 pb-20 px-4 transition-colors duration-700 ${isDark ? 'bg-[#0F1219]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-10"><ArrowLeft size={14}/> Abort Settlement</button>
          <div className={`p-12 rounded-[3.5rem] border ${isDark ? 'bg-[#161B26] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={20} style={{ color: brandGold }} />
              <h1 className={`text-4xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Secure <span style={{ color: brandGold }}>Settlement.</span></h1>
            </div>
            <div className="space-y-10">
              <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-[#0F1219] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Valuation</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-400">AED</span>
                  <p className="text-5xl font-black italic tracking-tighter" style={{ color: brandGold }}>{booking.propertyId?.price?.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div><p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Asset Reference</p><p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.propertyId?.propertyname}</p></div>
                <div><p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Location</p><p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.propertyId?.city}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className={`p-10 rounded-[3rem] border ${isDark ? 'bg-[#161B26] border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
            <form onSubmit={handleSubmit((data) => handlePayment(booking._id, data))} className="space-y-8">
              <h2 className="text-xl font-black italic tracking-tighter">Gateway <span style={{ color: brandGold }}>Selection.</span></h2>
              <div className="space-y-3">
                {methods.map((m) => (
                  <label key={m.id} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${selectedMethod === m.id ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-transparent bg-slate-500/5'}`}>
                    <input type="radio" {...register("paymentMethod", { required: true })} value={m.id} className="absolute opacity-0" />
                    <div className="flex items-center gap-4"><div className={`p-3 rounded-xl ${selectedMethod === m.id ? 'bg-[#C5A059] text-white' : 'bg-slate-500/10 text-slate-500'}`}>{m.icon}</div><span className="text-[11px] font-black uppercase tracking-widest">{m.name}</span></div>
                  </label>
                ))}
              </div>
              <button type="submit" disabled={isSubmitting || !selectedMethod} style={{ backgroundColor: brandGold }} className="w-full py-6 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
                {isSubmitting ? "Processing..." : "Confirm Settlement"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentConfirmationForm;