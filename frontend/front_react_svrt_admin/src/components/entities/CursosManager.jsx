import React, { useState } from 'react';
import CursoCard from './CursoCard';
import { useCursos, useCarreras } from '../../hooks/useEntities';

const CursosManager = () => {
  const { 
    data: cursos, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useCursos();
  
  const { data: carreras } = useCarreras();

  const [showModal, setShowModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    fecha: '',
    carrera: ''
  });

  // Estados para filtros de búsqueda
  const [searchFilters, setSearchFilters] = useState({
    nombre: '',
    carrera: ''
  });

  // Función para filtrar cursos
  const filteredCursos = cursos.filter(curso => {
    const matchesNombre = !searchFilters.nombre || 
      curso.nombre?.toLowerCase().includes(searchFilters.nombre.toLowerCase());
    
    const matchesCarrera = !searchFilters.carrera || 
      curso.carrera?.toString() === searchFilters.carrera;

    return matchesNombre && matchesCarrera;
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
      carrera: ''
    });
  };

  const handleAdd = () => {
    setEditingCurso(null);
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: '',
      fecha: '',
      carrera: ''
    });
    setShowModal(true);
  };

  const handleEdit = (curso) => {
    setEditingCurso(curso);
    setFormData({
      nombre: curso.nombre || '',
      descripcion: curso.descripcion || '',
      duracion: curso.duracion || '',
      fecha: curso.fecha || '',
      carrera: curso.carrera || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error al eliminar el curso:', error);
        alert('Error al eliminar el curso');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCurso) {
        await updateItem(editingCurso.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      alert('Error al guardar el curso');
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
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Cursos</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          Agregar Nuevo Curso
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Búsqueda</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Curso</label>
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
            {(searchFilters.nombre || searchFilters.carrera) && (
              <span>Filtros activos: </span>
            )}
            {searchFilters.nombre && (
              <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs mr-2">
                Nombre: "{searchFilters.nombre}"
              </span>
            )}
            {searchFilters.carrera && (
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs mr-2">
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

      {/* Grid de cartas de cursos */}
      {!loading && !error && (
        <>
          {/* Indicador de resultados */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredCursos.length === cursos.length ? (
              `Mostrando todos los cursos (${cursos.length})`
            ) : (
              `Mostrando ${filteredCursos.length} de ${cursos.length} cursos`
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCursos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                {cursos.length === 0 ? (
                  <p className="text-gray-500 text-lg">No hay cursos registrados</p>
                ) : (
                  <div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron cursos con los filtros aplicados</p>
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
              filteredCursos.map((curso) => (
                <CursoCard
                  key={curso.id}
                  curso={curso}
                  carreras={carreras}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Modal para agregar/editar curso */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCurso ? 'Editar Curso' : 'Nuevo Curso'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="form-nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    id="form-nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="form-descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    id="form-descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="form-duracion" className="block text-sm font-medium text-gray-700">Duración (horas)</label>
                  <input
                    type="number"
                    id="form-duracion"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="form-fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
                  <input
                    type="date"
                    id="form-fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="form-carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                  <select
                    id="form-carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Selecciona una carrera</option>
                    {carreras.map(carrera => (
                      <option key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
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
                    {editingCurso ? 'Actualizar' : 'Crear'}
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

export default CursosManager;
