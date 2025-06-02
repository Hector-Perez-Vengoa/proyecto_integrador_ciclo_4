// src/components/profile/ProfileStats.jsx
import React from 'react';
import { CheckCircle, Clock, Calendar, Award } from 'lucide-react';

const ProfileStats = ({ profile, completeness }) => {
  const stats = [
    {
      id: 'completeness',
      label: 'Perfil Completo',
      value: `${completeness}%`,
      icon: CheckCircle,
      color: completeness === 100 ? 'from-green-500 to-emerald-500' : 'from-orange-500 to-amber-500',
      bgColor: completeness === 100 ? 'from-green-50 to-emerald-50' : 'from-orange-50 to-amber-50',
      iconColor: completeness === 100 ? 'text-green-600' : 'text-orange-600'
    },
    {
      id: 'joined',
      label: 'Miembro desde',
      value: profile?.dateJoined ? new Date(profile.dateJoined).getFullYear() : '2024',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'lastUpdate',
      label: 'Última actualización',
      value: profile?.lastUpdated ? 'Reciente' : 'Pendiente',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'status',
      label: 'Estado',
      value: 'Activo',
      icon: Award,
      color: 'from-tecsup-blue-500 to-tecsup-blue-600',
      bgColor: 'from-tecsup-blue-50 to-tecsup-blue-100',
      iconColor: 'text-tecsup-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {stats.map((stat, index) => (
        <div 
          key={stat.id}
          className="group relative overflow-hidden bg-white rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200/50 transition-all duration-500 hover:scale-105"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Fondo decorativo */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
          
          {/* Contenido */}
          <div className="relative p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            
            <div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors duration-300">
                {stat.value}
              </p>
              <p className="text-xs lg:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {stat.label}
              </p>
            </div>
            
            {/* Brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-500"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
