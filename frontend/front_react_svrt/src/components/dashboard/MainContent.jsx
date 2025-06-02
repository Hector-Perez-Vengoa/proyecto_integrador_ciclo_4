// src/components/dashboard/MainContent.jsx
import { getUserFullName } from '../../utils/dashboardUtils';
import PasswordSetupForm from './PasswordSetupForm';
import { ProfileView } from '../profile';

const MainContent = ({ user, needsPassword, onPasswordSetupComplete, currentView = 'dashboard', editing = false }) => {
  
  const renderContent = () => {
    if (needsPassword) {
      return <PasswordSetupForm onSuccess={onPasswordSetupComplete} />;
    }

    switch (currentView) {
      case 'profile':
        return <ProfileView autoEdit={editing} />;
      case 'aulas':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Aulas Virtuales</h2>
            <p className="text-gray-600">Próximamente: Vista de aulas virtuales disponibles</p>
          </div>
        );
      case 'mis-reservas':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Mis Reservas</h2>
            <p className="text-gray-600">Próximamente: Vista de tus reservas actuales</p>
          </div>
        );
      case 'calendario':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Calendario de Reservas</h2>
            <p className="text-gray-600">Próximamente: Calendario interactivo de reservas</p>
          </div>
        );
      case 'historial':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Historial de Reservas</h2>
            <p className="text-gray-600">Próximamente: Historial completo de tus reservas</p>
          </div>
        );
      case 'reglamento':
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Reglamento</h2>
            <p className="text-gray-600">Próximamente: Reglamento de uso de aulas virtuales</p>
          </div>
        );
      default: // dashboard
        return (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm sm:text-base">
              Sistema de Reserva de Aulas Virtuales de Tecsup
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-700 text-sm sm:text-base">Reservas Activas</h3>
                <p className="text-xl sm:text-2xl font-bold text-blue-800">3</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-700 text-sm sm:text-base">Total Reservas</h3>
                <p className="text-xl sm:text-2xl font-bold text-green-800">24</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="flex-1 flex flex-col p-4 overflow-y-auto">
      {currentView === 'dashboard' && (
        <div className="flex items-center justify-center flex-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-4xl mx-auto text-center transition-all hover:shadow-blue-200/50 cursor-pointer animate-fadeInUp">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 animate-pulse">
              ¡Bienvenido, {getUserFullName(user)}!
            </h1>
            {renderContent()}
          </div>
        </div>
      )}
      
      {currentView !== 'dashboard' && (
        <div className="flex-1">
          {renderContent()}
        </div>
      )}
    </main>
  );
};

export default MainContent;