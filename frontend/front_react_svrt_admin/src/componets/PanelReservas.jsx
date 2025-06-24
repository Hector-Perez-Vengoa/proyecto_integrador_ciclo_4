import React, { useState, useEffect } from "react";

const PanelReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/reservas/")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar las reservas");
        return res.json();
      })
      .then(data => {
        setReservas(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const reservasFiltradas = reservas.filter(r =>
    (r.motivo || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (r.estado || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (r.id + '').includes(filtro) ||
    (r.aula_virtual_codigo || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (r.curso_nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (r.profesor_nombre || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 animate-fadeIn">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Administrar Reservas</h3>
      <input
        type="text"
        placeholder="Buscar por cualquier campo..."
        className="mb-4 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-400"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {cargando ? (
        <div className="text-center text-gray-400 py-4">Cargando reservas...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="divide-y divide-blue-100">
          <div className="hidden sm:flex font-bold text-blue-700 py-2">
            <div className="flex-1">ID</div>
            <div className="flex-1">Hora Inicio</div>
            <div className="flex-1">Hora Fin</div>
            <div className="flex-1">Fecha Reserva</div>
            <div className="flex-1">Motivo</div>
            <div className="flex-1">Estado</div>
            <div className="flex-1">Fecha Creación</div>
            <div className="flex-1">Aula Virtual</div>
            <div className="flex-1">Curso</div>
            <div className="flex-1">Profesor</div>
          </div>
          {reservasFiltradas.map(r => (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center py-4 gap-2 text-sm">
              <div className="flex-1">{r.id}</div>
              <div className="flex-1">{r.hora_inicio}</div>
              <div className="flex-1">{r.hora_fin}</div>
              <div className="flex-1">{r.fecha_reserva}</div>
              <div className="flex-1">{r.motivo}</div>
              <div className="flex-1">
                <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">{r.estado}</span>
              </div>
              <div className="flex-1">{r.fecha_creacion}</div>
              <div className="flex-1">{r.aula_virtual_codigo || r.aula_virtual_id}</div>
              <div className="flex-1">{r.curso_nombre || r.curso_id}</div>
              <div className="flex-1">{r.profesor_nombre || r.profesor_id}</div>
            </div>
          ))}
          {reservasFiltradas.length === 0 && (
            <div className="text-center text-gray-400 py-4">No se encontraron reservas</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelReservas;
