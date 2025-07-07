import React, { useState } from 'react';
import { useReservas, useProfesores, useAulasVirtuales, useCursos } from '../../hooks/useEntities';

const ReservasManager = () => {
  const { 
    data: reservas, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useReservas();
  
  const { data: profesores } = useProfesores();
  const { data: aulasVirtuales } = useAulasVirtuales();
  const { data: cursos } = useCursos();

  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [formData, setFormData] = useState({
    user: '',
    aula_virtual: '',
    curso: '',
    hora_inicio: '',
    hora_fin: '',
    fecha_reserva: '',
    motivo: '',
    estado: 'pendiente'
  });

  // Estados para filtros y búsqueda
  const [filters, setFilters] = useState({
    busqueda: '',
    usuario: '',
    estado: '',
    curso: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleAdd = () => {
    setEditingReserva(null);
    setFormData({
      user: '',
      aula_virtual: '',
      curso: '',
      hora_inicio: '',
      hora_fin: '',
      fecha_reserva: '',
      motivo: '',
      estado: 'pendiente'
    });
    setShowModal(true);
  };

  const handleEdit = (reserva) => {
    setEditingReserva(reserva);
    setFormData({
      user: reserva.user || '',
      aula_virtual: reserva.aula_virtual || '',
      curso: reserva.curso || '',
      hora_inicio: reserva.hora_inicio || '',
      hora_fin: reserva.hora_fin || '',
      fecha_reserva: reserva.fecha_reserva || '',
      motivo: reserva.motivo || '',
      estado: reserva.estado || 'pendiente'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        alert('Error al eliminar la reserva');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReserva) {
        await updateItem(editingReserva.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
      alert('Error al guardar la reserva');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      busqueda: '',
      usuario: '',
      estado: '',
      curso: '',
      fechaDesde: '',
      fechaHasta: ''
    });
  };

  // Función para filtrar las reservas
  const filteredReservas = reservas.filter((reserva) => {
    // Filtro por búsqueda (nombre usuario, motivo, aula)
    if (filters.busqueda) {
      const searchTerm = filters.busqueda.toLowerCase();
      const matchesSearch = 
        (reserva.user_nombre && reserva.user_nombre.toLowerCase().includes(searchTerm)) ||
        (reserva.motivo && reserva.motivo.toLowerCase().includes(searchTerm)) ||
        (reserva.aula_virtual_codigo && reserva.aula_virtual_codigo.toLowerCase().includes(searchTerm)) ||
        (reserva.curso_nombre && reserva.curso_nombre.toLowerCase().includes(searchTerm));
      
      if (!matchesSearch) return false;
    }

    // Filtro por usuario
    if (filters.usuario && reserva.user !== parseInt(filters.usuario)) {
      return false;
    }

    // Filtro por estado
    if (filters.estado && reserva.estado !== filters.estado) {
      return false;
    }

    // Filtro por curso
    if (filters.curso && reserva.curso !== parseInt(filters.curso)) {
      return false;
    }

    // Filtro por fecha desde
    if (filters.fechaDesde && new Date(reserva.fecha_reserva) < new Date(filters.fechaDesde)) {
      return false;
    }

    // Filtro por fecha hasta
    if (filters.fechaHasta && new Date(reserva.fecha_reserva) > new Date(filters.fechaHasta)) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"></path>
              </svg>
              Filtros
            </button>
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Nueva Reserva
            </button>
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Búsqueda general */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Búsqueda</label>
                <input
                  type="text"
                  name="busqueda"
                  value={filters.busqueda}
                  onChange={handleFilterChange}
                  placeholder="Buscar por usuario, motivo, aula..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Filtro por usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                <select
                  name="usuario"
                  value={filters.usuario}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todos los usuarios</option>
                  {profesores.map(profesor => (
                    <option key={profesor.id} value={profesor.id}>
                      {profesor.nombres} {profesor.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="en_uso">En Uso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="no_presentado">No Presentado</option>
                </select>
              </div>

              {/* Filtro por curso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                <select
                  name="curso"
                  value={filters.curso}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">Todos los cursos</option>
                  {cursos.map(curso => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por fecha desde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {/* Filtro por fecha hasta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Botones de acción para filtros */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Mostrando {filteredReservas.length} de {reservas.length} reservas
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      {filteredReservas.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {reservas.length === 0 ? 'No hay reservas disponibles' : 'No se encontraron reservas con los filtros aplicados'}
          </h3>
          <p className="text-gray-500">
            {reservas.length === 0 
              ? 'Haz clic en "Nueva Reserva" para crear la primera reserva.' 
              : 'Intenta ajustar los filtros o limpiarlos para ver más resultados.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReservas.map((reserva) => {
            const profesor = profesores.find(p => p.id === reserva.user);
            const aula = aulasVirtuales.find(a => a.id === reserva.aula_virtual);
            const curso = cursos.find(c => c.id === reserva.curso);
            
            return (
              <div key={reserva.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Card Header */}
                <div className={`p-4 ${
                  reserva.estado === 'pendiente' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
                  reserva.estado === 'confirmada' ? 'bg-blue-50 border-l-4 border-blue-500' :
                  reserva.estado === 'en_uso' ? 'bg-purple-50 border-l-4 border-purple-500' :
                  reserva.estado === 'completada' ? 'bg-green-50 border-l-4 border-green-500' :
                  reserva.estado === 'cancelada' ? 'bg-red-50 border-l-4 border-red-500' :
                  'bg-gray-50 border-l-4 border-gray-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {reserva.user_nombre || (profesor ? `${profesor.nombres} ${profesor.apellidos}` : 'Usuario no encontrado')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {reserva.curso_nombre || (curso ? curso.nombre : 'Sin curso')}
                      </p>
                      {reserva.user_email && (
                        <p className="text-xs text-gray-500 mt-1">
                          {reserva.user_email}
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reserva.estado === 'pendiente'
                        ? 'bg-yellow-100 text-yellow-800' 
                        : reserva.estado === 'confirmada'
                        ? 'bg-blue-100 text-blue-800'
                        : reserva.estado === 'en_uso'
                        ? 'bg-purple-100 text-purple-800'
                        : reserva.estado === 'completada'
                        ? 'bg-green-100 text-green-800'
                        : reserva.estado === 'cancelada'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reserva.estado === 'pendiente' ? 'Pendiente' :
                       reserva.estado === 'confirmada' ? 'Confirmada' :
                       reserva.estado === 'en_uso' ? 'En Uso' :
                       reserva.estado === 'completada' ? 'Completada' :
                       reserva.estado === 'cancelada' ? 'Cancelada' :
                       reserva.estado === 'no_presentado' ? 'No Presentado' :
                       reserva.estado || 'Sin Estado'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Columna 1: Información del Aula */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span className="text-sm text-gray-600">
                          <strong>Aula:</strong> {reserva.aula_virtual_codigo || (aula ? aula.codigo : 'Sin aula')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Columna 2: Información de Fecha y Hora */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span className="text-sm text-gray-600">
                          <strong>Fecha:</strong> {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-sm text-gray-600">
                          <strong>Horario:</strong> {reserva.hora_inicio} - {reserva.hora_fin}
                        </span>
                      </div>
                    </div>
                    
                    {/* Columna 3: Información Adicional */}
                    <div className="space-y-2">
                      {reserva.motivo && (
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                          </svg>
                          <span className="text-sm text-gray-600">
                            <strong>Motivo:</strong> {reserva.motivo}
                          </span>
                        </div>
                      )}
                      
                      {reserva.duracion_horas && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          <span className="text-sm text-gray-600">
                            <strong>Duración:</strong> {reserva.duracion_horas} horas
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {reserva.fecha_creacion ? (
                        <>
                          Creado: {new Date(reserva.fecha_creacion).toLocaleDateString('es-ES')} {new Date(reserva.fecha_creacion).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </>
                      ) : (
                        <span style={{color: 'red'}}>❌ Fecha de creación no disponible</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(reserva)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(reserva.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingReserva ? 'Editar Reserva' : 'Nueva Reserva'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuario/Profesor</label>
                  <select
                    name="user"
                    value={formData.user}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar usuario</option>
                    {profesores.map(profesor => (
                      <option key={profesor.id} value={profesor.id}>
                        {profesor.nombres} {profesor.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aula Virtual</label>
                  <select
                    name="aula_virtual"
                    value={formData.aula_virtual}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar aula virtual</option>
                    {aulasVirtuales.filter(aula => aula.estado === 'disponible').map(aula => (
                      <option key={aula.id} value={aula.id}>
                        {aula.codigo} - {aula.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Curso</label>
                  <select
                    name="curso"
                    value={formData.curso}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar curso</option>
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Reserva</label>
                  <input
                    type="date"
                    name="fecha_reserva"
                    value={formData.fecha_reserva}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
                  <input
                    type="time"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
                  <input
                    type="time"
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivo</label>
                  <input
                    type="text"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="en_uso">En Uso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="no_presentado">No Presentado</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {editingReserva ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasManager;
