import React, { useState, useEffect } from "react";

const PanelUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [tipoVista, setTipoVista] = useState('cards'); // 'cards' o 'table'
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Simular datos si no hay API disponible
  const simularDatos = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usuariosSimulados = [
          { id: 1, nombres: "Juan Carlos", apellidos: "Pérez López", correo: "juan.perez@tecsup.edu.pe", estado: "activo", ultima_conexion: "2025-06-30T10:30:00Z" },
          { id: 2, nombres: "María Elena", apellidos: "García Rodríguez", correo: "maria.garcia@tecsup.edu.pe", estado: "activo", ultima_conexion: "2025-06-30T09:15:00Z" },
          { id: 3, nombres: "Carlos Alberto", apellidos: "Mendoza Silva", correo: "carlos.mendoza@tecsup.edu.pe", estado: "inactivo", ultima_conexion: "2025-06-28T14:20:00Z" },
          { id: 4, nombres: "Ana Sofía", apellidos: "Torres Vega", correo: "ana.torres@tecsup.edu.pe", estado: "activo", ultima_conexion: "2025-06-30T11:45:00Z" },
          { id: 5, nombres: "Roberto", apellidos: "Fernández Castro", correo: "roberto.fernandez@tecsup.edu.pe", estado: "activo", ultima_conexion: "2025-06-29T16:30:00Z" },
        ];
        resolve(usuariosSimulados);
      }, 800);
    });
  };

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setCargando(true);
        setError(null);
        
        try {
          const response = await fetch("http://localhost:8000/api/profesores/");
          if (!response.ok) throw new Error("Error del servidor");
          
          const data = await response.json();
          const usuariosMapeados = data.map(u => ({
            id: u.id,
            nombres: u.nombres || "",
            apellidos: u.apellidos || "",
            correo: u.correo || u.email || "",
            estado: u.estado || "activo",
            ultima_conexion: u.ultima_conexion || new Date().toISOString()
          }));
          
          setUsuarios(usuariosMapeados);
        } catch (apiError) {
          console.warn("API no disponible, usando datos simulados");
          const usuariosSimulados = await simularDatos();
          setUsuarios(usuariosSimulados);
        }
      } catch (err) {
        setError("Error al cargar los usuarios");
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombres} ${u.apellidos}`.toLowerCase().includes(filtro.toLowerCase()) ||
    u.correo.toLowerCase().includes(filtro.toLowerCase()) ||
    u.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'No disponible';
    }
  };

  const obtenerIniciales = (nombres, apellidos) => {
    const n = nombres?.charAt(0) || '';
    const a = apellidos?.charAt(0) || '';
    return (n + a).toUpperCase() || 'NN';
  };

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  if (cargando) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-custom p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-custom p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar usuarios</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-custom p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h2>
            <p className="text-gray-600">Administra los usuarios del sistema educativo</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="btn-primary flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Usuario
            </button>
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="input-focus w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Vista:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTipoVista('cards')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  tipoVista === 'cards' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setTipoVista('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  tipoVista === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Tabla
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3.87M9 20H4v-2a3 3 0 013-3.87m9-4a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Usuarios</p>
                <p className="text-2xl font-bold text-blue-800">{usuarios.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Activos</p>
                <p className="text-2xl font-bold text-green-800">
                  {usuarios.filter(u => u.estado === 'activo').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Conectados Hoy</p>
                <p className="text-2xl font-bold text-gray-800">
                  {usuarios.filter(u => {
                    const hoy = new Date().toDateString();
                    return new Date(u.ultima_conexion).toDateString() === hoy;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vista de tarjetas */}
        {tipoVista === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {usuariosFiltrados.map(usuario => (
              <div
                key={usuario.id}
                className="card-hover bg-white border border-gray-200 rounded-xl p-6 cursor-pointer"
                onClick={() => abrirModal(usuario)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 ${
                    usuario.estado === 'activo' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-400'
                  }`}>
                    {obtenerIniciales(usuario.nombres, usuario.apellidos)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {`${usuario.nombres} ${usuario.apellidos}`.trim() || 'Sin nombre'}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3">{usuario.correo}</p>
                  
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    usuario.estado === 'activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Última conexión: {formatearFecha(usuario.ultima_conexion)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vista de tabla */}
        {tipoVista === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Conexión</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map(usuario => (
                  <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3 ${
                          usuario.estado === 'activo' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-400'
                        }`}>
                          {obtenerIniciales(usuario.nombres, usuario.apellidos)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {`${usuario.nombres} ${usuario.apellidos}`.trim() || 'Sin nombre'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{usuario.correo}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        usuario.estado === 'activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">
                      {formatearFecha(usuario.ultima_conexion)}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => abrirModal(usuario)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500">Prueba con otros términos de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {modalAbierto && usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-custom-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Detalles del Usuario</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 ${
                usuarioSeleccionado.estado === 'activo' ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gray-400'
              }`}>
                {obtenerIniciales(usuarioSeleccionado.nombres, usuarioSeleccionado.apellidos)}
              </div>
              <h4 className="text-lg font-semibold text-gray-800">
                {`${usuarioSeleccionado.nombres} ${usuarioSeleccionado.apellidos}`.trim()}
              </h4>
              <p className="text-gray-600">{usuarioSeleccionado.correo}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  usuarioSeleccionado.estado === 'activo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {usuarioSeleccionado.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="text-gray-800">#{usuarioSeleccionado.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última conexión:</span>
                <span className="text-gray-800 text-sm">
                  {formatearFecha(usuarioSeleccionado.ultima_conexion)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button className="btn-secondary flex-1">
                Editar Usuario
              </button>
              <button className="btn-primary flex-1">
                Enviar Mensaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelUsuarios;
