// src/components/dashboard/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import UserProfile from './UserProfile';

const Sidebar = ({ user, onLogout }) => {
  const { sidebarOpen, openMenus, toggleSidebar, toggleMenu } = useSidebar();  const MenuItem = ({ title, icon, isOpen, onToggle, children }) => (
    <li>
      <button
        className="flex items-center justify-between w-full bg-tecsup-primary/10 text-tecsup-primary rounded-lg px-3 py-2.5 font-semibold cursor-pointer hover:bg-tecsup-primary/20 transition-all group focus:outline-none sidebar-nav-item tab-transition action-button-fluid"
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 icon-hover-effect" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
          <span>{title}</span>
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ultra-smooth icon-hover-effect ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul className="space-y-1 mt-1 elegant-slide-up">
          {children}
        </ul>
      )}
    </li>
  );  const SubMenuItem = ({ title, to, icon }) => (
    <li>
      <NavLink 
        to={to}
        className={({ isActive }) => 
          `ml-7 px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2 sidebar-nav-item tab-transition ${
            isActive 
              ? 'bg-tecsup-primary/20 text-tecsup-primary font-semibold border-l-2 border-tecsup-primary active' 
              : 'text-tecsup-primary/80 hover:bg-tecsup-primary/10 hover:text-tecsup-primary'
          }`
        }
      >
        {icon && (
          <svg className="w-4 h-4 icon-hover-effect" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        )}
        {title}
      </NavLink>
    </li>
  );
  return (
    <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-white shadow-lg flex flex-col py-6 px-0 border-r border-gray-200 h-full transition-all duration-500 ease-in-out z-30 overflow-y-auto`}>      {/* Botón hamburguesa */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-2 z-40 bg-tecsup-primary text-white rounded-full p-2 shadow-tecsup hover:bg-tecsup-primary/90 transition-all duration-300 focus:outline-none"
      >
        <svg className={`w-4 h-4 transform transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Logo */}
      <div className={`flex items-center gap-2 px-6 mb-6 w-full transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <img 
          src="https://academico-cloud.tecsup.edu.pe/pcc/assets/layout/images/logo-2024.svg" 
          alt="Tecsup" 
          className="h-10" 
        />
      </div>
      
      {/* Usuario */}
      <div className={`transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <UserProfile user={user} onLogout={onLogout} />
      </div>
        {/* Menú */}
      <nav className={`flex-1 w-full mt-4 transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>        <ul className="space-y-1 px-2">
          {/* Perfil */}          <li>
            <NavLink 
              to="/home/perfil"
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all sidebar-nav-item tab-transition ${
                  isActive 
                    ? 'bg-tecsup-primary/20 text-tecsup-primary font-semibold border-l-2 border-tecsup-primary active' 
                    : 'text-tecsup-primary/80 hover:bg-tecsup-primary/10 hover:text-tecsup-primary'
                }`
              }
            >
              <svg className="w-4 h-4 icon-hover-effect" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Mi Perfil</span>
            </NavLink>
          </li>
          <MenuItem
            title="Reservas"
            icon="M5 13l4 4L19 7"
            isOpen={openMenus.reservas}
            onToggle={() => toggleMenu('reservas')}
          >
            <SubMenuItem 
              title="Aulas virtuales" 
              to="/home/aulas"
              icon="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
            <SubMenuItem 
              title="Mis Reservas" 
              to="/home/mis-reservas"
              icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />            
            <SubMenuItem 
              title="Calendario de reservas" 
              to="/home/calendario"
              icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </MenuItem>            
          <MenuItem
            title="Reglamento"
            icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            isOpen={openMenus.reglamento}
            onToggle={() => toggleMenu('reglamento')}
          >
            <SubMenuItem 
              title="Uso de las aulas virtuales" 
              to="/home/reglamento"
              icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </MenuItem>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;