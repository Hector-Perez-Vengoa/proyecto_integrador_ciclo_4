// Dashboard principal del panel de administración
import { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import Sidebar from '../components/Sidebar';
import ProfesoresManager from '../components/entities/ProfesoresManager';
import AulasVirtualesManager from '../components/entities/AulasVirtualesManager';
import DepartamentosManager from '../components/entities/DepartamentosManager';
import CarrerasManager from '../components/entities/CarrerasManager';
import CursosManager from '../components/entities/CursosManager';
import ReservasManager from '../components/entities/ReservasManager';
import EstadisticasReservas from '../components/EstadisticasReservas';
import EstadisticasAulas from '../components/EstadisticasAulas';
import { 
  useProfesores, 
  useAulasVirtuales, 
  useReservas 
} from '../hooks/useEntities';

// Iconos SVG para las tarjetas del dashboard
const icons = [
  <svg key="users-icon" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>,
  <svg key="reservas-icon" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  <svg key="aulas-icon" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
];

const colors = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-green-500 to-green-600', 
  'bg-gradient-to-br from-purple-500 to-purple-600'
];

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Cerrar sidebar por defecto en móvil
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  // Usar los hooks personalizados para obtener datos de las APIs
  const { data: profesores } = useProfesores();
  const { data: aulasVirtuales } = useAulasVirtuales();
  const { data: reservas } = useReservas();
  
  // Estado para las tarjetas resumen
  const [stats, setStats] = useState([
    { 
      title: 'Profesores', 
      value: 0, 
      icon: icons[0], 
      color: colors[0]
    },
    { 
      title: 'Reservas Activas', 
      value: 0, 
      icon: icons[1], 
      color: colors[1]
    },
    { 
      title: 'Aulas Disponibles', 
      value: 0, 
      icon: icons[2], 
      color: colors[2]
    },
  ]);

  // Actualizar estadísticas cuando cambien los datos
  useEffect(() => {
    if (reservas.length > 0 && aulasVirtuales.length > 0) {
      const reservasActivas = reservas.filter(r => r.estado === 'reservado' || r.estado === 'activa').length;
      const aulasDisponibles = aulasVirtuales.filter(a => a.estado === 'disponible').length;
      
      // Filtrar profesores excluyendo al admin (is_superuser = true o rol admin)
      const profesoresNoAdmin = profesores.filter(p => 
        !p.is_superuser && 
        p.rol !== 'admin' && 
        p.username !== 'admin'
      );
      
      setStats(prevStats => [
        { ...prevStats[0], value: profesoresNoAdmin.length },
        { ...prevStats[1], value: reservasActivas },
        { ...prevStats[2], value: aulasDisponibles },
      ]);
    }
  }, [profesores, aulasVirtuales, reservas]);

  // Función para renderizar el contenido basado en el menú activo
  const renderContent = () => {
    switch (activeMenu) {
      case 0:
        return (
          <div className="animate-fadeIn">
            {/* Header del Dashboard */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Dashboard</h1>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-500">
                    Última actualización: {new Date().toLocaleTimeString('es-ES')}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg">Bienvenido al panel de administración del sistema educativo</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <div key={stat.title} onClick={() => {
                  // Mapear índices de tarjetas a índices de menú del sidebar
                  const menuMap = {
                    0: 1, // Profesores -> índice 1 en sidebar
                    1: 3, // Reservas Activas -> índice 3 en sidebar
                    2: 2  // Aulas Disponibles -> índice 2 en sidebar
                  };
                  setActiveMenu(menuMap[idx]);
                }} className="cursor-pointer">
                  <DashboardCard {...stat} />
                </div>
              ))}
            </div>

            {/* Gráficas y estadísticas detalladas */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <EstadisticasReservas reservas={reservas} />
              </div>
              <div className="xl:col-span-1">
                <EstadisticasAulas aulas={aulasVirtuales} />
              </div>
            </div>
          </div>
        );
      case 1:
        return <ProfesoresManager />;
      case 2:
        return <AulasVirtualesManager />;
      case 3:
        return <ReservasManager />;
      case 4:
        return <DepartamentosManager />;
      case 5:
        return <CarrerasManager />;
      case 6:
        return <CursosManager />;
      default:
        return (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-custom p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Módulo de Reportes</h2>
              <p className="text-gray-600 mb-6">Esta sección estará disponible próximamente</p>
              <button className="btn-primary">
                Solicitar Acceso Anticipado
              </button>
            </div>
          </div>
        );
    }
  };

  // Calcular clases del contenido principal
  const getMainMarginClass = () => {
    if (isMobile) return 'ml-0';
    return sidebarOpen ? 'ml-64' : 'ml-20';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        active={activeMenu} 
        onMenuClick={setActiveMenu} 
        onSidebarToggle={setSidebarOpen}
      />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${getMainMarginClass()} p-6 lg:p-8`}>
        {/* Botón de menú para móvil */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mb-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow md:hidden"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
