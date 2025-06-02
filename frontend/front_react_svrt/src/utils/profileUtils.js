// src/utils/profileUtils.js
import { PROFILE_FIELDS, COMPLETENESS_THRESHOLDS } from '../constants/profile';

export const calculateCompleteness = (profile) => {
  if (!profile) return 0;
  
  const completed = PROFILE_FIELDS.ALL.filter(field => 
    profile[field] && profile[field].toString().trim() !== ''
  ).length;
  
  return Math.round((completed / PROFILE_FIELDS.ALL.length) * 100);
};

export const isProfileIncomplete = (profile) => {
  return profile && PROFILE_FIELDS.REQUIRED.some(field => 
    !profile[field] || profile[field].toString().trim() === ''
  );
};

export const getCompletenessColor = (completeness) => {
  if (completeness < COMPLETENESS_THRESHOLDS.LOW) return 'bg-red-500';
  if (completeness < COMPLETENESS_THRESHOLDS.MEDIUM) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getImageUrl = (profile, imagePreview) => {
  if (imagePreview) return imagePreview;
  if (profile?.imagenPerfil) {
    let imagePath = profile.imagenPerfil;
    
    if (imagePath.startsWith('/uploads/')) {
      // Caso: "/uploads/user_24/profile/filename.jpg" -> "user_24/profile/filename.jpg"
      imagePath = imagePath.substring('/uploads/'.length);
    } else if (imagePath.startsWith('/')) {
      // Caso: "/user_24/profile/filename.jpg" -> "user_24/profile/filename.jpg"  
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

export const getInitials = (profile) => {
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
  }
  if (profile?.firstName) return profile.firstName.charAt(0).toUpperCase();
  if (profile?.username) return profile.username.charAt(0).toUpperCase();
  return 'U';
};
