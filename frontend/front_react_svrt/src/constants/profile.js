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
      },      {
        name: 'departamento',
        label: 'Departamento',
        type: 'text',
        icon: 'Building',
        required: true,
        readOnly: true
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
        required: true,
        rows: 4
      }
    ]
  },  ACADEMIC: {
    title: 'Información Académica',
    icon: 'GraduationCap',
    gradient: 'from-tecsup-secondary to-tecsup-primary',
    fields: [      {
        name: 'departamentoId',
        label: 'Departamento',
        type: 'select',
        placeholder: 'Selecciona tu departamento',
        icon: 'Building',
        required: true,
        options: [] // Se llena dinámicamente
      },
      {
        name: 'carreraIds',
        label: 'Carreras',
        type: 'multiselect',
        placeholder: 'Selecciona las carreras que enseñas',
        icon: 'BookOpen',
        required: false,
        options: [] // Se llena dinámicamente
      },

      {
        name: 'cursoIds',
        label: 'Cursos',
        type: 'multiselect',
        placeholder: 'Selecciona los cursos que enseñas',
        icon: 'Book',
        required: false,
        options: [] // Se llena dinámicamente
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
