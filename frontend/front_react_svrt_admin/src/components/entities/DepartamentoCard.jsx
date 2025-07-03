import React, { useState } from 'react';

const DepartamentoCard = ({ departamento, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-custom hover:shadow-lg transition-all duration-300 p-6 card-hover">
      {/* Header de la carta */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{departamento.nombre}</h3>
            <p className="text-sm text-gray-500">Departamento Académico</p>
          </div>
        </div>
        
        {/* Badge de estado */}
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
          Activo
        </div>
      </div>

      {/* Información básica */}
      <div className="space-y-2 mb-4">
        {departamento.jefe && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Jefe: {departamento.jefe}</span>
          </div>
        )}
        
        {departamento.fecha_creacion && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Creado: {new Date(departamento.fecha_creacion).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Descripción (expandible) */}
      {expanded && departamento.descripcion && (
        <div className="border-t pt-4 mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{departamento.descripcion}</p>
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
            onClick={() => onEdit(departamento)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(departamento.id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartamentoCard;
