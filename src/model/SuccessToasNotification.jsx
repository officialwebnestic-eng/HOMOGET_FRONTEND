import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

 const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toastTypes = {
    success: {
      icon: (
        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M5 13l4 4L19 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bg: 'bg-green-50',
      border: 'border-l-4 border-green-500',
      text: 'text-green-700',
    },
    error: {
      icon: (
        <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bg: 'bg-red-50',
      border: 'border-l-4 border-red-500',
      text: 'text-red-700',
    },
    info: {
      icon: (
        <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bg: 'bg-blue-50',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-700',
    },
    warning: {
      icon: (
        <svg className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 9v2m0 4h.01M6.938 20h10.124c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 17c-.77 1.333.192 3 1.732 3z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      bg: 'bg-yellow-50',
      border: 'border-l-4 border-yellow-500',
      text: 'text-yellow-700',
    },
  };

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();

  
    setToasts((prev) => {
      const updated = [...prev];
      if (updated.length >= 3) {
        updated.shift(); 
      }
      return [...updated, { id, message, duration, ...toastTypes[type] }];
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };
  
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}


      <div className="fixed top-4 right-4 space-y-4 z-50 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`relative p-4 rounded-lg shadow-lg flex items-start transform transition-all duration-500 ease-out animate-slideInDown ${toast.bg} ${toast.border}`}
          >
    
            <div className="mr-3">{toast.icon}</div>

          
            <div className="flex-1">
              <p className={`font-semibold ${toast.text}`}>{toast.message}</p>
              <div className="w-full h-1 bg-gray-200 mt-2 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 animate-progressBar"
                  style={{ animationDuration: `${toast.duration}ms` }}
                />
              </div>
            </div>

            <button onClick={() => removeToast(toast.id)} className="ml-3 text-gray-400 hover:text-gray-600">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 6l8 8M6 14L14 6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


  export default ToastProvider

export const useToast = () => useContext(ToastContext);
