import React, { useEffect, useState } from 'react';
import axios from 'axios';
import userIcon from '../assets/icons_user.png';
const Perfil = () => {
  const [user, setUser] = useState({ name: '', email: '', hasPassword: true });
  const [openMenus, setOpenMenus] = useState({ reservas: true, reglamento: false });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    
    // Limpiar errores al escribir
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };

  // Función para mostrar mensajes de éxito o error
  const showToast = (message, type = 'success') => {
    const toastElement = document.createElement('div');
    toastElement.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right`;
    toastElement.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(toastElement);
    setTimeout(() => {
      toastElement.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(toastElement), 500);
    }, 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    
    // Validación
    if (passwordForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('authToken');
      
      // Si se registró con Google, necesitamos enviar una solicitud diferente
      const credential = localStorage.getItem('googleCredential');
      
      if (credential) {
        // Para usuarios de Google nuevos
        const response = await axios.post('http://127.0.0.1:8000/api/auth/google/', {
          token: credential,
          temp_password: passwordForm.password
        });
        
        // Actualizar token en localStorage si cambia
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Eliminar credential temporal
        localStorage.removeItem('googleCredential');
      } else {
        // Para usuarios existentes que quieren configurar contraseña
        const response = await axios.put(
          'http://127.0.0.1:8000/api/auth/password/',
          {
            new_password: passwordForm.password
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      
      // Mostrar mensaje de éxito
      setFormSuccess(true);
      showToast('¡Contraseña configurada exitosamente!');
      
      // Actualizar estado del usuario
      setUser(prev => ({
        ...prev,
        hasPassword: true
      }));
      
    } catch (error) {
      console.error('Error al configurar contraseña:', error);
      let errorMsg = 'Error al configurar la contraseña';
      
      if (error.response) {
        errorMsg = error.response.data.error || errorMsg;
      }
      
      showToast(errorMsg, 'error');
    } finally {
      setFormSubmitting(false);
    }
  };

  useEffect(() => {
    // Intentar obtener datos del usuario desde localStorage
    const userData = localStorage.getItem('user');
    const googleCredential = localStorage.getItem('googleCredential');
    
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser({
          name: parsed.name || parsed.username || 'Usuario',
          email: parsed.email || '',
          // Si existe googleCredential, significa que es un usuario nuevo de Google sin contraseña
          hasPassword: !googleCredential
        });
      } catch {
        setUser({ name: 'Usuario', email: '', hasPassword: true });
      }
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra lateral retráctil */}
      <aside
        className={`
          ${sidebarOpen ? 'w-72' : 'w-16'}
          bg-white shadow-lg flex flex-col items-start py-6 px-0 border-r border-gray-200 min-h-screen
          transition-all duration-500 ease-in-out
          z-30
          `}
        style={{ position: 'relative' }}
      >
        {/* Botón hamburguesa */}
        <button
          onClick={handleSidebarToggle}
          className="absolute top-4 right-[-18px] z-40 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none"
          aria-label={sidebarOpen ? 'Contraer barra lateral' : 'Expandir barra lateral'}
          >
          <svg className={`w-6 h-6 transform transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Logo y nombre */}
        <div className={`flex items-center gap-2 px-6 mb-6 w-full transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ minHeight: 48 }}>
          <img src="https://academico-cloud.tecsup.edu.pe/pcc/assets/layout/images/logo-2024.svg" alt="Tecsup" className="h-10" />
        </div>
        {/* Usuario */}
        <div className={`flex flex-col gap-2 px-6 mb-2 w-full group relative transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}> 
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-green-600 flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-green-700 transition-all duration-200">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">{user.name}</span>
              <span className="text-xs text-gray-500 leading-tight group-hover:text-blue-500 transition-colors">{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full text-sm text-red-600 hover:text-white hover:bg-red-500 py-1.5 px-2 rounded transition-all font-semibold shadow-sm border border-red-100"
          >
            Cerrar sesión
          </button>
        </div>
        {/* Menú simulado */}
        <nav className={`flex-1 w-full mt-4 transition-all duration-500 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ul className="space-y-1 px-2">
            <li>
              <button
                className={`flex items-center justify-between w-full bg-blue-50 text-blue-700 rounded px-3 py-2 font-semibold cursor-pointer hover:bg-blue-100 transition-all group focus:outline-none`}
                onClick={() => toggleMenu('reservas')}
                aria-expanded={openMenus.reservas}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Reservas</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${openMenus.reservas ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openMenus.reservas && sidebarOpen && (
                <ul className="space-y-1 mt-1 animate-fadeIn">
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Aulas virtuales</div></li>
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Mis Reservas</div></li>
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Calendario de reservas</div></li>
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Historial de Reservas</div></li>
                </ul>
              )}
            </li>
            <li>
              <button
                className={`flex items-center justify-between w-full bg-blue-50 text-blue-700 rounded px-3 py-2 font-semibold cursor-pointer hover:bg-blue-100 transition-all group focus:outline-none`}
                onClick={() => toggleMenu('reglamento')}
                aria-expanded={openMenus.reglamento}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className={`transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Reglamento</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${openMenus.reglamento ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openMenus.reglamento && sidebarOpen && (
                <ul className="space-y-1 mt-1 animate-fadeIn">
                  <li><div className="ml-7 px-3 py-2 rounded text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all">Uso de las aulas virtuales</div></li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>
      {/* Contenido principal con animación */}
      <main className="flex-1 flex flex-col items-center justify-center animate-fadeInUp">
        <div className="bg-white rounded-xl shadow-lg p-10 min-w-[300px] max-w-xl w-full mx-4 text-center transition-all hover:shadow-blue-200/50 cursor-pointer animate-fadeInUp">
          <h1 className="text-3xl font-bold text-blue-700 mb-4 animate-pulse">¡Bienvenido, {user.name || 'Usuario'}!</h1>
          
          {/* Formulario de creación de contraseña para usuarios sin contraseña */}
          {!user.hasPassword && !formSuccess && (
            <div className="mt-6 animate-fadeIn">
              <div className="bg-blue-50 p-4 mb-6 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-700 mb-2">Configura tu contraseña</h2>
                <p className="text-sm text-blue-600 opacity-80">
                  Para poder acceder posteriormente con tu correo, necesitas crear una contraseña
                </p>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="relative">
                  <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${
                      passwordErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa una contraseña segura"
                    required
                  />
                  {passwordErrors.password && (
                    <p className="text-left text-red-500 text-xs mt-1">{passwordErrors.password}</p>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-left text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 ${
                      passwordErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirma tu contraseña"
                    required
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-left text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring focus:ring-blue-300 disabled:opacity-70"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : 'Guardar Contraseña'}
                </button>
              </form>
            </div>
          )}
          
          {/* Mensaje de éxito cuando la contraseña se ha configurado */}
          {formSuccess && (
            <div className="mt-6 animate-fadeIn bg-green-50 p-4 rounded-lg">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="text-lg font-semibold text-green-700 mb-2">¡Contraseña configurada!</h2>
              <p className="text-sm text-green-600">
                Tu contraseña ha sido configurada correctamente. Ahora puedes iniciar sesión utilizando tu correo y contraseña.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Perfil;
