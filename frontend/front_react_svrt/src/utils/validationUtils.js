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
  
  // Campos requeridos
  if (!data.firstName || data.firstName.trim() === '') {
    errors.firstName = 'El nombre es requerido';
  }
  
  if (!data.lastName || data.lastName.trim() === '') {
    errors.lastName = 'El apellido es requerido';
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.email = 'El email es requerido';
  }
  
  if (!data.fechaNacimiento || data.fechaNacimiento.trim() === '') {
    errors.fechaNacimiento = 'La fecha de nacimiento es requerida';
  }
  
  // Biografía opcional - no es requerida
  // El teléfono fue eliminado - no es requerido
  
  // Validaciones opcionales para URLs
  if (data.sitioWeb && data.sitioWeb.trim() !== '') {
    try {
      new URL(data.sitioWeb);
    } catch {
      errors.sitioWeb = 'URL del sitio web inválida';
    }
  }
  
  if (data.linkedin && data.linkedin.trim() !== '') {
    try {
      new URL(data.linkedin);
    } catch {
      errors.linkedin = 'URL de LinkedIn inválida';
    }
  }
  
  if (data.twitter && data.twitter.trim() !== '') {
    try {
      new URL(data.twitter);
    } catch {
      errors.twitter = 'URL de Twitter inválida';
    }
  }
  
  return errors;
};