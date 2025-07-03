// src/components/aulas/AulaPreviewModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdClose, 
  MdArrowBack, 
  MdArrowForward,
  MdCheckCircle,
  MdLock,
  MdDateRange,
  MdAccessTime,
  MdSchool,
  MdBook,
  MdBuild,
  MdDescription,
  MdAssessment
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
import Modal from '../ui/Modal';

const AulaPreviewModal = ({ isOpen, onClose, aula }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Función para obtener el icono apropiado basado en el nombre del componente
  const getComponentIcon = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('hdmi') || nombreLower.includes('cable')) return <FaUsb className="w-4 h-4 text-white" />;
    if (nombreLower.includes('silla') || nombreLower.includes('chair')) return <FaChair className="w-4 h-4 text-white" />;
    if (nombreLower.includes('monitor') || nombreLower.includes('pantalla')) return <FaDesktop className="w-4 h-4 text-white" />;
    if (nombreLower.includes('ethernet') || nombreLower.includes('red')) return <FaEthernet className="w-4 h-4 text-white" />;
    if (nombreLower.includes('aire') || nombreLower.includes('acondicionado')) return <FaSnowflake className="w-4 h-4 text-white" />;
    if (nombreLower.includes('proyector')) return <FaVideo className="w-4 h-4 text-white" />;
    if (nombreLower.includes('micrófono') || nombreLower.includes('microfono')) return <FaMicrophone className="w-4 h-4 text-white" />;
    if (nombreLower.includes('tv') || nombreLower.includes('televisor')) return <FaTv className="w-4 h-4 text-white" />;
    if (nombreLower.includes('teclado') || nombreLower.includes('keyboard')) return <FaKeyboard className="w-4 h-4 text-white" />;
    if (nombreLower.includes('mouse') || nombreLower.includes('ratón')) return <FaMouse className="w-4 h-4 text-white" />;
    if (nombreLower.includes('wifi') || nombreLower.includes('inalámbrico')) return <FaWifi className="w-4 h-4 text-white" />;
    if (nombreLower.includes('enchufe') || nombreLower.includes('corriente')) return <FaPlug className="w-4 h-4 text-white" />;
    return <FaTools className="w-4 h-4 text-white" />;
  };

  // Imágenes del carrusel - usar las reales de la API o fallback
  const imagenes = aula?.imagenes && aula.imagenes.length > 0 
    ? aula.imagenes.map(img => img.url)
    : [
        'http://localhost:8080/images/aula_generica_1.jpg',
        'http://localhost:8080/images/aula_generica_2.jpg',
        'http://localhost:8080/images/aula_generica_3.jpg'
      ];

  // Componentes completos del aula - usar los reales de la API o fallback
  const componentes = aula?.componentes && aula.componentes.length > 0 
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

  // Cambio automático de imagen cada 4 segundos en el modal
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === imagenes.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, imagenes.length]);

  // Reset al cerrar el modal
  useEffect(() => {
    if (!isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen]);

  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-PE', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
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
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-6xl" showCloseButton={false}>
      {aula && (
        <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl ring-1 ring-black/5">
          {/* Header */}
          <div className="relative">
            {/* Carrusel de imágenes mejorado */}
            <div className="relative h-96 overflow-hidden rounded-t-3xl bg-gray-100">
              <motion.div 
                className="flex"
                animate={{ x: `-${currentImageIndex * 100}%` }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.7
                }}
              >
                {imagenes.map((imagen, index) => (
                  <div key={index} className="w-full h-96 flex-shrink-0 flex items-center justify-center bg-gray-50">
                    <motion.img
                      src={imagen}
                      alt={`Aula ${aula.codigo} - Imagen ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjE2MCIgeT0iOTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgcng9IjgiIGZpbGw9IiNEMUQ1REIiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5Q0ExQTkiPgo8cGF0aCBkPSJNMTkgM0g1QzMuOSAzIDMgMy45IDMgNVYxOUM5IDIwLjEgMy45IDIxIDUgMjFIMTlDMjAuMSAyMSAyMSAyMC4xIDIxIDE5VjVDMjEgMy45IDIwLjEgMyAxOSAzWk05IDEySDdWMTBIOVYxMlpNMTMgMTJIMTFWMTBIMTNWMTJaTTE3IDEySDE1VjEwSDE3VjEyWiIvPgo8L3N2Zz4KPC9zdmc+';
                      }}
                    />
                  </div>
                ))}
              </motion.div>
              {/* Gradiente overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
              {/* Información superpuesta mejorada */}
              <motion.div 
                className="absolute bottom-6 left-6 text-white z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
                  Aula Virtual {aula.codigo}
                </h2>
                <p className="text-xl opacity-90 drop-shadow-md">
                  ID: {aula.id}
                </p>
                {aula.descripcion && (
                  <p className="text-lg opacity-80 mt-1 drop-shadow-md max-w-md">
                    {aula.descripcion}
                  </p>
                )}
              </motion.div>
              {/* Botón de cerrar mejorado */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 w-12 h-12 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20 group"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                title="Cerrar vista previa"
              >
                <motion.svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </motion.svg>
              </motion.button>
              {/* Controles del carrusel */}
              <div className="absolute bottom-4 right-6 flex space-x-2">
                <motion.button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? imagenes.length - 1 : prev - 1
                  )}
                  className="w-10 h-10 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  title="Imagen anterior"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <motion.button
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === imagenes.length - 1 ? 0 : prev + 1
                  )}
                  className="w-10 h-10 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  title="Imagen siguiente"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
              {/* Indicadores del carrusel */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {imagenes.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full backdrop-blur-md border border-white/20 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ 
                        scale: index === currentImageIndex ? 1.2 : 1,
                        backgroundColor: index === currentImageIndex ? '#ffffff' : 'rgba(255,255,255,0.4)'
                      }}
                      transition={{ duration: 0.2 }}
                      title={`Imagen ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Contenido del modal */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información principal */}
              <div className="space-y-6">
                {/* Descripción */}
                {aula.descripcion && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-tecsup-gray-dark mb-3 flex items-center">
                      <MdDescription className="w-5 h-5 mr-2 text-tecsup-primary" />
                      Descripción del Aula
                    </h3>
                    <p className="text-tecsup-gray-medium bg-tecsup-gray-light/30 rounded-xl p-4">
                      {aula.descripcion}
                    </p>
                  </motion.div>
                )}

                {/* Estado y disponibilidad */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-tecsup-gray-dark mb-3 flex items-center">
                    <MdAssessment className="w-5 h-5 mr-2 text-tecsup-primary" />
                    Estado Actual
                  </h3>
                  <div className={`
                    p-4 rounded-xl border-2 
                    ${aula.estado === 'disponible' 
                      ? 'bg-tecsup-success/10 border-tecsup-success text-tecsup-success' 
                      : 'bg-tecsup-cyan-500/10 border-tecsup-cyan-500 text-tecsup-cyan-700'
                    }
                  `}>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {aula.estado === 'disponible' ? <MdCheckCircle className="w-6 h-6 text-green-500" /> : <MdLock className="w-6 h-6 text-blue-500" />}
                      </span>
                      <div>
                        <p className="font-semibold text-lg">
                          {aula.estado === 'disponible' ? 'Disponible' : 'Reservada'}
                        </p>
                        <p className="text-sm opacity-75">
                          {aula.estado === 'disponible' 
                            ? 'Lista para ser reservada' 
                            : 'Actualmente en uso'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Información de reserva */}
                {aula.fecha_reserva && (
                  <motion.div
                    className="bg-gradient-to-r from-tecsup-primary/10 to-blue-50 rounded-xl p-6 border border-tecsup-primary/20"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <h3 className="text-lg font-semibold text-tecsup-primary mb-4 flex items-center">
                      <MdDateRange className="w-5 h-5 mr-2" />
                      Información de Reserva
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MdDateRange className="w-4 h-4 text-tecsup-primary" />
                        <div>
                          <span className="font-medium text-tecsup-gray-dark">Fecha:</span>
                          <span className="ml-2 text-tecsup-primary font-semibold">
                            {formatearFecha(aula.fecha_reserva)}
                          </span>
                        </div>
                      </div>
                      
                      {(aula.hora_inicio || aula.hora_fin) && (
                        <div className="flex items-center space-x-3">
                          <MdAccessTime className="w-4 h-4 text-tecsup-primary" />
                          <div>
                            <span className="font-medium text-tecsup-gray-dark">Horario:</span>
                            <span className="ml-2 text-tecsup-primary font-semibold">
                              {formatearHora(aula.hora_inicio)} - {formatearHora(aula.hora_fin)}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {aula.motivo_reserva && (
                        <div className="pt-3 border-t border-tecsup-primary/20">
                          <span className="font-medium text-tecsup-gray-dark">Motivo:</span>
                          <p className="mt-1 text-tecsup-primary">
                            {aula.motivo_reserva}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Información del profesor y curso */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  {aula.profesor && (
                    <div className="flex items-center space-x-3 bg-tecsup-cyan-50 rounded-xl p-4">
                      <div className="w-12 h-12 bg-tecsup-cyan-500 rounded-full flex items-center justify-center">
                        <MdSchool className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-tecsup-gray-dark">Profesor</p>
                        <p className="text-tecsup-cyan-700 font-semibold">ID: {aula.profesor}</p>
                      </div>
                    </div>
                  )}
                  
                  {aula.curso && (
                    <div className="flex items-center space-x-3 bg-tecsup-success/10 rounded-xl p-4">
                      <div className="w-12 h-12 bg-tecsup-success rounded-full flex items-center justify-center">
                        <MdBook className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-tecsup-gray-dark">Curso</p>
                        <p className="text-tecsup-success font-semibold">ID: {aula.curso}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Componentes del aula */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-tecsup-gray-dark mb-4 flex items-center">
                  <MdBuild className="w-5 h-5 mr-2 text-tecsup-primary" />
                  Equipamiento Disponible
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {componentes.map((componente, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="w-8 h-8 bg-tecsup-primary rounded-full flex items-center justify-center flex-shrink-0">
                        {componente.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-tecsup-gray-dark">
                          {componente.nombre}
                        </h4>
                        <p className="text-sm text-tecsup-gray-medium mt-1">
                          {componente.descripcion}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Footer con acciones */}
            <motion.div
              className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <p className="text-sm text-tecsup-gray-medium">
                {aula.fecha_creacion && `Creada el ${formatearFecha(aula.fecha_creacion)}`}
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Cerrar
                </motion.button>
                
                {aula.estado === 'disponible' && (
                  <motion.button
                    onClick={() => {
                      onClose();
                      // Aquí se podría abrir el modal de reserva
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-tecsup-primary to-tecsup-primary/90 text-white rounded-lg font-semibold"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    Reservar Aula
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AulaPreviewModal;
