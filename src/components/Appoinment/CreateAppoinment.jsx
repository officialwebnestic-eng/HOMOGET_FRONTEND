import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, MapPin, Video, MessageSquare, Check, Loader2, Sparkles, Star } from 'lucide-react';
import { useToast } from '../../model/SuccessToasNotification';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { http } from '../../axios/axios';

// Success Modal
const SuccessModal = ({ onClose, message }) => (
  <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
      initial={{ scale: 0.8, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.8, y: 20 }}
    >
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{message}</h3>
        <button onClick={onClose} className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Continue
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Placeholder theme hook
const useTheme = () => ({ theme: 'light' });

// Meeting Platforms
const meetingPlatforms = [
  { name: 'Zoom', icon: Video, color: 'from-blue-500 to-blue-600' },
  { name: 'Google Meet', icon: Video, color: 'from-green-500 to-green-600' },
  { name: 'Microsoft Teams', icon: Video, color: 'from-purple-500 to-purple-600' },
  { name: 'Phone Call', icon: MessageSquare, color: 'from-orange-500 to-orange-600' },
  { name: 'In Person', icon: MapPin, color: 'from-indigo-500 to-indigo-600' }
];

const CreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const { theme } = useTheme();
  const { addToast } = useToast();
  const location = useLocation();
  const property = location.state?.property;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Sync date/time with form
  useEffect(() => {
    setValue('date', selectedDate.toISOString().split('T')[0]);
    setValue('time', selectedTime);
  }, [selectedDate, selectedTime, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      propertyId: property?._id || '',
      date: data.date,
      time: data.time,
      notes: data.notes,
      meetingPlatform: selectedPlatform,
    };
    try {
      const res = await http.post('/sheduleappoinment', payload, { withCredentials: true });
      if (res.data?.success) {
        setShowSuccess(true);
      } else {
        addToast(res.data?.message || 'Error', 'error');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Unknown error';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const days = [];
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    for (let i = 1; i <= endDate.getDate(); i++) {
      days.push(new Date(today.getFullYear(), today.getMonth(), i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className={`min-h-screen transition-all  duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30'} py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden`}>
      
      {/* Background Animations */}
      <div className="absolute inset-0 overflow-hidden  pointer-events-none">
        <motion.div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto relative z-10 mt-16">
    <motion.div
  className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 space-y-6 md:space-y-0"
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  {/* Left side */}
  <div className="flex items-start md:items-center space-x-4">
    <div>
      <motion.h1
        className={`text-xl md:text-2xl font-extrabold bg-gradient-to-r ${
          theme === "dark"
            ? "from-blue-400 via-purple-400 to-indigo-400"
            : "from-blue-600 via-purple-600 to-purple-600"
        } bg-clip-text text-transparent leading-tight`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Schedule Appointment
      </motion.h1>

      <motion.p
        className={`text-base md:text-lg mt-2 ${
          theme === "dark" ? "text-gray-400" : "text-gray-600"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Choose your preferred date, time, and meeting platform
      </motion.p>
    </div>
  </div>

  {/* Right side */}
  <motion.div
    className="flex items-center space-x-2 self-start md:self-center"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.6 }}
  >
    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
    <span
      className={`text-sm md:text-base font-medium ${
        theme === "dark" ? "text-gray-300" : "text-gray-600"
      }`}
    >
      Premium Experience
    </span>
  </motion.div>
</motion.div>


        {/* Main Card container */}
        <motion.div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800/80 border border-gray-700/50' : 'bg-white/80 border border-white/20'} backdrop-blur-xl`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="lg:flex min-h-[600px]">
            {/* Left: Calendar & Date/Time */}
            <div className={`lg:w-1/2 p-8 border-b lg:border-b-0 lg:border-r ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              {/* Date & Time Selection */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-8 h-8 text-blue-500 mr-3" />
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Select Date & Time
                  </h2>
                </div>
                {/* Calendar Grid */}
                <div className={`grid grid-cols-7 gap-2 p-4 rounded-xl border ${theme === 'dark' ? 'border-gray-600/50 bg-gray-700/30' : 'border-gray-200/50 bg-gray-50/30'}`}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-500 p-2">{day}</div>
                  ))}
                  {calendarDays.slice(0, 14).map((date, index) => (
                    <motion.button key={index}
                      onClick={() => handleDateSelect(date)}
                      className={`p-2 text-sm rounded-lg transition-all duration-200 ${selectedDate.getDate() === date.getDate()
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : theme === 'dark'
                          ? 'hover:bg-gray-600/50 text-gray-300'
                          : 'hover:bg-blue-50 text-gray-700'
                        }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {date.getDate()}
                    </motion.button>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="mt-6">
                  <label className={`block text-sm font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    Time
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(time => (
                      <motion.button key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-xl font-medium transition-all duration-200 ${selectedTime === time
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : theme === 'dark'
                            ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                            : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border border-gray-200/50'
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <motion.div className={`p-6 rounded-2xl border-2 ${theme === 'dark'
                ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30'
                : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/50'
                } backdrop-blur-sm relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {/* Background shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-indigo-500 mr-3" />
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      Property Details
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    ID: {property?._id || 'N/A'}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Form & Meeting */}
            <div className="lg:w-1/2 p-8 relative">
              {/* Decorative shape */}
              <div className="absolute top-4 left-4 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <SuccessModal onClose={() => { setShowSuccess(false); /* navigate */ }} message="Appointment created successfully!" />
                ) : (
                  <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {/* Header */}
                    <div className="mb-8">
                      <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
                        Meeting Details
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Configure your appointment preferences
                      </p>
                    </div>

                    {/* Meeting Platform */}
                    <div>
                      <label className={`block text-sm font-semibold mb-4 flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <Video className="w-4 h-4 mr-2 text-blue-500" />
                        Meeting Platform
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {meetingPlatforms.map((platform) => {
                          const IconComponent = platform.icon;
                          return (
                            <motion.button key={platform.name}
                              type="button"
                              onClick={() => setSelectedPlatform(platform.name)}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${selectedPlatform === platform.name
                                ? `bg-gradient-to-r ${platform.color} text-white border-transparent shadow-lg`
                                : theme === 'dark'
                                  ? 'border-gray-600/50 bg-gray-700/30 text-gray-300 hover:bg-gray-600/50'
                                  : 'border-gray-200/50 bg-gray-50/30 text-gray-700 hover:bg-gray-100/50'
                                } backdrop-blur-sm`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center">
                                <IconComponent className="w-5 h-5 mr-3" />
                                <span className="font-medium">{platform.name}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className={`block text-sm font-semibold mb-3 flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                        Notes & Instructions
                      </label>
                      <textarea
                        {...register('notes', { required: 'Notes are required' })}
                        rows={4}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 ${theme === 'dark'
                          ? 'border-gray-600/50 bg-gray-700/30 text-white placeholder-gray-400 focus:border-blue-500/50 focus:bg-gray-700/50'
                          : 'border-gray-200/50 bg-white/70 text-gray-900 placeholder-gray-500 focus:border-blue-500/50 focus:bg-white/90'
                          } focus:ring-4 focus:ring-blue-500/20`}
                        placeholder="Share any specific requirements, questions, or details about your visit..."
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <motion.button type="submit" disabled={loading}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25'}`}
                        whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center justify-center relative">
                          {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                          <span className="flex items-center justify-center">
                            {loading ? 'Scheduling...' : <>
                              <Check className="mr-2 h-5 w-5" /> Confirm Appointment
                            </>}
                          </span>
                        </div>
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
              </motion.div>

        </div>
      </div>
    
  );
};

export default CreateAppointment;