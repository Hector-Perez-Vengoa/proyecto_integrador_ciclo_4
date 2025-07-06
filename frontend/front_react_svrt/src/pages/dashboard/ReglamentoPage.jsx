// src/pages/dashboard/ReglamentoPage.jsx
import React, { useState, useEffect } from 'react';

const ReglamentoPage = () => {
  const [pdfExists, setPdfExists] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ruta al PDF local
  const pdfPath = '/uploads/reglamentos/reglamento_aulas_virtuales_2025.pdf';

  useEffect(() => {
    // Verificar si el PDF existe
    const checkPdf = async () => {
      try {
        const response = await fetch(pdfPath, { method: 'HEAD' });
        setPdfExists(response.ok);
      } catch (error) {
        console.error('Error checking PDF:', error);
        setPdfExists(false);
      } finally {
        setLoading(false);
      }
    };

    checkPdf();
  }, []);

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = 'reglamento_aulas_virtuales_docentes_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPdfInNewTab = () => {
    window.open(pdfPath, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 page-transition-elegant">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando disponibilidad del reglamento...</p>
        </div>
      </div>
    );
  }

  if (!pdfExists) {
    return (
      <div className="flex-1 page-transition-elegant">
        <div className="text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-yellow-800 font-semibold mb-2">Reglamento no encontrado</h3>
            <p className="text-yellow-600 text-sm mb-4">
              El archivo PDF del reglamento no está disponible en este momento.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 page-transition-elegant">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Reglamento de Aulas Virtuales para Docentes
              </h1>
              <p className="text-gray-600 mt-1">
                TECSUP - Normativas y procedimientos para docentes
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={openPdfInNewTab}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Abrir en nueva pestaña
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Información del reglamento */}
        <div className="bg-blue-50 border-b px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold">Reglamento Disponible</h3>
              <p className="text-blue-600 text-sm">
                Documento oficial con las normativas para el uso de aulas virtuales por parte de los docentes
              </p>
            </div>
          </div>
        </div>

        {/* Visor PDF con iframe */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="h-full bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src={pdfPath}
              className="w-full h-full border-0"
              title="Reglamento de Aulas Virtuales para Docentes"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReglamentoPage;
