// src/components/profile/ProfileField.jsx
import React from 'react';
import * as Icons from 'lucide-react';

const ProfileField = ({ field, value, editing, onChange, formatValue }) => {
  const IconComponent = field.icon ? Icons[field.icon] : null;
    const renderInput = () => {
    const baseClasses = "w-full px-4 py-3.5 border-2 border-tecsup-gray-medium/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-tecsup-primary/20 focus:border-tecsup-primary transition-all duration-400 text-tecsup-gray-dark placeholder-tecsup-gray-medium bg-white hover:border-tecsup-primary/40";
    const readOnlyClasses = "bg-gradient-to-r from-tecsup-gray-light to-gray-100 cursor-not-allowed border-tecsup-gray-medium/20";
    
    switch (field.type) {
      case 'textarea':
        return (
          <div className="relative group">
            <textarea
              name={field.name}
              value={value || ''}
              onChange={onChange}
              readOnly={field.readOnly}
              rows={field.rows || 4}
              className={`${baseClasses} resize-none ${field.readOnly ? readOnlyClasses : ''} group-hover:shadow-tecsup transition-all duration-400`}
              placeholder={field.placeholder}
            />
            {!field.readOnly && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-tecsup-primary/0 via-tecsup-primary/5 to-tecsup-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
            )}
          </div>
        );
      default:
        return (
          <div className="relative group">
            <input
              type={field.type}
              name={field.name}
              value={value || ''}
              onChange={onChange}
              readOnly={field.readOnly}
              className={`${baseClasses} ${field.readOnly ? readOnlyClasses : ''} group-hover:shadow-tecsup transition-all duration-400`}
              placeholder={field.placeholder}
            />
            {!field.readOnly && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-tecsup-primary/0 via-tecsup-primary/5 to-tecsup-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"></div>
            )}
          </div>
        );
    }
  };

  const renderValue = () => {
    const displayValue = formatValue ? formatValue(value) : (value || 'No especificado');
    const minHeight = field.type === 'textarea' ? 'min-h-[120px]' : '';
    const isEmpty = !value || value === 'No especificado';
      if (field.type === 'url' && value) {
      return (
        <div className={`group px-4 py-3.5 bg-gradient-to-r from-tecsup-blue-50/50 to-tecsup-cyan-50/30 rounded-xl border border-tecsup-primary/20 hover:from-tecsup-blue-50 hover:to-tecsup-cyan-50 hover:border-tecsup-primary/40 transition-all duration-400 ${minHeight} hover-scale-gentle`}>
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-tecsup-primary hover:text-tecsup-blue-700 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-400"
          >
            <span>{value}</span>
            <Icons.ExternalLink className="w-4 h-4 group-hover:scale-105 transition-transform duration-400" />
          </a>
        </div>
      );
    }

    return (
      <div className={`px-4 py-3.5 bg-gradient-to-r from-tecsup-gray-light/80 to-tecsup-blue-50/20 rounded-xl border border-tecsup-gray-light/50 hover:from-tecsup-gray-light hover:to-tecsup-blue-50/40 hover:border-tecsup-gray-medium/30 transition-all duration-400 ${minHeight} hover-scale-gentle`}>
        <p className={`${isEmpty ? 'text-tecsup-gray-medium italic' : 'text-tecsup-gray-dark font-medium'} leading-relaxed`}>
          {displayValue}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-tecsup-gray-dark group cursor-pointer">
        {IconComponent && (
          <div className="w-5 h-5 rounded-lg bg-tecsup-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-400">
            <IconComponent className="w-3 h-3 text-white" />
          </div>
        )}
        <span className="group-hover:text-tecsup-primary transition-colors duration-400">
          {field.label}
        </span>
      </label>
      {editing ? renderInput() : renderValue()}
    </div>
  );
};

export default ProfileField;
