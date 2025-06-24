// src/utils/calendarUtils.js

/**
 * Utilidades para el manejo del calendario
 * Funciones helper para formateo, validaciones y transformaciones
 */

/**
 * Formatea una fecha para mostrar en la UI
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea una hora para mostrar en la UI
 * @param {string} time - Hora en formato HH:MM
 * @returns {string} Hora formateada
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch (error) {
    return time;
  }
};

/**
 * Convierte una fecha y hora a formato ISO string
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} time - Hora en formato HH:MM
 * @returns {string} DateTime en formato ISO
 */
export const toISODateTime = (date, time) => {
  if (!date || !time) return '';
  return `${date}T${time}:00`;
};

/**
 * Extrae la fecha de un datetime ISO
 * @param {string} dateTime - DateTime en formato ISO
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const extractDate = (dateTime) => {
  if (!dateTime) return '';
  return dateTime.split('T')[0];
};

/**
 * Extrae la hora de un datetime ISO
 * @param {string} dateTime - DateTime en formato ISO
 * @returns {string} Hora en formato HH:MM
 */
export const extractTime = (dateTime) => {
  if (!dateTime) return '';
  const timePart = dateTime.split('T')[1];
  return timePart ? timePart.substring(0, 5) : '';
};

/**
 * Valida si una fecha es válida y no está en el pasado
 * @param {string|Date} date - Fecha a validar
 * @returns {boolean} True si la fecha es válida y futura
 */
export const isValidFutureDate = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj >= today;
};

/**
 * Valida si una hora es válida
 * @param {string} time - Hora en formato HH:MM
 * @returns {boolean} True si la hora es válida
 */
export const isValidTime = (time) => {
  if (!time) return false;
  
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Valida si una hora de fin es posterior a una hora de inicio
 * @param {string} startTime - Hora de inicio en formato HH:MM
 * @param {string} endTime - Hora de fin en formato HH:MM
 * @returns {boolean} True si la hora de fin es posterior
 */
export const isValidTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return false;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes > startTotalMinutes;
};

/**
 * Calcula la duración entre dos horas
 * @param {string} startTime - Hora de inicio en formato HH:MM
 * @param {string} endTime - Hora de fin en formato HH:MM
 * @returns {string} Duración en formato "X horas Y minutos"
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  const diffMinutes = endTotalMinutes - startTotalMinutes;
  
  if (diffMinutes <= 0) return '';
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} minutos`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} ${minutes} minutos`;
  }
};

/**
 * Obtiene la configuración de color para un estado de reserva
 * @param {string} estado - Estado de la reserva
 * @returns {Object} Configuración de colores
 */
export const getEventColorConfig = (estado) => {
  const configs = {
    'CONFIRMADA': {
      backgroundColor: '#22c55e',
      borderColor: '#16a34a',
      textColor: '#ffffff',
      label: 'Confirmada'
    },
    'ACTIVA': {
      backgroundColor: '#22c55e',
      borderColor: '#16a34a',
      textColor: '#ffffff',
      label: 'Activa'
    },
    'PENDIENTE': {
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
      textColor: '#000000',
      label: 'Pendiente'
    },
    'CANCELADA': {
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
      textColor: '#ffffff',
      label: 'Cancelada'
    },
    'FINALIZADA': {
      backgroundColor: '#6b7280',
      borderColor: '#4b5563',
      textColor: '#ffffff',
      label: 'Finalizada'
    },
    'NO_ASISTIDA': {
      backgroundColor: '#dc2626',
      borderColor: '#b91c1c',
      textColor: '#ffffff',
      label: 'No asistida'
    }
  };
  
  return configs[estado] || {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    textColor: '#ffffff',
    label: estado || 'Desconocido'
  };
};

/**
 * Genera bloques de tiempo para la selección en formularios
 * @param {string} startHour - Hora de inicio (ej: "07:00")
 * @param {string} endHour - Hora de fin (ej: "22:00")
 * @param {number} interval - Intervalo en minutos (ej: 30)
 * @returns {Array} Array de objetos con value y label
 */
export const generateTimeSlots = (startHour = "07:00", endHour = "22:00", interval = 30) => {
  const slots = [];
  const [startH, startM] = startHour.split(':').map(Number);
  const [endH, endM] = endHour.split(':').map(Number);
  
  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    slots.push({
      value: timeString,
      label: formatTime(timeString)
    });
    
    currentMinutes += interval;
  }
  
  return slots;
};

/**
 * Verifica si una fecha está en la lista de días bloqueados
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {Array} blockedDates - Array de fechas bloqueadas
 * @returns {boolean} True si la fecha está bloqueada
 */
export const isDateBlocked = (date, blockedDates) => {
  if (!date || !Array.isArray(blockedDates)) return false;
  
  const dateStr = extractDate(date);
  return blockedDates.some(blocked => blocked.fecha === dateStr);
};

/**
 * Formatea un estado de reserva para mostrar en la UI
 * @param {string} estado - Estado de la reserva
 * @returns {string} Estado formateado
 */
export const formatEstado = (estado) => {
  const estados = {
    'CONFIRMADA': 'Confirmada',
    'ACTIVA': 'Activa',
    'PENDIENTE': 'Pendiente',
    'CANCELADA': 'Cancelada',
    'FINALIZADA': 'Finalizada',
    'NO_ASISTIDA': 'No asistida'
  };
  
  return estados[estado] || estado;
};
