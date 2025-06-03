// src/components/aulas/AulaFilters.jsx
import React from 'react';
import { FILTROS_AULA, ORDENAMIENTO, LABELS_ESTADO } from '../../constants/aulaVirtual';

const AulaFilters = ({ 
  filtroActual, 
  onFiltroChange, 
  ordenamiento, 
  onOrdenamientoChange,
  busqueda,
  onBusquedaChange,
  totalAulas,
  aulasVisibles
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-tecsup-gray-dark mb-2">
            Filtrar Aulas Virtuales
          </h2>
          <p className="text-sm text-tecsup-gray-medium">
            Mostrando {aulasVisibles} de {totalAulas} aulas
          </p>
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-tecsup-success rounded-full"></div>
            <span className="text-sm text-tecsup-gray-medium">Disponibles</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-tecsup-cyan-500 rounded-full"></div>
            <span className="text-sm text-tecsup-gray-medium">Reservadas</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-tecsup-gray-dark mb-2">
            Buscar Aula
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-tecsup-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar por código, ID o motivo..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="
                w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary
                transition-all duration-200 text-sm
              "
            />
            {busqueda && (
              <button
                onClick={() => onBusquedaChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-tecsup-gray-medium hover:text-tecsup-danger transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-tecsup-gray-dark mb-2">
            Estado
          </label>
          <select
            value={filtroActual}
            onChange={(e) => onFiltroChange(e.target.value)}
            className="
              w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary
              transition-all duration-200 text-sm bg-white
            "
          >
            <option value={FILTROS_AULA.TODOS}>Todos los estados</option>
            <option value={FILTROS_AULA.DISPONIBLES}>Solo disponibles</option>
            <option value={FILTROS_AULA.RESERVADAS}>Solo reservadas</option>
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <label className="block text-sm font-medium text-tecsup-gray-dark mb-2">
            Ordenar por
          </label>
          <select
            value={ordenamiento}
            onChange={(e) => onOrdenamientoChange(e.target.value)}
            className="
              w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary
              transition-all duration-200 text-sm bg-white
            "
          >
            <option value={ORDENAMIENTO.CODIGO_ASC}>Código (A-Z)</option>
            <option value={ORDENAMIENTO.CODIGO_DESC}>Código (Z-A)</option>
            <option value={ORDENAMIENTO.ESTADO_ASC}>Estado (A-Z)</option>
            <option value={ORDENAMIENTO.ESTADO_DESC}>Estado (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm font-medium text-tecsup-gray-dark mb-3">Filtros rápidos:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFiltroChange(FILTROS_AULA.DISPONIBLES)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${filtroActual === FILTROS_AULA.DISPONIBLES
                ? 'bg-tecsup-success text-white shadow-md'
                : 'bg-tecsup-success/10 text-tecsup-success hover:bg-tecsup-success/20'
              }
            `}
          >
            ✅ Solo disponibles
          </button>
          
          <button
            onClick={() => onFiltroChange(FILTROS_AULA.RESERVADAS)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${filtroActual === FILTROS_AULA.RESERVADAS
                ? 'bg-tecsup-cyan-500 text-white shadow-md'
                : 'bg-tecsup-cyan-500/10 text-tecsup-cyan-600 hover:bg-tecsup-cyan-500/20'
              }
            `}
          >
            🔒 Solo reservadas
          </button>
          
          <button
            onClick={() => {
              onFiltroChange(FILTROS_AULA.TODOS);
              onBusquedaChange('');
              onOrdenamientoChange(ORDENAMIENTO.CODIGO_ASC);
            }}
            className="
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              bg-tecsup-gray-light text-tecsup-gray-medium hover:bg-gray-200
            "
          >
            🔄 Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default AulaFilters;
