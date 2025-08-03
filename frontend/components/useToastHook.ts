import React from 'react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  id: string;
  index: number;
  eventId?: string;
  onClick?: () => void;
}

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

export { ToastContext };
export type { ToastContextType, ToastProps }; 