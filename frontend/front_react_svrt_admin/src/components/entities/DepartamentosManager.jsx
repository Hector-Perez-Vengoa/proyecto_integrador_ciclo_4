import React, { useState } from 'react';
import DataTable from '../DataTable';
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

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Descripción', accessor: 'descripcion' },
    { header: 'Jefe', accessor: 'jefe' },
    { 
      header: 'Fecha Creación', 
      render: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString() : 'N/A'
    }
  ];

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
      <DataTable
        data={departamentos}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Gestión de Departamentos"
      />

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
