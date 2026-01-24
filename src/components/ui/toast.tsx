"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  isVisible: boolean;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
}

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-black",
  info: "bg-blue-500 text-white",
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <X size={20} />,
  warning: <AlertCircle size={20} />,
  info: <Info size={20} />,
};

export const Toast: React.FC<ToastProps> = ({
  message,
  isVisible,
  variant = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`${variantStyles[variant]} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80`}>
        <div className="flex-shrink-0">{variantIcons[variant]}</div>
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 rounded-full p-1 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast Context
interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; isVisible: boolean; variant: ToastVariant }>({
    message: "",
    isVisible: false,
    variant: "success",
  });

  const showToast = (message: string, variant: ToastVariant = "success") => {
    setToast({ message, isVisible: true, variant });
  };

  const hideToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} isVisible={toast.isVisible} variant={toast.variant} onClose={hideToast} />
    </ToastContext.Provider>
  );
};
