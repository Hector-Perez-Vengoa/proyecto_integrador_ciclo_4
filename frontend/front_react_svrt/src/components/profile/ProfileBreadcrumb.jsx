// src/components/profile/ProfileBreadcrumb.jsx
import React from 'react';
import { ChevronRight, Home, User } from 'lucide-react';

const ProfileBreadcrumb = ({ onGoHome }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 lg:mb-8">
      <button
        onClick={onGoHome}
        className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-tecsup-blue-700 hover:bg-tecsup-blue-50 rounded-lg transition-all duration-200 group"
      >
        <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-medium">Inicio</span>
      </button>
      
      <ChevronRight className="w-4 h-4 text-gray-400" />
      
      <div className="flex items-center gap-2 px-3 py-1.5 bg-tecsup-blue-50 text-tecsup-blue-700 rounded-lg">
        <User className="w-4 h-4" />
        <span className="font-medium">Mi Perfil</span>
      </div>
    </nav>
  );
};

export default ProfileBreadcrumb;
