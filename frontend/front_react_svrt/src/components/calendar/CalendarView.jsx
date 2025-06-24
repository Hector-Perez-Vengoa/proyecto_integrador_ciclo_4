// src/components/calendar/CalendarView.jsx
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import AlertModal from '../ui/AlertModal';
import '../../css/calendar.css';

/**
 * Componente principal del calendario usando FullCalendar
 * Renderiza el calendario con todas las funcionalidades interactivas
 */
const CalendarView = React.forwardRef(({
  events,
  onEventClick,
  onDateClick,
  onViewChange,
  onDateRangeChange,
  view = 'timeGridWeek',
  loading = false,
  blockedDates = [],
  filters = {},
  allowSelection = true,
  allowEventDrop = false
}, ref) => {
  const calendarRef = useRef(null);
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  // Estado para el modal de alertas
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  // Función para mostrar alertas
  const showAlert = (title, message, type = 'warning') => {
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

  // Filtrar eventos según filtros aplicados
  useEffect(() => {
    let filtered = [...events];
    
    // Filtrar por estado
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(event => 
        event.extendedProps?.estado === filters.status
      );
    }
    
    // Filtrar por aula
    if (filters.aula) {
      filtered = filtered.filter(event => 
        event.extendedProps?.aula?.toLowerCase().includes(filters.aula.toLowerCase())
      );
    }
    
    // Filtrar por curso
    if (filters.curso) {
      filtered = filtered.filter(event => 
        event.extendedProps?.curso?.toLowerCase().includes(filters.curso.toLowerCase())
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, filters]);

  /**
   * Valida si una selección de fecha/hora es permitida
   * Bloquea domingos y horas pasadas del día actual
   */
  const isSelectionAllowed = (selectInfo) => {
    const start = new Date(selectInfo.start);
    const now = new Date();
    
    // Bloquear domingos (día 0)
    if (start.getDay() === 0) {
      return false;
    }
    
    // Verificar si es el día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectionDate = new Date(start);
    selectionDate.setHours(0, 0, 0, 0);
    
    // Si es el día actual, verificar que la hora no sea en el pasado
    if (selectionDate.getTime() === today.getTime()) {
      return start >= now;
    }
    
    // Para fechas futuras, permitir la selección
    return selectionDate > today;
  };

  /**
   * Renderiza contenido personalizado para las celdas de día
   */
  function renderDayCell(dayInfo) {
    const dateStr = dayInfo.date.toISOString().split('T')[0];
    const isBlocked = blockedDates.some(blocked => blocked.fecha === dateStr);
    
    if (isBlocked) {
      return {
        html: `
          <div class="fc-daygrid-day-number" style="color: #ef4444; text-decoration: line-through;">
            ${dayInfo.dayNumberText}
          </div>
          <div style="font-size: 10px; color: #ef4444; text-align: center;">
            No disponible
          </div>
        `
      };
    }
    
    return dayInfo.dayNumberText;
  }
  
  /**
   * Renderiza contenido personalizado para los eventos
   */
  function renderEventContent(eventInfo) {
    const { event } = eventInfo;
    const estado = event.extendedProps?.estado;
    
    // Iconos según el estado
    const statusIcons = {
      'CONFIRMADA': '✓',
      'PENDIENTE': '⏳',
      'CANCELADA': '✗',
      'FINALIZADA': '✓',
      'NO_ASISTIDA': '✗'
    };
    
    const icon = statusIcons[estado] || '';
    
    return {
      html: `
        <div class="custom-event-content">
          <div class="event-time">${eventInfo.timeText}</div>
          <div class="event-title">
            ${icon} ${event.title}
          </div>
        </div>
      `
    };
  }

  /**
   * Maneja el clic en un evento
   */
  function handleEventClick(eventInfo) {
    eventInfo.jsEvent.preventDefault();
    onEventClick && onEventClick(eventInfo);
  }

  /**
   * Maneja el clic en una fecha
   */  function handleDateClick(dateInfo) {
    const clickDate = new Date(dateInfo.date || dateInfo.dateStr);
    const now = new Date();
    
    // Bloquear domingos
    if (clickDate.getDay() === 0) {
      showAlert(
        'Día no disponible',
        'No se pueden crear reservas los domingos. Por favor selecciona otro día de la semana.',
        'warning'
      );
      return;
    }
    
    // Verificar si es el día actual y la hora ya pasó
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickDateOnly = new Date(clickDate);
    clickDateOnly.setHours(0, 0, 0, 0);
    
    if (clickDateOnly.getTime() === today.getTime()) {
      // Es el día actual, verificar la hora si hay información de tiempo
      if (dateInfo.dateStr && dateInfo.dateStr.includes('T')) {
        const clickDateTime = new Date(dateInfo.dateStr);
        if (clickDateTime <= now) {
          showAlert(
            'Hora no disponible',
            'No se pueden crear reservas en horas pasadas. Por favor selecciona una hora futura.',
            'warning'
          );
          return;
        }
      }
    } else if (clickDateOnly < today) {
      // Es una fecha pasada
      showAlert(
        'Fecha no disponible',
        'No se pueden crear reservas en fechas pasadas. Por favor selecciona una fecha futura.',
        'warning'
      );
      return;
    }
    
    onDateClick && onDateClick(dateInfo);
  }

  /**
   * Maneja la selección de un rango de fechas (drag & drop)
   */
  function handleDateSelect(selectInfo) {
    // La validación ya se hace en isSelectionAllowed, pero agregar check adicional
    if (!isSelectionAllowed(selectInfo)) {
      return;
    }
    
    // Pasar la información de selección al manejador principal
    onDateClick && onDateClick(selectInfo);
  }
  
  /**
   * Maneja el drop de eventos (drag & drop)
   */
  function handleEventDrop(dropInfo) {
    // Implementar lógica de actualización de reserva
    console.log('Event dropped:', dropInfo);
  }

  /**
   * Maneja el cambio de vista
   */
  function handleViewChange(viewInfo) {
    onViewChange && onViewChange(viewInfo.view.type);
  }
  
  /**
   * Maneja el cambio de rango de fechas
   */
  function handleDatesSet(dateInfo) {
    onDateRangeChange && onDateRangeChange(dateInfo);
  }

  /**
   * Marca las horas pasadas del día actual como deshabilitadas
   * Y también marca visualmente los domingos
   */
  const markPastHours = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Solo aplicar en vista de tiempo (timeGrid)
    if (!view.includes('timeGrid')) return;
    
    setTimeout(() => {
      // Marcar horas pasadas del día actual
      const slots = document.querySelectorAll('.fc-timegrid-slot');
      slots.forEach(slot => {
        const timeElement = slot.querySelector('.fc-timegrid-slot-label');
        if (timeElement) {
          const timeText = timeElement.textContent.trim();
          if (timeText) {
            try {
              // Convertir texto de hora a Date del día actual
              const [time, period] = timeText.split(' ');
              let [hours, minutes] = time.split(':').map(Number);
              
              if (period === 'PM' && hours !== 12) hours += 12;
              if (period === 'AM' && hours === 12) hours = 0;
              
              const slotTime = new Date(today);
              slotTime.setHours(hours, minutes || 0, 0, 0);
              
              // Si es el día actual y la hora ya pasó, marcar como pasada
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0);
              
              if (currentDate.getTime() === today.getTime() && slotTime <= now) {
                slot.classList.add('fc-timegrid-slot-past');
              }
            } catch (error) {
              // Ignorar errores de parsing de tiempo
            }
          }
        }
      });
      
      // Marcar domingos como deshabilitados
      const sundayColumns = document.querySelectorAll('.fc-day-sun');
      sundayColumns.forEach(column => {
        column.classList.add('fc-day-disabled');
        // Prevenir eventos de clic y selección
        column.style.pointerEvents = 'none';
      });
      
      // Marcar celdas de domingo en la vista de cuadrícula
      const sundayCells = document.querySelectorAll('.fc-daygrid-day.fc-day-sun');
      sundayCells.forEach(cell => {
        cell.classList.add('fc-day-disabled');
        cell.style.pointerEvents = 'none';
      });
    }, 100);
  };
  // Configuración del calendario
  const calendarConfig = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: view,
    initialDate: new Date(), // Asegurar que inicie en la fecha actual
    now: new Date(), // Indicador de tiempo actual
    locale: esLocale,
    
    // Configuración de cabeceras - Ocultar para usar toolbar personalizada
    headerToolbar: false,
      // Configuración de tiempo
    slotMinTime: '08:00:00',
    slotMaxTime: '22:00:00',
    slotDuration: '00:30:00',
    slotLabelInterval: '01:00:00',
    allDaySlot: false,
    
    // Configuración de altura
    height: 'auto',
    contentHeight: 650,
    
    // Configuración de eventos
    events: filteredEvents,
    eventDisplay: 'block',
    eventTextColor: '#ffffff',
    
    // Configuración de días laborables
    weekends: true,
    firstDay: 1, // Lunes como primer día
      // Configuración de horarios laborables
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Lunes a sábado
      startTime: '08:00',
      endTime: '22:00'
    },    // Configuración de selección - Habilitada por defecto para drag & drop
    selectable: allowSelection,
    selectMirror: true,
    selectOverlap: false,
    unselectAuto: true,
    selectMinDistance: 0, // Permitir selección inmediata
    longPressDelay: 300, // Delay apropiado para móviles
    selectLongPressDelay: 300, // Delay específico para selección en móviles
    selectAllow: isSelectionAllowed, // Validación de selección personalizada
    
    // Configuración de drag & drop
    editable: allowEventDrop,
    droppable: false,
    eventDrop: handleEventDrop,
    
    // Eventos de interacción
    eventClick: handleEventClick,
    dateClick: handleDateClick,
    select: handleDateSelect,
    viewDidMount: handleViewChange,
    datesSet: handleDatesSet,
    
    // Configuración de navegación
    navLinks: true,
    navLinkDayClick: 'timeGridDay',
    
    // Configuración de visualización
    dayMaxEvents: 3,
    moreLinkClick: 'popover',
    
    // Configuración de tiempo actual
    nowIndicator: true,
    
    // Configuración de formato de tiempo
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
      // Configuración de días no seleccionables
    selectConstraint: {
      start: '08:00',
      end: '22:00'
    },
    
    // Configuración de contenido personalizado
    dayCellContent: renderDayCell,
    eventContent: renderEventContent
  };
  /**
   * Actualiza la vista del calendario cuando cambia la prop
   */
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (calendarApi.view.type !== view) {
        calendarApi.changeView(view);
      }
    }
  }, [view]);
  
  /**
   * Métodos públicos del calendario
   */
  const getCalendarApi = () => {
    return calendarRef.current?.getApi();
  };
  
  const goToDate = (date) => {
    const api = getCalendarApi();
    if (api) {
      api.gotoDate(date);
    }
  };
  
  const prev = () => {
    const api = getCalendarApi();
    if (api) {
      api.prev();
    }
  };
  
  const next = () => {
    const api = getCalendarApi();
    if (api) {
      api.next();
    }
  };
  
  const today = () => {
    const api = getCalendarApi();
    if (api) {
      api.today();
    }
  };
  // Exponer métodos para el componente padre
  React.useImperativeHandle(ref, () => ({
    getApi: getCalendarApi,
    goToDate,
    prev,
    next,    today
  }));

  // Ejecutar markPastHours cuando cambie la vista o se renderice el calendario
  useEffect(() => {
    markPastHours();
  }, [view, events]);

  return (
    <div className="relative">
      {/* Indicador de carga */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Cargando eventos...</span>
          </div>
        </div>
      )}        {/* Calendario */}
      <div className="calendar-container">
        <FullCalendar          ref={calendarRef}
          {...calendarConfig}
        />
      </div>

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
});

CalendarView.displayName = 'CalendarView';

export default CalendarView;
