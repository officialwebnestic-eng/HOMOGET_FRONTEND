import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, User, Hash, MessageSquare, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const EnquiryEmailModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      secondaryText: 'text-gray-600',
      border: 'border-gray-200',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      ring: 'ring-blue-500',
      error: 'text-red-600',
      errorBorder: 'border-red-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    dark: {
      bg: 'bg-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-300',
      border: 'border-gray-700',
      inputBg: 'bg-gray-700',
      inputBorder: 'border-gray-600',
      button: 'bg-blue-700 hover:bg-blue-600 text-white',
      ring: 'ring-blue-400',
      error: 'text-red-400',
      errorBorder: 'border-red-400',
      iconBg: 'bg-blue-900/30',
      iconColor: 'text-blue-400'
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Form submitted:', formData);
      onClose();
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className={`relative rounded-2xl ${currentTheme.bg} ${currentTheme.border} border w-full max-w-md overflow-hidden shadow-2xl`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`p-2 rounded-lg ${currentTheme.iconBg} mr-3`}
                  >
                    <Mail className={`w-5 h-5 ${currentTheme.iconColor}`} />
                  </motion.div>
                  <div>
                    <h3 className={`text-xl font-bold ${currentTheme.text}`}>Send Enquiry</h3>
                    <p className={`text-sm ${currentTheme.secondaryText}`}>We'll get back to you soon</p>
                  </div>
                </div>
                <motion.button 
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${currentTheme.text}`}>
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute  left-0 pl-3 flex items-center pointer-events-none">
                      <User className={`w-4 h-4 ${currentTheme.secondaryText}`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${currentTheme.inputBg} border ${errors.name ? currentTheme.errorBorder : currentTheme.inputBorder} focus:outline-none focus:ring-2 ${currentTheme.ring}`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-1 text-sm ${currentTheme.error}`}
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${currentTheme.text}`}>
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute  pl-3 flex items-center pointer-events-none">
                      <Mail className={`w-4 h-4 ${currentTheme.secondaryText}`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${currentTheme.inputBg} border ${errors.email ? currentTheme.errorBorder : currentTheme.inputBorder} focus:outline-none focus:ring-2 ${currentTheme.ring}`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-1 text-sm ${currentTheme.error}`}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${currentTheme.text}`}>
                    Subject *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className={`w-4 h-4 ${currentTheme.secondaryText}`} />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${currentTheme.inputBg} border ${errors.subject ? currentTheme.errorBorder : currentTheme.inputBorder} focus:outline-none focus:ring-2 ${currentTheme.ring}`}
                      placeholder="What's this about?"
                    />
                  </div>
                  {errors.subject && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-1 text-sm ${currentTheme.error}`}
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${currentTheme.text}`}>
                    Your Message *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <MessageSquare className={`w-4 h-4 ${currentTheme.secondaryText}`} />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg ${currentTheme.inputBg} border ${errors.message ? currentTheme.errorBorder : currentTheme.inputBorder} focus:outline-none focus:ring-2 ${currentTheme.ring}`}
                      placeholder="Describe your enquiry in detail..."
                    />
                  </div>
                  {errors.message && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-1 text-sm ${currentTheme.error}`}
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </div>
                
                <div className="pt-2 flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg border ${currentTheme.inputBorder} ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} ${currentTheme.text}`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg ${currentTheme.button} flex items-center justify-center min-w-[120px]`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Enquiry
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryEmailModal;