import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MessageSquare, Globe, Clock, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ContactUsModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  
  const themeClasses = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      secondaryText: 'text-gray-600',
      border: 'border-gray-200',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      cardBg: 'bg-gray-50',
      accent: 'text-blue-600'
    },
    dark: {
      bg: 'bg-gray-800',
      text: 'text-gray-100',
      secondaryText: 'text-gray-300',
      border: 'border-gray-700',
      button: 'bg-blue-700 hover:bg-blue-600 text-white',
      cardBg: 'bg-gray-700',
      accent: 'text-blue-400'
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      description: "Get a response within 24 hours",
      action: "Send Message",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Live Chat",
      description: "Chat with our team in real-time",
      action: "Start Chat",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Support",
      description: "24/7 customer support line",
      action: "Call Now",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
    }
  ];

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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`relative rounded-2xl ${currentTheme.bg} ${currentTheme.border} border w-full max-w-md overflow-hidden shadow-xl`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${currentTheme.text}`}>Contact Us</h3>
                  <p className={`text-sm ${currentTheme.secondaryText}`}>Choose your preferred contact method</p>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Contact Cards */}
              <div className="space-y-3 mb-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border} cursor-pointer`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg ${method.color} mr-4`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${currentTheme.text}`}>{method.title}</h4>
                        <p className={`text-sm ${currentTheme.secondaryText}`}>{method.description}</p>
                      </div>
                      <button className={`px-3 py-1 text-sm rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {method.action}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Additional Info */}
              <div className={`p-4 rounded-xl ${currentTheme.cardBg} border ${currentTheme.border}`}>
                <div className="flex items-center mb-2">
                  <Globe className={`w-4 h-4 mr-2 ${currentTheme.accent}`} />
                  <span className={`text-sm ${currentTheme.text}`}>global-support@example.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className={`w-4 h-4 mr-2 ${currentTheme.accent}`} />
                  <span className={`text-sm ${currentTheme.secondaryText}`}>24/7 support available</span>
                </div>
              </div>
            </div>
            
            <div className={`p-4 border-t ${currentTheme.border} flex justify-end`}>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${currentTheme.button}`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};