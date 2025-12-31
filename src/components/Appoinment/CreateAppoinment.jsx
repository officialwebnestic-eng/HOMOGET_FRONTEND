import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Video, MessageSquare, 
  Check, Loader2, Sparkles, ChevronRight, Info, ShieldCheck,
  Globe, Phone, Users, Home
} from 'lucide-react';
import { useToast } from '../../model/SuccessToasNotification';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { http } from '../../axios/axios';

const meetingPlatforms = [
  { name: 'Zoom', icon: Video, desc: 'Digital Tour', color: 'blue' },
  { name: 'Google Meet', icon: Globe, desc: 'Online Meeting', color: 'green' },
  { name: 'Phone Call', icon: Phone, desc: 'Direct Audio', color: 'orange' },
  { name: 'In Person', icon: Users, desc: 'Physical Visit', color: 'indigo' }
];

const CreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedPlatform, setSelectedPlatform] = useState('In Person');
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  const isDark = true; // Forcing dark for luxury feel, but can be dynamic

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

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white py-12 px-4 relative overflow-hidden font-sans">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-white transition-colors mb-4 text-sm font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Listing
            </button>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 italic font-serif">
                Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Viewing.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">Finalize your private tour for our premium property collection.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden md:flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
            <ShieldCheck className="text-emerald-400 w-6 h-6" />
            <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Secure Booking</p>
                <p className="text-xs font-medium">Encrypted & Private</p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Form Section */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
                className="bg-[#111114]/80 border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                
                {/* Section 1: When */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                        <h2 className="text-xl font-bold tracking-tight">Preferred Schedule</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Custom Date Scroller/Grid */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Select Date</label>
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(8)].map((_, i) => {
                                    const date = new Date();
                                    date.setDate(date.getDate() + i);
                                    const isSelected = selectedDate.getDate() === date.getDate();
                                    return (
                                        <button key={i} type="button" onClick={() => setSelectedDate(date)}
                                            className={`p-3 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${isSelected ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                                            <span className="text-[10px] font-bold uppercase opacity-60">{date.toLocaleString('default', { weekday: 'short' })}</span>
                                            <span className="text-lg font-black">{date.getDate()}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Custom Time Selection */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-1">Select Time</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['09:00', '11:00', '14:00', '16:00', '18:00', '20:00'].map(time => (
                                    <button key={time} type="button" onClick={() => setSelectedTime(time)}
                                        className={`py-3 rounded-2xl border transition-all text-sm font-bold ${selectedTime === time ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/5'}`}>
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: How */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">2</div>
                        <h2 className="text-xl font-bold tracking-tight">Meeting Channel</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {meetingPlatforms.map((p) => (
                            <button key={p.name} type="button" onClick={() => setSelectedPlatform(p.name)}
                                className={`p-4 rounded-[1.5rem] border text-left transition-all group ${selectedPlatform === p.name ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                                <p.icon className={`w-6 h-6 mb-3 ${selectedPlatform === p.name ? 'text-indigo-600' : 'text-gray-400 group-hover:text-white'}`} />
                                <p className="text-xs font-black uppercase tracking-tighter">{p.name}</p>
                                <p className={`text-[9px] opacity-60 font-bold uppercase ${selectedPlatform === p.name ? 'text-black' : 'text-gray-500'}`}>{p.desc}</p>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section 3: Details */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">3</div>
                        <h2 className="text-xl font-bold tracking-tight">Specific Requirements</h2>
                    </div>
                    <textarea 
                        {...register('notes', { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 min-h-[150px] placeholder:text-gray-600 text-lg transition-all"
                        placeholder="Tell us if you have any specific preferences or requirements for the property tour..."
                    />
                </section>

                <motion.button 
                    type="submit" disabled={loading}
                    className="w-full py-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xl tracking-tighter shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-4 group overflow-hidden relative"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            Finalize Appointment 
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Right Column: Property Mini-Hero */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
                className="bg-[#111114] border border-white/5 rounded-[2.5rem] overflow-hidden sticky top-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                {/* Image & Price Overlay */}
                <div className="h-64 relative group">
                    <img src={property?.image?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="property" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                        <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-white mb-2 inline-block">ID: {property?._id?.slice(-6) || 'N/A'}</span>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{property?.propertyname || 'The Horizon Suite'}</h3>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400"><Home className="w-5 h-5" /></div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">Property Type</p>
                                <p className="text-sm font-bold">{property?.propertytype || 'Luxury Apartment'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] font-bold text-gray-500 uppercase">Investment</p>
                             <p className="text-sm font-black text-indigo-400">₹{property?.price || '2.4 Cr'}</p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>Reserved for {selectedTime} on {selectedDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            <span>{property?.address || 'Sector 62, Noida, India'}</span>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] justify-center">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Exclusive Portfolio Access
                    </div>
                </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-[#0a0a0c]/90 backdrop-blur-2xl" />
            <motion.div 
                className="relative bg-[#111114] border border-white/10 p-12 rounded-[3rem] text-center max-w-md shadow-[0_0_100px_rgba(99,102,241,0.2)]"
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            >
                <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <Check className="w-12 h-12 text-white stroke-[3px]" />
                </div>
                <h2 className="text-3xl font-black mb-4 tracking-tight">Booking Secured</h2>
                <p className="text-gray-400 mb-8 leading-relaxed">Your luxury experience has been scheduled. Our concierge team will reach out shortly to finalize details.</p>
                <button onClick={() => navigate('/dashboard')} className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">
                    View My Appointments
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateAppointment;