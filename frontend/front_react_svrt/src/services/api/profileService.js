// src/services/api/profileService.js
import api from './authService';

export const profileService = {
  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    try {
      const response = await api.get('/perfil');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil del usuario autenticado
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/perfil', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verificar estado del perfil (si está completo)
  getProfileStatus: async () => {
    try {
      const response = await api.get('/perfil/estado');
      return response.data;
    } catch (error) {
      throw error;
    }
  },  // Sincronizar imagen de perfil desde Google
  syncProfileImage: async () => {
    try {
      const response = await api.post('/perfil/imagen/sincronizar');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener departamentos disponibles
  getDepartamentos: async () => {
    try {
      const response = await api.get('/perfil/departamentos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener carreras disponibles
  getCarreras: async () => {
    try {
      const response = await api.get('/perfil/carreras');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener cursos disponibles
  getCursos: async () => {
    try {
      const response = await api.get('/perfil/cursos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Nuevos métodos para filtrado cascada
  
  // Obtener carreras por departamento
  getCarrerasByDepartamento: async (departamentoId) => {
    try {
      const response = await api.get(`/perfil/carreras/departamento/${departamentoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener cursos por carrera
  getCursosByCarrera: async (carreraId) => {
    try {
      const response = await api.get(`/perfil/cursos/carrera/${carreraId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener cursos por múltiples carreras
  getCursosByCarreras: async (carreraIds) => {
    try {
      const response = await api.post('/perfil/cursos/carreras', carreraIds);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
