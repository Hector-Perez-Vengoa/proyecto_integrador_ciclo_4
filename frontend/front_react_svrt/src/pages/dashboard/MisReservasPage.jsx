// src/pages/dashboard/MisReservasPage.jsx
import React from 'react';
import HistorialReservas from '../../components/reservas/HistorialReservas';

const MisReservasPage = () => {
  return (
    <div className="flex-1 page-transition-elegant p-6">
      <div className="py-4 mb-6 elegant-fade-in">
        <h2 className="text-2xl font-bold text-gray-700 breathe-gentle">Mis Reservas</h2>
        <p className="text-gray-600 mt-2">
          Visualiza tus próximas reservas y el historial de reservas pasadas
        </p>
      </div>
      
      <HistorialReservas />
    </div>
  );
};

export default MisReservasPage;
