
import React, { useEffect, useState } from 'react';
import userIcon from '../assets/icons_user.png';
const Perfil = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [openMenus, setOpenMenus] = useState({ reservas: true, reglamento: false });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    // Intentar obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser({
          name: parsed.name || parsed.username || 'Usuario',
          email: parsed.email || '',
        });
      } catch {
        setUser({ name: 'Usuario', email: '' });
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra lateral retráctil */}
      <aside
        className={`
          ${sidebarOpen ? 'w-72' : 'w-16'}
          bg-white shadow-lg flex flex-col items-start py-6 px-0 border-r border-gray-200 min-h-screen
          transition-all duration-500 ease-in-out
          z-30
        `}
        style={{ position: 'relative' }}
      >
        {/* Botón hamburguesa */}
        <button
          onClick={handleSidebarToggle}
          className="absolute top-4 right-[-18px] z-40 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
          aria-label={sidebarOpen ? 'Contraer barra lateral' : 'Expandir barra lateral'}
        >
          <svg className={`w-6 h-6 transform transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Logo y nombre */}
        <div className={`flex items-center gap-2 px-6 mb-6 w-full transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ minHeight: 48 }}>
          <img src="https://academico-cloud.tecsup.edu.pe/pcc/assets/layout/images/logo-2024.svg" alt="Tecsup" className="h-10" />
        </div>
        {/* Usuario */}
        <div className={`flex items-center gap-3 px-6 mb-2 w-full group relative transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> 
          <div className="w-12 h-12 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-green-700 transition-all duration-200">
            {user.name ? user.name[0] : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">{user.name}</span>
            <span className="text-xs text-gray-500 leading-tight group-hover:text-blue-500 transition-colors">{user.email}</span>
          </div>
        </div>
        {/* Menú simulado */}
        <nav className={`flex-1 w-full mt-4 transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ul className="space-y-1 px-2">
            <li>
              <button
                className={`flex items-center justify-between w-full bg-blue-50 text-blue-700 rounded px-3 py-2 font-semibold cursor-pointer hover:bg-blue-100 transition-all group focus:outline-none`}
                onClick={() => toggleMenu('reservas')}
                aria-expanded={openMenus.reservas}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Reservas</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${openMenus.reservas ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openMenus.reservas && sidebarOpen && (
                <ul className="space-y-1 mt-1 animate-fadeIn">
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Aulas virtuales</div></li>
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Mis Reservas</div></li>
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Calendario de reservas</div></li>
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Historial de Reservas</div></li>
                </ul>
              )}
            </li>
            <li>
              <button
                className={`flex items-center justify-between w-full bg-blue-50 text-blue-700 rounded px-3 py-2 font-semibold cursor-pointer hover:bg-blue-100 transition-all group focus:outline-none`}
                onClick={() => toggleMenu('reglamento')}
                aria-expanded={openMenus.reglamento}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Reglamento</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${openMenus.reglamento ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openMenus.reglamento && sidebarOpen && (
                <ul className="space-y-1 mt-1 animate-fadeIn">
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Uso de las aulas virtuales</div></li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      {/* Contenido principal con animación */}
      <main className="flex-1 flex flex-col items-center justify-center animate-fadeInUp">
        <div className="bg-white rounded-xl shadow-lg p-10 min-w-[300px] max-w-xl w-full mx-4 text-center transition-all hover:shadow-blue-200/50 hover:scale-105 cursor-pointer animate-fadeInUp">
          <h1 className="text-3xl font-bold text-blue-700 mb-4 animate-pulse">¡Bienvenido, {user.name || 'Usuario'}!</h1>
        </div>
      </main>
    </div>
  );
};

export default Perfil;
