import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../../../axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Calendar, User, Phone, Mail, ArrowLeft, CheckCircle, MapPin, Landmark, ArrowUpRight, Sparkles } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";
import { motion } from "framer-motion";

const CreateBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;
  const { user, isAuthenticated } = useContext(AuthContext);
  const [bookingId, setBookingId] = useState(null);
  const { addToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  // Brand Color Tokens (Matching your Advisor Sync UI)
  const brandOrange = "amber-500";
  const brandGreen = "#00C853";

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
    <div className={`min-h-screen pt-32 pb-20 px-4 transition-colors duration-700 ${isDark ? 'bg-[#0B0F17]' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate(-1)}
            className={`group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-black'}`}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Registry
          </button>
          
          <h1 className={`text-2xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
            Private <span style={{ color: brandOrange }}>Viewing.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Property Visual Summary */}
          <div className="lg:col-span-5 space-y-8 sticky top-32">
            <div className={`relative group overflow-hidden rounded-[2rem] border ${isDark ? 'border-white/10 shadow-2xl bg-[#111827]' : 'border-slate-100'}`}>
              <Swiper
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                modules={[Autoplay, Pagination]}
                className="w-full aspect-square"
              >
                {property?.image?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img src={img} alt="Property" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="absolute top-6 left-6 z-10">
                <span style={{ backgroundColor: brandOrange }} className="px-5 py-2 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md shadow-xl">
                  {property?.propertytype}
                </span>
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${isDark ? 'bg-[#111827] border-white/10 shadow-2xl' : 'bg-white border-slate-100'}`}>
              <h2 className={`text-2xl font-black italic tracking-tighter mb-3 leading-none ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                {property?.propertyname}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                <MapPin size={14} style={{ color: brandOrange }} />
                {property?.city}, {property?.state}
              </div>
              
              <div className={`flex items-end justify-between pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-50'}`}>
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Listed Valuation</p>
                  <p className="text-3xl font-black italic tracking-tighter" style={{ color: brandOrange }}>
                    AED {property?.price?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Modern Booking Form */}
          <div className="lg:col-span-7">
            <div className={`p-10 md:p-14 rounded-[2.5rem] border relative overflow-hidden transition-all duration-500 ${isDark ? 'bg-[#111827] border-white/10 shadow-2xl' : 'bg-white border-slate-100'}`}>
              
              {bookingId ? (
                /* SUCCESS STATE - Using Brand Green */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full mb-10" style={{ backgroundColor: brandGreen }}>
                    <CheckCircle size={48} className="text-white" strokeWidth={2} />
                  </div>
                  <h2 className={`text-4xl font-black italic tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    Sync <span style={{ color: brandGreen }}>Successful.</span>
                  </h2>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-12">
                    Your request has been logged into our internal registry.
                  </p>
                  <button onClick={() => navigate("/")} style={{ backgroundColor: brandOrange }} className="px-12 py-5 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em]">
                    Back to Inventory
                  </button>
                </motion.div>
              ) : (
                /* FORM STATE */
                <>
                  <div className="mb-14">
                    <h2 className={`text-4xl font-black italic tracking-tighter ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
                      Property <span style={{ color: brandOrange }}>Registry.</span>
                    </h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Schedule Private Access</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Client Identity</label>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            {...register("fullName", { required: "Required" })}
                            className={`w-full pl-14 pr-6 py-4 rounded-xl border text-xs font-bold tracking-widest outline-none transition-all ${isDark ? 'bg-[#0B0F17] border-white/10 text-white focus:border-[#FF9900]' : 'bg-slate-50 border-slate-200 focus:border-[#FF9900]'}`}
                            placeholder="NAME"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            {...register("email", { required: "Required" })}
                            className={`w-full pl-14 pr-6 py-4 rounded-xl border text-xs font-bold tracking-widest outline-none transition-all ${isDark ? 'bg-[#0B0F17] border-white/10 text-white focus:border-[#FF9900]' : 'bg-slate-50 border-slate-200 focus:border-[#FF9900]'}`}
                            placeholder="EMAIL"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Contact</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            {...register("phone", { required: "Required" })}
                            className={`w-full pl-14 pr-6 py-4 rounded-xl border text-xs font-bold tracking-widest outline-none transition-all ${isDark ? 'bg-[#0B0F17] border-white/10 text-white focus:border-[#FF9900]' : 'bg-slate-50 border-slate-200 focus:border-[#FF9900]'}`}
                            placeholder="PHONE"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Viewing Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <input
                            type="date"
                            {...register("date", { required: "Required" })}
                            className={`w-full pl-14 pr-6 py-4 rounded-xl border text-xs font-bold tracking-widest outline-none transition-all ${isDark ? 'bg-[#0B0F17] border-white/10 text-white focus:border-[#FF9900]' : 'bg-slate-50 border-slate-200 focus:border-[#FF9900]'}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Message</label>
                      <textarea
                        {...register("message")}
                        rows="4"
                        className={`w-full p-6 rounded-2xl border text-xs font-bold tracking-widest outline-none transition-all resize-none ${isDark ? 'bg-[#0B0F17] border-white/10 text-white focus:border-[#FF9900]' : 'bg-slate-50 border-slate-200 focus:border-[#FF9900]'}`}
                        placeholder="ADDITIONAL REQUIREMENTS..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-5 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-xl shadow-2xl transition-all flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98]"
                      style={{ backgroundColor: brandGreen }}
                    >
                      Push Registry <ArrowUpRight size={18} />
                    </button>
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