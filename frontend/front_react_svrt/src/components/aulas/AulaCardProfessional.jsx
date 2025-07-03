// src/components/aulas/AulaCardProfessional.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  MdDateRange, 
  MdAccessTime, 
  MdSchool, 
  MdBook, 
  MdBuild, 
  MdVisibility,
  MdCheckCircle,
  MdLock,
  MdCalendarToday,
  MdPeople,
  MdSettings,
  MdArrowForward
} from 'react-icons/md';
import { 
  FaCog, 
  FaChair, 
  FaDesktop, 
  FaEthernet, 
  FaSnowflake,
  FaVideo,
  FaMicrophone,
  FaUsb,
  FaWifi,
  FaTv,
  FaKeyboard,
  FaMouse,
  FaPlug,
  FaTools
} from 'react-icons/fa';
import { 
  IoCalendarSharp, 
  IoTimeSharp, 
  IoCheckmarkCircle 
} from 'react-icons/io5';
import { COLORES_ESTADO, LABELS_ESTADO, ICONOS_ESTADO } from '../../constants/aulaVirtual';

const AulaCardProfessional = ({ aula, onSelect, isSelected = false, onOpenModal }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const estadoConfig = COLORES_ESTADO[aula.estado] || COLORES_ESTADO.inactiva;

  // Función para obtener el icono apropiado basado en el nombre del componente
  const getComponentIcon = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('hdmi') || nombreLower.includes('cable')) return <FaUsb className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('silla') || nombreLower.includes('chair')) return <FaChair className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('monitor') || nombreLower.includes('pantalla')) return <FaDesktop className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('ethernet') || nombreLower.includes('red')) return <FaEthernet className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('aire') || nombreLower.includes('acondicionado')) return <FaSnowflake className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('proyector')) return <FaVideo className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('micrófono') || nombreLower.includes('microfono')) return <FaMicrophone className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('tv') || nombreLower.includes('televisor')) return <FaTv className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('teclado') || nombreLower.includes('keyboard')) return <FaKeyboard className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('mouse') || nombreLower.includes('ratón')) return <FaMouse className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('wifi') || nombreLower.includes('inalámbrico')) return <FaWifi className="w-4 h-4 text-tecsup-primary" />;
    if (nombreLower.includes('enchufe') || nombreLower.includes('corriente')) return <FaPlug className="w-4 h-4 text-tecsup-primary" />;
    return <FaTools className="w-4 h-4 text-tecsup-primary" />;
  };

  // Imágenes del carrusel - usar las reales de la API o fallback
  const imagenes = aula.imagenes && aula.imagenes.length > 0 
    ? aula.imagenes.map(img => img.url)
    : [
        'http://localhost:8080/images/aula_generica_1.jpg',
        'http://localhost:8080/images/aula_generica_2.jpg',
        'http://localhost:8080/images/aula_generica_3.jpg'
      ];

  // Componentes - usar los reales de la API o fallback con iconos
  const componentes = aula.componentes && aula.componentes.length > 0 
    ? aula.componentes.map(comp => ({
        ...comp,
        icon: getComponentIcon(comp.nombre)
      }))
    : [
        { nombre: 'Cable HDMI', descripcion: 'Cable para conexión de video y audio en alta definición', icon: getComponentIcon('Cable HDMI') },
        { nombre: 'Silla de Escritorio', descripcion: 'Silla ergonómica y ajustable', icon: getComponentIcon('Silla de Escritorio') },
        { nombre: 'Monitor', descripcion: 'Monitor LED de 24 pulgadas', icon: getComponentIcon('Monitor') },
        { nombre: 'Cable Ethernet', descripcion: 'Cable de red para conexión a internet por cable', icon: getComponentIcon('Cable Ethernet') },
        { nombre: 'Aire Acondicionado', descripcion: 'Sistema de climatización para el aula', icon: getComponentIcon('Aire Acondicionado') }
      ];

  // Cambio automático de imagen cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [imagenes.length]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return fecha;
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return 'No especificada';
    try {
      if (typeof hora === 'string' && hora.includes(':')) {
        const [hours, minutes] = hora.split(':');
        return `${hours}:${minutes}`;
      }
      return hora;
    } catch {
      return hora;
    }
  };

  return (
    <motion.div 
      className={clsx(
        "group relative bg-white rounded-2xl shadow-lg border overflow-hidden cursor-pointer",
        "will-change-transform backdrop-blur-sm",
        isSelected 
          ? 'border-tecsup-primary shadow-tecsup-primary/20 ring-2 ring-tecsup-primary/15' 
          : 'border-gray-200 hover:border-tecsup-primary/40'
      )}
      onClick={() => onSelect?.(aula)}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25 
        }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
      transition={{
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        boxShadow: isHovered 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Carrusel de imágenes */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl bg-gradient-to-br from-tecsup-gray-light to-gray-100">
        <motion.div 
          className="flex"
          animate={{ x: `-${currentImageIndex * 100}%` }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6
          }}
        >
          {imagenes.map((imagen, index) => (
            <div key={index} className="w-full h-48 flex-shrink-0 relative">
              <motion.img
                src={imagen}
                alt={`Aula ${aula.codigo} - Imagen ${index + 1}`}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE2MCIgeT0iOTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgcng9IjgiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5Q0ExQTkiPgo8cGF0aCBkPSJNMTkgM0g1QzMuOSAzIDMgMy45IDMgNVYxOUM5IDIwLjEgMy45IDIxIDUgMjFIMTlDMjAuMSAyMSAyMSAyMC4xIDIxIDE5VjVDMjEgMy45IDIwLjEgMyAxOSAzWk05IDEySDdWMTBIOVYxMlpNMTMgMTJIMTFWMTBIMTNWMTJaTTE3IDEySDE1VjEwSDE3VjEyWiIvPgo8L3N2Zz4KPC9zdmc+';
                }}
              />
              {/* Overlay sutil para mejorar la legibilidad */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </motion.div>

        {/* Overlay de estado */}
        <motion.div 
          className={clsx(
            "absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md",
            "flex items-center space-x-1.5 shadow-lg border border-white/20",
            estadoConfig.badge
          )}
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {aula.estado === 'disponible' ? (
            <MdCheckCircle className="w-4 h-4 text-white drop-shadow-sm" />
          ) : (
            <MdLock className="w-4 h-4 text-white drop-shadow-sm" />
          )}
          <span className="font-semibold text-white drop-shadow-sm">{LABELS_ESTADO[aula.estado]}</span>
        </motion.div>

        {/* Indicadores del carrusel */}
        <motion.div 
          className="absolute bottom-3 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex space-x-2">
            {imagenes.map((_, index) => (
              <motion.button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={clsx(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/60 hover:bg-white/80'
                )}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  scale: index === currentImageIndex ? 1.25 : 1,
                  opacity: index === currentImageIndex ? 1 : 0.6
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Botón de previsualización */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal?.(aula);
          }}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-tecsup-primary backdrop-blur-md border border-white/20 w-10 h-10 rounded-full flex items-center justify-center group/btn"
          title="Vista previa del aula"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
            y: isHovered ? 0 : -10
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <MdVisibility className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Header con código y descripción */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-tecsup-primary to-tecsup-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-black">
                  {aula.codigo}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-tecsup-gray-dark">
                  Aula Virtual {aula.codigo}
                </h3>
                <p className="text-sm text-tecsup-gray-medium">
                  ID: {aula.id}
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {aula.descripcion && (
            <p className="text-sm text-tecsup-gray-medium bg-tecsup-gray-light/30 rounded-lg p-3 mb-4">
              {aula.descripcion}
            </p>
          )}
        </div>

        {/* Información de reserva */}
        {aula.fecha_reserva && (
          <div className={`
            mb-4 p-4 rounded-xl border ${estadoConfig.bg} ${estadoConfig.border}
          `}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <MdCalendarToday className="w-4 h-4 text-tecsup-primary" />
                <div>
                  <span className="font-medium text-tecsup-gray-dark">Fecha:</span>
                  <span className={`ml-2 ${estadoConfig.text} font-semibold`}>
                    {formatearFecha(aula.fecha_reserva)}
                  </span>
                </div>
              </div>
              {(aula.hora_inicio || aula.hora_fin) && (
                <div className="flex items-center space-x-2">
                  <MdAccessTime className="w-4 h-4 text-tecsup-primary" />
                  <div>
                    <span className="font-medium text-tecsup-gray-dark">Horario:</span>
                    <span className={`ml-2 ${estadoConfig.text} font-semibold`}>
                      {formatearHora(aula.hora_inicio)} - {formatearHora(aula.hora_fin)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {aula.motivo_reserva && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="font-medium text-tecsup-gray-dark">Motivo:</span>
                <p className={`mt-1 text-sm ${estadoConfig.text}`}>
                  {aula.motivo_reserva}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Componentes del aula */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-tecsup-gray-dark mb-3 flex items-center">
            <MdBuild className="w-4 h-4 mr-2 text-tecsup-primary" />
            Equipamiento Disponible
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {componentes.slice(0, 4).map((componente, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs bg-tecsup-gray-light/30 rounded-lg p-2">
                <div className="flex-shrink-0">
                  {componente.icon}
                </div>
                <span className="text-tecsup-gray-dark font-medium truncate">
                  {componente.nombre}
                </span>
              </div>
            ))}
          </div>
          {componentes.length > 4 && (
            <p className="text-xs text-tecsup-gray-medium mt-2 text-center">
              +{componentes.length - 4} componentes más
            </p>
          )}
        </div>

        {/* Información del profesor y curso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          {aula.profesor && (
            <div className="flex items-center space-x-2 bg-tecsup-cyan-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-tecsup-cyan-500 rounded-full flex items-center justify-center">
                <MdSchool className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-tecsup-gray-dark">Profesor</p>
                <p className="text-tecsup-cyan-700 font-semibold">ID: {aula.profesor}</p>
              </div>
            </div>
          )}
          
          {aula.curso && (
            <div className="flex items-center space-x-2 bg-tecsup-success/10 rounded-lg p-3">
              <div className="w-8 h-8 bg-tecsup-success rounded-full flex items-center justify-center">
                <MdBook className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-tecsup-gray-dark">Curso</p>
                <p className="text-tecsup-success font-semibold">ID: {aula.curso}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        {aula.estado === 'disponible' && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(aula);
            }}
            className="w-full py-4 px-6 text-white font-semibold rounded-xl flex items-center justify-center space-x-3 group/button relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{
              background: 'linear-gradient(135deg, rgb(0, 182, 241) 0%, rgb(14, 165, 233) 100%)'
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(0, 182, 241, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 17 
            }}
          >
            <motion.span 
              className="text-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <MdCalendarToday className="w-5 h-5" />
            </motion.span>
            <span className="relative z-10 font-bold tracking-wide">Reservar Aula</span>
            
            {/* Icono de flecha */}
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <MdArrowForward className="w-5 h-5" />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Footer con fecha de creación */}
      {aula.fecha_creacion && (
        <div className="px-6 py-3 bg-gradient-to-r from-tecsup-gray-light/50 to-gray-100/50 rounded-b-2xl border-t border-gray-100">
          <p className="text-xs text-tecsup-gray-medium text-center">
            Creada el {formatearFecha(aula.fecha_creacion)}
          </p>
        </div>
      )}

      {/* Indicador de selección */}
      <AnimatePresence>
        {isSelected && (
          <motion.div 
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ 
              scale: 1, 
              rotate: 0,
              transition: { 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }
            }}
            exit={{ scale: 0, rotate: 90 }}
          >
            <motion.div 
              className="w-8 h-8 bg-gradient-to-br from-tecsup-primary to-tecsup-primary/80 rounded-full flex items-center justify-center shadow-lg"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 4px 15px rgba(59, 130, 246, 0.3)",
                  "0 6px 20px rgba(59, 130, 246, 0.4)",
                  "0 4px 15px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.svg 
                className="w-5 h-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Efectos de gradiente hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-tecsup-primary/5 to-transparent rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default AulaCardProfessional;
