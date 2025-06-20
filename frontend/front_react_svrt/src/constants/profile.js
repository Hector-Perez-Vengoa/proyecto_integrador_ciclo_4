// src/constants/profile.js

export const PROFILE_FIELDS = {
  REQUIRED: ['firstName', 'lastName', 'email', 'telefono', 'fechaNacimiento', 'biografia'],
  ALL: ['firstName', 'lastName', 'email', 'telefono', 'fechaNacimiento', 'biografia', 'ubicacion', 'sitioWeb', 'linkedin', 'twitter', 'imagenPerfil']
};

export const COMPLETENESS_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 80,
  HIGH: 100
};

export const PROFILE_SECTIONS = {
  PERSONAL: {
    title: 'Información Personal',
    icon: 'User',
    gradient: 'from-tecsup-primary to-tecsup-blue-700',
    fields: [
      {
        name: 'firstName',
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingresa tu nombre',
        icon: 'User',
        required: true
      },
      {
        name: 'lastName',
        label: 'Apellido',
        type: 'text',
        placeholder: 'Ingresa tu apellido', 
        icon: 'User',
        required: true
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'correo@tecsup.edu.pe',
        icon: 'Mail',
        required: true,
        readOnly: true
      },
      {
        name: 'departamento',
        label: 'Departamento',
        type: 'tel',
        icon: 'Department',
        required: true
      },
      {
        name: 'fechaNacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        icon: 'Calendar',
        required: true
      }
    ]
  },  ADDITIONAL: {
    title: 'Información Adicional',
    icon: 'Star',
    gradient: 'from-tecsup-secondary to-tecsup-cyan-600',
    fields: [
      {
        name: 'biografia',
        label: 'Biografía',
        type: 'textarea',
        placeholder: 'Cuéntanos sobre ti...',
        icon: 'FileText',
        rows: 4,
        required: true
      },
      {
        name: 'ubicacion',
        label: 'Ubicación',
        type: 'text',
        placeholder: 'Lima, Perú',
        icon: 'MapPin'
      },
    ]
  }
};

export const WELCOME_BENEFITS = [
  'Personaliza tu experiencia',
  'Conecta con otros profesores',
  'Accede a funciones exclusivas'
];
