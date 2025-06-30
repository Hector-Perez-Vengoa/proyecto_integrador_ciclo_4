import React, { useState } from 'react';
import DataTable from '../DataTable';
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

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Descripción', accessor: 'descripcion' },
    { header: 'Duración (hrs)', accessor: 'duracion' },
    { header: 'Fecha', accessor: 'fecha' },
    { 
      header: 'Carrera', 
      render: (item) => {
        const carrera = carreras.find(c => c.id === item.carrera);
        return carrera ? carrera.nombre : 'Sin carrera';
      }
    },
    { 
      header: 'Fecha Creación', 
      render: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString() : 'N/A'
    }
  ];

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
      <DataTable
        data={cursos}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Gestión de Cursos"
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCurso ? 'Editar Curso' : 'Nuevo Curso'}
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
                  <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">Duración (horas)</label>
                  <input
                    type="number"
                    id="duracion"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    min="1"
                  />
                </div>
                
                <div>
                  <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha</label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                
                <div>
                  <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
                  <select
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Seleccionar carrera</option>
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
