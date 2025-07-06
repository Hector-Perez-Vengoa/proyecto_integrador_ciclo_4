import React, { useState } from 'react';
import AulaCard from './AulaCard';
import { useAulasVirtuales } from '../../hooks/useEntities';

const AulasVirtualesManager = () => {
  const { 
    data: aulasVirtuales, 
    loading, 
    error, 
    updateItem, 
    deleteItem 
  } = useAulasVirtuales();

  const [showModal, setShowModal] = useState(false);
  const [editingAula, setEditingAula] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    descripcion: '',
    estado: 'disponible'
  });

  const estadoOptions = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'reservada', label: 'Reservada' },
    { value: 'en_uso', label: 'En Uso' },
    { value: 'en_mantenimiento', label: 'En Mantenimiento' },
    { value: 'inactiva', label: 'Inactiva' },
    { value: 'bloqueada', label: 'Bloqueada' }
  ];

  // Estados para filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    codigo: '',
    estado: ''
  });

  // Función para filtrar aulas
  const filteredAulas = aulasVirtuales.filter(aula => {
    const matchesCodigo = !searchFilters.codigo || 
      aula.codigo?.toLowerCase().includes(searchFilters.codigo.toLowerCase()) ||
      aula.descripcion?.toLowerCase().includes(searchFilters.codigo.toLowerCase());
    
    const matchesEstado = !searchFilters.estado || aula.estado === searchFilters.estado;

    return matchesCodigo && matchesEstado;
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
      codigo: '',
      estado: ''
    });
  };

  const handleEdit = (aula) => {
    setEditingAula(aula);
    setFormData({
      codigo: aula.codigo || '',
      descripcion: aula.descripcion || '',
      estado: aula.estado || 'disponible'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta aula virtual?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error al eliminar el aula virtual:', error);
        alert('Error al eliminar el aula virtual');
      }
    }
  };

  // Nueva función para cambiar estado del aula
  const handleChangeStatus = async (aulaId, newStatus) => {
    try {
      const aula = aulasVirtuales.find(a => a.id === aulaId);
      if (aula) {
        await updateItem(aulaId, { ...aula, estado: newStatus });
      }
    } catch (error) {
      console.error('Error al cambiar el estado del aula:', error);
      alert('Error al cambiar el estado del aula virtual');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAula) {
        await updateItem(editingAula.id, formData);
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al guardar el aula virtual:', error);
      alert('Error al guardar el aula virtual');
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
      {/* Header con título */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Aulas Virtuales</h2>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">Código o Descripción</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={searchFilters.codigo}
              onChange={handleFilterChange}
              placeholder="Buscar por código o descripción..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              id="estado"
              name="estado"
              value={searchFilters.estado}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Todos los estados</option>
              {estadoOptions.map(estado => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {(searchFilters.codigo || searchFilters.estado) && (
              <span>Filtros activos: </span>
            )}
            {searchFilters.codigo && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">
                Búsqueda: "{searchFilters.codigo}"
              </span>
            )}
            {searchFilters.estado && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">
                Estado: {estadoOptions.find(e => e.value === searchFilters.estado)?.label}
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Grid de cartas de aulas virtuales */}
      {!loading && !error && (
        <>
          {/* Indicador de resultados */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredAulas.length === aulasVirtuales.length ? (
              `Mostrando todas las aulas virtuales (${aulasVirtuales.length})`
            ) : (
              `Mostrando ${filteredAulas.length} de ${aulasVirtuales.length} aulas virtuales`
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAulas.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {aulasVirtuales.length === 0 ? (
                  <p className="text-gray-500 text-lg">No hay aulas virtuales registradas</p>
                ) : (
                  <div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron aulas virtuales con los filtros aplicados</p>
                    <button
                      onClick={clearFilters}
                      className="text-purple-600 hover:text-purple-800 underline"
                    >
                      Limpiar filtros para ver todas
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredAulas.map((aula) => (
                <AulaCard
                  key={aula.id}
                  aula={aula}
                  estadoOptions={estadoOptions}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onChangeStatus={handleChangeStatus}
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
                Editar Aula Virtual
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="modal-codigo" className="block text-sm font-medium text-gray-700">Código</label>
                  <input
                    type="text"
                    id="modal-codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                    maxLength={2}
                    placeholder="Ej: A1, B2, C3..."
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    id="modal-descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Descripción del aula virtual..."
                  />
                </div>
                
                <div>
                  <label htmlFor="modal-estado" className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    id="modal-estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    {estadoOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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
                    Actualizar
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

export default AulasVirtualesManager;
