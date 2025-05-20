// filepath: c:\Users\Luis\Tecsup\Proyecto Integrador 2025\proyecto_integrador_ciclo_4\frontend\front_react_svrt\src\components\Login.jsx
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import '../css/Login.css';
import '../css/Login-fixes.css';

// Importamos nuevamente las imágenes para el carrusel
import login1 from '../assets/Login1.jpg';
import login2 from '../assets/Login2.jpg';
import login3 from '../assets/Login3.jpg';
import login4 from '../assets/Login4.jpg';
import login5 from '../assets/Login5.jpg';
import login6 from '../assets/Login6.jpg';

const logoUrl = 'https://academico-cloud.tecsup.edu.pe/pcc/assets/layout/images/logo-2024.svg';

const ImageCarousel = () => {
  const images = [login1, login2, login3, login4, login5, login6];
  const captions = [
    "Reserva tu espacio de estudio",
    "Planifica tus sesiones académicas",
    "Accede fácilmente a los cubículos",
    "Espacio ideal para tus proyectos",
    "Ambientes colaborativos de estudio",
    "Gestiona tus reservas en tiempo real"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Cambia la imagen cada 6 segundos con animación mejorada
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsAnimating(false);
      }, 600);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="carousel-container w-full h-full relative overflow-hidden rounded-l-xl">
      {/* Geometric shapes overlay */}
      <div className="geometric-shape-1 geometric-bg"></div>
      <div className="geometric-shape-2 geometric-bg"></div>
      <div className="geometric-shape-3 geometric-bg"></div>
      <div className="geometric-shape-4 geometric-bg"></div>
      
      {images.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${
            index === currentIndex 
              ? 'carousel-slide-active' 
              : 'carousel-slide-inactive'
          }`}
        >
          <img 
            src={image} 
            alt={`Imagen ${index + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Overlay con gradiente para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 z-10"></div>
      
      {/* Caption with animated entry */}
      <div className="absolute bottom-16 left-0 p-6 text-white z-20">
        <div key={currentIndex} className="carousel-caption">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{captions[currentIndex]}</h3>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mb-3"></div>
          <p className="text-sm opacity-90">Sistema de Reserva de Cubículos Tecsup</p>
        </div>
      </div>
      
      {/* Indicator dots */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-20">
        {images.map((_, index) => (
          <div 
            key={`dot-${index}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-6 bg-blue-400' 
                : 'w-1.5 bg-white/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Función para manejo de login con Google
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);

    // Verificar dominio tecsup.edu.pe
    if (!decoded.email.endsWith('@tecsup.edu.pe')) {
     
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right';
      errorToast.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Solo se permiten correos con dominio @tecsup.edu.pe
        </div>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => {
        errorToast.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(errorToast), 500);
      }, 3000);
      return;
    }

    // token backend
    const response = await axios.post('http://127.0.0.1:8000/api/auth/google/', {
      token: credentialResponse.credential
    });

  
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(decoded));

    // Mostrar mensaje de éxito 
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right';
    successToast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        ¡Bienvenido ${decoded.name}!
      </div>
    `;
    document.body.appendChild(successToast);
    setTimeout(() => {
      successToast.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(successToast), 500);
    }, 3000);

    setTimeout(() => {
      console.log('Autenticación exitosa:', decoded);
    }, 1000);
  } catch (error) {
    console.error('Error de autenticación:', error);
    alert('Error al iniciar sesión con Google');
  }
};

// Componente principal Login
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Ajustar altura del contenedor al cargar y cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      // Reset container height when window resizes
      const mainContainer = document.querySelector('.main-form-container');
      const formContainer = document.querySelector('.form-container');
      
      if (mainContainer && formContainer) {
        // Primero establecemos 'auto' para medir el tamaño natural
        mainContainer.style.height = 'auto';
        
        // Luego ajustamos a la altura exacta del contenido
        setTimeout(() => {
          const formHeight = formContainer.offsetHeight;
          if (window.innerWidth > 768) { // Solo en pantallas no móviles
            mainContainer.style.height = `${formHeight}px`;
          }
        }, 50);
      }
    };
    
    // Inicializar altura
    handleResize();
    
    // Añadir listener para resize
    window.addEventListener('resize', handleResize);
    
    // Limpiar el listener al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLogin]); // Re-ejecutar cuando cambia el estado isLogin

  // Función para cambiar entre formularios con animación
  const toggleForm = () => {
    // Reset form errors
    setFormErrors({});
    
    // Reset form data
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    
    // Create a smoother transition effect when toggling forms
    const formContainer = document.querySelector('.form-container');
    const mainContainer = document.querySelector('.main-form-container');
    
    if (formContainer && mainContainer) {
      // Measure current height before animation
      const currentHeight = formContainer.offsetHeight;
      
      // Set explicit height to allow smooth transition
      mainContainer.style.height = `${currentHeight}px`;
      
      // Fix for mobile: Check if we're on a small screen
      if (window.innerWidth <= 768) {
        // On mobile, just toggle without complex animations
        setIsLogin(!isLogin);
        
        // Add a small timeout to let React update the DOM
        setTimeout(() => {
          // After form toggle, measure new height and set it
          const newHeight = formContainer.scrollHeight;
          mainContainer.style.height = `${newHeight}px`;
          
          // Finally, reset to auto height
          setTimeout(() => {
            mainContainer.style.height = 'auto';
          }, 300);
        }, 50);
        
        return;
      }
      
      // For larger screens, use the full animation sequence
      
      // Start exit animation
      formContainer.classList.add('form-animate-out');
      
      // Fade out form items with staggered effect
      const formItems = document.querySelectorAll('.form-item');
      formItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(6px)';
        item.style.transition = `opacity 0.25s ease ${index * 0.03}s, transform 0.25s ease ${index * 0.03}s`;
      });
      
      // After exit animation completes, toggle the form and start entry animation
      setTimeout(() => {
        setIsLogin(!isLogin);
        formContainer.classList.remove('form-animate-out');
        
        // Short pause before starting entry animation
        setTimeout(() => {
          formContainer.classList.add('form-animate-in');
          
          // Measure new height and animate to it
          const newHeight = formContainer.scrollHeight + 16; // Add slight padding
          mainContainer.style.height = `${newHeight}px`;
          
          // Reset animation class after entry completes
          setTimeout(() => {
            formContainer.classList.remove('form-animate-in');
            
            // After all animations complete, reset to auto height
            setTimeout(() => {
              mainContainer.style.height = 'auto';
            }, 300);
            
            // Animate form items back in with a staggered delay
            const newFormItems = document.querySelectorAll('.form-item');
            newFormItems.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, index * 60); // Slightly faster staggering
            });
          }, 500);
        }, 50);
      }, 300);
    } else {
      // Fallback if container not found
      setIsLogin(!isLogin);
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El correo es requerido';
    } else if (!formData.email.endsWith('@tecsup.edu.pe')) {
      errors.email = 'Debe ser un correo de Tecsup (@tecsup.edu.pe)';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!isLogin) {
      if (!formData.name) {
        errors.name = 'El nombre es requerido';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }
    
    return errors;
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };
  // Función para mostrar toast de éxito
  const showSuccessToast = (message) => {
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right';
    successToast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(successToast);
    setTimeout(() => {
      successToast.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(successToast), 500);
    }, 3000);
  };
  
  // Función para mostrar toast de error
  const showErrorToast = (message) => {
    const errorToast = document.createElement('div');
    errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right';
    errorToast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        ${message}
      </div>
    `;
    document.body.appendChild(errorToast);
    setTimeout(() => {
      errorToast.classList.add('fade-out');
      setTimeout(() => document.body.removeChild(errorToast), 500);
    }, 3000);
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    try {
      let response;
      let endpoint = isLogin ? 'login' : 'register';
      
      // Preparar los datos según sea login o registro
      const requestData = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, name: formData.name };
      
      // Enviar solicitud al backend
      response = await axios.post(`http://127.0.0.1:8000/api/auth/${endpoint}/`, requestData);
      
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.data.token);
      
      // Crear objeto de usuario similar al que devuelve Google OAuth
      const userData = {
        email: response.data.user.email,
        name: response.data.user.name,
        id: response.data.user.id,
        username: response.data.user.username
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Mostrar mensaje de éxito
      showSuccessToast(`¡Bienvenido${userData.name ? ' ' + userData.name : ''}!`);
      
      // Para debug
      console.log('Autenticación exitosa:', userData);
      
    } catch (error) {
      console.error('Error de autenticación:', error);
      
      let errorMsg = 'Error al procesar la solicitud';
      
      if (error.response) {
        // El servidor respondió con un estado de error
        errorMsg = error.response.data.error || errorMsg;
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        errorMsg = 'No se pudo conectar al servidor';
      }
      
      showErrorToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar componente
  return (
    <div className="login-container flex justify-center items-center min-h-screen w-full py-8 px-4">
      {/* Elementos geométricos animados en el fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Formas geométricas animadas */}
        <div className="geometric-shape-1 geometric-bg"></div>
        <div className="geometric-shape-2 geometric-bg"></div>
        <div className="geometric-shape-3 geometric-bg"></div>
        <div className="geometric-shape-4 geometric-bg"></div>
        
        {/* Formas adicionales para pantallas grandes */}
        <div className="hidden md:block absolute bottom-[15%] left-[35%] w-20 h-20 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="hidden md:block absolute top-[45%] right-[20%] w-28 h-28 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="hidden md:block absolute bottom-[10%] right-[30%] w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse delay-300"></div>
      </div>
      
      {/* Contenedor principal con dos secciones */}
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-xl sm:shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-blue-200/50 backdrop-blur-sm">
        {/* Panel izquierdo - Carrusel de imágenes (visible solo en pantallas medianas y grandes) */}
        <div className="hidden md:block md:w-1/2 bg-gray-800 relative">
          <ImageCarousel />
          <div className="absolute bottom-0 left-0 p-3 sm:p-4 text-white z-10">
            <h3 className="text-lg sm:text-xl font-bold mb-0.5">Sistema de Reserva de Cubículos</h3>
            <p className="text-xs opacity-80">Tecsup - 2025</p>
          </div>
        </div>
        
        {/* Panel derecho - Formulario */}
        <div className="w-full md:w-1/2 bg-white relative p-4 sm:p-6 flex flex-col justify-center main-form-container transition-all duration-700 ease-in-out"
          style={{ perspective: '1000px' }}>
          <div className="form-container w-full max-w-xs mx-auto" style={{ boxShadow: 'none', background: 'transparent', border: 'none' }}>
            {/* Logo en la parte superior */}
            <div className="flex justify-center mb-3 md:mb-4 form-item">
              <img src={logoUrl} alt="Tecsup" className="h-10 md:h-12 filter drop-shadow" />
            </div>
            
            {/* Decoración del formulario */}
            <div className="text-center mb-4 form-item">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto my-1.5 rounded-full"></div>
              <p className="text-gray-500 text-xs">
                {isLogin
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Completa el formulario para crear una cuenta'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 w-full">
              {!isLogin && (
                <div className="relative form-item">
                  <label className="text-xs text-gray-600 mb-1.5 block">Nombre completo</label>
                  <div className="relative input-field">
                    <input
                      type="text"
                      name="name"
                      placeholder="Ej: Juan Pérez"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2.5 sm:p-3 px-4 border rounded-xl bg-gray-50 input-enhanced focus:bg-white focus:outline-none focus:ring focus:ring-blue-200/50 focus:border-blue-400 focus:shadow-blue-100 transition-all duration-300 ${
                        formErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <div className="bg-gray-100 rounded-full p-1">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
              )}
              
              <div className="relative form-item">
                <label className="text-xs text-gray-600 mb-1.5 block">Correo institucional</label>
                <div className="relative input-field">
                  <input
                    type="email"
                    name="email"
                    placeholder="usuario@tecsup.edu.pe"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2.5 sm:p-3 px-4 border rounded-xl bg-gray-50 input-enhanced focus:bg-white focus:outline-none focus:ring focus:ring-blue-200/50 focus:border-blue-400 focus:shadow-blue-100 transition-all duration-300 ${
                      formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <div className="bg-gray-100 rounded-full p-1">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div className="relative form-item">
                <label className="text-xs text-gray-600 mb-1.5 block">Contraseña</label>
                <div className="relative input-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-2.5 sm:p-3 px-4 border rounded-xl bg-gray-50 input-enhanced focus:bg-white focus:outline-none focus:ring focus:ring-blue-200/50 focus:border-blue-400 focus:shadow-blue-100 transition-all duration-300 ${
                      formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600 transition-all password-toggle-btn"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <div className="bg-gray-100 hover:bg-blue-50 rounded-full p-1 transition-colors">
                      {showPassword ? (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
              
              {!isLogin && (
                <div className="relative form-item">
                  <label className="text-xs text-gray-600 mb-1.5 block">Confirmar contraseña</label>
                  <div className="relative input-field">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-2.5 sm:p-3 px-4 border rounded-xl bg-gray-50 input-enhanced focus:bg-white focus:outline-none focus:ring focus:ring-blue-200/50 focus:border-blue-400 focus:shadow-blue-100 transition-all duration-300 ${
                        formErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600 transition-all password-toggle-btn"
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <div className="bg-gray-100 hover:bg-blue-50 rounded-full p-1 transition-colors">
                        {showConfirmPassword ? (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 sm:py-3 mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg button-enhanced font-medium text-sm uppercase tracking-wider transition-all form-item relative overflow-hidden ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-200/50 hover:scale-[1.01]'
                }`}
              >
                <span className="relative z-10">
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isLogin ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        )}
                      </svg>
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </span>
                  )}
                </span>
                {/* Animated gradient background */}
                {!loading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 transform -translate-x-full hover:translate-x-0 transition-transform duration-700"></span>
                )}
              </button>
            </form>
            
            <div className="mt-4 sm:mt-6 text-center form-item">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-2 sm:py-3 px-3 sm:px-4 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all">
                <span className="text-gray-600 text-sm">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                </span>
                <button
                  onClick={toggleForm}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-all hover:scale-105 px-3 py-1.5 bg-white hover:bg-blue-50 rounded-lg shadow-sm flex items-center justify-center mx-auto mt-3 border border-blue-100"
                  aria-label={isLogin ? 'Cambiar a registro' : 'Cambiar a inicio de sesión'}
                >
                  <svg className="flex-shrink-0 w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {isLogin ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    )}
                  </svg>
                  <span className="font-semibold">{isLogin ? 'Regístrate' : 'Inicia Sesión'}</span>
                </button>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 form-item">
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <div className="mx-4 px-4 py-1.5 bg-gray-50 rounded-full shadow-inner">
                  <span className="text-xs font-medium text-gray-500 uppercase">O continúa con</span>
                </div>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              <div className="flex justify-center">
                <div className="google-btn-wrapper p-2 sm:p-3 rounded-lg transition-all border border-gray-200 shadow-md hover:shadow-lg w-full flex justify-center bg-white hover:bg-blue-50 hover:border-blue-100 transform hover:scale-[1.02]">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      console.error('Error en el login');
                      alert('Error al iniciar sesión con Google');
                    }}
                    useOneTap
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="center"
                    width="100%"
                  />
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-inner form-item">
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-md">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-800 font-medium">
                    Solo se permiten correos con dominio <strong>@tecsup.edu.pe</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;