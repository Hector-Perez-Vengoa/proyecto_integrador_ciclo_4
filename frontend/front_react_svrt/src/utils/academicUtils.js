// src/utils/academicUtils.js

/**
 * Formatea la información académica para mostrar en el perfil
 */

export const formatDepartamento = (departamento) => {
  if (!departamento) return 'No especificado';
  return departamento.nombre || 'No especificado';
};

export const formatCarreras = (carreras) => {
  if (!carreras || !Array.isArray(carreras) || carreras.length === 0) {
    return 'No especificado';
  }
  return carreras.map(carrera => carrera.nombre).join(', ');
};

export const formatCursos = (cursos) => {
  if (!cursos || !Array.isArray(cursos) || cursos.length === 0) {
    return 'No especificado';
  }
  return cursos.map(curso => curso.nombre).join(', ');
};

/**
 * Calcula el nivel académico basado en departamento, carreras y cursos
 */
export const calculateAcademicLevel = (profile) => {
  let score = 0;
  
  if (profile?.departamento) score += 33;
  if (profile?.carreras && profile.carreras.length > 0) score += 33;
  if (profile?.cursos && profile.cursos.length > 0) score += 34;
  
  return Math.round(score);
};

/**
 * Obtiene el color del indicador académico
 */
export const getAcademicLevelColor = (level) => {
  if (level >= 90) return 'text-green-600 bg-green-50';
  if (level >= 70) return 'text-blue-600 bg-blue-50';
  if (level >= 50) return 'text-yellow-600 bg-yellow-50';
  return 'text-red-600 bg-red-50';
};

/**
 * Obtiene el texto del estado académico
 */
export const getAcademicStatusText = (level) => {
  if (level >= 90) return 'Información académica completa';
  if (level >= 70) return 'Información académica parcial';
  if (level >= 50) return 'Información académica básica';
  return 'Información académica incompleta';
};

/**
 * Valida los datos académicos para el formulario
 */
export const validateAcademicData = (formData) => {
  const errors = {};
  
  if (!formData.departamentoId) {
    errors.departamentoId = 'El departamento es requerido';
  }
  
  // Las carreras y cursos son opcionales, pero se pueden validar si es necesario
  if (formData.carreraIds && !Array.isArray(formData.carreraIds)) {
    errors.carreraIds = 'Las carreras deben ser una lista válida';
  }
  
  if (formData.cursoIds && !Array.isArray(formData.cursoIds)) {
    errors.cursoIds = 'Los cursos deben ser una lista válida';
  }
  
  return errors;
};

/**
 * Prepara los datos académicos para enviar al backend
 */
export const prepareAcademicDataForBackend = (formData) => {
  return {
    departamentoId: formData.departamentoId || null,
    carreraIds: Array.isArray(formData.carreraIds) ? formData.carreraIds : [],
    cursoIds: Array.isArray(formData.cursoIds) ? formData.cursoIds : []
  };
};
