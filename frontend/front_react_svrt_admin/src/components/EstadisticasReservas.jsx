// Gráfica de reservas (línea)
// Permite alternar entre vista diaria y mensual
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Extrae año-mes de una fecha (formato YYYY-MM-DD)
function getYearMonth(fecha) {
  return fecha ? fecha.slice(0, 7) : '';
}

const EstadisticasReservas = ({ reservas = [] }) => {
  // Estado para alternar entre vista mensual y diaria
  const [periodo, setPeriodo] = useState('mes');

  // Si no hay reservas, mostrar componente vacío
  if (!reservas || reservas.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas de Reservas</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>No hay datos de reservas disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  // Agrupa reservas por mes
  const meses = {};
  reservas.forEach(r => {
    const mes = getYearMonth(r.fecha_reserva);
    if (mes) {
      meses[mes] = (meses[mes] || 0) + 1;
    }
  });
  const labelsMes = Object.keys(meses).sort((a, b) => a.localeCompare(b));
  const dataMes = labelsMes.map(f => meses[f]);

  // Agrupa reservas por día
  const fechas = {};
  reservas.forEach(r => {
    const fecha = r.fecha_reserva;
    if (fecha) {
      fechas[fecha] = (fechas[fecha] || 0) + 1;
    }
  });
  const labelsDia = Object.keys(fechas).sort((a, b) => a.localeCompare(b));
  const dataDia = labelsDia.map(f => fechas[f]);

  // Calcular datos del período anterior para comparación
  const ahora = new Date();
  const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
  const mesAnteriorStr = mesAnterior.toISOString().slice(0, 7);
  
  const fechaAnterior = new Date(ahora);
  fechaAnterior.setDate(fechaAnterior.getDate() - 30);
  const fechaAnteriorStr = fechaAnterior.toISOString().slice(0, 10);

  // Datos del mes anterior
  const mesesAnteriores = {};
  reservas.forEach(r => {
    const mes = getYearMonth(r.fecha_reserva);
    if (mes && mes < labelsMes[labelsMes.length - 1]) {
      mesesAnteriores[mes] = (mesesAnteriores[mes] || 0) + 1;
    }
  });
  const labelsMesAnterior = Object.keys(mesesAnteriores).sort((a, b) => a.localeCompare(b));
  const previousMes = labelsMesAnterior.map(f => mesesAnteriores[f]);

  // Datos del período anterior (días)
  const fechasAnteriores = {};
  reservas.forEach(r => {
    const fecha = r.fecha_reserva;
    if (fecha && fecha < labelsDia[labelsDia.length - 1] && fecha >= fechaAnteriorStr) {
      fechasAnteriores[fecha] = (fechasAnteriores[fecha] || 0) + 1;
    }
  });
  const labelsDiaAnterior = Object.keys(fechasAnteriores).sort((a, b) => a.localeCompare(b));
  const previousDia = labelsDiaAnterior.map(f => fechasAnteriores[f]);

  // Configuración de datos para Chart.js
  const chartData = {
    labels: periodo === 'mes' ? labelsMes : labelsDia,
    datasets: [
      {
        label: 'Reservas',
        data: periodo === 'mes' ? dataMes : dataDia,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { 
          boxWidth: 12,
          boxHeight: 12,
          font: { size: 14, weight: '500' },
          color: '#6b7280',
          usePointStyle: true,
          padding: 20
        }
      },
      title: { display: false },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      },
    },
    interaction: { 
      mode: 'nearest', 
      axis: 'x', 
      intersect: false 
    },
    scales: {
      x: { 
        title: { 
          display: true, 
          text: periodo === 'mes' ? 'Mes' : 'Fecha',
          color: '#6b7280',
          font: { size: 12, weight: '500' }
        },
        grid: {
          color: '#f3f4f6',
          borderColor: '#e5e7eb'
        },
        ticks: {
          color: '#6b7280',
          font: { size: 11 }
        }
      },
      y: { 
        title: { 
          display: true, 
          text: 'Cantidad de Reservas',
          color: '#6b7280',
          font: { size: 12, weight: '500' }
        },
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          borderColor: '#e5e7eb'
        },
        ticks: {
          color: '#6b7280',
          font: { size: 11 }
        }
      }
    }
  };

  // Calcular estadísticas
  const totalActual = periodo === 'mes' ? dataMes.reduce((a, b) => a + b, 0) : dataDia.reduce((a, b) => a + b, 0);
  const totalAnterior = periodo === 'mes' 
    ? (previousMes.length > 0 ? previousMes.reduce((a, b) => a + b, 0) : 0)
    : (previousDia.length > 0 ? previousDia.reduce((a, b) => a + b, 0) : 0);
  const cambio = totalAnterior > 0 ? ((totalActual - totalAnterior) / totalAnterior * 100) : 0;
  const promedioActual = totalActual / (periodo === 'mes' ? (dataMes.length || 1) : (dataDia.length || 1));

  return (
    <div className="bg-white rounded-2xl shadow-custom p-6 animate-fadeIn">
      {/* Encabezado y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Estadísticas de Reservas</h3>
          <p className="text-gray-600 text-sm">Comparación con el período anterior</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button 
            onClick={() => setPeriodo('dia')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              periodo === 'dia' 
                ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                : 'bg-white text-blue-500 border-blue-200 hover:bg-blue-50'
            }`}
          >
            Por Día
          </button>
          <button 
            onClick={() => setPeriodo('mes')} 
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              periodo === 'mes' 
                ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                : 'bg-white text-blue-500 border-blue-200 hover:bg-blue-50'
            }`}
          >
            Por Mes
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Actual</p>
              <p className="text-2xl font-bold text-blue-800">{totalActual}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Cambio</p>
              <p className={`text-2xl font-bold ${cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cambio >= 0 ? '+' : ''}{cambio.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Promedio</p>
              <p className="text-2xl font-bold text-green-800">{promedioActual.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Pico Máximo</p>
              <p className="text-2xl font-bold text-orange-800">
                {Math.max(...(periodo === 'mes' ? dataMes : dataDia))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfica de líneas */}
      <div className="h-80 w-full">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Período actual: {totalActual} reservas</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>Período anterior: {totalAnterior} reservas</span>
          </div>
          <div className="text-gray-500">
            Vista: {periodo === 'mes' ? 'Mensual' : 'Diaria'}
          </div>
        </div>
      </div>
    </div>
  );
};

EstadisticasReservas.propTypes = {
  reservas: PropTypes.arrayOf(PropTypes.object)
};

export default EstadisticasReservas;
