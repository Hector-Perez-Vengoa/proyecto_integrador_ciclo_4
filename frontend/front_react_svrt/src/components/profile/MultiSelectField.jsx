// src/components/profile/MultiSelectField.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

const MultiSelectField = ({ field, value, options, onChange, disabled = false, formData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Convertir value a array si no lo es
  const selectedIds = Array.isArray(value) ? value : (value ? [value] : []);

  // Filtrar opciones basado en búsqueda
  const filteredOptions = options.filter(option =>
    option.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enfocar input de búsqueda cuando se abre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm('');
  };
  const handleOptionClick = (optionId) => {
    if (disabled) return;
    
    const newValue = selectedIds.includes(optionId)
      ? selectedIds.filter(id => id !== optionId)
      : [...selectedIds, optionId];

    // Soportar tanto el patrón de evento como el patrón directo
    if (typeof onChange === 'function') {
      if (onChange.length === 1) {
        // Nuevo patrón: pasar directamente el valor
        onChange(newValue);
      } else {
        // Patrón original: pasar objeto evento
        onChange({
          target: {
            name: field.name,
            value: newValue
          }
        });
      }
    }
  };

  const removeSelectedOption = (optionId, e) => {
    e.stopPropagation();
    if (disabled) return;
    
    const newValue = selectedIds.filter(id => id !== optionId);
    
    // Soportar tanto el patrón de evento como el patrón directo
    if (typeof onChange === 'function') {
      if (onChange.length === 1) {
        // Nuevo patrón: pasar directamente el valor
        onChange(newValue);
      } else {
        // Patrón original: pasar objeto evento
        onChange({
          target: {
            name: field.name,
            value: newValue
          }
        });
      }
    }
  };
  const getSelectedOptions = () => {
    return options.filter(option => selectedIds.includes(option.id));
  };
  // Función para obtener el mensaje de estado
  const getStatusMessage = () => {
    if (disabled) {
      if (field.name === 'carreraIds') {
        return 'Selecciona un departamento primero';
      } else if (field.name === 'cursoIds') {
        return 'Selecciona al menos una carrera primero';
      }
    }
    if (options.length === 0) {
      if (field.name === 'carreraIds') {
        return 'No hay carreras disponibles para este departamento';
      } else if (field.name === 'cursoIds') {
        return 'No hay cursos disponibles para las carreras seleccionadas';
      }
      return 'No hay opciones disponibles';
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="relative" ref={dropdownRef}>      {/* Campo principal */}
      <div
        onClick={handleToggle}
        className={`min-h-[42px] w-full px-3 py-2 bg-white border border-tecsup-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-tecsup-primary/20 focus-within:border-tecsup-primary field-transition-fluid ultra-smooth ${
          disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover-glow-elegant'
        }`}
      >
        <div className="flex items-center justify-between">          <div className="flex-1 flex flex-wrap gap-1">
            {selectedIds.length === 0 ? (
              <span className="text-tecsup-gray-400 text-sm">
                {statusMessage || field.placeholder}
              </span>
            ) : (
              getSelectedOptions().map((option) => (                <span
                  key={option.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-tecsup-primary/10 text-tecsup-primary text-xs rounded-md border border-tecsup-primary/20"
                >
                  {option.nombre}                  <button
                    type="button"
                    onClick={(e) => removeSelectedOption(option.id, e)}
                    className="hover:bg-tecsup-primary/20 rounded-full p-0.5 ultra-smooth"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-tecsup-gray-400 ultra-smooth ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-tecsup-gray-200 rounded-lg shadow-tecsup-lg max-h-64 overflow-hidden">
          {/* Buscador */}
          <div className="p-3 border-b border-tecsup-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-tecsup-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-tecsup-gray-200 rounded-md focus:ring-2 focus:ring-tecsup-primary/20 focus:border-tecsup-primary ultra-smooth"
              />
            </div>
          </div>          {/* Lista de opciones */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-tecsup-gray-400 text-sm">
                {field.name === 'carreraIds' && (!formData?.departamentoId) 
                  ? 'Selecciona un departamento primero'
                  : field.name === 'cursoIds' && (!formData?.carreraIds || formData?.carreraIds.length === 0)
                  ? 'Selecciona al menos una carrera primero'
                  : searchTerm 
                  ? 'No se encontraron opciones para la búsqueda'
                  : 'No hay opciones disponibles'
                }
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleOptionClick(option.id)}                    className={`px-3 py-2.5 cursor-pointer flex items-center justify-between ultra-smooth ${
                      isSelected
                        ? 'bg-tecsup-primary/10 text-tecsup-primary'
                        : 'hover:bg-tecsup-gray-50 text-tecsup-gray-700'
                    }`}
                  >
                    <span className="font-medium">{option.nombre}</span>                    {isSelected && (
                      <Check className="w-4 h-4 text-tecsup-primary" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer con contador */}
          {selectedIds.length > 0 && (
            <div className="px-3 py-2 border-t border-tecsup-gray-100 bg-tecsup-gray-50/50">
              <span className="text-xs text-tecsup-gray-500">
                {selectedIds.length} {selectedIds.length === 1 ? 'seleccionado' : 'seleccionados'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectField;
