// src/constants/profile.js

export const PROFILE_SECTIONS = {
  PERSONAL: {
    title: 'Información Personal',
    icon: 'User',
    gradient: 'from-tecsup-primary to-tecsup-secondary',
    fields: [      {
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
      },      {
        name: 'biografia',
        label: 'Biografía',
        type: 'textarea',
        placeholder: 'Cuéntanos sobre tu experiencia profesional y académica...',
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
  'Personaliza tu experiencia académica',
  'Gestiona tu perfil profesional',
  'Accede a herramientas del sistema'
];

export const PROFILE_TABS = [
  { id: 'basic', label: 'Información Básica', icon: 'User' },
  { id: 'academic', label: 'Información Académica', icon: 'GraduationCap' }
];
