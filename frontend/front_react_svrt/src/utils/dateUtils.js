// src/utils/dateUtils.js

/**
 * Formatea una fecha en formato yyyy-MM-dd a dd/MM/yyyy
 * @param {string} dateString - Fecha en formato ISO o yyyy-MM-dd
 * @returns {string} Fecha formateada como dd/MM/yyyy
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Error en fecha';
  }
};

/**
 * Formatea una hora en formato HH:mm:ss a HH:mm
 * @param {string} timeString - Hora en formato HH:mm:ss
 * @returns {string} Hora formateada como HH:mm
 */
export const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    // Si ya es formato HH:mm, lo dejamos así
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    // Si es formato HH:mm:ss, quitamos los segundos
    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString.substring(0, 5);
    }
    
    // Si es otro formato, intentamos parsearlo
    const date = new Date(`2000-01-01T${timeString}`);
    if (isNaN(date.getTime())) return 'Hora inválida';
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    return 'Error en hora';
  }
};

/**
 * Verifica si una fecha es hoy
 * @param {string} dateString - Fecha en formato ISO o yyyy-MM-dd
 * @returns {boolean} True si la fecha es hoy
 */
export const isToday = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  } catch (error) {
    return false;
  }
};

/**
 * Verifica si una fecha está en el futuro
 * @param {string} dateString - Fecha en formato ISO o yyyy-MM-dd
 * @returns {boolean} True si la fecha es en el futuro
 */
export const isFutureDate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date >= today;
  } catch (error) {
    return false;
  }
};

/**
 * Parsea una fecha en formato YYYY-MM-DD de manera segura
 * @param {string} fechaString - Fecha en formato YYYY-MM-DD
 * @returns {Date} Objeto Date creado de manera local
 */
export const parsearFechaLocal = (fechaString) => {
  if (!fechaString) return null;
  
  try {
    const [year, month, day] = fechaString.split('-').map(Number);
    return new Date(year, month - 1, day); // month - 1 porque los meses van de 0-11
  } catch (error) {
    console.error('Error parseando fecha:', error);
    return null;
  }
};

/**
 * Verifica si una fecha es domingo
 * @param {string|Date} fecha - Fecha a verificar
 * @returns {boolean} True si es domingo
 */
export const esDomingo = (fecha) => {
  const fechaObj = typeof fecha === 'string' ? parsearFechaLocal(fecha) : fecha;
  return fechaObj ? fechaObj.getDay() === 0 : false;
};

/**
 * Verifica si una fecha es válida para reservas (no domingo, no pasado)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Object} Objeto con valido y mensaje
 */
export const validarFechaReserva = (fecha) => {
  const fechaObj = parsearFechaLocal(fecha);
  
  if (!fechaObj) {
    return {
      valido: false,
      mensaje: 'Formato de fecha inválido'
    };
  }
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  if (fechaObj < hoy) {
    return {
      valido: false,
      mensaje: 'No se pueden crear reservas en fechas pasadas'
    };
  }
  
  if (esDomingo(fechaObj)) {
    return {
      valido: false,
      mensaje: 'No se permiten reservas los domingos'
    };
  }
  
  return {
    valido: true,
    mensaje: 'Fecha válida'
  };
};

/**
 * Obtiene el nombre del día de la semana
 * @param {string|Date} fecha - Fecha a consultar
 * @returns {string} Nombre del día en español
 */
export const obtenerNombreDia = (fecha) => {
  const fechaObj = typeof fecha === 'string' ? parsearFechaLocal(fecha) : fecha;
  
  if (!fechaObj) return '';
  
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[fechaObj.getDay()];
};

/**
 * Formatea una fecha para mostrar al usuario
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFechaCompleta = (fecha) => {
  const fechaObj = typeof fecha === 'string' ? parsearFechaLocal(fecha) : fecha;
  
  if (!fechaObj) return '';
  
  return fechaObj.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


