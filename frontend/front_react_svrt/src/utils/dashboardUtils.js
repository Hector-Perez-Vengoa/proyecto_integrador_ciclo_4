// src/utils/dashboardUtils.js
import { AUTH_CONFIG } from '../constants/auth';

export const checkPasswordRequired = () => {
  return !!localStorage.getItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
};

export const getUserInitials = (user) => {
  if (user?.name) return user.name[0];
  if (user?.firstName) return user.firstName[0];
  return 'U';
};

export const getUserFullName = (user) => {
  if (user?.name) return user.name;
  if (user?.firstName) {
    return `${user.firstName} ${user.lastName || ''}`.trim();
  }
  return 'Usuario';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};