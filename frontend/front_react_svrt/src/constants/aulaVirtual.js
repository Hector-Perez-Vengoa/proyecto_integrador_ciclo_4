// src/constants/aulaVirtual.js

export const ESTADOS_AULA = {
  DISPONIBLE: 'disponible',
  RESERVADA: 'reservada',
  EN_USO: 'en_uso',
  EN_MANTENIMIENTO: 'en_mantenimiento',
  INACTIVA: 'inactiva',
  BLOQUEADA: 'bloqueada'
};

export const COLORES_ESTADO = {
  [ESTADOS_AULA.DISPONIBLE]: {
    bg: 'bg-tecsup-success/10',
    text: 'text-tecsup-success',
    border: 'border-tecsup-success/20',
    badge: 'bg-tecsup-success text-white'
  },
  [ESTADOS_AULA.RESERVADA]: {
    bg: 'bg-tecsup-cyan-500/10',
    text: 'text-tecsup-cyan-600',
    border: 'border-tecsup-cyan-500/20',
    badge: 'bg-tecsup-cyan-500 text-white'
  },
  [ESTADOS_AULA.EN_USO]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    badge: 'bg-yellow-500 text-white'
  },
  [ESTADOS_AULA.EN_MANTENIMIENTO]: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-200',
    badge: 'bg-orange-500 text-white'
  },
  [ESTADOS_AULA.INACTIVA]: {
    bg: 'bg-tecsup-gray-light',
    text: 'text-tecsup-gray-medium',
    border: 'border-tecsup-gray-medium/20',
    badge: 'bg-tecsup-gray-medium text-white'
  },
  [ESTADOS_AULA.BLOQUEADA]: {
    bg: 'bg-tecsup-danger/10',
    text: 'text-tecsup-danger',
    border: 'border-tecsup-danger/20',
    badge: 'bg-tecsup-danger text-white'
  }
};

export const LABELS_ESTADO = {
  [ESTADOS_AULA.DISPONIBLE]: 'Disponible',
  [ESTADOS_AULA.RESERVADA]: 'Reservada',
  [ESTADOS_AULA.EN_USO]: 'En Uso',
  [ESTADOS_AULA.EN_MANTENIMIENTO]: 'En Mantenimiento',
  [ESTADOS_AULA.INACTIVA]: 'Inactiva',
  [ESTADOS_AULA.BLOQUEADA]: 'Bloqueada'
};

export const ICONOS_ESTADO = {
  [ESTADOS_AULA.DISPONIBLE]: '✅',
  [ESTADOS_AULA.RESERVADA]: '🔒',
  [ESTADOS_AULA.EN_USO]: '🔄',
  [ESTADOS_AULA.EN_MANTENIMIENTO]: '🔧',
  [ESTADOS_AULA.INACTIVA]: '⏸️',
  [ESTADOS_AULA.BLOQUEADA]: '🚫'
};

export const FILTROS_AULA = {
  TODOS: 'todos',
  DISPONIBLES: 'disponibles',
  RESERVADAS: 'reservadas'
};

export const ORDENAMIENTO = {
  CODIGO_ASC: 'codigo_asc',
  CODIGO_DESC: 'codigo_desc',
  ESTADO_ASC: 'estado_asc',
  ESTADO_DESC: 'estado_desc'
};

// Utilidad para normalizar estados (aceptar 'reservado' como 'reservada')
export function normalizarEstadoAula(estado) {
  if (!estado) return '';
  const e = estado.toLowerCase();
  if (e === 'reservado') return ESTADOS_AULA.RESERVADA;
  if (e === 'en uso') return ESTADOS_AULA.EN_USO;
  if (e === 'en_mantenimiento') return ESTADOS_AULA.EN_MANTENIMIENTO;
  if (e === 'bloqueado') return ESTADOS_AULA.BLOQUEADA;
  return e;
}

// Nueva utilidad para obtener el label y color visual correcto para 'reservado' o 'reservada'
export function getEstadoVisual(estado) {
  const normalizado = normalizarEstadoAula(estado);
  // Si el original es 'reservado', forzar label masculino y color rojo
  if (estado && estado.toLowerCase() === 'reservado') {
    return {
      label: 'Reservado',
      icon: ICONOS_ESTADO[ESTADOS_AULA.RESERVADA],
      ...COLORES_ESTADO[ESTADOS_AULA.BLOQUEADA], // Usa el color rojo
    };
  }
  // Si es 'reservada', usa el label femenino y color cyan (o el que ya tiene)
  if (normalizado === ESTADOS_AULA.RESERVADA) {
    return {
      label: LABELS_ESTADO[ESTADOS_AULA.RESERVADA],
      icon: ICONOS_ESTADO[ESTADOS_AULA.RESERVADA],
      ...COLORES_ESTADO[ESTADOS_AULA.RESERVADA],
    };
  }
  // Otros estados
  return {
    label: LABELS_ESTADO[normalizado] || normalizado,
    icon: ICONOS_ESTADO[normalizado],
    ...COLORES_ESTADO[normalizado] || {},
  };
}
