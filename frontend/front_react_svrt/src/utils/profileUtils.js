// src/utils/profileUtils.js

export const getImageUrl = (profile, imagePreview) => {
  // En modo edición, mostrar preview si existe
  if (imagePreview) return imagePreview;
  
  // Usar la imagen de perfil desde Google o avatar generado
  if (profile?.imagenPerfil) {
    // Si la imagen ya es una URL completa (Google o avatar), usarla directamente
    if (profile.imagenPerfil.startsWith('http')) {
      return profile.imagenPerfil;
    }
    
    // Para compatibilidad con imágenes locales antiguas (si las hay)
    // Aunque ya no deberían existir después de la migración
    let imagePath = profile.imagenPerfil;
    if (imagePath.startsWith('/uploads/')) {
      imagePath = imagePath.substring('/uploads/'.length);
    } else if (imagePath.startsWith('/')) {
      imagePath = imagePath.substring(1);
    }
    return `http://localhost:8080/api/perfil/uploads/${imagePath}`;
  }
  
  return null;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'No especificado';
  return new Date(dateString).toLocaleDateString('es-ES');
};

export const formatAcademicInfo = (profile) => {
  const academic = {
    departamento: profile?.departamento?.nombre || 'No especificado',
    carreras: profile?.carreras?.length > 0 
      ? profile.carreras.map(c => c.nombre).join(', ')
      : 'No especificado',
    cursos: profile?.cursos?.length > 0 
      ? profile.cursos.map(c => c.nombre).join(', ')
      : 'No especificado'
  };
  return academic;
};

export const getInitials = (profile) => {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }
  if (profile?.firstName) return profile.firstName.charAt(0).toUpperCase();
  if (profile?.username) return profile.username.charAt(0).toUpperCase();
  return 'U';
};
