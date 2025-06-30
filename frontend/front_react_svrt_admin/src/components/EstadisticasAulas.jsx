// Gráfica de aulas por estado (dona)
// Recibe el array de aulas y muestra un resumen visual
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const EstadisticasAulas = ({ aulas }) => {
  // Si no hay aulas, usar datos simulados
  const aulasData = aulas?.length > 0 ? aulas : [
    { estado: 'disponible' },
    { estado: 'disponible' },
    { estado: 'disponible' },
    { estado: 'ocupada' },
    { estado: 'ocupada' },
    { estado: 'mantenimiento' }
  ];

  // Cuenta aulas por estado
  const conteoEstados = {};
  aulasData.forEach(a => {
    const estado = a.estado || 'Desconocido';
    conteoEstados[estado] = (conteoEstados[estado] || 0) + 1;
  });

  const labels = Object.keys(conteoEstados);
  const valores = labels.map(l => conteoEstados[l]);
  const total = valores.reduce((a, b) => a + b, 0);

  // Colores mejorados para cada estado
  const coloresEstados = {
    'disponible': {
      bg: '#22c55e',
      hover: '#16a34a',
      border: '#15803d'
    },
    'ocupada': {
      bg: '#f59e0b',
      hover: '#d97706',
      border: '#b45309'
    },
    'mantenimiento': {
      bg: '#ef4444',
      hover: '#dc2626',
      border: '#b91c1c'
    },
    'inactiva': {
      bg: '#6b7280',
      hover: '#4b5563',
      border: '#374151'
    }
  };

  const data = {
    labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
    datasets: [
      {
        data: valores,
        backgroundColor: labels.map(label => coloresEstados[label]?.bg || '#8b5cf6'),
        hoverBackgroundColor: labels.map(label => coloresEstados[label]?.hover || '#7c3aed'),
        borderColor: labels.map(label => coloresEstados[label]?.border || '#6d28d9'),
        borderWidth: 3,
        borderRadius: 4,
        spacing: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '65%',
    maintainAspectRatio: false,
    responsive: true,
  };

  // Calcular porcentajes para cada estado
  const estadisticas = labels.map(label => ({
    estado: label,
    cantidad: conteoEstados[label],
    porcentaje: ((conteoEstados[label] / total) * 100).toFixed(1),
    color: coloresEstados[label]?.bg || '#8b5cf6'
  }));

  return (
    <div className="bg-white rounded-2xl shadow-custom p-6 animate-fadeIn">
      {/* Título */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Estado de las Aulas</h3>
        <p className="text-gray-600 text-sm">Distribución actual por estado</p>
      </div>

      <div className="flex flex-col items-center">
        {/* Gráfico de dona con información central */}
        <div className="relative w-48 h-48 mb-6">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">Total Aulas</div>
            </div>
          </div>
        </div>

        {/* Estadísticas detalladas */}
        <div className="w-full space-y-3">
          {estadisticas.map((stat, idx) => (
            <div key={stat.estado} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-3 border-2 border-white shadow-sm"
                  style={{ backgroundColor: stat.color }}
                ></div>
                <div>
                  <span className="font-medium text-gray-800 capitalize">
                    {stat.estado}
                  </span>
                  <div className="text-xs text-gray-500">
                    {stat.porcentaje}% del total
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">{stat.cantidad}</div>
                <div className="text-xs text-gray-500">aulas</div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="w-full mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Disponibilidad</p>
                <p className="text-xs text-gray-600">Aulas listas para usar</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {((conteoEstados['disponible'] || 0) / total * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600">del total</p>
            </div>
          </div>
        </div>

        {/* Indicadores de estado rápido */}
        <div className="w-full mt-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
            <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-1 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-xs text-green-700 font-medium">Operativas</div>
            <div className="text-lg font-bold text-green-800">{conteoEstados['disponible'] || 0}</div>
          </div>

          <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto mb-1 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-xs text-yellow-700 font-medium">En Uso</div>
            <div className="text-lg font-bold text-yellow-800">{conteoEstados['ocupada'] || 0}</div>
          </div>

          <div className="text-center p-2 bg-red-50 rounded-lg border border-red-200">
            <div className="w-6 h-6 bg-red-500 rounded-full mx-auto mb-1 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-xs text-red-700 font-medium">Mantenim.</div>
            <div className="text-lg font-bold text-red-800">{conteoEstados['mantenimiento'] || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasAulas;
