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
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 bg-gradient-to-r ${section.gradient} rounded-lg flex items-center justify-center`}>
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
      </div>
      
      <div className="space-y-6">
        {section.fields.map((field) => (
          <ProfileField
            key={field.name}
            field={field}
            value={getFieldValue(field.name)}
            editing={editing}
            onChange={handleInputChange}
            formatValue={getFormatValue(field)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileSection;
