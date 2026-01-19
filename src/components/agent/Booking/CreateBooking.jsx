import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../../../axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Calendar, User, Phone, Mail, ArrowLeft, CheckCircle, MapPin, Landmark, ArrowUpRight } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";
import { motion } from "framer-motion";

const CreateBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;
  const { user, isAuthenticated } = useContext(AuthContext);
  const { theme } = useTheme();
  const [bookingId, setBookingId] = useState(null);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("fullName", `${user.firstname} ${user.lastname || ""}`.trim());
      setValue("email", user.email);
    }
  }, [isAuthenticated, user, setValue]);

  const onSubmit = async (data) => {
    if (!property?._id) {
      toast.error("Property information missing.");
      return;
    }

    const payload = { 
      ...data, 
      propertyId: property._id, 
      agentId: property.agentId,
      userId: user?.id 
    };

    try {
      const response = await http.post("/booking", payload);
      if (response.data.success) {
        addToast("Booking request sent successfully!", "success");
        setBookingId(response.data.booking?._id || "success");
        reset();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal server error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 pt-32 pb-20 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Property
          </button>
          
          <div className="hidden md:block h-[1px] flex-1 mx-8 bg-slate-200 dark:bg-white/10" />
          
          <h1 className="text-xl font-black text-slate-900 dark:text-white italic">
            Secure <span className="text-amber-500 text-2xl">Viewing</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Property Visual Summary */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
              <Swiper
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                modules={[Autoplay, Pagination]}
                className="w-full aspect-[4/5]"
              >
                {property?.image?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt="Property" className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  {property?.propertytype}
                </span>
              </div>
            </div>

            <div className="p-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                {property?.propertyname}
              </h2>
              <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-6">
                <MapPin size={16} className="text-amber-500" />
                {property?.city}, {property?.state}
              </div>
              
              <div className="flex items-end justify-between py-6 border-t border-slate-100 dark:border-white/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Asking Price</p>
                  <p className="text-3xl font-black text-amber-500 italic">
                    AED {property?.price?.toLocaleString()}
                  </p>
                </div>
                <Landmark size={32} className="text-slate-200 dark:text-white/5" />
              </div>
            </div>
          </div>

          {/* RIGHT: Modern Booking Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden">
              
              {/* Decorative Blur */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              {bookingId ? (
                /* SUCCESS STATE */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500 rounded-full mb-8 shadow-2xl shadow-amber-500/20">
                    <CheckCircle size={48} className="text-black" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Request Received</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                    Our luxury property consultants will contact you within 24 hours to finalize your exclusive tour.
                  </p>
                  <button 
                    onClick={() => navigate("/")}
                    className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Explore More Collections
                  </button>
                </motion.div>
              ) : (
                /* FORM STATE */
                <>
                  <div className="mb-12">
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Schedule a <span className="text-amber-500 italic">Tour</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Please provide your details for a personalized viewing experience.</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Name */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                          <input
                            {...register("fullName", { required: "Full name is required" })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-amber-500/50 font-bold dark:text-white transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.fullName && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.fullName.message}</span>}
                      </div>

                      {/* Email */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Contact Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                          <input
                            {...register("email", { required: "Email is required" })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-amber-500/50 font-bold dark:text-white transition-all"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                          <input
                            {...register("phone", { required: "Phone number is required" })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-amber-500/50 font-bold dark:text-white transition-all"
                            placeholder="+971 -- --- ----"
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Preferred Date</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            {...register("date", { required: "Please select a date" })}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-amber-500/50 font-bold dark:text-white transition-all cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Additional Requirements</label>
                      <textarea
                        {...register("message")}
                        rows="4"
                        className="w-full p-6 rounded-[2rem] bg-slate-50 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-amber-500/50 font-bold dark:text-white transition-all resize-none"
                        placeholder="Tell us about your specific preferences..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-6 bg-amber-500 text-black font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      Confirm Selection <ArrowUpRight size={20} />
                    </button>
                    
                    <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Your data is protected under UAE Federal Decree-Law No. 45
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;