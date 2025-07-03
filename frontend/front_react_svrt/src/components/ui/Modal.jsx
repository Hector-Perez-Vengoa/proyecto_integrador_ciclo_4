// src/components/ui/Modal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-lg',
  showCloseButton = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
      // Pequeño delay para activar la animación de entrada
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // Esperar a que termine la animación antes de limpiar
      setTimeout(() => {
        setIsAnimating(false);
        document.body.style.overflow = 'unset';
      }, 300);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen && !isAnimating) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop con efecto difuminado elegante */}
      <div 
        className={`fixed inset-0 backdrop-blur-sm bg-gradient-to-br from-black/20 via-gray-900/30 to-black/40 transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal con animaciones fluidas */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} 
            transform transition-all duration-300 ease-out ${
              isVisible 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-8'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              {title && (
                <h3 className="text-xl font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-200 ease-out p-2 rounded-full hover:bg-gray-50 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Usar Portal para renderizar en el body
  return createPortal(modalContent, document.body);
};

export default Modal;
