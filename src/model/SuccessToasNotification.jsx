import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toastTypes = {
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      color: 'emerald',
      label: 'Success'
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
      color: 'rose',
      label: 'Error'
    },
    info: {
      icon: <Info className="h-5 w-5 text-blue-500" />,
      color: 'blue',
      label: 'Info'
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      color: 'amber',
      label: 'Warning'
    },
  };

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const config = toastTypes[type] || toastTypes.info;

    setToasts((prev) => {
      const updated = prev.length >= 3 ? prev.slice(1) : prev;
      return [...updated, { id, message, duration, ...config }];
    });

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                relative overflow-hidden group
                backdrop-blur-md bg-white/90 dark:bg-gray-900/90 
                border border-gray-200 dark:border-gray-800 
                shadow-2xl rounded-2xl p-4 flex items-start gap-3
              `}>
                {/* Side Color Strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-${toast.color}-500`} />

                {/* Icon Section */}
                <div className={`p-2 rounded-xl bg-${toast.color}-500/10`}>
                  {toast.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <h4 className={`text-sm font-bold text-gray-900 dark:text-gray-100`}>
                    {toast.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {toast.message}
                  </p>
                  
                  {/* Modern Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: toast.duration / 1000, ease: "linear" }}
                      className={`h-full bg-${toast.color}-500`}
                    />
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
export default ToastProvider;