// src/components/reservas/ReservaCancelModal.jsx
import React, { useState } from 'react';
import Modal from '../ui/Modal';

const ReservaCancelModal = ({ isOpen, onClose, onConfirm }) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!motivo.trim()) {
      setError('Por favor, ingresa un motivo para la cancelación');
      return;
    }
    
    onConfirm(motivo);
    setMotivo('');
    setError('');
  };

  const handleClose = () => {
    setMotivo('');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cancelar Reserva">
      <div className="p-4">
        <p className="mb-4 text-gray-600">
          ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.
        </p>
        
        <div className="mb-4">
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de la cancelación *
          </label>
          <textarea
            id="motivo"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Indica el motivo por el cual estás cancelando esta reserva"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          ></textarea>
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmar Cancelación
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReservaCancelModal;
