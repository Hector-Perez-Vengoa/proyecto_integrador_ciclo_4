import React, { useState, useEffect } from "react";

const PanelUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cambia la URL si tu backend está en otra ruta o puerto
    fetch("http://localhost:8000/api/profesores/")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar los usuarios");
        return res.json();
      })
      .then(data => {
        // Mapea los datos del backend al formato esperado por la tabla
        const usuariosMapeados = data.map(u => ({
          id: u.id,
          nombre: `${u.nombres} ${u.apellidos}`.trim(),
          email: u.correo,
          rol: "Docente"
        }));
        setUsuarios(usuariosMapeados);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.email.toLowerCase().includes(filtro.toLowerCase()) ||
    u.rol.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 animate-fadeIn">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Administrar Usuarios</h3>
      <input
        type="text"
        placeholder="Buscar por nombre, email o rol..."
        className="mb-4 px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring focus:border-blue-400"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {cargando ? (
        <div className="text-center text-gray-400 py-4">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {usuariosFiltrados.map(u => (
            <div key={u.id} className="bg-blue-50 rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 mb-2">
                {u.nombre.split(' ').map(n => n[0]).join('').substring(0,2)}
              </div>
              <div className="text-lg font-semibold text-gray-800 text-center">{u.nombre}</div>
              <div className="text-sm text-gray-500 text-center">{u.email}</div>
              <div className="mt-2 px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">{u.rol}</div>
            </div>
          ))}
          {usuariosFiltrados.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-4">No se encontraron usuarios</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PanelUsuarios;
