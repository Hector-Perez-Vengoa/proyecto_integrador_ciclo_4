import React, { useState, useEffect } from "react";

const PanelReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Datos simulados para desarrollo
  const simularReservas = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reservasSimuladas = [
          {
            id: 1,
            hora_inicio: "08:00",
            hora_fin: "10:00",
            fecha_reserva: "2025-07-01",
            motivo: "Clase de Programación Web",
            estado: "confirmada",
            fecha_creacion: "2025-06-28T10:30:00Z",
            aula_virtual_codigo: "AV-001",
            curso_nombre: "Desarrollo Web Frontend",
            profesor_nombre: "Juan Pérez López",
            estudiantes_esperados: 25
          },
          {
            id: 2,
            hora_inicio: "14:00",
            hora_fin: "16:00",
            fecha_reserva: "2025-07-01",
            motivo: "Laboratorio de Base de Datos",
            estado: "pendiente",
            fecha_creacion: "2025-06-29T09:15:00Z",
            aula_virtual_codigo: "AV-002",
            curso_nombre: "Gestión de Base de Datos",
            profesor_nombre: "María García Rodríguez",
            estudiantes_esperados: 20
          },
          {
            id: 3,
            hora_inicio: "10:00",
            hora_fin: "12:00",
            fecha_reserva: "2025-06-30",
            motivo: "Examen Final",
            estado: "completada",
            fecha_creacion: "2025-06-25T16:20:00Z",
            aula_virtual_codigo: "AV-003",
            curso_nombre: "Matemáticas Aplicadas",
            profesor_nombre: "Carlos Mendoza Silva",
            estudiantes_esperados: 30
          },
          {
            id: 4,
            hora_inicio: "16:00",
            hora_fin: "18:00",
            fecha_reserva: "2025-07-02",
            motivo: "Tutoría Grupal",
            estado: "cancelada",
            fecha_creacion: "2025-06-29T14:45:00Z",
            aula_virtual_codigo: "AV-001",
            curso_nombre: "Física I",
            profesor_nombre: "Ana Torres Vega",
            estudiantes_esperados: 15
          }
        ];
        resolve(reservasSimuladas);
      }, 800);
    });
  };

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        setCargando(true);
        setError(null);
        
        try {
          const response = await fetch("http://localhost:8000/api/reservas/");
          if (!response.ok) throw new Error("Error del servidor");
          
          const data = await response.json();
          setReservas(data);
        } catch (apiError) {
          console.warn("API no disponible, usando datos simulados");
          const reservasSimuladas = await simularReservas();
          setReservas(reservasSimuladas);
        }
      } catch (err) {
        setError("Error al cargar las reservas");
      } finally {
        setCargando(false);
      }
    };

    cargarReservas();
  }, []);

  const reservasFiltradas = reservas.filter(r => {
    const coincideTexto = 
      (r.motivo || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (r.curso_nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (r.profesor_nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (r.aula_virtual_codigo || '').toLowerCase().includes(filtro.toLowerCase());
    
    const coincideEstado = estadoFiltro === "todos" || r.estado === estadoFiltro;
    
    return coincideTexto && coincideEstado;
  });

  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
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
      return fecha;
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const contarPorEstado = (estado) => {
    return reservas.filter(r => r.estado === estado).length;
  };

  const abrirModal = (reserva) => {
    setReservaSeleccionada(reserva);
    setModalAbierto(true);
  };

  if (cargando) {
    return (
      <div className="animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-custom p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando reservas...</p>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar reservas</h3>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Reservas</h2>
            <p className="text-gray-600">Administra las reservas de aulas virtuales</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button className="btn-primary flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Reserva
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-800">{reservas.length}</p>
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
                <p className="text-sm text-green-600 font-medium">Confirmadas</p>
                <p className="text-2xl font-bold text-green-800">{contarPorEstado('confirmada')}</p>
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
                <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-800">{contarPorEstado('pendiente')}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-xl p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Canceladas</p>
                <p className="text-2xl font-bold text-red-800">{contarPorEstado('cancelada')}</p>
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
              placeholder="Buscar reservas..."
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
              <option value="confirmada">Confirmadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="space-y-4">
          {reservasFiltradas.map(reserva => (
            <div
              key={reserva.id}
              className="card-hover bg-white border border-gray-200 rounded-xl p-6 cursor-pointer"
              onClick={() => abrirModal(reserva)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Reserva #{reserva.id}</p>
                    <p className="font-semibold text-gray-800">{reserva.motivo}</p>
                    <p className="text-sm text-gray-600">{reserva.curso_nombre}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fecha y Hora</p>
                    <p className="font-medium text-gray-800">{formatearFecha(reserva.fecha_reserva)}</p>
                    <p className="text-sm text-gray-600">{reserva.hora_inicio} - {reserva.hora_fin}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Profesor</p>
                    <p className="font-medium text-gray-800">{reserva.profesor_nombre}</p>
                    <p className="text-sm text-gray-600">Aula: {reserva.aula_virtual_codigo}</p>
                  </div>
                </div>
                
                <div className="mt-4 lg:mt-0 lg:ml-6 flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${obtenerColorEstado(reserva.estado)}`}>
                    {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                  </span>
                  
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reservasFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron reservas</h3>
            <p className="text-gray-500">Prueba con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {modalAbierto && reservaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-custom-lg max-w-2xl w-full p-6 max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Detalles de la Reserva</h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Información General</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">ID de Reserva:</span>
                    <span className="ml-2 font-medium">#{reservaSeleccionada.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Motivo:</span>
                    <span className="ml-2 font-medium">{reservaSeleccionada.motivo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(reservaSeleccionada.estado)}`}>
                      {reservaSeleccionada.estado.charAt(0).toUpperCase() + reservaSeleccionada.estado.slice(1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Creación:</span>
                    <span className="ml-2 font-medium">{formatearFechaHora(reservaSeleccionada.fecha_creacion)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-4">Detalles de la Sesión</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Fecha:</span>
                    <span className="ml-2 font-medium">{formatearFecha(reservaSeleccionada.fecha_reserva)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Horario:</span>
                    <span className="ml-2 font-medium">{reservaSeleccionada.hora_inicio} - {reservaSeleccionada.hora_fin}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Aula Virtual:</span>
                    <span className="ml-2 font-medium">{reservaSeleccionada.aula_virtual_codigo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Estudiantes Esperados:</span>
                    <span className="ml-2 font-medium">{reservaSeleccionada.estudiantes_esperados || 'No especificado'}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-4">Información Académica</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Curso:</span>
                    <span className="ml-2 font-medium">{reservaSeleccionada.curso_nombre}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Profesor:</span>
                    <span className="ml-2 font-medium">{reservaSeleccionada.profesor_nombre}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button className="btn-secondary flex-1">
                Editar Reserva
              </button>
              <button className="btn-primary flex-1">
                Confirmar Reserva
              </button>
              <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelReservas;
