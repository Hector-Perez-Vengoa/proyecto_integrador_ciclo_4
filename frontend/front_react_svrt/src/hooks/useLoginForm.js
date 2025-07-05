// src/hooks/useLoginForm.js
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services';
import { validateEmail, validatePassword, validateName, showToast } from '../utils/authUtils';
import { AUTH_CONFIG } from '../constants/auth';
import { useAnimations } from './useAnimations';

export const useLoginForm = (onSuccess) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { flipTransition, staggeredEntrance, shakeError, clearAllTimeouts } = useAnimations();
  // Cleanup al desmontar
  useEffect(() => {
    // Limpiar credenciales de Google si existen
    if (localStorage.getItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY)) {
      localStorage.removeItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
    }
    
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  const validateForm = () => {
    const errors = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    if (!isLogin) {
      const nameError = validateName(formData.name);
      if (nameError) errors.name = nameError;
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const getErrorMessage = (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          return data.message || data.error || 'Datos inválidos. Verifica la información ingresada.';
        case 401:
          return 'Credenciales incorrectas. Verifica tu email y contraseña.';
        case 403:
          return 'Acceso denegado. Solo se permiten correos @tecsup.edu.pe';
        case 404:
          return 'Servicio no encontrado. Contacta al administrador.';
        case 409:
          return 'El usuario ya existe. Intenta iniciar sesión.';
        case 500:
          return 'Error del servidor. Intenta más tarde.';
        default:
          return data.message || data.error || 'Error desconocido del servidor';
      }
    } else if (error.request) {
      return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    } else {      return error.message || 'Error inesperado. Intenta nuevamente.';
    }
  };

  // Manejar éxito de Google OAuth
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google decoded:', decoded);

      // Verificar y normalizar dominio tecsup.edu.pe
      const email = decoded.email ? decoded.email.trim().toLowerCase() : '';
      if (!email || !email.endsWith('@tecsup.edu.pe')) {
        showToast('Solo se permiten correos con dominio @tecsup.edu.pe', 'error');
        console.log('Email rechazado:', email);
        return;
      }

      // Enviar al backend Spring Boot con datos del token decodificado
      const googleAuthRequest = {
        token: credentialResponse.credential,
        email: email, // Email normalizado
        firstName: decoded.given_name || '',
        lastName: decoded.family_name || ''
      };
        const response = await authService.googleAuth(googleAuthRequest);
      console.log('Google Backend response:', response);
      console.log('Google User data from response:', response.user);

      // Verificar respuesta válida
      if (!response) {
        throw new Error('Respuesta vacía del servidor');
      }

      // Crear datos de usuario con valores por defecto
      const userData = {
        name: response.user?.firstName ? 
          `${response.user.firstName} ${response.user.lastName || ''}`.trim() :
          decoded.name || 'Usuario',
        email: response.user?.email || decoded.email,
        firstName: response.user?.firstName || decoded.given_name || '',
        lastName: response.user?.lastName || decoded.family_name || '',
        id: response.user?.id || decoded.sub
      };
      
      console.log('Google Final userData object:', userData);// Verificar si el usuario necesita crear contraseña
      if (response.requirePassword || response.needsPassword) {
        localStorage.setItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY, credentialResponse.credential);
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(userData));
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.token || '');
        if (onSuccess) onSuccess(response.token, userData);
        showToast(`Bienvenido ${userData.firstName}. Por favor configura tu contraseña.`, 'info');
        return;
      }

      // Usuario existente, login normal
      if (onSuccess) {
        onSuccess(response.token, userData);
      }
      showToast(`¡Bienvenido ${userData.name}!`);

    } catch (error) {
      console.error('Error de autenticación Google:', error);
      
      let errorMsg = 'Error al iniciar sesión con Google';
      
      if (error.response) {
        errorMsg = error.response.data?.message || error.response.data?.error || errorMsg;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      showToast(errorMsg, 'error');
    }
  }, [onSuccess]);

  // Manejar error de Google OAuth
  const handleGoogleError = useCallback(() => {
    console.error('Error en Google Login');
    showToast('Error al iniciar sesión con Google. Intenta nuevamente.', 'error');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    setFormErrors({});
    
    try {
      let response;
      
      if (isLogin) {
        response = await authService.login(formData.email, formData.password);
      } else {
        response = await authService.register(formData.name, formData.email, formData.password);
      }      // Validar respuesta según el tipo de operación
      if (!response) {
        throw new Error('Respuesta vacía del servidor');
      }
      
      if (isLogin) {
        // Para login, esperamos token
        if (!response.token) {
          throw new Error('Token de autenticación no recibido');
        }
      } else {
        // Para registro, ahora también esperamos token
        if (!response.token) {
          throw new Error('Token de autenticación no recibido después del registro');
        }
      }
        // Log para debugging
      console.log('Login/Register response:', response);
      console.log('User data from response:', response.user);
      
      // Crear objeto de usuario
      const userData = {
        email: response.user?.email || formData.email,
        name: response.user?.firstName ? 
          `${response.user.firstName} ${response.user.lastName || ''}`.trim() : 
          formData.name,
        firstName: response.user?.firstName || formData.name.split(' ')[0],
        lastName: response.user?.lastName || formData.name.split(' ').slice(1).join(' '),
        id: response.user?.id,
        username: response.user?.username || response.user?.email
      };
      
      console.log('Final userData object:', userData);
        // Ejecutar callback inmediatamente para redirección rápida
      if (onSuccess) {
        onSuccess(response.token, userData);
      }
      
      // Mostrar mensaje de bienvenida personalizado después de la redirección
      const welcomeMessage = isLogin ? 
        `¡Bienvenido ${userData.name}!` : 
        `¡Cuenta creada exitosamente! Bienvenido ${userData.name}!`;
      
      showToast(welcomeMessage);
      
    } catch (error) {
      console.error('Error de autenticación:', error);
      const errorMsg = getErrorMessage(error);
      showToast(errorMsg, 'error');
      
      // Si hay errores específicos del backend, mostrarlos en el formulario
      if (error.response?.data?.field) {
        setFormErrors({
          [error.response.data.field]: error.response.data.message
        });
      }    } finally {
      setLoading(false);
    }
  };

  const toggleForm = async () => {
    if (isTransitioning) return; // Evitar múltiples clics durante animación
    
    setIsTransitioning(true);
    
    // Usar el hook de animaciones para transición profesional
    const formContainer = document.querySelector('.form-container');
    const formItems = Array.from(document.querySelectorAll('.form-item'));
    
    try {
      await flipTransition(formContainer, () => {
        setFormErrors({});
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
        setIsLogin(!isLogin);
      });
      
      // Animar entrada de elementos después del flip
      setTimeout(() => {
        staggeredEntrance(formItems, 'animate-fadeInUp', 80);
      }, 100);
      
    } catch (error) {
      console.error('Error en animación de toggle:', error);
    } finally {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };  return {
    isLogin,
    loading,
    formData,
    formErrors,
    showPassword,
    showConfirmPassword,
    isTransitioning,
    handleChange,
    handleSubmit,
    toggleForm,
    setShowPassword,
    setShowConfirmPassword,
    handleGoogleSuccess,
    handleGoogleError
  };
};
