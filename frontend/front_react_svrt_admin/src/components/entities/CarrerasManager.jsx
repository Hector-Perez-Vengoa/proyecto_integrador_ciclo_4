import React, { useState } from 'react';
import CarreraCard from './CarreraCard';
import { useCarreras, useDepartamentos } from '../../hooks/useEntities';

const CarrerasManager = () => {
  const { 
    data: carreras, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useCarreras();
  
  const { data: departamentos } = useDepartamentos();

  const [showModal, setShowModal] = useState(false);
  const [editingCarrera, setEditingCarrera] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    departamento: ''
  });

  // Estados para filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    nombre: '',
    codigo: '',
    departamento: ''
  });

  // Función para filtrar carreras
  const filteredCarreras = carreras.filter(carrera => {
    const matchesNombre = !searchFilters.nombre || 
      carrera.nombre?.toLowerCase().includes(searchFilters.nombre.toLowerCase());
    
    const matchesCodigo = !searchFilters.codigo || 
      carrera.codigo?.toLowerCase().includes(searchFilters.codigo.toLowerCase());
    
    const matchesDepartamento = !searchFilters.departamento || 
      carrera.departamento?.toString() === searchFilters.departamento;

    return matchesNombre && matchesCodigo && matchesDepartamento;
  });

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
      codigo: '',
      departamento: ''
    });
  };

  const handleAdd = () => {
    setEditingCarrera(null);
    setFormData({
      nombre: '',
      codigo: '',
      descripcion: '',
      departamento: ''
    });
    setShowModal(true);
  };

  const handleEdit = (carrera) => {
    setEditingCarrera(carrera);
    setFormData({
      nombre: carrera.nombre || '',
      codigo: carrera.codigo || '',
      descripcion: carrera.descripcion || '',
      departamento: carrera.departamento || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta carrera?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error al eliminar la carrera:', error);
        alert('Error al eliminar la carrera');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCarrera) {
        await updateItem(editingCarrera.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar la carrera:', error);
      alert('Error al guardar la carrera');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Header con título y botón agregar */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Carreras</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Agregar Nueva Carrera
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre de la Carrera</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={searchFilters.nombre}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={searchFilters.codigo}
              onChange={handleFilterChange}
              placeholder="Buscar por código..."
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
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {(searchFilters.nombre || searchFilters.codigo || searchFilters.departamento) && (
              <span>Filtros activos: </span>
            )}
            {searchFilters.nombre && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">
                Nombre: "{searchFilters.nombre}"
              </span>
            )}
            {searchFilters.codigo && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">
                Código: "{searchFilters.codigo}"
              </span>
            )}
            {searchFilters.departamento && (
              <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs mr-2">
                Depto: {departamentos.find(d => d.id.toString() === searchFilters.departamento)?.nombre}
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

      {/* Grid de cartas de carreras */}
      {!loading && !error && (
        <>
          {/* Indicador de resultados */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredCarreras.length === carreras.length ? (
              `Mostrando todas las carreras (${carreras.length})`
            ) : (
              `Mostrando ${filteredCarreras.length} de ${carreras.length} carreras`
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarreras.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {carreras.length === 0 ? (
                  <p className="text-gray-500 text-lg">No hay carreras registradas</p>
                ) : (
                  <div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron carreras con los filtros aplicados</p>
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Limpiar filtros para ver todas
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredCarreras.map((carrera) => (
                <CarreraCard
                  key={carrera.id}
                  carrera={carrera}
                  departamentos={departamentos}
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
                {editingCarrera ? 'Editar Carrera' : 'Nueva Carrera'}
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
                    maxLength={3}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
                    {editingCarrera ? 'Actualizar' : 'Crear'}
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

export default CarrerasManager;
