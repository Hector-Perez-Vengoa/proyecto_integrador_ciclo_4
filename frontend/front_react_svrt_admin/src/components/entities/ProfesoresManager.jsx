import React, { useState } from 'react';
import DataTable from '../DataTable';
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

  const columns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Nombres', accessor: 'nombres' },
    { header: 'Apellidos', accessor: 'apellidos' },
    { header: 'Email', accessor: 'correo' },
    { 
      header: 'Nombre Completo', 
      render: (item) => item.nombre_completo || `${item.nombres} ${item.apellidos}` 
    },
    { 
      header: 'Departamento', 
      render: (item) => {
        const dept = departamentos.find(d => d.id === item.departamento);
        return dept ? dept.nombre : 'Sin departamento';
      }
    }
  ];

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

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions
    }));
  };

  return (
    <div className="p-6">
      <DataTable
        data={profesores}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Gestión de Profesores"
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingProfesor ? 'Editar Profesor' : 'Nuevo Profesor'}
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
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Departamento</label>
                  <select
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
