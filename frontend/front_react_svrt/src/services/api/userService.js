// src/services/api/userService.js
import api from './authService';

export const userService = {
  // Actualizar perfil de usuario
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/user/password', {
      currentPassword: currentPassword,
      newPassword: newPassword
    });
    return response.data;
  },

  // Configurar contraseña para usuarios de Google
  setupPassword: async (password, googleToken) => {
    const response = await api.post('/user/setup-password', {
      password: password,
      googleToken: googleToken
    });
    return response.data;
  },
  // Obtener información del usuario
  getUserInfo: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  }
};