// src/pages/Dashboard.jsx
import { useAuth } from '../logic/useAuth';
import { useDashboard } from '../logic/useDashboard';
import { showToast } from '../utils/authUtils';
import Sidebar from '../components/dashboard/Sidebar';
import MainContent from '../components/dashboard/MainContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { 
    dashboardData, 
    loading, 
    needsPassword, 
    onPasswordSetupComplete 
  } = useDashboard();  const handleLogout = () => {
    showToast('Sesión cerrada exitosamente');
    // Logout inmediato sin setTimeout para evitar demoras
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
      <Sidebar user={user} onLogout={handleLogout} />
      <MainContent 
        user={user} 
        needsPassword={needsPassword}
        onPasswordSetupComplete={onPasswordSetupComplete}
      />
    </div>
  );
};

export default Dashboard;