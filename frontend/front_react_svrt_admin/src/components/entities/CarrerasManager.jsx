import React, { useState } from 'react';
import DataTable from '../DataTable';
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

  const columns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Descripción', accessor: 'descripcion' },
    { 
      header: 'Departamento', 
      render: (item) => {
        const dept = departamentos.find(d => d.id === item.departamento);
        return dept ? dept.nombre : 'Sin departamento';
      }
    },
    { 
      header: 'Fecha Creación', 
      render: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString() : 'N/A'
    }
  ];

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
      <DataTable
        data={carreras}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Gestión de Carreras"
      />

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
