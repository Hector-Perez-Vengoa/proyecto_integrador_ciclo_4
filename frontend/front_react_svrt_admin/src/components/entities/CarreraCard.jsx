import React, { useState } from 'react';

const CarreraCard = ({ carrera, departamentos, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Encontrar el departamento asociado
  const departamento = departamentos.find(d => d.id === carrera.departamento);

  return (
    <div className="bg-white rounded-xl shadow-custom hover:shadow-lg transition-all duration-300 p-6 card-hover">
      {/* Header de la carta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{carrera.nombre}</h3>
            <p className="text-sm text-gray-500">{carrera.codigo}</p>
          </div>
        </div>
        
        {/* Badge de estado */}
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
          Carrera Profesional
        </div>
      </div>

      {/* Información básica */}
      <div className="space-y-2 mb-4">
        {departamento && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Departamento: {departamento.nombre}</span>
          </div>
        )}
        
        {carrera.fecha_creacion && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Creada: {new Date(carrera.fecha_creacion).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Descripción (expandible) */}
      {expanded && carrera.descripcion && (
        <div className="border-t pt-4 mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{carrera.descripcion}</p>
        </div>
      )}

      {/* Información adicional expandible */}
      {expanded && (
        <div className="border-t pt-4 mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium text-gray-700">Código:</span>
              <p className="text-gray-600">{carrera.codigo}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <span className="font-medium text-gray-700">Estado:</span>
              <p className="text-green-600">Activa</p>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-4 border-t">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {expanded ? 'Ver menos' : 'Ver detalles'}
          <svg 
            className={`w-4 h-4 ml-1 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(carrera)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(carrera.id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarreraCard;
