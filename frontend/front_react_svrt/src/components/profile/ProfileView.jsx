// src/components/profile/ProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useWelcome } from '../../context/WelcomeContext';
import { Edit, User, Mail, Save, X, CheckCircle, AlertCircle, Plus, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import ProfileWelcome from './ProfileWelcome';
import ProfileSection from './ProfileSection';
import { PROFILE_SECTIONS } from '../../constants/profile';
import { 
  getImageUrl, 
  getInitials 
} from '../../utils/profileUtils';

const ProfileView = ({ autoEdit = false }) => {
  const { shouldShowWelcomeModal, markWelcomeAsSeen } = useWelcome();  const {
    profile,
    loading,
    editing,
    formData,
    errors,
    departamentos,
    carreras,
    cursos,
    loadingOptions,
    // Arrays filtrados para el cascading
    filteredCarreras,
    filteredCursos,
    handleInputChange,
    handleFieldChange, // Nueva función para manejar campos especiales
    handleDepartamentoChange,
    handleCarrerasChange,
    handleCursosChange,
    startEditing,
    cancelEditing,
    saveProfile,
    syncProfileImage
  } = useProfile();

  // Usar utilidades (sin imagePreview ya que no se necesita)
  const imageUrl = getImageUrl(profile, null);
  const initials = getInitials(profile);
  
  // NO mostrar welcome automáticamente en ProfileView - se maneja desde las páginas
  const showWelcome = false;

  // Activar edición automáticamente si autoEdit es true
  useEffect(() => {
    if (autoEdit && profile && !editing) {
      startEditing();
    }
  }, [autoEdit, profile, editing, startEditing]);

  const handleStartSetup = () => {
    markWelcomeAsSeen();
    startEditing();
  };

  const handleDismissWelcome = () => {
    markWelcomeAsSeen();
  };

  if (loading && !profile) {
    return <LoadingSpinner size="lg" text="Cargando perfil..." />;
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No se pudo cargar el perfil</p>
      </div>
    );
  }  return (
    <>
      {/* ProfileWelcome Modal */}
      <ProfileWelcome
        isProfileIncomplete={showWelcome}
        onStartSetup={handleStartSetup}
        onDismiss={handleDismissWelcome}
      />      {/* Contenedor principal  */}      <div className="min-h-screen bg-gradient-to-br from-tecsup-gray-50 via-tecsup-white to-tecsup-cyan-50 p-3 sm:p-6 page-transition-elegant">        <div className="max-w-7xl mx-auto">
            {/* Header Card con diseño profesional TECSUP y animaciones */}
          <div className={`relative overflow-hidden bg-white rounded-xl shadow-tecsup border-0 mb-6 hover:shadow-tecsup-hover ultra-smooth ${editing ? 'ring-1 ring-tecsup-primary/10 glass-effect-elegant edit-mode-pulse' : ''} edit-mode-transition`}>
            
            {/* Barra superior con gradiente TECSUP */}
            <div className="h-1 bg-gradient-to-r from-tecsup-primary via-tecsup-secondary to-tecsup-primary"></div>
            
            {/* Contenido del header */}
            <div className="p-6 sm:p-8">
              
              {/* Layout de información del usuario */}
              <div className="flex flex-col sm:flex-row gap-6">                {/* Avatar y información de imagen de Google */}
                <div className="flex flex-col items-center sm:items-start">
                  <div className="relative group">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Foto de perfil"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-tecsup-primary/20 shadow-tecsup group-hover:border-tecsup-primary/40 ultra-smooth hover-scale-elegant"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-tecsup-primary to-tecsup-secondary rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-tecsup border-4 border-tecsup-primary/20 hover-scale-elegant">
                        {initials}
                      </div>
                    )}
                  </div>
                    {/* Información sobre la imagen de Google */}
                  <div className="mt-3 text-center sm:text-left">
                    <p className="text-xs text-tecsup-gray-500 max-w-32 mb-2">
                      La imagen se sincroniza automáticamente desde tu cuenta de Google
                    </p>
                    <Button
                      onClick={syncProfileImage}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="text-xs border-tecsup-primary/30 text-tecsup-primary hover:bg-tecsup-primary/5"
                    >
                      <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                      Sincronizar
                    </Button>
                  </div>
                </div>
                
                {/* Información del usuario */}
                <div className="flex-1 text-center sm:text-left"><div className="mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-tecsup-gray-700 mb-2">
                      {profile.nombreCompleto || 'Usuario'}
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-2 text-tecsup-gray-medium">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{profile.email}</span>
                      </div>
                      {profile.departamento && (
                        <div className="hidden sm:block text-tecsup-gray-300">•</div>
                      )}
                      {profile.departamento && (
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{profile.departamento.nombre}</span>
                        </div>
                      )}                    
                      </div>
                  </div>
                    {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                    {!editing ? (                      <Button
                        onClick={startEditing}
                        variant="primary"
                        size="md"
                        style={{
                          background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)',
                          border: 'none'
                        }}
                        className="text-white shadow-tecsup ultra-smooth action-button-fluid hover:opacity-90"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    ) : (
                      <div className="flex gap-3 elegant-slide-up">
                        <Button
                          onClick={saveProfile}
                          variant="primary"
                          size="md"
                          disabled={loading}
                          className="bg-gradient-to-r from-tecsup-success to-green-600 hover:from-tecsup-success/90 hover:to-green-600/90 ultra-smooth action-button-fluid"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          size="md"
                          className="border-tecsup-gray-300 text-tecsup-gray-600 hover:bg-tecsup-gray-50 ultra-smooth action-button-fluid"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>          </div>          </div>          {/* Secciones principales del perfil con diseño profesional */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Información Personal */}
            <ProfileSection
              section={PROFILE_SECTIONS.PERSONAL}
              profile={profile}
              editing={editing}
              formData={formData}
              handleInputChange={handleInputChange}
              handleFieldChange={handleFieldChange}
              academicOptions={{ departamentos, carreras: filteredCarreras, cursos: filteredCursos }}
              loadingOptions={loadingOptions}
            />

            {/* Información Académica */}
            <ProfileSection
              section={PROFILE_SECTIONS.ACADEMIC}
              profile={profile}
              editing={editing}
              formData={formData}
              handleInputChange={handleInputChange}
              handleFieldChange={handleFieldChange}
              academicOptions={{ departamentos, carreras: filteredCarreras, cursos: filteredCursos }}
              loadingOptions={loadingOptions}
            />
          </div>

          {/* Mostrar errores*/}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 lg:mt-8 animate-fade-in">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-tecsup-danger rounded-xl p-6 shadow-tecsup">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-tecsup-danger mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-tecsup-danger font-semibold text-lg mb-3">
                      Por favor corrige los siguientes errores:
                    </h3>
                    <ul className="space-y-2">
                      {Object.entries(errors).map(([field, error], index) => (
                        <li 
                          key={field} 
                          className="text-tecsup-danger flex items-center animate-slide-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="w-2 h-2 bg-tecsup-danger rounded-full mr-3 flex-shrink-0"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileView; 
