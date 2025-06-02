// src/components/profile/ProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useProfile } from '../../logic/useProfile';
import { useWelcome } from '../../context/WelcomeContext';
import { Edit, User, Mail, Save, X, CheckCircle, AlertCircle, Camera, Plus } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import Button from '../ui/Button';
import ProfileWelcome from './ProfileWelcome';
import ProfileSection from './ProfileSection';
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
    <>      {/* ProfileWelcome Modal */}
      <ProfileWelcome
        isProfileIncomplete={showWelcome}
        onStartSetup={handleStartSetup}
        onDismiss={handleDismissWelcome}
      />{/* Contenedor principal con diseño mejorado */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header con diseño moderno */}          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border border-gray-100">
            {/* Contenido del header */}
            <div className="relative px-8 py-8">              {/* Imagen de perfil */}
              <div className="flex flex-col md:flex-row gap-6 relative z-10">
                <div className="flex-shrink-0">
                  <div className="relative">{imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Perfil"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                      />                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl">
                        {initials}
                      </div>
                    )}
                    
                    {editing && (
                      <div className="mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                        />
                        {imageFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            Archivo seleccionado: {imageFile.name}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>                {/* Información básica mejorada */}
                <div className="flex-1 mt-4">
                  <div className="flex justify-between items-start mb-4"><div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {profile.firstName && profile.lastName 
                          ? `${profile.firstName} ${profile.lastName}`
                          : profile.nombreCompleto || profile.username || 'Usuario sin nombre'
                        }
                      </h1>
                      <div className="flex flex-wrap gap-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>@{profile.username}</span>
                        </div>
                      </div>
                      
                      {/* Indicador de completitud del perfil */}
                      <div className="mt-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-xs">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Completitud del perfil</span>
                              <span className="font-medium text-gray-900">{completeness}%</span>
                            </div>                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${getCompletenessColor(completeness)}`}
                                style={{ width: `${completeness}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          {completeness === 100 ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Perfil completo
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                              <AlertCircle className="w-4 h-4" />
                              Perfil incompleto
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                      {!editing ? (
                      <Button 
                        onClick={startEditing} 
                        variant="primary"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Perfil
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button 
                          onClick={saveProfile} 
                          variant="primary"
                          disabled={loading}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                        <Button 
                          onClick={cancelEditing} 
                          variant="secondary"
                          disabled={loading}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Tarjetas de información con diseño mejorado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información personal */}
            <ProfileSection
              section={PROFILE_SECTIONS.PERSONAL}
              profile={profile}
              editing={editing}
              formData={formData}
              handleInputChange={handleInputChange}
            />

            {/* Información adicional */}
            <ProfileSection
              section={PROFILE_SECTIONS.ADDITIONAL}
              profile={profile}
              editing={editing}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>

          {/* Mostrar errores si los hay */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-medium mb-2">Por favor corrige los siguientes errores:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileView;
