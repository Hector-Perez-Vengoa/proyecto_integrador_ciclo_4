// src/utils/authUtils.js
import { AUTH_CONFIG, VALIDATION_RULES } from '../constants/auth';

// Validaciones
export const validateEmail = (email) => {
  if (!email) return 'El correo es requerido';
  if (!email.endsWith(VALIDATION_RULES.REQUIRED_DOMAIN)) {
    return `Debe ser un correo de Tecsup (${VALIDATION_RULES.REQUIRED_DOMAIN})`;
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} caracteres`;
  }
  return null;
};

export const validateName = (name) => {
  if (!name) return 'El nombre es requerido';
  return null;
};

// Manejo de localStorage
export const storage = {
  setAuthData: (token, user) => {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
  },

  getAuthData: () => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const user = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  },

  clearAuthData: () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }
};

// Función para mostrar notificaciones toast (tu código original)
export const showToast = (message, type = 'success') => {
  const bgColor = type === 'success' ? 'bg-green-500' : 
                 type === 'error' ? 'bg-red-500' : 
                 type === 'info' ? 'bg-blue-500' : 'bg-gray-500';
                 
  const iconPath = type === 'success' ? 'M5 13l4 4L19 7' : 
                  type === 'error' ? 'M6 18L18 6M6 6l12 12' : 
                  type === 'info' ? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : '';
                  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right`;
  toast.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
      </svg>
      ${message}
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
};