import React, { useState } from 'react';
import ProfesorCard from './ProfesorCard';
import { useProfesores, useDepartamentos, useCarreras, useCursos } from '../../hooks/useEntities';

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
    codigo: '',
    nombres: '',
    apellidos: '',
    correo: '',
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

  // Función para filtrar profesores
  const filteredProfesores = profesores.filter(profesor => {
    const matchesNombre = !searchFilters.nombre || 
      `${profesor.nombres} ${profesor.apellidos}`.toLowerCase().includes(searchFilters.nombre.toLowerCase()) ||
      profesor.codigo?.toLowerCase().includes(searchFilters.nombre.toLowerCase());
    
    const matchesDepartamento = !searchFilters.departamento || 
      profesor.departamento?.toString() === searchFilters.departamento;
    
    const matchesCarrera = !searchFilters.carrera || 
      (profesor.carreras && profesor.carreras.includes(parseInt(searchFilters.carrera)));

    return matchesNombre && matchesDepartamento && matchesCarrera;
  });

  const handleAdd = () => {
    setEditingProfesor(null);
    setFormData({
      codigo: '',
      nombres: '',
      apellidos: '',
      correo: '',
      departamento: '',
      carreras: [],
      cursos: []
    });
    setShowModal(true);
  };

  const handleEdit = (profesor) => {
    setEditingProfesor(profesor);
    setFormData({
      codigo: profesor.codigo || '',
      nombres: profesor.nombres || '',
      apellidos: profesor.apellidos || '',
      correo: profesor.correo || '',
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
    try {
      if (editingProfesor) {
        await updateItem(editingProfesor.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar el profesor:', error);
      alert('Error al guardar el profesor');
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
      {/* Header con título y botón agregar */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Profesores</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Agregar Nuevo Profesor
        </button>
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
                  <p className="text-gray-500 text-lg">No hay profesores registrados</p>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProfesor ? 'Editar Profesor' : 'Nuevo Profesor'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
                  <input
                    type="text"
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres</label>
                  <input
                    type="text"
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
                  <select
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Seleccionar departamento</option>
                    {departamentos.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.nombre}
                      </option>
                    ))}
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
                    {editingProfesor ? 'Actualizar' : 'Crear'}
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
