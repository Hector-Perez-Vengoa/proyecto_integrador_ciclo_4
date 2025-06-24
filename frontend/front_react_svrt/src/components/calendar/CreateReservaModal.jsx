// src/components/calendar/CreateReservaModal.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Book, AlertCircle } from 'lucide-react';
import { formatDate, formatTime, isValidTimeRange } from '../../utils/calendarUtils';
import Modal from '../ui/Modal';
import { calendarService } from '../../services/calendarService';
import { useHorasDisponibles } from '../../hooks/useHorasDisponibles';

/**
 * Modal para crear una nueva reserva
 * Incluye validaciones y manejo de conflictos
 */
const CreateReservaModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onSubmit, 
  loading, 
  availableAulas = [],
  availableCursos = [],
  onReloadAulas
}) => {
  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    aulaId: '',
    cursoId: '',
    motivo: '',
    observaciones: ''
  });
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);
  const [validating, setValidating] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  // Hook para manejar horas disponibles
  const {
    opcionesHoraInicio,
    obtenerOpcionesHoraFin,
    estaHoraOcupada,
    esRangoDisponible,
    obtenerInfoHoraOcupada,
    loading: loadingHoras
  } = useHorasDisponibles(formData.aulaId, formData.fecha);

  // Efecto para añadir estilos CSS personalizados para los selectores
  useEffect(() => {
    const styleId = 'hora-selector-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;      style.textContent = `
        .hora-select option:disabled {
          color: #9ca3af !important;
          background-color: #f3f4f6 !important;
          font-style: italic;
          opacity: 0.6;
        }
        .hora-select option.ocupada:disabled {
          color: #dc2626 !important;
          background-color: #fef2f2 !important;
          font-weight: 500;
        }
        .hora-select option:hover:not(:disabled) {
          background-color: #e0f2fe !important;
        }
        .hora-select {
          background-color: white;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle && !isOpen) {
        existingStyle.remove();
      }
    };
  }, [isOpen]);  // Inicializar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateStr = selectedDate.dateStr || selectedDate.startStr?.split('T')[0] || '';      // Determinar horas basándose en el tipo de selección
      let startTime = '08:00'; // Valor por defecto
      let endTime = '09:00';
        // Intentar múltiples formas de extraer la hora
      if (selectedDate.isRangeSelection && selectedDate.start && selectedDate.end) {
        // Para selecciones de rango, usar las horas exactas seleccionadas
        const startDate = new Date(selectedDate.start);
        const endDate = new Date(selectedDate.end);
        
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
          endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
          
          // Validar que no exceda 4 horas
          const duracionMinutos = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
          if (duracionMinutos > 240) { // 4 horas = 240 minutos
            const maxEndTime = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
            endTime = `${maxEndTime.getHours().toString().padStart(2, '0')}:${maxEndTime.getMinutes().toString().padStart(2, '0')}`;
          }
        }
      } else if (selectedDate.isRangeSelection && selectedDate.timeStr && selectedDate.endTimeStr) {
        // Fallback para timeStr
        startTime = selectedDate.timeStr;
        endTime = selectedDate.endTimeStr;
        
        // Validar duración máxima
        const startMinutes = convertTimeToMinutes(startTime);
        const endMinutes = convertTimeToMinutes(endTime);
        const duracionMinutos = endMinutes - startMinutes;
        
        if (duracionMinutos > 240) {
          endTime = convertMinutesToTime(startMinutes + 240);
        }
      } else if (selectedDate.timeStr) {
        // Usar hora específica clickeada
        startTime = selectedDate.timeStr;
        endTime = calculateEndTime(selectedDate.timeStr);
      } else if (selectedDate.dateStr && selectedDate.dateStr.includes('T')) {
        // Extraer hora del dateStr
        const timeFromDateStr = selectedDate.dateStr.split('T')[1].substring(0, 5);
        startTime = timeFromDateStr;
        endTime = calculateEndTime(startTime);
      } else if (selectedDate.start) {
        // Extraer hora del objeto start (formato Date o string)
        let startDate;
        if (typeof selectedDate.start === 'string') {
          startDate = new Date(selectedDate.start);
        } else {
          startDate = selectedDate.start;
        }
        
        if (startDate && !isNaN(startDate.getTime())) {
          const hours = startDate.getHours();
          const minutes = startDate.getMinutes();
          startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          endTime = calculateEndTime(startTime);
        }
      } else if (selectedDate.startStr) {
        // Intentar extraer de startStr
        const startStr = selectedDate.startStr;
        if (startStr.includes('T')) {
          const timeFromStartStr = startStr.split('T')[1]?.substring(0, 5);
          if (timeFromStartStr) {
            startTime = timeFromStartStr;
            endTime = calculateEndTime(startTime);
          }
        }
      } else if (selectedDate.date) {
        // Intentar extraer de date
        const dateObj = new Date(selectedDate.date);
        if (!isNaN(dateObj.getTime())) {
          const hours = dateObj.getHours();
          const minutes = dateObj.getMinutes();
          startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          endTime = calculateEndTime(startTime);
        }      
      }
      setFormData({
        fecha: dateStr,
        horaInicio: startTime,
        horaFin: endTime,
        aulaId: '',
        cursoId: '',
        motivo: '',
        observaciones: ''
      });
      setErrors({});
      setConflicts([]);
    }
  }, [isOpen, selectedDate]);

  /**
   * Calcula la hora de fin sugerida (1 hora después)
   */
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = hours + 1;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  /**
   * Convierte tiempo en formato HH:MM a minutos desde medianoche
   */
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  /**
   * Convierte minutos desde medianoche a formato HH:MM
   */
  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo modificado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }    // Recalcular hora fin si cambia hora inicio
    if (name === 'horaInicio' && value) {
      const opcionesFin = obtenerOpcionesHoraFin(value);
      const horaFinActual = formData.horaFin;
      
      // Si la hora fin actual ya no es válida, limpiarla
      const horaFinValida = opcionesFin.find(opcion => 
        opcion.value === horaFinActual && !opcion.disabled
      );
      
      if (!horaFinValida) {
        // Establecer la primera opción disponible como hora fin
        const primeraOpcionDisponible = opcionesFin.find(opcion => !opcion.disabled);        setFormData(prev => ({
          ...prev,
          horaFin: primeraOpcionDisponible ? primeraOpcionDisponible.value : ''
        }));

        // Recargar aulas disponibles si tenemos fecha y horas
        if (onReloadAulas && formData.fecha && value && primeraOpcionDisponible) {
          onReloadAulas(formData.fecha, value, primeraOpcionDisponible.value);
        }
      } else {
        // Recargar aulas disponibles si tenemos fecha y horas válidas
        if (onReloadAulas && formData.fecha && value && horaFinActual) {
          onReloadAulas(formData.fecha, value, horaFinActual);
        }
      }
    }

    // Recargar aulas cuando cambia fecha o hora fin
    if (onReloadAulas) {
      const newFormData = { ...formData, [name]: value };
      
      if ((name === 'fecha' || name === 'horaFin') && 
          newFormData.fecha && newFormData.horaInicio && newFormData.horaFin) {
        onReloadAulas(newFormData.fecha, newFormData.horaInicio, newFormData.horaFin);
      }
    }
  };
  /**
   * Valida el formulario usando las nuevas reglas del backend
   */
  const validateForm = async () => {
    const newErrors = {};

    // Validar campos requeridos
    if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
    if (!formData.horaInicio) newErrors.horaInicio = 'La hora de inicio es requerida';
    if (!formData.horaFin) newErrors.horaFin = 'La hora de fin es requerida';
    if (!formData.aulaId) newErrors.aulaId = 'El aula es requerida';
    if (!formData.cursoId) newErrors.cursoId = 'El curso es requerido';
    if (!formData.motivo) newErrors.motivo = 'El motivo es requerido';

    // Validaciones con calendarService si tenemos los datos necesarios
    if (formData.fecha && formData.horaInicio && formData.horaFin) {
      try {
        // Validar fecha
        const dateValidation = calendarService.validateDate(formData.fecha);
        if (!dateValidation.isValid) {
          newErrors.fecha = dateValidation.error;
        }

        // Validar horario 
        const timeValidation = calendarService.validateTimeRange(formData.horaInicio, formData.horaFin);
        if (!timeValidation.isValid) {
          if (timeValidation.error.includes('inicio') || timeValidation.error.includes('fin')) {
            newErrors.horaFin = timeValidation.error;
          } else {
            newErrors.horaInicio = timeValidation.error;
          }
        }

        // Validar disponibilidad del aula si está seleccionada
        if (formData.aulaId) {
          setValidating(true);
          const isAvailable = await calendarService.checkAulaAvailability(
            formData.aulaId,
            formData.fecha,
            formData.horaInicio,
            formData.horaFin
          );
          
          if (!isAvailable.available) {
            newErrors.aulaId = `El aula no está disponible: ${isAvailable.reason}`;
            setConflicts(isAvailable.conflicts || []);
          } else {
            setConflicts([]);
          }
          setValidating(false);
        }

      } catch (error) {
        console.error('Error validating form:', error);
        newErrors.submit = 'Error al validar los datos. Intente nuevamente.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  /**
   * Valida en tiempo real cuando cambian los horarios o el aula
   */
  const validateRealTime = async () => {
    if (formData.fecha && formData.horaInicio && formData.horaFin && formData.aulaId) {
      try {
        setValidating(true);
        
        // Validar horario
        const timeValidation = calendarService.validateTimeRange(formData.horaInicio, formData.horaFin);
        if (!timeValidation.isValid) {
          setErrors(prev => ({
            ...prev,
            horaFin: timeValidation.error
          }));
          setValidating(false);
          return;
        }

        // Verificar disponibilidad
        const availability = await calendarService.checkAulaAvailability(
          formData.aulaId,
          formData.fecha,
          formData.horaInicio,
          formData.horaFin
        );

        if (!availability.available) {
          setConflicts(availability.conflicts || []);
          setErrors(prev => ({
            ...prev,
            aulaId: `Conflicto: ${availability.reason}`
          }));
        } else {
          setConflicts([]);
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.aulaId;
            delete newErrors.horaFin;
            return newErrors;
          });
        }
        
        setValidating(false);
      } catch (error) {
        console.error('Error in real-time validation:', error);
        setValidating(false);
      }
    }
  };  // Efecto para validación en tiempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      validateRealTime();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [formData.horaInicio, formData.horaFin, formData.aulaId, formData.fecha]);const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }    // Crear objeto de reserva
    const reservaData = {
      fechaReserva: formData.fecha,
      horaInicio: formData.horaInicio,
      horaFin: formData.horaFin,
      aulaVirtualId: parseInt(formData.aulaId),
      cursoId: parseInt(formData.cursoId),
      motivo: formData.motivo || 'Reserva de aula virtual',
      estado: 'CONFIRMADA'
    };

    console.log('Datos de reserva a enviar:', reservaData);

    try {
      const result = await onSubmit(reservaData);
      
      if (result.success) {
        onClose();
      } else {        setErrors({
          submit: result.message || 'Error al crear la reserva'
        });
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setErrors({
        submit: 'Error al enviar la reserva. Intente nuevamente.'
      });
    }
  };

  /**
   * Cierra el modal y resetea el formulario
   */
  const handleClose = () => {
    setFormData({
      fecha: '',
      horaInicio: '',
      horaFin: '',
      aulaId: '',
      cursoId: '',
      motivo: '',
      observaciones: ''
    });
    setErrors({});
    setConflicts([]);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Reserva"
      maxWidth="max-w-2xl"
    >
      {/* Error general */}
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{errors.submit}</span>
        </div>
      )}      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4">
            {/* Aula y Curso PRIMERO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Aula Virtual *
                </label>
                <select
                  name="aulaId"
                  value={formData.aulaId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.aulaId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Selecciona un aula</option>
                  {availableAulas.map(aula => (
                    <option key={aula.id} value={aula.id}>
                      {aula.codigo} - {aula.descripcion} (Cap: {aula.capacidad || 'N/A'})
                    </option>
                  ))}
                </select>
                {errors.aulaId && (
                  <p className="mt-1 text-xs text-red-600">{errors.aulaId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Book className="w-4 h-4 inline mr-1" />
                  Curso *
                </label>
                <select
                  name="cursoId"
                  value={formData.cursoId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cursoId ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Selecciona un curso</option>
                  {availableCursos.map(curso => (
                    <option key={curso.id} value={curso.id}>
                      {curso.codigo} - {curso.nombre}
                    </option>
                  ))}
                </select>
                {errors.cursoId && (
                  <p className="mt-1 text-xs text-red-600">{errors.cursoId}</p>
                )}
              </div>
            </div>

            {/* Fecha y Horarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fecha ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.fecha && (
                  <p className="mt-1 text-xs text-red-600">{errors.fecha}</p>
                )}
              </div>              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio *
                </label>                <select
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleInputChange}
                  className={`hora-select w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.horaInicio ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  disabled={!formData.aulaId || !formData.fecha || loadingHoras}
                >
                  <option value="">Selecciona hora de inicio</option>
                  {opcionesHoraInicio.map(opcion => (
                    <option 
                      key={opcion.value} 
                      value={opcion.value}
                      disabled={opcion.disabled}
                      className={opcion.ocupada ? 'ocupada' : ''}
                      title={opcion.ocupada ? 'Hora ocupada - No disponible' : 'Hora disponible'}
                    >
                      {opcion.label}{opcion.ocupada ? ' 🚫' : ''}
                    </option>
                  ))}
                </select>                {loadingHoras && (
                  <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Cargando horas disponibles...
                  </div>
                )}
                {errors.horaInicio && (
                  <p className="mt-1 text-xs text-red-600">{errors.horaInicio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin *
                </label>                <select
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleInputChange}
                  className={`hora-select w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.horaFin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                  disabled={!formData.horaInicio || loadingHoras}
                >
                  <option value="">Selecciona hora de fin</option>
                  {formData.horaInicio && obtenerOpcionesHoraFin(formData.horaInicio).map(opcion => (
                    <option 
                      key={opcion.value} 
                      value={opcion.value}
                      disabled={opcion.disabled}
                      className={opcion.ocupada ? 'ocupada' : ''}
                      title={
                        opcion.disabled 
                          ? opcion.razonDeshabilitada || 'No disponible'
                          : `Duración: ${Math.round(opcion.duracion)} minutos`
                      }
                    >
                      {opcion.label}
                      {opcion.disabled && opcion.ocupada && ' 🚫'}
                      {opcion.disabled && !opcion.ocupada && ' ⚠️'}
                    </option>
                  ))}
                </select>
                {errors.horaFin && (
                  <p className="mt-1 text-xs text-red-600">{errors.horaFin}</p>
                )}
              </div></div>            {/* Información de duración permitida */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Duraciones permitidas:
                </span>
              </div>              <p className="text-xs text-blue-700">
                • Mínimo: 1 hora | Máximo: 4 horas<br/>
                • Horario institucional: 08:00 - 22:00<br/>
                • Reservas permitidas: Lunes a Sábado<br/>
                • Solo se permiten horas completas (ej: 09:00, 10:00, 11:00)
              </p>              {validating && (
                <div className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Verificando disponibilidad...
                </div>
              )}
            </div>            {/* Indicador de horas ocupadas */}
            {formData.aulaId && formData.fecha && opcionesHoraInicio.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Guía de disponibilidad horaria:
                  </span>
                </div>                <div className="text-xs text-blue-700 space-y-1">
                  <p>✅ <strong>Horas disponibles:</strong> Aparecen normales y se pueden seleccionar</p>
                  <p>🚫 <strong>Horas ocupadas:</strong> Aparecen marcadas como "(OCUPADA)" y están deshabilitadas</p>
                  <p>⚠️ <strong>Duraciones no válidas:</strong> Aparecen con indicadores y están deshabilitadas</p>
                  <div className="mt-2 pt-2 border-t border-blue-300">
                    <div className="font-medium">
                      📊 Estado actual: {opcionesHoraInicio.filter(o => !o.disabled).length} horas disponibles de {opcionesHoraInicio.length} mostradas
                    </div>
                  </div>
                </div>
              </div>            )}

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la Reserva *
              </label>
              <select
                name="motivo"
                value={formData.motivo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.motivo ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Selecciona el motivo</option>
                <option value="CLASE_REGULAR">Clase Regular</option>
                <option value="EXAMEN">Examen</option>
                <option value="TUTORIA">Tutoría</option>
                <option value="REUNION">Reunión</option>
                <option value="CONFERENCIA">Conferencia</option>
                <option value="TALLER">Taller</option>
                <option value="OTRO">Otro</option>
              </select>
              {errors.motivo && (
                <p className="mt-1 text-xs text-red-600">{errors.motivo}</p>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={3}
                placeholder="Información adicional sobre la reserva..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Conflictos detectados */}
            {conflicts.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Conflictos detectados:
                  </span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {conflicts.map((conflict, index) => (
                    <li key={index}>• {conflict}</li>
                  ))}
                </ul>
              </div>
            )}            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || validating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                Crear Reserva
              </button>
            </div>
          </form>
    </Modal>
  );
};

export default CreateReservaModal;
