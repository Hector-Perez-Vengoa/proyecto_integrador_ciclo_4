// src/services/api/aulaVirtualService.js
import axios from 'axios';
import { AUTH_CONFIG } from '../../constants/auth';

// Configurar axios instance
const api = axios.create({
  baseURL: AUTH_CONFIG.BACKEND_URL,
  timeout: 15000,
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

export const aulaVirtualService = {
  // Obtener todas las aulas virtuales
  async obtenerAulas() {
    try {
      const response = await api.get('/aula-virtual');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Aulas obtenidas correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error al obtener las aulas virtuales'
      };
    }
  },
  // Obtener solo las aulas disponibles con filtros opcionales
  async obtenerAulasDisponibles(filtros = {}) {
    try {
      // Construir parámetros de consulta
      const params = new URLSearchParams();
      
      // Filtros básicos
      if (filtros.codigo) params.append('codigo', filtros.codigo);
      if (filtros.descripcion) params.append('descripcion', filtros.descripcion);
      
      // Filtros avanzados
      if (filtros.fecha) params.append('fecha', filtros.fecha);
      if (filtros.horaInicio) params.append('horaInicio', filtros.horaInicio);
      if (filtros.horaFin) params.append('horaFin', filtros.horaFin);
      if (filtros.cursoId) params.append('cursoId', filtros.cursoId);
      
      const url = `/aula-virtual/disponibles${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await api.get(url);
      return {
        success: true,
        data: response.data.data || {},
        message: response.data.message || 'Aulas disponibles obtenidas correctamente'
      };
    } catch (error) {
      return {
        success: false,
        data: { aulas: [], total: 0, profesor: '', filtros: {} },
        message: error.response?.data?.message || 'Error al obtener las aulas disponibles'
      };
    }
  },

  // Obtener aula específica por ID
  async obtenerAulaPorId(id) {
    try {
      const response = await api.get(`/aula-virtual/${id}`);
      return {
        success: true,
        data: response.data.data || null,
        message: response.data.message || 'Aula obtenida correctamente'
      };
    } catch (error) {
      console.error('Error al obtener aula por ID:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al obtener la información del aula'
      };
    }
  },

  // Crear nueva aula virtual
  async crearAula(aulaData) {
    try {
      const response = await api.post('/aula-virtual', aulaData);
      return {
        success: true,
        data: response.data.data || null,
        message: response.data.message || 'Aula creada correctamente'
      };
    } catch (error) {
      console.error('Error al crear aula virtual:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al crear el aula virtual'
      };
    }
  },

  // Actualizar aula virtual
  async actualizarAula(codigo, aulaData) {
    try {
      const response = await api.put(`/aula-virtual/${codigo}`, aulaData);
      return {
        success: true,
        data: response.data.data || null,
        message: response.data.message || 'Aula actualizada correctamente'
      };
    } catch (error) {
      console.error('Error al actualizar aula virtual:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al actualizar el aula virtual'
      };
    }
  },

  // Eliminar aula virtual
  async eliminarAula(codigo) {
    try {
      const response = await api.delete(`/aula-virtual/${codigo}`);
      return {
        success: true,
        data: null,
        message: response.data.message || 'Aula eliminada correctamente'
      };
    } catch (error) {
      console.error('Error al eliminar aula virtual:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al eliminar el aula virtual'
      };
    }
  }
};
