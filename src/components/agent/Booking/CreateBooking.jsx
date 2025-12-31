import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../../../axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Calendar, User, Phone, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

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
    setValue // Used to populate form from Context
  } = useForm();

  // Populate form if user is logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("fullName", `${user.firstname} ${user.lastname || ""}`.trim());
      setValue("email", user.email);
    }
  }, [isAuthenticated, user, setValue]);

  const themeClasses = {
    light: {
      bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen",
      card: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      input: "bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-all duration-300",
      button: "bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-lg transform active:scale-95",
      featureBadge: "bg-blue-100 text-blue-800",
      backButton: "text-blue-600 hover:bg-blue-50"
    },
    dark: {
      bg: "bg-gray-950 min-h-screen",
      card: "bg-gray-900/80 backdrop-blur-xl border border-gray-800 shadow-2xl",
      text: "text-gray-100",
      textSecondary: "text-gray-400",
      input: "bg-gray-800/70 border-gray-700 focus:border-blue-500",
      button: "bg-gradient-to-r from-blue-500 to-indigo-600 transform active:scale-95",
      featureBadge: "bg-gray-800 text-blue-300",
      backButton: "text-blue-400 hover:bg-gray-800"
    }
  };

  const currentTheme = themeClasses[theme];

  const onSubmit = async (data) => {
    // Ensure we don't submit if property is missing
    if (!property?._id) {
      toast.error("Property information missing. Please try again.");
      return;
    }

    const payload = { 
      ...data, 
      propertyId: property._id, 
      agentId: property.agentId,
      userId: user?.id // Track which user made the booking
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
    <div className={`w-full py-8 px-4 sm:px-6 lg:px-8 ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-8 p-2 rounded-lg transition-all ${currentTheme.backButton}`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Property</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Property Summary Section */}
          <div className={`lg:w-1/2 w-full rounded-2xl overflow-hidden h-fit ${currentTheme.card}`}>
            <Swiper
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              modules={[Autoplay, Pagination]}
              className="w-full h-64 md:h-80"
            >
              {property?.image?.map((img, i) => (
                <SwiperSlide key={i}>
                  <img src={img} alt="Property" className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="p-6">
              <h2 className={`text-2xl font-bold ${currentTheme.text}`}>{property?.propertyname}</h2>
              <p className={currentTheme.textSecondary}>{property?.city}, {property?.state}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">₹{property?.price?.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${currentTheme.featureBadge}`}>
                  {property?.propertytype}
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 w-full">
            <div className={`rounded-2xl p-8 ${currentTheme.card}`}>
              {bookingId ? (
                /* SUCCESS STATE */
                <div className="text-center py-10">
                  <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
                  </div>
                  <h2 className={`text-3xl font-bold mb-4 ${currentTheme.text}`}>Request Received!</h2>
                  <p className={`mb-8 ${currentTheme.textSecondary}`}>
                    Our agent will contact you shortly to confirm your visit for the selected date.
                  </p>
                  <button 
                    onClick={() => navigate("/")}
                    className={`px-8 py-3 text-white font-bold rounded-xl ${currentTheme.button}`}
                  >
                    Browse More Properties
                  </button>
                </div>
              ) : (
                /* FORM STATE */
                <>
                  <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Schedule a Visit</h2>
                    <p className={currentTheme.textSecondary}>Fill in your details to book a tour</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className={`text-sm font-semibold ${currentTheme.text}`}>Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            {...register("fullName", { required: "Name is required" })}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input}`}
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.fullName && <span className="text-xs text-red-500">{errors.fullName.message}</span>}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className={`text-sm font-semibold ${currentTheme.text}`}>Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            {...register("email", { required: "Email is required" })}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input}`}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className={`text-sm font-semibold ${currentTheme.text}`}>Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            {...register("phone", { required: "Phone is required" })}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input}`}
                            placeholder="10-digit number"
                          />
                        </div>
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <label className={`text-sm font-semibold ${currentTheme.text}`}>Preferred Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            {...register("date", { required: "Select a date" })}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`text-sm font-semibold ${currentTheme.text}`}>Notes (Optional)</label>
                      <textarea
                        {...register("message")}
                        rows="3"
                        className={`w-full p-4 rounded-xl border ${currentTheme.input}`}
                        placeholder="I'm interested in the morning slot..."
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all ${currentTheme.button}`}
                    >
                      Confirm Booking Request
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