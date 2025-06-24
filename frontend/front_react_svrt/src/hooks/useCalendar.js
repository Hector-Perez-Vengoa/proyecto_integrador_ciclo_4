// src/hooks/useCalendar.js
import { useState, useEffect, useCallback } from 'react';
import { calendarService } from '../services/calendarService';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para gestionar el calendario de reservas
 * Maneja la lógica de estado, eventos y interacciones del calendario
 */
export const useCalendar = (onShowAlert = null) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [calendarView, setCalendarView] = useState('timeGridWeek');  /**
   * Carga las reservas del profesor desde el backend
   */
  const loadReservas = useCallback(async () => {
    const profesorId = user?.profesorId || user?.id;
    if (!profesorId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Cargar reservas reales del backend
      const reservas = await calendarService.getReservasByProfesor(profesorId);
      
      const calendarEvents = transformReservasToEvents(reservas);
      
      setEvents(calendarEvents);
    } catch (err) {
      setError('Error al cargar las reservas: ' + err.message);
      console.error('❌ Error loading reservas:', err);
      setEvents([]); // Array vacío si hay error
    } finally {
      setLoading(false);
    }
  }, [user?.profesorId, user?.id]);

  /**
   * Carga los días bloqueados (feriados, mantenimiento, etc.)
   */
  const loadBlockedDates = useCallback(async () => {
    try {
      const blocked = await calendarService.getBlockedDates();
      setBlockedDates(blocked);
    } catch (err) {
      console.error('Error loading blocked dates:', err);
    }
  }, []);  /**
   * Transforma las reservas del backend al formato de FullCalendar
   */
  const transformReservasToEvents = (reservas) => {
    return reservas.map(reserva => {
      // Extraer información usando los nombres correctos del DTO
      const aulaVirtual = reserva.aulaVirtualNombre || 'Aula no especificada';
      const curso = reserva.cursoNombre || 'Curso no especificado';
      const estado = reserva.estado || 'PENDIENTE';
      const motivo = reserva.motivo || '';
      const profesorNombre = reserva.profesorNombre || 'Profesor no especificado';
      
      const event = {
        id: reserva.id.toString(),
        title: `${aulaVirtual} - ${curso}`,
        start: `${reserva.fechaReserva}T${reserva.horaInicio}`,
        end: `${reserva.fechaReserva}T${reserva.horaFin}`,
        backgroundColor: getEventColor(estado),
        borderColor: getEventColor(estado),
        textColor: getTextColor(estado),
        extendedProps: {
          aula: aulaVirtual,
          curso: curso,
          estado: estado,
          motivo: motivo,
          profesorNombre: profesorNombre,
          reservaData: {
            ...reserva,
            // Propiedades adicionales para el modal
            aulaVirtual: aulaVirtual,
            cursoNombre: curso,
            estadoReserva: estado,
            motivoReserva: motivo,
            profesorCompleto: profesorNombre,
            fechaCreacion: reserva.fechaCreacion,
            observaciones: reserva.observaciones
          }
        }
      };
      
      return event;
    });
  };

  /**
   * Obtiene el color del evento según su estado
   */
  const getEventColor = (estado) => {
    const colors = {
      'CONFIRMADA': '#22c55e',    // Verde - Activa
      'ACTIVA': '#22c55e',        // Verde - Activa
      'PENDIENTE': '#f59e0b',     // Amarillo - Pendiente
      'CANCELADA': '#ef4444',     // Rojo - Cancelada
      'FINALIZADA': '#6b7280',    // Gris - Finalizada
      'NO_ASISTIDA': '#dc2626'    // Rojo oscuro - No asistida
    };
    return colors[estado] || '#3b82f6'; // Azul por defecto
  };

  /**
   * Obtiene el color del texto según el estado
   */
  const getTextColor = (estado) => {
    const lightBackgrounds = ['PENDIENTE'];
    return lightBackgrounds.includes(estado) ? '#000000' : '#ffffff';
  };

  /**
   * Maneja el clic en un evento del calendario
   */
  const handleEventClick = (eventInfo) => {
    setSelectedEvent(eventInfo.event);
    setShowEventModal(true);
  };  /**
   * Maneja el clic en una fecha vacía del calendario o selección de rango
   * Soporta tanto clic simple como drag & drop para seleccionar rangos de tiempo
   */
  const handleDateClick = (dateInfo) => {
    // Determinar si es un clic simple o una selección de rango
    const isRangeSelection = dateInfo.start && dateInfo.end && dateInfo.startStr !== dateInfo.endStr;
    
    const startDate = isRangeSelection ? new Date(dateInfo.start) : new Date(dateInfo.date || dateInfo.dateStr);
    const endDate = isRangeSelection ? new Date(dateInfo.end) : null;
    const now = new Date();
      // Validar que no sea domingo
    if (startDate.getDay() === 0) {
      if (onShowAlert) {
        onShowAlert('No se pueden crear reservas los domingos');
      } else {
        alert('No se pueden crear reservas los domingos');
      }
      return;
    }

    // Validar que no sea una fecha pasada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDateOnly = new Date(startDate);
    startDateOnly.setHours(0, 0, 0, 0);
    
    if (startDateOnly < today) {
      if (onShowAlert) {
        onShowAlert('No se pueden crear reservas en fechas pasadas');
      } else {
        alert('No se pueden crear reservas en fechas pasadas');
      }
      return;
    }

    // Si es el día actual, verificar que no sea una hora pasada
    if (startDateOnly.getTime() === today.getTime()) {
      // Para selecciones de rango, verificar la hora de inicio
      if (isRangeSelection && dateInfo.start) {
        if (new Date(dateInfo.start) <= now) {
          if (onShowAlert) {
            onShowAlert('No se pueden crear reservas en horas pasadas');
          } else {
            alert('No se pueden crear reservas en horas pasadas');
          }
          return;
        }
      }
      // Para clicks simples con hora específica
      else if (dateInfo.dateStr && dateInfo.dateStr.includes('T')) {
        const clickDateTime = new Date(dateInfo.dateStr);
        if (clickDateTime <= now) {
          if (onShowAlert) {
            onShowAlert('No se pueden crear reservas en horas pasadas');
          } else {
            alert('No se pueden crear reservas en horas pasadas');
          }
          return;
        }
      }
    }

    // Para selecciones de rango, validar que la fecha final también sea válida
    if (endDate) {
      if (endDate.getDay() === 0) {
        if (onShowAlert) {
          onShowAlert('El rango seleccionado incluye domingos');
        } else {
          alert('El rango seleccionado incluye domingos');
        }
        return;
      }
      
      const endDateOnly = new Date(endDate);
      endDateOnly.setHours(0, 0, 0, 0);
      
      if (endDateOnly < today) {
        if (onShowAlert) {
          onShowAlert('El rango seleccionado incluye fechas pasadas');
        } else {
          alert('El rango seleccionado incluye fechas pasadas');
        }
        return;
      }
    }

    // Validar que no sea un día bloqueado
    const dateStr = isRangeSelection 
      ? dateInfo.startStr.split('T')[0] 
      : (dateInfo.dateStr || dateInfo.start).split('T')[0];
      
    if (blockedDates.some(blocked => blocked.fecha === dateStr)) {
      if (onShowAlert) {
        onShowAlert('Esta fecha no está disponible para reservas');
      } else {
        alert('Esta fecha no está disponible para reservas');
      }
      return;
    }

    // Configurar los datos para el modal de creación
    const modalData = {
      ...dateInfo,
      dateStr: dateStr,
      timeStr: isRangeSelection ? dateInfo.startStr.split('T')[1]?.substring(0, 5) : null,
      endTimeStr: isRangeSelection && endDate ? dateInfo.endStr.split('T')[1]?.substring(0, 5) : null,
      isRangeSelection,
      // Información adicional para el modal
      allDay: dateInfo.allDay || false,
      view: dateInfo.view?.type || 'timeGridWeek'
    };

    setSelectedDate(modalData);
    setShowCreateModal(true);
  };

  /**
   * Maneja específicamente la selección de rangos de tiempo (drag & drop)
   */
  const handleDateSelect = (selectInfo) => {
    // Este método se llama cuando el usuario arrastra para seleccionar un rango
    handleDateClick(selectInfo);
  };

  /**
   * Cierra el modal de evento
   */
  const closeEventModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  /**
   * Cierra el modal de creación
   */
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedDate(null);
  };  /**
   * Cancela una reserva
   */
  const cancelarReserva = async (reservaId, motivo) => {
    try {
      setLoading(true);
      console.log('🔄 useCalendar: Iniciando cancelación de reserva:', { reservaId, motivo });
      
      try {
        // Intentar primero con calendarService
        await calendarService.cancelarReserva(reservaId, motivo);
        console.log('✅ useCalendar: Cancelación exitosa con calendarService');
        await loadReservas(); // Recargar eventos
        closeEventModal();
        return { success: true, message: 'Reserva cancelada exitosamente' };
        
      } catch (calendarError) {
        console.warn('⚠️ useCalendar: Error con calendarService:', calendarError.message);
        
        // Si es un error 403, de perfil del profesor, o de autorización, intentar con reservaService
        const shouldTryFallback = 
          calendarError.message.includes('403') || 
          calendarError.message.includes('Error 403') ||
          calendarError.message.includes('Forbidden') ||
          calendarError.message.includes('No se encontró el perfil del profesor') ||
          calendarError.message.includes('perfil del profesor');
        
        if (shouldTryFallback) {
          console.log('🔄 useCalendar: Detectado error de permisos, intentando con reservaService...');
          
          try {
            // Importar reservaService dinámicamente
            const { reservaService } = await import('../services/api/reservaService');
            const result = await reservaService.cancelarReserva(reservaId, motivo);
            
            if (result.success) {
              console.log('✅ useCalendar: Cancelación exitosa con reservaService');
              await loadReservas(); // Recargar eventos
              closeEventModal();
              return { success: true, message: result.message || 'Reserva cancelada exitosamente' };
            } else {
              throw new Error(result.error || 'Error al cancelar con reservaService');
            }
          } catch (reservaError) {
            console.error('❌ useCalendar: Error con reservaService:', reservaError.message);
            throw new Error(`Ambos servicios fallaron. CalendarService: ${calendarError.message} | ReservaService: ${reservaError.message}`);
          }
        } else {
          // Si no es un error de permisos, lanzar el error original
          throw calendarError;
        }
      }
      
    } catch (err) {
      console.error('❌ useCalendar: Error final al cancelar reserva:', err);
      return { 
        success: false, 
        message: err.message || 'Error al cancelar la reserva. Por favor, intenta nuevamente.' 
      };
    } finally {
      setLoading(false);
    }
  };
  /**
   * Crea una nueva reserva
   */
  const crearReserva = async (reservaData) => {
    try {
      setLoading(true);
      const result = await calendarService.crearReserva(reservaData);
      
      if (result.success) {
        await loadReservas(); // Recargar eventos
        closeCreateModal();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.error };
      }
    } catch (err) {
      console.error('Error al crear reserva:', err);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cambia la vista del calendario
   */
  const changeView = (view) => {
    setCalendarView(view);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadReservas();
    loadBlockedDates();
  }, [loadReservas, loadBlockedDates]);

  return {
    // Estado
    events,
    loading,
    error,
    selectedEvent,
    showEventModal,
    showCreateModal,
    selectedDate,
    blockedDates,
    calendarView,
    
    // Acciones
    handleEventClick,
    handleDateClick,
    handleDateSelect,
    closeEventModal,
    closeCreateModal,
    cancelarReserva,
    crearReserva,
    loadReservas,
    changeView,
    
    // Utilidades
    getEventColor,
    getTextColor
  };
};
