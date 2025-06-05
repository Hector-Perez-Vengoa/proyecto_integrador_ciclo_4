// src/logic/useProfile.js
import { useState, useEffect } from 'react';
import { profileService } from '../services';
import { showToast } from '../utils/authUtils';
import { validateProfileData } from '../utils/validationUtils';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // Función helper para sincronizar formData con el perfil
  const syncFormDataWithProfile = (profileData) => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '', // No editable, pero necesario para validación
        telefono: profileData.telefono || '',
        biografia: profileData.biografia || '',
        fechaNacimiento: profileData.fechaNacimiento || '',
        ubicacion: profileData.ubicacion || '',
        sitioWeb: profileData.sitioWeb || '',
        linkedin: profileData.linkedin || '',
        twitter: profileData.twitter || ''
      });
    }
  };

  // Cargar perfil al inicializar
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
        if (response.success && response.data) {
        setProfile(response.data);
        syncFormDataWithProfile(response.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      showToast('Error al cargar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  // Función para comprimir imagen
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img;
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a blob
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
      }

      // Validar tamaño inicial (máximo 10MB antes de comprimir)
      if (file.size > 10 * 1024 * 1024) {
        showToast('La imagen es demasiado grande. Por favor selecciona una imagen menor a 10MB', 'error');
        return;
      }

      try {
        // Comprimir imagen
        const compressedFile = await compressImage(file);
        
        // Crear un nuevo archivo con el blob comprimido
        const compressedImageFile = new File([compressedFile], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        setImageFile(compressedImageFile);
        
        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedImageFile);
        
        showToast('Imagen procesada correctamente', 'success');
      } catch (error) {
        console.error('Error compressing image:', error);
        showToast('Error al procesar la imagen', 'error');
      }
    }
  };const startEditing = () => {
    setEditing(true);
    setErrors({});
    
    // Actualizar formData con los valores actuales del perfil
    syncFormDataWithProfile(profile);
  };
  const cancelEditing = () => {
    setEditing(false);
    setErrors({});
    setImageFile(null);
    setImagePreview(null);
    
    // Restaurar datos originales
    syncFormDataWithProfile(profile);
  };

  const saveProfile = async () => {
    try {
      setLoading(true);

      // Validar datos
      const validationErrors = validateProfileData(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Subir imagen si hay una nueva
      if (imageFile) {
        try {
          await profileService.uploadProfileImage(imageFile);
          showToast('Imagen de perfil actualizada', 'success');
        } catch (error) {
          console.error('Error uploading image:', error);
          showToast('Error al subir la imagen, pero se guardaron los otros datos', 'error');
        }
      }

      // Actualizar perfil
      const response = await profileService.updateProfile(formData);
        if (response.success) {
        setProfile(response.data);
        syncFormDataWithProfile(response.data);
        setEditing(false);
        setImageFile(null);
        setImagePreview(null);
        showToast('Perfil actualizado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Error al guardar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkProfileStatus = async () => {
    try {
      const response = await profileService.getProfileStatus();
      return response.data;
    } catch (error) {
      console.error('Error checking profile status:', error);
      return null;
    }
  };

  return {
    profile,
    loading,
    editing,
    formData,
    errors,
    imageFile,
    imagePreview,
    handleInputChange,
    handleImageChange,
    startEditing,
    cancelEditing,
    saveProfile,
    loadProfile,
    checkProfileStatus
  };
};
