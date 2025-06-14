import React, { useState } from "react";

const usuariosEjemplo = [
  { id: 1, nombre: "Juan Pérez", email: "juan@tecsup.edu.pe", rol: "Estudiante" },
  { id: 2, nombre: "Ana Torres", email: "ana@tecsup.edu.pe", rol: "Docente" },
  { id: 3, nombre: "Luis Gómez", email: "luis@tecsup.edu.pe", rol: "Estudiante" },
  { id: 4, nombre: "María Ruiz", email: "maria@tecsup.edu.pe", rol: "Administrador" },
];

const PanelUsuarios = () => {
  const [filtro, setFiltro] = useState("");
  const usuariosFiltrados = usuariosEjemplo.filter(u =>
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
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-3 text-left">Nombre</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id} className="border-b hover:bg-blue-50">
                <td className="py-2 px-3">{u.nombre}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3">{u.rol}</td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr><td colSpan={3} className="py-4 text-center text-gray-400">No se encontraron usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PanelUsuarios;
