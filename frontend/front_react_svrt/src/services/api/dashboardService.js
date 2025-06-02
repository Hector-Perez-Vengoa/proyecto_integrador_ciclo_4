// src/services/api/dashboardService.js
import api from './authService';

export const dashboardService = {
  // Obtener datos del dashboard
  getDashboardData: async () => {
    try {
      return {
        reservations: [],
        availableRooms: [
          {
            id: 1,
            name: 'Aula 101',
            capacity: 30,
            equipment: ['Proyector', 'Audio']
          },
          {
            id: 2,
            name: 'Aula 102',
            capacity: 25,
            equipment: ['Proyector', 'Pizarra Digital']
          }
        ],
        stats: {
          totalReservations: 0,
          activeReservations: 0,
          favoriteRooms: []
        }
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
};