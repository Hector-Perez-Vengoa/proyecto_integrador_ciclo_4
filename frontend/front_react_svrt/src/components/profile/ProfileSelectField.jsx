// src/components/profile/ProfileSelectField.jsx
import React, { useState, useRef, useEffect } from 'react';
import * as Icons from 'lucide-react';

const ProfileSelectField = ({ field, value, editing, onChange, formatValue, options = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const IconComponent = field.icon ? Icons[field.icon] : null;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectOption = (option) => {
    if (field.type === 'select') {
      // Selección única
      onChange({
        target: {
          name: field.name,
          value: option.id
        }
      });
      setIsOpen(false);
    } else if (field.type === 'multiselect') {
      // Selección múltiple
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(option.id)
        ? currentValues.filter(id => id !== option.id)
        : [...currentValues, option.id];
      
      onChange({
        target: {
          name: field.name,
          value: newValues
        }
      });
    }
  };

  const renderValue = () => {
    if (!editing) {
      const displayValue = formatValue ? formatValue(value, options) : getDisplayValue(value, options);
      const isEmpty = !value || (Array.isArray(value) && value.length === 0);
        return (
        <div className={`px-4 py-3.5 bg-gradient-to-r from-tecsup-gray-100/80 to-tecsup-blue-50/20 rounded-xl border border-tecsup-gray-200/50 hover:from-tecsup-gray-100 hover:to-tecsup-blue-50/40 hover:border-tecsup-gray-300/30 transition-all duration-400 min-h-[50px] hover-scale-gentle`}>
          <p className={`${isEmpty ? 'text-tecsup-gray-400 italic' : 'text-tecsup-gray-700 font-medium'} leading-relaxed`}>
            {displayValue}
          </p>
        </div>
      );
    }

    return (
      <div className="relative" ref={dropdownRef}>        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3.5 border-2 border-tecsup-gray-300/40 rounded-xl focus:outline-none focus:ring-4 focus:ring-tecsup-primary/20 focus:border-tecsup-primary transition-all duration-400 text-tecsup-gray-700 bg-white hover:border-tecsup-primary/40 cursor-pointer"
        >
          {getDisplayValue(value, options) || field.placeholder}
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-tecsup-gray-300/20 rounded-xl shadow-tecsup max-h-60 overflow-hidden">
            {/* Buscador para listas largas */}
            {options.length > 5 && (
              <div className="p-3 border-b border-tecsup-gray-200/50">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-tecsup-gray-300/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary text-sm"
                />
              </div>
            )}

            {/* Lista de opciones */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => {
                const isSelected = field.type === 'select' 
                  ? value === option.id
                  : Array.isArray(value) && value.includes(option.id);

                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(option)}                    className={`px-4 py-3 cursor-pointer hover:bg-tecsup-blue-50 transition-colors duration-200 flex items-center justify-between ${
                      isSelected ? 'bg-tecsup-primary text-white hover:bg-tecsup-blue-700' : 'text-tecsup-gray-700'
                    }`}
                  >
                    <span className="font-medium">{option.nombre}</span>
                    {isSelected && (
                      <Icons.Check className="w-4 h-4 ml-2" />
                    )}
                  </div>
                );
              })}              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-center text-tecsup-gray-400">
                  {field.name === 'carreraIds' && (!formData?.departamentoId) 
                    ? 'Selecciona un departamento primero'
                    : field.name === 'cursoIds' && (!formData?.carreraIds || formData?.carreraIds.length === 0)
                    ? 'Selecciona al menos una carrera primero'
                    : 'No se encontraron opciones'
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getDisplayValue = (currentValue, availableOptions) => {
    if (!currentValue || !availableOptions.length) return 'No especificado';

    if (field.type === 'select') {
      const option = availableOptions.find(opt => opt.id === currentValue);
      return option ? option.nombre : 'No especificado';
    } else if (field.type === 'multiselect') {
      if (!Array.isArray(currentValue) || currentValue.length === 0) return 'No especificado';
      
      const selectedOptions = availableOptions.filter(opt => currentValue.includes(opt.id));
      return selectedOptions.length > 0 
        ? selectedOptions.map(opt => opt.nombre).join(', ')
        : 'No especificado';
    }

    return 'No especificado';
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-semibold text-tecsup-gray-700 group cursor-pointer">
        {IconComponent && (
          <div className="w-5 h-5 rounded-lg bg-tecsup-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-400">
            <IconComponent className="w-3 h-3 text-white" />
          </div>
        )}
        <span className="group-hover:text-tecsup-primary transition-colors duration-400">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      {renderValue()}
    </div>
  );
};

export default ProfileSelectField;
