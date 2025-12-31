import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { motion } from "framer-motion"; // Added for smooth interactions
import { Calendar, Clock, MapPin, Home, User, Mail, Phone, Send, Loader2 } from "lucide-react"; // Modern Icons
import { http } from '../axios/axios';
import { useTheme } from '../context/ThemeContext'; 
import { useToast } from '../model/SuccessToasNotification';

const VirtualTourBookingForm = () => {
    const { theme } = useTheme();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isDark = theme === 'dark';

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleTourBook = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await http.post("/bookingrequest", data);
            if (response.data.success) {
                addToast(response.data.message || "Tour booked successfully!", "success");
                reset(); // Clear form on success
            } else {
                addToast(response.data.error || "Booking failed", "error");
            }
        } catch (error) {
            addToast(error.response?.data?.message || "Internal server error", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Shared Styles
    const inputStyle = `w-full p-3 pl-10 rounded-xl outline-none border-2 transition-all duration-300 ${
        isDark 
        ? 'bg-gray-800/50 border-gray-700 text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10' 
        : 'bg-gray-50 border-gray-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10'
    }`;

    const labelStyle = `flex items-center gap-2 text-sm font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`;

    return (
        <div className={`w-full min-h-screen flex items-center justify-center py-12 px-4 transition-all duration-500 ${isDark ? 'bg-[#0f172a]' : 'bg-slate-50'}`}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-4xl w-full p-8 rounded-[2rem] shadow-2xl ${isDark ? 'bg-gray-900/80 border border-gray-800 backdrop-blur-xl' : 'bg-white'}`}
            >
                <div className="text-center mb-10">
                    <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        Experience Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-lime-500">Future Home</span>
                    </h2>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Schedule a personalized 3D walkthrough with our agents.</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(handleTourBook)}>

                    {/* Full Name */}
                    <div className="relative">
                        <label className={labelStyle}><User size={16}/> Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={inputStyle}
                                {...register("fullname", { required: "Full name is required" })}
                            />
                        </div>
                        {errors.fullname && <span className="text-red-500 text-xs mt-1">{errors.fullname.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <label className={labelStyle}><Mail size={16}/> Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                className={inputStyle}
                                {...register("email", { required: "Email is required" })}
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                    </div>

                    {/* Property Selection */}
                    <div>
                        <label className={labelStyle}><Home size={16}/> Select Property</label>
                        <div className="relative">
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                            <select className={inputStyle} {...register("propertyname", { required: true })}>
                                <option value="">Choose Property</option>
                                <option>Downtown Luxury Villa</option>
                                <option>Oceanview Apartment</option>
                            </select>
                        </div>
                    </div>

                    {/* Location Selection */}
                    <div>
                        <label className={labelStyle}><MapPin size={16}/> Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                            <select className={inputStyle} {...register("propertylocation", { required: true })}>
                                <option value="">Choose Location</option>
                                <option>New York</option>
                                <option>Miami</option>
                            </select>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className={labelStyle}><Calendar size={16}/> Preferred Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                className={inputStyle}
                                {...register("date", { required: true })}
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div>
                        <label className={labelStyle}><Clock size={16}/> Preferred Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                            <input
                                type="time"
                                className={inputStyle}
                                {...register("time", { required: true })}
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                        <label className={labelStyle}>Message (Optional)</label>
                        <textarea
                            placeholder="Tell us about your preferences..."
                            rows="3"
                            className={`${inputStyle} pl-4`}
                            {...register("message")}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 flex justify-center mt-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isSubmitting}
                            type="submit"
                            className={`group flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white transition-all shadow-xl shadow-cyan-500/20 ${
                                isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-lime-500 hover:from-cyan-500 hover:to-lime-400'
                            }`}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VirtualTourBookingForm;