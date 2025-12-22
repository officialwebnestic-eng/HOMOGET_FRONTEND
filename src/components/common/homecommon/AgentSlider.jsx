import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Home,
  Mail,
  Phone,
  MapPin,
  Award
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTheme } from "../../../context/ThemeContext";
import { useState, useRef, useCallback } from "react";
import { http } from "../../../axios/axios";
import useGetAllAgent from "../../../hooks/useGetAllAgent";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { useToast } from "../../../model/SuccessToasNotification";
import EmptyStateModel from "../../../model/EmptyStateModel";

const AgentSlider = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const { agentList = [], loading, error } = useGetAllAgent();
  const sliderRef = useRef(null);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Avatar fallback generator
  const getAvatarFallback = useCallback((name, id) => {
    if (!name) {
      return `https://ui-avatars.com/api/?name=User&background=cccccc&color=fff&size=150&bold=true&id=${id}`;
    }
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const colors = ["0d9488", "3b82f6", "8b5cf6", "ec4899", "10b981"];
    const color = colors[id.charCodeAt(0) % colors.length];
    return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=150&bold=true&id=${id}`;
  }, []);

  // Custom arrows
  const NextArrow = (props) => (
    <motion.button
      {...props}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-xl backdrop-blur-lg border transition-all duration-300 ${
        theme === "dark"
          ? "bg-purple-900/80 border-purple-500/30 text-white hover:bg-purple-800/90 hover:shadow-purple-500/25"
          : "bg-white/90 border-purple-200 text-purple-600 hover:bg-purple-50 hover:shadow-purple-200/50"
      }`}
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5 mx-auto" />
    </motion.button>
  );

  const PrevArrow = (props) => (
    <motion.button
      {...props}
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-xl backdrop-blur-lg border transition-all duration-300 ${
        theme === "dark"
          ? "bg-purple-900/80 border-purple-500/30 text-white hover:bg-purple-800/90 hover:shadow-purple-500/25"
          : "bg-white/90 border-purple-200 text-purple-600 hover:bg-purple-50 hover:shadow-purple-200/50"
      }`}
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5 mx-auto" />
    </motion.button>
  );

  // Modal handlers
  const openModal = (agent) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
    setFormSuccess(false);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAgent(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: ""
    });
    setFormErrors({});
    setFormSuccess(false);
    document.body.style.overflow = "auto";
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Submit contact request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const requestData = {
        ...formData,
        agentId: selectedAgent._id,
        name: selectedAgent.name
      };
      const response = await http.post("/createrequest", requestData);
      if (response.data.success) {
        addToast(response.data.message || "Request sent successfully", "success");
        setFormSuccess(true);
      } else {
        addToast(response.data.message || "Failed to submit request", "error");
      }
    } catch (error) {
      addToast(
        error.response?.data?.message || "An error occurred. Please try again later.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Slider settings with responsiveness
const getSliderSettings = () => {
  const agents = agentList || [];
  return {
    dots: true,
    infinite: agents.length > 1,
    speed: 500,
    autoplay: agents.length > 1,
    autoplaySpeed: 5000,
    cssEase: "ease-in-out",
    arrows: agents.length > 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    pauseOnHover: true,
    dotsClass: `slick-dots premium-dots ${theme === "dark" ? "slick-dots-dark" : ""}`,
    // Set default to 3 for large screens
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280, // up to 1280px
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024, // up to 1024px
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // up to 768px
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };
};

  if (error) {
    return (
      <motion.div
        className="relative z-10 py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div
          className={`max-w-7xl mx-auto text-center rounded-3xl p-8 backdrop-blur-xl border ${
            theme === "dark"
              ? "bg-red-900/20 border-red-500/20"
              : "bg-red-50/80 border-red-200/30"
          }`}
        >
          <p
            className={`text-lg ${theme === "dark" ? "text-red-300" : "text-red-600"}`}
          >
            Failed to load agents. Please try again later.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative z-10 py-20 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
      id="our-agents"
    >
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2
          className={`text-4xl md:text-5xl font-bold mb-6 clamp-text flex items-center justify-center gap-3 mx-auto max-w-max ${
            theme === "dark"
              ? "bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          }`}
        >
          <div className="relative">
            <Home
              className={`w-12 h-12 ${
                theme === "dark" ? "text-purple-300" : "text-purple-500"
              }`}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          Meet Our Real Estate Experts
        </h2>
        <p
          className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Our dedicated professionals are ready to guide you through every step
          of your property journey
        </p>
      </motion.div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 backdrop-blur-lg border animate-pulse ${
                theme === "dark"
                  ? "bg-gray-800/50 border-gray-700/30"
                  : "bg-white/70 border-gray-200/30"
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full mx-auto mb-4 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
              <div
                className={`h-6 w-32 mx-auto mb-2 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`h-5 w-20 mx-auto mb-3 rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`h-4 w-full max-w-xs mx-auto rounded ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              ></div>
            </div>
          ))}
        </div>
      ) : agentList.length === 0 ? (
    <EmptyStateModel  title="No Agents Found"
    message="No Agents Found"
    ></EmptyStateModel>
      ) : (
        <>
          {/* Slider Container */}
          <div className="max-w-full mx-auto px-4 md:px-6 lg:px-8">
            <Slider {...getSliderSettings()} className="pb-16" ref={sliderRef}>
              {agentList.map((agent, index) => (
                <div key={agent._id} className="px-3 focus:outline-none">
                  {/* Card */}
                  <motion.div
                    className={`group relative rounded-3xl p-6 md:p-8 backdrop-blur-lg transition-all  ${ theme === "dark" ?"border" :""}duration-500 hover:scale-[1.02] w-full max-w-sm md:max-w-md mx-auto`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Premium Badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-4 h-4 text-white" />
                    </div>

                    {/* Profile Photo */}
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="relative mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-amber-400 to-amber-400 p-1 bg-gradient-to-r from-purple-500 to-pink-500">
                          <img
                            src={
                              agent.profilePhoto ||
                              getAvatarFallback(agent.name, agent._id)
                            }
                            alt={agent.name}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) =>
                              (e.target.src = getAvatarFallback(agent.name, agent._id))
                            }
                          />
                        </div>
                        {/* Online Indicator */}
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      {/* Name */}
                      <h3
                        className={`font-bold text-xl mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {agent.name}
                      </h3>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(agent.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span
                          className={`text-sm ml-2 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          ({agent.rating || 5}.0)
                        </span>
                      </div>
                    </div>

                    {/* Agent Details */}
                    <div className="space-y-3 mb-6">
                      {/* Location */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            theme === "dark" ? "bg-gray-700/50" : "bg-purple-50"
                          }`}
                        >
                          <MapPin
                            className={`w-4 h-4 ${
                              theme === "dark" ? "text-purple-300" : "text-purple-500"
                            }`}
                          />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              theme === "dark" ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {agent.city}
                          </p>
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {agent.address}
                          </p>
                        </div>
                      </div>
                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            theme === "dark" ? "bg-gray-700/50" : "bg-green-50"
                          }`}
                        >
                          <Mail
                            className={`w-4 h-4 ${
                              theme === "dark" ? "text-green-300" : "text-green-500"
                            }`}
                          />
                        </div>
                        <p
                          className={`text-sm truncate ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {agent.email}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Premium Agent
                      </span>
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                          theme === "dark"
                            ? "bg-purple-900/50 text-purple-200"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        Verified
                      </span>
                    </div>

                    {/* Contact Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openModal(agent)}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                      aria-label={`Contact ${agent.name}`}
                    >
                      <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                      Contact Agent
                    </motion.button>
                  </motion.div>
                </div>
              ))}
            </Slider>
          </div>
          {/* View All Button */}
          {agentList.length > 2 && (
            <div className="mt-16 text-center">
              <NavLink to="/agents">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-12 py-4 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
                >
                  <Home className="w-5 h-5" />
                  View All Agents
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </NavLink>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className={`rounded-3xl mt-20 max-w-md w-full p-8 overflow-auto max-h-[90vh] backdrop-blur-xl border shadow-2xl ${
                theme === "dark"
                  ? "bg-gray-900/95 border-gray-700/30"
                  : "bg-white/95 border-gray-200/30"
              }`}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-agent-modal-title"
            >
              {formSuccess ? (
                <div className="text-center p-6">
                  <motion.div
                    className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3
                    className={`text-2xl font-bold mb-3 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                    id="contact-agent-modal-title"
                  >
                    Request Sent Successfully! 🎉
                  </h3>
                  <p
                    className={`mb-6 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {selectedAgent.name} will contact you shortly.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeModal}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300"
                  >
                    Close
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-8">
                    <h3
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                      id="contact-agent-modal-title"
                    >
                      Contact Agent
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeModal}
                      className={`p-2 rounded-full transition-colors ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      }`}
                      aria-label="Close modal"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {/* Agent Info */}
                  <div
                    className={`flex items-center gap-4 mb-8 p-4 rounded-2xl ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-purple-50"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-gradient-to-r from-purple-400 to-pink-400 p-1 bg-gradient-to-r from-purple-500 to-pink-500">
                        <img
                          src={
                            selectedAgent.profilePhoto ||
                            getAvatarFallback(selectedAgent.name, selectedAgent._id)
                          }
                          alt={selectedAgent.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) =>
                            (e.target.src = getAvatarFallback(selectedAgent.name, selectedAgent._id))
                          }
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-bold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {selectedAgent.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-purple-300" : "text-purple-600"
                        }`}
                      >
                        Premium Real Estate Agent
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label
                          htmlFor="firstName"
                          className={`block mb-2 text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                            formErrors.firstName
                              ? "border-red-500 focus:ring-red-500/20"
                              : theme === "dark"
                              ? "border-gray-600 focus:border-purple-500 bg-gray-800 text-white focus:ring-purple-500/20"
                              : "border-gray-200 focus:border-purple-500 bg-white focus:ring-purple-500/20"
                          } focus:ring-4 focus:outline-none`}
                          aria-invalid={!!formErrors.firstName}
                          aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
                        />
                        {formErrors.firstName && (
                          <p
                            id="firstName-error"
                            className="mt-2 text-sm text-red-500 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            {formErrors.firstName}
                          </p>
                        )}
                      </div>
                      {/* Last Name */}
                      <div>
                        <label
                          htmlFor="lastName"
                          className={`block mb-2 text-sm font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                            formErrors.lastName
                              ? "border-red-500 focus:ring-red-500/20"
                              : theme === "dark"
                              ? "border-gray-600 focus:border-purple-500 bg-gray-800 text-white focus:ring-purple-500/20"
                              : "border-gray-200 focus:border-purple-500 bg-white focus:ring-purple-500/20"
                          } focus:ring-4 focus:outline-none`}
                          aria-invalid={!!formErrors.lastName}
                          aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
                        />
                        {formErrors.lastName && (
                          <p
                            id="lastName-error"
                            className="mt-2 text-sm text-red-500 flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            {formErrors.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className={`block mb-2 text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          formErrors.email
                            ? "border-red-500 focus:ring-red-500/20"
                            : theme === "dark"
                            ? "border-gray-600 focus:border-purple-500 bg-gray-800 text-white focus:ring-purple-500/20"
                            : "border-gray-200 focus:border-purple-500 bg-white focus:ring-purple-500/20"
                        } focus:ring-4 focus:outline-none`}
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? "email-error" : undefined}
                      />
                      {formErrors.email && (
                        <p
                          id="email-error"
                          className="mt-2 text-sm text-red-500 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className={`block mb-2 text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                          formErrors.phone
                            ? "border-red-500 focus:ring-red-500/20"
                            : theme === "dark"
                            ? "border-gray-600 focus:border-purple-500 bg-gray-800 text-white focus:ring-purple-500/20"
                            : "border-gray-200 focus:border-purple-500 bg-white focus:ring-purple-500/20"
                        } focus:ring-4 focus:outline-none`}
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? "phone-error" : undefined}
                      />
                      {formErrors.phone && (
                        <p
                          id="phone-error"
                          className="mt-2 text-sm text-red-500 flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className={`block mb-2 text-sm font-medium ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Message (Optional)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your property requirements..."
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                          theme === "dark"
                            ? "border-gray-600 focus:border-purple-500 bg-gray-800 text-white focus:ring-purple-500/20"
                            : "border-gray-200 focus:border-purple-500 bg-white focus:ring-purple-500/20"
                        } focus:ring-4 focus:outline-none`}
                      />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={closeModal}
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          theme === "dark"
                            ? "border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                            : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting && (
                          <motion.svg
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </motion.svg>
                        )}
                        {isSubmitting ? "Sending..." : "Send Request"}
                      </motion.button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Dot Style */}
      <style jsx global>{`
        /* Dots for slider */
        .premium-dots li button:before {
          color: ${theme === "dark" ? "#9ca3af" : "#d1d5db"};
          font-size: 12px;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .premium-dots li.slick-active button:before {
          color: ${theme === "dark" ? "#a855f7" : "#9333ea"};
          opacity: 1;
          font-size: 14px;
          transform: scale(1.2);
        }
        .premium-dots li button:hover:before {
          opacity: 0.8;
          transform: scale(1.1);
        }
        .premium-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          gap: 8px;
        }
        .premium-dots li {
          margin: 0 4px;
        }
        .premium-dots li button {
          width: 12px;
          height: 12px;
          padding: 0;
          border-radius: 50%;
          border: 2px solid ${theme === "dark" ? "#374151" : "#e5e7eb"};
          background: ${theme === "dark" ? "#1f2937" : "#ffffff"};
          transition: all 0.3s ease;
        }
        .premium-dots li.slick-active button {
          border-color: ${theme === "dark" ? "#a855f7" : "#9333ea"};
          background: ${theme === "dark" ? "#7c3aed" : "#8b5cf6"};
          transform: scale(1.2);
        }
        .premium-dots li button:hover {
          border-color: ${theme === "dark" ? "#8b5cf6" : "#a855f7"};
          transform: scale(1.1);
        }
        /* Text size for titles */
        .clamp-text {
          font-size: clamp(2rem, 5vw, 3rem);
        }
        /* Carousel track styling */
        .slick-track {
          display: flex !important;
          align-items: stretch;
        }
        .slick-slide > div {
          height: 100%;
        }
        /* Custom scrollbar for modal */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#374151" : "#f1f5f9"};
          border-radius: 3px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: ${theme === "dark" ? "#6b7280" : "#cbd5e1"};
          border-radius: 3px;
        }
        .modal-content::-webkit-scrollbar-thumb:hover {
          background: ${theme === "dark" ? "#9ca3af" : "#94a3b8"};
        }
        /* Focus styles for accessibility */
        .premium-focus:focus {
          outline: none;
          box-shadow: 0 0 0 3px ${
            theme === "dark" ? "rgba(168, 85, 247, 0.3)" : "rgba(147, 51, 234, 0.3)"
          };
        }
        /* Gradient border animation (if needed) */
        @keyframes gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-border {
          background: linear-gradient(45deg, #8b5cf6, #ec4899, #f59e0b, #8b5cf6);
          background-size: 300% 300%;
          animation: gradient-border 3s ease infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default AgentSlider;