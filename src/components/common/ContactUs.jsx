import React from "react";
import { useForm } from "react-hook-form";
import { http } from "../../axios/axios";
import { useNavigate } from 'react-router-dom';
import Hero from "../aboutus/Hero";
import { MapPin, Phone, Mail, Clock, Building, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useToast } from "../../model/SuccessToasNotification";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const ContactUs = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await http.post("/contact", data);
      if (response.data.success) {
        addToast(response.data.message || "Your request was sent successfully. Our team will contact you within 2 hours.", 'success');
        navigate("/");
      } else {
        addToast(response.data.message || "Please fill all fields correctly", 'error');
      }
    } catch (error) {
      console.error("API error:", error);
      addToast(error.response?.data?.message || "Internal server error", 'error');
    }
  };

  // Color scheme based on theme
  const colors = {
    primary: theme === 'dark' ? 'from-cyan-500 to-teal-500' : 'from-cyan-600 to-teal-600',
    primaryHover: theme === 'dark' ? 'hover:from-cyan-600 hover:to-teal-600' : 'hover:from-cyan-700 hover:to-teal-700',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    icon: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
    socialBg: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
    inputBg: theme === 'dark' ? 'bg-gray-700' : 'bg-white',
    focusRing: theme === 'dark' ? 'focus:ring-cyan-500' : 'focus:ring-cyan-500',
    errorText: 'text-red-500',
    errorBorder: 'border-red-500',
    successText: 'text-green-500',
    mapFilter: theme === 'dark' ? 'grayscale-[30%] contrast-[0.8] brightness-[0.7]' : ''
  };

  const socialIcons = [
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, color: 'text-blue-500' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, color: 'text-blue-400' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, color: 'text-pink-500' },
    { name: 'LinkedIn', icon: <Linkedin className="h-5 w-5" />, color: 'text-blue-600' }
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Hero 
        title="Contact Us" 
        subtitle="Get in touch with our team" 
        background={theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-cyan-50 to-teal-50'}
      />

      <div className={`w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Contact Info Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className={`${colors.cardBg} p-8 rounded-xl shadow-lg h-fit sticky top-8 transition-all duration-300 ${colors.border} border`}
            >
              <h3 className={`text-2xl font-bold mb-6 flex items-center ${colors.textPrimary}`}>
                <Building className={`mr-3 ${colors.icon}`} size={24} />
                Our Office
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                    <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${colors.textPrimary}`}>Address</h4>
                    <p className={`${colors.textSecondary} mt-1`}>
                      TVS SOLUTIONS Mohan Rd, near KAKORI TIRAHA, Lucknow, Salempur, Uttar Pradesh 226017
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100'}`}>
                    <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${colors.textPrimary}`}>Phone</h4>
                    <p className={`${colors.textSecondary} mt-1`}>
                      +918899117706
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}>
                    <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${colors.textPrimary}`}>Email</h4>
                    <p className={`${colors.textSecondary} mt-1`}>
                      info@tvssolutions.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${theme === 'dark' ? 'bg-teal-900/30' : 'bg-teal-100'}`}>
                    <Clock className={`h-5 w-5 ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${colors.textPrimary}`}>Working Hours</h4>
                    <p className={`${colors.textSecondary} mt-1`}>
                      Monday - Friday: 9am - 7pm<br />
                      Saturday: 10am - 5pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className={`text-lg font-semibold mb-4 ${colors.textPrimary}`}>Follow Us</h4>
                <div className="flex space-x-3">
                  {socialIcons.map((social) => (
                    <motion.a
                      key={social.name}
                      href="#"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${colors.socialBg} ${social.color}`}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <div className={`lg:col-span-2 ${colors.cardBg} p-8 rounded-xl shadow-lg transition-all duration-300 ${colors.border} border`}>
              <h2 className={`text-3xl font-bold mb-2 ${colors.textPrimary}`}>Send us a message</h2>
              <p className={`${colors.textSecondary} mb-8`}>
                Have questions about properties or our services? Fill out the form below and our team will
                get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Full Name *</label>
                  <input
                    {...register("fullName", { required: "This field is required" })}
                    type="text"
                    placeholder="Enter your full name"
                    className={`p-3 rounded-md border ${colors.focusRing} focus:border-transparent transition-all duration-300 ${errors.fullName ? colors.errorBorder : colors.border
                      } ${colors.inputBg} ${colors.textPrimary}`}
                  />
                  {errors.fullName && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${colors.errorText} text-sm mt-1`}
                    >
                      {errors.fullName.message}
                    </motion.span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Email Address *</label>
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
                    className={`p-3 rounded-md border ${colors.focusRing} focus:border-transparent transition-all duration-300 ${errors.email ? colors.errorBorder : colors.border
                      } ${colors.inputBg} ${colors.textPrimary}`}
                  />
                  {errors.email && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${colors.errorText} text-sm mt-1`}
                    >
                      {errors.email.message}
                    </motion.span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Phone Number *</label>
                  <input
                    {...register("phoneno", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Invalid phone number"
                      }
                    })}
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className={`p-3 rounded-md border ${colors.focusRing} focus:border-transparent transition-all duration-300 ${errors.phoneno ? colors.errorBorder : colors.border
                      } ${colors.inputBg} ${colors.textPrimary}`}
                  />
                  {errors.phoneno && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${colors.errorText} text-sm mt-1`}
                    >
                      {errors.phoneno.message}
                    </motion.span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Inquiry Type *</label>
                  <select
                    {...register("inquarytype", { required: "Please select an inquiry type" })}
                    className={`p-3 rounded-md border ${colors.focusRing} focus:border-transparent transition-all duration-300 ${errors.inquarytype ? colors.errorBorder : colors.border
                      } ${colors.inputBg} ${colors.textPrimary}`}
                  >
                    <option value="">-- Select Inquiry Type --</option>
                    <option value="Property Visit">Schedule A Property Visit</option>
                    <option value="Home Loan">Home Loan Assistance</option>
                    <option value="Buying/Selling">Buying And Selling Inquiry</option>
                    <option value="Rental">Rental Inquiry</option>
                    <option value="General">General Question</option>
                  </select>
                  {errors.inquarytype && (
                    <motion.span 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${colors.errorText} text-sm mt-1`}
                    >
                      {errors.inquarytype.message}
                    </motion.span>
                  )}
                </div>

                <div className="md:col-span-2 flex flex-col">
                  <label className={`text-sm font-medium mb-2 ${colors.textPrimary}`}>Message</label>
                  <textarea
                    {...register("message")}
                    placeholder="Tell us about your requirements..."
                    rows="5"
                    className={`p-3 rounded-md border ${colors.focusRing} focus:border-transparent transition-all duration-300 ${colors.border} ${colors.inputBg} ${colors.textPrimary}`}
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`w-full md:w-auto px-8 py-3 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : `bg-gradient-to-r ${colors.primary} ${colors.primaryHover}`
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : 'Submit Message'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

        
<motion.div 
  initial="hidden"
  animate="visible"
  variants={fadeInVariants}
  className={`mt-12 ${colors.cardBg} p-6 rounded-xl shadow-lg transition-all duration-300 ${colors.border} border`}
>
  <h3 className={`text-2xl font-bold mb-6 ${colors.textPrimary}`}>Our Location</h3>
  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.365129496954!2d80.9414153150444!3d26.92351708312089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399957e8a0a1a0a5%3A0x8a3a3a3a3a3a3a3a!2sTVS%20SOLUTIONS!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin&markers=color:red%7C26.923517,80.941415"
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      title="TVS Solutions Location"
      className={colors.mapFilter}
    ></iframe>
  </div>
</motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;