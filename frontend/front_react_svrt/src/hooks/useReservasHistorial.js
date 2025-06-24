// src/hooks/useReservasHistorial.js
import { useState, useEffect, useMemo } from 'react';
import { reservaService } from '../services';

export const useReservasHistorial = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('proximas'); // 'proximas' o 'historial'

  // Cargar reservas
  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await reservaService.obtenerReservasProfesor();
      
      if (response.success) {
        setReservas(response.data);
      } else {
        setError(response.error || 'Error al cargar las reservas');
      }
    } catch (err) {
      setError('Error de conexión al cargar las reservas');
      console.error('Error al cargar reservas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar reservas al inicializar
  useEffect(() => {
    cargarReservas();
  }, []);

  // Filtrar reservas por fecha
  const reservasFiltradas = useMemo(() => {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Normalizar a inicio del día
    
    const proximas = reservas.filter(reserva => {
      const fechaReserva = new Date(reserva.fechaReserva);
      return fechaReserva >= fechaActual;
    }).sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva)); // Ordenar por fecha ascendente

    return {
      proximas,
      historial: reservas.filter(reserva => {
        const fechaReserva = new Date(reserva.fechaReserva);
        return fechaReserva < fechaActual;
      }).sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva)) // Ordenar por fecha descendente (más reciente primero)
    };
  }, [reservas]);

  // Cancelar una reserva
  const cancelarReserva = async (reservaId, motivo) => {
    try {
      setLoading(true);
      const response = await reservaService.cancelarReserva(reservaId, motivo);
      
      if (response.success) {
        // Actualizar la lista de reservas
        await cargarReservas();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.error };
      }
    } catch (err) {
      console.error('Error al cancelar reserva:', err);
      return { success: false, message: 'Error de conexión al cancelar la reserva' };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar tab activo
  const cambiarTab = (tab) => {
    setActiveTab(tab);
  };

  return {
    reservasProximas: reservasFiltradas.proximas,
    reservasHistorial: reservasFiltradas.historial,
    loading,
    error,
    activeTab,
    cambiarTab,
    cancelarReserva,
    recargarReservas: cargarReservas
  };
};
