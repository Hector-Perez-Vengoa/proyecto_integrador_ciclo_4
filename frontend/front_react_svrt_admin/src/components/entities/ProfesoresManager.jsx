import React, { useState } from 'react';
import ProfesorCard from './ProfesorCard';
import { useProfesores, useDepartamentos, useCarreras, useCursos } from '../../hooks/useEntities';
import { perfilService } from '../../services/api';

const ProfesoresManager = () => {
  const { 
    data: profesores, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useProfesores();
  
  const { data: departamentos } = useDepartamentos();
  const { data: carreras } = useCarreras();
  const { data: cursos } = useCursos();

  const [showModal, setShowModal] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState(null);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    first_name: '',
    last_name: '',
    // Campos de perfil
    departamento: '',
    carreras: [],
    cursos: []
  });

  // Estados para filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    nombre: '',
    departamento: '',
    carrera: ''
  });

  // Función para formatear fecha de última conexión
  const formatLastLogin = (lastLoginDate) => {
    if (!lastLoginDate) return 'Nunca se ha conectado';
    
    const date = new Date(lastLoginDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  // Función para filtrar profesores
  const filteredProfesores = profesores.filter(profesor => {
    // Filtrar super_user = 1 (no mostrar super usuarios)
    if (profesor.super_user === 1 || profesor.is_superuser === true) {
      return false;
    }

    const matchesNombre = !searchFilters.nombre || 
      `${profesor.nombres} ${profesor.apellidos}`.toLowerCase().includes(searchFilters.nombre.toLowerCase()) ||
      profesor.codigo?.toLowerCase().includes(searchFilters.nombre.toLowerCase());
    
    const matchesDepartamento = !searchFilters.departamento || 
      profesor.departamento?.toString() === searchFilters.departamento;
    
    const matchesCarrera = !searchFilters.carrera || 
      (profesor.carreras && profesor.carreras.includes(parseInt(searchFilters.carrera)));

    return matchesNombre && matchesDepartamento && matchesCarrera;
  });

  const handleEdit = (profesor) => {
    console.log('Editando profesor:', profesor); // Debug para ver la estructura
    setEditingProfesor(profesor);
    setFormData({
      nombres: profesor.nombres || '',
      apellidos: profesor.apellidos || '',
      first_name: profesor.first_name || '',
      last_name: profesor.last_name || '',
      // Campos de perfil
      departamento: profesor.departamento || '',
      carreras: profesor.carreras || [],
      cursos: profesor.cursos || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este profesor?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error al eliminar el profesor:', error);
        alert('Error al eliminar el profesor');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Solo permitir edición, no creación
    if (!editingProfesor) {
      alert('Error: Solo se puede editar profesores existentes');
      return;
    }

    try {
      console.log('Datos del profesor a editar:', editingProfesor);
      console.log('Datos del formulario:', formData);
      
      // Paso 1: Actualizar datos básicos del usuario - solo campos esenciales
      const userDataToSend = {
        first_name: formData.nombres,
        last_name: formData.apellidos,
      };

      console.log('Actualizando datos del usuario:', userDataToSend);
      await updateItem(editingProfesor.id, userDataToSend);
      console.log('Usuario actualizado exitosamente');
      
      // Paso 2: Actualizar perfil académico si el usuario tiene perfil
      if (editingProfesor.perfil && editingProfesor.perfil.id) {
        const perfilDataToSend = {
          departamento: formData.departamento || null,
          carreras: formData.carreras || [],
          cursos: formData.cursos || []
        };

        console.log('Actualizando perfil académico:', perfilDataToSend);
        await perfilService.update(editingProfesor.perfil.id, perfilDataToSend);
        console.log('Perfil actualizado exitosamente');
      } else {
        console.log('El usuario no tiene perfil asociado, saltando actualización del perfil');
      }
      
      setShowModal(false);
      setEditingProfesor(null);
      alert('Profesor actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el profesor:', error);
      
      // Proporcionar información más específica del error
      let errorMessage = 'Error al actualizar el profesor. ';
      if (error.message.includes('400')) {
        errorMessage += 'Los datos enviados no son válidos. Revisa la información e intenta nuevamente.';
      } else if (error.message.includes('404')) {
        errorMessage += 'El profesor o perfil no fue encontrado.';
      } else if (error.message.includes('500')) {
        errorMessage += 'Error interno del servidor. Intenta nuevamente más tarde.';
      } else {
        errorMessage += 'Revisa los datos e intenta nuevamente.';
      }
      
      alert(errorMessage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchFilters({
      nombre: '',
      departamento: '',
      carrera: ''
    });
  };

  return (
    <div className="p-6">
      {/* Header con título */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Profesores</h2>
        <p className="text-gray-600 mt-2">Edita la información de los profesores existentes</p>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre o Código</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={searchFilters.nombre}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre o código..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
            <select
              id="departamento"
              name="departamento"
              value={searchFilters.departamento}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos los departamentos</option>
              {departamentos.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
            <select
              id="carrera"
              name="carrera"
              value={searchFilters.carrera}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todas las carreras</option>
              {carreras.map(carrera => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {(searchFilters.nombre || searchFilters.departamento || searchFilters.carrera) && (
              <span>Filtros activos: </span>
            )}
            {searchFilters.nombre && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">
                Nombre: "{searchFilters.nombre}"
              </span>
            )}
            {searchFilters.departamento && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">
                Depto: {departamentos.find(d => d.id.toString() === searchFilters.departamento)?.nombre}
              </span>
            )}
            {searchFilters.carrera && (
              <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs mr-2">
                Carrera: {carreras.find(c => c.id.toString() === searchFilters.carrera)?.nombre}
              </span>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Estados de carga y error */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Grid de cartas de profesores */}
      {!loading && !error && (
        <>
          {/* Indicador de resultados */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredProfesores.length === profesores.length ? (
              `Mostrando todos los profesores (${profesores.length})`
            ) : (
              `Mostrando ${filteredProfesores.length} de ${profesores.length} profesores`
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfesores.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {profesores.length === 0 ? (
                  <p className="text-gray-500 text-lg">No hay profesores registrados en el sistema</p>
                ) : (
                  <div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron profesores con los filtros aplicados</p>
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Limpiar filtros para ver todos
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredProfesores.map((profesor) => (
                <ProfesorCard
                  key={profesor.id}
                  profesor={profesor}
                  departamentos={departamentos}
                  carreras={carreras}
                  cursos={cursos}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="max-h-[80vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Editar Profesor
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Información Personal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres *</label>
                      <input
                        type="text"
                        id="nombres"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos *</label>
                      <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Asignación Académica Mejorada */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Asignación Académica</h4>
                  
                  {/* Departamento */}
                  <div className="mb-6">
                    <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                      Departamento Académico
                    </label>
                    <select
                      id="departamento"
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- Seleccionar departamento --</option>
                      {departamentos.map(dept => (
                        <option key={dept.id} value={dept.id}>
                          {dept.nombre}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Departamento al que pertenece el profesor</p>
                  </div>
                  
                  {/* Carreras */}
                  <div className="mb-6">
                    <label htmlFor="carreras" className="block text-sm font-medium text-gray-700 mb-2">
                      Carreras que Imparte
                    </label>
                    <div className="border border-gray-300 rounded-md p-2 bg-white max-h-40 overflow-y-auto">
                      {carreras.length === 0 ? (
                        <p className="text-gray-500 text-sm p-2">No hay carreras disponibles</p>
                      ) : (
                        carreras.map(carrera => (
                          <label key={carrera.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.carreras.includes(carrera.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    carreras: [...prev.carreras, carrera.id]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    carreras: prev.carreras.filter(id => id !== carrera.id)
                                  }));
                                }
                              }}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-900">{carrera.nombre}</span>
                              {carrera.codigo && (
                                <span className="text-xs text-gray-500 ml-2">({carrera.codigo})</span>
                              )}
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona las carreras en las que el profesor puede impartir clases
                    </p>
                  </div>
                  
                  {/* Cursos */}
                  <div className="mb-4">
                    <label htmlFor="cursos" className="block text-sm font-medium text-gray-700 mb-2">
                      Cursos Asignados
                    </label>
                    <div className="border border-gray-300 rounded-md p-2 bg-white max-h-40 overflow-y-auto">
                      {cursos.length === 0 ? (
                        <p className="text-gray-500 text-sm p-2">No hay cursos disponibles</p>
                      ) : (
                        cursos.map(curso => (
                          <label key={curso.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.cursos.includes(curso.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    cursos: [...prev.cursos, curso.id]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    cursos: prev.cursos.filter(id => id !== curso.id)
                                  }));
                                }
                              }}
                              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div>
                              <span className="text-sm font-medium text-gray-900">{curso.nombre}</span>
                              {curso.carrera_nombre && (
                                <span className="text-xs text-gray-500 block">Carrera: {curso.carrera_nombre}</span>
                              )}
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Selecciona los cursos específicos que el profesor puede impartir
                    </p>
                  </div>
                </div>

                {/* Información de conexión y estado */}
                {editingProfesor && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">Estado del Usuario</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-md border">
                        <label className="block text-sm font-medium text-gray-600">Estado Actual</label>
                        <div className="flex items-center mt-2">
                          <div className={`w-3 h-3 rounded-full mr-2 ${editingProfesor.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-sm font-medium ${editingProfesor.is_active ? 'text-green-700' : 'text-red-700'}`}>
                            {editingProfesor.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-md border">
                        <label className="block text-sm font-medium text-gray-600">Última Conexión</label>
                        <p className="text-sm text-gray-800 mt-2">
                          {formatLastLogin(editingProfesor.last_login)}
                        </p>
                        {editingProfesor.last_login && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(editingProfesor.last_login).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProfesor(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Actualizar Profesor
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

export default ProfesoresManager;
