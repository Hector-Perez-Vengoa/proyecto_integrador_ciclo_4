// src/utils/validationUtils.js
export const validatePassword = (password) => {
  const errors = {};
  
  if (!password) {
    errors.password = 'La contraseña es requerida';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return errors;
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
  const errors = {};
  
  if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  
  return errors;
};

export const validateProfileData = (data) => {
  const errors = {};
  
  if (!data.firstName) {
    errors.firstName = 'El nombre es requerido';
  }
  
  if (!data.lastName) {
    errors.lastName = 'El apellido es requerido';
  }
  
  if (!data.email) {
    errors.email = 'El email es requerido';
  }
  
  return errors;
};