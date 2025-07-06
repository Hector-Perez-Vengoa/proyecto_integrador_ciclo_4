// Servicio de autenticación para el admin de React
const API_BASE_URL = 'http://localhost:8000/api/auth';

class AuthService {
  constructor() {
    this.token = localStorage.getItem('admin_token');
    this.user = JSON.parse(localStorage.getItem('admin_user') || 'null');
  }

  // Obtener cookie por nombre
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Obtener token CSRF
  async getCsrfToken() {
    try {
      // Primero intentar obtener de cookie
      const cookieToken = this.getCookie('csrftoken');
      if (cookieToken) {
        return cookieToken;
      }

      // Si no está en cookie, solicitarlo al servidor
      const response = await fetch(`${API_BASE_URL}/csrf/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.csrf_token;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo CSRF token:', error);
      return null;
    }
  }

  // Login
  async login(username, password) {
    try {
      const csrfToken = await this.getCsrfToken();
      
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        localStorage.setItem('admin_csrf_token', data.csrf_token);
        
        this.user = data.user;
        this.csrfToken = data.csrf_token;
        
        return {
          success: true,
          user: data.user,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Error de autenticación',
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  }

  // Logout
  async logout() {
    try {
      const csrfToken = localStorage.getItem('admin_csrf_token');
      
      await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
      });
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      // Siempre limpiar datos locales
      this.clearLocalData();
    }
    
    return { success: true };
  }

  // Verificar autenticación
  async checkAuth() {
    try {
      // Obtener token CSRF más reciente
      const csrfToken = this.getCookie('csrftoken') || localStorage.getItem('admin_csrf_token');
      
      console.log('Verificando autenticación...');
      console.log('CSRF Token:', csrfToken);
      console.log('Cookies:', document.cookie);
      
      const response = await fetch(`${API_BASE_URL}/check/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Auth check response:', data);
        
        if (data.authenticated) {
          this.user = data.user;
          localStorage.setItem('admin_user', JSON.stringify(data.user));
          return {
            authenticated: true,
            user: data.user,
          };
        }
      } else {
        console.log('Auth check failed:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        console.log('Error data:', errorData);
      }
      
      // Si llegamos aquí, no está autenticado
      this.clearLocalData();
      return { authenticated: false };
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      this.clearLocalData();
      return { authenticated: false };
    }
  }

  // Método helper para limpiar datos locales
  clearLocalData() {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_csrf_token');
    this.user = null;
    this.csrfToken = null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.user;
  }

  // Verificar si está autenticado
  isAuthenticated() {
    return this.user !== null;
  }

  // Verificar si es superusuario
  isSuperUser() {
    return this.user?.is_superuser || false;
  }

  // Obtener headers con autenticación
  getAuthHeaders() {
    const csrfToken = this.getCookie('csrftoken') || localStorage.getItem('admin_csrf_token');
    return {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken || '',
    };
  }
}

// Exportar instancia única
const authService = new AuthService();
export default authService;
