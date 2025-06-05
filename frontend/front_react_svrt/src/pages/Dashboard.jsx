// src/pages/Dashboard.jsx
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { showToast } from '../utils/authUtils';
import Sidebar from '../components/dashboard/Sidebar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PasswordSetupForm from '../components/dashboard/PasswordSetupForm';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    dashboardData, 
    loading, 
    needsPassword, 
    onPasswordSetupComplete 
  } = useDashboard();

  const handleLogout = () => {
    showToast('Sesión cerrada exitosamente');
    logout();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex bg-gray-100 overflow-hidden">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
      />      
      <main className="flex-1 flex flex-col p-4 overflow-y-auto">
        {needsPassword ? (
          <PasswordSetupForm onSuccess={onPasswordSetupComplete} />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default Dashboard;