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
    const dept = departamentos.find(d => d.id === departamentoId);
    return dept ? dept.nombre : 'Sin departamento';
  };

  const getCarrerasNombres = (carrerasIds) => {
    if (!carrerasIds || carrerasIds.length === 0) return 'Sin carreras asignadas';
    return carrerasIds.map(id => {
      const carrera = carreras.find(c => c.id === id);
      return carrera ? carrera.nombre : 'Carrera no encontrada';
    }).join(', ');
  };

  const getCursosNombres = (cursosIds) => {
    if (!cursosIds || cursosIds.length === 0) return 'Sin cursos asignados';
    return cursosIds.map(id => {
      const curso = cursos.find(c => c.id === id);
      return curso ? curso.nombre : 'Curso no encontrado';
    }).join(', ');
  };

  const getInitials = (nombres, apellidos) => {
    const initials = `${nombres?.charAt(0) || ''}${apellidos?.charAt(0) || ''}`;
    return initials.toUpperCase();
  };

  const formatLastLogin = (lastLoginDate) => {
    if (!lastLoginDate) return 'Nunca conectado';
    
    const date = new Date(lastLoginDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
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
        
        {/* Código del profesor */}
        <p className="text-sm text-gray-600 mb-2">
          Código: {profesor.codigo}
        </p>

        {/* Estado activo y última conexión */}
        <div className="flex flex-col items-center space-y-2 mb-4">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${profesor.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-xs font-medium ${profesor.is_active ? 'text-green-700' : 'text-red-700'}`}>
              {profesor.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Última conexión: {formatLastLogin(profesor.last_login)}
          </p>
        </div>

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

          {/* Información adicional de estado */}
          <div className="border-t pt-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Estado:</span>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${profesor.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={profesor.is_active ? 'text-green-700' : 'text-red-700'}>
                    {profesor.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Conexión:</span>
                <p className="text-gray-600 mt-1">{formatLastLogin(profesor.last_login)}</p>
                {profesor.last_login && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(profesor.last_login).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
            </div>
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
