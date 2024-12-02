'use client';
import React, { ReactNode, useEffect } from 'react';
import { XIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle clicking outside or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Return null if not open
  if (!isOpen) return null;

  // Determine modal size
  const sizeClasses = {
    'sm': 'max-w-md',
    'md': 'max-w-lg',
    'lg': 'max-w-3xl',
    'xl': 'max-w-6xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 dark:bg-black/60" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className={`
          relative w-full mx-auto rounded-xl shadow-2xl 
          bg-white dark:bg-neutral-800 
          ${sizeClasses[size]}
          transform transition-all duration-300 ease-in-out
          scale-100 opacity-100
        `}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 rounded-t-xl">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            {title}
          </h3>
          <button
            className="
              p-2 ml-auto bg-transparent border-0 text-neutral-500 
              hover:bg-neutral-100 dark:hover:bg-neutral-700 
              rounded-full transition-colors
            "
            onClick={onClose}
            aria-label="Close"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Optional Footer - can be added via children or prop */}
        {/* <div className="flex items-center justify-end p-6 border-t border-neutral-200 dark:border-neutral-700 rounded-b-xl">
          Additional actions can be placed here
        </div> */}
      </div>
    </div>
  );
};

export default Modal;