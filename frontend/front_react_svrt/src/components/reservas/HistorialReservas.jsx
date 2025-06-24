// src/components/reservas/HistorialReservas.jsx
import React, { useState } from 'react';
import { useReservasHistorial } from '../../hooks/useReservasHistorial';
import ReservaCard from './ReservaCard';
import ReservaCancelModal from './ReservaCancelModal';
import AlertModal from '../ui/AlertModal';

const HistorialReservas = () => {
  const {
    reservasProximas,
    reservasHistorial,
    loading,
    error,
    activeTab,
    cambiarTab,
    cancelarReserva,
    recargarReservas
  } = useReservasHistorial();
  const [modalCancelacion, setModalCancelacion] = React.useState({
    isOpen: false,
    reservaId: null
  });

  // Estado para el modal de alertas
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  // Función para mostrar alertas
  const showAlert = (message, title = 'Error', type = 'error') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Función para cerrar el modal de alerta
  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  // Abrir modal de cancelación
  const handleOpenCancelModal = (reservaId) => {
    setModalCancelacion({
      isOpen: true,
      reservaId
    });
  };

  // Cerrar modal de cancelación
  const handleCloseCancelModal = () => {
    setModalCancelacion({
      isOpen: false,
      reservaId: null
    });
  };
  // Confirmar cancelación
  const handleConfirmCancel = async (motivo) => {
    if (!modalCancelacion.reservaId) return;
    
    const resultado = await cancelarReserva(modalCancelacion.reservaId, motivo);
    
    if (resultado.success) {
      // La lista se actualiza automáticamente con recargarReservas en cancelarReserva
      handleCloseCancelModal();
    } else {
      // Mostrar error con modal personalizado
      showAlert(resultado.message || 'Error al cancelar la reserva', 'Error al cancelar');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 elegant-fade-in">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => cambiarTab('proximas')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'proximas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors duration-200`}
          >
            Próximas Reservas
          </button>
          <button
            onClick={() => cambiarTab('historial')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'historial'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } transition-colors duration-200`}
          >
            Historial
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={recargarReservas}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div>
          {activeTab === 'proximas' && (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Próximas Reservas</h3>
              {reservasProximas.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No tienes reservas programadas próximamente
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reservasProximas.map(reserva => (
                    <ReservaCard 
                      key={reserva.id} 
                      reserva={reserva} 
                      onCancelar={handleOpenCancelModal}
                      esFutura={true}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'historial' && (
            <>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Historial de Reservas</h3>
              {reservasHistorial.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No tienes historial de reservas
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reservasHistorial.map(reserva => (
                    <ReservaCard 
                      key={reserva.id} 
                      reserva={reserva} 
                      esFutura={false}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}      {/* Modal de cancelación */}
      <ReservaCancelModal 
        isOpen={modalCancelacion.isOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />

      {/* Modal de alertas */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};

export default HistorialReservas;
