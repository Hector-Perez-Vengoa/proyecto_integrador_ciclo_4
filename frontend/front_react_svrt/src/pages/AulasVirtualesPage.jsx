// src/pages/AulasVirtualesPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { showToast } from '../utils/authUtils';
import { Home, ArrowLeft, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import { AulasDisponibles } from '../components/aulas';

const AulasVirtualesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    showToast('Sesión cerrada exitosamente');
    logout();
  };

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
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
                className="group bg-gradient-to-r from-tecsup-blue-50 to-tecsup-blue-100 text-tecsup-blue-700 hover:from-tecsup-blue-100 hover:to-tecsup-blue-200 border border-tecsup-blue-200 hover:border-tecsup-blue-300 shadow-soft hover:shadow-tecsup-hover rounded-xl px-4 py-2 transition-all duration-400 hover-scale-gentle"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-400" />
                <span className="hidden sm:inline font-medium">Volver</span>
              </Button>

              {/* Logo y título */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-tecsup-blue-600 to-tecsup-blue-800 rounded-lg flex items-center justify-center shadow-lg">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-tecsup-blue-700 to-tecsup-blue-900 bg-clip-text text-transparent">
                    Aulas Virtuales
                  </h1>
                  <p className="text-sm text-tecsup-gray-dark">Sistema de Reservas TECSUP</p>
                </div>
              </div>
            </div>

            {/* Sección derecha */}
            <div className="flex items-center space-x-3">
              {/* Info del usuario */}
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-tecsup-blue-50 to-white rounded-xl border border-tecsup-blue-100">
                <div className="w-8 h-8 bg-gradient-to-br from-tecsup-blue-600 to-tecsup-blue-800 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-tecsup-blue-800">{user?.firstName} {user?.lastName}</p>
                  <p className="text-tecsup-gray-dark">{user?.email}</p>
                </div>
              </div>

              {/* Botón cerrar sesión */}
              <Button 
                onClick={handleLogout}
                variant="ghost"
                className="group bg-gradient-to-r from-tecsup-gray-light to-gray-100 text-tecsup-gray-dark hover:from-red-50 hover:to-red-100 hover:text-tecsup-danger border border-tecsup-gray-medium/20 hover:border-tecsup-danger/20 shadow-soft hover:shadow-tecsup-hover rounded-xl px-4 py-2 transition-all duration-400 hover-scale-gentle"
              >
                <LogOut className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform duration-400" />
                <span className="hidden sm:inline font-medium">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-6 lg:mb-8">
            <button
              onClick={handleGoHome}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-tecsup-blue-700 hover:bg-tecsup-blue-50 rounded-lg transition-all duration-200 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Inicio</span>
            </button>
            
            <span className="text-gray-400">/</span>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-tecsup-blue-50 text-tecsup-blue-700 rounded-lg">
              <span className="font-medium">Aulas Virtuales</span>
            </div>
          </nav>
          
          {/* Componente principal */}
          <AulasDisponibles />
        </div>
      </main>
    </div>
  );
};

export default AulasVirtualesPage;
