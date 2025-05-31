// src/services/api/authService.js
import axios from 'axios';
import { AUTH_CONFIG, AUTH_ENDPOINTS } from '../../constants/auth';

// Configurar axios instance
const api = axios.create({
  baseURL: AUTH_CONFIG.BACKEND_URL,
  timeout: 10000,
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
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      localStorage.removeItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
    }
    
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {  // Login con email y password
  login: async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, { 
        email: email.trim(), 
        password: password.trim() 
      });
      console.log('Login successful');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  // Registro de usuario
  register: async (name, email, password) => {
    try {
      // Separar nombre en firstName y lastName para Spring Boot
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
        const payload = {
        firstName: firstName,
        lastName: lastName,
        email: email.trim(),
        password: password.trim()
      };
      
      console.log('Attempting user registration...');
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, payload);
      console.log('Registration successful');
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },  // Autenticación con Google
  googleAuth: async (googleAuthRequest) => {
    try {
      console.log('Attempting Google authentication...');
      const response = await api.post(AUTH_ENDPOINTS.GOOGLE, googleAuthRequest);
      console.log('Google authentication successful');
      return response.data;
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  },

  // Test de conexión
  testConnection: async () => {
    try {
      const response = await api.get('/auth/test');
      return response.data;
    } catch (error) {
      console.error('Connection test error:', error);
      throw error;
    }
  }
};

export default api;