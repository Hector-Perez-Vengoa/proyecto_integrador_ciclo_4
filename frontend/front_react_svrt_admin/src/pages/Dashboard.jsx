

import DashboardCard from '../componets/DashboardCard';
import Sidebar from '../componets/Sidebar';
import PanelUsuarios from '../componets/PanelUsuarios';
import PanelAulas from '../componets/PanelAulas';
import PanelReservas from '../componets/PanelReservas';
import { useState } from 'react';

const stats = [
  {
    title: 'Usuarios',
    value: 120,
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    color: 'bg-blue-500'
  },
  {
    title: 'Reservas',
    value: 340,
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    color: 'bg-green-500'
  },
  {
    title: 'Aulas',
    value: 16,
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 001 1h3m-7 4v4m0 0H7a2 2 0 01-2-2v-5a2 2 0 012-2h10a2 2 0 012 2v5a2 2 0 01-2 2h-5z" /></svg>,
    color: 'bg-yellow-500'
  },
  {
    title: 'Historial',
    value: 87,
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'bg-purple-500'
  },
];


const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState(0);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={activeMenu} onMenuClick={setActiveMenu} />
      <main className="flex-1 p-8">
        {activeMenu === 0 && (
          <>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, idx) => (
                <DashboardCard key={stat.title} {...stat} />
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-6 mt-6 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Bienvenido al panel de administración</h3>
              <p className="text-gray-500">Aquí puedes ver un resumen de la actividad y gestionar los recursos del sistema.</p>
            </div>
          </>
        )}
        {activeMenu === 1 && <PanelUsuarios />}
        {activeMenu === 2 && <PanelReservas />}
        {activeMenu === 3 && <PanelAulas />}
        {/* Puedes agregar más paneles según el menú */}
      </main>
    </div>
  );
};

export default Dashboard;
