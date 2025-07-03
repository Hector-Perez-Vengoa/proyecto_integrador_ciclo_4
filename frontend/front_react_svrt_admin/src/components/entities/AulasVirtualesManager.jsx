import React, { useState } from 'react';
import DataTable from '../DataTable';
import { useAulasVirtuales } from '../../hooks/useEntities';

const AulasVirtualesManager = () => {
  const { 
    data: aulasVirtuales, 
    loading, 
    error, 
    createItem, 
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

  const columns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Descripción', accessor: 'descripcion' },
    { 
      header: 'Estado', 
      render: (item) => {
        const estado = estadoOptions.find(e => e.value === item.estado);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.estado === 'disponible' ? 'bg-green-100 text-green-800' :
            item.estado === 'reservada' ? 'bg-yellow-100 text-yellow-800' :
            item.estado === 'en_uso' ? 'bg-blue-100 text-blue-800' :
            item.estado === 'en_mantenimiento' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {estado ? estado.label : item.estado}
          </span>
        );
      }
    },
    { 
      header: 'Fecha Creación', 
      render: (item) => item.fecha_creacion ? new Date(item.fecha_creacion).toLocaleDateString() : 'N/A'
    }
  ];

  const handleAdd = () => {
    setEditingAula(null);
    setFormData({
      codigo: '',
      descripcion: '',
      estado: 'disponible'
    });
    setShowModal(true);
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
        alert('Error al eliminar el aula virtual');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAula) {
        await updateItem(editingAula.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
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
      <DataTable
        data={aulasVirtuales}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Gestión de Aulas Virtuales"
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingAula ? 'Editar Aula Virtual' : 'Nueva Aula Virtual'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Código</label>
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                    maxLength={2}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={3}
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
                    {editingAula ? 'Actualizar' : 'Crear'}
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
