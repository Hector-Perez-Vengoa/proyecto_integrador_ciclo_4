// src/pages/ReglamentosPage.jsx
import React, { useState, useEffect } from 'react';
import { reglamentoService } from '../services/api/reglamentoService';
import PdfViewer from '../components/PdfViewer';

const ReglamentosPage = () => {
  const [reglamentos, setReglamentos] = useState([]);
  const [reglamentoSeleccionado, setReglamentoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    estado: '',
    busqueda: ''
  });
  const [paginacion, setPaginacion] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  useEffect(() => {
    cargarReglamentos();
  }, [filtros, paginacion.page, paginacion.size]);

  const cargarReglamentos = async () => {
    setLoading(true);
    try {
      const params = {
        ...filtros,
        page: paginacion.page,
        size: paginacion.size
      };
      
      const response = await reglamentoService.obtenerReglamentos(params);
      
      if (response.success) {
        setReglamentos(response.data);
        setPaginacion(prev => ({
          ...prev,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        }));
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Error al cargar los reglamentos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (key, value) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
    setPaginacion(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPaginacion(prev => ({ ...prev, page: newPage }));
  };

  const handleVerReglamento = (reglamento) => {
    setReglamentoSeleccionado(reglamento);
  };

  const handleCerrarVisor = () => {
    setReglamentoSeleccionado(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reglamentos de Aulas Virtuales
        </h1>
        <p className="text-gray-600">
          Consulta y descarga los reglamentos vigentes para el uso de las aulas virtuales.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange('tipo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="general">General</option>
              <option value="uso_aulas">Uso de Aulas</option>
              <option value="reservas">Reservas</option>
              <option value="sanciones">Sanciones</option>
              <option value="procedimientos">Procedimientos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => handleFiltroChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="borrador">Borrador</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              placeholder="Buscar por título..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Lista de reglamentos */}
      <div className="bg-white rounded-lg shadow-sm border">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Cargando reglamentos...</span>
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={cargarReglamentos}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        ) : reglamentos.length === 0 ? (
          <div className="text-center p-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2 text-gray-600">No se encontraron reglamentos</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reglamentos.map((reglamento) => (
              <div key={reglamento.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {reglamento.titulo}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {reglamento.descripcion}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {reglamento.tipo}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reglamento.estado === 'activo' ? 'bg-green-100 text-green-800' :
                        reglamento.estado === 'inactivo' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reglamento.estado}
                      </span>
                      <span>Versión {reglamento.version}</span>
                      <span>{reglamento.autor}</span>
                      {reglamento.tamanoLegible && (
                        <span>{reglamento.tamanoLegible}</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>👁️ {reglamento.contadorVisualizaciones || 0} visualizaciones</span>
                      <span>📥 {reglamento.contadorDescargas || 0} descargas</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <button
                      onClick={() => handleVerReglamento(reglamento)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver
                    </button>
                    <button
                      onClick={async () => {
                        const result = await reglamentoService.descargarPdf(reglamento.id, reglamento.nombreArchivo);
                        if (!result.success) {
                          alert('Error al descargar el PDF: ' + result.error);
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loading && !error && paginacion.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando {paginacion.page * paginacion.size + 1} a {Math.min((paginacion.page + 1) * paginacion.size, paginacion.totalElements)} de {paginacion.totalElements} resultados
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(paginacion.page - 1)}
                  disabled={paginacion.page === 0}
                  className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-700">
                  Página {paginacion.page + 1} de {paginacion.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(paginacion.page + 1)}
                  disabled={paginacion.page >= paginacion.totalPages - 1}
                  className="px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visor de PDF */}
      {reglamentoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-full overflow-hidden">
            <PdfViewer
              reglamento={reglamentoSeleccionado}
              onClose={handleCerrarVisor}
              showDownloadButton={true}
              showMaximizeButton={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReglamentosPage;
