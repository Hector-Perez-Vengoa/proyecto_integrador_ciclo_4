// src/constants/profileIcons.js
// Iconos SVG inline para el perfil - solución robusta para evitar cuadrados blancos

export const PROFILE_ICONS = {
  User: {
    viewBox: "0 0 24 24",
    path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
  },
  Mail: {
    viewBox: "0 0 24 24", 
    path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"
  },
  Phone: {
    viewBox: "0 0 24 24",
    path: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
  },
  Calendar: {
    viewBox: "0 0 24 24",
    path: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  },
  FileText: {
    viewBox: "0 0 24 24",
    path: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"
  },
  Building: {
    viewBox: "0 0 24 24",
    path: "M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z M6 12h4 M6 16h4 M6 8h4 M14 12h4 M14 16h4 M14 8h4"
  },
  BookOpen: {
    viewBox: "0 0 24 24",
    path: "M12 7v14 M3 18a1 1 0 01-1-1V4a1 1 0 011-1h5a4 4 0 014 4v12a3 3 0 00-3-3H3z M21 18a1 1 0 001-1V4a1 1 0 00-1-1h-5a4 4 0 00-4 4v12a3 3 0 013-3h6z"
  },
  Book: {
    viewBox: "0 0 24 24",
    path: "M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
  },
  GraduationCap: {
    viewBox: "0 0 24 24",
    path: "M22 10v6M6 12l6-3 6 3-6 3z M6 12v7c0 1-1 2-6 2s-6-1-6-2v-7"
  }
};

// Componente de icono SVG reutilizable
export const ProfileIcon = ({ iconName, className = "w-4 h-4", ...props }) => {
  const icon = PROFILE_ICONS[iconName];
  
  if (!icon) {
    // Fallback a icono de usuario si no se encuentra el icono
    const fallbackIcon = PROFILE_ICONS.User;
    return (
      <svg 
        className={className} 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        viewBox={fallbackIcon.viewBox}
        {...props}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={fallbackIcon.path} />
      </svg>
    );
  }
  
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      viewBox={icon.viewBox}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
    </svg>
  );
};
