// src/services/api/profileService.js
import api from './authService';

export const profileService = {
  // Obtener perfil del usuario autenticado
  getProfile: async () => {
    try {
      const response = await api.get('/perfil');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  },

  // Actualizar perfil del usuario autenticado
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/perfil', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Verificar estado del perfil (si está completo)
  getProfileStatus: async () => {
    try {
      const response = await api.get('/perfil/estado');
      return response.data;
    } catch (error) {
      console.error('Error getting profile status:', error);
      throw error;
    }
  },

  // Subir imagen de perfil
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('imagen', imageFile);
      
      const response = await api.post('/perfil/imagen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
};
