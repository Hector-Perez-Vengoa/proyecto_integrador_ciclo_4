// src/pages/Login.jsx
import { useEffect, useCallback } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../logic/useAuth';
import { useLoginForm } from '../logic/useLoginForm';
import { AUTH_CONFIG } from '../constants/auth';
import { ImageCarousel } from '../components/login';
import '../assets/css/Login-new.css';

const logoUrl = 'https://academico-cloud.tecsup.edu.pe/pcc/assets/layout/images/logo-2024.svg';

const Login = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  
  const handleSuccess = useCallback((token, userData) => {
    login(token, userData);
    if (onLoginSuccess) onLoginSuccess(token, userData);
  }, [login, onLoginSuccess]);
    const {
    isLogin,
    loading,
    formData,
    formErrors,
    showPassword,
    showConfirmPassword,
    isTransitioning,
    handleChange,
    handleSubmit,
    toggleForm,
    setShowPassword,
    setShowConfirmPassword,
    handleGoogleSuccess,
    handleGoogleError
  } = useLoginForm(handleSuccess);
  useEffect(() => {
    if (localStorage.getItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY)) {
      localStorage.removeItem(AUTH_CONFIG.GOOGLE_CREDENTIAL_KEY);
    }
  }, []);

  return (
    <div className="login-container">
      {/* Elementos geométricos animados en el fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="geometric-shape-1 geometric-bg"></div>
        <div className="geometric-shape-2 geometric-bg"></div>
        <div className="geometric-shape-3 geometric-bg"></div>
        <div className="geometric-shape-4 geometric-bg"></div>
      </div>
      
      {/* Contenedor principal responsivo */}
      <div className="main-form-container">        {/* Panel izquierdo - Carrusel (oculto en móvil) */}
        <div className="carousel-panel hidden md:block">
          <ImageCarousel />
          <br />
          <div className="absolute bottom-0 left-0 p-8 text-white z-10 ">
            <p className="text-sm opacity-80">Tecsup - 2025</p>
          </div>
        </div>
        
        {/* Panel derecho - Formulario */}
        <div className="form-panel">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          
          <div className="form-container">
            {/* Logo */}
            <div className="flex justify-center mb-6 form-item">
              <img src={logoUrl} alt="Tecsup" className="h-12 filter drop-shadow-sm" />
            </div>
            
            {/* Título */}
            <div className="text-center mb-8 form-item">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-3 rounded-full"></div>
              <p className="text-gray-600 text-sm">
                {isLogin ? 'Ingresa tus credenciales para continuar' : 'Completa el formulario para crear una cuenta'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              {!isLogin && (
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="input-field">
                    <input
                      type="text"
                      name="name"
                      placeholder="Ej: Juan Pérez"
                      value={formData.name}
                      onChange={handleChange}
                      className={formErrors.name ? 'error' : ''}
                      required
                    />
                  </div>
                  {formErrors.name && (
                    <p className="error-message">{formErrors.name}</p>
                  )}
                </div>
              )}
              
              <div className="form-item">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo institucional
                </label>
                <div className="input-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="usuario@tecsup.edu.pe"
                    value={formData.email}
                    onChange={handleChange}
                    className={formErrors.email ? 'error' : ''}
                    required
                  />
                </div>
                {formErrors.email && (
                  <p className="error-message">{formErrors.email}</p>
                )}
              </div>
              
              <div className="form-item">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="input-field relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={formErrors.password ? 'error' : ''}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="error-message">{formErrors.password}</p>
                )}
              </div>

              {!isLogin && (
                <div className="form-item">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="input-field relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={formErrors.confirmPassword ? 'error' : ''}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="error-message">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              <div className="form-item">
                <button
                  type="submit"
                  disabled={loading || isTransitioning}
                  className="btn-primary"
                >
                  {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                </button>
              </div>
            </form>
            
            {/* Divisor */}
            <div className="my-6 form-item">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o continúa con</span>
                </div>
              </div>
            </div>
            
            {/* Google Login */}
            <div className="form-item google-login-container">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                width="100%"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
            
            {/* Toggle entre Login/Register */}
            <div className="mt-6 text-center form-item">
              <p className="text-sm text-gray-600">
                {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                <button
                  type="button"
                  onClick={toggleForm}
                  disabled={isTransitioning}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
