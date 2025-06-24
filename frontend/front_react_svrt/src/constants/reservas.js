// src/constants/reservas.js

export const MOTIVOS_RESERVA = [
  { value: 'clase', label: 'Clase regular' },
  { value: 'examen', label: 'Examen' },
  { value: 'laboratorio', label: 'Laboratorio' },
  { value: 'reunion', label: 'Reunión' },
  { value: 'tutoria', label: 'Tutoría' },
  { value: 'presentacion', label: 'Presentación' },
  { value: 'conferencia', label: 'Conferencia' },
  { value: 'otro', label: 'Otro motivo' }
];

export const BLOQUES_HORARIOS = {
  DURACION_MINUTOS: 45,
  INTERVALO_MINUTOS: 15,
  HORA_INICIO: '07:00',
  HORA_FIN: '22:00'
};

export const VALIDACIONES = {
  MAX_CARACTERES_MOTIVO: 250,
  DIAS_RESTRICCION: [0], // Domingo = 0
  MIN_DURACION_MINUTOS: 45,
  MAX_DURACION_HORAS: 4
};

export const MENSAJES = {
  SUCCESS: {
    RESERVA_CREADA: 'Reserva creada exitosamente',
    RESERVA_CANCELADA: 'Reserva cancelada exitosamente'
  },
  ERROR: {
    HORA_INVALIDA: 'La hora de fin debe ser posterior a la hora de inicio',
    DOMINGO_RESTRINGIDO: 'No se pueden hacer reservas los domingos',
    CAMPOS_REQUERIDOS: 'Todos los campos son obligatorios',
    DURACION_MINIMA: 'La reserva debe tener una duración mínima de 45 minutos',
    DURACION_MAXIMA: 'La reserva no puede exceder las 4 horas',
    MOTIVO_LARGO: 'El motivo no puede exceder los 250 caracteres',
    AULA_NO_DISPONIBLE: 'El aula no está disponible en el horario seleccionado',
    ERROR_CONEXION: 'Error de conexión. Intente nuevamente'
  }
};

export const ESTADOS_RESERVA = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA',
  CANCELADA: 'CANCELADA',
  FINALIZADA: 'FINALIZADA',
  NO_ASISTIDA: 'NO_ASISTIDA'
};

export const COLORES_ESTADO = {
  [ESTADOS_RESERVA.PENDIENTE]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-400'
  },
  [ESTADOS_RESERVA.CONFIRMADA]: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-400'
  },
  [ESTADOS_RESERVA.CANCELADA]: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-400'
  },
  [ESTADOS_RESERVA.FINALIZADA]: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-400'
  },
  [ESTADOS_RESERVA.NO_ASISTIDA]: {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
    dot: 'bg-gray-400'
  }
};
