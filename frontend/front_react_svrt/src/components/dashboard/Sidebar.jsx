// src/components/dashboard/Sidebar.jsx
import { useSidebar } from '../../logic/useSidebar';
import UserProfile from './UserProfile';

const Sidebar = ({ user, onLogout }) => {
  const { sidebarOpen, openMenus, toggleSidebar, toggleMenu } = useSidebar();

  const MenuItem = ({ title, icon, isOpen, onToggle, children }) => (
    <li>
      <button
        className="flex items-center justify-between w-full bg-blue-50 text-blue-700 rounded px-3 py-2 font-semibold cursor-pointer hover:bg-blue-100 transition-all group focus:outline-none"
        onClick={onToggle}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
          <span>{title}</span>
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul className="space-y-1 mt-1 animate-fadeIn">
          {children}
        </ul>
      )}
    </li>
  );

  const SubMenuItem = ({ title, onClick }) => (
    <li>
      <div 
        className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all"
        onClick={onClick}
      >
        {title}
      </div>
    </li>
  );
  return (
    <aside className={`${sidebarOpen ? 'w-72' : 'w-16'} bg-white shadow-lg flex flex-col py-6 px-0 border-r border-gray-200 h-full transition-all duration-500 ease-in-out z-30 overflow-y-auto`}>      {/* Botón hamburguesa */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-2 z-40 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
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
      <nav className={`flex-1 w-full mt-4 transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ul className="space-y-1 px-2">
          <MenuItem
            title="Reservas"
            icon="M5 13l4 4L19 7"
            isOpen={openMenus.reservas}
            onToggle={() => toggleMenu('reservas')}
          >
            <SubMenuItem title="Aulas virtuales" />
            <SubMenuItem title="Mis Reservas" />
            <SubMenuItem title="Calendario de reservas" />
            <SubMenuItem title="Historial de Reservas" />
          </MenuItem>
          
          <MenuItem
            title="Reglamento"
            icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            isOpen={openMenus.reglamento}
            onToggle={() => toggleMenu('reglamento')}
          >
            <SubMenuItem title="Uso de las aulas virtuales" />
          </MenuItem>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;