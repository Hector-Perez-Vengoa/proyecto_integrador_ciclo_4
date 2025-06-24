// src/hooks/useEditMode.js
import { useState, useEffect, useRef } from 'react';

export const useEditMode = (editing) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (editing) {
      // Cuando se entra en modo edición
      setIsTransitioning(true);
      setShowPulse(true);
      
      // Limpiar el timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Después de la animación de pulse, remover el efecto
      timeoutRef.current = setTimeout(() => {
        setShowPulse(false);
        setIsTransitioning(false);
      }, 800); // Duración de la animación
      
    } else {
      // Cuando se sale del modo edición
      setShowPulse(false);
      setIsTransitioning(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editing]);

  const getEditModeClasses = () => {
    let classes = 'edit-mode-transition';
    
    if (editing) {
      classes += ' ring-1 ring-tecsup-primary/10 glass-effect-elegant';
      if (showPulse) {
        classes += ' edit-mode-pulse';
      }
    }
    
    return classes;
  };

  return {
    isTransitioning,
    showPulse,
    getEditModeClasses
  };
};
