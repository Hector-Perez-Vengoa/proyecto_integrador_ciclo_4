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
    gradient: 'from-blue-500 to-purple-600',
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
        name: 'telefono',
        label: 'Teléfono',
        type: 'tel',
        placeholder: '+51 999 999 999',
        icon: 'Phone',
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
    gradient: 'from-purple-500 to-pink-600',
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
      {
        name: 'sitioWeb',
        label: 'Sitio Web',
        type: 'url',
        placeholder: 'https://mi-sitio.com',
        icon: 'Globe'
      },
      {
        name: 'linkedin',
        label: 'LinkedIn',
        type: 'url',
        placeholder: 'https://linkedin.com/in/usuario',
        icon: 'Linkedin'
      },
      {
        name: 'twitter',
        label: 'Twitter',
        type: 'url',
        placeholder: 'https://twitter.com/usuario',
        icon: 'Twitter'
      }
    ]
  }
};

export const WELCOME_BENEFITS = [
  'Personaliza tu experiencia',
  'Conecta con otros profesores',
  'Accede a funciones exclusivas'
];
