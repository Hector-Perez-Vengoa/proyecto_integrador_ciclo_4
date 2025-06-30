// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para realizar peticiones
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Servicios para cada entidad
export const profesorService = {
  getAll: () => apiRequest('/profesores/'),
  getById: (id) => apiRequest(`/profesores/${id}/`),
  create: (data) => apiRequest('/profesores/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/profesores/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/profesores/${id}/`, {
    method: 'DELETE',
  }),
};

export const aulaVirtualService = {
  getAll: () => apiRequest('/aula-virtual/'),
  getById: (id) => apiRequest(`/aula-virtual/${id}/`),
  create: (data) => apiRequest('/aula-virtual/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/aula-virtual/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/aula-virtual/${id}/`, {
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
