// src/hooks/useAnimations.js
import { useCallback, useRef } from 'react';

export const useAnimations = () => {
  const animationTimeouts = useRef(new Set());

  // Limpiar timeouts al desmontar
  const clearAllTimeouts = useCallback(() => {
    animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    animationTimeouts.current.clear();
  }, []);

  // Agregar clase de animación con cleanup automático
  const addAnimation = useCallback((element, animationClass, duration = 600) => {
    if (!element) return;

    element.classList.add(animationClass);
    
    const timeout = setTimeout(() => {
      element.classList.remove(animationClass);
      animationTimeouts.current.delete(timeout);
    }, duration);

    animationTimeouts.current.add(timeout);
    return timeout;
  }, []);

  // Animación de entrada staggered (escalonada)
  const staggeredEntrance = useCallback((elements, animationClass = 'animate-fadeInUp', delay = 100) => {
    if (!elements || elements.length === 0) return;

    elements.forEach((element, index) => {
      if (element) {
        const timeout = setTimeout(() => {
          addAnimation(element, animationClass);
        }, index * delay);
        animationTimeouts.current.add(timeout);
      }
    });
  }, [addAnimation]);

  // Animación de salida staggered
  const staggeredExit = useCallback((elements, animationClass = 'fade-out', delay = 50) => {
    return new Promise((resolve) => {
      if (!elements || elements.length === 0) {
        resolve();
        return;
      }

      let completed = 0;
      const total = elements.length;

      elements.forEach((element, index) => {
        if (element) {
          const timeout = setTimeout(() => {
            addAnimation(element, animationClass, 400);
            completed++;
            if (completed === total) {
              setTimeout(resolve, 400);
            }
          }, index * delay);
          animationTimeouts.current.add(timeout);
        } else {
          completed++;
          if (completed === total) {
            setTimeout(resolve, 400);
          }
        }
      });
    });
  }, [addAnimation]);
  // Animación de flip para toggle de formularios
  const flipTransition = useCallback((container, callback, exitClass = 'form-animate-out', enterClass = 'form-animate-in') => {
    return new Promise((resolve) => {
      if (!container) {
        if (callback) callback();
        resolve();
        return;
      }

      // Aplicar animación de salida
      container.classList.add(exitClass);

      const timeout = setTimeout(() => {
        // Ejecutar callback (cambio de estado)
        if (callback) callback();

        // Aplicar animación de entrada
        setTimeout(() => {
          container.classList.remove(exitClass);
          container.classList.add(enterClass);          // Limpiar después de la animación
          const cleanupTimeout = setTimeout(() => {
            container.classList.remove(enterClass);
            animationTimeouts.current.delete(cleanupTimeout);
            resolve();
          }, 600); // Coincide exactamente con la duración de 0.6s
          animationTimeouts.current.add(cleanupTimeout);
        }, 50);        animationTimeouts.current.delete(timeout);
      }, 300); // Ajustado para el momento exacto del cambio (mitad de 0.6s)

      animationTimeouts.current.add(timeout);
    });
  }, []);

  // Animación de shake para errores
  const shakeError = useCallback((element) => {
    if (!element) return;
    addAnimation(element, 'animate-shake', 500);
  }, [addAnimation]);

  // Animación de bounce para éxito
  const bounceSuccess = useCallback((element) => {
    if (!element) return;
    addAnimation(element, 'animate-bounce', 1000);
  }, [addAnimation]);

  // Animación de pulse continuo
  const startPulse = useCallback((element) => {
    if (!element) return;
    element.classList.add('animate-pulse');
  }, []);

  const stopPulse = useCallback((element) => {
    if (!element) return;
    element.classList.remove('animate-pulse');
  }, []);

  // Verificar si las animaciones están habilitadas (accesibilidad)
  const animationsEnabled = useCallback(() => {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return {
    addAnimation,
    staggeredEntrance,
    staggeredExit,
    flipTransition,
    shakeError,
    bounceSuccess,
    startPulse,
    stopPulse,
    animationsEnabled,
    clearAllTimeouts
  };
};
