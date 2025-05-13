import React from 'react';
import img_principal_init from './assets/principal_init.png';

const Login = () => {
  return (
    // Contenedor principal con imagen de fondo ajustada a la pantalla
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${img_principal_init})`,
        backgroundSize: 'cover', // Asegura que la imagen cubra toda la pantalla
        backgroundPosition: 'center', // Centra la imagen en la pantalla
        margin: 0, // Elimina márgenes
        padding: 0, // Elimina padding
      }}
    >
      {/* Capa de superposición negra con opacidad */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Contenedor del formulario centrado */}
      <div className="relative flex justify-center items-center h-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
          {/* Icono de usuario */}
          <div className="text-blue-600 text-4xl mb-6">
            <i className="fas fa-user-circle"></i>
          </div>

          {/* Título del formulario */}
          <h2 className="text-xl text-gray-700 font-semibold mb-4">Inicio de sesión</h2>

          {/* Formulario de inicio de sesión */}
          <form>
            {/* Campo de correo */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Correo</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>

            {/* Campo de contraseña */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>

            {/* Botón de inicio de sesión */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;