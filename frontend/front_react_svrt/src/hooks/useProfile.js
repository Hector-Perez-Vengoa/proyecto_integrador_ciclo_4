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
  
  // Estados para datos académicos
  const [departamentos, setDepartamentos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  
  // Estados adicionales para filtrado cascada
  const [allCarreras, setAllCarreras] = useState([]); // Todas las carreras disponibles
  const [allCursos, setAllCursos] = useState([]); // Todos los cursos disponibles
  const [filteredCarreras, setFilteredCarreras] = useState([]); // Carreras filtradas por departamento
  const [filteredCursos, setFilteredCursos] = useState([]); // Cursos filtrados por carreras// Función helper para sincronizar formData con el perfil
  const syncFormDataWithProfile = (profileData) => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '', // No editable, pero necesario para validación
        telefono: profileData.telefono || '',
        biografia: profileData.biografia || '',
        fechaNacimiento: profileData.fechaNacimiento || '',
        // Campos académicos
        departamentoId: profileData.departamento?.id || '',
        carreraIds: profileData.carreras?.map(c => c.id) || [],
        cursoIds: profileData.cursos?.map(c => c.id) || [],
        // Campos adicionales
        ubicacion: profileData.ubicacion || '',
        sitioWeb: profileData.sitioWeb || '',
        linkedin: profileData.linkedin || '',
        twitter: profileData.twitter || ''
      });
    }
  };  // Función para cargar opciones académicas del perfil existente
  const loadProfileAcademicData = async (profileData) => {
    if (!profileData) return;

    try {
      // Si hay departamento, cargar sus carreras
      if (profileData.departamento?.id) {
        const carrerasResponse = await profileService.getCarrerasByDepartamento(profileData.departamento.id);
        if (carrerasResponse.success) {
          setFilteredCarreras(carrerasResponse.data);
        }
      }

      // Si hay carreras, cargar sus cursos
      if (profileData.carreras && profileData.carreras.length > 0) {
        const carreraIds = profileData.carreras.map(c => c.id);
        const cursosResponse = await profileService.getCursosByCarreras(carreraIds);
        if (cursosResponse.success) {
          setFilteredCursos(cursosResponse.data);
        }
      }
    } catch (error) {
      showToast('Error al cargar datos académicos', 'error');
    }
  };// Cargar opciones académicas
  const loadAcademicOptions = async () => {
    try {
      setLoadingOptions(true);
      // Solo cargar departamentos al inicio
      const deptResponse = await profileService.getDepartamentos();

      if (deptResponse.success) {
        setDepartamentos(deptResponse.data);
      }
      
      // NO cargar carreras y cursos al inicio
      // Esto se hará después de seleccionar departamento/carreras
      setFilteredCarreras([]);
      setFilteredCursos([]);
    } catch (error) {
      showToast('Error al cargar opciones académicas', 'error');
    } finally {
      setLoadingOptions(false);
    }
  };  // Función para manejar cambio de departamento
  const handleDepartamentoChange = async (departamentoId) => {
    try {
      // Actualizar formData
      setFormData(prev => ({ 
        ...prev, 
        departamentoId, 
        carreraIds: [], // Limpiar carreras seleccionadas
        cursoIds: [] // Limpiar cursos seleccionados
      }));

      if (departamentoId) {
        // Cargar carreras del departamento seleccionado
        setLoadingOptions(true);
        const response = await profileService.getCarrerasByDepartamento(departamentoId);
        if (response.success) {
          setFilteredCarreras(response.data);
          setFilteredCursos([]); // Limpiar cursos hasta que se seleccionen carreras
        } else {
          setFilteredCarreras([]);
          setFilteredCursos([]);
        }
      } else {
        // Si no hay departamento seleccionado, NO mostrar carreras ni cursos
        setFilteredCarreras([]);
        setFilteredCursos([]);
      }    } catch (error) {
      showToast('Error al cargar carreras del departamento', 'error');
    } finally {
      setLoadingOptions(false);
    }
  };  // Función para manejar cambio de carreras
  const handleCarrerasChange = async (carreraIds) => {
    try {
      // Actualizar formData
      setFormData(prev => ({ 
        ...prev, 
        carreraIds,
        cursoIds: [] // Limpiar cursos seleccionados
      }));

      if (carreraIds && carreraIds.length > 0) {
        // Cargar cursos de las carreras seleccionadas
        setLoadingOptions(true);
        
        // Hacer la petición
        const response = await profileService.getCursosByCarreras(carreraIds);
          if (response && response.success && response.data) {
          setFilteredCursos(response.data);
        } else {
          setFilteredCursos([]);
          showToast(response?.message || 'No se encontraron cursos para las carreras seleccionadas', 'warning');
        }
      } else {
        // Si no hay carreras seleccionadas, limpiar cursos
        setFilteredCursos([]);
      }    } catch (error) {
      showToast('Error al cargar cursos de las carreras', 'error');
    } finally {
      setLoadingOptions(false);
    }
  };
  // Función para manejar cambio de cursos
  const handleCursosChange = (cursoIds) => {
    setFormData(prev => ({ ...prev, cursoIds }));
  };

  // Funciones helper para manejar selects múltiples
  const handleMultiSelectChange = (name, selectedOptions) => {
    const selectedValues = Array.from(selectedOptions, option => option.value);
    
    if (name === 'carreraIds') {
      handleCarrerasChange(selectedValues);
    } else if (name === 'cursoIds') {
      handleCursosChange(selectedValues);
    }
  };  // Función mejorada para handleInputChange que maneja mejor los selects múltiples
  const handleFieldChange = (name, value, selectedOptions = null) => {
    if (name === 'departamentoId') {
      handleDepartamentoChange(value);
    } else if (name === 'carreraIds') {
      // Si recibimos un array directamente (nuevo patrón), usarlo
      if (Array.isArray(value)) {
        handleCarrerasChange(value);
      } else if (selectedOptions) {
        // Si recibimos selectedOptions (patrón antiguo), convertir
        handleMultiSelectChange(name, selectedOptions);
      }
    } else if (name === 'cursoIds') {
      // Si recibimos un array directamente (nuevo patrón), usarlo
      if (Array.isArray(value)) {
        handleCursosChange(value);
      } else if (selectedOptions) {
        // Si recibimos selectedOptions (patrón antiguo), convertir
        handleMultiSelectChange(name, selectedOptions);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  // Cargar perfil al inicializar
  useEffect(() => {
    loadProfile();
    loadAcademicOptions();
  }, []);
  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfile();
        if (response.success && response.data) {
        setProfile(response.data);
        syncFormDataWithProfile(response.data);
        // Cargar datos académicos específicos del perfil
        await loadProfileAcademicData(response.data);
      }    } catch (error) {
      showToast('Error al cargar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Manejar cambios especiales para campos académicos
    if (name === 'departamentoId') {
      handleDepartamentoChange(value);
    } else if (name === 'carreraIds') {
      // Para selects múltiples, value será un array
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
      handleCarrerasChange(selectedValues);
    } else if (name === 'cursoIds') {
      // Para selects múltiples, value será un array
      const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
      handleCursosChange(selectedValues);
    } else {
      // Cambio normal para otros campos
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };const startEditing = () => {
    setEditing(true);
    setErrors({});
    
    // Actualizar formData con los valores actuales del perfil
    syncFormDataWithProfile(profile);
  };  const cancelEditing = () => {
    setEditing(false);
    setErrors({});
    
    // Restaurar datos originales
    syncFormDataWithProfile(profile);
  };  const saveProfile = async () => {
    try {
      setLoading(true);

      // Validar datos
      const validationErrors = validateProfileData(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Preparar datos para envío
      const dataToSend = {
        ...formData,
        // Asegurar que sean arrays
        carreraIds: Array.isArray(formData.carreraIds) ? formData.carreraIds : [],
        cursoIds: Array.isArray(formData.cursoIds) ? formData.cursoIds : []
      };

      // Actualizar perfil
      const response = await profileService.updateProfile(dataToSend);
        if (response.success) {
        setProfile(response.data);
        syncFormDataWithProfile(response.data);
        setEditing(false);
        showToast('Perfil actualizado correctamente', 'success');
      } else {
        showToast(response.message || 'Error al guardar el perfil', 'error');
      }
    } catch (error) {
      showToast('Error al guardar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkProfileStatus = async () => {
    try {
      const response = await profileService.getProfileStatus();
      return response.data;    } catch (error) {
      return null;
    }
  };  const syncProfileImage = async () => {
    try {
      setLoading(true);
      
      // Verificar si hay token
      const token = localStorage.getItem('authToken');
      if (!token) {
        showToast('Sesión expirada. Por favor inicia sesión nuevamente.', 'error');
        return;
      }
      
      const response = await profileService.syncProfileImage();
      if (response.success) {
        // Recargar el perfil para obtener la nueva imagen
        await loadProfile();
        showToast('Imagen de perfil sincronizada desde Google', 'success');
      } else {
        showToast(response.message || 'Error al sincronizar imagen', 'error');
      }
    } catch (error) {
      showToast('Error al sincronizar la imagen de perfil', 'error');
    } finally {
      setLoading(false);
    }
  };return {
    profile,
    loading,
    editing,
    formData,
    errors,
    // Opciones académicas
    departamentos,
    carreras,
    cursos,
    loadingOptions,
    // Opciones filtradas para el cascading
    filteredCarreras,
    filteredCursos,
    // Funciones
    handleInputChange,
    handleFieldChange, // Nueva función mejorada para manejar campos
    handleDepartamentoChange,
    handleCarrerasChange,
    handleCursosChange,
    startEditing,
    cancelEditing,
    saveProfile,
    syncProfileImage, // Nueva función para sincronizar imagen de perfil
    loadProfile,
    checkProfileStatus
  };
};
