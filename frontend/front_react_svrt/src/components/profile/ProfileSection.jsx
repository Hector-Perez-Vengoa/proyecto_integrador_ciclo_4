// src/components/profile/ProfileSection.jsx
import React from 'react';
import MultiSelectField from './MultiSelectField';
import { formatDate } from '../../utils/profileUtils';
import { ProfileIcon } from '../../constants/profileIcons.jsx';

const ProfileSection = ({ 
  section, 
  profile, 
  editing, 
  formData, 
  handleInputChange, 
  handleFieldChange, 
  academicOptions = {},
  loadingOptions = false 
}) => {
  const getFieldValue = (fieldName) => {
    return editing ? formData[fieldName] : profile[fieldName];
  };  const getFormatValue = (field, fieldValue) => {
    if (field.type === 'date') {
      return formatDate(fieldValue);
    }
    if (field.type === 'select' || field.type === 'multiselect') {
      if (field.name === 'departamentoId') {
        return profile?.departamento?.nombre || 'No especificado';
      } else if (field.name === 'carreraIds') {
        return profile?.carreras?.map(c => c.nombre).join(', ') || 'No especificado';
      } else if (field.name === 'cursoIds') {
        return profile?.cursos?.map(c => c.nombre).join(', ') || 'No especificado';
      }
      return 'No especificado';
    }
    
    // Manejar campos que pueden llegar como objetos desde el backend
    if (typeof fieldValue === 'object' && fieldValue !== null) {
      if (field.name === 'departamento' && fieldValue.nombre) {
        return fieldValue.nombre;
      }
      // Si es un objeto pero no sabemos cómo manejarlo, convertir a string seguro
      return JSON.stringify(fieldValue);
    }
    
    return fieldValue || 'No especificado';
  };const getFieldOptions = (fieldName) => {
    switch (fieldName) {
      case 'departamentoId':
        return academicOptions.departamentos || [];
      case 'carreraIds':
        // Solo mostrar carreras si hay departamento seleccionado
        return (formData.departamentoId && academicOptions.carreras) ? academicOptions.carreras : [];
      case 'cursoIds':
        // Solo mostrar cursos si hay carreras seleccionadas
        return (formData.carreraIds && formData.carreraIds.length > 0 && academicOptions.cursos) ? academicOptions.cursos : [];
      default:
        return [];
    }
  };

  const isFieldDisabled = (fieldName) => {
    if (!editing) return true;
    
    switch (fieldName) {
      case 'carreraIds':
        return !formData.departamentoId; // Deshabilitado si no hay departamento
      case 'cursoIds':
        return !formData.carreraIds || formData.carreraIds.length === 0; // Deshabilitado si no hay carreras
      default:
        return false;
    }
  };
  const getFieldMessage = (fieldName) => {
    switch (fieldName) {
      case 'carreraIds':
        return !formData.departamentoId ? 'Selecciona un departamento primero' : null;
      case 'cursoIds':
        return (!formData.carreraIds || formData.carreraIds.length === 0) ? 
          'Selecciona al menos una carrera primero' : null;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-tecsup border-0 overflow-hidden card-elegant-hover mode-transition-container ${editing ? 'editing ring-1 ring-tecsup-primary/8 glass-effect-elegant' : 'viewing'} edit-mode-transition`}>      {/* Header de la sección */}
      <div className="relative bg-gradient-to-r from-tecsup-primary/5 to-tecsup-secondary/5 px-6 py-4 border-b border-tecsup-gray-100">        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>            <ProfileIcon 
              iconName={section.title === 'Información Personal' ? 'User' : 'GraduationCap'} 
              style={{ width: '20px', height: '20px', color: 'white' }}
            />
          </div>
          <h2 className="text-lg font-semibold text-tecsup-gray-700">
            {section.title}
          </h2>
          {editing && (
            <div className="ml-auto">
              <div className="w-2 h-2 bg-tecsup-primary rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Contenido */}
      <div className={`p-6 space-y-6 ${editing ? 'field-edit-highlight' : ''}`}>        {section.fields.map((field, index) => {
          const fieldValue = getFieldValue(field.name);
          const formattedValue = getFormatValue(field, fieldValue);

          return (
            <div key={field.name} className="space-y-2">              
            {/* Label */}
              <label className="flex items-center gap-2 text-sm font-medium text-tecsup-gray-600 ultra-smooth">
                <div className="w-4 h-4 rounded bg-tecsup-primary/10 flex items-center justify-center ultra-smooth icon-hover-effect">
                  <ProfileIcon iconName={field.icon} className="w-3 h-3 text-tecsup-primary icon-smooth-entrance" />
                </div>
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>              {/* Campo */}
              {editing ? (
                // Modo edición
                field.type === 'select' ? (
                  // Select simple (especialmente para departamento)
                  <select
                    name={field.name}
                    value={fieldValue || ''}
                    onChange={(e) => {
                      if (field.name === 'departamentoId') {
                        // Usar handleFieldChange para departamento (activará el filtrado cascada)
                        handleFieldChange && handleFieldChange(field.name, e.target.value);
                      } else {
                        handleInputChange(e);
                      }
                    }}
                    disabled={loadingOptions}
                    className="w-full px-3 py-2.5 bg-white border border-tecsup-gray-200 rounded-lg focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary ultra-smooth text-tecsup-gray-700 field-focus-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{loadingOptions ? 'Cargando...' : field.placeholder}</option>
                    {getFieldOptions(field.name).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.nombre}
                      </option>
                    ))}
                  </select>                ) : field.type === 'multiselect' ? (                  // Multiselect mejorado (para carreras y cursos)
                  <MultiSelectField
                    field={field}
                    value={fieldValue}
                    options={getFieldOptions(field.name)}
                    formData={formData}                      onChange={(selectedValues) => {
                      if (field.name === 'carreraIds' || field.name === 'cursoIds') {
                        // Usar handleFieldChange para carreras y cursos (activará el filtrado cascada)
                        handleFieldChange && handleFieldChange(field.name, selectedValues);
                      } else {
                        handleInputChange({ target: { name: field.name, value: selectedValues } });
                      }
                    }}
                    disabled={isFieldDisabled(field.name)}
                  />
                ) : field.type === 'textarea' ? (
                  // Textarea
                  <textarea
                    name={field.name}
                    value={fieldValue || ''}
                    onChange={handleInputChange}
                    readOnly={field.readOnly}
                    rows={field.rows || 4}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2.5 border border-tecsup-gray-200 rounded-lg focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary ultra-smooth resize-none text-tecsup-gray-700 field-focus-glow ${
                      field.readOnly ? 'bg-tecsup-gray-50 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                ) : (
                  // Input normal
                  <input
                    type={field.type}
                    name={field.name}
                    value={fieldValue || ''}
                    onChange={handleInputChange}
                    readOnly={field.readOnly}
                    placeholder={field.placeholder}
                    className={`w-full px-3 py-2.5 border border-tecsup-gray-200 rounded-lg focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary ultra-smooth text-tecsup-gray-700 field-focus-glow ${
                      field.readOnly ? 'bg-tecsup-gray-50 cursor-not-allowed' : 'bg-white'
                    }`}
                  />
                )
              ) : (                // Modo vista
                <div className="px-3 py-2.5 bg-tecsup-gray-50/50 rounded-lg border-0 ultra-smooth">
                  <p className={`text-sm ultra-smooth ${
                    fieldValue ? 'text-tecsup-gray-700 font-medium' : 'text-tecsup-gray-400 italic'
                  }`}>
                    {formattedValue}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileSection;
