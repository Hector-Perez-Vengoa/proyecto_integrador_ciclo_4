// src/components/dashboard/MainContent.jsx
import { getUserFullName } from '../../utils/dashboardUtils';
import PasswordSetupForm from './PasswordSetupForm';

const MainContent = ({ user, needsPassword, onPasswordSetupComplete }) => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto animate-fadeInUp">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-4xl mx-auto text-center transition-all hover:shadow-blue-200/50 cursor-pointer animate-fadeInUp">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 animate-pulse">
          ¡Bienvenido, {getUserFullName(user)}!
        </h1>
        
        {needsPassword ? (
          <PasswordSetupForm onSuccess={onPasswordSetupComplete} />
        ) : (
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
        )}
      </div>
    </main>
  );
};

export default MainContent;