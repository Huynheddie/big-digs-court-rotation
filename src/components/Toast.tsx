import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  id: string;
  index: number;
  eventId?: string;
  onClick?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  id,
  index,
  eventId,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const typeStyles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      message: 'text-green-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      message: 'text-red-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      message: 'text-yellow-700'
    },
    info: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      icon: 'text-gray-600',
      title: 'text-gray-900',
      message: 'text-gray-700'
    }
  };

  const styles = typeStyles[type];

  return (
    <motion.div
      layout
      initial={{ 
        opacity: 0, 
        y: -50, 
        scale: 0.95,
        x: 20
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        x: 0
      }}
      exit={{ 
        opacity: 0, 
        y: -20, 
        scale: 0.95,
        x: 20
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      style={{
        zIndex: 1000 - index,
        transformOrigin: "top right"
      }}
      className={`${styles.bg} ${styles.border} border rounded-2xl shadow-lg backdrop-blur-sm max-w-sm w-full ${onClick ? 'cursor-pointer' : ''}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
                onClick={(e) => {
            if (onClick) {
              onClick();
            }
          }}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <motion.span 
            className={`text-lg flex-shrink-0 ${styles.icon}`} 
            aria-hidden="true"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
          >
            {icons[type]}
          </motion.span>
          <div className="flex-1 min-w-0">
            <motion.h4 
              className={`font-semibold text-sm ${styles.title}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h4>
            {message && (
              <motion.p 
                className={`text-sm mt-1 ${styles.message}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </motion.p>
            )}
          </div>
          <motion.button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className={`flex-shrink-0 text-lg font-bold leading-none opacity-70 hover:opacity-100 transition-opacity ${styles.title}`}
            aria-label="Close notification"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            ×
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Toast context and provider
interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose' | 'index'>) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose' | 'index'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      index: toasts.length,
      onClose: () => removeToast(id)
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              style={{ pointerEvents: 'auto' }}
              className="pointer-events-auto"
            >
              <Toast 
                {...toast} 
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}; 