// src/components/reservas/ReservaCard.jsx
import React from 'react';
import { formatDate, formatTime } from '../../utils/dateUtils';

const ReservaCard = ({ reserva, onCancelar, esFutura }) => {
  // Función para determinar el color de estado
  const getEstadoColor = (estado) => {
    switch (estado.toUpperCase()) {
      case 'ACTIVA':
      case 'CONFIRMADA':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NO_ASISTIDA':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'FINALIZADA':
      case 'COMPLETADA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Formatear fecha y hora para mostrar
  const fechaFormateada = formatDate(reserva.fechaReserva);
  const horaInicio = formatTime(reserva.horaInicio);
  const horaFin = formatTime(reserva.horaFin);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-4">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-800 mb-2 truncate flex-1">{reserva.aulaVirtualNombre || 'Aula sin nombre'}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
          {reserva.estado}
        </span>
      </div>
      
      <div className="mt-3 space-y-2">
        <div className="flex items-start">
          <span className="text-gray-500 w-24 flex-shrink-0">Fecha:</span>
          <span className="text-gray-800">{fechaFormateada}</span>
        </div>
        
        <div className="flex items-start">
          <span className="text-gray-500 w-24 flex-shrink-0">Horario:</span>
          <span className="text-gray-800">{horaInicio} - {horaFin}</span>
        </div>
        
        <div className="flex items-start">
          <span className="text-gray-500 w-24 flex-shrink-0">Curso:</span>
          <span className="text-gray-800 truncate">{reserva.cursoNombre || 'No especificado'}</span>
        </div>
        
        {reserva.motivo && (
          <div className="flex items-start">
            <span className="text-gray-500 w-24 flex-shrink-0">Motivo:</span>
            <span className="text-gray-800">{reserva.motivo}</span>
          </div>
        )}
        
        {reserva.motivoCancelacion && (
          <div className="flex items-start">
            <span className="text-gray-500 w-24 flex-shrink-0">Cancelación:</span>
            <span className="text-gray-800">{reserva.motivoCancelacion}</span>
          </div>
        )}
      </div>
      
      {esFutura && reserva.estado !== 'CANCELADA' && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => onCancelar(reserva.id)}
            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded border border-red-200 transition-colors"
          >
            Cancelar Reserva
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservaCard;
