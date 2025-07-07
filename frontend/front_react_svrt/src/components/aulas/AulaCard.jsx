// src/components/aulas/AulaCard.jsx
import React from 'react';
import { COLORES_ESTADO, LABELS_ESTADO, ICONOS_ESTADO, getEstadoVisual } from '../../constants/aulaVirtual';

const AulaCard = ({ aula, onSelect, isSelected = false }) => {
  const estadoVisual = getEstadoVisual(aula.estado);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return 'No especificada';
    try {
      // Si es un string de tiempo como "14:30:00"
      if (typeof hora === 'string' && hora.includes(':')) {
        const [hours, minutes] = hora.split(':');
        return `${hours}:${minutes}`;
      }
      return hora;
    } catch {
      return hora;
    }
  };

  return (    <div 
      className={`
        relative bg-white rounded-xl shadow-lg border hover-lift-smooth ultra-smooth
        hover:shadow-xl hover-scale-elegant hover:border-tecsup-primary/30
        ${isSelected 
          ? 'border-tecsup-primary shadow-tecsup-primary/20 ring-2 ring-tecsup-primary/20' 
          : 'border-gray-200'
        }
        ${estadoVisual.border}
      `}
      onClick={() => onSelect?.(aula)}
    >
      {/* Header con código y estado */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-tecsup-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-tecsup-primary">
                {aula.codigo}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-tecsup-gray-dark">
                Aula Virtual {aula.codigo}
              </h3>
              <p className="text-sm text-tecsup-gray-medium">
                ID: {aula.id}
              </p>
            </div>
          </div>
          
          {/* Badge de estado especial para 'reservado' */}
          {aula.estado && aula.estado.toLowerCase() === 'reservado' && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-lg border border-red-600 bg-red-600 text-white z-10">
              <svg className="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 0V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2h-6zm6 12H6V10h12v10z"/></svg>
              <span className="font-semibold text-white drop-shadow-sm">Reservado</span>
            </div>
          )}
          {/* Badge de estado normal para otros estados */}
          {(!aula.estado || aula.estado.toLowerCase() !== 'reservado') && (
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5 shadow-md border-white/20 z-10 ${estadoVisual.badge}`}>
              <span className="text-lg">{estadoVisual.icon}</span>
              <span className="ml-1">{estadoVisual.label}</span>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="space-y-3">
          {/* Información de reserva si existe */}
          {aula.fecha_reserva && (
            <div className={`
              p-3 rounded-lg ${estadoVisual.bg} ${estadoVisual.border} border
            `}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-tecsup-gray-dark">Fecha:</span>
                  <span className={`ml-2 ${estadoVisual.text}`}>
                    {formatearFecha(aula.fecha_reserva)}
                  </span>
                </div>
                {(aula.hora_inicio || aula.hora_fin) && (
                  <div>
                    <span className="font-medium text-tecsup-gray-dark">Horario:</span>
                    <span className={`ml-2 ${estadoVisual.text}`}>
                      {formatearHora(aula.hora_inicio)} - {formatearHora(aula.hora_fin)}
                    </span>
                  </div>
                )}
              </div>
              
              {aula.motivo_reserva && (
                <div className="mt-2">
                  <span className="font-medium text-tecsup-gray-dark">Motivo:</span>
                  <p className={`mt-1 text-sm ${estadoVisual.text}`}>
                    {aula.motivo_reserva}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Información del profesor y curso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {aula.profesor && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tecsup-cyan-500/10 rounded-full flex items-center justify-center">
                  <span className="text-tecsup-cyan-600">👨‍🏫</span>
                </div>
                <div>
                  <p className="font-medium text-tecsup-gray-dark">Profesor</p>
                  <p className="text-tecsup-gray-medium">ID: {aula.profesor}</p>
                </div>
              </div>
            )}
            
            {aula.curso && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tecsup-success/10 rounded-full flex items-center justify-center">
                  <span className="text-tecsup-success">📚</span>
                </div>
                <div>
                  <p className="font-medium text-tecsup-gray-dark">Curso</p>
                  <p className="text-tecsup-gray-medium">ID: {aula.curso}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer con fecha de creación */}
      {aula.fecha_creacion && (
        <div className="px-6 py-3 bg-tecsup-gray-light/50 rounded-b-xl border-t">
          <p className="text-xs text-tecsup-gray-medium">
            Creada el {formatearFecha(aula.fecha_creacion)}
          </p>
        </div>
      )}

      {/* Indicador de selección */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-tecsup-primary rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default AulaCard;
