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

// Paleta de colores para los estados
const colores = [
  '#3b82f6', '#22c55e', '#f59e42', '#a78bfa', '#ef4444', '#fbbf24', '#6366f1', '#14b8a6', '#eab308', '#f472b6'
];

const EstadisticasAulas = ({ aulas }) => {
  // Cuenta aulas por estado
  const conteoEstados = {};
  aulas.forEach(a => {
    const estado = a.estado || 'Desconocido';
    conteoEstados[estado] = (conteoEstados[estado] || 0) + 1;
  });
  const labels = Object.keys(conteoEstados);
  const data = {
    labels,
    datasets: [
      {
        data: labels.map(l => conteoEstados[l]),
        backgroundColor: colores.slice(0, labels.length),
        borderWidth: 2,
      },
    ],
  };
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 animate-fadeIn flex flex-col items-center">
      {/* Título */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Aulas por estado</h3>
      <div className="flex flex-col items-center">
        {/* Gráfico de dona */}
        <div className="w-40 h-40 mb-4">
          <Doughnut 
            data={data} 
            options={{
              plugins: {
                legend: { display: false },
              },
              cutout: '70%',
              maintainAspectRatio: false,
              responsive: true,
            }}
          />
        </div>
        {/* Leyenda personalizada debajo de la gráfica */}
        <div className="w-full flex flex-wrap justify-center gap-1 mt-2 max-w-xs">
          {labels.map((label, idx) => (
            <div key={label} className="flex items-center mr-2 mb-1 min-w-fit">
              <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ backgroundColor: colores[idx] }}></span>
              <span className="text-gray-600 text-xs whitespace-nowrap">{label} ({conteoEstados[label]})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasAulas;
