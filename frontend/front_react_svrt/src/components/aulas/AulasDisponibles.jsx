// src/components/aulas/AulasDisponibles.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { aulaVirtualService } from '../../services';
import { FILTROS_AULA, ORDENAMIENTO, ESTADOS_AULA } from '../../constants/aulaVirtual';
import { useAuth } from '../../hooks/useAuth';
import { showToast } from '../../utils/authUtils';
import AulaCard from './AulaCard';
import AulaFilters from './AulaFilters';
import AulaLoading from './AulaLoading';
import FiltrosAvanzados from './FiltrosAvanzados';
import ReservaModal from '../reservas/ReservaModal';

const AulasDisponibles = () => {
  // Estados
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroActual, setFiltroActual] = useState(FILTROS_AULA.DISPONIBLES);
  const [ordenamiento, setOrdenamiento] = useState(ORDENAMIENTO.CODIGO_ASC);
  const [busqueda, setBusqueda] = useState('');
  const [aulaSeleccionada, setAulaSeleccionada] = useState(null);
  const [datosProfesor, setDatosProfesor] = useState({ profesor: '', total: 0 });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [filtrosAvanzados, setFiltrosAvanzados] = useState({});
  
  // Estados para el modal de reserva
  const [modalReservaAbierto, setModalReservaAbierto] = useState(false);
  const [aulaParaReserva, setAulaParaReserva] = useState(null);
  
  const { user } = useAuth();
  const hasLoadedOnce = useRef(false);
  useEffect(() => {
    if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
      cargarAulasDisponibles();
    }
  }, []);

  // Manejar cambios en filtros avanzados
  const handleFiltrosAvanzadosChange = (nuevosFiltros) => {
    setFiltrosAvanzados(nuevosFiltros);
    
    // Aplicar filtros inmediatamente si hay algún filtro activo
    if (Object.values(nuevosFiltros).some(valor => valor !== '')) {
      cargarAulasDisponibles(nuevosFiltros);
    } else {
      // Si no hay filtros, cargar todas las aulas disponibles
      cargarAulasDisponibles();
    }
  };
  const cargarAulasDisponibles = async (filtrosPersonalizados = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await aulaVirtualService.obtenerAulasDisponibles(filtrosPersonalizados);
      
      if (response.success) {
        setAulas(response.data.aulas || []);
        setDatosProfesor({
          profesor: response.data.profesor || '',
          total: response.data.total || 0
        });
      } else {
        setError(response.message || 'Error al cargar las aulas disponibles');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const cargarTodasLasAulas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await aulaVirtualService.obtenerAulas();
      
      if (response.success) {
        setAulas(response.data || []);
        setDatosProfesor({ profesor: '', total: response.data.length });
      } else {
        setError(response.message || 'Error al cargar las aulas');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }  };
  
  // Cambiar entre diferentes tipos de filtros (sin ejecutar en carga inicial)
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return; // No ejecutar en la primera carga
    }
    
    if (filtroActual === FILTROS_AULA.DISPONIBLES) {
      cargarAulasDisponibles();
    } else {
      cargarTodasLasAulas();
    }
  }, [filtroActual]);

  // Filtrar y ordenar aulas
  const aulasFiltradas = useMemo(() => {
    let aulasResultado = [...aulas];

    // Aplicar filtro por estado
    if (filtroActual === FILTROS_AULA.DISPONIBLES) {
      aulasResultado = aulasResultado.filter(aula => aula.estado === ESTADOS_AULA.DISPONIBLE);
    } else if (filtroActual === FILTROS_AULA.RESERVADAS) {
      aulasResultado = aulasResultado.filter(aula => aula.estado === ESTADOS_AULA.RESERVADA);
    }

    // Aplicar búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase().trim();
      aulasResultado = aulasResultado.filter(aula => 
        aula.codigo?.toLowerCase().includes(busquedaLower) ||
        aula.id?.toString().includes(busquedaLower) ||
        aula.motivo_reserva?.toLowerCase().includes(busquedaLower) ||
        aula.estado?.toLowerCase().includes(busquedaLower)
      );
    }

    // Aplicar ordenamiento
    aulasResultado.sort((a, b) => {
      switch (ordenamiento) {
        case ORDENAMIENTO.CODIGO_ASC:
          return (a.codigo || '').localeCompare(b.codigo || '');
        case ORDENAMIENTO.CODIGO_DESC:
          return (b.codigo || '').localeCompare(a.codigo || '');
        case ORDENAMIENTO.ESTADO_ASC:
          return (a.estado || '').localeCompare(b.estado || '');
        case ORDENAMIENTO.ESTADO_DESC:
          return (b.estado || '').localeCompare(a.estado || '');
        default:
          return 0;
      }
    });

    return aulasResultado;
  }, [aulas, filtroActual, busqueda, ordenamiento]);

  // Manejar reintento
  const handleReintento = () => {
    if (filtroActual === FILTROS_AULA.DISPONIBLES) {
      cargarAulasDisponibles();
    } else {
      cargarTodasLasAulas();
    }
  };
  // Manejar selección de aula
  const handleSeleccionarAula = (aula) => {
    setAulaSeleccionada(aulaSeleccionada?.id === aula.id ? null : aula);
    
    // Abrir modal de reserva si el aula está disponible
    if (aula.estado === 'disponible') {
      setAulaParaReserva(aula);
      setModalReservaAbierto(true);
    }
  };

  // Manejar cierre del modal
  const handleCerrarModal = () => {
    setModalReservaAbierto(false);
    setAulaParaReserva(null);
  };

  // Manejar éxito de reserva
  const handleReservaExitosa = () => {
    showToast('¡Reserva creada exitosamente!', 'success');
    handleCerrarModal();
    // Recargar la lista de aulas para mostrar los cambios
    if (filtroActual === FILTROS_AULA.DISPONIBLES) {
      cargarAulasDisponibles(filtrosAvanzados);
    } else {
      cargarTodasLasAulas();
    }
  };

  // Manejar error de reserva
  const handleErrorReserva = (mensaje) => {
    showToast(mensaje || 'Error al crear la reserva', 'error');
  };

  if (loading) {
    return <AulaLoading />;
  }

  return (
    <div className="min-h-screen bg-tecsup-gray-light/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-tecsup-gray-dark mb-2">
                Aulas Virtuales TECSUP
              </h1>
              <p className="text-tecsup-gray-medium">
                Gestiona y consulta el estado de las aulas virtuales disponibles
              </p>
              {datosProfesor.profesor && (
                <p className="text-sm text-tecsup-primary mt-1">
                  👨‍🏫 Profesor: {datosProfesor.profesor}
                </p>
              )}
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">              
              <button
                onClick={handleReintento}
                className="
                  flex items-center space-x-2 px-4 py-2 text-white 
                  rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                  focus:ring-2 focus:ring-blue-500/20 focus:outline-none
                  transform hover:scale-105 active:scale-95
                "
                style={{
                  background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 bg-tecsup-danger/10 border border-tecsup-danger/20 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-tecsup-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-tecsup-danger mb-1">
                  Error al cargar las aulas
                </h3>
                <p className="text-sm text-tecsup-danger/80">{error}</p>
              </div>
              <button
                onClick={handleReintento}
                className="
                  flex-shrink-0 px-3 py-1 bg-tecsup-danger text-white text-sm rounded
                  hover:bg-tecsup-danger/90 transition-colors duration-200
                "
              >
                Reintentar
              </button>
            </div>
          </div>        )}

        {/* Filtros Avanzados */}
        <FiltrosAvanzados
          onFiltrosChange={handleFiltrosAvanzadosChange}
          filtrosIniciales={filtrosAvanzados}
        />

        {/* Filtros */}
        <AulaFilters
          filtroActual={filtroActual}
          onFiltroChange={setFiltroActual}
          ordenamiento={ordenamiento}
          onOrdenamientoChange={setOrdenamiento}
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          totalAulas={aulas.length}
          aulasVisibles={aulasFiltradas.length}
        />

        {/* Contenido principal */}
        {aulasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-tecsup-gray-light rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-tecsup-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-tecsup-gray-dark mb-2">
              No se encontraron aulas
            </h3>
            <p className="text-tecsup-gray-medium mb-4">
              {busqueda.trim() 
                ? 'No hay aulas que coincidan con tu búsqueda'
                : 'No hay aulas disponibles en este momento'
              }
            </p>
            {busqueda.trim() && (
              <button
                onClick={() => setBusqueda('')}
                className="
                  px-4 py-2 bg-tecsup-primary text-white rounded-lg
                  hover:bg-tecsup-primary/90 transition-colors duration-200
                "
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {aulasFiltradas.map((aula) => (
              <AulaCard
                key={aula.id}
                aula={aula}
                onSelect={handleSeleccionarAula}
                isSelected={aulaSeleccionada?.id === aula.id}
              />
            ))}
          </div>
        )}        {/* Información adicional si hay aula seleccionada */}
        {aulaSeleccionada && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-tecsup-primary/20 p-6">
            <h3 className="text-lg font-semibold text-tecsup-gray-dark mb-4">
              Aula Seleccionada: {aulaSeleccionada.codigo}
            </h3>
            <div className="text-sm text-tecsup-gray-medium">
              <p>📝 <strong>Descripción:</strong> {aulaSeleccionada.descripcion}</p>
              <p>👥 <strong>Capacidad:</strong> {aulaSeleccionada.capacidad} estudiantes</p>
              <p>📊 <strong>Estado:</strong> {aulaSeleccionada.estado}</p>
              {aulaSeleccionada.estado === 'disponible' && (
                <p className="mt-2 text-tecsup-primary font-medium">
                  ✨ Haz clic en el aula para hacer una reserva
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Modal de Reserva */}
        <ReservaModal
          isOpen={modalReservaAbierto}
          onClose={handleCerrarModal}
          aula={aulaParaReserva}
          profesor={user}
          onSuccess={handleReservaExitosa}
          onError={handleErrorReserva}
        />
      </div>
    </div>
  );
};

export default AulasDisponibles;
