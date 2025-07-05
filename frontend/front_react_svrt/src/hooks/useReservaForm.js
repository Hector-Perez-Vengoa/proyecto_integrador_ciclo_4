// src/hooks/useReservaForm.js
import { useState, useCallback } from 'react';
import { reservaService } from '../services/api/reservaService';
import { VALIDACIONES, MENSAJES } from '../constants/reservas';
import { parsearFechaLocal, esDomingo } from '../utils/dateUtils';

export const useReservaForm = (aulaId, onSuccess, onError) => {
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cursoId: '',
    motivo: '',
    motivoPersonalizado: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [loadingCursos, setLoadingCursos] = useState(false);

  // Cargar cursos del usuario
  const cargarCursos = useCallback(async () => {
    setLoadingCursos(true);
    try {
      const response = await reservaService.obtenerCursosUsuario();
      if (response.success) {
        setCursos(response.data);
      } else {
        onError?.(response.error || 'Error al cargar cursos');
      }
    } catch (error) {
      onError?.('Error al cargar cursos');
    } finally {
      setLoadingCursos(false);
    }
  }, [onError]);

  // Actualizar campo del formulario
  const updateField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  // Validar formulario
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validar campos requeridos
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.horaInicio) newErrors.horaInicio = 'La hora de inicio es requerida';
    if (!formData.horaFin) newErrors.horaFin = 'La hora de fin es requerida';
    if (!formData.cursoId) newErrors.cursoId = 'El curso es requerido';
    if (!formData.motivo) newErrors.motivo = 'El motivo es requerido';    // Validar fecha (no domingos, no pasado)
    if (formData.fecha) {
      const fechaSeleccionada = parsearFechaLocal(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaSeleccionada && fechaSeleccionada < hoy) {
        newErrors.fecha = 'No se puede reservar en fechas pasadas';
      } else if (esDomingo(formData.fecha)) {
        newErrors.fecha = MENSAJES.ERROR.DOMINGO_RESTRINGIDO;
      }
    }

    // Validar horarios
    if (formData.horaInicio && formData.horaFin) {
      const [horaInicioH, horaInicioM] = formData.horaInicio.split(':').map(Number);
      const [horaFinH, horaFinM] = formData.horaFin.split(':').map(Number);
      
      const minutosInicio = horaInicioH * 60 + horaInicioM;
      const minutosFin = horaFinH * 60 + horaFinM;
      
      if (minutosFin <= minutosInicio) {
        newErrors.horaFin = MENSAJES.ERROR.HORA_INVALIDA;
      } else {
        const duracionMinutos = minutosFin - minutosInicio;
        
        if (duracionMinutos < VALIDACIONES.MIN_DURACION_MINUTOS) {
          newErrors.horaFin = MENSAJES.ERROR.DURACION_MINIMA;
        } else if (duracionMinutos > VALIDACIONES.MAX_DURACION_HORAS * 60) {
          newErrors.horaFin = MENSAJES.ERROR.DURACION_MAXIMA;
        }
      }
    }

    // Validar motivo personalizado si es necesario
    if (formData.motivo === 'otro' && !formData.motivoPersonalizado.trim()) {
      newErrors.motivoPersonalizado = 'Debe especificar el motivo personalizado';
    }

    // Validar longitud del motivo
    const motivoFinal = formData.motivo === 'otro' 
      ? formData.motivoPersonalizado 
      : formData.motivo;
    
    if (motivoFinal && motivoFinal.length > VALIDACIONES.MAX_CARACTERES_MOTIVO) {
      const campo = formData.motivo === 'otro' ? 'motivoPersonalizado' : 'motivo';
      newErrors[campo] = MENSAJES.ERROR.MOTIVO_LARGO;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Verificar disponibilidad
  const verificarDisponibilidad = useCallback(async () => {
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin) {
      return false;
    }

    try {
      const response = await reservaService.verificarDisponibilidad(
        aulaId,
        formData.fecha,
        formData.horaInicio,
        formData.horaFin
      );

      if (!response.disponible) {
        setErrors(prev => ({
          ...prev,
          general: response.error || MENSAJES.ERROR.AULA_NO_DISPONIBLE
        }));
        return false;
      }

      return true;
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: MENSAJES.ERROR.ERROR_CONEXION
      }));
      return false;
    }
  }, [aulaId, formData.fecha, formData.horaInicio, formData.horaFin]);

  // Enviar formulario
  const submitForm = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Verificar disponibilidad primero
      const disponible = await verificarDisponibilidad();
      if (!disponible) {
        setLoading(false);
        return;
      }

      // Preparar datos de la reserva
      const motivoFinal = formData.motivo === 'otro' 
        ? formData.motivoPersonalizado 
        : formData.motivo;      const reservaData = {
        aulaVirtualId: aulaId,
        userId: null, // Se obtiene del token en el backend
        cursoId: parseInt(formData.cursoId),
        fechaReserva: formData.fecha,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        motivo: motivoFinal,
        estado: "CONFIRMADA" // Valor válido según la enumeración EstadoReserva
      };      // Enviar reserva
      const response = await reservaService.crearReserva(reservaData);

      console.log('🔍 useReservaForm: Respuesta de reservaService.crearReserva:', response);

      if (response.success) {
        console.log('✅ useReservaForm: Reserva creada exitosamente, llamando onSuccess');
        onSuccess?.(response.message || MENSAJES.SUCCESS.RESERVA_CREADA);
        // Limpiar formulario
        setFormData({
          fecha: '',
          horaInicio: '',
          horaFin: '',
          cursoId: '',
          motivo: '',
          motivoPersonalizado: ''
        });      } else {
        console.error('❌ useReservaForm: Error reportado por reservaService:', response);
        
        // Mensaje específico para timeouts
        let errorMessage = response.error || 'Error al crear la reserva';
        
        if (response.isTimeout) {
          // Para timeouts, mostrar un mensaje más informativo y sugerir verificar
          setErrors({ 
            general: `⏱️ ${errorMessage}\n\n💡 Sugerencia: Revisa la sección "Mis Reservas" para confirmar si la reserva se creó exitosamente.`
          });
          
          // Llamar onError pero con un mensaje menos alarmante
          onError?.('Proceso completado - Verifica en "Mis Reservas"');
        } else {
          // Para otros errores, mostrar el mensaje normal
          setErrors({ 
            general: errorMessage + (response.details ? `: ${JSON.stringify(response.details)}` : '') 
          });
          onError?.(errorMessage);
        }
      }
    } catch (error) {
      const errorMsg = MENSAJES.ERROR.ERROR_CONEXION;
      setErrors({ general: errorMsg });
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [aulaId, formData, validateForm, verificarDisponibilidad, onSuccess, onError]);

  // Limpiar formulario
  const resetForm = useCallback(() => {
    setFormData({
      fecha: '',
      horaInicio: '',
      horaFin: '',
      cursoId: '',
      motivo: '',
      motivoPersonalizado: ''
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    loading,
    cursos,
    loadingCursos,
    updateField,
    submitForm,
    resetForm,
    cargarCursos
  };
};
