// src/components/calendar/CalendarToolbar.jsx
import React from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Grid3X3, 
  List, 
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

/**
 * Barra de herramientas del calendario
 * Incluye navegación, cambio de vista, filtros y acciones
 */
const CalendarToolbar = ({
  currentDate,
  view,
  onViewChange,
  onPrevClick,
  onNextClick,
  onTodayClick,
  onRefresh,
  loading,
  filters,
  onFilterChange,
  onExport
}) => {  /**
   * Formatea la fecha actual según la vista
   */
  const formatCurrentDate = () => {
    if (!currentDate) {
      return 'Fecha no disponible';
    }
    
    const date = new Date(currentDate);
    
    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    const options = { year: 'numeric', month: 'long' };
    
    if (view === 'timeGridWeek') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    
    if (view === 'timeGridDay') {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    
    // Para vista de mes (dayGridMonth) y otros casos
    return date.toLocaleDateString('es-ES', options);
  };

  const viewOptions = [
    { key: 'dayGridMonth', label: 'Mes', icon: Grid3X3 },
    { key: 'timeGridWeek', label: 'Semana', icon: Calendar },
    { key: 'timeGridDay', label: 'Día', icon: Clock },
    { key: 'listWeek', label: 'Lista', icon: List }
  ];

  const statusFilters = [
    { key: 'all', label: 'Todas', color: 'bg-gray-500' },
    { key: 'CONFIRMADA', label: 'Confirmadas', color: 'bg-green-500' },
    { key: 'PENDIENTE', label: 'Pendientes', color: 'bg-yellow-500' },
    { key: 'CANCELADA', label: 'Canceladas', color: 'bg-red-500' },
    { key: 'FINALIZADA', label: 'Finalizadas', color: 'bg-gray-400' }
  ];  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
      {/* Fila superior: Navegación y título */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 mb-4">
        {/* Navegación de fecha */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-50 rounded-lg p-1">
            <button
              onClick={onPrevClick}
              className="p-2 hover:bg-white rounded-md transition-colors"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={onTodayClick}
              className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors whitespace-nowrap"
            >
              Hoy
            </button>
            
            <button
              onClick={onNextClick}
              className="p-2 hover:bg-white rounded-md transition-colors"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Título de fecha actual */}
          <h2 className="text-xl font-semibold text-gray-900 capitalize truncate">
            {formatCurrentDate()}
          </h2>
        </div>

        {/* Acciones */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onExport && (
            <button
              onClick={onExport}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Exportar PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>{/* Fila inferior: Controles de vista y filtros - Responsive */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
        {/* Selector de vista */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Vista:</span>
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {viewOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => onViewChange(option.key)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center space-x-2 whitespace-nowrap min-w-0 ${
                    view === option.key
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtros de estado - Responsive */}
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filtros:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {statusFilters.map(filter => (
              <button
                key={filter.key}
                onClick={() => onFilterChange('status', filter.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center space-x-2 transition-all duration-200 whitespace-nowrap ${
                  filters?.status === filter.key || (filter.key === 'all' && !filters?.status)
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-200 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${filter.color}`} />
                <span className="truncate">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>      {/* Indicador de carga */}
      {loading && (
        <div className="mt-3 flex items-center space-x-2 text-sm text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Cargando reservas...</span>
        </div>
      )}
    </div>
  );
};

export default CalendarToolbar;
