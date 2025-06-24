// Gráfica de reservas (línea comparativa actual vs anterior)
// Permite alternar entre vista diaria y mensual
import React, { useState } from "react";
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

const EstadisticasReservas = ({ reservas }) => {
  // Estado para alternar entre vista mensual y diaria
  const [periodo, setPeriodo] = useState('mes');

  // Agrupa reservas por mes
  const meses = {};
  reservas.forEach(r => {
    const mes = getYearMonth(r.fecha_reserva);
    meses[mes] = (meses[mes] || 0) + 1;
  });
  const labelsMes = Object.keys(meses).sort();
  const dataMes = labelsMes.map(f => meses[f]);

  // Agrupa reservas por día
  const fechas = {};
  reservas.forEach(r => {
    const fecha = r.fecha_reserva;
    fechas[fecha] = (fechas[fecha] || 0) + 1;
  });
  const labelsDia = Object.keys(fechas).sort();
  const dataDia = labelsDia.map(f => fechas[f]);

  // Simula datos del año anterior para comparación visual
  const getPreviousData = arr => arr.map((v, i) => Math.max(0, v - Math.round(Math.random() * 10 + 5)));
  const previousMes = getPreviousData(dataMes);
  const previousDia = getPreviousData(dataDia);

  // Configuración de datos para Chart.js
  const chartData = {
    labels: periodo === 'mes' ? labelsMes : labelsDia,
    datasets: [
      {
        label: 'Actual',
        data: periodo === 'mes' ? dataMes : dataDia,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        borderColor: '#3b82f6',
        pointBackgroundColor: '#3b82f6',
        tension: 0.4,
      },
      {
        label: 'Anterior',
        data: periodo === 'mes' ? previousMes : previousDia,
        fill: true,
        borderDash: [6, 6],
        backgroundColor: 'rgba(236, 72, 153, 0.10)',
        borderColor: '#f472b6',
        pointBackgroundColor: '#f472b6',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 animate-fadeIn">
      {/* Encabezado y botones de periodo */}
      <div className="flex items-center mb-4 gap-2">
        <h3 className="text-xl font-semibold text-gray-700 flex-1">Reservas</h3>
        <button onClick={() => setPeriodo('dia')} className={`px-3 py-1 rounded-lg text-sm font-medium border ${periodo === 'dia' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}>Día</button>
        <button onClick={() => setPeriodo('mes')} className={`px-3 py-1 rounded-lg text-sm font-medium border ${periodo === 'mes' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}>Mes</button>
      </div>
      {/* Gráfica de líneas */}
      <Line data={chartData} options={{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { boxWidth: 18, font: { size: 14 } }
          },
          title: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        interaction: { mode: 'nearest', axis: 'x', intersect: false },
        scales: {
          x: { title: { display: true, text: periodo === 'mes' ? 'Mes' : 'Fecha' } },
          y: { title: { display: true, text: 'Cantidad' }, beginAtZero: true }
        }
      }} />
    </div>
  );
};

export default EstadisticasReservas;
