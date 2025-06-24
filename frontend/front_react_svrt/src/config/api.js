// src/config/api.js

/**
 * Configuración de endpoints y URLs de la API
 */

// URL base del backend Spring Boot (para profesores)
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// URL del backend Django (para administración) 
export const DJANGO_BASE_URL = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://localhost:8000';

// Endpoints principales
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // Profesores
  PROFESORES: '/api/profesores',
  PROFESOR_BY_ID: (id) => `/api/profesores/${id}`,
  
  // Reservas
  RESERVAS: '/api/reservas',
  RESERVAS_BY_PROFESOR: (profesorId) => `/api/reservas/profesor/${profesorId}`,
  CREAR_RESERVA: '/api/reservas',
  CANCELAR_RESERVA: (id) => `/api/reservas/${id}/cancelar`,
  VALIDAR_DISPONIBILIDAD: '/api/reservas/validar-disponibilidad',
  
  // Aulas virtuales
  AULAS_VIRTUALES: '/api/aulas-virtuales',
  AULA_BY_ID: (id) => `/api/aulas-virtuales/${id}`,
  
  // Cursos
  CURSOS: '/api/cursos',
  CURSOS_BY_PROFESOR: (profesorId) => `/api/cursos/profesor/${profesorId}`,
  
  // Calendario
  FECHAS_BLOQUEADAS: '/api/calendario/fechas-bloqueadas',
  HORARIOS_DISPONIBLES: '/api/calendario/horarios-disponibles'
};

// Configuración de timeouts
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

/**
 * Obtiene los headers de autorización
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...DEFAULT_HEADERS,
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Construye la URL completa para un endpoint
 */
export const buildUrl = (endpoint, baseUrl = BASE_URL) => {
  return `${baseUrl}${endpoint}`;
};

/**
 * Maneja errores de respuesta HTTP
 */
export const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);
  
  if (error.response) {
    // Error de respuesta del servidor
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (status) {
      case 401:
        // Token expirado o no autorizado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      
      case 403:
        throw new Error('No tienes permisos para realizar esta acción.');
      
      case 404:
        throw new Error('Recurso no encontrado.');
      
      case 422:
        throw new Error(message || 'Datos de entrada inválidos.');
      
      case 500:
        throw new Error('Error interno del servidor. Intenta nuevamente.');
      
      default:
        throw new Error(message || `Error ${status}: ${error.response.statusText}`);
    }
  } else if (error.request) {
    // Error de red
    throw new Error('Error de conexión. Verifica tu conexión a internet.');
  } else {
    // Error de configuración
    throw new Error(error.message || 'Error inesperado.');
  }
};

export default {
  BASE_URL,
  DJANGO_BASE_URL,
  API_ENDPOINTS,
  API_CONFIG,
  DEFAULT_HEADERS,
  getAuthHeaders,
  buildUrl,
  handleApiError
};
