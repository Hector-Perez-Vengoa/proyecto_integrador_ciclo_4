// src/services/api/reglamentoService.js
import axios from 'axios';
import { AUTH_CONFIG } from '../../constants/auth';

// Configurar axios instance
const api = axios.create({
  baseURL: AUTH_CONFIG.BACKEND_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token es inválido, redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const reglamentoService = {
  // Obtener todos los reglamentos con filtros y paginación
  async obtenerReglamentos(params = {}) {
    try {
      const response = await api.get('/reglamentos', { params });
      return {
        success: true,
        data: response.data.data || [],
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        currentPage: response.data.currentPage || 0,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar los reglamentos',
        data: []
      };
    }
  },

  // Obtener reglamento por ID
  async obtenerReglamentoPorId(id) {
    try {
      const response = await api.get(`/reglamentos/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar el reglamento',
        data: null
      };
    }
  },

  // Obtener reglamento activo por tipo
  async obtenerReglamentoActivo(tipo = 'general') {
    try {
      const response = await api.get('/reglamentos/activo', { 
        params: { tipo } 
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar el reglamento activo',
        data: null
      };
    }
  },

  // Crear nuevo reglamento
  async crearReglamento(reglamentoData) {
    try {
      const response = await api.post('/reglamentos', reglamentoData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Reglamento creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear el reglamento',
        data: null
      };
    }
  },

  // Actualizar reglamento
  async actualizarReglamento(id, reglamentoData) {
    try {
      const response = await api.put(`/reglamentos/${id}`, reglamentoData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Reglamento actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar el reglamento',
        data: null
      };
    }
  },

  // Eliminar reglamento
  async eliminarReglamento(id) {
    try {
      const response = await api.delete(`/reglamentos/${id}`);
      return {
        success: true,
        message: response.data.message || 'Reglamento eliminado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar el reglamento'
      };
    }
  },

  // Cambiar estado del reglamento
  async cambiarEstadoReglamento(id, estado) {
    try {
      const response = await api.patch(`/reglamentos/${id}/estado`, null, {
        params: { estado }
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Estado del reglamento cambiado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cambiar el estado del reglamento',
        data: null
      };
    }
  },

  // Incrementar visualizaciones
  async incrementarVisualizaciones(id) {
    try {
      await api.post(`/reglamentos/${id}/incrementar-visualizaciones`);
      return { success: true };
    } catch (error) {
      console.error('Error al incrementar visualizaciones:', error);
      return { success: false };
    }
  },

  // Incrementar descargas
  async incrementarDescargas(id) {
    try {
      await api.post(`/reglamentos/${id}/incrementar-descargas`);
      return { success: true };
    } catch (error) {
      console.error('Error al incrementar descargas:', error);
      return { success: false };
    }
  },

  // Obtener estadísticas
  async obtenerEstadisticas() {
    try {
      const response = await api.get('/reglamentos/estadisticas');
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener estadísticas',
        data: null
      };
    }
  },

  // Obtener URL de visualización del PDF
  getPdfViewUrl(id) {
    return `${AUTH_CONFIG.BACKEND_URL}/reglamentos/${id}/view`;
  },

  // Obtener URL de descarga del PDF
  getPdfDownloadUrl(id) {
    return `${AUTH_CONFIG.BACKEND_URL}/reglamentos/${id}/download`;
  },

  // Descargar PDF
  async descargarPdf(id, nombreArchivo) {
    try {
      const response = await api.get(`/reglamentos/${id}/download`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Crear URL del blob
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreArchivo || `reglamento_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL del blob
      window.URL.revokeObjectURL(url);

      // Incrementar contador de descargas
      await this.incrementarDescargas(id);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al descargar el PDF'
      };
    }
  }
};
