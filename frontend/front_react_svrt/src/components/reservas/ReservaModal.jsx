// src/components/reservas/ReservaModal.jsx
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useReservaForm } from '../../hooks/useReservaForm';
import { MOTIVOS_RESERVA } from '../../constants/reservas';

const ReservaModal = ({ 
  isOpen, 
  onClose, 
  aula, 
  onSuccess, 
  onError 
}) => {
  const [localErrors, setLocalErrors] = useState({});
  
  const {
    formData,
    errors,
    loading,
    cursos,
    loadingCursos,
    updateField,
    submitForm,
    resetForm,
    cargarCursos
  } = useReservaForm(aula?.id, onSuccess, onError);

  // Combinar errores del hook con errores locales
  const allErrors = { ...errors, ...localErrors };

  // Limpiar errores locales cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setLocalErrors({});
    }
  }, [isOpen]);

  // Cargar cursos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      cargarCursos();
    } else {
      resetForm();
    }
  }, [isOpen, cargarCursos, resetForm]);

  // Generar opciones de horarios (bloques de 15 minutos)
  const generarOpcionesHorario = () => {
    const opciones = [];
    for (let hora = 7; hora <= 22; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 15) {
        const horaStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        const etiqueta = `${horaStr}`;
        opciones.push({ value: horaStr, label: etiqueta });
      }
    }
    return opciones;
  };

  // Obtener fecha mínima (hoy)
  const getFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  if (!aula) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reservar ${aula.codigo}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del aula */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Aula Seleccionada</h4>
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">Código:</span> {aula.codigo}</p>
            {aula.descripcion && (
              <p><span className="font-medium">Descripción:</span> {aula.descripcion}</p>
            )}
            <p><span className="font-medium">Estado:</span> 
              <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                {aula.estado}
              </span>
            </p>
          </div>
        </div>        {/* Error general */}
        {errors.general && (
          <div className={`border rounded-lg p-4 ${
            errors.general.includes('⏱️') 
              ? 'bg-yellow-50 border-yellow-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {errors.general.includes('⏱️') ? (
                <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`text-sm whitespace-pre-line ${
                  errors.general.includes('⏱️') 
                    ? 'text-yellow-800' 
                    : 'text-red-800'
                }`}>
                  {errors.general}
                </p>
                {errors.general.includes('⏱️') && (                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose(); // Cerrar el modal primero
                        setTimeout(() => {
                          window.location.href = '/dashboard/mis-reservas';
                        }, 100);
                      }}
                      className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md transition-colors"
                    >
                      📋 Ver Mis Reservas
                    </button>                    <button
                      type="button"
                      onClick={() => setLocalErrors({})}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md transition-colors"
                    >
                      ✕ Cerrar aviso
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campos del formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fecha */}
          <div className="md:col-span-2">
            <Input
              label="Fecha"
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={(e) => updateField('fecha', e.target.value)}
              min={getFechaMinima()}
              error={allErrors.fecha}
              required
            />
          </div>

          {/* Hora de inicio */}
          <div>
            <Select
              label="Hora de inicio"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={(e) => updateField('horaInicio', e.target.value)}
              options={generarOpcionesHorario()}
              placeholder="Seleccionar hora..."
              error={allErrors.horaInicio}
              required
            />
          </div>

          {/* Hora de fin */}
          <div>
            <Select
              label="Hora de fin"
              name="horaFin"
              value={formData.horaFin}
              onChange={(e) => updateField('horaFin', e.target.value)}
              options={generarOpcionesHorario()}
              placeholder="Seleccionar hora..."
              error={errors.horaFin}
              required
            />
          </div>

          {/* Curso */}
          <div className="md:col-span-2">
            <Select
              label="Curso"
              name="cursoId"
              value={formData.cursoId}
              onChange={(e) => updateField('cursoId', e.target.value)}
              options={cursos.map(curso => ({ 
                value: curso.id.toString(), 
                label: curso.nombre 
              }))}
              placeholder={loadingCursos ? "Cargando cursos..." : "Seleccionar curso..."}
              error={errors.cursoId}
              disabled={loadingCursos}
              required
            />
          </div>

          {/* Motivo */}
          <div className="md:col-span-2">
            <Select
              label="Motivo"
              name="motivo"
              value={formData.motivo}
              onChange={(e) => updateField('motivo', e.target.value)}
              options={MOTIVOS_RESERVA}
              placeholder="Seleccionar motivo..."
              error={errors.motivo}
              required
            />
          </div>

          {/* Motivo personalizado (solo si selecciona "otro") */}
          {formData.motivo === 'otro' && (
            <div className="md:col-span-2">
              <Input
                label="Especificar motivo"
                type="text"
                name="motivoPersonalizado"
                value={formData.motivoPersonalizado}
                onChange={(e) => updateField('motivoPersonalizado', e.target.value)}
                placeholder="Describe el motivo de la reserva..."
                error={errors.motivoPersonalizado}
                maxLength={250}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.motivoPersonalizado.length}/250 caracteres
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">📋 Información importante</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• La duración mínima de una reserva es de 45 minutos</li>
            <li>• No se pueden hacer reservas los domingos</li>
            <li>• Las reservas se confirman automáticamente</li>
            <li>• Recibirás una notificación por correo electrónico</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loadingCursos}
            className="sm:order-2"
          >
            {loading ? 'Creando reserva...' : 'Confirmar reserva'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReservaModal;
