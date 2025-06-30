
import React, { useState, useEffect } from "react";

const PanelAulas = () => {
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [aulas, setAulas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vistaLista, setVistaLista] = useState(false);

  // Datos simulados para desarrollo
  const simularAulas = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const aulasSimuladas = [
          {
            id: 1,
            codigo: "AV-001",
            descripcion: "Aula Virtual Principal - Equipada con tecnología avanzada para clases magistrales",
            estado: "disponible",
            capacidad: 30,
            fecha_creacion: "2025-01-15T10:00:00Z",
            ubicacion: "Bloque A - Piso 1",
            equipamiento: ["Proyector 4K", "Sistema de Audio", "Cámaras HD", "Pizarra Digital"],
            software_instalado: ["Zoom", "Teams", "Moodle", "Office 365"],
            reservas_activas: 0,
            ultima_utilizacion: "2025-06-29T14:30:00Z"
          },
          {
            id: 2,
            codigo: "AV-002",
            descripcion: "Laboratorio Virtual de Programación - Especializado en desarrollo de software",
            estado: "ocupada",
            capacidad: 25,
            fecha_creacion: "2025-01-20T10:00:00Z",
            ubicacion: "Bloque B - Piso 2",
            equipamiento: ["Proyector HD", "Sistema de Audio", "Computadoras de Alta Gama"],
            software_instalado: ["VS Code", "IntelliJ", "Git", "Docker", "Node.js"],
            reservas_activas: 1,
            ultima_utilizacion: "2025-06-30T10:00:00Z"
          },
          {
            id: 3,
            codigo: "AV-003",
            descripcion: "Aula Virtual de Matemáticas - Optimizada para cálculos y simulaciones",
            estado: "mantenimiento",
            capacidad: 35,
            fecha_creacion: "2025-01-10T10:00:00Z",
            ubicacion: "Bloque A - Piso 3",
            equipamiento: ["Proyector 4K", "Tablet de Cálculo", "Sistema de Audio"],
            software_instalado: ["MATLAB", "Mathematica", "GeoGebra", "Calculator Suite"],
            reservas_activas: 0,
            ultima_utilizacion: "2025-06-25T16:45:00Z"
          },
          {
            id: 4,
            codigo: "AV-004",
            descripcion: "Sala de Conferencias Virtual - Para reuniones y presentaciones importantes",
            estado: "disponible",
            capacidad: 50,
            fecha_creacion: "2025-02-01T10:00:00Z",
            ubicacion: "Bloque C - Piso 1",
            equipamiento: ["Sistema de Conferencias", "Múltiples Pantallas", "Audio Premium"],
            software_instalado: ["Zoom Pro", "Teams", "WebEx", "Recording Suite"],
            reservas_activas: 2,
            ultima_utilizacion: "2025-06-28T09:15:00Z"
          },
          {
            id: 5,
            codigo: "AV-005",
            descripcion: "Laboratorio de Idiomas Virtual - Especializado en enseñanza de lenguas",
            estado: "disponible",
            capacidad: 20,
            fecha_creacion: "2025-02-15T10:00:00Z",
            ubicacion: "Bloque B - Piso 1",
            equipamiento: ["Auriculares Profesionales", "Micrófonos", "Software de Pronunciación"],
            software_instalado: ["Rosetta Stone", "Duolingo Business", "Language Lab Pro"],
            reservas_activas: 1,
            ultima_utilizacion: "2025-06-29T11:30:00Z"
          }
        ];
        resolve(aulasSimuladas);
      }, 800);
    });
  };

  useEffect(() => {
    const cargarAulas = async () => {
      try {
        setCargando(true);
        setError(null);
        
        try {
          const response = await fetch("http://localhost:8000/api/aula-virtual/");
          if (!response.ok) throw new Error("Error del servidor");
          
          const data = await response.json();
          setAulas(data);
        } catch (apiError) {
          console.warn("API no disponible, usando datos simulados");
          const aulasSimuladas = await simularAulas();
          setAulas(aulasSimuladas);
        }
      } catch (err) {
        setError("Error al cargar las aulas");
      } finally {
        setCargando(false);
      }
    };

    cargarAulas();
  }, []);

  const aulasFiltradas = aulas.filter(aula => {
    const coincideTexto = 
      (aula.codigo || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (aula.descripcion || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (aula.ubicacion || '').toLowerCase().includes(filtro.toLowerCase());
    
    const coincideEstado = estadoFiltro === "todos" || aula.estado === estadoFiltro;
    
    return coincideTexto && coincideEstado;
  });

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'disponible':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-600' };
      case 'ocupada':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-600' };
      case 'mantenimiento':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-600' };
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado) {
      case 'disponible':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'ocupada':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'mantenimiento':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const contarPorEstado = (estado) => {
    return aulas.filter(a => a.estado === estado).length;
  };

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'No disponible';
    }
  };

  const formatearFechaHora = (fecha) => {
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

  const abrirModal = (aula) => {
    setAulaSeleccionada(aula);
    setModalAbierto(true);
  };

  if (cargando) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-custom p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando aulas virtuales...</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar aulas</h3>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Aulas Virtuales</h2>
            <p className="text-gray-600">Administra y monitorea las aulas virtuales del sistema</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="btn-primary flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Aula
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Aulas</p>
                <p className="text-2xl font-bold text-blue-800">{aulas.length}</p>
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
                <p className="text-sm text-green-600 font-medium">Disponibles</p>
                <p className="text-2xl font-bold text-green-800">{contarPorEstado('disponible')}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">En Uso</p>
                <p className="text-2xl font-bold text-yellow-800">{contarPorEstado('ocupada')}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Mantenimiento</p>
                <p className="text-2xl font-bold text-red-800">{contarPorEstado('mantenimiento')}</p>
              </div>
            </div>
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
              placeholder="Buscar aulas..."
              className="input-focus w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="input-focus px-4 py-3 border border-gray-300 rounded-lg"
              value={estadoFiltro}
              onChange={e => setEstadoFiltro(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="ocupada">En Uso</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setVistaLista(false)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  !vistaLista ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Tarjetas
              </button>
              <button
                onClick={() => setVistaLista(true)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  vistaLista ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Vista de tarjetas */}
        {!vistaLista && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aulasFiltradas.map(aula => {
              const colores = obtenerColorEstado(aula.estado);
              return (
                <div
                  key={aula.id}
                  className="card-hover bg-white border border-gray-200 rounded-xl p-6 cursor-pointer"
                  onClick={() => abrirModal(aula)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${colores.bg}`}>
                        <svg className={`w-6 h-6 ${colores.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{aula.codigo}</h3>
                        <p className="text-sm text-gray-500">{aula.ubicacion}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${colores.bg} ${colores.text}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${colores.icon.replace('text-', 'bg-')}`}></span>
                      {aula.estado.charAt(0).toUpperCase() + aula.estado.slice(1)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{aula.descripcion}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-3-3.87M9 20H4v-2a3 3 0 013-3.87m9-4a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Capacidad: {aula.capacidad || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Reservas: {aula.reservas_activas || 0}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Vista de lista */}
        {vistaLista && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Aula</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Capacidad</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ubicación</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Reservas</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Última Utilización</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {aulasFiltradas.map(aula => {
                  const colores = obtenerColorEstado(aula.estado);
                  return (
                    <tr key={aula.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${colores.bg}`}>
                            {obtenerIconoEstado(aula.estado)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{aula.codigo}</p>
                            <p className="text-sm text-gray-500">{aula.descripcion?.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colores.bg} ${colores.text}`}>
                          {aula.estado.charAt(0).toUpperCase() + aula.estado.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{aula.capacidad || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-600">{aula.ubicacion}</td>
                      <td className="py-4 px-4 text-gray-600">{aula.reservas_activas || 0}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {formatearFechaHora(aula.ultima_utilizacion)}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => abrirModal(aula)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {aulasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron aulas</h3>
            <p className="text-gray-500">Prueba con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {modalAbierto && aulaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-custom-lg max-w-4xl w-full p-6 max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mr-4 ${obtenerColorEstado(aulaSeleccionada.estado).bg}`}>
                  <svg className={`w-8 h-8 ${obtenerColorEstado(aulaSeleccionada.estado).icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{aulaSeleccionada.codigo}</h3>
                  <p className="text-gray-600">{aulaSeleccionada.ubicacion}</p>
                </div>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Información General</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600">Descripción:</span>
                    <p className="mt-1 text-gray-800">{aulaSeleccionada.descripcion}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Estado:</span>
                      <div className="mt-1">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${obtenerColorEstado(aulaSeleccionada.estado).bg} ${obtenerColorEstado(aulaSeleccionada.estado).text}`}>
                          {aulaSeleccionada.estado.charAt(0).toUpperCase() + aulaSeleccionada.estado.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Capacidad:</span>
                      <p className="mt-1 font-medium text-gray-800">{aulaSeleccionada.capacidad || 'No especificada'} estudiantes</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Fecha de Creación:</span>
                      <p className="mt-1 font-medium text-gray-800">{formatearFecha(aulaSeleccionada.fecha_creacion)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Reservas Activas:</span>
                      <p className="mt-1 font-medium text-gray-800">{aulaSeleccionada.reservas_activas || 0}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Última Utilización:</span>
                    <p className="mt-1 font-medium text-gray-800">{formatearFechaHora(aulaSeleccionada.ultima_utilizacion)}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Equipamiento</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600">Hardware Disponible:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aulaSeleccionada.equipamiento?.map((equipo, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {equipo}
                        </span>
                      )) || <span className="text-gray-500">No especificado</span>}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Software Instalado:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {aulaSeleccionada.software_instalado?.map((software, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {software}
                        </span>
                      )) || <span className="text-gray-500">No especificado</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button className="btn-secondary flex-1">
                Editar Aula
              </button>
              <button className="btn-primary flex-1">
                Realizar Reserva
              </button>
              <button className="px-4 py-2 text-yellow-600 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors">
                Programar Mantenimiento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelAulas;
