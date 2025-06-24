// Dashboard principal del panel de administración
// Muestra tarjetas resumen, gráficas y paneles de gestión
import DashboardCard from '../componets/DashboardCard';
import Sidebar from '../componets/Sidebar';
import PanelUsuarios from '../componets/PanelUsuarios';
import PanelAulas from '../componets/PanelAulas';
import PanelReservas from '../componets/PanelReservas';
import EstadisticasReservas from '../componets/EstadisticasReservas';
import EstadisticasAulas from '../componets/EstadisticasAulas';
import { useState, useEffect } from 'react';

// Iconos SVG para las tarjetas del dashboard
const icons = [
  // Usuarios
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  // Reservas
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  // Aulas
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 001 1h3m-7 4v4m0 0H7a2 2 0 01-2-2v-5a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2h-5z" /></svg>,
  // Historial
  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
];

const colors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500'
];

const Dashboard = () => {
  // Estado para el menú lateral activo
  const [activeMenu, setActiveMenu] = useState(0);
  // Estado para las tarjetas resumen
  const [stats, setStats] = useState([
    { title: 'Usuarios', value: 0, icon: icons[0], color: colors[0] },
    { title: 'Reservas', value: 0, icon: icons[1], color: colors[1] },
    { title: 'Aulas', value: 0, icon: icons[2], color: colors[2] },
    { title: 'Historial', value: 0, icon: icons[3], color: colors[3] },
  ]);
  // Estado para datos de reservas y aulas
  const [reservas, setReservas] = useState([]);
  const [aulas, setAulas] = useState([]);

  // Carga datos desde el backend al montar el componente
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/profesores/').then(r => r.json()),
      fetch('http://localhost:8000/api/reservas/').then(r => r.json()),
      fetch('http://localhost:8000/api/aula-virtual/').then(r => r.json())
    ]).then(([usuarios, reservasData, aulasData]) => {
      setStats([
        { ...stats[0], value: usuarios.length },
        { ...stats[1], value: reservasData.length },
        { ...stats[2], value: aulasData.length },
        { ...stats[3], value: reservasData.filter(r => r.estado !== 'reservado' && r.estado !== 'disponible').length },
      ]);
      setReservas(reservasData);
      setAulas(aulasData);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menú lateral */}
      <Sidebar active={activeMenu} onMenuClick={setActiveMenu} />
      <main className="flex-1 p-8">
        {activeMenu === 0 && (
          <>
            {/* Título y bienvenida */}
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Dashboard</h2>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Bienvenido al panel de administración</h3>
            <p className="text-gray-500 mb-4">Aquí puedes ver un resumen de la actividad y gestionar los recursos del sistema.</p>
            {/* Tarjetas resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <DashboardCard key={stat.title} {...stat} />
              ))}
            </div>
            {/* Gráficas: Reservas (2/3) y Aulas (1/3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="md:col-span-2">
                <EstadisticasReservas reservas={reservas} />
              </div>
              <div className="md:col-span-1">
                <EstadisticasAulas aulas={aulas} />
              </div>
            </div>
          </>
        )}
        {/* Paneles de gestión */}
        {activeMenu === 1 && <PanelUsuarios />}
        {activeMenu === 2 && <PanelReservas />}
        {activeMenu === 3 && <PanelAulas />}
      </main>
    </div>
  );
};

export default Dashboard;
