import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiSend, FiX, FiUser, FiMail, FiChevronRight, FiPhone, FiStar, FiCheck } from "react-icons/fi";
import useGetAllAgent from "../../hooks/useGetAllAgent";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../model/SuccessToasNotification";
import { http } from "../../axios/axios";
import EmptyStateModel from "../../model/EmptyStateModel";

// Reusable Image component with fallback
const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

const AgentSupport = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [firstName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const { agentList } = useGetAllAgent();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [step, setStep] = useState(1);
  const { theme } = useTheme();
  const { addToast } = useToast();

  const bgColor = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900'
    : 'bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30';

  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-800';

  const cardBg = theme === 'dark'
    ? 'bg-gray-800/80 backdrop-blur-lg border-gray-700/50'
    : 'bg-white/80 backdrop-blur-lg border-white/20';

  const borderColor = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50';

  const inputBg = theme === 'dark'
    ? 'bg-gray-700/50 text-white border-gray-600/50'
    : 'bg-white/70 border-gray-200/50';

  const agentCardHover = theme === 'dark'
    ? 'hover:border-blue-500/70 hover:shadow-blue-500/20'
    : 'hover:border-blue-400/70 hover:shadow-blue-400/20';

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName,
        email,
        phone,
        message: formMessage,
        agentId: selectedAgent?._id,
      };
      console.log(payload);
      const response = await http.post("/createrequest", payload);

      if (response.status === 200) {
        setFormSubmitted(true);
        addToast(response.data.message || "Thanks for your message! We'll get back to you shortly.", "success");
        setName("");
        setEmail("");
        setPhoneNumber("");
        setFormMessage("");

        setTimeout(() => {
          setFormSubmitted(false);
          setStep(1);
          setSelectedAgent(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const selectAgent = (agent) => {
    setSelectedAgent(agent);
    setStep(2);
  };

  const goBackToAgents = () => {
    setSelectedAgent(null);
    setStep(1);
  };

  return (
    <div className={`w-full min-h-screen ${bgColor} ${textColor} overflow-x-hidden transition-all duration-500 relative`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center py-16 px-4  relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className={`text-xl md:text-2xl font-extrabold mt-4 bg-gradient-to-r ${theme === 'dark'
              ? 'from-blue-400 via-purple-400 to-indigo-400'
              : 'from-blue-600 via-purple-600 to-indigo-600'
            } bg-clip-text text-transparent leading-tight`}>
            Connect with Our<br />Support Team
         
          </h1>
        </motion.div>
        <motion.p
          className={`text-xl md:text-2xl mt-6 max-w-3xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {step === 1 ? "Select an agent to get personalized assistance" : "Fill out the form to connect with your selected agent"}
        </motion.p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
        {step === 1 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            {agentList?.length ? agentList.map((agent, index) => {
              const isActive = agent?.status?.toLowerCase() === "active";
              return (
                <motion.div
                  key={agent.id}
                  className={` rounded-2xl shadow-xl overflow-hidden border-2 ${isActive
                      ? `border-transparent ${agentCardHover} hover:shadow-2xl`
                      : `${borderColor} opacity-70`
                    } backdrop-blur-xl transition-all duration-300 group relative`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Status indicator */}
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${isActive ? 'bg-green-400 shadow-green-400/50' : 'bg-gray-400'
                    } shadow-lg`}>
                    {isActive && (
                      <div className="absolute inset-0 w-full h-full bg-green-400 rounded-full animate-ping opacity-30"></div>
                    )}
                  </div>

                  {/* Agent Info */}
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <ImageWithFallback
                          src={agent.profilePhoto || "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fuser&psig=AOvVaw1wcwInvp8D78UqKzDWbqqT&ust=1756186350868000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLj91o6epY8DFQAAAAAdAAAAABAE"}
                          fallbackSrc="/default-agent.jpg"
                          alt={agent.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-blue-200/50 shadow-lg group-hover:border-blue-300/70 transition-all duration-300"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                          <FiCheck className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} group-hover:text-blue-600 transition-colors duration-300`}>
                          {agent.name}
                        </h3>
                        <p className="text-blue-500 font-medium text-lg">{agent.roleName}</p>
                        <p className="text-blue-500 font-medium text-lg">{agent.email}</p>
                      </div>
                    </div>

                    {/* Address info */}
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/70'} border ${borderColor}`}>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                          <span className="font-semibold text-blue-600">Address:</span> {agent.address}
                        </p>
                      </div>
                    </div>

                    {/* Select button */}
                    <div className="mt-8">
                      <motion.button
                        onClick={() => selectAgent(agent)}
                        disabled={!isActive}
                        aria-disabled={!isActive}
                        className={`w-full py-4 px-6 rounded-xl flex items-center justify-center font-semibold text-lg transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/25'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        whileHover={isActive ? { scale: 1.05 } : {}}
                        whileTap={isActive ? { scale: 0.98 } : {}}
                      >
                        {isActive ? (
                          <>
                            Select Agent
                            <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </>
                        ) : (
                          "Currently Unavailable"
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
           <EmptyStateModel
            title="No agents found"
            message="We couldn't find any agents that match your criteria. Please try searching for a different location or agent roleName."
        
           
           
           > 




           </EmptyStateModel>
            )}
          </motion.div>
        ) : (
          <motion.div
            className={`w-full mx-auto ${cardBg} rounded-3xl shadow-2xl overflow-hidden   backdrop-blur-xl`}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Selected agent details */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex justify-between items-center">
                <motion.button
                  onClick={goBackToAgents}
                  className="flex items-center text-sm mb-6 hover:text-blue-200 transition-colors duration-200 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                  whileHover={{ x: -5 }}
                >
                  <FiChevronRight className="transform rotate-180 mr-2" /> Back to agents
                </motion.button>
                <div className="flex items-center">
                  <div className="relative">
                    <ImageWithFallback
                      src={selectedAgent?.profilePhoto || "https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2"}
                      fallbackSrc="/default-agent.jpg"
                      alt={selectedAgent?.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-400 rounded-full p-2 border-2 border-white">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold">{selectedAgent?.name}</h2>
                    <p className="text-blue-100 text-lg">{selectedAgent?.email}</p>
                    <p className="text-blue-200/80 text-sm mt-1">{selectedAgent?.roleName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form / Success Message */}
            <div className="p-8">
              {formSubmitted ? (
                <motion.div
                  className={`${theme === 'dark'
                      ? 'bg-emerald-900/50 text-emerald-100 border-emerald-500/50'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    } border-2 px-6 py-8 rounded-2xl text-center backdrop-blur-sm`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiCheck className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                  <p className="text-lg">Thank you! Your message has been sent to {selectedAgent?.agentName}.</p>
                  <p className="text-sm opacity-80 mt-2">{selectedAgent?.email}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className={`mb-3 font-semibold text-lg flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <FiUser className="mr-3 text-blue-500" /> Your First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className={`w-full p-4 border-2 ${borderColor} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${inputBg} text-lg`}
                        value={firstName}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full first name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className={`mb-3 font-semibold text-lg flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <FiMail className="mr-3 text-blue-500" /> Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full p-4 border-2 ${borderColor} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${inputBg} text-lg`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className={`mb-3 font-semibold text-lg flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <FiPhone className="mr-3 text-blue-500" /> Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        className={`w-full p-4 border-2 ${borderColor} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${inputBg} text-lg`}
                        value={phone}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    {/* Message */}
                    <div className="md:col-span-2">
                      <label htmlFor="message" className={`block mb-3 font-semibold text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        Your Message to {selectedAgent?.agentName}
                      </label>
                      <textarea
                        id="message"
                        className={`w-full p-4 border-2 ${borderColor} rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ${inputBg} text-lg resize-none`}
                        rows={6}
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        required
                        placeholder={`I'd like to ask about ${selectedAgent?.expertise?.toLowerCase() || ''}...`}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send to {selectedAgent?.agentName}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating chat button */}
      <motion.div
        className={`fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full p-5 shadow-2xl cursor-pointer z-50 hover:shadow-3xl transition-all duration-300 border-4 border-white/20 backdrop-blur-sm`}
        onClick={() => setChatOpen(!chatOpen)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat window"
        roleName="button"
        animate={{
          boxShadow: [
            "0 20px 40px rgba(59, 130, 246, 0.3)",
            "0 25px 50px rgba(168, 85, 247, 0.4)",
            "0 20px 40px rgba(59, 130, 246, 0.3)"
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <FiMessageCircle size={32} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className={`fixed bottom-28 right-8 w-96 h-[32rem] ${cardBg} shadow-3xl rounded-2xl overflow-hidden flex flex-col z-50 border-2 ${borderColor} backdrop-blur-xl`}
            initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.9, rotateX: -15 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            roleName="dialog"
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 flex justify-between items-center w-full">
                <h2 className="text-xl font-bold">Live Chat</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-sm opacity-90">We're online now</p>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="relative z-10 p-2 rounded-full hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                  aria-label="Close chat window"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            {/* You can add chat messages/input here */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentSupport;