// src/hooks/usePasswordSetup.js
import { useState } from 'react';
import { userService } from '../services';
import { validatePassword, validatePasswordConfirmation } from '../utils/validationUtils';
import { showToast } from '../utils/authUtils';
import { AUTH_CONFIG } from '../constants/auth';

export const usePasswordSetup = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const passwordErrors = validatePassword(formData.password);
    const confirmErrors = validatePasswordConfirmation(
      formData.password, 
      formData.confirmPassword
    );
    
    return { ...passwordErrors, ...confirmErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      const googleToken = localStorage.getItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
      
      if (googleToken) {
        await userService.setupPassword(formData.password, googleToken);
        localStorage.removeItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
      } else {
        await userService.changePassword('', formData.password);
      }
      
      setSuccess(true);
      showToast('¡Contraseña configurada exitosamente!');
      
    } catch (error) {
      console.error('Error al configurar contraseña:', error);
      const errorMsg = error.response?.data?.message || 'Error al configurar la contraseña';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    success,
    handleChange,
    handleSubmit
  };
};