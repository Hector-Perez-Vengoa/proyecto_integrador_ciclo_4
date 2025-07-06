// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para obtener cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Función helper para realizar peticiones
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const csrfToken = getCookie('csrftoken') || localStorage.getItem('admin_csrf_token');
  
  const config = {
    credentials: 'include', // Incluir cookies de sesión
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken || '',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Si es 401 o 403, podría ser que la sesión expiró
      if (response.status === 401 || response.status === 403) {
        // Limpiar datos de autenticación
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_csrf_token');
        // Recargar la página para que vuelva al login
        window.location.reload();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Servicios para cada entidad
export const userService = {
  getAll: () => apiRequest('/usuarios/'),
  getById: (id) => apiRequest(`/usuarios/${id}/`),
  create: (data) => apiRequest('/usuarios/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/usuarios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/usuarios/${id}/`, {
    method: 'DELETE',
  }),
};

export const aulaVirtualService = {
  getAll: () => apiRequest('/aulas-virtuales/'),
  getById: (id) => apiRequest(`/aulas-virtuales/${id}/`),
  create: (data) => apiRequest('/aulas-virtuales/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/aulas-virtuales/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/aulas-virtuales/${id}/`, {
    method: 'DELETE',
  }),
};

export const departamentoService = {
  getAll: () => apiRequest('/departamentos/'),
  getById: (id) => apiRequest(`/departamentos/${id}/`),
  create: (data) => apiRequest('/departamentos/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/departamentos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/departamentos/${id}/`, {
    method: 'DELETE',
  }),
};

export const carreraService = {
  getAll: () => apiRequest('/carreras/'),
  getById: (id) => apiRequest(`/carreras/${id}/`),
  create: (data) => apiRequest('/carreras/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/carreras/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/carreras/${id}/`, {
    method: 'DELETE',
  }),
};

export const cursoService = {
  getAll: () => apiRequest('/cursos/'),
  getById: (id) => apiRequest(`/cursos/${id}/`),
  create: (data) => apiRequest('/cursos/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/cursos/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/cursos/${id}/`, {
    method: 'DELETE',
  }),
};

export const reservaService = {
  getAll: () => apiRequest('/reservas/'),
  getById: (id) => apiRequest(`/reservas/${id}/`),
  create: (data) => apiRequest('/reservas/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/reservas/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/reservas/${id}/`, {
    method: 'DELETE',
  }),
};
