// src/components/profile/ProfileSection.jsx
import React from 'react';
import * as Icons from 'lucide-react';
import ProfileField from './ProfileField';
import { formatDate } from '../../utils/profileUtils';

const ProfileSection = ({ section, profile, editing, formData, handleInputChange }) => {
  const IconComponent = Icons[section.icon];

  const getFieldValue = (fieldName) => {
    return editing ? formData[fieldName] : profile[fieldName];
  };

  const getFormatValue = (field) => {
    if (field.type === 'date') return formatDate;
    return null;
  };  return (
    <div className="relative group overflow-hidden bg-white rounded-3xl shadow-tecsup-lg border border-tecsup-gray-light/50 hover:shadow-tecsup-hover transition-all duration-600 hover:border-tecsup-primary/20 hover-scale-gentle">
      
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-tecsup-primary/3 via-tecsup-secondary/2 to-tecsup-primary/3 group-hover:from-tecsup-primary/5 group-hover:via-tecsup-secondary/3 group-hover:to-tecsup-primary/5 transition-all duration-600"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-tecsup-secondary/8 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-800"></div>
      
      {/* Contenido */}
      <div className="relative z-10 p-6 lg:p-8">
        
        {/* Header de la sección */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`relative w-12 h-12 bg-gradient-to-r ${section.gradient} rounded-2xl flex items-center justify-center shadow-tecsup group-hover:scale-105 group-hover:rotate-1 transition-all duration-500`}>
            <IconComponent className="w-6 h-6 text-white" />
            {/* Brillo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity duration-600"></div>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-tecsup-gradient">
            {section.title}
          </h2>
        </div>
        
        {/* Campos */}
        <div className="space-y-6 lg:space-y-8">
          {section.fields.map((field, index) => (
            <div 
              key={field.name} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProfileField
                field={field}
                value={getFieldValue(field.name)}
                editing={editing}
                onChange={handleInputChange}
                formatValue={getFormatValue(field)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
