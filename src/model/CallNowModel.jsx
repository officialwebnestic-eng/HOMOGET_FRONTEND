import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CallNowModal = ({ isOpen, onClose }) => {
    const { theme } = useTheme();

    const themeClasses = {
        light: {
            bg: 'bg-white',
            text: 'text-gray-800',
            secondaryText: 'text-gray-600',
            border: 'border-gray-200',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondaryButton: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
        },
        dark: {
            bg: 'bg-gray-800',
            text: 'text-gray-100',
            secondaryText: 'text-gray-300',
            border: 'border-gray-700',
            button: 'bg-blue-700 hover:bg-blue-600 text-white',
            secondaryButton: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
        }
    };

    const currentTheme = themeClasses[theme] || themeClasses.light;

    const phoneNumbers = [
        { label: 'Sales', number: '+918899117706', available: 'Mon-Sat, 9AM-5PM' },
        { label: 'Support', number: '+918899117706', available: '24/7' },
        
    ];



    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative z-50 rounded-2xl w-full max-w-md ${currentTheme.bg} ${currentTheme.border} border overflow-hidden shadow-xl`}
                    >
                        {/* Header */}
                        <div className="p-6 text-center relative">
                            <div className="mb-4 flex justify-center">
                                <div className={`p-4 rounded-full ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} shadow-lg`}>
                                    <Phone className="w-8 h-8 text-blue-500" />
                                </div>
                            </div>
                            <h3 className={`text-xl font-bold ${currentTheme.text}`}>Call Now</h3>
                            <p className={`text-sm ${currentTheme.secondaryText}`}>Select a number to call</p>

                            <button
                                onClick={onClose}
                                className={`absolute top-4 right-4 p-1 rounded-full ${currentTheme.secondaryButton}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Phone Numbers */}
                        <div className="px-6 pb-6">
                            <div className={`rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} shadow-inner`}>
                                {phoneNumbers.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 cursor-pointer hover:bg-opacity-70 ${currentTheme.text}`}
                                        onClick={() => window.location.href = `tel:${item.number.replace(/\D/g, '')}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{item.label}</p>
                                                <p className={`text-sm ${currentTheme.secondaryText}`}>{item.number}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`text-xs mr-3 ${currentTheme.secondaryText}`}>{item.available}</span>
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`p-4 border-t ${currentTheme.border} flex justify-end`}>
                            <button
                                onClick={onClose}
                                className={`px-4 py-2 rounded-lg ${currentTheme.secondaryButton} transition-colors`}
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

export default CallNowModal;
