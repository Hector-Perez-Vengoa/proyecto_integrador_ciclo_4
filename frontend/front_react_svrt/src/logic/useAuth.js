// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { storage } from '../utils/authUtils';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = () => {
    try {
      const { token, user } = storage.getAuthData();
      if (token && user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        // Si no hay token o usuario, limpiar estado pero sin redirigir aquí
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // En caso de error, limpiar estado pero sin redirigir
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    storage.setAuthData(token, userData);
    setIsAuthenticated(true);
    setUser(userData);
  };  const logout = () => {
    storage.clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    // Forzar recarga completa de la página para asegurar redirección
    window.location.href = '/';
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  };
};