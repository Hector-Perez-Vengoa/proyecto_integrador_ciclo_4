import React, { useState } from 'react';
import DataTable from '../DataTable';
import { useReservas, useProfesores, useAulasVirtuales, useCursos } from '../../hooks/useEntities';

const ReservasManager = () => {
  const { 
    data: reservas, 
    loading, 
    error, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useReservas();
  
  const { data: profesores } = useProfesores();
  const { data: aulasVirtuales } = useAulasVirtuales();
  const { data: cursos } = useCursos();

  const [showModal, setShowModal] = useState(false);
  const [editingReserva, setEditingReserva] = useState(null);
  const [formData, setFormData] = useState({
    profesor: '',
    aula_virtual: '',
    curso: '',
    hora_inicio: '',
    hora_fin: '',
    fecha_reserva: '',
    motivo: '',
    estado: 'disponible'
  });

  const columns = [
    { 
      header: 'Profesor', 
      render: (item) => {
        if (item.profesor_nombre) return item.profesor_nombre;
        const profesor = profesores.find(p => p.id === item.profesor);
        return profesor ? `${profesor.nombres} ${profesor.apellidos}` : 'Sin profesor';
      }
    },
    { 
      header: 'Aula Virtual', 
      render: (item) => {
        if (item.aula_virtual_codigo) return item.aula_virtual_codigo;
        const aula = aulasVirtuales.find(a => a.id === item.aula_virtual);
        return aula ? aula.codigo : 'Sin aula';
      }
    },
    { 
      header: 'Curso', 
      render: (item) => {
        if (item.curso_nombre) return item.curso_nombre;
        const curso = cursos.find(c => c.id === item.curso);
        return curso ? curso.nombre : 'Sin curso';
      }
    },
    { header: 'Fecha', accessor: 'fecha_reserva' },
    { header: 'Hora Inicio', accessor: 'hora_inicio' },
    { header: 'Hora Fin', accessor: 'hora_fin' },
    { header: 'Motivo', accessor: 'motivo' },
    { 
      header: 'Estado', 
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.estado === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.estado === 'disponible' ? 'Disponible' : 'Reservado'}
        </span>
      )
    }
  ];

  const handleAdd = () => {
    setEditingReserva(null);
    setFormData({
      profesor: '',
      aula_virtual: '',
      curso: '',
      hora_inicio: '',
      hora_fin: '',
      fecha_reserva: '',
      motivo: '',
      estado: 'disponible'
    });
    setShowModal(true);
  };

  const handleEdit = (reserva) => {
    setEditingReserva(reserva);
    setFormData({
      profesor: reserva.profesor || '',
      aula_virtual: reserva.aula_virtual || '',
      curso: reserva.curso || '',
      hora_inicio: reserva.hora_inicio || '',
      hora_fin: reserva.hora_fin || '',
      fecha_reserva: reserva.fecha_reserva || '',
      motivo: reserva.motivo || '',
      estado: reserva.estado || 'disponible'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        alert('Error al eliminar la reserva');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReserva) {
        await updateItem(editingReserva.id, formData);
      } else {
        await createItem(formData);
      }
      setShowModal(false);
    } catch (error) {
      alert('Error al guardar la reserva');
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
        data={reservas}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Gestión de Reservas"
      />

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingReserva ? 'Editar Reserva' : 'Nueva Reserva'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profesor</label>
                  <select
                    name="profesor"
                    value={formData.profesor}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar profesor</option>
                    {profesores.map(profesor => (
                      <option key={profesor.id} value={profesor.id}>
                        {profesor.nombres} {profesor.apellidos}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aula Virtual</label>
                  <select
                    name="aula_virtual"
                    value={formData.aula_virtual}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar aula virtual</option>
                    {aulasVirtuales.filter(aula => aula.estado === 'disponible').map(aula => (
                      <option key={aula.id} value={aula.id}>
                        {aula.codigo} - {aula.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Curso</label>
                  <select
                    name="curso"
                    value={formData.curso}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Seleccionar curso</option>
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha de Reserva</label>
                  <input
                    type="date"
                    name="fecha_reserva"
                    value={formData.fecha_reserva}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
                  <input
                    type="time"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hora de Fin</label>
                  <input
                    type="time"
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Motivo</label>
                  <input
                    type="text"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
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
                    <option value="disponible">Disponible</option>
                    <option value="reservado">Reservado</option>
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
                    {editingReserva ? 'Actualizar' : 'Crear'}
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

export default ReservasManager;
