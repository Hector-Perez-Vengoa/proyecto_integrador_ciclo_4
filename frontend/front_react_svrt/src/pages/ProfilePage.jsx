// src/pages/ProfilePage.jsx
import React from 'react';
import { useAuth } from '../logic/useAuth';
import { showToast } from '../utils/authUtils';
import { Home, User, LogOut, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProfileView from '../components/profile/ProfileView';
import ProfileBreadcrumb from '../components/profile/ProfileBreadcrumb';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    showToast('Sesión cerrada exitosamente');
    logout();
  };

  const handleGoHome = () => {
    navigate('/home');
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-tecsup-blue-50 via-white to-tecsup-cyan-50">
        {/* Header moderno con diseño TECSUP */}
      <header className="sticky top-0 z-50 overflow-hidden bg-white/80 backdrop-blur-md shadow-tecsup border-b border-tecsup-gray-light/50">
        
        {/* Fondo decorativo con colores TECSUP */}
        <div className="absolute inset-0 bg-gradient-to-r from-tecsup-primary/5 via-transparent to-tecsup-secondary/5"></div>
        <div className="absolute top-0 right-0 w-64 h-16 bg-gradient-to-l from-tecsup-secondary/10 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
              {/* Sección izquierda */}
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleGoHome}
                variant="ghost"
                className="group flex items-center text-tecsup-gray-medium hover:text-tecsup-primary hover:bg-tecsup-blue-50 rounded-xl px-3 py-2 transition-all duration-400 hover-scale-gentle"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-0.5 transition-transform duration-400" />
                <span className="hidden sm:inline font-medium">Volver</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-tecsup-primary to-tecsup-blue-700 rounded-xl flex items-center justify-center shadow-tecsup hover-glow transition-all duration-400">
                  <User className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl lg:text-2xl font-bold text-tecsup-gradient">
                  Mi Perfil
                </h1>
              </div>
            </div>
              {/* Sección derecha */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              
              {/* Saludo personalizado */}
              <div className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-tecsup-blue-50 to-tecsup-cyan-50 rounded-full border border-tecsup-primary/20 hover-glow transition-all duration-400">
                <span className="text-sm lg:text-base font-medium text-tecsup-gray-dark">
                  Hola, <span className="text-tecsup-primary font-semibold">{user?.username || 'Usuario'}</span>
                </span>
              </div>
              
              {/* Botón de inicio */}
              <Button 
                onClick={handleGoHome}
                variant="secondary"
                className="group bg-gradient-to-r from-tecsup-blue-50 to-tecsup-cyan-50 text-tecsup-primary hover:from-tecsup-blue-100 hover:to-tecsup-cyan-100 border border-tecsup-primary/20 hover:border-tecsup-primary/30 shadow-tecsup hover:shadow-tecsup-hover rounded-xl px-4 py-2 transition-all duration-400 hover-scale-gentle"
              >
                <Home className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-400" />
                <span className="hidden sm:inline font-medium">Inicio</span>
              </Button>
              
              {/* Botón de cerrar sesión */}
              <Button 
                onClick={handleLogout}
                variant="secondary"
                className="group bg-gradient-to-r from-tecsup-gray-light to-gray-100 text-tecsup-gray-dark hover:from-red-50 hover:to-red-100 hover:text-tecsup-danger border border-tecsup-gray-medium/20 hover:border-tecsup-danger/20 shadow-soft hover:shadow-tecsup-hover rounded-xl px-4 py-2 transition-all duration-400 hover-scale-gentle"
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-400" />
                <span className="hidden sm:inline font-medium">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>      {/* Contenido principal del perfil */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb solo visible en desktop */}
          <div className="hidden lg:block">
            <ProfileBreadcrumb onGoHome={handleGoHome} />
          </div>
          
          <ProfileView />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
