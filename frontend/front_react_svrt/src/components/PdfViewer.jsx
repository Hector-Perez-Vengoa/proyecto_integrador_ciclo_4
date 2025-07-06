// src/components/PdfViewer.jsx
import React, { useState, useEffect } from 'react';
import { reglamentoService } from '../services/api/reglamentoService';

const PdfViewer = ({ 
  reglamento, 
  onClose, 
  showDownloadButton = true, 
  showMaximizeButton = true 
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Incrementar contador de visualizaciones cuando se abre el PDF
    if (reglamento?.id) {
      reglamentoService.incrementarVisualizaciones(reglamento.id);
    }
  }, [reglamento?.id]);

  const handleDownload = async () => {
    if (!reglamento?.id) return;

    try {
      const result = await reglamentoService.descargarPdf(reglamento.id, reglamento.nombreArchivo);
      if (!result.success) {
        console.error('Error al descargar PDF:', result.error);
        alert('Error al descargar el PDF: ' + result.error);
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar el PDF');
    }
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Error al cargar el PDF');
  };

  if (!reglamento) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay reglamento seleccionado</p>
      </div>
    );
  }

  const containerClasses = isMaximized
    ? "fixed inset-0 z-50 bg-white"
    : "relative bg-white border rounded-lg shadow-lg";

  const headerClasses = isMaximized
    ? "flex items-center justify-between p-4 bg-gray-50 border-b"
    : "flex items-center justify-between p-3 bg-gray-50 border-b rounded-t-lg";

  const viewerClasses = isMaximized
    ? "h-screen-minus-header"
    : "h-96";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className={headerClasses}>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {reglamento.titulo}
          </h3>
          <p className="text-sm text-gray-600">
            Versión {reglamento.version} - {reglamento.autor}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {showDownloadButton && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Descargar PDF"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar
            </button>
          )}
          
          {showMaximizeButton && (
            <button
              onClick={handleMaximize}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title={isMaximized ? "Minimizar" : "Maximizar"}
            >
              {isMaximized ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 15v4.5M15 15h4.5M15 15l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                </svg>
              )}
            </button>
          )}
          
          {(isMaximized || onClose) && (
            <button
              onClick={isMaximized ? handleMaximize : onClose}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className={`relative ${viewerClasses}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Cargando PDF...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <button
                onClick={handleDownload}
                className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Descargar PDF
              </button>
            </div>
          </div>
        )}

        <iframe
          src={reglamento.urlVisualizacion}
          className="w-full h-full border-none"
          title={`PDF: ${reglamento.titulo}`}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* Información adicional */}
      <div className="px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Tipo: {reglamento.tipo}</span>
            <span>Estado: {reglamento.estado}</span>
            {reglamento.tamanoLegible && (
              <span>Tamaño: {reglamento.tamanoLegible}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span>Visualizaciones: {reglamento.contadorVisualizaciones || 0}</span>
            <span>Descargas: {reglamento.contadorDescargas || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
