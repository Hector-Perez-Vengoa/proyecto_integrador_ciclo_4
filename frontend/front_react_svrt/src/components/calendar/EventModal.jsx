// src/components/calendar/EventModal.jsx
import React, { useState } from 'react';
import { formatDate, formatTime, calculateDuration, formatEstado } from '../../utils/calendarUtils';
import ReservaCancelModal from '../reservas/ReservaCancelModal';
import Modal from '../ui/Modal';

/**
 * Modal para mostrar los detalles de un evento/reserva
 * Permite ver información completa y cancelar la reserva si es posible
 */
const EventModal = ({ 
  isOpen, 
  onClose, 
  event, 
  onCancel,
  loading = false 
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!isOpen || !event) return null;

  const eventData = event.extendedProps?.reservaData || {};
  const startDate = event.start;
  const endDate = event.end || event.start;
  
  // Extraer información del evento
  const fechaReserva = startDate.toISOString().split('T')[0];
  const horaInicio = startDate.toTimeString().substring(0, 5);
  const horaFin = endDate.toTimeString().substring(0, 5);
  const duracion = calculateDuration(horaInicio, horaFin);
  
  // Determinar si se puede cancelar
  const ahora = new Date();
  const fechaHoraReserva = new Date(startDate);
  const puedeSerCancelada = fechaHoraReserva > ahora && 
                           event.extendedProps?.estado !== 'CANCELADA' &&
                           event.extendedProps?.estado !== 'FINALIZADA';

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async (motivo) => {
    if (onCancel) {
      const result = await onCancel(event.id, motivo);
      if (result.success) {
        setShowCancelModal(false);
        onClose();
      }
    }
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Detalles de la Reserva"
        maxWidth="max-w-md"
      >
        {/* Content */}
        <div className="space-y-4">
          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Estado:</span>
            <span 
              className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoClasses(event.extendedProps?.estado)}`}
            >
              {formatEstado(event.extendedProps?.estado)}
            </span>
          </div>

          {/* Información básica */}
          <div className="grid grid-cols-1 gap-3">
            <InfoRow label="ID de Reserva" value={`#${event.id}`} />
            <InfoRow label="Aula Virtual" value={event.extendedProps?.aula} />
            <InfoRow label="Curso" value={event.extendedProps?.curso} />
            <InfoRow label="Fecha" value={formatDate(fechaReserva)} />
            <InfoRow label="Hora de Inicio" value={formatTime(horaInicio)} />
            <InfoRow label="Hora de Fin" value={formatTime(horaFin)} />
            <InfoRow label="Duración" value={duracion} />
            
            {eventData.motivo && (
              <InfoRow label="Motivo" value={eventData.motivo} />
            )}
            
            {eventData.profesorNombre && (
              <InfoRow label="Profesor" value={eventData.profesorNombre} />
            )}
            
            {eventData.fechaCreacion && (
              <InfoRow 
                label="Fecha de Creación" 
                value={formatDate(eventData.fechaCreacion)} 
              />
            )}
          </div>

          {/* Información adicional */}
          {eventData.observaciones && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Observaciones:</h4>
              <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
                {eventData.observaciones}
              </p>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={loading}
            >
              Cerrar
            </button>
            
            {puedeSerCancelada && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Cancelando...' : 'Cancelar Reserva'}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de cancelación */}
      <ReservaCancelModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
};

/**
 * Componente helper para mostrar información en filas
 */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="text-sm font-medium text-gray-600 w-1/3">{label}:</span>
    <span className="text-sm text-gray-900 w-2/3 text-right">{value || 'N/A'}</span>
  </div>
);

/**
 * Obtiene las clases CSS para el estado
 */
const getEstadoClasses = (estado) => {
  const classes = {
    'CONFIRMADA': 'bg-green-100 text-green-800',
    'ACTIVA': 'bg-green-100 text-green-800',
    'PENDIENTE': 'bg-yellow-100 text-yellow-800',
    'CANCELADA': 'bg-red-100 text-red-800',
    'FINALIZADA': 'bg-gray-100 text-gray-800',
    'NO_ASISTIDA': 'bg-red-100 text-red-800'
  };
  
  return classes[estado] || 'bg-blue-100 text-blue-800';
};

export default EventModal;
