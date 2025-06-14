import React, { useState } from "react";

const reservasEjemplo = [
  { id: 1, usuario: "Juan Pérez", aula: "Aula 101", fecha: "2025-06-05", estado: "Activa" },
  { id: 2, usuario: "Ana Torres", aula: "Aula 102", fecha: "2025-06-06", estado: "Cancelada" },
  { id: 3, usuario: "Luis Gómez", aula: "Aula 201", fecha: "2025-06-07", estado: "Activa" },
  { id: 4, usuario: "María Ruiz", aula: "Aula 202", fecha: "2025-06-08", estado: "Finalizada" },
];

const PanelReservas = () => {
  const [filtro, setFiltro] = useState("");
  const reservasFiltradas = reservasEjemplo.filter(r =>
    r.usuario.toLowerCase().includes(filtro.toLowerCase()) ||
    r.aula.toLowerCase().includes(filtro.toLowerCase()) ||
    r.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 animate-fadeIn">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Administrar Reservas</h3>
      <input
        type="text"
        placeholder="Buscar por usuario, aula o estado..."
        className="mb-4 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-400"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-3 text-left">Usuario</th>
              <th className="py-2 px-3 text-left">Aula</th>
              <th className="py-2 px-3 text-left">Fecha</th>
              <th className="py-2 px-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.map(r => (
              <tr key={r.id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-3">{r.usuario}</td>
                <td className="py-2 px-3">{r.aula}</td>
                <td className="py-2 px-3">{r.fecha}</td>
                <td className="py-2 px-3">{r.estado}</td>
              </tr>
            ))}
            {reservasFiltradas.length === 0 && (
              <tr><td colSpan={4} className="py-4 text-center text-gray-400">No se encontraron reservas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelReservas;
