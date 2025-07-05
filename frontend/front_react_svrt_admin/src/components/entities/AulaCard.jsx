import React, { useState } from 'react';

const AulaCard = ({ 
  aula, 
  onEdit, 
  onDelete,
  onChangeStatus,
  estadoOptions 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getEstadoInfo = (estado) => {
    const estadoOption = estadoOptions.find(e => e.value === estado);
    return estadoOption || { value: estado, label: estado };
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-500';
      case 'reservada':
        return 'bg-yellow-500';
      case 'en_uso':
        return 'bg-blue-500';
      case 'en_mantenimiento':
        return 'bg-orange-500';
      case 'inactiva':
        return 'bg-gray-500';
      case 'bloqueada':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'reservada':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_uso':
        return 'bg-blue-100 text-blue-800';
      case 'en_mantenimiento':
        return 'bg-orange-100 text-orange-800';
      case 'inactiva':
        return 'bg-gray-100 text-gray-800';
      case 'bloqueada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onChangeStatus) {
      onChangeStatus(aula.id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 relative">
      {/* Indicador de estado en la esquina */}
      <div className={`absolute top-3 right-3 w-4 h-4 rounded-full ${getEstadoColor(aula.estado)}`}></div>
      
      {/* Vista básica - siempre visible */}
      <div className="flex flex-col items-center">
        {/* Icono del aula virtual */}
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
          <span className="text-sm">AV</span>
          <span className="text-lg">{aula.codigo}</span>
        </div>
        
        {/* Código del aula */}
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          Aula Virtual {aula.codigo}
        </h3>
        
        {/* Estado actual */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${getStatusBadgeColor(aula.estado)}`}>
          {getEstadoInfo(aula.estado).label}
        </span>

        {/* Descripción breve */}
        {aula.descripcion && (
          <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
            {aula.descripcion}
          </p>
        )}

        {/* Botón para ver más detalles */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-2 rounded-md text-sm font-medium mb-4 transition-colors duration-200"
        >
          {showDetails ? 'Ocultar opciones' : 'Ver opciones'}
        </button>
      </div>

      {/* Opciones expandibles */}
      {showDetails && (
        <div className="border-t pt-4 space-y-4 animation-fade-in">
          {/* Cambio rápido de estado */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Cambiar Estado:</h4>
            <div className="grid grid-cols-2 gap-2">
              {estadoOptions.map(estado => (
                <button
                  key={estado.value}
                  onClick={() => handleStatusChange(estado.value)}
                  disabled={aula.estado === estado.value}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
                    aula.estado === estado.value
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `${getStatusBadgeColor(estado.value)} hover:opacity-80 cursor-pointer`
                  }`}
                >
                  {estado.label}
                </button>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          {aula.fecha_creacion && (
            <div>
              <span className="font-medium text-gray-700">Fecha de creación:</span>
              <p className="text-gray-600 text-sm">
                {new Date(aula.fecha_creacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-center space-x-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(aula)}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(aula.id)}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default AulaCard;
