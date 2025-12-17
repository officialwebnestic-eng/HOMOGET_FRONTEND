import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { http } from "../../../axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Calendar, User, Phone, Mail, CreditCard, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../model/SuccessToasNotification";

const CreateBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;
  const { user } = useContext(AuthContext);
  const { theme } = useTheme();
  const [bookingId, setBookingId] = useState(null);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Enhanced theme configuration with modern styling
  const themeClasses = {
    light: {
      bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen",
      card: "bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl",
      text: "text-gray-800",
      textSecondary: "text-gray-600", 
      border: "border-gray-200/50",
      input: "bg-white/70 backdrop-blur-sm border-gray-900  hover:bg-white/90 transition-all duration-300",
      button: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl",
      featureBadge: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm hover:shadow-md transition-all duration-200",
      backButton: "text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 rounded-lg px-3 py-2 transition-all duration-200"
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 min-h-screen",
      card: "bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl",
      text: "text-gray-100",
      textSecondary: "text-gray-300",
      border: "border-gray-700/50",
      input: "bg-gray-700/70 backdrop-blur-sm border-gray-600/50 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 hover:bg-gray-700/90 transition-all duration-300",
      button: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl",
      featureBadge: "bg-gradient-to-r from-blue-900/60 to-indigo-900/60 text-blue-100 shadow-sm hover:shadow-md transition-all duration-200",
      backButton: "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg px-3 py-2 transition-all duration-200"
    }
  };

  const currentTheme = themeClasses[theme];

  const onSubmit = async (data) => {
    const payload = { ...data, propertyId: property?._id, agentId: property.agentId };

    try {
      const response = await http.post("/booking", payload)
      if (response.data.success) {
        addToast(response.data.message || "Your Request Sent Successfully", "success");
        setBookingId(response.data.booking?._id);
        reset();
      } else {
        toast.error(response.data.message || "Please fill all valid fields");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal server error");
    }
  };


  return (
    <div className={`w-full py-8 px-4 sm:px-6 lg:px-8 ${currentTheme.bg}`}>
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center mb-8 transition-all duration-200 ${currentTheme.backButton}`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Property</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Property Details Section */}
          <div className={`lg:w-1/2 w-full rounded-2xl overflow-hidden ${currentTheme.card}`}>
            {/* Image Slider with Overlay */}
            <div className="relative">
              <Swiper
                spaceBetween={10}
                pagination={{ 
                  clickable: true,
                  bulletClass: "swiper-pagination-bullet !bg-white/70 !opacity-60",
                  bulletActiveClass: "swiper-pagination-bullet-active !bg-white !opacity-100"
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop
                modules={[Autoplay, Pagination]}
                className="w-full h-72 sm:h-96"
              >
                {property?.image?.map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-full">
                      <img
                        src={img}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Price Badge Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full shadow-lg font-bold text-lg">
                ₹{property?.price?.toLocaleString()}
              </div>
            </div>

            <div className="p-8">
              {/* Property Title */}
              <div className="mb-6">
                <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  {property?.propertyname}
                </h2>
                <p className={`text-lg ${currentTheme.textSecondary}`}>
                  {property?.city}, {property?.state}
                </p>
              </div>

              {/* Property Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-gray-700/50 to-gray-600/50'}`}>
                  <div className={`text-sm font-medium ${currentTheme.textSecondary} mb-1`}>Property Type</div>
                  <div className={`text-lg font-semibold ${currentTheme.text}`}>{property?.propertytype}</div>
                </div>
                <div className={`p-4 rounded-xl ${theme === 'light' ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-gradient-to-br from-gray-700/50 to-gray-600/50'}`}>
                  <div className={`text-sm font-medium ${currentTheme.textSecondary} mb-1`}>Location</div>
                  <div className={`text-lg font-semibold ${currentTheme.text}`}>{property?.city } {property.state}</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-3 ${currentTheme.text}`}>About This Property</h3>
                <p className={`${currentTheme.textSecondary} leading-relaxed`}>{property?.description}</p>
              </div>

              {/* Enhanced Amenities */}
              <div className={`border-t pt-6 ${currentTheme.border}`}>
                <h3 className={`text-xl font-semibold mb-4 ${currentTheme.text}`}>Premium Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {property.aminities &&
                    Array.isArray(property.aminities) &&
                    property.aminities.map((item, index) => {
                      try {
                        const parsed = JSON.parse(item);
                        const list = Array.isArray(parsed) ? parsed : [parsed];

                        return list.map((val, i) => (
                          <span
                            key={`${index}-${i}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transform hover:scale-105 transition-all duration-200 ${currentTheme.featureBadge}`}
                          >
                            {val}
                          </span>
                        ));
                      } catch {
                        return (
                          <span
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transform hover:scale-105 transition-all duration-200 ${currentTheme.featureBadge}`}
                          >
                            {item}
                          </span>
                        );
                      }
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Booking Form Section */}
          <div className="lg:w-1/2 w-full ">
            <div className={`rounded-2xl p-8 ${currentTheme.card}`}>
              {/* Form Header */}
              <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
                  Schedule Your Visit
                </h2>
                <p className={`${currentTheme.textSecondary}`}>
                  Book a personalized tour of this amazing property
                </p>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name Field */}
                <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
                <div className="group  ">
                  <label className={`block text-sm font-semibold mb-2 ${currentTheme.text} group-focus-within:text-blue-600 transition-colors`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.textSecondary} group-focus-within:text-blue-600 transition-colors`} />
                    <input
                      {...register("fullName", { required: "Full name is required" })}
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 text-lg ${currentTheme.input}`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className={`block text-sm  font-semibold mb-2 ${currentTheme.text} group-focus-within:text-blue-600 transition-colors`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 border top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.textSecondary} group-focus-within:text-blue-600 transition-colors`} />
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      type="email"
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4  border py-4 rounded-xl focus:ring-2 text-lg ${currentTheme.input}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${currentTheme.text} group-focus-within:text-blue-600 transition-colors`}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.textSecondary} group-focus-within:text-blue-600 transition-colors`} />
                    <input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: "Invalid phone number"
                        }
                      })}
                      type="tel"
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 text-lg ${currentTheme.input}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Date Field */}
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${currentTheme.text} group-focus-within:text-blue-600 transition-colors`}>
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${currentTheme.textSecondary} group-focus-within:text-blue-600 transition-colors`} />
                    <input
                      {...register("date", { required: "Booking date is required" })}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-12 pr-4 py-4 border  rounded-xl focus:ring-2 text-lg ${currentTheme.input}`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-2 text-sm text-red-500 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Property Type Field */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${currentTheme.text}`}>
                    Property Type
                  </label>
                  <input
                    {...register("propertyType")}
                    value={property?.propertytype || ""}
                    readOnly
                    className={`w-full p-4 rounded-xl  border text-lg ${theme === 'light' ? 'bg-gray-50/70' : 'bg-gray-700/50'} border ${currentTheme.border} cursor-not-allowed`}
                  />
                </div>

                {/* Notes Field */}
                <div className="group">
                  <label className={`block text-sm font-semibold mb-2 ${currentTheme.text}`}>
                    Additional Notes
                  </label>
                  <textarea
                    {...register("message")}
                    rows="4"
                    placeholder="Any special requirements or questions about the property..."
                    className={`w-full p-4 rounded-xl border focus:ring-2 text-lg resize-none ${currentTheme.input}`}
                  />
                </div>
                </div>

                {/* Enhanced Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-4  text-white font-bold text-lg rounded-xl transition-all duration-300 ${currentTheme.button}`}
                >
                  <span className="flex items-center justify-center">
                    <Calendar className="w-5 h-5 mr-3" />
                    Confirm Booking Request
                  </span>
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200/20">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Secure Booking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBooking;