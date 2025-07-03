// src/components/aulas/FiltrosAvanzados.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FILTROS_AULA, ORDENAMIENTO, LABELS_ESTADO } from '../../constants/aulaVirtual';
import { 
  MdSearch, 
  MdFilterList, 
  MdClear, 
  MdExpandMore, 
  MdExpandLess,
  MdCheckCircle,
  MdLock,
  MdRefresh,
  MdTune,
  MdClose,
  MdAutoAwesome,
  MdDateRange,
  MdAccessTime,
  MdSchool,
  MdSort,
  MdViewList,
  MdKeyboard
} from 'react-icons/md';
import { 
  FiFilter, 
  FiX, 
  FiSearch, 
  FiCalendar, 
  FiClock, 
  FiSettings,
  FiRefreshCw,
  FiZap,
  FiEye
} from 'react-icons/fi';

const FiltrosAvanzados = ({ 
  onFiltrosChange, 
  filtrosIniciales = {},
  filtroActual, 
  onFiltroChange, 
  ordenamiento, 
  onOrdenamientoChange,
  busqueda,
  onBusquedaChange,
  totalAulas,
  aulasVisibles
}) => {
  const [filtros, setFiltros] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    cursoId: '',
    ...filtrosIniciales
  });

  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [modoCompacto, setModoCompacto] = useState(false);

  // Lista de cursos con categorías
  const cursosDisponibles = useMemo(() => [
    { 
      categoria: 'Tecnología',
      cursos: [
        { id: 1, nombre: 'Programación Orientada a Objetos', codigo: 'POO-101' },
        { id: 2, nombre: 'Base de Datos', codigo: 'BD-201' },
        { id: 3, nombre: 'Desarrollo Web Frontend', codigo: 'FE-301' },
        { id: 4, nombre: 'Desarrollo Web Backend', codigo: 'BE-302' },
        { id: 5, nombre: 'Configuración de Redes', codigo: 'NET-401' },
        { id: 6, nombre: 'Seguridad Informática', codigo: 'SEC-501' }
      ]
    },
    { 
      categoria: 'Gestión',
      cursos: [
        { id: 7, nombre: 'Gestión de Calidad', codigo: 'GC-101' },
        { id: 8, nombre: 'Lean Manufacturing', codigo: 'LM-201' },
        { id: 11, nombre: 'Gestión Empresarial', codigo: 'GE-301' },
        { id: 12, nombre: 'Marketing Digital', codigo: 'MD-401' }
      ]
    },
    { 
      categoria: 'Ingeniería',
      cursos: [
        { id: 9, nombre: 'Diseño Mecánico CAD', codigo: 'CAD-101' },
        { id: 10, nombre: 'Automatización Industrial', codigo: 'AI-201' }
      ]
    }
  ], []);

  // Manejar cambios en los filtros sin recargar
  const handleFiltroChange = useCallback((campo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: valor
    };
    setFiltros(nuevosFiltros);
    onFiltrosChange?.(nuevosFiltros);
  }, [filtros, onFiltrosChange]);

  // Limpiar todos los filtros
  const limpiarTodosFiltros = useCallback(() => {
    const filtrosVacios = {
      fecha: '',
      horaInicio: '',
      horaFin: '',
      cursoId: ''
    };
    setFiltros(filtrosVacios);
    onFiltrosChange?.(filtrosVacios);
    onBusquedaChange?.('');
    onFiltroChange?.(FILTROS_AULA.TODOS);
    onOrdenamientoChange?.(ORDENAMIENTO.CODIGO_ASC);
  }, [onFiltrosChange, onBusquedaChange, onFiltroChange, onOrdenamientoChange]);

  // Obtener fecha actual
  const fechaActual = new Date().toISOString().split('T')[0];

  // Contar filtros activos
  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (busqueda) count++;
    if (filtroActual !== FILTROS_AULA.TODOS) count++;
    if (Object.values(filtros).some(valor => valor !== '')) count++;
    return count;
  }, [busqueda, filtroActual, filtros]);

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const expandVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Backdrop con efecto glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/50 to-cyan-50/30 backdrop-blur-xl rounded-3xl -z-10" />
      
      {/* Contenedor principal */}
      <motion.div 
        className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        variants={cardVariants}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 8px 20px -5px rgba(0, 182, 241, 0.1)'
        }}
      >
        {/* Header moderno con estadísticas */}
        <div className="relative px-8 py-6 bg-gradient-to-r from-tecsup-primary/5 via-cyan-500/5 to-blue-500/5">
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-32 opacity-10">
            <div className="absolute top-4 right-4 w-8 h-8 bg-tecsup-primary rounded-full animate-pulse" />
            <div className="absolute top-8 right-16 w-4 h-4 bg-cyan-500 rounded-full animate-pulse delay-300" />
            <div className="absolute top-16 right-8 w-6 h-6 bg-blue-500 rounded-full animate-pulse delay-700" />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <FiFilter className="w-7 h-7 text-white" />
              </motion.div>
              
              <div>
                <h1 className="text-2xl font-bold text-tecsup-gray-dark">
                  Sistema de Filtros 
                </h1>
                <p className="text-tecsup-gray-medium mt-1 flex items-center space-x-2">
                  <FiEye className="w-4 h-4" />
                  <span>Mostrando {aulasVisibles} de {totalAulas} aulas virtuales</span>
                </p>
              </div>
            </div>
            
            {/* Estadísticas visuales */}
            <div className="flex items-center space-x-6 mt-4 lg:mt-0">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 rounded-full">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-700">Disponibles</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-amber-100 rounded-full">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-amber-700">Reservadas</span>
                </div>
              </motion.div>

              {/* Toggle modo compacto */}
              <motion.button
                onClick={() => setModoCompacto(!modoCompacto)}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdViewList className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">Compacto</span>
              </motion.button>
            </div>
          </div>

          {/* Indicador de filtros activos */}
          <AnimatePresence>
            {filtrosActivos > 0 && (
              <motion.div
                className="mt-4 flex items-center space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.div 
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-white shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiZap className="w-4 h-4" />
                  <span className="text-sm font-bold">{filtrosActivos} filtros activos</span>
                </motion.div>
                <motion.button
                  onClick={limpiarTodosFiltros}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-full transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX className="w-4 h-4" />
                  <span className="text-sm font-medium">Limpiar todo</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filtros principales */}
        <div className="p-8">
          <div className={`grid gap-6 ${modoCompacto ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2'}`}>
            {/* Búsqueda unificada */}
            <motion.div 
              className={modoCompacto ? 'md:col-span-1' : 'lg:col-span-1'}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <label className="flex items-center text-sm font-semibold text-tecsup-gray-dark mb-3">
                <FiSearch className="w-4 h-4 mr-2 text-tecsup-primary" />
                Búsqueda 
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdSearch className="h-5 w-5 text-tecsup-gray-medium group-focus-within:text-tecsup-primary transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por código, descripción, ID..."
                  value={busqueda}
                  onChange={(e) => onBusquedaChange?.(e.target.value)}
                  className="
                    w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl
                    focus:border-tecsup-primary focus:ring-4 focus:ring-tecsup-primary/10
                    transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm
                    group-hover:border-tecsup-primary/40 group-hover:shadow-lg
                  "
                />
                <AnimatePresence>
                  {busqueda && (
                    <motion.button
                      onClick={() => onBusquedaChange?.('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors">
                        <FiX className="h-4 w-4 text-red-600" />
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Ordenamiento */}
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <label className="flex items-center text-sm font-semibold text-tecsup-gray-dark mb-3">
                <MdSort className="w-4 h-4 mr-2 text-tecsup-primary" />
                Ordenar Resultados
              </label>
              <select
                value={ordenamiento}
                onChange={(e) => onOrdenamientoChange?.(e.target.value)}
                className="
                  w-full px-4 py-4 border-2 border-gray-200 rounded-2xl
                  focus:border-tecsup-primary focus:ring-4 focus:ring-tecsup-primary/10
                  transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm
                  hover:border-tecsup-primary/40 hover:shadow-lg appearance-none cursor-pointer
                "
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value={ORDENAMIENTO.CODIGO_ASC}>📝 Código (A-Z)</option>
                <option value={ORDENAMIENTO.CODIGO_DESC}>📝 Código (Z-A)</option>
                <option value={ORDENAMIENTO.ESTADO_ASC}>🔄 Estado (A-Z)</option>
                <option value={ORDENAMIENTO.ESTADO_DESC}>🔄 Estado (Z-A)</option>
              </select>
            </motion.div>
          </div>

          {/* Filtros rápidos mejorados */}
          <motion.div 
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-tecsup-gray-dark flex items-center">
                <MdAutoAwesome className="w-5 h-5 mr-2 text-tecsup-primary" />
                Filtros Rápidos
              </h3>
              <motion.button
                onClick={limpiarTodosFiltros}
                className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none transform hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">Restablecer</span>
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.button
                onClick={() => onFiltroChange?.(FILTROS_AULA.DISPONIBLES)}
                className={`
                  group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                  ${filtroActual === FILTROS_AULA.DISPONIBLES
                    ? 'border-emerald-500 bg-emerald-50 shadow-emerald-200/50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg'
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${filtroActual === FILTROS_AULA.DISPONIBLES 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200'
                    }
                  `}>
                    <MdCheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-tecsup-gray-dark">Aulas Disponibles</p>
                    <p className="text-sm text-tecsup-gray-medium">Listas para reservar</p>
                  </div>
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => onFiltroChange?.(FILTROS_AULA.RESERVADAS)}
                className={`
                  group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                  ${filtroActual === FILTROS_AULA.RESERVADAS
                    ? 'border-amber-500 bg-amber-50 shadow-amber-200/50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-lg'
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${filtroActual === FILTROS_AULA.RESERVADAS 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'
                    }
                  `}>
                    <MdLock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-tecsup-gray-dark">Aulas Reservadas</p>
                    <p className="text-sm text-tecsup-gray-medium">Actualmente ocupadas</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                onClick={() => onFiltroChange?.(FILTROS_AULA.TODOS)}
                className={`
                  group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                  ${filtroActual === FILTROS_AULA.TODOS
                    ? 'border-blue-500 bg-blue-50 shadow-blue-200/50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg'
                  }
                `}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${filtroActual === FILTROS_AULA.TODOS 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                    }
                  `}>
                    <MdViewList className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-tecsup-gray-dark">Todas las Aulas</p>
                    <p className="text-sm text-tecsup-gray-medium">Ver sin filtros</p>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Filtros avanzados colapsables */}
          <motion.div 
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="flex items-center justify-between w-full p-4 text-left bg-tecsup-gray-light/30 hover:bg-tecsup-gray-light/50 rounded-2xl transition-all duration-300 group"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                }}>
                  <FiSettings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-tecsup-gray-dark">Filtros Avanzados</p>
                  <p className="text-sm text-tecsup-gray-medium">Búsqueda por fecha, hora y curso</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: mostrarFiltrosAvanzados ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <MdExpandMore className="w-6 h-6 text-tecsup-gray-medium group-hover:text-tecsup-primary transition-colors" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {mostrarFiltrosAvanzados && (
                <motion.div
                  variants={expandVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="overflow-hidden"
                >
                  <div className="mt-6 space-y-6">
                    {/* Filtros de fecha y hora */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-tecsup-gray-dark mb-3">
                          <FiCalendar className="w-4 h-4 mr-2 text-tecsup-primary" />
                          Fecha de Consulta
                        </label>
                        <input
                          type="date"
                          value={filtros.fecha}
                          onChange={(e) => handleFiltroChange('fecha', e.target.value)}
                          min={fechaActual}
                          className="
                            w-full px-4 py-4 border-2 border-gray-200 rounded-2xl
                            focus:border-tecsup-primary focus:ring-4 focus:ring-tecsup-primary/10
                            transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm
                            hover:border-tecsup-primary/40 hover:shadow-lg
                          "
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-tecsup-gray-dark mb-3">
                          <FiClock className="w-4 h-4 mr-2 text-tecsup-primary" />
                          Hora de Inicio
                        </label>
                        <input
                          type="time"
                          value={filtros.horaInicio}
                          onChange={(e) => handleFiltroChange('horaInicio', e.target.value)}
                          className="
                            w-full px-4 py-4 border-2 border-gray-200 rounded-2xl
                            focus:border-tecsup-primary focus:ring-4 focus:ring-tecsup-primary/10
                            transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm
                            hover:border-tecsup-primary/40 hover:shadow-lg
                          "
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="flex items-center text-sm font-semibold text-tecsup-gray-dark mb-3">
                          <FiClock className="w-4 h-4 mr-2 text-tecsup-primary" />
                          Hora de Fin
                        </label>
                        <input
                          type="time"
                          value={filtros.horaFin}
                          onChange={(e) => handleFiltroChange('horaFin', e.target.value)}
                          min={filtros.horaInicio}
                          className="
                            w-full px-4 py-4 border-2 border-gray-200 rounded-2xl
                            focus:border-tecsup-primary focus:ring-4 focus:ring-tecsup-primary/10
                            transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm
                            hover:border-tecsup-primary/40 hover:shadow-lg
                          "
                        />
                      </motion.div>
                    </div>

                    {/* Filtro por curso con categorías */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="flex items-center text-sm font-semibold text-tecsup-gray-dark mb-3">
                        <MdSchool className="w-4 h-4 mr-2 text-tecsup-primary" />
                        Curso Académico
                      </label>
                      <select
                        value={filtros.cursoId}
                        onChange={(e) => handleFiltroChange('cursoId', e.target.value)}
                        className="
                          w-full px-4 py-4 border-2 border-gray-200 rounded-2xl
                          focus:border-tecsup-primary focus:ring-4 focus:ring-tecsup-primary/10
                          transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm
                          hover:border-tecsup-primary/40 hover:shadow-lg appearance-none cursor-pointer
                        "
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                      >
                        <option value="">🎓 Todos los cursos</option>
                        {cursosDisponibles.map(categoria => (
                          <optgroup key={categoria.categoria} label={categoria.categoria}>
                            {categoria.cursos.map(curso => (
                              <option key={curso.id} value={curso.id}>
                                {curso.codigo} - {curso.nombre}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </motion.div>

                    {/* Información de ayuda con diseño moderno */}
                    <motion.div 
                      className="bg-blue-50 border-2 border-blue-200/50 rounded-2xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                            <MdAutoAwesome className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900 mb-2">
                            💡 Filtros Inteligentes
                          </h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            <strong>Sistema avanzado:</strong> Los filtros de fecha y hora te mostrarán únicamente las aulas que NO tienen reservas conflictivas en ese momento específico. 
                            Puedes combinar múltiples filtros para encontrar exactamente lo que necesitas.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Botones de acción */}
                    <motion.div 
                      className="flex flex-wrap gap-4 pt-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        onClick={() => {
                          setFiltros({
                            fecha: '',
                            horaInicio: '',
                            horaFin: '',
                            cursoId: ''
                          });
                          onFiltrosChange?.({
                            fecha: '',
                            horaInicio: '',
                            horaFin: '',
                            cursoId: ''
                          });
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdClear className="w-5 h-5" />
                        <span>Limpiar Filtros Avanzados</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setMostrarFiltrosAvanzados(false)}
                        className="flex items-center space-x-2 px-6 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #00b6f1 0%, #0ea5e9 100%)'
                        }}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdKeyboard className="w-5 h-5" />
                        <span>Aplicar Filtros</span>
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FiltrosAvanzados;
