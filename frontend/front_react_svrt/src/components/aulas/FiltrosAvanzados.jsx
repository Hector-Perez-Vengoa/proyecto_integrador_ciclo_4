import React, { useState } from 'react';

const FiltrosAvanzados = ({ onFiltrosChange, filtrosIniciales = {} }) => {
  const [filtros, setFiltros] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cursoId: '',
    codigo: '',
    descripcion: '',
    ...filtrosIniciales
  });

  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Lista de cursos de ejemplo
  const cursosDisponibles = [
    { id: 1, nombre: 'Programación Orientada a Objetos' },
    { id: 2, nombre: 'Base de Datos' },
    { id: 3, nombre: 'Desarrollo Web Frontend' },
    { id: 4, nombre: 'Desarrollo Web Backend' },
    { id: 5, nombre: 'Configuración de Redes' },
    { id: 6, nombre: 'Seguridad Informática' },
    { id: 7, nombre: 'Gestión de Calidad' },
    { id: 8, nombre: 'Lean Manufacturing' },
    { id: 9, nombre: 'Diseño Mecánico CAD' },
    { id: 10, nombre: 'Automatización Industrial' },
    { id: 11, nombre: 'Gestión Empresarial' },
    { id: 12, nombre: 'Marketing Digital' }
  ];

  // Manejar cambios en los filtros
  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: valor
    };
    setFiltros(nuevosFiltros);
    
    // Notificar cambios al componente padre
    onFiltrosChange(nuevosFiltros);
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    const filtrosVacios = {
      fecha: '',
      horaInicio: '',
      horaFin: '',
      cursoId: '',
      codigo: '',
      descripcion: ''
    };
    setFiltros(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  // Obtener fecha actual en formato YYYY-MM-DD
  const fechaActual = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          🔍 Filtros de Búsqueda
        </h3>
        <button
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {mostrarFiltrosAvanzados ? '🔼 Ocultar Avanzados' : '🔽 Mostrar Avanzados'}
        </button>
      </div>

      {/* Filtros básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Aula
          </label>
          <input
            type="text"
            value={filtros.codigo}
            onChange={(e) => handleFiltroChange('codigo', e.target.value)}
            placeholder="Ej: A1, A2, B1..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <input
            type="text"
            value={filtros.descripcion}
            onChange={(e) => handleFiltroChange('descripcion', e.target.value)}
            placeholder="Buscar en descripción..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="border-t pt-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            🗓️ Filtros Avanzados por Fecha y Horario
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={filtros.fecha}
                onChange={(e) => handleFiltroChange('fecha', e.target.value)}
                min={fechaActual}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Inicio
              </label>
              <input
                type="time"
                value={filtros.horaInicio}
                onChange={(e) => handleFiltroChange('horaInicio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Fin
              </label>
              <input
                type="time"
                value={filtros.horaFin}
                onChange={(e) => handleFiltroChange('horaFin', e.target.value)}
                min={filtros.horaInicio}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curso
              </label>
              <select
                value={filtros.cursoId}
                onChange={(e) => handleFiltroChange('cursoId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los cursos</option>
                {cursosDisponibles.map(curso => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Información de ayuda */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-blue-400">ℹ️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Filtros avanzados:</strong> Busca aulas disponibles en una fecha y hora específica. 
                  Los filtros de fecha/hora te mostrarán solo las aulas que NO tienen reservas conflictivas en ese momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <button
          onClick={limpiarFiltros}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          🗑️ Limpiar Filtros
        </button>
        
        {/* Indicador de filtros activos */}
        {Object.values(filtros).some(valor => valor !== '') && (
          <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm">
            <span className="mr-2">✅</span>
            Filtros aplicados: {Object.values(filtros).filter(valor => valor !== '').length}
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltrosAvanzados;
