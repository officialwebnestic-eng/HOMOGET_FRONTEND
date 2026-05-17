import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Calendar, Clock, MapPin, Video, MessageSquare, 
  Check, Loader2, Sparkles, ChevronRight, ShieldCheck,
  Globe, Phone, Users, Home, Building2
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useToast } from "../../../model/SuccessToasNotification";
import { useTheme } from "../../../context/ThemeContext";
import { http } from "../../../axios/axios";


const meetingPlatforms = [
  { name: 'In Person', icon: Users, desc: 'Physical Visit' },
  { name: 'Zoom', icon: Video, desc: 'Digital Tour' },
  { name: 'Google Meet', icon: Globe, desc: 'Online Meeting' },
  { name: 'Phone Call', icon: Phone, desc: 'Direct Audio' }
];

const CreateAdminAppointment = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedPlatform, setSelectedPlatform] = useState('In Person');
  
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    setValue('date', selectedDate.toISOString().split('T')[0]);
    setValue('time', selectedTime);
  }, [selectedDate, selectedTime, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await http.post('/sheduleappoinment', {
        propertyId: property?._id,
        date: data.date,
        time: data.time,
        notes: data.notes,
        meetingPlatform: selectedPlatform,
      }, { withCredentials: true });
      if (res.data?.success) setShowSuccess(true);
    } catch (error) {
      addToast(error.response?.data?.message || 'Error scheduling', 'error');
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 block";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0F1219]" : "bg-slate-50"} py-12 px-4 transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto">
        
        {/* --- LUXURY HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-[#C5A059] transition-colors mb-6 text-[10px] font-black uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Estate
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[1.5px] bg-[#C5A059]"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C5A059]">Bespoke Concierge</span>
            </div>
            <h1 className={`text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] ${isDark ? "text-white" : "text-[#161B26]"}`}>
                Request A <br />
                <span className="italic font-serif text-[#C5A059] capitalize tracking-normal">Private Tour.</span>
            </h1>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6 border-l border-slate-200 pl-8 h-20">
             <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Availability</p>
                <p className={`text-sm font-black ${isDark ? "text-white" : "text-[#161B26]"}`}>Priority Confirmed</p>
             </div>
             <ShieldCheck className="text-[#C5A059] w-8 h-8 opacity-50" />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* --- LEFT: BOOKING FORM --- */}
          <div className="lg:col-span-8">
            <motion.div 
                className={`${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-200"} border rounded-[3rem] p-8 md:p-12 shadow-2xl`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                
                {/* 1. Date Selection */}
                <section>
                    <label className={labelStyle}>01. Select Your Date</label>
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                        {[...Array(7)].map((_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const isSelected = selectedDate.getDate() === date.getDate();
                            return (
                                <button key={i} type="button" onClick={() => setSelectedDate(date)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${
                                      isSelected 
                                      ? 'bg-[#C5A059] border-[#C5A059] text-white shadow-xl scale-105' 
                                      : `${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"} hover:border-[#C5A059]/50`
                                    }`}>
                                    <span className={`text-[8px] font-black uppercase ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                                      {date.toLocaleString('default', { weekday: 'short' })}
                                    </span>
                                    <span className="text-lg font-black">{date.getDate()}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Time & Platform Selection */}
                <div className="grid md:grid-cols-2 gap-10">
                    <section>
                        <label className={labelStyle}>02. Preferred Time</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['09:00', '11:00', '14:00', '16:00', '18:00', '20:00'].map(time => (
                                <button key={time} type="button" onClick={() => setSelectedTime(time)}
                                    className={`py-3 rounded-xl border text-[11px] font-black transition-all ${
                                      selectedTime === time 
                                      ? 'bg-[#161B26] text-white border-[#161B26]' 
                                      : `${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`
                                    }`}>
                                    {time}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <label className={labelStyle}>03. Channel</label>
                        <div className="grid grid-cols-2 gap-2">
                            {meetingPlatforms.map((p) => (
                                <button key={p.name} type="button" onClick={() => setSelectedPlatform(p.name)}
                                    className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                                      selectedPlatform === p.name 
                                      ? 'bg-[#C5A059] text-white border-[#C5A059]' 
                                      : `${isDark ? "bg-white/5 border-white/5 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-600"}`
                                    }`}>
                                    <p.icon size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* 3. Notes */}
                <section>
                    <label className={labelStyle}>04. Personal Requirements</label>
                    <textarea 
                        {...register('notes', { required: true })}
                        className={`w-full rounded-3xl p-6 text-sm outline-none border transition-all min-h-[120px] ${
                          isDark ? "bg-[#0F1219] border-white/5 text-white focus:border-[#C5A059]" : "bg-slate-50 border-slate-200 focus:border-[#C5A059]"
                        }`}
                        placeholder="DISCUSS INVESTMENT OPTIONS, FAMILY-SIZE SUITE PREFERENCES..."
                    />
                </section>

                <button 
                    type="submit" disabled={loading}
                    className="w-full py-6 rounded-2xl bg-[#C5A059] text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#b38f4d] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : "Confirm Reservation"}
                </button>
              </form>
            </motion.div>
          </div>

          {/* --- RIGHT: PROPERTY SUMMARY --- */}
          <div className="lg:col-span-4">
            <div className={`sticky top-8 rounded-[3rem] overflow-hidden border ${isDark ? "bg-[#161B26] border-white/5" : "bg-white border-slate-200"} shadow-xl`}>
                <div className="h-56 relative">
                    <img src={property?.image?.[0]} className="w-full h-full object-cover" alt="property" />
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                        <p className="text-[9px] font-black text-[#161B26] uppercase">₹{property?.price}</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div>
                        <p className="text-[9px] font-black text-[#C5A059] uppercase tracking-widest mb-1">{property?.propertytype}</p>
                        <h3 className={`text-2xl font-black uppercase tracking-tighter leading-none ${isDark ? "text-white" : "text-[#161B26]"}`}>
                          {property?.propertyname}
                        </h3>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-100/10">
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <Clock size={16} className="text-[#C5A059]" />
                            <span>{selectedTime} • {selectedDate.toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <MapPin size={16} className="text-[#C5A059]" />
                            <span className="line-clamp-1">{property?.address}</span>
                        </div>
                    </div>

                    <div className="pt-6">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C5A059]/10 text-[#C5A059] w-fit">
                        <Sparkles size={12} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Elite Portfolio</span>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SUCCESS OVERLAY --- */}
      <AnimatePresence>
        {showSuccess && (
       addToast.success("Appointment Request Sent Successfully","success")
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateAdminAppointment;