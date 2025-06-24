// src/components/ui/AlertModal.jsx
import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import Modal from './Modal';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'warning', // 'success', 'error', 'warning', 'info'
  confirmText = 'Entendido',
  showConfirmButton = true 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-md"
      showCloseButton={false}
    >
      <div className="text-center">
        {/* Icono */}
        <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} ${colors.border} border mb-4`}>
          {getIcon()}
        </div>

        {/* Título */}
        {title && (
          <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
            {title}
          </h3>
        )}

        {/* Mensaje */}
        <div className={`text-sm ${colors.text} mb-6`}>
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            message
          )}
        </div>

        {/* Botón de confirmación */}
        {showConfirmButton && (
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors.button}`}
          >
            {confirmText}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AlertModal;
