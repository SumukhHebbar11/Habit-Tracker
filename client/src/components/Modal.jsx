import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "md",
  className = "" 
}) => {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleEscapeKey = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isVisible, handleEscapeKey]);

  if (!mounted || !isVisible) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const modal = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{ animation: isOpen ? 'fadeIn 0.2s ease-out' : 'fadeOut 0.2s ease-in' }}
    >
      <div 
        className={`
          bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} 
          transform transition-all duration-200 ${className}
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        style={{
          animation: isOpen ? 'slideIn 0.2s ease-out' : 'slideOut 0.2s ease-in'
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default Modal;
