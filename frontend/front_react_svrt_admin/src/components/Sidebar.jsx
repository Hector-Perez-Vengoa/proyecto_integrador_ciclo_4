import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v4M16 5v4" />
      </svg>
    ),
    badge: null
  },
  { 
    label: "Profesores", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    badge: null
  },
  { 
    label: "Aulas Virtuales", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    badge: null
  },
  { 
    label: "Reservas", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    badge: "5"
  },
  { 
    label: "Departamentos", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    badge: null
  },
  { 
    label: "Carreras", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    badge: null
  },
  { 
    label: "Cursos", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    badge: null
  },
];

// eslint-disable-next-line react/prop-types
const Sidebar = ({ onMenuClick, active, onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Función para manejar logout
  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await logout();
    }
  };
  
  // Detectar si es móvil
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const handleToggle = () => {
    const newState = !open;
    setOpen(newState);
    if (onSidebarToggle) {
      onSidebarToggle(newState);
    }
  };
  
  const handleOverlayClick = () => {
    if (isMobile && open) {
      handleToggle();
    }
  };

  // Calcular clases CSS del sidebar
  const getSidebarClasses = () => {
    if (isMobile) {
      const mobileClasses = open ? 'open' : '';
      return `sidebar-mobile ${mobileClasses} w-64`;
    }
    return open ? 'w-64' : 'w-20';
  };

  const sidebarClasses = getSidebarClasses();
  
  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && (
        <button
          className={`sidebar-overlay ${open ? 'active' : ''}`}
          onClick={handleOverlayClick}
          onKeyDown={(e) => e.key === 'Escape' && handleOverlayClick()}
          aria-label="Cerrar menú"
          style={{ background: 'none', border: 'none', padding: 0 }}
        />
      )}
      
      <aside className={`sidebar-fixed bg-white border-r border-gray-200 shadow-custom flex flex-col transition-all duration-300 ${sidebarClasses}`}>
        {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className={`flex items-center transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EduAdmin
          </span>
        </div>
        
        <button 
          onClick={handleToggle} 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg 
            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${open ? 'rotate-0' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, idx) => (
            <li key={item.label}>
              <button
                className={`flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  active === idx 
                    ? 'bg-gradient-primary/40 text-gray-700 shadow-lg backdrop-blur-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
                onClick={() => onMenuClick?.(idx)}
              >
                <span className={`${active === idx ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  {item.icon}
                </span>
                
                <span className={`ml-3 transition-all duration-300 ${open ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                  {item.label}
                </span>
                
                {/* Badge para notificaciones */}
                {item.badge && open && (
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                    active === idx 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-100">
        <div className={`flex items-center ${open ? 'justify-between' : 'justify-center'}`}>
          {open && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.username || 'Usuario'
                  }
                  {user?.is_superuser && (
                    <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      Super Admin
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email || 'admin@sistema.com'}
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group"
            title="Cerrar sesión"
          >
            <svg className="w-5 h-5 text-gray-500 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
