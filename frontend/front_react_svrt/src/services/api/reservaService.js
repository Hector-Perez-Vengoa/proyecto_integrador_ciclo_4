// src/services/api/reservaService.js
import axios from 'axios';
import { AUTH_CONFIG } from '../../constants/auth';
import { storage } from '../../utils/authUtils';

// Configurar axios instance
const api = axios.create({
  baseURL: AUTH_CONFIG.BACKEND_URL,
  timeout: 30000, // 30 segundos - más que suficiente para la operación de DB
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token es inválido, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const reservaService = {  // Crear nueva reserva
  async crearReserva(reservaData) {
    try {
      console.log('🚀 ReservaService: Iniciando creación de reserva con datos:', reservaData);
      
      // Primero obtener el perfil del profesor
      const perfilResponse = await this.obtenerPerfilProfesor();
      if (!perfilResponse.success) {
        console.error('❌ ReservaService: Error obteniendo perfil profesor:', perfilResponse.error);
        throw new Error(perfilResponse.error);
      }
      
      console.log('✅ ReservaService: Perfil profesor obtenido:', perfilResponse.data);
      
      // Agregar el profesorId del usuario autenticado
      const reservaCompleta = {
        ...reservaData,
        profesorId: perfilResponse.data.profesorId
      };
      
      console.log('📤 ReservaService: Enviando reserva completa:', reservaCompleta);
      
      const response = await api.post('/reservas', reservaCompleta);
        console.log('📥 ReservaService: Respuesta completa del backend:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });
      
      // Verificar primero si la respuesta HTTP fue exitosa (200-299)
      if (response.status >= 200 && response.status < 300) {
        // Luego verificar si la respuesta del backend indica éxito
        if (response.data && typeof response.data === 'object') {
          if (response.data.success === true) {
            console.log('✅ ReservaService: Backend reportó éxito explícito');            return {
              success: true,
              data: response.data.data,
              message: (response.data.message || 'Reserva creada exitosamente') + '. Se enviará una confirmación por email.'
            };
          } else if (response.data.success === false) {
            console.error('❌ ReservaService: Backend reportó error explícito:', response.data);
            return {
              success: false,
              error: response.data.message || response.data.error || 'Error reportado por el backend',
              details: response.data.data || {}
            };
          } else {
            // No hay campo success explícito, pero la respuesta HTTP fue exitosa
            console.log('⚠️ ReservaService: Sin campo success, pero HTTP OK - asumiendo éxito');            return {
              success: true,
              data: response.data.data || response.data,
              message: (response.data.message || 'Reserva creada exitosamente') + '. Se enviará una confirmación por email.'
            };
          }
        } else {
          console.log('⚠️ ReservaService: Respuesta sin data object - asumiendo éxito por HTTP status');          return {
            success: true,
            data: response.data,
            message: 'Reserva creada exitosamente. Se enviará una confirmación por email.'
          };
        }
      } else {
        console.error('❌ ReservaService: Status HTTP no exitoso:', response.status);
        return {
          success: false,
          error: `Error HTTP ${response.status}: ${response.statusText}`,
          details: response.data || {}
        };
      }
        } catch (error) {
      console.error('❌ ReservaService: Error en crearReserva:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : 'No response object'
      });
      
      // Si hay respuesta del servidor pero con código de error
      if (error.response) {
        return {
          success: false,
          error: error.response.data?.message || error.response.data?.error || `Error ${error.response.status}: ${error.response.statusText}`,
          details: error.response.data?.data || {},
          status: error.response.status
        };      } else if (error.request) {
        // Error de red/conectividad o timeout
        let errorMessage = 'Error de conexión. Verifique su conexión a internet.';
        
        // Detectar timeout específicamente
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorMessage = 'La creación de la reserva está tomando más tiempo del esperado. Esto puede ser porque se está enviando la notificación por email. Por favor, verifica en "Mis Reservas" si se creó correctamente.';
        }
        
        return {
          success: false,
          error: errorMessage,
          details: {},
          isTimeout: error.code === 'ECONNABORTED' || error.message.includes('timeout')
        };
      } else {
        // Error en la configuración de la request
        return {
          success: false,
          error: error.message || 'Error al crear la reserva',
          details: {}
        };
      }
    }
  },

  // Obtener reservas del usuario
  async obtenerMisReservas() {
    try {
      const response = await api.get('/reservas/mis-reservas');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar las reservas',
        data: []
      };
    }
  },  // Verificar disponibilidad de aula
  async verificarDisponibilidad(aulaId, fecha, horaInicio, horaFin) {
    try {
      const response = await api.get('/reservas/verificar-disponibilidad', {
        params: {
          aulaVirtualId: aulaId,
          fecha: fecha,
          horaInicio: horaInicio,
          horaFin: horaFin
        }
      });
      return {
        success: true,
        disponible: response.data.data?.disponible || false,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        disponible: false,
        error: error.response?.data?.message || 'Error al verificar disponibilidad'
      };
    }
  },  // Obtener perfil del profesor por userId
  async obtenerPerfilProfesor() {
    try {
      // Obtener el usuario del localStorage
      const authData = storage.getAuthData();
      if (!authData?.user?.id) {
        throw new Error('Usuario no autenticado o sin ID');
      }

      const endpoints = [
        `/reservas/mi-perfil-profesor?userId=${authData.user.id}`,
        `/perfil/profesor/${authData.user.id}`,
        `/usuarios/${authData.user.id}/perfil-profesor`,
        `/profesores/perfil?userId=${authData.user.id}`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint);
          return {
            success: true,
            data: response.data.data || response.data,
            message: response.data.message || 'Perfil obtenido exitosamente'
          };
        } catch (endpointError) {
          // Continuar con el siguiente endpoint
          console.warn(`Error con endpoint ${endpoint}:`, endpointError.response?.status);
          continue;
        }
      }

      // Si todos los endpoints fallan, retornar datos por defecto
      console.warn('No se pudo obtener el perfil del profesor, usando datos del usuario');
      return {
        success: true,
        data: {
          profesorId: authData.user.id,
          userId: authData.user.id,
          nombre: authData.user.nombre || authData.user.username,
          email: authData.user.email
        },
        message: 'Usando datos básicos del usuario'
      };

    } catch (error) {
      console.error('Error obteniendo perfil profesor:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener perfil del profesor',
        data: null
      };
    }
  },
  // Obtener cursos del profesor
  async obtenerCursosProfesor() {
    try {
      // Primero obtener el perfil del profesor
      const perfilResponse = await this.obtenerPerfilProfesor();
      if (!perfilResponse.success) {
        throw new Error(perfilResponse.error);
      }
      
      const profesorId = perfilResponse.data.profesorId;
      const response = await api.get(`/reservas/cursos-profesor/${profesorId}`);
      
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al cargar los cursos',
        data: []
      };
    }
  },  // Cancelar reserva (simplificado - solo usa un endpoint)
  async cancelarReserva(reservaId, motivo = '') {
    try {
      console.log('🔄 ReservaService: Cancelando reserva:', { reservaId, motivo });
      
      const requestData = {
        motivoCancelacion: motivo || 'Cancelado por el usuario',
        observaciones: motivo || 'Cancelado desde el frontend'
      };
      
      console.log('📤 ReservaService: Enviando solicitud de cancelación a /cancelar');
      
      const response = await api.post(`/reservas/${reservaId}/cancelar`, requestData);
      
      console.log('✅ ReservaService: Respuesta exitosa:', response.data);
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Reserva cancelada exitosamente'
      };

    } catch (error) {
      console.error('❌ ReservaService: Error al cancelar reserva:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al cancelar la reserva'
      };
    }
  },

  // Obtener reservas del profesor actual
  async obtenerReservasProfesor() {
    try {
      // Primero obtener el perfil del profesor
      const perfilResponse = await this.obtenerPerfilProfesor();
      if (!perfilResponse.success) {
        throw new Error(perfilResponse.error);
      }
      
      const profesorId = perfilResponse.data.profesorId;
      const response = await api.get(`/reservas/profesor/${profesorId}`);
      
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al cargar las reservas',
        data: []
      };
    }
  }
};
