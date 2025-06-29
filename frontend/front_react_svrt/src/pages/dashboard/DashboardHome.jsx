// src/pages/dashboard/DashboardHome.jsx
import { useAuth } from '../../hooks/useAuth';
import { getUserFullName } from '../../utils/dashboardUtils';

const DashboardHome = () => {
  const { user } = useAuth();  return (
    <div className="flex items-center justify-center flex-1 page-transition-elegant">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-4xl mx-auto text-center hover-lift-smooth ultra-smooth elegant-fade-in glass-effect-elegant">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 breathe-gentle">
          ¡Bienvenido, {getUserFullName(user)}!
        </h1>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm sm:text-base silk-transition">
            Sistema de Reserva de Aulas Virtuales de Tecsup
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg hover-scale-elegant ultra-smooth">
              <h3 className="font-semibold text-blue-700 text-sm sm:text-base">Reservas Activas</h3>
              <p className="text-xl sm:text-2xl font-bold text-blue-800 smooth-scale">3</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg hover-scale-elegant ultra-smooth">
              <h3 className="font-semibold text-green-700 text-sm sm:text-base">Total Reservas</h3>
              <p className="text-xl sm:text-2xl font-bold text-green-800 smooth-scale">24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
