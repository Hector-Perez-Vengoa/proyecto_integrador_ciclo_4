// src/hooks/useHorasDisponibles.js
import { useState, useEffect, useMemo } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook para manejar las horas disponibles y ocupadas
 * @param {number} aulaId - ID del aula virtual
 * @param {string} fecha - Fecha seleccionada en formato YYYY-MM-DD
 * @returns {Object} Datos y funciones para manejar horas disponibles
 */
export const useHorasDisponibles = (aulaId, fecha) => {
  const [horasOcupadas, setHorasOcupadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // Horarios de funcionamiento (08:00 - 22:00)
  const HORA_INICIO = 8;
  const HORA_FIN = 22;

  // Cargar horas ocupadas cuando cambie el aula o la fecha
  useEffect(() => {
    if (aulaId && fecha) {
      cargarHorasOcupadas();
    } else {
      setHorasOcupadas([]);
    }
  }, [aulaId, fecha]);  const cargarHorasOcupadas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const ocupadas = await calendarService.obtenerHorasOcupadas(aulaId, fecha);
      setHorasOcupadas(ocupadas);
    } catch (err) {
      setError('Error al cargar horas ocupadas');
      console.error('❌ Error cargando horas ocupadas:', err);
    } finally {
      setLoading(false);
    }
  };// Generar todas las horas en el rango institucional (incluyendo medias horas)
  const todasLasHoras = useMemo(() => {
    const horas = [];
    for (let hora = HORA_INICIO; hora <= HORA_FIN; hora++) {
      // Agregar hora completa
      const horaCompleta = `${hora.toString().padStart(2, '0')}:00`;
      horas.push(horaCompleta);
      
      // Agregar media hora (excepto en la última hora)
      if (hora < HORA_FIN) {
        const mediaHora = `${hora.toString().padStart(2, '0')}:30`;
        horas.push(mediaHora);
      }
    }
    return horas;
  }, []);// Función utilitaria para convertir hora a minutos
  const convertirHoraAMinutos = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };

  // Obtener información sobre una hora ocupada
  const obtenerInfoHoraOcupada = (hora) => {
    return horasOcupadas.find(ocupada => {
      return hora >= ocupada.horaInicio && hora < ocupada.horaFin;
    });
  };
  // Verificar si una hora específica está ocupada
  const estaHoraOcupada = useMemo(() => {
    return (hora) => {
      const ocupada = horasOcupadas.some(ocupada => {
        const inicioOcupada = ocupada.horaInicio;
        const finOcupada = ocupada.horaFin;
        const estaEnRango = hora >= inicioOcupada && hora < finOcupada;
        
        return estaEnRango;
      });
      
      return ocupada;
    };
  }, [horasOcupadas]);

  // Verificar si un rango está disponible
  const esRangoDisponible = useMemo(() => {
    return (horaInicio, horaFin) => {
      if (!horaInicio || !horaFin) return true;
      
      return !horasOcupadas.some(ocupada => {
        const inicioOcupada = ocupada.horaInicio;
        const finOcupada = ocupada.horaFin;
        
        // Verificar si hay solapamiento
        return (
          (horaInicio < finOcupada && horaFin > inicioOcupada)
        );
      });
    };
  }, [horasOcupadas]);
  // Obtener horas válidas para hora de inicio
  const horasValidasInicio = useMemo(() => {
    return todasLasHoras.filter(hora => !estaHoraOcupada(hora));
  }, [todasLasHoras, estaHoraOcupada]);  // Generar opciones para selector de hora inicio (TODAS las horas, marcando las ocupadas)
  const opcionesHoraInicio = useMemo(() => {
    return todasLasHoras
      .filter(hora => {
        // Permitir hasta las 21:30 para que se pueda reservar al menos 30 minutos
        const [h, m] = hora.split(':').map(Number);
        const minutos = h * 60 + m;
        const limiteSuperior = 21 * 60 + 30; // 21:30
        return minutos <= limiteSuperior;
      })
      .map(hora => {
        const ocupada = estaHoraOcupada(hora);
        
        return {
          value: hora,
          label: ocupada ? `${hora} (OCUPADA)` : hora,
          disabled: ocupada, // Deshabilitar si está ocupada
          ocupada: ocupada,
          info: ocupada ? obtenerInfoHoraOcupada(hora) : null
        };
      });
  }, [todasLasHoras, estaHoraOcupada, horasOcupadas, obtenerInfoHoraOcupada]);  // Obtener horas válidas para hora de fin (basado en hora de inicio seleccionada)
  const obtenerHorasValidasFin = (horaInicio) => {
    if (!horaInicio) return [];
    
    const inicioMinutos = convertirHoraAMinutos(horaInicio);
    const DURACION_MINIMA = 30; // 30 minutos mínimo
    const DURACION_MAXIMA = 240; // 4 horas máximo
    
    return todasLasHoras.filter(hora => {
      const finMinutos = convertirHoraAMinutos(hora);
      const duracion = finMinutos - inicioMinutos;
      
      // Validar duración mínima y máxima
      if (duracion < DURACION_MINIMA || duracion > DURACION_MAXIMA) {
        return false;
      }
      
      // Validar que el rango esté disponible
      return esRangoDisponible(horaInicio, hora);
    });
  };// Generar opciones para selector de hora fin (TODAS las horas, marcando las no válidas)
  const obtenerOpcionesHoraFin = (horaInicio) => {
    if (!horaInicio) return [];
      const inicioMinutos = convertirHoraAMinutos(horaInicio);
    const DURACION_MINIMA = 30; // 30 minutos mínimo
    const DURACION_MAXIMA = 240; // 4 horas máximo
    
    return todasLasHoras
      .filter(hora => convertirHoraAMinutos(hora) > inicioMinutos) // Solo horas posteriores
      .map(hora => {
        const finMinutos = convertirHoraAMinutos(hora);
        const duracion = finMinutos - inicioMinutos;
        
        // Determinar si es una opción válida
        const isDuracionValida = duracion >= DURACION_MINIMA && duracion <= DURACION_MAXIMA;
        const isRangoDisponible = esRangoDisponible(horaInicio, hora);
        
        const isDisabled = !isDuracionValida || !isRangoDisponible;
        
        // Determinar la razón del deshabilitado
        let razonDeshabilitada = '';
        let labelExtra = '';
        
        if (!isDuracionValida) {
          if (duracion < DURACION_MINIMA) {
            razonDeshabilitada = 'Duración muy corta (mín. 30 min)';
            labelExtra = ' (Muy corta)';
          } else {
            razonDeshabilitada = 'Duración muy larga (máx. 4 horas)';
            labelExtra = ' (Muy larga)';
          }
        } else if (!isRangoDisponible) {
          razonDeshabilitada = 'Horario ocupado';
          labelExtra = ' (OCUPADO)';
        }
        
        // Formato amigable de duración
        let horasTexto;
        if (duracion < 60) {
          horasTexto = `${duracion} min`;
        } else if (duracion === 60) {
          horasTexto = '1 hora';
        } else if (duracion % 60 === 0) {
          horasTexto = `${duracion / 60} horas`;
        } else {
          const horas = Math.floor(duracion / 60);
          const minutos = duracion % 60;
          horasTexto = `${horas}h ${minutos}min`;
        }
          return {
          value: hora,
          label: `${hora} (${horasTexto})${labelExtra}`,
          disabled: isDisabled,
          ocupada: !isRangoDisponible,
          duracion,
          razonDeshabilitada
        };
      });
  };

  return {
    horasOcupadas,
    loading,
    error,
    todasLasHoras,
    horasValidasInicio,
    opcionesHoraInicio,
    obtenerHorasValidasFin,
    obtenerOpcionesHoraFin,
    estaHoraOcupada,
    esRangoDisponible,
    obtenerInfoHoraOcupada,
    recargar: cargarHorasOcupadas
  };
};
