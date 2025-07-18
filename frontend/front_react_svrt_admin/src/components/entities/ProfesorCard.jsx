import React, { useState } from 'react';

const ProfesorCard = ({ 
  profesor, 
  departamentos, 
  carreras, 
  cursos, 
  onEdit, 
  onDelete 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getDepartamentoNombre = (departamentoId) => {
    // Verificar si departamentoId es válido
    if (!departamentoId) return 'Sin departamento';
    
    // Si departamentos no está disponible o está vacío
    if (!departamentos || departamentos.length === 0) return 'Cargando departamento...';
    
    const dept = departamentos.find(d => d.id === departamentoId);
    return dept ? dept.nombre : `Departamento ID: ${departamentoId}`;
  };

  const getCarrerasNombres = (carrerasIds) => {
    // Verificar si hay carreras asignadas
    if (!carrerasIds || carrerasIds.length === 0) return 'Sin carreras asignadas';
    
    // Si carreras no está disponible o está vacío
    if (!carreras || carreras.length === 0) return 'Cargando carreras...';
    
    const nombreCarreras = carrerasIds.map(id => {
      const carrera = carreras.find(c => c.id === id);
      return carrera ? carrera.nombre : `Carrera ID: ${id}`;
    });
    
    return nombreCarreras.join(', ');
  };

  const getCursosNombres = (cursosIds) => {
    // Verificar si hay cursos asignados
    if (!cursosIds || cursosIds.length === 0) return 'Sin cursos asignados';
    
    // Si cursos no está disponible o está vacío
    if (!cursos || cursos.length === 0) return 'Cargando cursos...';
    
    const nombreCursos = cursosIds.map(id => {
      const curso = cursos.find(c => c.id === id);
      return curso ? curso.nombre : `Curso ID: ${id}`;
    });
    
    return nombreCursos.join(', ');
  };

  const getInitials = (nombres, apellidos) => {
    const initials = `${nombres?.charAt(0) || ''}${apellidos?.charAt(0) || ''}`;
    return initials.toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      {/* Vista básica - siempre visible */}
      <div className="flex flex-col items-center">
        {/* Avatar con iniciales (simulando foto) */}
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
          {getInitials(profesor.nombres, profesor.apellidos)}
        </div>
        
        {/* Nombre completo */}
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          {profesor.nombres} {profesor.apellidos}
        </h3>
        
        {/* Correo del profesor */}
        <p className="text-sm text-gray-600 mb-2">
          Correo: {profesor.correo}
        </p>

        {/* Botón para ver más detalles */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm font-medium mb-4 transition-colors duration-200"
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="border-t pt-4 space-y-3 animation-fade-in">
          <div>
            <span className="font-medium text-gray-700">Email:</span>
            <p className="text-gray-600 break-all">{profesor.correo}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Departamento:</span>
            <p className="text-gray-600">{getDepartamentoNombre(profesor.departamento)}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Carreras:</span>
            <p className="text-gray-600 text-sm">{getCarrerasNombres(profesor.carreras)}</p>
          </div>
          
          <div>
            <span className="font-medium text-gray-700">Cursos:</span>
            <p className="text-gray-600 text-sm">{getCursosNombres(profesor.cursos)}</p>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-center space-x-2 mt-4">
        {onEdit && (
          <button
            onClick={() => onEdit(profesor)}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Editar
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(profesor.id)}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfesorCard;
