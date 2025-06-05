// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { dashboardService } from '../services';
import { checkPasswordRequired } from '../utils/dashboardUtils';
import { showToast } from '../utils/authUtils';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    reservations: [],
    availableRooms: [],
    stats: {
      totalReservations: 0,
      activeReservations: 0,
      favoriteRooms: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(false);

  useEffect(() => {
    loadDashboardData();
    checkPasswordStatus();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular carga de datos - reemplazar con llamadas reales
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Error al cargar el dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStatus = () => {
    setNeedsPassword(checkPasswordRequired());
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const onPasswordSetupComplete = () => {
    setNeedsPassword(false);
    refreshData();
  };

  return {
    dashboardData,
    loading,
    needsPassword,
    refreshData,
    onPasswordSetupComplete
  };
};