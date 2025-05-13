import img_principal_init from './assets/principal_init.png';
import React from 'react';

const Login = () => {
  return (
    
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${img_principal_init})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex justify-center items-center h-full">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
          <div className="text-blue-600 text-4xl mb-6">
            <i className="fas fa-user-circle"></i>
          </div>
          <h2 className="text-xl font-semibold mb-4">Inicio de sesión</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Correo</label>
              <input type="email" id="email" name="email" required className="w-full p-2 border border-gray-300 rounded-lg mt-1" />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Contraseña</label>
              <input type="password" id="password" name="password" required className="w-full p-2 border border-gray-300 rounded-lg mt-1" />
            </div>
            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
