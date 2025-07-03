import React, { useState } from 'react';
import DepartamentoCard from './DepartamentoCard';
import { useDepartamentos } from '../../hooks/useEntities';

const DepartamentosManager = () => {
  const { 
    data: departamentos, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useDepartamentos();

  const [showModal, setShowModal] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    jefe: ''
  });

  // Estados para filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    nombre: '',
    jefe: ''
  });

  // Función para filtrar departamentos
  const filteredDepartamentos = departamentos.filter(departamento => {
    const matchesNombre = !searchFilters.nombre || 
      departamento.nombre?.toLowerCase().includes(searchFilters.nombre.toLowerCase());
    
    const matchesJefe = !searchFilters.jefe || 
      departamento.jefe?.toLowerCase().includes(searchFilters.jefe.toLowerCase());

    return matchesNombre && matchesJefe;
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
      jefe: ''
    });
  };

  const handleAdd = () => {
    setEditingDepartamento(null);
    setFormData({
      nombre: '',
      descripcion: '',
      jefe: ''
    });
    setShowModal(true);
  };

  const handleEdit = (departamento) => {
    setEditingDepartamento(departamento);
    setFormData({
      nombre: departamento.nombre || '',
      descripcion: departamento.descripcion || '',
      jefe: departamento.jefe || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error al eliminar el departamento:', error);
        alert('Error al eliminar el departamento');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartamento) {
        await updateItem(editingDepartamento.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar el departamento:', error);
      alert('Error al guardar el departamento');
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
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Departamentos</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Agregar Nuevo Departamento
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Departamento</label>
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
            <label htmlFor="jefe" className="block text-sm font-medium text-gray-700">Jefe del Departamento</label>
            <input
              type="text"
              id="jefe"
              name="jefe"
              value={searchFilters.jefe}
              onChange={handleFilterChange}
              placeholder="Buscar por jefe..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {(searchFilters.nombre || searchFilters.jefe) && (
              <span>Filtros activos: </span>
            )}
            {searchFilters.nombre && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">
                Nombre: "{searchFilters.nombre}"
              </span>
            )}
            {searchFilters.jefe && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">
                Jefe: "{searchFilters.jefe}"
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

      {/* Grid de cartas de departamentos */}
      {!loading && !error && (
        <>
          {/* Indicador de resultados */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredDepartamentos.length === departamentos.length ? (
              `Mostrando todos los departamentos (${departamentos.length})`
            ) : (
              `Mostrando ${filteredDepartamentos.length} de ${departamentos.length} departamentos`
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartamentos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {departamentos.length === 0 ? (
                  <p className="text-gray-500 text-lg">No hay departamentos registrados</p>
                ) : (
                  <div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron departamentos con los filtros aplicados</p>
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
              filteredDepartamentos.map((departamento) => (
                <DepartamentoCard
                  key={departamento.id}
                  departamento={departamento}
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
                {editingDepartamento ? 'Editar Departamento' : 'Nuevo Departamento'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label htmlFor="jefe" className="block text-sm font-medium text-gray-700">Jefe</label>
                  <input
                    type="text"
                    id="jefe"
                    name="jefe"
                    value={formData.jefe}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
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
                    {editingDepartamento ? 'Actualizar' : 'Crear'}
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

export default DepartamentosManager;
