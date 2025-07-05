// src/pages/dashboard/CalendarioPage.jsx
import React, { useState, useRef } from 'react';
import { Calendar, Plus, AlertCircle } from 'lucide-react';
import { useCalendar } from '../../hooks/useCalendar';
import CalendarToolbar from '../../components/calendar/CalendarToolbar';
import CalendarView from '../../components/calendar/CalendarView';
import EventModal from '../../components/calendar/EventModal';
import CreateReservaModal from '../../components/calendar/CreateReservaModal';
import AlertModal from '../../components/ui/AlertModal';
import { useAuth } from '../../hooks/useAuth';
import { calendarService } from '../../services/calendarService';

/**
 * Página principal del calendario de reservas
 * Integra todos los componentes del calendario y maneja el estado global
 */
const CalendarioPage = () => {
  const { user } = useAuth();
  const calendarRef = useRef(null);
  
  // Estado para el modal de alertas
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  // Función para mostrar alertas
  const showAlert = (message, title = 'Aviso', type = 'warning') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Función para cerrar el modal de alerta
  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };
    // Hook del calendario con toda la lógica
  const {
    events,
    loading,
    error,
    selectedEvent,
    showEventModal,
    showCreateModal,
    selectedDate,
    blockedDates,
    calendarView,
    handleEventClick,
    handleDateClick,
    closeEventModal,
    closeCreateModal,
    cancelarReserva,
    crearReserva,
    loadReservas,
    changeView
  } = useCalendar(showAlert);
  // Estados locales para la UI
  const [filters, setFilters] = useState({
    status: 'all',
    aula: '',
    curso: ''
  });  const [currentDate, setCurrentDate] = useState(() => {
    // Asegurar que inicie con la fecha actual
    const today = new Date();
    today.setHours(12, 0, 0, 0); // Establecer a mediodía para evitar problemas de zona horaria
    return today;
  });
  const [availableAulas, setAvailableAulas] = useState([]);
  const [availableCursos, setAvailableCursos] = useState([]);
  // Efecto para sincronizar la fecha cuando cambia la vista del calendario
  React.useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      if (api && api.view) {
        const viewDate = api.view.currentStart || api.view.activeStart || new Date();
        const newDate = new Date(viewDate);
        newDate.setHours(12, 0, 0, 0);
        setCurrentDate(newDate);
      }
    }
  }, [calendarView]);

  /**
   * Maneja el cambio de filtros
   */
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  /**
   * Maneja el cambio de vista del calendario
   */
  const handleViewChange = (newView) => {
    changeView(newView);
  };  /**
   * Maneja la navegación del calendario
   */
  const handlePrevClick = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.prev();
      // Actualizar la fecha después de navegar
      setTimeout(() => {
        const view = api.view;
        if (view.currentStart) {
          const newDate = new Date(view.currentStart);
          newDate.setHours(12, 0, 0, 0);
          setCurrentDate(newDate);
        }
      }, 100);
    }
  };

  const handleNextClick = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.next();
      // Actualizar la fecha después de navegar
      setTimeout(() => {
        const view = api.view;
        if (view.currentStart) {
          const newDate = new Date(view.currentStart);
          newDate.setHours(12, 0, 0, 0);
          setCurrentDate(newDate);
        }
      }, 100);
    }
  };

  const handleTodayClick = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      api.today();
      // Actualizar a la fecha actual
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      setCurrentDate(today);
    }
  };  /**
   * Maneja el cambio de rango de fechas del calendario
   */
  const handleDateRangeChange = (dateInfo) => {
    // Actualizar la fecha actual basándose en la vista del calendario
    if (dateInfo.start) {
      const newDate = new Date(dateInfo.start);
      newDate.setHours(12, 0, 0, 0); // Establecer a mediodía para evitar problemas de zona horaria
      setCurrentDate(newDate);
    }
  };

  /**
   * Maneja la actualización de reservas
   */
  const handleRefresh = () => {
    loadReservas();
  };

  /**
   * Maneja la exportación del calendario (funcionalidad futura)
   */
  const handleExport = () => {
    console.log('Export calendar - feature to implement');
    // TODO: Implementar exportación a PDF
  };  // Cargar datos adicionales del backend
  React.useEffect(() => {
    const loadAdditionalData = async () => {
      try {
        // Cargar aulas virtuales disponibles (sin filtros iniciales)
        const aulas = await calendarService.getAulasDisponibles();
        setAvailableAulas(aulas);
        
        // Cargar cursos del usuario autenticado
        const cursos = await calendarService.getCursosProfesor();
        setAvailableCursos(cursos);
      } catch (error) {
        console.error('Error loading additional data:', error);
        // Establecer arrays vacíos en caso de error para evitar undefined
        setAvailableAulas([]);
        setAvailableCursos([]);
      }
    };
    
    if (user?.id) {
      loadAdditionalData();
    }
  }, [user?.id]);

  /**
   * Función para recargar aulas disponibles basado en fecha y hora seleccionada
   */
  const reloadAulasDisponibles = async (fecha, horaInicio, horaFin) => {
    try {
      const aulas = await calendarService.getAulasDisponibles(fecha, horaInicio, horaFin);
      setAvailableAulas(aulas);
    } catch (error) {
      console.error('Error reloading aulas disponibles:', error);
      setAvailableAulas([]);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Error al cargar el calendario
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 page-transition-elegant p-6">      
    {/* Header de la página - Responsive */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Calendario de Reservas
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Gestiona tus reservas de aulas virtuales
                </p>
              </div>
            </div>
              
          </div>
        </div>
      </div>

      {/* Contenido principal - Responsive */}      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Toolbar del calendario */}
          <CalendarToolbar
            currentDate={currentDate}
            view={calendarView}
            onViewChange={handleViewChange}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
            onTodayClick={handleTodayClick}
            onRefresh={handleRefresh}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />

          {/* Calendario principal */}
          <div className="p-3 sm:p-6">
            <CalendarView
              ref={calendarRef}
              events={events}
              view={calendarView}
              loading={loading}
              blockedDates={blockedDates}
              filters={filters}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
              onViewChange={handleViewChange}
              onDateRangeChange={handleDateRangeChange}
              allowSelection={true}
              allowEventDrop={false}
            />
          </div>
        </div>

        {/* Estadísticas rápidas - Responsive */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Reservas
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Confirmadas
                </p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">
                  {events.filter(e => e.extendedProps?.estado === 'CONFIRMADA').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Pendientes
                </p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                  {events.filter(e => e.extendedProps?.estado === 'PENDIENTE').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">⏳</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Esta Semana
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {events.filter(e => {
                    const eventDate = new Date(e.start);
                    const now = new Date();
                    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return eventDate >= startOfWeek && eventDate <= endOfWeek;
                  }).length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Modales */}
      <EventModal
        isOpen={showEventModal}
        onClose={closeEventModal}
        event={selectedEvent}
        onCancel={cancelarReserva}
        loading={loading}
      />      <CreateReservaModal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        selectedDate={selectedDate}
        onSubmit={crearReserva}
        loading={loading}
        availableAulas={availableAulas}
        availableCursos={availableCursos}
        onReloadAulas={reloadAulasDisponibles}
      />

      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default CalendarioPage;
