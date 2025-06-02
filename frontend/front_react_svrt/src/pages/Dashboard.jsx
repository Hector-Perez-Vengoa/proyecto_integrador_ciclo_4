// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../logic/useAuth';
import { useDashboard } from '../logic/useDashboard';
import { showToast } from '../utils/authUtils';
import Sidebar from '../components/dashboard/Sidebar';
import MainContent from '../components/dashboard/MainContent';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = ({ initialView = 'dashboard', editing = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    dashboardData, 
    loading, 
    needsPassword, 
    onPasswordSetupComplete 
  } = useDashboard();
  
  const getCurrentView = () => {
    if (location.pathname === '/perfil' || location.pathname === '/perfil/edit') return 'profile';
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState(getCurrentView());

  useEffect(() => {
    setCurrentView(getCurrentView());
  }, [location.pathname]);

  const handleLogout = () => {
    showToast('Sesión cerrada exitosamente');
    logout();
  };

  const handleViewChange = (view) => {
    if (view === 'profile') {
      navigate('/perfil');
    } else {
      navigate('/home');
    }
    setCurrentView(view);
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
        currentView={currentView}
        onViewChange={handleViewChange}
      />      <MainContent 
        user={user} 
        needsPassword={needsPassword}
        onPasswordSetupComplete={onPasswordSetupComplete}
        currentView={currentView}
        editing={editing}
      />
    </div>
  );
};

export default Dashboard;