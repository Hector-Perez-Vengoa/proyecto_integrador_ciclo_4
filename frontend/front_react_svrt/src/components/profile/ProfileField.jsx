// src/components/profile/ProfileField.jsx
import React from 'react';
import * as Icons from 'lucide-react';

const ProfileField = ({ field, value, editing, onChange, formatValue }) => {
  const IconComponent = field.icon ? Icons[field.icon] : null;
  const renderInput = () => {
    const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
    const readOnlyClasses = "bg-gray-100 cursor-not-allowed";
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={value || ''}
            onChange={onChange}
            readOnly={field.readOnly}
            rows={field.rows || 3}
            className={`${baseClasses} resize-none ${field.readOnly ? readOnlyClasses : ''}`}
            placeholder={field.placeholder}
          />
        );
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={value || ''}
            onChange={onChange}
            readOnly={field.readOnly}
            className={`${baseClasses} ${field.readOnly ? readOnlyClasses : ''}`}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const renderValue = () => {
    const displayValue = formatValue ? formatValue(value) : (value || 'No especificado');
    const minHeight = field.type === 'textarea' ? 'min-h-[100px]' : '';
    
    if (field.type === 'url' && value) {
      return (
        <div className={`px-4 py-3 bg-gray-50 rounded-lg ${minHeight}`}>
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {value}
          </a>
        </div>
      );
    }

    return (
      <div className={`px-4 py-3 bg-gray-50 rounded-lg ${minHeight}`}>
        <p className="text-gray-900">{displayValue}</p>
      </div>
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {IconComponent && <IconComponent className="w-4 h-4 inline mr-1" />}
        {field.label}
      </label>
      {editing ? renderInput() : renderValue()}
    </div>
  );
};

export default ProfileField;
