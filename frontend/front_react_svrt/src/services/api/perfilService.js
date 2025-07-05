// src/services/api/perfilService.js
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

export const perfilService = {
  // Obtener perfil del usuario autenticado
  async obtenerPerfil() {
    try {
      const response = await api.get('/perfil');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Perfil obtenido correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener el perfil',
        data: null
      };
    }
  },

  // Obtener todos los cursos disponibles
  async obtenerCursos() {
    try {
      const response = await api.get('/perfil/cursos');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Cursos obtenidos correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener los cursos',
        data: []
      };
    }
  },

  // Obtener cursos específicos del usuario autenticado
  async obtenerMisCursos() {
    try {
      const response = await api.get('/perfil/mis-cursos');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Cursos del usuario obtenidos correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener los cursos del usuario',
        data: []
      };
    }
  },

  // Obtener todas las carreras disponibles
  async obtenerCarreras() {
    try {
      const response = await api.get('/perfil/carreras');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Carreras obtenidas correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener las carreras',
        data: []
      };
    }
  },

  // Obtener todos los departamentos disponibles
  async obtenerDepartamentos() {
    try {
      const response = await api.get('/perfil/departamentos');
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Departamentos obtenidos correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener los departamentos',
        data: []
      };
    }
  },

  // Obtener carreras por departamento
  async obtenerCarrerasPorDepartamento(departamentoId) {
    try {
      const response = await api.get(`/perfil/carreras/departamento/${departamentoId}`);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Carreras obtenidas correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener las carreras',
        data: []
      };
    }
  },

  // Obtener cursos por carrera
  async obtenerCursosPorCarrera(carreraId) {
    try {
      const response = await api.get(`/perfil/cursos/carrera/${carreraId}`);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Cursos obtenidos correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener los cursos',
        data: []
      };
    }
  },

  // Obtener cursos por múltiples carreras
  async obtenerCursosPorCarreras(carreraIds) {
    try {
      const response = await api.post('/perfil/cursos/carreras', carreraIds);
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message || 'Cursos obtenidos correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al obtener los cursos',
        data: []
      };
    }
  },

  // Actualizar perfil
  async actualizarPerfil(datos) {
    try {
      const response = await api.put('/perfil', datos);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Perfil actualizado correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al actualizar el perfil',
        data: null
      };
    }
  },

  // Sincronizar imagen de perfil
  async sincronizarImagenPerfil() {
    try {
      const response = await api.post('/perfil/imagen/sincronizar');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Imagen de perfil sincronizada correctamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Error al sincronizar la imagen',
        data: null
      };
    }
  }
};
