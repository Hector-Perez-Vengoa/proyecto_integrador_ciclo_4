// src/services/calendarService.js
import { BASE_URL } from '../config/api';
import { validarFechaReserva } from '../utils/dateUtils';
import { AUTH_CONFIG } from '../constants/auth';
import { storage } from '../utils/authUtils';
import { perfilService } from './api/perfilService';

/**
 * Servicio para manejar las operaciones del calendario de reservas
 * Centraliza todas las llamadas a la API relacionadas con el calendario
 */
class CalendarService {
  constructor() {
    this.baseURL = BASE_URL;
  }  /**
   * Obtiene el token de autorización desde localStorage
   */
  getAuthHeaders() {
    // Usar las mismas constantes que el resto de la aplicación
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }  /**
   * Obtiene todas las reservas de un usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de reservas
   */
  async getReservasByUser(userId) {
    try {
      const response = await fetch(`${this.baseURL}/api/reservas/usuario/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const reservas = data.data || data;
      
      return reservas; // Adaptarse a diferentes formatos de respuesta
    } catch (error) {
      console.error('❌ Error fetching reservas:', error);
      throw new Error('No se pudieron cargar las reservas');
    }
  }

  /**
   * Obtiene todas las reservas de un usuario (alias para compatibilidad)
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de reservas
   */
  async getReservasByProfesor(userId) {
    return this.getReservasByUser(userId);
  }

  /**
   * Obtiene las fechas bloqueadas (feriados, mantenimiento, etc.)
   * @returns {Promise<Array>} Lista de fechas bloqueadas
   */
  async getBlockedDates() {
    try {
      const response = await fetch(`${this.baseURL}/api/calendario/fechas-bloqueadas`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        // Si el endpoint no existe, devolver array vacío
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      return []; // Devolver array vacío en caso de error
    }
  }
  /**
   * Obtiene las aulas virtuales disponibles
   * @returns {Promise<Array>} Lista de aulas virtuales
   */
  async getAllAulas() {
    try {
      const response = await fetch(`${this.baseURL}/api/aula-virtual`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error fetching aulas:', error);
      throw new Error('No se pudieron cargar las aulas virtuales');
    }
  }

  /**
   * Obtiene los cursos asignados al usuario
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de cursos
   */
  async getCursosByUser(userId) {
    try {
      const response = await fetch(`${this.baseURL}/api/cursos/usuario/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error fetching cursos:', error);
      throw new Error('No se pudieron cargar los cursos');
    }
  }

  /**
   * Obtiene los cursos asignados al usuario (alias para compatibilidad)
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} Lista de cursos
   */
  async getCursosByProfesor(userId) {
    return this.getCursosByUser(userId);
  }

  /**
   * Valida la disponibilidad de un aula en una fecha y horario
   * @param {Object} validationData - Datos para validar
   * @returns {Promise<Object>} Resultado de la validación
   */
  async validateDisponibilidad(validationData) {
    try {
      const response = await fetch(`${this.baseURL}/api/reservas/validar-disponibilidad`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(validationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating disponibilidad:', error);
      throw error;
    }
  }  /**
   * Cancela una reserva existente (simplificado)
   * @param {number} reservaId - ID de la reserva
   * @param {string} motivo - Motivo de la cancelación
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async cancelarReserva(reservaId, motivo) {
    try {
      console.log('🔄 Intentando cancelar reserva:', { reservaId, motivo });
      
      // Verificar que tenemos el token
      const headers = this.getAuthHeaders();
      console.log('🔑 Headers de autorización:', { hasAuth: !!headers.Authorization });
      
      const requestBody = {
        motivoCancelacion: motivo || 'Cancelado por el usuario',
        observaciones: motivo || 'Cancelado desde el frontend'
      };
      
      console.log('📤 Enviando solicitud de cancelación a /cancelar');
      
      const response = await fetch(`${this.baseURL}/api/reservas/${reservaId}/cancelar`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Respuesta:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Cancelación exitosa:', data);
        return data;
      } else {
        const errorData = await response.json();
        console.error('❌ Error al cancelar:', errorData);
        throw new Error(errorData.message || 'Error al cancelar la reserva');
      }
      
    } catch (error) {
      console.error('❌ Error al cancelar reserva:', error);
      throw new Error(error.message || 'Error al cancelar la reserva');
    }
  }

  /**
   * Obtiene información del horario de funcionamiento
   */
  async getHorarioFuncionamiento() {
    try {
      const response = await fetch(`${this.baseURL}/api/calendario/horario-funcionamiento`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : this.getHorarioFuncionamientoPorDefecto();
    } catch (error) {
      console.warn('Error obteniendo horario de funcionamiento, usando valores por defecto:', error.message);
      return this.getHorarioFuncionamientoPorDefecto();
    }
  }

  /**
   * Horario de funcionamiento por defecto
   */
  getHorarioFuncionamientoPorDefecto() {
    return {
      horaApertura: "08:00",
      horaCierre: "22:00",
      diasPermitidos: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"],
      duracionMinima: 30,
      duracionMaxima: 240,
      incrementosPermitidos: [30, 60, 90, 120, 150, 180, 210, 240],
      zonaHoraria: "America/Lima"
    };
  }

  /**
   * Valida si un horario es válido según las reglas del backend
   */
  validarHorario(horaInicio, horaFin) {
    const horarioFuncionamiento = this.getHorarioFuncionamientoPorDefecto();
    
    // Convertir strings a minutos para fácil comparación
    const minutosInicio = this.convertirHoraAMinutos(horaInicio);
    const minutosFin = this.convertirHoraAMinutos(horaFin);
    const minutosApertura = this.convertirHoraAMinutos(horarioFuncionamiento.horaApertura);
    const minutosCierre = this.convertirHoraAMinutos(horarioFuncionamiento.horaCierre);
    
    // Validar rango de horarios
    if (minutosInicio < minutosApertura || minutosFin > minutosCierre) {
      return {
        valido: false,
        mensaje: `Las reservas solo están permitidas entre ${horarioFuncionamiento.horaApertura} y ${horarioFuncionamiento.horaCierre}`
      };
    }
    
    // Validar que fin > inicio
    if (minutosFin <= minutosInicio) {
      return {
        valido: false,
        mensaje: 'La hora de fin debe ser posterior a la hora de inicio'
      };
    }
    
    // Validar duración
    const duracionMinutos = minutosFin - minutosInicio;
    
    if (duracionMinutos < horarioFuncionamiento.duracionMinima) {
      return {
        valido: false,
        mensaje: `La duración mínima es de ${horarioFuncionamiento.duracionMinima} minutos`
      };
    }
    
    if (duracionMinutos > horarioFuncionamiento.duracionMaxima) {
      return {
        valido: false,
        mensaje: `La duración máxima es de ${horarioFuncionamiento.duracionMaxima} minutos (${horarioFuncionamiento.duracionMaxima / 60} horas)`
      };
    }
    
    // Validar incrementos permitidos
    if (!horarioFuncionamiento.incrementosPermitidos.includes(duracionMinutos)) {
      return {
        valido: false,
        mensaje: `La duración debe ser múltiplo de 30 minutos. Duraciones permitidas: ${horarioFuncionamiento.incrementosPermitidos.join(', ')} minutos`
      };
    }
    
    return {
      valido: true,
      mensaje: 'Horario válido'
    };
  }

  /**
   * Convierte hora en formato HH:MM a minutos
   */
  convertirHoraAMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
  }  /**
   * Verifica si una fecha es válida (no es domingo ni en el pasado)
   */
  validarFecha(fecha) {
    return validarFechaReserva(fecha);
  }

  /**
   * Verifica la disponibilidad de un aula en una fecha y horario específicos
   */
  async verificarDisponibilidad(aulaVirtualId, fecha, horaInicio, horaFin) {
    try {
      const params = new URLSearchParams({
        aulaVirtualId: aulaVirtualId.toString(),
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin
      });

      const response = await fetch(`${this.baseURL}/api/reservas/verificar-disponibilidad?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result.success ? result.data : { disponible: false, motivo: 'Error al verificar disponibilidad' };
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      return { disponible: false, motivo: 'Error al verificar disponibilidad: ' + error.message };
    }
  }
  /**
   * Obtiene las aulas virtuales disponibles
   * @param {string} fecha - Fecha en formato YYYY-MM-DD (opcional)
   * @param {string} horaInicio - Hora de inicio en formato HH:MM (opcional)
   * @param {string} horaFin - Hora de fin en formato HH:MM (opcional)
   * @returns {Promise<Array>} Lista de aulas disponibles
   */
  async getAulasDisponibles(fecha = null, horaInicio = null, horaFin = null) {
    try {
      // Construir URL con parámetros opcionales
      let url = `${this.baseURL}/api/aula-virtual/disponibles`;
      const params = new URLSearchParams();
      
      if (fecha) params.append('fecha', fecha);
      if (horaInicio) params.append('horaInicio', horaInicio);
      if (horaFin) params.append('horaFin', horaFin);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      // El endpoint retorna: { success: true, data: { aulas: [...], total: n } }
      return data.data?.aulas || data.data || data || [];
    } catch (error) {
      console.error('Error fetching aulas:', error);
      throw error;
    }
  }
  /**
   * Obtiene los cursos del usuario autenticado
   * @returns {Promise<Array} Lista de cursos
   */
  async getCursosProfesor() {
    try {
      // Usar el servicio de perfil para obtener cursos específicos del usuario
      const response = await perfilService.obtenerMisCursos();
      
      if (response.success) {
        return response.data || [];
      } else {
        throw new Error(response.error || 'Error al obtener cursos');
      }
    } catch (error) {
      console.error('Error fetching cursos:', error);
      throw error;
    }
  }

  /**
   * Obtiene los motivos de reserva disponibles
   * @returns {Promise<Array>} Lista de motivos
   */
  async getMotivosReserva() {
    try {
      const response = await fetch(`${this.baseURL}/api/reservas/motivos-reserva`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error fetching motivos:', error);
      // Devolver motivos por defecto en caso de error
      return [
        'Clase regular',
        'Clase de recuperación',
        'Examen parcial',
        'Examen final',
        'Presentación de trabajos',
        'Tutoría grupal',
        'Sesión de laboratorio',
        'Capacitación docente',
        'Reunión de coordinación',
        'Evento académico',
        'Otro'
      ];
    }
  }

  /**
   * Obtiene las horas ocupadas para una fecha y aula específica
   * @param {number} aulaId - ID del aula virtual
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de rangos horarios ocupados
   */
  async obtenerHorasOcupadas(aulaId, fecha) {
    try {
      const response = await fetch(`${this.baseURL}/api/reservas/horas-ocupadas/${aulaId}/${fecha}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        console.log('No se pudo obtener horas ocupadas, devolviendo array vacío');
        return [];
      }

      const data = await response.json();
      return data.data || []; // Devolver array vacío si no hay datos
    } catch (error) {
      console.error('Error obteniendo horas ocupadas:', error);
      return []; // En caso de error, devolver array vacío
    }
  }
  /**
   * Valida si una fecha es válida para crear reservas
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @param {string} hora - Hora en formato HH:MM (opcional)
   * @returns {Object} Resultado de la validación
   */
  validateDate(fecha, hora = null) {
    try {
      const fechaObj = new Date(fecha + (hora ? `T${hora}:00` : 'T00:00:00'));
      const hoy = new Date();
      
      // Verificar que no sea domingo (día 0)
      if (fechaObj.getDay() === 0) {
        return {
          isValid: false,
          error: 'No se permiten reservas los domingos'
        };
      }
      
      // Si se proporciona una hora específica
      if (hora) {
        // Verificar que la fecha y hora no sean en el pasado
        if (fechaObj <= hoy) {
          return {
            isValid: false,
            error: 'No se pueden crear reservas en fechas u horas pasadas'
          };
        }
      } else {
        // Solo verificar la fecha (sin hora)
        const fechaSoloFecha = new Date(fecha + 'T00:00:00');
        const hoySoloFecha = new Date();
        hoySoloFecha.setHours(0, 0, 0, 0);
        
        if (fechaSoloFecha < hoySoloFecha) {
          return {
            isValid: false,
            error: 'No se pueden crear reservas en fechas pasadas'
          };
        }
      }
      
      return {
        isValid: true,
        error: null
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Fecha inválida'
      };
    }
  }

  /**
   * Valida un rango de tiempo para reservas
   * @param {string} horaInicio - Hora de inicio en formato HH:MM
   * @param {string} horaFin - Hora de fin en formato HH:MM
   * @returns {Object} Resultado de la validación
   */
  validateTimeRange(horaInicio, horaFin) {
    try {
      const inicioMinutos = this.convertirHoraAMinutos(horaInicio);
      const finMinutos = this.convertirHoraAMinutos(horaFin);
      const duracionMinutos = finMinutos - inicioMinutos;
      
      // Validar que fin > inicio
      if (finMinutos <= inicioMinutos) {
        return {
          isValid: false,
          error: 'La hora de fin debe ser posterior a la hora de inicio'
        };
      }
      
      // Validar duración mínima (30 minutos)
      if (duracionMinutos < 30) {
        return {
          isValid: false,
          error: 'La duración mínima es de 30 minutos'
        };
      }
      
      // Validar duración máxima (4 horas)
      if (duracionMinutos > 240) {
        return {
          isValid: false,
          error: 'La duración máxima es de 4 horas'
        };
      }
      
      // Validar que la duración sea múltiplo de 30 minutos
      if (duracionMinutos % 30 !== 0) {
        return {
          isValid: false,
          error: 'La duración debe ser múltiplo de 30 minutos (30, 60, 90, 120, 150, 180, 210, 240 minutos)'
        };
      }
        // Validar horario de funcionamiento (8:00 - 22:00)
      const apertura = 8 * 60; // 8:00
      const cierre = 22 * 60; // 22:00
      
      if (inicioMinutos < apertura || finMinutos > cierre) {
        return {
          isValid: false,
          error: 'Las reservas solo están permitidas entre 08:00 y 22:00'
        };
      }
      
      return {
        isValid: true,
        error: null
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Horario inválido'
      };
    }
  }

  /**
   * Verifica la disponibilidad de un aula en un horario específico
   * @param {number} aulaId - ID del aula
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @param {string} horaInicio - Hora de inicio en formato HH:MM
   * @param {string} horaFin - Hora de fin en formato HH:MM
   * @returns {Promise<Object>} Resultado de la verificación
   */
  async checkAulaAvailability(aulaId, fecha, horaInicio, horaFin) {
    try {
      const disponibilidad = await this.verificarDisponibilidad(aulaId, fecha, horaInicio, horaFin);
      
      if (disponibilidad.disponible) {
        return {
          available: true,
          reason: null,
          conflicts: []
        };
      } else {
        return {
          available: false,
          reason: disponibilidad.motivo || 'Aula no disponible en el horario seleccionado',
          conflicts: disponibilidad.conflictos || []
        };
      }
    } catch (error) {
      console.error('Error checking aula availability:', error);
      return {
        available: false,
        reason: 'Error al verificar disponibilidad: ' + error.message,
        conflicts: []
      };
    }
  }
  /**
   * Obtiene el perfil del usuario autenticado
   * @returns {Promise<Object>} Perfil del usuario
   */
  async obtenerPerfilUsuario() {
    try {
      const authData = storage.getAuthData();
      if (!authData?.user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const endpoints = [
        `${this.baseURL}/api/perfil`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'GET',
            headers: this.getAuthHeaders()
          });

          if (response.ok) {
            const data = await response.json();
            return {
              success: true,
              data: data.data || data,
              message: data.message || 'Perfil obtenido exitosamente'
            };
          } else {
            console.warn(`Error ${response.status} con endpoint ${endpoint}`);
            continue;
          }
        } catch (endpointError) {
          console.warn(`Error de red con endpoint ${endpoint}:`, endpointError.message);
          continue;
        }
      }

      // Si todos los endpoints fallan, retornar datos por defecto
      console.warn('No se pudo obtener el perfil del usuario, usando datos del usuario');
      return {
        success: true,
        data: {
          userId: authData.user.id,
          nombre: authData.user.nombre || authData.user.username,
          email: authData.user.email
        },
        message: 'Usando datos básicos del usuario'
      };

    } catch (error) {
      console.error('Error obteniendo perfil usuario:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener perfil del usuario',
        data: null
      };
    }
  }

  /**
   * Obtiene el perfil del usuario autenticado (alias para compatibilidad)
   * @returns {Promise<Object>} Perfil del usuario
   */
  async obtenerPerfilProfesor() {
    return this.obtenerPerfilUsuario();
  }
  /**
   * Crea una nueva reserva
   * @param {Object} reservaData - Datos de la reserva
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async crearReserva(reservaData) {
    try {
      // Usar el servicio de reservas en lugar de reimplementar
      const { reservaService } = await import('./api/reservaService');
      return await reservaService.crearReserva(reservaData);
    } catch (error) {
      console.error('Error al crear reserva:', error);
      return {
        success: false,
        error: error.message || 'Error al crear la reserva',
        details: {}
      };
    }
  }
}

export const calendarService = new CalendarService();
