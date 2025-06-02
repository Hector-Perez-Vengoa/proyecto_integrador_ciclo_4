// src/components/profile/ProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useProfile } from '../../logic/useProfile';
import { useWelcome } from '../../context/WelcomeContext';
import { Edit, User, Mail, Save, X, CheckCircle, AlertCircle, Camera, Plus } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import ProfileWelcome from './ProfileWelcome';
import ProfileSection from './ProfileSection';
import ProfileStats from './ProfileStats';
import { PROFILE_SECTIONS } from '../../constants/profile';
import { 
  calculateCompleteness, 
  isProfileIncomplete, 
  getCompletenessColor, 
  getImageUrl, 
  getInitials 
} from '../../utils/profileUtils';

const ProfileView = ({ autoEdit = false }) => {
  const { shouldShowWelcomeModal, markWelcomeAsSeen } = useWelcome();
  const {
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
    saveProfile
  } = useProfile();
  // Usar utilidades
  const profileIncomplete = isProfileIncomplete(profile);
  const completeness = calculateCompleteness(profile);
  const imageUrl = getImageUrl(profile, imagePreview);
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
  }
  return (
    <>
      {/* ProfileWelcome Modal */}
      <ProfileWelcome
        isProfileIncomplete={showWelcome}
        onStartSetup={handleStartSetup}
        onDismiss={handleDismissWelcome}
      />      {/* Contenedor principal con diseño TECSUP Premium */}
      <div className="min-h-screen bg-gradient-to-br from-tecsup-blue-50 via-white to-tecsup-cyan-50 p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Card con diseño TECSUP */}
          <div className="group relative overflow-hidden bg-white rounded-3xl shadow-tecsup-lg border border-tecsup-gray-light/50 mb-6 sm:mb-8 transform transition-all duration-600 hover:shadow-tecsup-hover hover-scale-gentle">
            
            {/* Fondo decorativo con colores TECSUP */}
            <div className="absolute inset-0 bg-gradient-to-br from-tecsup-primary/5 via-tecsup-secondary/3 to-tecsup-primary/5"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-tecsup-secondary/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-tecsup-primary/10 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
            
            {/* Contenido del header */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10">
              
              {/* Layout responsivo para móvil y desktop */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                
                {/* Sección de imagen de perfil */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative group/avatar">
                      {/* Avatar con animaciones mejoradas y suaves */}
                    <div className="relative overflow-hidden rounded-full transition-all duration-500 group-hover/avatar:scale-102 hover-glow">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Perfil"
                          className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-cover border-4 border-white shadow-tecsup transition-all duration-500"
                        />
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-tecsup-primary flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold border-4 border-white shadow-tecsup transition-all duration-500">
                          {initials}
                        </div>
                      )}
                      
                      {/* Overlay de edición */}
                      {editing && (
                        <div className="absolute inset-0 bg-tecsup-primary/40 flex items-center justify-center rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-400">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Input de imagen mejorado */}
                    {editing && (
                      <div className="mt-4 w-full max-w-xs">
                        <label className="block">
                          <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-tecsup-secondary/50 hover:border-tecsup-secondary transition-colors duration-400 cursor-pointer group/upload hover-scale-gentle">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="p-4 text-center bg-gradient-to-br from-tecsup-blue-50 to-tecsup-cyan-50 group-hover/upload:from-tecsup-blue-100 group-hover/upload:to-tecsup-cyan-100 transition-all duration-400">
                              <Plus className="w-6 h-6 mx-auto mb-2 text-tecsup-primary" />
                              <span className="text-sm font-medium text-tecsup-primary">
                                {imageFile ? 'Cambiar imagen' : 'Subir imagen'}
                              </span>
                            </div>
                          </div>
                        </label>
                        {imageFile && (
                          <p className="text-xs text-tecsup-gray-medium mt-2 text-center animate-fade-in">
                            ✓ {imageFile.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>                {/* Información principal */}
                <div className="flex-1 space-y-6">
                  
                  {/* Header con nombre y acciones */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-3">
                      
                      {/* Nombre con animación */}
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-tecsup-gradient animate-fade-in">
                        {profile.firstName && profile.lastName 
                          ? `${profile.firstName} ${profile.lastName}`
                          : profile.nombreCompleto || profile.username || 'Usuario sin nombre'
                        }
                      </h1>
                      
                      {/* Información de contacto con iconos mejorados */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-tecsup-blue-50 rounded-full hover:bg-tecsup-blue-100 transition-colors duration-400 hover-scale-gentle">
                          <Mail className="w-4 h-4 text-tecsup-primary" />
                          <span className="text-sm font-medium text-tecsup-primary">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-tecsup-cyan-50 rounded-full hover:bg-tecsup-cyan-100 transition-colors duration-400 hover-scale-gentle">
                          <User className="w-4 h-4 text-tecsup-secondary" />
                          <span className="text-sm font-medium text-tecsup-secondary">@{profile.username}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Botones de acción mejorados */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      {!editing ? (
                        <Button 
                          onClick={startEditing} 
                          variant="primary"
                          className="bg-tecsup-primary hover:bg-tecsup-blue-700 text-white shadow-tecsup hover:shadow-tecsup-hover transform hover-scale-gentle transition-all duration-400 border-0 px-6 py-3 rounded-xl font-semibold"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Perfil
                        </Button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            onClick={saveProfile} 
                            variant="primary"
                            disabled={loading}
                            className="bg-tecsup-success hover:bg-green-700 text-white shadow-success hover:shadow-tecsup-hover transform hover-scale-gentle transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none px-6 py-3 rounded-xl font-semibold"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Guardando...' : 'Guardar'}
                          </Button>
                          <Button 
                            onClick={cancelEditing} 
                            variant="secondary"
                            disabled={loading}
                            className="bg-tecsup-gray-light text-tecsup-gray-dark hover:bg-gray-200 border border-tecsup-gray-medium/20 shadow-soft hover:shadow-tecsup transform hover-scale-gentle transition-all duration-400 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>                  {/* Indicador de completitud mejorado */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-tecsup">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      
                      {/* Barra de progreso */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-tecsup-gray-dark">Completitud del perfil</span>
                          <span className="font-bold text-tecsup-primary text-base">{completeness}%</span>
                        </div>
                        <div className="relative w-full bg-tecsup-gray-light rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm`}
                            style={{ 
                              width: `${completeness}%`,
                              background: completeness === 100 
                                ? 'linear-gradient(90deg, #28A745 0%, #22913b 100%)' 
                                : 'linear-gradient(90deg, #005BA1 0%, #00B0F0 100%)'
                            }}
                          ></div>
                          {/* Brillo animado */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Badge de estado */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-tecsup transition-all duration-400 hover-scale-gentle ${
                        completeness === 100 
                          ? 'bg-tecsup-success text-white' 
                          : 'bg-tecsup-primary text-white'
                      }`}>
                        {completeness === 100 ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Perfil completo
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4" />
                            Perfil incompleto
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>            </div>
          </div>

          {/* Estadísticas del perfil */}
          <ProfileStats profile={profile} completeness={completeness} />          {/* Tarjetas de información con diseño TECSUP premium */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Información personal */}
            <div className="group transform transition-all duration-500 hover-scale-gentle">
              <ProfileSection
                section={PROFILE_SECTIONS.PERSONAL}
                profile={profile}
                editing={editing}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </div>

            {/* Información adicional */}
            <div className="group transform transition-all duration-500 hover-scale-gentle">
              <ProfileSection
                section={PROFILE_SECTIONS.ADDITIONAL}
                profile={profile}
                editing={editing}
                formData={formData}
                handleInputChange={handleInputChange}
              />
            </div>
          </div>

          {/* Mostrar errores con diseño mejorado */}
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
