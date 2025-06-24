
import React, { useState, useEffect } from "react";

const colorEstado = {
  'disponible': 'bg-green-100 text-green-700',
  'ocupada': 'bg-yellow-100 text-yellow-700',
  'mantenimiento': 'bg-red-100 text-red-700',
};


const PanelAulas = () => {
  const [filtro, setFiltro] = useState("");
  const [aulas, setAulas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        setCargando(true);
        setError(null);
        const res = await fetch("http://localhost:8000/api/aula-virtual");
        if (!res.ok) throw new Error("Error al obtener aulas");
        const data = await res.json();
        setAulas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchAulas();
  }, []);

  const aulasFiltradas = aulas.filter(a =>
    (a.codigo?.toLowerCase().includes(filtro.toLowerCase()) || "") ||
    (a.descripcion?.toLowerCase().includes(filtro.toLowerCase()) || "") ||
    (a.estado?.toLowerCase().includes(filtro.toLowerCase()) || "")
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 animate-fadeIn">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Administrar Aulas</h3>
      <input
        type="text"
        placeholder="Buscar por nombre o estado..."
        className="mb-6 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-400"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {cargando ? (
        <div className="py-8 text-center text-gray-400">Cargando aulas...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {aulasFiltradas.map(a => (
            <div key={a.id} className="rounded-xl shadow-md p-5 bg-blue-50 hover:bg-blue-100 transition-all flex flex-col gap-2 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-blue-700">Aula {a.codigo}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${colorEstado[a.estado?.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>{a.estado}</span>
              </div>
              <div className="text-gray-600">{a.descripcion}</div>
              <div className="text-gray-400 text-xs mt-2">Creada: {a.fecha_creacion ? new Date(a.fecha_creacion).toLocaleDateString() : ''}</div>
            </div>
          ))}
          {aulasFiltradas.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-400">No se encontraron aulas</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelAulas;
